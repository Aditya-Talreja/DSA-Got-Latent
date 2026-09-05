/* ========================================================
   DSA Got Latent — Neo-Brutalist Preloader Lifecycle
   Coordinates loading states, progress counter, asset preloading,
   and fires the celebration confetti explosion.
   ======================================================== */

import { fireCornerCannons, burstConfetti, burstBehindLogo } from './confetti.js';

const STATUS_MESSAGES = [
  'INITIALIZING SYSTEM...',
  'ALLOCATING HEAP & MEMORY...',
  'FETCHING STAGE CURTAINS & ASSETS...',
  'CALIBRATING SPOTLIGHT BEAMS...',
  'DECODING HIGH-RES TEXTURES...',
  'PREPARING MAIN STAGE // READY!'
];

export function initPreloader() {
  const loaderEl = document.getElementById('brutalist-loader');
  if (!loaderEl) return;

  const pctEl = document.getElementById('loader-pct');
  const barEl = document.getElementById('loader-bar-fill');
  const statusEl = document.getElementById('loader-status');

  let currentPct = 0;
  let isFinished = false;
  let isStageAssetsReady = false;

  // Strict asset preloader with full GPU decode validation
  const preloadAndDecode = (src) => {
    return new Promise((resolve) => {
      const img = new Image();
      img.src = src;

      const onLoaded = () => {
        // img.decode() guarantees the image is fully parsed & ready in GPU memory
        if ('decode' in img) {
          img.decode().then(resolve).catch(resolve);
        } else {
          resolve();
        }
      };

      if (img.complete) {
        onLoaded();
      } else {
        img.onload = onLoaded;
        img.onerror = resolve; // Fail-safe: don't permanently brick on error
      }
    });
  };

  // Wait for both the heavy background curtain and the illuminated brand logo
  const stageAssetsPromise = Promise.all([
    preloadAndDecode('background/bg.webp'),
    preloadAndDecode('images/logo.webp')
  ]).then(() => {
    isStageAssetsReady = true;
  });

  // Generous safety cap (10s) only in case of complete network freeze, never rushing
  const maxEmergencyTimeout = 10000;
  const startTime = performance.now();
  const minDisplayDuration = 600; // Minimum time to showcase brutalist aesthetic when cached

  const tick = () => {
    const elapsed = performance.now() - startTime;

    if (!isStageAssetsReady && elapsed < maxEmergencyTimeout) {
      // ── PHASE 1: ASSETS STILL DOWNLOADING (First open) ──
      // Smoothly progress up to 86%, then wait at 86-88% until bg.webp is 100% loaded & decoded
      const loadingProgress = Math.min(86, Math.floor((elapsed / 1200) * 85));
      if (currentPct < loadingProgress) {
        currentPct++;
      }
      if (statusEl) {
        statusEl.textContent = elapsed > 1200 
          ? 'SYNCHRONIZING STAGE CURTAINS & LIGHTS...' 
          : STATUS_MESSAGES[Math.min(3, Math.floor(elapsed / 400))];
      }
    } else {
      // ── PHASE 2: ASSETS FULLY DECODED (or cached on second visit) ──
      // Rapidly and smoothly glide from currentPct all the way to 100%
      const speed = isStageAssetsReady ? 0.35 : 0.2;
      currentPct = Math.min(100, Math.floor(currentPct + (100 - currentPct) * speed + 3));

      if (statusEl) {
        if (currentPct >= 96) {
          statusEl.textContent = STATUS_MESSAGES[5]; // PREPARING MAIN STAGE // READY!
        } else {
          statusEl.textContent = STATUS_MESSAGES[4]; // DECODING HIGH-RES TEXTURES...
        }
      }
    }

    if (pctEl) pctEl.textContent = `${currentPct}%`;
    if (barEl) barEl.style.width = `${currentPct}%`;

    if (currentPct >= 100 && (isStageAssetsReady || elapsed >= maxEmergencyTimeout)) {
      finishLoader();
    } else {
      requestAnimationFrame(tick);
    }
  };

  requestAnimationFrame(tick);

  function finishLoader() {
    if (isFinished) return;
    isFinished = true;

    // Flush DOM layout on spotlights so they are guaranteed locked before curtain lift
    const spotlights = document.querySelectorAll('.spotlight-hole');
    spotlights.forEach(el => void el.offsetHeight);

    // Small hold at 100% for impact
    setTimeout(() => {
      // Celebration confetti explosion directly from behind the center logo
      burstBehindLogo({ count: 48 });

      // Animate out the brutalist preloader curtain
      loaderEl.classList.add('loaded');

      // Clean up DOM after transition finishes
      setTimeout(() => {
        loaderEl.style.display = 'none';
      }, 550);
    }, 120);
  }
}
