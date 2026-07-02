<<<<<<< HEAD
export class Controls {
  constructor() {
    this.keys = {};
    this.input = {
      pitchUp: false,
      pitchDown: false,
      rollLeft: false,
      rollRight: false,
      yawLeft: false,
      yawRight: false,
      boost: false,
      shoot: false,
      moveForward: false,
      moveBackward: false,
      moveLeft: false,
      moveRight: false,
    };
    
    this.smoothInput = {
      pitchUp: 0,
      pitchDown: 0,
      rollLeft: 0,
      rollRight: 0,
      yawLeft: 0,
      yawRight: 0,
      boost: false,
      shoot: false,
      moveForward: 0,
      moveBackward: 0,
      moveLeft: 0,
      moveRight: 0,
    };
    this.lerpSpeed = 0.2;
    
    this.pointer = {
      isDown: false,
      startX: 0,
      startY: 0,
      currentX: 0,
      currentY: 0,
      offsetX: 0, // -1 to 1
      offsetY: 0, // -1 to 1
    };
    this.maxJoystickDistance = 100;
    
    this.joystickBase = null;
    this.joystickKnob = null;
    
    // Bind handlers for easy removal in cleanup
    this.keydownHandler = (e) => {
      this.keys[e.key.toLowerCase()] = true;
      this.updateInput();
    };
    this.keyupHandler = (e) => {
      this.keys[e.key.toLowerCase()] = false;
      this.updateInput();
    };
    
    this.mousedownHandler = (e) => this.onPointerDown(e.clientX, e.clientY);
    this.mousemoveHandler = (e) => this.onPointerMove(e.clientX, e.clientY);
    this.mouseupHandler = () => this.onPointerUp();
    
    this.touchstartHandler = (e) => {
      // Don't trigger if touching UI buttons
      if (e.touches.length > 0) {
        this.onPointerDown(e.touches[0].clientX, e.touches[0].clientY);
      }
    };
    this.touchmoveHandler = (e) => {
      if (e.touches.length > 0) {
        this.onPointerMove(e.touches[0].clientX, e.touches[0].clientY);
      }
    };
    this.touchendHandler = () => this.onPointerUp();
    
    this.setupEventListeners();
  }

  setupEventListeners() {
    window.addEventListener('keydown', this.keydownHandler);
    window.addEventListener('keyup', this.keyupHandler);
    
    window.addEventListener('mousedown', this.mousedownHandler);
    window.addEventListener('mousemove', this.mousemoveHandler);
    window.addEventListener('mouseup', this.mouseupHandler);
    
    window.addEventListener('touchstart', this.touchstartHandler, { passive: true });
    window.addEventListener('touchmove', this.touchmoveHandler, { passive: true });
    window.addEventListener('touchend', this.touchendHandler, { passive: true });
  }

  onPointerDown(x, y) {
    // Exclude header back button (top left) and pause button (top right)
    if (y < 80 || x > window.innerWidth - 100) return;
    
    this.pointer.isDown = true;
    this.pointer.startX = x;
    this.pointer.startY = y;
    this.pointer.currentX = x;
    this.pointer.currentY = y;
    this.pointer.offsetX = 0;
    this.pointer.offsetY = 0;
    
    this.createVirtualJoystickDOM(x, y);
    this.updateInput();
  }

  onPointerMove(x, y) {
    if (!this.pointer.isDown) return;
    
    this.pointer.currentX = x;
    this.pointer.currentY = y;
    
    const dx = x - this.pointer.startX;
    const dy = y - this.pointer.startY;
    const dist = Math.hypot(dx, dy);
    
    if (dist === 0) {
      this.pointer.offsetX = 0;
      this.pointer.offsetY = 0;
    } else {
      const clampDist = Math.min(dist, this.maxJoystickDistance);
      const angle = Math.atan2(dy, dx);
      
      this.pointer.offsetX = (Math.cos(angle) * clampDist) / this.maxJoystickDistance;
      this.pointer.offsetY = (Math.sin(angle) * clampDist) / this.maxJoystickDistance;
      
      this.updateVirtualJoystickDOM(dx, dy, clampDist, angle);
    }
    
    this.updateInput();
  }

