import * as THREE from 'three';

export class Camera {
  constructor(container) {
    const width = container.clientWidth || window.innerWidth || 800;
    const height = container.clientHeight || window.innerHeight || 600;
    this.camera = new THREE.PerspectiveCamera(
      75,
      width / height,
      0.1,
      5000
    );
    
    // Normal follow camera parameters
    this.normalDistance = 7.2;
    this.normalHeight = 2.8;
    
    // Boost camera parameters (pull back, lower, wider field of view)
    this.boostDistance = 9.8;
    this.boostHeight = 2.3;
    
    this.distance = this.normalDistance;
    this.height = this.normalHeight;
    this.smoothness = 0.22;
    
    this.targetPosition = new THREE.Vector3(0, 0, 0);
    
    // Align starting camera position relative to the plane spawn at (0, 28, -20)
    this.currentPosition = new THREE.Vector3(0, 31, -28);
    this.currentLookAt = new THREE.Vector3(0, 28, -20);
    
    this.camera.position.copy(this.currentPosition);
    this.camera.lookAt(this.currentLookAt);
  }

  update(planePosition, planeRotation, isBoostActive = false) {
    // Interpolate camera specs depending on boost state
    const targetFov = isBoostActive ? 86 : 75;
    const targetDist = isBoostActive ? this.boostDistance : this.normalDistance;
    const targetHeight = isBoostActive ? this.boostHeight : this.normalHeight;
    
    // Interpolate FOV smoothly
    if (Math.abs(this.camera.fov - targetFov) > 0.1) {
      this.camera.fov = THREE.MathUtils.lerp(this.camera.fov, targetFov, 0.08);
      this.camera.updateProjectionMatrix();
    }
    
    this.distance = THREE.MathUtils.lerp(this.distance, targetDist, 0.08);
    this.height = THREE.MathUtils.lerp(this.height, targetHeight, 0.08);
    
    // Calculate direction of flight
    const forward = new THREE.Vector3(0, 0, 1);
    forward.applyEuler(planeRotation);
    
    const up = new THREE.Vector3(0, 1, 0);
    
    const behindOffset = forward.clone().multiplyScalar(-this.distance);
    const heightOffset = up.clone().multiplyScalar(this.height);
    
    this.targetPosition.copy(planePosition)
      .add(behindOffset)
      .add(heightOffset);
    
    // Smoothly follow plane position
    this.currentPosition.lerp(this.targetPosition, this.smoothness);
    
    // Look slightly ahead of the plane
    const lookAheadDistance = 6.0;
    const lookAhead = forward.clone().multiplyScalar(lookAheadDistance);
    const targetLookAt = planePosition.clone().add(lookAhead);
    
    // Interpolate lookAt point
    this.currentLookAt.lerp(targetLookAt, this.smoothness * 2.5);
    
    // Apply coordinates to camera
    this.camera.position.copy(this.currentPosition);
    this.camera.lookAt(this.currentLookAt);
  }

  handleResize(container) {
    const width = container.clientWidth || window.innerWidth || 800;
    const height = container.clientHeight || window.innerHeight || 600;
    this.camera.aspect = width / height;
    this.camera.updateProjectionMatrix();
  }

  getCamera() {
    return this.camera;
  }
}
