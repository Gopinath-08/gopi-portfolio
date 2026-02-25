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

