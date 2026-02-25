import { Scene } from './core/Scene.js';
import { Camera } from './core/Camera.js';
import { Renderer } from './core/Renderer.js';
import { GameLoop } from './core/GameLoop.js';
import { Plane } from './entities/Plane.js';
import { FlightPhysics } from './physics/FlightPhysics.js';
import { Controls } from './input/Controls.js';
import { HUD } from './ui/HUD.js';

export class PlaneGame {
  constructor(container) {
    this.container = container;
    
    // Initialize core systems
    this.scene = new Scene();
    this.camera = new Camera(container);
    this.renderer = new Renderer(container);
    this.controls = new Controls();
    this.physics = new FlightPhysics();
    // Create HUD - pass document.body to ensure it's on top
    this.hud = new HUD(document.body);
    
    // Initialize plane
    this.plane = new Plane(this.scene.getScene());
    
    // Game loop
    this.gameLoop = new GameLoop(
      (deltaTime) => this.update(deltaTime),
      () => this.render()
    );
    
    // Handle resize
    window.addEventListener('resize', () => this.handleResize());
    
    // Start game loop
    this.gameLoop.start();
  }

  update(deltaTime) {
    // Update controls
    this.controls.updateInput();
    
    // Wait for plane to load
    if (!this.plane.isLoaded()) {
      // Still update camera to initial position
      this.camera.update(this.plane.getPosition(), this.plane.getRotation());
      // Update scene with initial plane position for runway
      this.scene.update(deltaTime, this.plane.getPosition());
      return;
    }
    
    // Update physics
    const input = this.controls.getInput();
    this.physics.update(this.plane, input, deltaTime);
    
    // Update plane position
    this.plane.update();
    
    // Update scene (ocean waves, infinite runway, etc.) - pass plane position
    this.scene.update(deltaTime, this.plane.getPosition());
    
    // Update camera to follow plane
    this.camera.update(this.plane.getPosition(), this.plane.getRotation());
    
    // Update HUD
    this.hud.update(
      this.physics.getSpeed(),
      this.physics.getAltitude(),
      this.physics.isBoostActive()
    );
    
    // Handle shooting (placeholder)
    if (input.shoot) {
      // TODO: Implement shooting logic
    }
  }

  render() {
    this.renderer.render(this.scene.getScene(), this.camera.getCamera());
  }

  handleResize() {
    this.camera.handleResize(this.container);
    this.renderer.handleResize(this.container);
  }

  start() {
    this.gameLoop.start();
    if (this.hud) {
      this.hud.show();
    }
  }

  stop() {
    this.gameLoop.stop();
    if (this.hud) {
      this.hud.hide();
    }
  }

  cleanup() {
    this.stop();
    this.controls.cleanup();
    this.hud.remove();
    this.renderer.dispose();
  }
}

