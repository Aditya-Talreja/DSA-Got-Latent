/* ========================================================
   DSA Got Latent — Neo-Brutalist Preloader Lifecycle
   Coordinates loading states, progress counter, asset preloading,
   and fires the celebration confetti explosion.
   ======================================================== */

import { fireCornerCannons, burstConfetti, burstBehindLogo } from './confetti.js';

const STATUS_MESSAGES = [
  'INITIALIZING SYSTEM...',
  'ALLOCATING HEAP & MEMORY...',
  'CALIBRATING SPOTLIGHT BEAMS...',
  'CONNECTING TO LIVE LEADERBOARD...',
  'FETCHING TOPIC INVENTORY...',
  'PREPARING MAIN STAGE // READY!'
];

export function initPreloader() {
  const loaderEl = document.getElementById('brutalist-loader');
  if (!loaderEl) return;

  const pctEl = document.getElementById('loader-pct');
  const barEl = document.getElementById('loader-bar-fill');
  const statusEl = document.getElementById('loader-status');

  let currentPct = 0;
  let isPageLoaded = (document.readyState === 'complete');
  let isFinished = false;

  // Track actual window load event
  if (!isPageLoaded) {
    window.addEventListener('load', () => {
      isPageLoaded = true;
    });
  }

  // Preload primary heavy assets
  const preloadImg = (src) => {
    return new Promise((resolve) => {
      const img = new Image();
      img.onload = img.onerror = resolve;
      img.src = src;
    });
  };

  Promise.all([
    preloadImg('images/logo.png'),
    preloadImg('background/bg.png')
  ]).then(() => {
    isPageLoaded = true;
  });

  // Fast progress ticker (600ms - 900ms total experience)
  const startTime = performance.now();
  const minDuration = 650; // Minimum time to showcase brutalist aesthetic
  const maxTimeout = 1400; // Hard cap so user never waits

  const tick = () => {
    const elapsed = performance.now() - startTime;
    const progressRatio = Math.min(1, elapsed / minDuration);

    if (isPageLoaded || elapsed >= maxTimeout) {
      currentPct = Math.min(100, Math.floor(currentPct + (100 - currentPct) * 0.35 + 3));
    } else {
      currentPct = Math.min(88, Math.floor(progressRatio * 85));
    }

    if (pctEl) pctEl.textContent = `${currentPct}%`;
    if (barEl) barEl.style.width = `${currentPct}%`;

    if (statusEl) {
      const msgIdx = Math.min(
        STATUS_MESSAGES.length - 1,
        Math.floor((currentPct / 100) * STATUS_MESSAGES.length)
      );
      statusEl.textContent = STATUS_MESSAGES[msgIdx];
    }

    if (currentPct >= 100) {
      finishLoader();
    } else {
      requestAnimationFrame(tick);
    }
  };

  requestAnimationFrame(tick);

  function finishLoader() {
    if (isFinished) return;
    isFinished = true;

    // Small hold at 100% for impact
    setTimeout(() => {
       // Explosion of confetti directly from BEHIND the center logo!
       burstBehindLogo({ count: 48 });

       // Animate out the brutalist preloader curtain
       loaderEl.classList.add('loaded');

      // 3. Clean up DOM after transition
      setTimeout(() => {
        loaderEl.style.display = 'none';
      }, 550);
    }, 120);
  }
}
