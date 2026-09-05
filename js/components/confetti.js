/* ========================================================
   DSA Got Latent — Neo-Brutalist Confetti Engine
   High-performance canvas particle system featuring
   bottom-left & bottom-right corner stage cannons,
   sharp geometric shapes, code glyphs, and bold backdrop shadows.
   ======================================================== */

class BrutalistConfettiSystem {
  constructor() {
    this.canvas = null;
    this.ctx = null;
    this.particles = [];
    this.animationFrame = null;
    this.colors = ['#FFE500', '#FFD23F', '#00F0FF', '#FF0055', '#00FF66', '#FFFFFF'];
    this.symbols = ['{ }', '</>', '[ ]', '⚡', '★', '▲', '■', '++', '01', '&&'];
    this.initCanvas();
  }

  initCanvas() {
    if (typeof window === 'undefined') return;
    let canvas = document.getElementById('brutalist-confetti-canvas');
    if (!canvas) {
      canvas = document.createElement('canvas');
      canvas.id = 'brutalist-confetti-canvas';
      canvas.style.position = 'fixed';
      canvas.style.inset = '0';
      canvas.style.width = '100%';
      canvas.style.height = '100%';
      canvas.style.pointerEvents = 'none';
      canvas.style.zIndex = '99999';
      document.body.appendChild(canvas);
    }
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    this.resize();
    window.addEventListener('resize', () => this.resize());
  }

  resize() {
    if (!this.canvas) return;
    this.width = window.innerWidth;
    this.height = window.innerHeight;
    this.canvas.width = this.width * window.devicePixelRatio;
    this.canvas.height = this.height * window.devicePixelRatio;
    this.ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
  }

  /**
   * Fire stage cannons from bottom-left and bottom-right corners!
   * @param {Object} opts
   */
  fireCornerCannons(opts = {}) {
    if (!this.canvas) this.initCanvas();
    const countPerSide = opts.countPerSide || 55;

    // ── 1. BOTTOM-LEFT CORNER CANNON (shoots up & towards center-right) ──
    for (let i = 0; i < countPerSide; i++) {
      // Angle between ~ -25deg and -70deg (pointing up-right into the viewport)
      const angle = -(Math.PI * 0.16 + Math.random() * (Math.PI * 0.28));
      const speed = Math.random() * 26 + 18;
      this.spawnParticle({
        x: Math.random() * 30,
        y: this.height - Math.random() * 20,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed * 1.25,
        drag: 0.962,
        gravity: 0.48 + Math.random() * 0.22
      });
    }

    // ── 2. BOTTOM-RIGHT CORNER CANNON (shoots up & towards center-left) ──
    for (let i = 0; i < countPerSide; i++) {
      // Angle between ~ -110deg and -155deg (pointing up-left into the viewport)
      const angle = -(Math.PI * 0.56 + Math.random() * (Math.PI * 0.28));
      const speed = Math.random() * 26 + 18;
      this.spawnParticle({
        x: this.width - Math.random() * 30,
        y: this.height - Math.random() * 20,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed * 1.25,
        drag: 0.962,
        gravity: 0.48 + Math.random() * 0.22
      });
    }

    if (!this.animationFrame) {
      this.loop();
    }
  }

  /**
   * Helper to spawn a single particle with randomized brutalist geometry.
   */
  spawnParticle(customProps = {}) {
    const typeRand = Math.random();
    let type = 'rect';
    if (typeRand < 0.38) type = 'square';
    else if (typeRand < 0.72) type = 'rect';
    else type = 'symbol';

    this.particles.push({
      x: customProps.x || this.width / 2,
      y: customProps.y || this.height / 2,
      vx: customProps.vx || (Math.random() * 20 - 10),
      vy: customProps.vy || -(Math.random() * 25 + 10),
      gravity: customProps.gravity || (0.52 + Math.random() * 0.22),
      drag: customProps.drag || 0.965,
      rotation: Math.random() * 360,
      rotationSpeed: (Math.random() - 0.5) * 16,
      color: this.colors[Math.floor(Math.random() * this.colors.length)],
      size: Math.random() * 13 + 9,
      width: Math.random() * 16 + 10,
      height: Math.random() * 9 + 6,
      type: type,
      symbol: this.symbols[Math.floor(Math.random() * this.symbols.length)],
      opacity: 1,
      fadeSpeed: Math.random() * 0.012 + 0.007,
      wobble: Math.random() * 10,
      wobbleSpeed: Math.random() * 0.12 + 0.06
    });
  }

