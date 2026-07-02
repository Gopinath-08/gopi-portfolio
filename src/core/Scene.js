import * as THREE from 'three';

export class Scene {
  constructor() {
    this.scene = new THREE.Scene();
    
    // Cache for particle materials to prevent resource leaks
    this.materialCache = {};
    
    // Shared geometries reused for all particles
    this.geomNormal = new THREE.SphereGeometry(0.2, 5, 4);
    this.geomBoost = new THREE.SphereGeometry(0.35, 5, 4);
    this.geomBurst = new THREE.SphereGeometry(0.18, 5, 4);
    
    this.setupEnvironment();
  }

  setupEnvironment() {
    // Sky pastel color
    this.scene.background = new THREE.Color(0x9bd4d0);
    
    // Fog for depth
    this.scene.fog = new THREE.Fog(0x9bd4d0, 80, 650);

    // Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.65);
    this.scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.85);
    directionalLight.position.set(20, 80, 20);
    directionalLight.castShadow = true;
    this.scene.add(directionalLight);

    // Skybox
    this.createSkybox();

    this.createOcean();
    this.createClouds();
    this.createCourse();
    
    // Initialize particles array
    this.particles = [];
  }

  getMaterial(color, opacity) {
    // Clamp opacity between 0 and 1
    const clampedOpacity = Math.max(0, Math.min(1, opacity));
    // Round opacity to nearest 0.1 to limit cached materials to max 11 per color
    const opacityKey = Math.round(clampedOpacity * 10) / 10;
    const key = `${color}_${opacityKey}`;
    
    if (!this.materialCache[key]) {
      this.materialCache[key] = new THREE.MeshBasicMaterial({
        color: color,
        transparent: true,
        opacity: opacityKey,
      });
    }
    return this.materialCache[key];
  }

  createSkybox() {
    const skyGeometry = new THREE.SphereGeometry(2000, 32, 32);
    const skyMaterial = new THREE.MeshBasicMaterial({
      color: 0x9bd4d0,
      side: THREE.BackSide,
    });
    const skybox = new THREE.Mesh(skyGeometry, skyMaterial);
    this.scene.add(skybox);
  }

  createOcean() {
    const oceanGeometry = new THREE.PlaneGeometry(5000, 5000, 50, 50);
    const oceanMaterial = new THREE.MeshStandardMaterial({
      color: 0x0a5b80,
      roughness: 0.75,
      metalness: 0.15,
    });
    
    const ocean = new THREE.Mesh(oceanGeometry, oceanMaterial);
    ocean.rotation.x = -Math.PI / 2;
    ocean.position.y = -20;
    ocean.receiveShadow = true;
    this.scene.add(ocean);

    this.ocean = ocean;
    this.waveTime = 0;
  }

  createClouds() {
    const geometry = new THREE.SphereGeometry(1, 10, 8);
    const material = new THREE.MeshStandardMaterial({
      color: 0xf2f7f3,
      transparent: true,
      opacity: 0.65,
      roughness: 0.95,
    });
    this.clouds = [];
    
    for (let i = 0; i < 34; i++) {
      const cloud = new THREE.Group();
      const cloudSize = 2.5 + Math.random() * 2.5;
      
      for (let j = 0; j < 3; j++) {
        const puff = new THREE.Mesh(geometry, material);
        puff.position.set(j * 3.0, Math.sin(j) * 0.75, 0);
        puff.scale.set(cloudSize + j, (cloudSize * 0.5) + j * 0.2, cloudSize * 0.7);
        cloud.add(puff);
      }
      
      cloud.position.set(
        (Math.random() - 0.5) * 160,
        18 + Math.random() * 45,
        25 + i * 40
      );
      this.scene.add(cloud);
      this.clouds.push(cloud);
    }
  }

  createCourse() {
    this.rings = [];
    this.ringGeometry = new THREE.TorusGeometry(6, 0.42, 10, 42);
    this.ringMaterial = new THREE.MeshStandardMaterial({
      color: 0xffd37a,
      emissive: 0xffa94d,
      emissiveIntensity: 1.3,
      roughness: 0.3,
    });
    this.ringPathIndex = 0;
    
    for (let i = 0; i < 14; i++) {
      const ring = new THREE.Mesh(this.ringGeometry, this.ringMaterial.clone());
      this.positionRingAlongPath(ring, 35 + i * 45);
      ring.userData.collected = false;
      this.scene.add(ring);
      this.rings.push(ring);
    }
  }

  positionRingAlongPath(ring, zPosition) {
    this.ringPathIndex++;
    const x = Math.sin(this.ringPathIndex * 0.38) * 36;
    const y = 28 + Math.cos(this.ringPathIndex * 0.22) * 16;
    ring.position.set(x, y, zPosition);
  }

  recycleRing(ring) {
    const farthest = Math.max(...this.rings.map(item => item.position.z));
    this.positionRingAlongPath(ring, farthest + 45);
    ring.scale.setScalar(1);
    ring.material.opacity = 1;
    ring.material.transparent = false;
  }

  updateCourse(planePosition) {
    let collected = 0;
    for (const ring of this.rings) {
      ring.rotation.z += 0.006;
      
      const dz = ring.position.z - planePosition.z;
      
      if (Math.abs(dz) < 4.5) {
        const dx = ring.position.x - planePosition.x;
        const dy = ring.position.y - planePosition.y;
        const radialDist = Math.hypot(dx, dy);
        
        if (radialDist < 6.5) {
          collected++;
          this.createRingBurst(ring.position);
          this.recycleRing(ring);
          continue;
        }
      }
      
      if (dz < -10) {
        this.recycleRing(ring);
      }
    }
    return collected;
  }

  checkCloudOverlap(planePosition) {
    if (!this.clouds) return false;
    for (const cloud of this.clouds) {
      const distZ = Math.abs(cloud.position.z - planePosition.z);
      if (distZ < 15) {
        const distX = Math.abs(cloud.position.x - planePosition.x);
        const distY = Math.abs(cloud.position.y - planePosition.y);
        if (distX < 24 && distY < 12) {
          return true;
        }
      }
    }
    return false;
  }

  createRingBurst(position) {
    const particleCount = 18;
    
    for (let i = 0; i < particleCount; i++) {
      const colorVal = Math.random() > 0.4 ? 0xffd700 : 0x00ffff;
      // Get cached material
      const mat = this.getMaterial(colorVal, 0.9);
      // Reuse shared burst geometry
      const mesh = new THREE.Mesh(this.geomBurst, mat);
      mesh.position.copy(position);
      
      const angle1 = Math.random() * Math.PI * 2;
      const angle2 = Math.random() * Math.PI;
      const speed = 0.12 + Math.random() * 0.28;
      
      const vx = Math.cos(angle1) * Math.sin(angle2) * speed;
      const vy = Math.sin(angle1) * Math.sin(angle2) * speed;
      const vz = Math.cos(angle2) * speed;
      
      this.scene.add(mesh);
      this.particles.push({
        mesh,
        color: colorVal,
        opacity: 0.9,
        velocity: new THREE.Vector3(vx, vy, vz),
        decay: 0.022 + Math.random() * 0.022,
      });
    }
  }

  createEngineTrail(planePosition, planeRotation, isBoostActive) {
    const forward = new THREE.Vector3(0, 0, 1);
    forward.applyEuler(planeRotation);
    
    const tailPos = planePosition.clone().add(forward.clone().multiplyScalar(-1.8));
    // Reuse shared geometries
    const geom = isBoostActive ? this.geomBoost : this.geomNormal;
    const count = isBoostActive ? 3 : 1;
    const colorVal = isBoostActive ? 0x00d9ff : 0xeef5f6;
    
    for (let i = 0; i < count; i++) {
      const mat = this.getMaterial(colorVal, 0.5);
      const mesh = new THREE.Mesh(geom, mat);
      mesh.position.copy(tailPos).add(new THREE.Vector3(
        (Math.random() - 0.5) * 0.2,
        (Math.random() - 0.5) * 0.2,
        (Math.random() - 0.5) * 0.2
      ));
      
      const vx = (Math.random() - 0.5) * 0.03;
      const vy = (Math.random() - 0.5) * 0.03;
      const vz = -forward.z * 0.05 + (Math.random() - 0.5) * 0.03;
      
      this.scene.add(mesh);
      this.particles.push({
        mesh,
        color: colorVal,
        opacity: 0.5,
        velocity: new THREE.Vector3(vx, vy, vz),
        decay: isBoostActive ? 0.05 : 0.035,
      });
    }
  }

  updateParticles(dt) {
    for (let i = this.particles.length - 1; i >= 0; i--) {
      const p = this.particles[i];
      p.mesh.position.add(p.velocity);
      
      // Decrease opacity state
      p.opacity -= p.decay * dt * 60;
      
      if (p.opacity <= 0) {
        this.scene.remove(p.mesh);
        // Do NOT dispose of geometry or material here because they are cached/shared!
        this.particles.splice(i, 1);
      } else {
        // Assign the cached material for the new opacity step
        p.mesh.material = this.getMaterial(p.color, p.opacity);
        p.mesh.scale.multiplyScalar(0.96);
      }
    }
  }

  createRunway() {
    this.runwayWidth = 20;
    this.segmentLength = 100;
    this.segmentsAhead = 5;
    this.segmentsBehind = 2;
    this.runwaySegments = new Map();
    this.lastPlaneZ = -80;
    
    this.runwayMaterial = new THREE.MeshStandardMaterial({
      color: 0x2a2a2a,
      roughness: 0.7,
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

    const groundGeometry = new THREE.PlaneGeometry(10000, 10000, 20, 20);
    const groundMaterial = new THREE.MeshStandardMaterial({
      color: 0x3a5a3a,
      roughness: 0.9,
    });
    
    const ground = new THREE.Mesh(groundGeometry, groundMaterial);
    ground.rotation.x = -Math.PI / 2;
    ground.position.set(0, -0.1, 0);
    this.scene.add(ground);
  }

  update(deltaTime, planePosition = null, planeRotation = null, isBoostActive = false) {
    const dt = deltaTime * 0.016; // Normalise
    
    // Wave animation
    if (this.ocean) {
      this.waveTime += deltaTime * 0.001;
      const positions = this.ocean.geometry.attributes.position;
      for (let i = 0; i < positions.count; i++) {
        const x = positions.getX(i);
        const z = positions.getZ(i);
        const y = Math.sin(x * 0.06 + this.waveTime) * Math.cos(z * 0.06 + this.waveTime) * 1.5;
        positions.setY(i, y);
      }
      positions.needsUpdate = true;
    }
    
    // Engine trails
    if (planePosition && planeRotation) {
      this.createEngineTrail(planePosition, planeRotation, isBoostActive);
    }
    
    // Update particles
    this.updateParticles(dt);
    
    let ringsCollected = 0;
    let overlapCloud = false;
    
    if (planePosition) {
      ringsCollected = this.updateCourse(planePosition);
      overlapCloud = this.checkCloudOverlap(planePosition);
    }
    
    return {
      ringsCollected,
      overlapCloud
    };
  }

  getScene() {
    return this.scene;
  }
}
