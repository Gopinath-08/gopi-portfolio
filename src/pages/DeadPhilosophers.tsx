import { useRef, useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Send } from 'lucide-react';
import { apiClient } from '@/lib/api';
import { PHILOSOPHERS, PHILOSOPHER_IDS, type PhilosopherId, type Philosopher } from '@/data/philosophers';
import styles from './DeadPhilosophers.module.css';

type Message = { role: 'user' | 'assistant'; content: string; timestamp?: string };

const KRISHNA_ID: PhilosopherId = 'krishna';
const INDIAN_PHILOSOPHER_IDS: PhilosopherId[] = ['chanakya', 'shankaracharya', 'vivekananda', 'nagarjuna'];
const WESTERN_IDS: PhilosopherId[] = ['aristotle', 'socrates', 'nietzsche', 'camus'];
const ALL_PHILOSOPHER_IDS: PhilosopherId[] = [...INDIAN_PHILOSOPHER_IDS, ...WESTERN_IDS];

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function formatPhilResponse(text: string): string {
  return escapeHtml(text)
    .replace(/\*([^*]+)\*/g, '<em>$1</em>')
    .replace(/\n\n/g, '</p><p style="margin-top:12px">')
    .replace(/\n/g, '<br>');
}

const STORAGE_KEY = 'dead-philosophers-state';