  /**
   * General burst from specific origin.
   */
  burst(opts = {}) {
    if (!this.canvas) this.initCanvas();
    const count = opts.count || 60;
    const originX = (opts.origin && opts.origin.x !== undefined) ? opts.origin.x * this.width : this.width / 2;
    const originY = (opts.origin && opts.origin.y !== undefined) ? opts.origin.y * this.height : this.height * 0.55;

    for (let i = 0; i < count; i++) {
      const angle = (Math.random() * Math.PI) + Math.PI; // upward arc
      const speed = Math.random() * 22 + 10;
      this.spawnParticle({
        x: originX + (Math.random() * 50 - 25),
        y: originY + (Math.random() * 30 - 15),
        vx: Math.cos(angle) * speed + (Math.random() * 6 - 3),
        vy: Math.sin(angle) * speed * 1.3 - 4
      });
    }

    if (!this.animationFrame) {
      this.loop();
    }
  }

  loop() {
    this.ctx.clearRect(0, 0, this.width, this.height);

    for (let i = this.particles.length - 1; i >= 0; i--) {
      const p = this.particles[i];
      p.vx *= p.drag;
      p.vy = p.vy * p.drag + p.gravity;
      p.x += p.vx;
      p.y += p.vy;
      p.rotation += p.rotationSpeed;
      p.wobble += p.wobbleSpeed;
      p.opacity -= p.fadeSpeed;

      if (p.opacity <= 0 || p.y > this.height + 60) {
        this.particles.splice(i, 1);
        continue;
      }

      this.ctx.save();
      this.ctx.translate(p.x, p.y);
      this.ctx.rotate((p.rotation * Math.PI) / 180);
      this.ctx.globalAlpha = Math.max(0, p.opacity);

      if (p.type === 'square') {
        // Neo-Brutalist stroked square
        this.ctx.fillStyle = p.color;
        this.ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size);
        this.ctx.lineWidth = 1.5;
        this.ctx.strokeStyle = '#000000';
        this.ctx.strokeRect(-p.size / 2, -p.size / 2, p.size, p.size);
      } else if (p.type === 'rect') {
        // Neo-Brutalist ticket strip with 3D wobble
        const wobbleWidth = p.width * Math.sin(p.wobble);
        this.ctx.fillStyle = p.color;
        this.ctx.fillRect(-wobbleWidth / 2, -p.height / 2, wobbleWidth, p.height);
        this.ctx.lineWidth = 1;
        this.ctx.strokeStyle = '#000000';
        this.ctx.strokeRect(-wobbleWidth / 2, -p.height / 2, wobbleWidth, p.height);
      } else if (p.type === 'symbol') {
        // Monospace tech/code glyph with brutalist punch
        this.ctx.font = `bold ${Math.round(p.size * 1.35)}px "Space Mono", monospace`;
        this.ctx.fillStyle = p.color;
        this.ctx.textAlign = 'center';
        this.ctx.textBaseline = 'middle';
        this.ctx.lineWidth = 2.5;
        this.ctx.strokeStyle = '#000000';
        this.ctx.strokeText(p.symbol, 0, 0);
        this.ctx.fillText(p.symbol, 0, 0);
      }

      this.ctx.restore();
    }

    if (this.particles.length > 0) {
      this.animationFrame = requestAnimationFrame(() => this.loop());
    } else {
      this.animationFrame = null;
      this.ctx.clearRect(0, 0, this.width, this.height);
    }
  }
}

let instance = null;

export function getConfetti() {
  if (!instance) {
    instance = new BrutalistConfettiSystem();
  }
  return instance;
}

export function burstConfetti(opts) {
  getConfetti().burst(opts);
}

export function fireCornerCannons(opts) {
  getConfetti().fireCornerCannons(opts);
}
