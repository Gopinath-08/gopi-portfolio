import * as THREE from 'three';

export class Scene {
  constructor() {
    this.scene = new THREE.Scene();
    this.setupEnvironment();
  }

  setupEnvironment() {
    // Sky color
    this.scene.background = new THREE.Color(0x87ceeb);
    
    // Fog for depth
    this.scene.fog = new THREE.Fog(0x87ceeb, 50, 1000);

    // Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
    this.scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight.position.set(10, 50, 10);
    directionalLight.castShadow = true;
    directionalLight.shadow.camera.left = -200;
    directionalLight.shadow.camera.right = 200;
    directionalLight.shadow.camera.top = 200;
    directionalLight.shadow.camera.bottom = -200;
    directionalLight.shadow.mapSize.width = 2048;
    directionalLight.shadow.mapSize.height = 2048;
    this.scene.add(directionalLight);

    // Skybox
    this.createSkybox();

    // Runway (for takeoff)
    this.createRunway();
    
    // Ocean/ground (background)
    this.createOcean();
  }

  createSkybox() {
    const skyGeometry = new THREE.SphereGeometry(2000, 32, 32);
    const skyMaterial = new THREE.MeshBasicMaterial({
      color: 0x87ceeb,
      side: THREE.BackSide,
    });
    const skybox = new THREE.Mesh(skyGeometry, skyMaterial);
    this.scene.add(skybox);
  }

  createOcean() {
    const oceanGeometry = new THREE.PlaneGeometry(5000, 5000, 50, 50);
    const oceanMaterial = new THREE.MeshStandardMaterial({
      color: 0x006994,
      roughness: 0.8,
      metalness: 0.2,
    });
    
    const ocean = new THREE.Mesh(oceanGeometry, oceanMaterial);
    ocean.rotation.x = -Math.PI / 2;
    ocean.position.y = -100;
    ocean.receiveShadow = true;
    this.scene.add(ocean);

    // Animate ocean waves
    this.ocean = ocean;
    this.waveTime = 0;
  }

  createRunway() {
    // Infinite runway system
    this.runwayWidth = 20;
    this.segmentLength = 100; // Length of each runway segment
    this.segmentsAhead = 5; // Number of segments to keep ahead
    this.segmentsBehind = 2; // Number of segments to keep behind
    this.runwaySegments = new Map(); // Map of segment Z position to segment objects
    this.lastPlaneZ = -80; // Track plane's last Z position
    
    // Runway materials
    this.runwayMaterial = new THREE.MeshStandardMaterial({
      color: 0x2a2a2a,
      roughness: 0.7,
      metalness: 0.1,
    });
    
    this.centerLineMaterial = new THREE.MeshStandardMaterial({
      color: 0xffff00,
      emissive: 0xffff00,
      emissiveIntensity: 0.3,
    });
    
    this.sideLineMaterial = new THREE.MeshStandardMaterial({
      color: 0xffffff,
    });
    
    this.dashMaterial = new THREE.MeshStandardMaterial({
      color: 0xffffff,
    });

    // Ground around runway (infinite)
    const groundGeometry = new THREE.PlaneGeometry(10000, 10000, 20, 20);
    const groundMaterial = new THREE.MeshStandardMaterial({
      color: 0x3a5a3a, // Grass color
      roughness: 0.9,
    });
    
    const ground = new THREE.Mesh(groundGeometry, groundMaterial);
    ground.rotation.x = -Math.PI / 2;
    ground.position.set(0, -0.1, 0);
    ground.receiveShadow = true;
    this.scene.add(ground);

    // Create initial runway segments
    this.updateRunway(-80);
    console.log('[Scene] Infinite runway system created');
  }

