<<<<<<< HEAD
export class HUD {
  constructor(container) {
    this.container = container;
    this.hudElement = null;
    this.createHUD();
  }

  createHUD() {
    const existing = document.getElementById('game-hud');
    if (existing) {
      existing.remove();
    }
    
    this.hudElement = document.createElement('div');
    this.hudElement.id = 'game-hud';
    this.hudElement.innerHTML = `
      <div class="hud-container-new">
        <!-- Top Bar for Score, Streak, High Score -->
        <div class="hud-top-bar">
          <div class="hud-item glass-panel" style="padding: 10px 18px;">
            <div class="hud-small-label">BEST</div>
            <div class="hud-value-large" id="high-score-val">000000</div>
          </div>
          
          <div class="hud-center-score">
            <div class="hud-small-label" style="text-shadow: 0 0 10px rgba(0,0,0,0.5);">SCORE</div>
            <div class="hud-value-huge" id="score-val">0</div>
            
            <!-- Multiplier combo -->
            <div class="streak-badge" id="streak-badge">
              <span id="streak-multiplier">x0</span> STREAK
              <div class="streak-decay-bar">
                <div class="streak-decay-fill" id="streak-decay-fill"></div>
              </div>
            </div>
          </div>
          
          <div class="hud-item empty-header" style="width: 110px;"></div>
        </div>

        <!-- Center Crosshair Reticle -->
        <div class="hud-reticle">
          <div class="reticle-circle-outer"></div>
          <div class="reticle-circle-inner"></div>
          <div class="reticle-dot"></div>
        </div>

        <!-- Cloud Mist screen-covering overlay -->
        <div class="cloud-mist-overlay" id="cloud-mist-overlay"></div>

        <!-- Bottom Indicators -->
        <div class="hud-bottom-bar">
          <!-- Speed & Altitude -->
          <div class="hud-bottom-left glass-panel">
            <div class="stats-grid">
              <div class="stat-box">
                <div class="hud-small-label">SPEED</div>
                <div>
                  <span class="stat-number" id="speed-val">0</span>
                  <span class="stat-unit">km/h</span>
                </div>
              </div>
              <div class="stat-box border-l">
                <div class="hud-small-label">ALTITUDE</div>
                <div>
                  <span class="stat-number" id="altitude-val">0</span>
                  <span class="stat-unit">m</span>
                </div>
              </div>
            </div>
          </div>

          <!-- Boost Ring/Bar -->
          <div class="hud-bottom-right glass-panel">
            <div class="hud-small-label">BOOST CAPACITY</div>
            <div class="boost-gauge-container">
              <div class="boost-bar-bg">
                <div class="boost-bar-fill-new" id="boost-bar-fill-new"></div>
              </div>
              <div class="boost-percentage" id="boost-percentage">100%</div>
            </div>
            <div class="boost-status-label" id="boost-status-label">READY</div>
          </div>
        </div>
      </div>
    `;
    
    // Add premium styles
    const style = document.createElement('style');
    style.id = 'game-hud-styles';
    style.textContent = `
      #game-hud {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        pointer-events: none;
        font-family: 'Outfit', 'Inter', -apple-system, sans-serif;
        z-index: 9999 !important;
        color: #ffffff;
      }
      
      .hud-container-new {
        position: absolute;
        inset: 0;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        padding: 30px 40px;
        box-sizing: border-box;
      }
      
      /* Glassmorphic panel base styling */
      .glass-panel {
        background: rgba(8, 20, 36, 0.45);
        border: 1px solid rgba(6, 182, 212, 0.25);
        box-shadow: 0 8px 32px 0 rgba(0, 0, 0, 0.42);
        backdrop-filter: blur(12px);
        -webkit-backdrop-filter: blur(12px);
        border-radius: 12px;
        padding: 16px 24px;
        pointer-events: auto;
      }
      
      .hud-top-bar {
        display: flex;
        justify-content: space-between;
        align-items: flex-start;
        width: 100%;
      }
      
      .hud-small-label {
        font-size: 10px;
        font-weight: 700;
        letter-spacing: 2px;
        color: rgba(6, 182, 212, 0.95);
        text-transform: uppercase;
        margin-bottom: 4px;
        font-family: 'Inter', sans-serif;
      }
      
      .hud-value-large {
        font-family: 'Courier New', monospace;
        font-size: 22px;
        font-weight: 700;
        color: #e2e8f0;
        letter-spacing: 1px;
      }
      
      .hud-center-score {
        display: flex;
        flex-direction: column;
        align-items: center;
        text-align: center;
      }
      
      .hud-value-huge {
        font-family: 'Courier New', monospace;
        font-size: 52px;
        font-weight: 800;
        color: #ffffff;
        text-shadow: 0 0 15px rgba(6, 182, 212, 0.85), 0 0 30px rgba(6, 182, 212, 0.4);
        margin: -5px 0 5px 0;
        letter-spacing: 2px;
        transition: transform 0.05s ease-out;
      }
      
      .streak-badge {
        display: flex;
        flex-direction: column;
        align-items: center;
        background: linear-gradient(135deg, rgba(234, 179, 8, 0.22) 0%, rgba(249, 115, 22, 0.22) 100%);
        border: 1px solid rgba(234, 179, 8, 0.45);
        border-radius: 12px;
        padding: 6px 16px;
        font-size: 11px;
        font-weight: 700;
        letter-spacing: 1px;
        color: #fbbf24;
        box-shadow: 0 0 15px rgba(234, 179, 8, 0.2);
        opacity: 0;
        transform: scale(0.8);
        transition: opacity 0.3s ease, transform 0.3s ease;
      }
      
      .streak-badge.active {
        opacity: 1;
        transform: scale(1);
      }
      
      .streak-decay-bar {
        width: 70px;
        height: 3px;
        background: rgba(255, 255, 255, 0.15);
        border-radius: 2px;
        margin-top: 6px;
        overflow: hidden;
      }
      
      .streak-decay-fill {
        height: 100%;
        background: #f59e0b;
        width: 100%;
      }
      
      /* Reticle styling */
      .hud-reticle {
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        width: 60px;
        height: 60px;
        display: flex;
        align-items: center;
        justify-content: center;
        opacity: 0.55;
        transition: opacity 0.2s ease;
      }
      
      .reticle-circle-outer {
        position: absolute;
        width: 44px;
        height: 44px;
        border: 1px dashed rgba(6, 182, 212, 0.7);
        border-radius: 50%;
        animation: spin-clockwise 25s linear infinite;
      }
      
      .reticle-circle-inner {
        position: absolute;
        width: 24px;
        height: 24px;
        border: 1.5px solid rgba(6, 182, 212, 0.5);
        border-left-color: transparent;
        border-right-color: transparent;
        border-radius: 50%;
        animation: spin-counter-clockwise 8s linear infinite;
      }
      
      .reticle-dot {
        width: 4px;
        height: 4px;
        background: #00ffff;
        border-radius: 50%;
        box-shadow: 0 0 6px #00ffff;
      }
      
      @keyframes spin-clockwise {
        from { transform: rotate(0deg); }
        to { transform: rotate(360deg); }
      }
      @keyframes spin-counter-clockwise {
        from { transform: rotate(360deg); }
        to { transform: rotate(0deg); }
      }
      
      /* Cloud Mist Overlay styling */
      .cloud-mist-overlay {
        position: absolute;
        inset: 0;
        background: radial-gradient(circle, rgba(255,255,255,0.7) 0%, rgba(240,248,255,0.3) 60%, rgba(255,255,255,0) 100%);
        opacity: 0;
        pointer-events: none;
        transition: opacity 0.5s ease-out;
        z-index: 1;
      }
      
      /* Bottom panels */
      .hud-bottom-bar {
        display: flex;
        justify-content: space-between;
        align-items: flex-end;
        width: 100%;
        z-index: 10;
      }
      
      .hud-bottom-left {
        min-width: 230px;
      }
      
      .stats-grid {
        display: flex;
        gap: 15px;
      }
      
      .stat-box {
        flex: 1;
        display: flex;
        flex-direction: column;
      }
      
      .border-l {
        border-left: 1px solid rgba(6, 182, 212, 0.25);
        padding-left: 15px;
      }
      
      .stat-number {
        font-family: 'Courier New', monospace;
        font-size: 28px;
        font-weight: 700;
        color: #ffffff;
      }
      
      .stat-unit {
        font-size: 11px;
        color: rgba(255, 255, 255, 0.45);
        margin-left: 2px;
      }
      
      /* Boost Gauge */
      .hud-bottom-right {
        min-width: 230px;
        display: flex;
        flex-direction: column;
      }
      
      .boost-gauge-container {
        display: flex;
        align-items: center;
        gap: 12px;
        margin-top: 5px;
      }
      
      .boost-bar-bg {
        flex: 1;
        height: 10px;
        background: rgba(255, 255, 255, 0.1);
        border-radius: 5px;
        overflow: hidden;
      }
      
      .boost-bar-fill-new {
        height: 100%;
        background: linear-gradient(90deg, #06b6d4, #14b8a6);
        width: 100%;
        transition: width 0.1s ease-out;
        box-shadow: 0 0 10px rgba(6, 182, 212, 0.5);
      }
      
      .boost-bar-fill-new.active {
        background: linear-gradient(90deg, #00ffff, #00d9f5);
        animation: pulse-boost 0.6s infinite alternate;
      }
      
      @keyframes pulse-boost {
        0% { opacity: 0.85; box-shadow: 0 0 8px rgba(0, 255, 255, 0.5); }
        100% { opacity: 1; box-shadow: 0 0 16px rgba(0, 255, 255, 0.9); }
      }
      
      .boost-percentage {
        font-family: 'Courier New', monospace;
        font-size: 13px;
        font-weight: 700;
        width: 38px;
        text-align: right;
      }
      
      .boost-status-label {
        font-size: 10px;
        font-weight: 700;
        letter-spacing: 1px;
        color: #10b981;
        margin-top: 4px;
        text-align: left;
      }
    `;
    
    // Check if style already exists
    const oldStyle = document.getElementById('game-hud-styles');
    if (oldStyle) oldStyle.remove();
    document.head.appendChild(style);
    
    document.body.appendChild(this.hudElement);
    this.hudElement.style.display = 'none';
  }

