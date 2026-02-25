import * as THREE from 'three';

export class Camera {
  constructor(container) {
    this.camera = new THREE.PerspectiveCamera(
      75,
      container.clientWidth / container.clientHeight,
      0.1,
      5000
    );
    
    // Camera follow parameters - much closer for tight follow
    this.distance = 8; // Distance behind plane (much closer)
    this.height = 3; // Height above plane (lower)
    this.smoothness = 0.25; // Faster follow response for tight tracking
    
    // Target position (will follow plane)
    this.targetPosition = new THREE.Vector3(0, 0, 0);
    this.targetRotation = new THREE.Euler(0, 0, 0);
    
    // Current camera position (for smooth interpolation)
    // Start camera behind plane on runway
    this.currentPosition = new THREE.Vector3(0, 5, -95); // Behind plane on runway
    this.currentLookAt = new THREE.Vector3(0, 2, -80); // Look at plane on runway
    
    // Set initial camera position
    this.camera.position.copy(this.currentPosition);
    this.camera.lookAt(this.currentLookAt);
  }

  update(planePosition, planeRotation) {
    // Calculate desired camera position (behind and above plane)
    // Use plane's forward direction to position camera behind it
    const forward = new THREE.Vector3(0, 0, 1);
    forward.applyEuler(planeRotation);
    
    // Calculate camera offset (behind and above)
    const right = new THREE.Vector3(1, 0, 0);
    right.applyEuler(planeRotation);
    const up = new THREE.Vector3(0, 1, 0);
    
    // Position camera behind plane
    const behindOffset = forward.clone().multiplyScalar(-this.distance);
    const heightOffset = up.clone().multiplyScalar(this.height);
    
    // Calculate target position
    this.targetPosition.copy(planePosition)
      .add(behindOffset)
      .add(heightOffset);
    
    // Smooth interpolation for camera position
    this.currentPosition.lerp(this.targetPosition, this.smoothness);
    
    // Look at point ahead of plane (in direction of flight) - closer for tight view
    const lookAheadDistance = 5; // Much closer look-ahead
    const lookAhead = forward.clone().multiplyScalar(lookAheadDistance);
    const targetLookAt = planePosition.clone().add(lookAhead);
    
    // Smooth look-at interpolation - faster for tight follow
    this.currentLookAt.lerp(targetLookAt, this.smoothness * 3);
    
    // Update camera
    this.camera.position.copy(this.currentPosition);
    this.camera.lookAt(this.currentLookAt);
  }

  handleResize(container) {
    this.camera.aspect = container.clientWidth / container.clientHeight;
    this.camera.updateProjectionMatrix();
  }

  getCamera() {
    return this.camera;
  }
}