  onPointerUp() {
    if (!this.pointer.isDown) return;
    this.pointer.isDown = false;
    this.pointer.offsetX = 0;
    this.pointer.offsetY = 0;
    
    this.removeVirtualJoystickDOM();
    this.updateInput();
  }

  createVirtualJoystickDOM(x, y) {
    this.removeVirtualJoystickDOM();
    
    const base = document.createElement('div');
    base.id = 'virtual-joystick-base';
    base.style.position = 'fixed';
    base.style.left = `${x - 45}px`;
    base.style.top = `${y - 45}px`;
    base.style.width = '90px';
    base.style.height = '90px';
    base.style.borderRadius = '50%';
    base.style.border = '2px solid rgba(6, 182, 212, 0.4)';
    base.style.background = 'rgba(0, 0, 0, 0.4)';
    base.style.backdropFilter = 'blur(4px)';
    base.style.pointerEvents = 'none';
    base.style.zIndex = '99999';
    base.style.boxShadow = '0 0 20px rgba(6, 182, 212, 0.15)';
    
    const knob = document.createElement('div');
    knob.id = 'virtual-joystick-knob';
    knob.style.position = 'absolute';
    knob.style.left = '30px';
    knob.style.top = '30px';
    knob.style.width = '30px';
    knob.style.height = '30px';
    knob.style.borderRadius = '50%';
    knob.style.background = 'linear-gradient(135deg, #06b6d4, #14b8a6)';
    knob.style.boxShadow = '0 0 15px rgba(6, 182, 212, 0.8)';
    knob.style.pointerEvents = 'none';
    
    base.appendChild(knob);
    document.body.appendChild(base);
    
    this.joystickBase = base;
    this.joystickKnob = knob;
  }

  updateVirtualJoystickDOM(dx, dy, clampDist, angle) {
    if (!this.joystickKnob) return;
    const kx = 30 + Math.cos(angle) * clampDist * 0.45;
    const ky = 30 + Math.sin(angle) * clampDist * 0.45;
    this.joystickKnob.style.left = `${kx}px`;
    this.joystickKnob.style.top = `${ky}px`;
  }

  removeVirtualJoystickDOM() {
    const base = document.getElementById('virtual-joystick-base');
    if (base) base.remove();
    this.joystickBase = null;
    this.joystickKnob = null;
  }

  pollGamepad() {
    const gamepads = navigator.getGamepads ? navigator.getGamepads() : [];
    const gp = gamepads[0] || gamepads[1] || gamepads[2] || gamepads[3];
    if (!gp) return null;
    
    const steerX = gp.axes[0]; // Left stick X
    const steerY = gp.axes[1]; // Left stick Y
    
    const boostButton = gp.buttons[7]?.pressed || gp.buttons[0]?.pressed || false;
    
    return {
      steerX: Math.abs(steerX) > 0.1 ? steerX : 0,
      steerY: Math.abs(steerY) > 0.1 ? steerY : 0,
      boost: boostButton
    };
  }