  createRunwaySegment(segmentZ) {
    const segment = {
      group: new THREE.Group(),
      z: segmentZ,
    };

    // Main runway surface
    const runwayGeometry = new THREE.PlaneGeometry(this.runwayWidth, this.segmentLength);
    const runway = new THREE.Mesh(runwayGeometry, this.runwayMaterial);
    runway.rotation.x = -Math.PI / 2;
    runway.position.set(0, 0, segmentZ);
    runway.receiveShadow = true;
    segment.group.add(runway);

    // Runway center line
    const lineGeometry = new THREE.PlaneGeometry(0.5, this.segmentLength);
    const centerLine = new THREE.Mesh(lineGeometry, this.centerLineMaterial);
    centerLine.rotation.x = -Math.PI / 2;
    centerLine.position.set(0, 0.01, segmentZ);
    segment.group.add(centerLine);

    // Runway side lines
    const sideLineWidth = 0.3;
    const sideLineGeometry = new THREE.PlaneGeometry(sideLineWidth, this.segmentLength);

    // Left side line
    const leftLine = new THREE.Mesh(sideLineGeometry, this.sideLineMaterial);
    leftLine.rotation.x = -Math.PI / 2;
    leftLine.position.set(-this.runwayWidth / 2, 0.01, segmentZ);
    segment.group.add(leftLine);

    // Right side line
    const rightLine = new THREE.Mesh(sideLineGeometry, this.sideLineMaterial);
    rightLine.rotation.x = -Math.PI / 2;
    rightLine.position.set(this.runwayWidth / 2, 0.01, segmentZ);
    segment.group.add(rightLine);

    // Runway markings (dashed lines)
    const dashLength = 5;
    const dashGap = 10;
    const dashWidth = 2;
    const dashGeometry = new THREE.PlaneGeometry(dashWidth, dashLength);

    for (let i = 0; i < this.segmentLength; i += dashGap) {
      const dash = new THREE.Mesh(dashGeometry, this.dashMaterial);
      dash.rotation.x = -Math.PI / 2;
      dash.position.set(0, 0.02, segmentZ - this.segmentLength / 2 + i);
      segment.group.add(dash);
    }

    this.scene.add(segment.group);
    return segment;
  }

  updateRunway(planeZ) {
    // Calculate which segments should exist
    const minZ = planeZ - this.segmentsBehind * this.segmentLength;
    const maxZ = planeZ + this.segmentsAhead * this.segmentLength;
    
    // Round to segment boundaries
    const minSegmentZ = Math.floor(minZ / this.segmentLength) * this.segmentLength;
    const maxSegmentZ = Math.ceil(maxZ / this.segmentLength) * this.segmentLength;

    // Remove segments that are too far away
    for (const [segmentZ, segment] of this.runwaySegments.entries()) {
      if (segmentZ < minSegmentZ || segmentZ > maxSegmentZ) {
        this.scene.remove(segment.group);
        segment.group.traverse((child) => {
          if (child.geometry) child.geometry.dispose();
          if (child.material) child.material.dispose();
        });
        this.runwaySegments.delete(segmentZ);
      }
    }

    // Create missing segments
    for (let z = minSegmentZ; z <= maxSegmentZ; z += this.segmentLength) {
      if (!this.runwaySegments.has(z)) {
        const segment = this.createRunwaySegment(z);
        this.runwaySegments.set(z, segment);
      }
    }

    this.lastPlaneZ = planeZ;
  }

  update(deltaTime, planePosition = null) {
    // Animate ocean waves
    if (this.ocean) {
      this.waveTime += deltaTime * 0.001;
      const positions = this.ocean.geometry.attributes.position;
      for (let i = 0; i < positions.count; i++) {
        const x = positions.getX(i);
        const z = positions.getZ(i);
        const y = Math.sin(x * 0.1 + this.waveTime) * Math.cos(z * 0.1 + this.waveTime) * 2;
        positions.setY(i, y);
      }
      positions.needsUpdate = true;
    }

    // Update infinite runway based on plane position
    if (planePosition && this.runwaySegments) {
      this.updateRunway(planePosition.z);
    }
  }

  getScene() {
    return this.scene;
  }
}

