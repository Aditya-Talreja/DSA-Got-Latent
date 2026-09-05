/* ========================================================
   DSA Got Latent — Background Stage Effects (Fireflies & Spotlights)
   ======================================================== */

import { $, $$ } from '../utils/dom.js';

export function createParticles() {
  const container = $('#particles');
  if (!container) return;

  const count = 18;
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
  const spotlights = $$('.spotlight-hole, .spotlight');
  if (!spotlights.length) return;

  const vw = window.innerWidth;
  const vh = window.innerHeight;

  // Preset initial aesthetic stage coordinates (Center, Stage Left, Stage Right)
  const initialPositions = [
    { x: vw * 0.5 - 250, y: vh * 0.42 - 250 },  // Center logo
    { x: vw * 0.22 - 290, y: vh * 0.46 - 290 }, // Stage Left
    { x: vw * 0.78 - 220, y: vh * 0.38 - 220 }  // Stage Right
  ];

  spotlights.forEach((el, index) => {
    // 1. PIN IMMEDIATELY at initial stage coordinates with NO transition
    // This happens synchronously at frame 0, so no spotlight is ever stuck at (0,0) or seen jumping!
    const initPos = initialPositions[index % initialPositions.length];
    let currentX = initPos.x;
    let currentY = initPos.y;

    el.style.transition = 'none';
    el.style.transform = `translate3d(${currentX}px, ${currentY}px, 0)`;
    void el.offsetHeight; // Flush layout so it's guaranteed locked in place

    // Pick a new major destination on stage
    function pickNewTarget() {
      const size = el.offsetWidth || 500;
      const curVw = window.innerWidth;
      const curVh = window.innerHeight;

      // 50% bias towards center stage / golden logo
      const biasCenter = Math.random() < 0.5;
      let targetX, targetY;

      if (biasCenter) {
        targetX = (curVw / 2 - size / 2) + (Math.random() * 260 - 130);
        targetY = (curVh * 0.42 - size / 2) + (Math.random() * 180 - 90);
      } else {
        targetX = Math.random() * (curVw - size * 0.4) - size * 0.3;
        targetY = Math.random() * (curVh - size * 0.4) - size * 0.3;
      }

      return { targetX, targetY };
    }

    // ── STEP 1: FAST MOVE TO NEW LOCATION WITH VISIBLE TRAVEL (~0.8s - 1.1s) ──
    function sweepToNewTarget() {
      const { targetX, targetY } = pickNewTarget();
      currentX = targetX;
      currentY = targetY;

      const moveDuration = (Math.random() * 300 + 800) / 1000; // 0.8s - 1.1s
      el.style.transition = `transform ${moveDuration}s cubic-bezier(0.22, 1, 0.36, 1)`;
      el.style.transform = `translate3d(${currentX}px, ${currentY}px, 0)`;

      // After arrival, begin the jittering phase
      setTimeout(() => {
        startJitterPhase(currentX, currentY);
      }, moveDuration * 1000);
    }

    // ── STEP 2: STAY AT PLACE & JITTER AROUND IT ─────────────
    function startJitterPhase(baseX, baseY) {
      // Jitter 6 to 10 times around this spot
      const jitterCount = Math.floor(Math.random() * 5) + 6;
      let step = 0;

      function doJitter() {
        if (step >= jitterCount) {
          // Finished jittering at this place! Sweep smoothly to a new place!
          sweepToNewTarget();
          return;
        }

        step++;
        // Snappy hunting micro-offsets around the spot
        const jx = (Math.random() - 0.5) * 46; // ±23px
        const jy = (Math.random() - 0.5) * 36; // ±18px
        const jitterSpeed = (Math.random() * 60 + 150) / 1000; // 0.15s - 0.21s fast jitter

        el.style.transition = `transform ${jitterSpeed}s cubic-bezier(0.25, 0.46, 0.45, 0.94)`;
        el.style.transform = `translate3d(${baseX + jx}px, ${baseY + jy}px, 0)`;

        setTimeout(doJitter, jitterSpeed * 1000 + Math.random() * 50);
      }

      doJitter();
    }

    // Start with jitter in their initial resting spot, then sweep smoothly!
    setTimeout(() => {
      startJitterPhase(currentX, currentY);
    }, index * 400);
  });
}