  update(speed, altitude, boostActive, stats = {}) {
    if (!this.hudElement) return;
    
    const speedEl = this.hudElement.querySelector('#speed-val');
    const altitudeEl = this.hudElement.querySelector('#altitude-val');
    const boostFill = this.hudElement.querySelector('#boost-bar-fill-new');
    const boostPercentage = this.hudElement.querySelector('#boost-percentage');
    const boostStatus = this.hudElement.querySelector('#boost-status-label');
    
    const scoreEl = this.hudElement.querySelector('#score-val');
    const highScoreEl = this.hudElement.querySelector('#high-score-val');
    const streakBadge = this.hudElement.querySelector('#streak-badge');
    const streakMultiplier = this.hudElement.querySelector('#streak-multiplier');
    const streakDecayFill = this.hudElement.querySelector('#streak-decay-fill');
    
    const mistOverlay = this.hudElement.querySelector('#cloud-mist-overlay');
    
    // 1. Update standard telemetry
    if (speedEl) {
      // Speed multiplier for aesthetic scale display (e.g. max is ~280 km/h)
      const speedKmh = Math.round(speed * 180);
      speedEl.textContent = speedKmh.toString();
    }
    
    if (altitudeEl) {
      // Scale altitude for display
      altitudeEl.textContent = Math.round(altitude).toString();
    }
    
    // 2. Update boost bar
    const energy = stats.boostEnergy !== undefined ? stats.boostEnergy : 100;
    if (boostFill) {
      boostFill.style.width = `${energy}%`;
      if (boostActive) {
        boostFill.classList.add('active');
      } else {
        boostFill.classList.remove('active');
      }
    }
    
    if (boostPercentage) {
      boostPercentage.textContent = `${Math.round(energy)}%`;
    }
    
    if (boostStatus) {
      if (boostActive) {
        boostStatus.textContent = 'BURNING';
        boostStatus.style.color = '#38bdf8';
      } else if (energy < 15) {
        boostStatus.textContent = 'LOW ENERGY';
        boostStatus.style.color = '#ef4444';
      } else if (energy >= 100) {
        boostStatus.textContent = 'READY';
        boostStatus.style.color = '#10b981';
      } else {
        boostStatus.textContent = 'RECHARGING';
        boostStatus.style.color = '#fbbf24';
      }
    }
    
    // 3. Update Scoring and Multipliers
    if (scoreEl && stats.score !== undefined) {
      // Visual feedback: brief scale pop when score changes
      const currentScore = parseInt(scoreEl.textContent, 10) || 0;
      if (stats.score !== currentScore) {
        scoreEl.textContent = stats.score.toString();
        scoreEl.style.transform = 'scale(1.1)';
        setTimeout(() => {
          scoreEl.style.transform = 'scale(1)';
        }, 80);
      }
    }
    
    if (highScoreEl && stats.highScore !== undefined) {
      highScoreEl.textContent = stats.highScore.toString().padStart(6, '0');
    }
    
    // 4. Update Streak multiplier combo badge
    if (streakBadge && streakMultiplier && streakDecayFill && stats.streak !== undefined) {
      if (stats.streak > 0) {
        streakBadge.classList.add('active');
        streakMultiplier.textContent = `x${stats.streak}`;
        
        // Decay timer bar calculation (expires in 8.0s)
        const decayTimer = stats.streakTimer !== undefined ? stats.streakTimer : 0;
        const decayPercentage = Math.max(0, (8.0 - decayTimer) / 8.0 * 100);
        streakDecayFill.style.width = `${decayPercentage}%`;
      } else {
        streakBadge.classList.remove('active');
      }
    }
    
    // 5. Cloud mist screen overlay
    if (mistOverlay && stats.overlapCloud !== undefined) {
      if (stats.overlapCloud) {
        mistOverlay.style.opacity = '0.9';
      } else {
        mistOverlay.style.opacity = '0';
      }
    }
  }