  updateInput() {
    this.input.moveForward = false;
    this.input.moveBackward = false;
    this.input.moveLeft = false;
    this.input.moveRight = false;
    this.input.pitchUp = false;
    this.input.pitchDown = false;
    this.input.rollLeft = false;
    this.input.rollRight = false;
    this.input.yawLeft = false;
    this.input.yawRight = false;
    this.input.boost = false;
    
    // Keyboard inputs
    if (this.keys['w'] || this.keys['arrowup']) {
      this.input.moveForward = true;
      this.input.pitchDown = true;
    }
    if (this.keys['s'] || this.keys['arrowdown']) {
      this.input.moveBackward = true;
      this.input.pitchUp = true;
    }
    if (this.keys['a'] || this.keys['arrowleft']) {
      this.input.moveLeft = true;
      this.input.rollLeft = true;
      this.input.yawLeft = true;
    }
    if (this.keys['d'] || this.keys['arrowright']) {
      this.input.moveRight = true;
      this.input.rollRight = true;
      this.input.yawRight = true;
    }
    if (this.keys['q']) this.input.yawLeft = true;
    if (this.keys['e']) this.input.yawRight = true;
    if (this.keys['shift'] || this.keys[' ']) this.input.boost = true;
    
    // Touch/Mouse pointer inputs
    if (this.pointer.isDown) {
      this.input.boost = true;
      this.input.moveForward = true;
      
      const ox = this.pointer.offsetX;
      const oy = this.pointer.offsetY;
      
      if (ox < -0.15) {
        this.input.rollLeft = true;
        this.input.yawLeft = true;
        this.input.moveLeft = true;
      } else if (ox > 0.15) {
        this.input.rollRight = true;
        this.input.yawRight = true;
        this.input.moveRight = true;
      }
      
      if (oy < -0.15) {
        this.input.pitchDown = true;
      } else if (oy > 0.15) {
        this.input.pitchUp = true;
      }
    }
    
    // Gamepad inputs
    const gpInput = this.pollGamepad();
    if (gpInput) {
      if (gpInput.boost) this.input.boost = true;
      this.input.moveForward = true;
      
      const sx = gpInput.steerX;
      const sy = gpInput.steerY;
      
      if (sx < -0.15) {
        this.input.rollLeft = true;
        this.input.yawLeft = true;
        this.input.moveLeft = true;
      } else if (sx > 0.15) {
        this.input.rollRight = true;
        this.input.yawRight = true;
        this.input.moveRight = true;
      }
      
      if (sy < -0.15) {
        this.input.pitchDown = true;
      } else if (sy > 0.15) {
        this.input.pitchUp = true;
      }
    }
    
    // Smooth interpolation
    this.smoothInput.moveForward = this.lerp(this.smoothInput.moveForward || 0, this.input.moveForward ? 1 : 0);
    this.smoothInput.moveBackward = this.lerp(this.smoothInput.moveBackward || 0, this.input.moveBackward ? 1 : 0);
    this.smoothInput.moveLeft = this.lerp(this.smoothInput.moveLeft || 0, this.input.moveLeft ? 1 : 0);
    this.smoothInput.moveRight = this.lerp(this.smoothInput.moveRight || 0, this.input.moveRight ? 1 : 0);
    this.smoothInput.pitchUp = this.lerp(this.smoothInput.pitchUp || 0, this.input.pitchUp ? 1 : 0);
    this.smoothInput.pitchDown = this.lerp(this.smoothInput.pitchDown || 0, this.input.pitchDown ? 1 : 0);
    this.smoothInput.rollLeft = this.lerp(this.smoothInput.rollLeft || 0, this.input.rollLeft ? 1 : 0);
    this.smoothInput.rollRight = this.lerp(this.smoothInput.rollRight || 0, this.input.rollRight ? 1 : 0);
    this.smoothInput.yawLeft = this.lerp(this.smoothInput.yawLeft || 0, this.input.yawLeft ? 1 : 0);
    this.smoothInput.yawRight = this.lerp(this.smoothInput.yawRight || 0, this.input.yawRight ? 1 : 0);
    this.smoothInput.boost = this.input.boost;
    this.smoothInput.shoot = this.input.shoot;
  }

  lerp(current, target) {
    return current + (target - current) * this.lerpSpeed;
  }

  getInput() {
    return this.smoothInput;
  }