const DeadPhilosophers = () => {
  const [currentPhil, setCurrentPhil] = useState<PhilosopherId | null>(null);
  const [chatHistory, setChatHistory] = useState<Record<PhilosopherId, Message[]>>({} as Record<PhilosopherId, Message[]>);
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  const scrollToBottom = () => messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });

  // Restore chat state on mount
  useEffect(() => {
    try {
      const raw = typeof window !== 'undefined' ? window.localStorage.getItem(STORAGE_KEY) : null;
      if (raw) {
        const parsed = JSON.parse(raw) as { currentPhil: PhilosopherId | null; chatHistory: Record<PhilosopherId, Message[]> };
        if (parsed && typeof parsed === 'object') {
          if (parsed.currentPhil) setCurrentPhil(parsed.currentPhil);
          if (parsed.chatHistory) setChatHistory(parsed.chatHistory);
        }
      }
    } catch {
      // ignore corrupted storage
    }
  }, []);

  // Persist chat state whenever it changes
  useEffect(() => {
    try {
      if (typeof window !== 'undefined') {
        const payload = JSON.stringify({ currentPhil, chatHistory });
        window.localStorage.setItem(STORAGE_KEY, payload);
      }
    } catch {
      // ignore storage errors
    }
  }, [currentPhil, chatHistory]);

  useEffect(() => {
    scrollToBottom();
  }, [chatHistory, currentPhil, isLoading]);

  const selectPhilosopher = (id: PhilosopherId) => {
    setCurrentPhil(id);
    setChatHistory((prev) => {
      const next = { ...prev };
      if (!next[id]) {
        next[id] = [{ role: 'assistant', content: PHILOSOPHERS[id].opening }];
      }
      return next;
    });
  };

  const handleSend = async (text?: string) => {
    const input = inputRef.current;
    const content = (text ?? input?.value?.trim()) ?? '';
    if (!content || !currentPhil || isLoading) return;

    setIsLoading(true);
    if (input) input.value = '';

    const now = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const userMsg: Message = { role: 'user', content, timestamp: now };

    const newHistory = [...(chatHistory[currentPhil] ?? []), userMsg];
    setChatHistory((prev) => ({ ...prev, [currentPhil]: newHistory }));

    const apiMessages = newHistory.map((m) => ({ role: m.role, content: m.content }));

    try {
      const systemPrompt =
        PHILOSOPHERS[currentPhil].system +
        `\n\nIMPORTANT — Conversation, context & language:
- The person is likely Indian, asking about modern problems (startups, NEET, IIT, career, relationships, pressure, etc.). Apply your wisdom to their specific situation, not in abstract.
- Always treat this as an ongoing 1:1 conversation. Carefully read ALL previous messages in this chat and respond in a way that directly addresses the latest user message **and** any relevant context before it. Never ignore what they said just before.
- Speak like you are actually talking to them in real time — use a warm, direct, second‑person voice (“you”, “I”), occasional questions, and natural rhythm. This should feel like a **conversation**, not an essay or blog post.
- Give a THOROUGH, SATISFYING answer. Aim for 4–6 paragraphs (or more if the question needs it). The user should feel heard, understood, and genuinely helped.
- Always include: (1) brief empathy or acknowledgment of their situation, (2) your philosophical take, (3) 2–4 CONCRETE, ACTIONABLE steps they can take next. End with a clear takeaway or one-line mantra they can remember that sounds like something **you** would say.
- Language: reply primarily in the same language or mix (English / Hindi / Hinglish) as the user's latest message, unless they explicitly ask for a different language.
- Be wise and occasionally witty, but never dismissive. Leave them feeling that the answer was worth the ask and that they just had a real conversation with you.`;
      const { text: responseText } = await apiClient.philosopherChat(currentPhil, apiMessages, systemPrompt);
      const ts = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      const assistantMsg: Message = { role: 'assistant', content: responseText, timestamp: ts };
      setChatHistory((prev) => ({
        ...prev,
        [currentPhil]: [...(prev[currentPhil] ?? []), assistantMsg],
      }));
    } catch {
      const errMsg = `*The connection was interrupted.*\n\nI apologize — something went wrong on the way. Please try again.`;
      const assistantMsg: Message = { role: 'assistant', content: errMsg, timestamp: '—' };
      setChatHistory((prev) => ({
        ...prev,
        [currentPhil]: [...(prev[currentPhil] ?? []), assistantMsg],
      }));
    } finally {
      setIsLoading(false);
      input?.focus();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const phil = currentPhil ? PHILOSOPHERS[currentPhil] : null;
  const messages = currentPhil ? (chatHistory[currentPhil] ?? []) : [];
  const hasUserSent = messages.some((m) => m.role === 'user');
  const suggestions = phil ? phil.suggestions.slice(0, 3) : [];
  const [inputLen, setInputLen] = useState(0);

  return (
    <div className={styles.wrapper}>
      <Link to="/play" className={styles.backLink}>
        <ArrowLeft size={16} />
        Back to Play
      </Link>

      <div className={styles.grid}>
        <aside className={styles.sidebar}>
          <div className={styles.sidebarLabel}>Krishna</div>
          <PhilosopherCard
            philosopher={PHILOSOPHERS[KRISHNA_ID]}
            isActive={currentPhil === KRISHNA_ID}
            onSelect={() => selectPhilosopher(KRISHNA_ID)}
          />
          <div className={styles.sidebarDivider} />
          <div className={styles.sidebarLabel}>Indian Philosophers</div>
          {INDIAN_PHILOSOPHER_IDS.map((id) => (
            <PhilosopherCard
              key={id}
              philosopher={PHILOSOPHERS[id]}
              isActive={currentPhil === id}
              onSelect={() => selectPhilosopher(id)}
            />
          ))}
          <div className={styles.sidebarDivider} />
          <div className={styles.sidebarLabel}>Greek & Western</div>
          {WESTERN_IDS.map((id) => (
            <PhilosopherCard
              key={id}
              philosopher={PHILOSOPHERS[id]}
              isActive={currentPhil === id}
              onSelect={() => selectPhilosopher(id)}
            />
          ))}
        </aside>

        <div className={styles.chatArea}>
          {phil && (
            <div className={styles.philHeader}>
              <div className={styles.philAvatar}>{phil.emoji}</div>
              <div className={styles.philHeaderInfo}>
                <div className={styles.philHeaderName}>{phil.name} · {phil.devanagari}</div>
                <div className={styles.philHeaderTagline}>{phil.tagline}</div>
                <div className={styles.philStatus}>
                  <span className={styles.statusDot} />
                  Here to guide
                </div>
              </div>
              <button
                type="button"
                className={styles.changePhilBtn}
                onClick={() => setCurrentPhil(null)}
                aria-label="Change philosopher"
              >
                Change
              </button>
            </div>
          )}

          {!currentPhil && (
            <div className={styles.welcomeScreen}>
              <h2 className={styles.welcomeH2}>Chat with Krishna or a Philosopher</h2>
              <p className={styles.welcomeP}>
                Talk to Krishna (from the Bhagavad Gita) or to philosophers. Pick one below to start.
              </p>
              <div className={styles.welcomeKrishnaWrap}>
                <PhilosopherCard
                  philosopher={PHILOSOPHERS[KRISHNA_ID]}
                  isActive={false}
                  onSelect={() => selectPhilosopher(KRISHNA_ID)}
                />
              </div>
              <div className={styles.welcomeSectionLabel}>Philosophers</div>
              <div className={styles.welcomeGrid}>
                {ALL_PHILOSOPHER_IDS.map((id) => (
                  <PhilosopherCard
                    key={id}
                    philosopher={PHILOSOPHERS[id]}
                    isActive={false}
                    onSelect={() => selectPhilosopher(id)}
                  />
                ))}
              </div>
              <div className={styles.welcomeInstruction}>You can also choose from the list on the left (desktop)</div>
            </div>
          )}

          {currentPhil && (
            <>
              <div className={styles.messages}>
                {messages.map((msg, i) =>
                  msg.role === 'user' ? (
                    <div key={i} className={styles.msgUser}>
                      <div className={styles.msgUserBubble}>{escapeHtml(msg.content)}</div>
                      {msg.timestamp && <div className={styles.msgUserTs}>{msg.timestamp}</div>}
                    </div>
                  ) : (
                    <div key={i} className={styles.msgPhil}>
                      <div className={styles.msgPhilAvatar}>{phil!.emoji}</div>
                      <div>
                        <div className={styles.philNameLabel}>{phil!.name.toUpperCase()}</div>
                        <div
                          className={styles.msgPhilBubble}
                          dangerouslySetInnerHTML={{
                            __html: `<p>${formatPhilResponse(msg.content)}</p>`,
                          }}
                        />
                        {msg.timestamp && <div className={styles.msgPhilTs}>{msg.timestamp}</div>}
                      </div>
                    </div>
                  )
                )}
                {isLoading && (
                  <div className={styles.msgPhil}>
                    <div className={styles.msgPhilAvatar}>{phil.emoji}</div>
                    <div>
                      <div className={styles.philNameLabel}>{phil.name.toUpperCase()}</div>
                      <div className={styles.msgPhilBubble}>
                        <div className={styles.typingBubble}>
                          <span className={styles.typingDot} />
                          <span className={styles.typingDot} />
                          <span className={styles.typingDot} />
                        </div>
                      </div>
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>

              {!hasUserSent && suggestions.length > 0 && (
                <div className={styles.suggestions}>
                  {suggestions.map((s, i) => (
                    <button
                      key={i}
                      type="button"
                      className={styles.suggestionChip}
                      onClick={() => handleSend(s)}
                    >
                      "{s}"
                    </button>
                  ))}
                </div>
              )}

              <div className={styles.inputBar}>
                <div className={styles.inputWrap}>
                  <textarea
                    ref={inputRef}
                    placeholder={`Ask ${phil.name} anything...`}
                    rows={1}
                    maxLength={500}
                    onKeyDown={handleKeyDown}
                    onChange={(e) => setInputLen(e.target.value.length)}
                    disabled={isLoading}
                  />
                  <span className={styles.charCount}>{inputLen}/500</span>
                </div>
                <button
                  type="button"
                  className={styles.sendBtn}
                  onClick={() => handleSend()}
                  disabled={isLoading}
                  aria-label="Send"
                >
                  <Send size={20} strokeWidth={2} />
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

function PhilosopherCard({
  philosopher,
  isActive,
  onSelect,
}: {
  philosopher: Philosopher;
  isActive: boolean;
  onSelect: () => void;
}) {
  return (
    <button
      type="button"
      className={`${styles.philosopherCard} ${isActive ? styles.philosopherCardActive : ''}`}
      onClick={onSelect}
    >
      <span className={styles.philCardEmoji}>{philosopher.emoji}</span>
      <div className={styles.philCardText}>
        <div className={styles.philName}>{philosopher.name}</div>
        <div className={styles.philDevanagari}>{philosopher.devanagari}</div>
        <div className={styles.philDates}>{philosopher.dates}</div>
        <span className={styles.philTag}>{philosopher.tag}</span>
      </div>
    </button>
  );
}

export default DeadPhilosophers;
