/* ========================================================
   DSA Got Latent — Background Stage Effects (Fireflies & Spotlights)
   ======================================================== */

import { $ } from '../utils/dom.js';

export function createParticles() {
  const container = $('#particles');
  if (!container) return;

  const isMobile = window.innerWidth <= 768;
  const count = isMobile ? 9 : 18;
  for (let i = 0; i < count; i++) {
    const particle = document.createElement('div');
    particle.className = 'particle';
    particle.style.left = Math.random() * 100 + '%';
    particle.style.top = Math.random() * 100 + '%';
    particle.style.animationDuration = (Math.random() * 4 + 3.5) + 's';
    particle.style.animationDelay = Math.random() * 6 + 's';
    const size = Math.random() * 1.8 + 1.5;
    particle.style.width = size + 'px';
    particle.style.height = size + 'px';
    container.appendChild(particle);
  }
}

export function initSpotlights() {
  // ── Canvas-based spotlight system ──────────────────────────────────────────
  // Replaces DOM element + filter:blur + mix-blend-mode approach (which breaks
  // GPU compositing). Uses a single canvas with globalCompositeOperation to punch
  // soft-edged holes in a dark overlay, with smooth lerp movement instead of
  // setTimeout jitter — zero DOM style recalculations, full 60fps.

  const container = document.querySelector('.stage-bg-container');
  if (!container) return;

  // Disable the old DOM mask layer — canvas takes over
  const maskLayer = document.getElementById('spotlight-mask-layer');
  if (maskLayer) {
    maskLayer.style.backgroundColor = 'transparent';
    maskLayer.style.mixBlendMode = 'normal';
    // Hide legacy DOM spotlight holes (canvas renders them)
    maskLayer.querySelectorAll('.spotlight-hole').forEach(el => {
      el.style.display = 'none';
    });
  }

  // Create the canvas overlay at the same z-index as the old mask layer
  const canvas = document.createElement('canvas');
  canvas.id = 'spotlight-canvas';
  canvas.style.cssText = [
    'position:absolute', 'top:0', 'left:0',
    'width:100%', 'height:100%',
    'pointer-events:none', 'z-index:2'
  ].join(';');
  container.appendChild(canvas);

  const ctx = canvas.getContext('2d');
  let W = 0, H = 0;

  function resize() {
    W = window.innerWidth;
    H = window.innerHeight;
    const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
    canvas.width  = Math.round(W * dpr);
    canvas.height = Math.round(H * dpr);
    // setTransform resets + scales fresh — avoids compounding scale on resize
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }
  resize();
  window.addEventListener('resize', resize);

  // 3 spotlights: cx/cy in CSS px, radius, lerp speed, current target
  const spots = [
    { cx: 0, cy: 0, tx: 0, ty: 0, r: 250, spd: 0.028 },  // Center
    { cx: 0, cy: 0, tx: 0, ty: 0, r: 285, spd: 0.022 },  // Stage Left
    { cx: 0, cy: 0, tx: 0, ty: 0, r: 215, spd: 0.034 },  // Stage Right
  ];

  // Seed initial positions
  function seed() {
    spots[0].cx = spots[0].tx = W * 0.50;  spots[0].cy = spots[0].ty = H * 0.42;
    spots[1].cx = spots[1].tx = W * 0.22;  spots[1].cy = spots[1].ty = H * 0.46;
    spots[2].cx = spots[2].tx = W * 0.78;  spots[2].cy = spots[2].ty = H * 0.38;
  }
  seed();

  function pickTarget(s) {
    const isMobile = W <= 768;
    if (Math.random() < 0.55) {
      // Bias toward center stage
      const sx = isMobile ? 130 : 270, sy = isMobile ? 90 : 190;
      s.tx = W * 0.5 + (Math.random() * sx - sx / 2);
      s.ty = H * 0.42 + (Math.random() * sy - sy / 2);
    } else {
      s.tx = W * 0.08 + Math.random() * W * 0.84;
      s.ty = H * 0.08 + Math.random() * H * 0.74;
    }
  }

  // Each spotlight picks a new target on its own staggered interval
  spots.forEach((s, i) => {
    // Stagger first picks so they don't all move simultaneously
    setTimeout(() => {
      pickTarget(s);
      setInterval(() => pickTarget(s), 3200 + i * 600 + Math.random() * 800);
    }, i * 900 + 600);
  });

  function drawFrame() {
    ctx.clearRect(0, 0, W, H);

    // ── 1. Fill dark stage atmosphere ──────────────────────────
    ctx.globalCompositeOperation = 'source-over';
    ctx.fillStyle = 'rgba(6, 3, 3, 0.78)';
    ctx.fillRect(0, 0, W, H);

    // ── 2. Punch spotlight holes via destination-out ───────────
    // destination-out erases the dark fill wherever we draw,
    // letting the background image show through — same visual result
    // as the old mix-blend-mode:multiply + white circle, but GPU-friendly.
    ctx.globalCompositeOperation = 'destination-out';

    spots.forEach(s => {
      // Smooth lerp toward target — no discrete jumps, no setTimeout chains
      s.cx += (s.tx - s.cx) * s.spd;
      s.cy += (s.ty - s.cy) * s.spd;

      const r = s.r;
      const grd = ctx.createRadialGradient(s.cx, s.cy, 0, s.cx, s.cy, r);

      // Multi-stop falloff curve tuned to match filter:blur(8px) softness
      // on a ~250-285px circle. Derived from Gaussian kernel approximation.
      grd.addColorStop(0.00, 'rgba(0,0,0,1.00)');
      grd.addColorStop(0.28, 'rgba(0,0,0,0.97)');
      grd.addColorStop(0.48, 'rgba(0,0,0,0.88)');
      grd.addColorStop(0.63, 'rgba(0,0,0,0.70)');
      grd.addColorStop(0.76, 'rgba(0,0,0,0.45)');
      grd.addColorStop(0.86, 'rgba(0,0,0,0.22)');
      grd.addColorStop(0.93, 'rgba(0,0,0,0.08)');
      grd.addColorStop(0.97, 'rgba(0,0,0,0.02)');
      grd.addColorStop(1.00, 'rgba(0,0,0,0.00)');

      ctx.fillStyle = grd;
      ctx.beginPath();
      ctx.arc(s.cx, s.cy, r, 0, Math.PI * 2);
      ctx.fill();
    });

    // Reset composite for next frame
    ctx.globalCompositeOperation = 'source-over';

    requestAnimationFrame(drawFrame);
  }

  drawFrame();
}

/**
 * Locks the stage background container height on mobile devices to prevent
 * the background image from zooming, resizing, or jumping when the mobile
 * browser address bar collapses/expands on scroll.
 */
export function lockMobileBackground() {
  const bgContainer = $('.stage-bg-container');
  if (!bgContainer) return;

  function updateBgDimensions() {
    const isMobile = window.innerWidth <= 768 || ('ontouchstart' in window);
    if (!isMobile) {
      bgContainer.style.height = '';
      bgContainer.style.minHeight = '';
      return;
    }

    const maxH = Math.max(
      window.innerHeight,
      window.screen?.height || 0,
      window.visualViewport?.height || 0
    );
    bgContainer.style.height = `${maxH}px`;
    bgContainer.style.minHeight = `${maxH}px`;
  }

  updateBgDimensions();

  window.addEventListener('orientationchange', () => {
    setTimeout(updateBgDimensions, 300);
  });

  let lastW = window.innerWidth;
  window.addEventListener('resize', () => {
    if (Math.abs(window.innerWidth - lastW) > 50) {
      lastW = window.innerWidth;
      updateBgDimensions();
    }
  });
}
