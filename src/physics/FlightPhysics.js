import * as THREE from 'three';

export class FlightPhysics {
  constructor() {
    this.maxSpeed = 1.6;
    this.cruiseSpeed = 0.65;
    this.acceleration = 0.04;
    this.deceleration = 0.02;
    
    // Rotation sensitivity
    this.pitchSpeed = 0.025;
    this.rollSpeed = 0.035;
    this.yawSpeed = 0.015;
    this.rotationDamping = 0.9;
    
    // Boost state
    this.boostMultiplier = 1.65;
    this.boostActive = false;
    this.boostEnergy = 100;
    
    this.velocity = new THREE.Vector3(0, 0, 0);
    this.speed = 0;
    this.altitude = 0;
    this.rotationVelocity = new THREE.Vector3(0, 0, 0);
  }

  update(plane, input, deltaTime) {
    const dt = deltaTime * 0.016; // Normalize to ~60fps
    
    // Update Boost energy
    this.boostActive = input.boost && this.boostEnergy > 0;
    if (this.boostActive) {
      this.boostEnergy = Math.max(0, this.boostEnergy - 32 * (deltaTime / 1000));
    } else {
      this.boostEnergy = Math.min(100, this.boostEnergy + 16 * (deltaTime / 1000));
    }
    
    const speedMultiplier = this.boostActive ? this.boostMultiplier : 1.0;
    const currentTargetSpeed = (input.moveForward ? this.maxSpeed : this.cruiseSpeed) * speedMultiplier;
    
    // Calculate direction vectors
    const forward = new THREE.Vector3(0, 0, 1);
    forward.applyEuler(plane.rotation);
    
    const right = new THREE.Vector3(1, 0, 0);
    right.applyEuler(plane.rotation);
    
    // Target velocity: automatic forward flight along plane heading vector
    const desiredVelocity = forward.clone().multiplyScalar(currentTargetSpeed);
    
    // Combine lateral adjustments (slide slightly on roll)
    if (input.moveLeft) desiredVelocity.add(right.clone().multiplyScalar(-0.2));
    if (input.moveRight) desiredVelocity.add(right.clone().multiplyScalar(0.2));
    
    // Smoothly interpolate velocity
    const lerpFactor = Math.min((this.boostActive ? this.acceleration * 1.5 : this.acceleration) * dt * 60, 0.1);
    this.velocity.lerp(desiredVelocity, lerpFactor);
    
    // Move the plane position
    plane.position.add(this.velocity.clone().multiplyScalar(dt * 60));
    this.speed = this.velocity.length();
    
    // Steering rotation calculations
    const desiredRotationVelocity = new THREE.Vector3(0, 0, 0);
    
    // Pitch input (elevator)
    if (input.pitchUp) {
      desiredRotationVelocity.x = this.pitchSpeed;
    } else if (input.pitchDown) {
      desiredRotationVelocity.x = -this.pitchSpeed;
    }
    
    // Roll input (ailerons)
    if (input.rollLeft) {
      desiredRotationVelocity.z = this.rollSpeed;
    } else if (input.rollRight) {
      desiredRotationVelocity.z = -this.rollSpeed;
    }
    
    // Yaw input (rudder)
    if (input.yawLeft) {
      desiredRotationVelocity.y = this.yawSpeed;
    } else if (input.yawRight) {
      desiredRotationVelocity.y = -this.yawSpeed;
    }
    
    // Apply steering rotation smoothly
    this.rotationVelocity.lerp(desiredRotationVelocity, 0.25 * dt * 60);
    
    // Apply changes to plane rotation
    plane.rotation.x += this.rotationVelocity.x * dt * 60;
    plane.rotation.z += this.rotationVelocity.z * dt * 60;
    plane.rotation.y += this.rotationVelocity.y * dt * 60;
    
    // Aerodynamic Banking: Roll automatically causes Yaw (turning)
    // Left bank (Z > 0) -> Yaw Left (Y > 0)
    // Right bank (Z < 0) -> Yaw Right (Y < 0)
    if (Math.abs(plane.rotation.z) > 0.05) {
      plane.rotation.y += plane.rotation.z * 0.016 * dt * 60;
    }
    
    // Apply damping to rotational velocity
    this.rotationVelocity.multiplyScalar(Math.pow(this.rotationDamping, dt * 60));
    
    // Auto-level roll and pitch when not active (aerodynamic stability)
    if (!input.rollLeft && !input.rollRight) {
      plane.rotation.z = THREE.MathUtils.lerp(plane.rotation.z, 0, 0.12 * dt * 60);
    }
    if (!input.pitchUp && !input.pitchDown) {
      plane.rotation.x = THREE.MathUtils.lerp(plane.rotation.x, 0, 0.1 * dt * 60);
    }
    
    // Clamp limits for pitching and banking (prevent complete loops/flips)
    plane.rotation.x = Math.max(-0.6, Math.min(0.6, plane.rotation.x));
    plane.rotation.z = Math.max(-1.0, Math.min(1.0, plane.rotation.z));
    
    // Boundary Recovery (Relaxing limits, no crash deaths)
    // Ocean boundary
    if (plane.position.y < 15) {
      plane.position.y = THREE.MathUtils.lerp(plane.position.y, 15, 0.12 * dt * 60);
      plane.rotation.x = THREE.MathUtils.lerp(plane.rotation.x, 0.18, 0.15 * dt * 60);
    }
    // High ceiling boundary
    if (plane.position.y > 90) {
      plane.position.y = THREE.MathUtils.lerp(plane.position.y, 90, 0.12 * dt * 60);
      plane.rotation.x = THREE.MathUtils.lerp(plane.rotation.x, -0.18, 0.15 * dt * 60);
    }
    // Lateral course boundaries (keeps player near the generated rings)
    if (Math.abs(plane.position.x) > 90) {
      const boundarySign = Math.sign(plane.position.x);
      plane.position.x = THREE.MathUtils.lerp(plane.position.x, boundarySign * 90, 0.1 * dt * 60);
      // Guide plane heading back toward the center (yaw adjustment)
      plane.rotation.y = THREE.MathUtils.lerp(plane.rotation.y, plane.rotation.y - boundarySign * 0.1, 0.08 * dt * 60);
    }
    
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

  getBoostEnergy() {
    return this.boostEnergy;
  }
}
