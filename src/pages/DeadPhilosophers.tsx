import { useRef, useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Send } from 'lucide-react';
import { apiClient } from '@/lib/api';
import { PHILOSOPHERS, PHILOSOPHER_IDS, type PhilosopherId, type Philosopher } from '@/data/philosophers';
import styles from './DeadPhilosophers.module.css';

type Message = { role: 'user' | 'assistant'; content: string; timestamp?: string };

const INDIAN_IDS: PhilosopherId[] = ['chanakya', 'shankaracharya', 'vivekananda', 'nagarjuna'];
const WESTERN_IDS: PhilosopherId[] = ['aristotle', 'socrates', 'nietzsche', 'camus'];

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

const DeadPhilosophers = () => {
  const [currentPhil, setCurrentPhil] = useState<PhilosopherId | null>(null);
  const [chatHistory, setChatHistory] = useState<Record<PhilosopherId, Message[]>>({} as Record<PhilosopherId, Message[]>);
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  const scrollToBottom = () => messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });

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
        `\n\nIMPORTANT — Response quality & voice:
- The person is likely Indian, asking about modern problems (startups, NEET, IIT, career, relationships, pressure, etc.). Apply your wisdom to their specific situation, not in abstract.
- Speak like you are actually talking to them in real time — use a warm, direct, second‑person voice (“you”, “I”), occasional questions, and natural rhythm. This should feel like a **conversation**, not an essay or blog post.
- Give a THOROUGH, SATISFYING answer. Aim for 4–6 paragraphs (or more if the question needs it). The user should feel heard, understood, and genuinely helped.
- Always include: (1) brief empathy or acknowledgment of their situation, (2) your philosophical take, (3) 2–4 CONCRETE, ACTIONABLE steps they can take next. End with a clear takeaway or one-line mantra they can remember that sounds like something **you** would say.
- Be wise and occasionally witty, but never dismissive. Leave them feeling that the answer was worth the ask and that they just had a real conversation with you.`;
      const { text: responseText } = await apiClient.philosopherChat(currentPhil, apiMessages, systemPrompt);
      const ts = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      const assistantMsg: Message = { role: 'assistant', content: responseText, timestamp: ts };
      setChatHistory((prev) => ({
        ...prev,
        [currentPhil]: [...(prev[currentPhil] ?? []), assistantMsg],
      }));
    } catch {
      const errMsg = `*The summoning was interrupted by a disturbance in the ether.*\n\nI apologize — it seems the connection to the beyond was disrupted. Please try again.`;
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
        <header className={styles.topbar}>
          <div>
            <h1 className={styles.topbarTitle}>DEAD PHILOSOPHERS</h1>
            <div className={styles.topbarSub}>Ancient Wisdom · Modern Problems</div>
          </div>
          <span className={styles.topOrnament}>꩜</span>
          <div className={styles.topRight}>
            मृत दार्शनिकों से मिलें
            <br />
            <span style={{ fontSize: '9px', letterSpacing: '1px' }}>powered by claude</span>
          </div>
        </header>

        <aside className={styles.sidebar}>
          <div className={styles.sidebarLabel}>Choose Your Philosopher</div>
          {INDIAN_IDS.map((id) => (
            <PhilosopherCard
              key={id}
              philosopher={PHILOSOPHERS[id]}
              isActive={currentPhil === id}
              onSelect={() => selectPhilosopher(id)}
            />
          ))}
          <div className={styles.sidebarDivider} />
          <div className={styles.sidebarLabel} style={{ paddingTop: 10 }}>Greek & Western</div>
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
                  Summoned from beyond
                </div>
              </div>
            </div>
          )}

          {!currentPhil && (
            <div className={styles.welcomeScreen}>
              <div className={styles.welcomeOmWrap}>
                <div className={styles.welcomeOm}>ॐ</div>
              </div>
              <div className={styles.dividerOrnament}>⋯ ❧ ⋯</div>
              <h2 className={styles.welcomeH2}>Summon a Philosopher</h2>
              <p className={styles.welcomeP}>
                Tell Chanakya about your situationship. Ask Shankaracharya about your NEET score. Have Aristotle review your LinkedIn. Ancient wisdom meets completely mundane modern problems.
              </p>
              <div className={styles.welcomeInstruction}>← Select a philosopher to begin</div>
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
