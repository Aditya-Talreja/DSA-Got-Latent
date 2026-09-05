/* ========================================================
   DSA Got Latent — Background Stage Effects (Fireflies & Spotlights)
   ======================================================== */

import { $, $$ } from '../utils/dom.js';

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
  const spotlights = $$('.spotlight-hole, .spotlight');
  if (!spotlights.length) return;

  const vw = window.innerWidth;
  const vh = window.innerHeight;

  spotlights.forEach((el, index) => {
    // 1. PIN IMMEDIATELY at initial stage coordinates with NO transition
    // Dynamic centering based on element's actual rendered size (scaled on mobile)
    const size = el.offsetWidth || (index === 1 ? 580 : index === 2 ? 440 : 500);
    const half = size / 2;

    const initialPositions = [
      { x: vw * 0.5 - half, y: vh * 0.42 - half },  // Center logo
      { x: vw * 0.22 - half, y: vh * 0.46 - half }, // Stage Left
      { x: vw * 0.78 - half, y: vh * 0.38 - half }  // Stage Right
    ];

    const initPos = initialPositions[index % initialPositions.length];
    let currentX = initPos.x;
    let currentY = initPos.y;

    el.style.transition = 'none';
    el.style.transform = `translate3d(${currentX}px, ${currentY}px, 0)`;
    void el.offsetHeight; // Flush layout so it's guaranteed locked in place

    // Pick a new major destination on stage
    function pickNewTarget() {
      const curSize = el.offsetWidth || size;
      const curVw = window.innerWidth;
      const curVh = window.innerHeight;
      const isMobile = curVw <= 768;

      // 50% bias towards center stage / golden logo
      const biasCenter = Math.random() < 0.5;
      let targetX, targetY;

      if (biasCenter) {
        const spreadX = isMobile ? 120 : 260;
        const spreadY = isMobile ? 80 : 180;
        targetX = (curVw / 2 - curSize / 2) + (Math.random() * spreadX - spreadX / 2);
        targetY = (curVh * 0.42 - curSize / 2) + (Math.random() * spreadY - spreadY / 2);
      } else {
        targetX = Math.random() * (curVw - curSize * 0.4) - curSize * 0.3;
        targetY = Math.random() * (curVh - curSize * 0.4) - curSize * 0.3;
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
        // Snappy hunting micro-offsets around the spot (proportional on mobile)
        const isMobile = window.innerWidth <= 768;
        const jxRange = isMobile ? 22 : 46;
        const jyRange = isMobile ? 18 : 36;
        const jx = (Math.random() - 0.5) * jxRange;
        const jy = (Math.random() - 0.5) * jyRange;
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
