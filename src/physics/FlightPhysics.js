import * as THREE from 'three';

export class FlightPhysics {
  constructor() {
    // Flight parameters - realistic acceleration (much slower)
    this.maxSpeed = 0.5; // Lower max speed for more control
    this.acceleration = 0.005; // Very gradual acceleration
    this.deceleration = 0.01; // Gradual deceleration (drag)
    this.turnAcceleration = 0.003; // Slower acceleration for turns
    
    // Rotation speeds - realistic rotation
    this.pitchSpeed = 0.015;
    this.rollSpeed = 0.02;
    this.yawSpeed = 0.015;
    this.rotationDamping = 0.92; // Gradual rotation stop
    
    // Physics constants
    this.dragFactor = 0.98; // Air resistance
    this.momentumFactor = 0.95; // Momentum preservation
    
    // Boost
    this.boostMultiplier = 1.5;
    this.boostActive = false;
    
    // Current state - velocity-based movement
    this.velocity = new THREE.Vector3(0, 0, 0);
    this.speed = 0;
    this.altitude = 0;
    
    // Rotation velocity for smooth rotation
    this.rotationVelocity = new THREE.Vector3(0, 0, 0);
  }

  update(plane, input, deltaTime) {
    const dt = deltaTime * 0.016; // Normalize to ~60fps
    
    // Handle boost
    this.boostActive = input.boost;
    const speedMultiplier = this.boostActive ? this.boostMultiplier : 1.0;
    const maxSpeedWithBoost = this.maxSpeed * speedMultiplier;
    
    // Calculate desired velocity based on input
    const forward = new THREE.Vector3(0, 0, 1);
    forward.applyEuler(plane.rotation);
    
    const right = new THREE.Vector3(1, 0, 0);
    right.applyEuler(plane.rotation);
    
    const desiredVelocity = new THREE.Vector3(0, 0, 0);
    
    // Forward/backward acceleration (realistic)
    if (input.moveForward) {
      desiredVelocity.add(forward.clone().multiplyScalar(maxSpeedWithBoost));
    } else if (input.moveBackward) {
      desiredVelocity.add(forward.clone().multiplyScalar(-this.maxSpeed * 0.4)); // Slower backward
    }
    
    // Left/right acceleration (realistic)
    if (input.moveLeft) {
      desiredVelocity.add(right.clone().multiplyScalar(-this.maxSpeed * 0.6));
    }
    if (input.moveRight) {
      desiredVelocity.add(right.clone().multiplyScalar(this.maxSpeed * 0.6));
    }
    
    // Smooth acceleration/deceleration towards desired velocity
    // Use much smaller lerp factor for gradual changes
    const accelerationRate = desiredVelocity.length() > 0 ? this.acceleration : this.deceleration;
    // Clamp lerp factor to prevent instant changes - very gradual
    const lerpFactor = Math.min(accelerationRate * dt * 60, 0.05); // Max 5% change per frame
    this.velocity.lerp(desiredVelocity, lerpFactor);
    
    // Apply air resistance/drag (realistic physics) - stronger drag
    this.velocity.multiplyScalar(0.95); // More drag for gradual slowdown
    
    // Clamp velocity to max speed to prevent overshooting
    if (this.velocity.length() > maxSpeedWithBoost) {
      this.velocity.normalize().multiplyScalar(maxSpeedWithBoost);
    }
    
    // Update position based on velocity (realistic momentum)
    const movement = this.velocity.clone().multiplyScalar(dt * 60);
    plane.position.add(movement);
    
    // Calculate current speed for HUD (clamp to prevent unrealistic values)
    this.speed = Math.min(this.velocity.length(), this.maxSpeed * 1.2); // Allow slight overshoot with boost
    
    // Update rotation with realistic physics
    const desiredRotationVelocity = new THREE.Vector3(0, 0, 0);
    
    // Roll rotation (realistic banking)
    if (input.rollLeft) {
      desiredRotationVelocity.z = this.rollSpeed;
    } else if (input.rollRight) {
      desiredRotationVelocity.z = -this.rollSpeed;
    }
    
    // Yaw rotation (realistic turning)
    if (input.yawLeft) {
      desiredRotationVelocity.y = this.yawSpeed;
    } else if (input.yawRight) {
      desiredRotationVelocity.y = -this.yawSpeed;
    }
    
    // Smooth rotation acceleration/deceleration
    this.rotationVelocity.lerp(desiredRotationVelocity, 0.2);
    
    // Apply rotation with damping (realistic momentum)
    plane.rotation.z += this.rotationVelocity.z * dt * 60;
    plane.rotation.y += this.rotationVelocity.y * dt * 60;
    
    // Apply rotation damping (gradual stop)
    this.rotationVelocity.multiplyScalar(this.rotationDamping);
    
    // Clamp pitch
    plane.rotation.x = Math.max(-Math.PI / 3, Math.min(Math.PI / 3, plane.rotation.x));
    
    // Auto-level roll (smooth return to center when not turning)
    if (!input.rollLeft && !input.rollRight) {
      const rollDamping = 0.98;
      plane.rotation.z *= rollDamping;
      if (Math.abs(plane.rotation.z) < 0.01) {
        plane.rotation.z = 0;
      }
    }
    
    // Clamp altitude (prevent going too low or too high)
    plane.position.y = Math.max(10, Math.min(500, plane.position.y));
    
    // Update altitude for HUD
    this.altitude = plane.position.y;
  }

  getSpeed() {
    return this.speed;
  }

  getAltitude() {
    return this.altitude;
  }

  isBoostActive() {
    return this.boostActive;
  }
}