  cleanup() {
    window.removeEventListener('keydown', this.keydownHandler);
    window.removeEventListener('keyup', this.keyupHandler);
    
    window.removeEventListener('mousedown', this.mousedownHandler);
    window.removeEventListener('mousemove', this.mousemoveHandler);
    window.removeEventListener('mouseup', this.mouseupHandler);
    
    window.removeEventListener('touchstart', this.touchstartHandler);
    window.removeEventListener('touchmove', this.touchmoveHandler);
    window.removeEventListener('touchend', this.touchendHandler);
    
    this.removeVirtualJoystickDOM();
  }
}
=======
export class Controls {
  constructor() {
    this.keys = {};
    this.input = {
      pitchUp: false,
      pitchDown: false,
      rollLeft: false,
      rollRight: false,
      yawLeft: false,
      yawRight: false,
      boost: false,
      shoot: false,
      // Direct movement controls
      moveForward: false,
      moveBackward: false,
      moveLeft: false,
      moveRight: false,
    };
    
    // Smooth input interpolation - initialize all properties
    this.smoothInput = {
      pitchUp: 0,
      pitchDown: 0,
      rollLeft: 0,
      rollRight: 0,
      yawLeft: 0,
      yawRight: 0,
      boost: false,
      shoot: false,
      moveForward: 0,
      moveBackward: 0,
      moveLeft: 0,
      moveRight: 0,
    };
    this.lerpSpeed = 0.2;
    
    this.setupEventListeners();
  }

  setupEventListeners() {
    window.addEventListener('keydown', (e) => {
      this.keys[e.key.toLowerCase()] = true;
      this.updateInput();
    });

    window.addEventListener('keyup', (e) => {
      this.keys[e.key.toLowerCase()] = false;
      this.updateInput();
    });
  }

  updateInput() {
    // Raw input - W/S for forward/backward, A/D for left/right
    this.input.moveForward = this.keys['w'] || this.keys['arrowup'] || false;
    this.input.moveBackward = this.keys['s'] || this.keys['arrowdown'] || false;
    this.input.moveLeft = this.keys['a'] || this.keys['arrowleft'] || false;
    this.input.moveRight = this.keys['d'] || this.keys['arrowright'] || false;
    
    // Rotation controls (Q/E for yaw, can also use A/D for roll)
    this.input.pitchUp = false; // Not used for movement, only rotation
    this.input.pitchDown = false; // Not used for movement, only rotation
    this.input.rollLeft = this.keys['a'] || false;
    this.input.rollRight = this.keys['d'] || false;
    this.input.yawLeft = this.keys['q'] || false;
    this.input.yawRight = this.keys['e'] || false;
    this.input.boost = this.keys['shift'] || false;
    this.input.shoot = this.keys[' '] || false;
    
    // Smooth interpolation for all inputs
    this.smoothInput.moveForward = this.lerp(this.smoothInput.moveForward || 0, this.input.moveForward ? 1 : 0);
    this.smoothInput.moveBackward = this.lerp(this.smoothInput.moveBackward || 0, this.input.moveBackward ? 1 : 0);
    this.smoothInput.moveLeft = this.lerp(this.smoothInput.moveLeft || 0, this.input.moveLeft ? 1 : 0);
    this.smoothInput.moveRight = this.lerp(this.smoothInput.moveRight || 0, this.input.moveRight ? 1 : 0);
    this.smoothInput.rollLeft = this.lerp(this.smoothInput.rollLeft || 0, this.input.rollLeft ? 1 : 0);
    this.smoothInput.rollRight = this.lerp(this.smoothInput.rollRight || 0, this.input.rollRight ? 1 : 0);
    this.smoothInput.yawLeft = this.lerp(this.smoothInput.yawLeft || 0, this.input.yawLeft ? 1 : 0);
    this.smoothInput.yawRight = this.lerp(this.smoothInput.yawRight || 0, this.input.yawRight ? 1 : 0);
    this.smoothInput.boost = this.input.boost;
    this.smoothInput.shoot = this.input.shoot;
  }

  lerp(current, target) {
    return current + (target - current) * this.lerpSpeed;
  }

  getInput() {
    return this.smoothInput;
  }

  cleanup() {
    window.removeEventListener('keydown', this.updateInput);
    window.removeEventListener('keyup', this.updateInput);
  }
}

>>>>>>> 91789f59d7bf73768e9cdb48b6a41f9a6c3f3de1
