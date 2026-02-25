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