  show() {
    if (this.hudElement) {
      this.hudElement.style.display = 'block';
    }
  }

  hide() {
    if (this.hudElement) {
      this.hudElement.style.display = 'none';
    }
  }

  remove() {
    if (this.hudElement) {
      this.hudElement.remove();
    }
    const styles = document.getElementById('game-hud-styles');
    if (styles) styles.remove();
  }
}
=======
export class HUD {
  constructor(container) {
    this.container = container;
    this.hudElement = null;
    this.createHUD();
  }

  createHUD() {
    // Remove existing HUD if present
    const existing = document.getElementById('game-hud');
    if (existing) {
      existing.remove();
    }
    
    this.hudElement = document.createElement('div');
    this.hudElement.id = 'game-hud';
    this.hudElement.innerHTML = `
      <div class="hud-container">
        <div class="hud-section speed">
          <div class="hud-label">SPEED</div>
          <div class="hud-value" id="speed-value">0</div>
          <div class="hud-unit">km/h</div>
        </div>
        <div class="hud-section altitude">
          <div class="hud-label">ALTITUDE</div>
          <div class="hud-value" id="altitude-value">0</div>
          <div class="hud-unit">m</div>
        </div>
        <div class="hud-section boost" id="boost-indicator">
          <div class="hud-label">BOOST</div>
          <div class="boost-bar">
            <div class="boost-fill" id="boost-fill"></div>
          </div>
        </div>
        <div class="hud-section controls">
          <div class="hud-label">CONTROLS</div>
          <div class="controls-list">
            <div>W/↑ - Forward</div>
            <div>S/↓ - Backward</div>
            <div>A/← - Left</div>
            <div>D/→ - Right</div>
            <div>Q/E - Yaw</div>
            <div>Shift - Boost</div>
            <div>Space - Shoot</div>
          </div>
        </div>
      </div>
    `;
    
    // Add styles
    const style = document.createElement('style');
    style.textContent = `
      #game-hud {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        pointer-events: none;
        font-family: 'Courier New', monospace;
        z-index: 10000 !important;
      }
      .hud-container {
        display: flex;
        flex-direction: column;
        gap: 20px;
        padding: 20px;
        max-width: 300px;
      }
      .hud-section {
        background: rgba(0, 0, 0, 0.7);
        border: 2px solid rgba(0, 255, 255, 0.5);
        border-radius: 8px;
        padding: 15px;
        color: #00ffff;
        backdrop-filter: blur(10px);
      }
      .hud-label {
        font-size: 12px;
        text-transform: uppercase;
        letter-spacing: 2px;
        margin-bottom: 8px;
        opacity: 0.8;
      }
      .hud-value {
        font-size: 32px;
        font-weight: bold;
        color: #00ffff;
        text-shadow: 0 0 10px rgba(0, 255, 255, 0.5);
      }
      .hud-unit {
        font-size: 14px;
        opacity: 0.6;
        margin-top: 4px;
      }
      .boost-bar {
        width: 100%;
        height: 20px;
        background: rgba(255, 255, 255, 0.1);
        border-radius: 4px;
        overflow: hidden;
        margin-top: 8px;
      }
      .boost-fill {
        height: 100%;
        background: linear-gradient(90deg, #00ffff, #0080ff);
        width: 0%;
        transition: width 0.1s ease;
        box-shadow: 0 0 10px rgba(0, 255, 255, 0.5);
      }
      .boost.active .boost-fill {
        width: 100%;
        animation: pulse 0.5s infinite;
      }
      @keyframes pulse {
        0%, 100% { opacity: 1; }
        50% { opacity: 0.7; }
      }
      .controls-list {
        font-size: 11px;
        line-height: 1.8;
        opacity: 0.7;
      }
      .controls-list div {
        margin: 2px 0;
      }
    `;
    // Check if style already exists
    if (!document.getElementById('game-hud-styles')) {
      style.id = 'game-hud-styles';
      document.head.appendChild(style);
    }
    
    // Append to body instead of container to ensure it's on top
    document.body.appendChild(this.hudElement);
    
    // Initially hide HUD (will show when game starts)
    this.hudElement.style.display = 'none';
    
    console.log('[HUD] HUD created and added to DOM');
  }

