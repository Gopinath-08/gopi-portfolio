<<<<<<< HEAD
import * as THREE from 'three';

export class Renderer {
  constructor(container) {
    this.renderer = new THREE.WebGLRenderer({
      antialias: true,
      powerPreference: 'high-performance',
    });
    
    const width = container.clientWidth || window.innerWidth || 800;
    const height = container.clientHeight || window.innerHeight || 600;
    this.renderer.setSize(width, height);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    this.renderer.outputColorSpace = THREE.SRGBColorSpace;
    
    container.appendChild(this.renderer.domElement);
  }

  render(scene, camera) {
    this.renderer.render(scene, camera);
  }

  handleResize(container) {
    const width = container.clientWidth || window.innerWidth || 800;
    const height = container.clientHeight || window.innerHeight || 600;
    this.renderer.setSize(width, height);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  }

  getRenderer() {
    return this.renderer;
  }

  dispose() {
    this.renderer.dispose();
  }
}

=======
import * as THREE from 'three';

export class Renderer {
  constructor(container) {
    this.renderer = new THREE.WebGLRenderer({
      antialias: true,
      powerPreference: 'high-performance',
    });
    
    this.renderer.setSize(container.clientWidth, container.clientHeight);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    this.renderer.outputColorSpace = THREE.SRGBColorSpace;
    
    container.appendChild(this.renderer.domElement);
  }

  render(scene, camera) {
    this.renderer.render(scene, camera);
  }

  handleResize(container) {
    this.renderer.setSize(container.clientWidth, container.clientHeight);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  }

  getRenderer() {
    return this.renderer;
  }

  dispose() {
    this.renderer.dispose();
  }
}

>>>>>>> 91789f59d7bf73768e9cdb48b6a41f9a6c3f3de1
