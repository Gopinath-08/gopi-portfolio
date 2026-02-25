export class GameLoop {
  constructor(updateCallback, renderCallback) {
    this.updateCallback = updateCallback;
    this.renderCallback = renderCallback;
    this.isRunning = false;
    this.animationId = null;
    this.lastTime = performance.now();
  }

  start() {
    if (this.isRunning) return;
    this.isRunning = true;
    this.lastTime = performance.now();
    this.loop();
  }

  stop() {
    this.isRunning = false;
    if (this.animationId !== null) {
      cancelAnimationFrame(this.animationId);
      this.animationId = null;
    }
  }

  loop() {
    if (!this.isRunning) return;

    const currentTime = performance.now();
    const deltaTime = currentTime - this.lastTime;
    this.lastTime = currentTime;

    // Cap deltaTime to prevent large jumps
    const clampedDelta = Math.min(deltaTime, 100);

    // Update game logic
    if (this.updateCallback) {
      this.updateCallback(clampedDelta);
    }

    // Render
    if (this.renderCallback) {
      this.renderCallback();
    }

    this.animationId = requestAnimationFrame(() => this.loop());
  }
}