  update(speed, altitude, boostActive) {
    if (!this.hudElement) return;
    
    const speedValue = this.hudElement.querySelector('#speed-value');
    const altitudeValue = this.hudElement.querySelector('#altitude-value');
    const boostIndicator = this.hudElement.querySelector('#boost-indicator');
    const boostFill = this.hudElement.querySelector('#boost-fill');
    
    if (speedValue) {
      // Convert speed to km/h (realistic scale)
      const speedKmh = Math.round(speed * 150); // Scale factor for realistic speed display
      speedValue.textContent = Math.min(speedKmh, 300); // Cap at 300 km/h
    }
    
    if (altitudeValue) {
      altitudeValue.textContent = Math.round(altitude);
    }
    
    if (boostIndicator && boostFill) {
      if (boostActive) {
        boostIndicator.classList.add('active');
        boostFill.style.width = '100%';
      } else {
        boostIndicator.classList.remove('active');
        boostFill.style.width = '0%';
      }
    }
  }

  show() {
    if (this.hudElement) {
      this.hudElement.style.display = 'block';
    }
  }

  hide() {
    if (this.hudElement) {
      this.hudElement.style.display = 'none';
    }
  }

  remove() {
    if (this.hudElement) {
      this.hudElement.remove();
    }
  }
}

>>>>>>> 91789f59d7bf73768e9cdb48b6a41f9a6c3f3de1
