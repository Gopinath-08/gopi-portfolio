import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader.js';

export class Plane {
  constructor(scene) {
    this.scene = scene;
    this.group = new THREE.Group();
    this.model = null;
    this.loaded = false;
    
    // Position and rotation - start on runway
    this.position = new THREE.Vector3(0, 2, -80); // Start at beginning of runway, slightly above ground
    this.rotation = new THREE.Euler(0, 0, 0); // Face forward along runway
    
    // Physics state
    this.velocity = new THREE.Vector3(0, 0, 0);
    this.angularVelocity = new THREE.Vector3(0, 0, 0);
    
    this.loadModel();
  }

  async loadModel() {
    try {
      const loader = new GLTFLoader();
      const dracoLoader = new DRACOLoader();
      dracoLoader.setDecoderPath('https://www.gstatic.com/draco/v1/decoders/');
      loader.setDRACOLoader(dracoLoader);

      const modelPaths = ['/plane/scene.gltf', '/plane/scene.glb'];
      let gltf = null;

      for (const path of modelPaths) {
        try {
          gltf = await new Promise((resolve, reject) => {
            loader.load(
              path,
              (loaded) => resolve(loaded),
              undefined,
              (error) => reject(error)
            );
          });
          break;
        } catch (error) {
          continue;
        }
      }

      if (!gltf) {
        throw new Error('Failed to load plane model');
      }

      // Clone and process model
      this.model = gltf.scene.clone();
      
      // Calculate bounding box and center
      const box = new THREE.Box3().setFromObject(this.model);
      const size = box.getSize(new THREE.Vector3());
      const center = box.getCenter(new THREE.Vector3());
      const maxDimension = Math.max(size.x, size.y, size.z);
      
      // Scale to appropriate size
      const targetSize = 3.0;
      const scale = targetSize / maxDimension;
      this.model.scale.set(scale, scale, scale);
      
      // Center the model
      this.model.position.sub(center.multiplyScalar(scale));
      
      // Rotate to face forward (Z+)
      this.model.rotation.y = Math.PI / 2;
      
      // Enable shadows
      this.model.traverse((child) => {
        if (child instanceof THREE.Mesh) {
          child.castShadow = true;
          child.receiveShadow = true;
        }
      });

      this.group.add(this.model);
      this.scene.add(this.group);
      this.loaded = true;
      
      console.log('[Plane] Model loaded successfully');
    } catch (error) {
      console.warn('[Plane] Using fallback model:', error);
      this.createFallback();
    }
  }

  createFallback() {
    // Simple plane geometry
    const fuselage = new THREE.Mesh(
      new THREE.ConeGeometry(0.2, 2, 8),
      new THREE.MeshStandardMaterial({ color: 0x00ffff })
    );
    fuselage.rotation.z = Math.PI / 2;
    fuselage.castShadow = true;
    this.group.add(fuselage);

    const wing = new THREE.Mesh(
      new THREE.BoxGeometry(3, 0.1, 0.5),
      new THREE.MeshStandardMaterial({ color: 0x00ffff })
    );
    wing.castShadow = true;
    this.group.add(wing);

    const tail = new THREE.Mesh(
      new THREE.BoxGeometry(0.1, 1, 0.5),
      new THREE.MeshStandardMaterial({ color: 0x00ffff })
    );
    tail.position.set(-0.8, 0.3, 0);
    tail.castShadow = true;
    this.group.add(tail);

    this.scene.add(this.group);
    this.loaded = true;
  }

  update() {
    // Update group position and rotation
    this.group.position.copy(this.position);
    this.group.rotation.copy(this.rotation);
  }

  getPosition() {
    return this.position;
  }

  getRotation() {
    return this.rotation;
  }

  getGroup() {
    return this.group;
  }

  isLoaded() {
    return this.loaded;
  }
}

