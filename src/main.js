<<<<<<< HEAD
import { Scene } from './core/Scene.js';
import { Camera } from './core/Camera.js';
import { Renderer } from './core/Renderer.js';
import { GameLoop } from './core/GameLoop.js';
import { Plane } from './entities/Plane.js';
import { FlightPhysics } from './physics/FlightPhysics.js';
import { Controls } from './input/Controls.js';
import { HUD } from './ui/HUD.js';
import { SoundEffects } from './core/SoundEffects.js';

export class PlaneGame {
  constructor(container) {
    this.container = container;
    
    // Initialize gameplay state
    this.score = 0;
    this.streak = 0;
    this.streakTimer = 0;
    this.highScore = parseInt(localStorage.getItem('sky_flow_high_score') || '0', 10);
    
    // Initialize core systems
    this.scene = new Scene();
    this.camera = new Camera(container);
    this.renderer = new Renderer(container);
    this.controls = new Controls();
    this.physics = new FlightPhysics();
    
    // HUD overlay
    this.hud = new HUD(document.body);
    
    // Audio engine (initialized dynamically on launch)
    this.sounds = new SoundEffects();
    
    // Initialize 3D Plane
    this.plane = new Plane(this.scene.getScene());
    
    // Game loop binding
    this.gameLoop = new GameLoop(
      (deltaTime) => this.update(deltaTime),
      () => this.render()
    );
    
    window.addEventListener('resize', () => this.handleResize());
  }

  update(deltaTime) {
    // Update player controls
    this.controls.updateInput();
    
    // Wait for aircraft asset to load before starting flight
    if (!this.plane.isLoaded()) {
      this.camera.update(this.plane.getPosition(), this.plane.getRotation(), false);
      this.scene.update(deltaTime, this.plane.getPosition(), this.plane.getRotation(), false);
      return;
    }
    
    const input = this.controls.getInput();
    
    // Apply flight mechanics
    this.physics.update(this.plane, input, deltaTime);
    
    // Update aircraft positions
    this.plane.update();
    
    // Update visual systems and detect collection overlaps
    const sceneUpdateResult = this.scene.update(
      deltaTime,
      this.plane.getPosition(),
      this.plane.getRotation(),
      this.physics.isBoostActive()
    );
    
    const { ringsCollected, overlapCloud } = sceneUpdateResult;
    
    // Streak multiplier decay timer (resets streak if player misses rings for too long)
    if (this.streak > 0) {
      this.streakTimer += deltaTime / 1000;
      if (this.streakTimer > 8.0) {
        this.streak = 0;
        this.streakTimer = 0;
        this.sounds.playStreakBreak();
      }
    }
    
    // Handle ring collection chimes and boost rewards
    if (ringsCollected > 0) {
      this.streak += ringsCollected;
      this.streakTimer = 0;
      
      const pointBonus = 100 * ringsCollected * this.streak;
      this.score += pointBonus;
      
      if (this.score > this.highScore) {
        this.highScore = this.score;
        localStorage.setItem('sky_flow_high_score', this.highScore.toString());
      }
      
      this.sounds.playRingChime(this.streak);
      
      // Replenish boost energy on collection
      this.physics.boostEnergy = Math.min(100, this.physics.boostEnergy + 15 * ringsCollected);
    }
    
    // Shift frequency parameters of synth hums based on flight speed
    const cruise = this.physics.cruiseSpeed;
    const max = this.physics.maxSpeed;
    const speedFraction = (this.physics.getSpeed() - cruise) / (max - cruise);
    this.sounds.update(Math.max(0, Math.min(1, speedFraction)), this.physics.isBoostActive());
    
    // Update follow camera
    this.camera.update(this.plane.getPosition(), this.plane.getRotation(), this.physics.isBoostActive());
    
    // Push updated stats to the UI layout
    this.hud.update(
      this.physics.getSpeed(),
      this.physics.getAltitude(),
      this.physics.isBoostActive(),
      {
        score: this.score,
        streak: this.streak,
        highScore: this.highScore,
        boostEnergy: this.physics.getBoostEnergy(),
        overlapCloud,
        streakTimer: this.streakTimer
      }
    );
  }

  render() {
    this.renderer.render(this.scene.getScene(), this.camera.getCamera());
  }

  handleResize() {
    this.camera.handleResize(this.container);
    this.renderer.handleResize(this.container);
  }

  start() {
    // Launch/resume procedural synth loops
    this.sounds.init();
    this.sounds.resume();
    
    this.gameLoop.start();
    if (this.hud) {
      this.hud.show();
    }
  }

  stop() {
    this.gameLoop.stop();
    this.sounds.suspend();
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
=======
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

>>>>>>> 91789f59d7bf73768e9cdb48b6a41f9a6c3f3de1
