/* ========================================================
   DSA Got Latent — Neo-Brutalist Confetti Engine (Ultra-Light Edition)
   Hardware-accelerated, single-pass canvas poppers with zero CPU lag.
   ======================================================== */

class BrutalistConfettiSystem {
  constructor() {
    this.canvas = null;
    this.ctx = null;
    this.particles = [];
    this.animationFrame = null;
    this.colors = ['#FFE500', '#FFD23F', '#00F0FF', '#FF0055', '#00FF66'];
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
      canvas.style.zIndex = '3'; // Behind the logo (z-index: 10), in front of stage bg (z-index: 0..2)
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
    // Cap pixel ratio to 1.5 to prevent massive 4K canvas redraw lag
    const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
    this.canvas.width = this.width * dpr;
    this.canvas.height = this.height * dpr;
    this.ctx.scale(dpr, dpr);
  }

  /**
   * Fire a single crisp stage corner cannon wave from bottom-left & bottom-right
   */
  fireCornerCannons(opts = {}) {
    if (!this.canvas) this.initCanvas();
    const countPerSide = opts.countPerSide || 22; // Feather-light particle count

    // Bottom-Left Cannon
    for (let i = 0; i < countPerSide; i++) {
      const angle = -(Math.PI * 0.18 + Math.random() * (Math.PI * 0.24));
      const speed = Math.random() * 20 + 16;
      this.spawnParticle({
        x: Math.random() * 20,
        y: this.height,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed * 1.2,
        gravity: 0.55
      });
    }

    // Bottom-Right Cannon
    for (let i = 0; i < countPerSide; i++) {
      const angle = -(Math.PI * 0.58 + Math.random() * (Math.PI * 0.24));
      const speed = Math.random() * 20 + 16;
      this.spawnParticle({
        x: this.width - Math.random() * 20,
        y: this.height,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed * 1.2,
        gravity: 0.55
      });
    }

    if (!this.animationFrame) {
      this.loop();
    }
  }

  spawnParticle(customProps = {}) {
    const isSquare = Math.random() > 0.5;
    this.particles.push({
      x: customProps.x || this.width / 2,
      y: customProps.y || this.height / 2,
      vx: customProps.vx || (Math.random() * 16 - 8),
      vy: customProps.vy || -(Math.random() * 20 + 10),
      gravity: customProps.gravity || 0.55,
      drag: 0.965,
      rotation: Math.random() * 360,
      rotationSpeed: (Math.random() - 0.5) * 12,
      color: this.colors[Math.floor(Math.random() * this.colors.length)],
      width: isSquare ? 10 : 16,
      height: isSquare ? 10 : 7,
      opacity: 1,
      fadeSpeed: Math.random() * 0.018 + 0.015, // Fast ~1.5s cleanup
      wobble: Math.random() * 10,
      wobbleSpeed: 0.1
    });
  }

  burst(opts = {}) {
    if (!this.canvas) this.initCanvas();
    const count = opts.count || 25;
    const originX = (opts.origin && opts.origin.x !== undefined) ? opts.origin.x * this.width : this.width / 2;
    const originY = (opts.origin && opts.origin.y !== undefined) ? opts.origin.y * this.height : this.height * 0.55;

    for (let i = 0; i < count; i++) {
      const angle = (Math.random() * Math.PI) + Math.PI;
      const speed = Math.random() * 18 + 8;
      this.spawnParticle({
        x: originX,
        y: originY,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed * 1.1
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

      if (p.opacity <= 0 || p.y > this.height + 40) {
        this.particles.splice(i, 1);
        continue;
      }

      this.ctx.save();
      this.ctx.translate(p.x, p.y);
      this.ctx.rotate((p.rotation * Math.PI) / 180);
      this.ctx.globalAlpha = Math.max(0, p.opacity);

      // Ultra-fast pure geometric rendering (no font metrics or text measurement)
      const wobbleWidth = p.width * Math.sin(p.wobble);
      this.ctx.fillStyle = p.color;
      this.ctx.fillRect(-wobbleWidth / 2, -p.height / 2, wobbleWidth, p.height);
      this.ctx.lineWidth = 1;
      this.ctx.strokeStyle = '#000000';
      this.ctx.strokeRect(-wobbleWidth / 2, -p.height / 2, wobbleWidth, p.height);

      this.ctx.restore();
    }

    if (this.particles.length > 0) {
      this.animationFrame = requestAnimationFrame(() => this.loop());
    } else {
      this.animationFrame = null;
      this.ctx.clearRect(0, 0, this.width, this.height);
    }
  }

  /**
   * Fire an explosion of confetti directly from behind the center logo!
   * @param {Object} opts
   */
  burstBehindLogo(opts = {}) {
    if (!this.canvas) this.initCanvas();
    const count = opts.count || 45;
    const logo = document.querySelector('.brand-logo');
    let originX = this.width / 2;
    let originY = this.height * 0.44;

    if (logo) {
      const rect = logo.getBoundingClientRect();
      originX = rect.left + rect.width / 2;
      originY = rect.top + rect.height / 2;
    }

    for (let i = 0; i < count; i++) {
      // 360-degree outward explosion around the logo
      const angle = Math.random() * Math.PI * 2;
      const speed = Math.random() * 20 + 8;
      this.spawnParticle({
        x: originX + (Math.random() * 60 - 30),
        y: originY + (Math.random() * 40 - 20),
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed - 3.5, // gentle upward bias
        gravity: 0.45
      });
    }

    if (!this.animationFrame) {
      this.loop();
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

export function burstBehindLogo(opts) {
  getConfetti().burstBehindLogo(opts);
}
