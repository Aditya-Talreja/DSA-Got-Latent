/* ========================================================
   DSA Got Latent — Main Application Bootstrap
   ======================================================== */

import { $ } from './utils/dom.js';
import { createParticles, initSpotlights, lockMobileBackground } from './components/background.js';
import { initPreloader } from './components/loader.js';
import { burstConfetti, fireCornerCannons, burstBehindLogo } from './components/confetti.js';
import { CONFIG } from './config.js';

// Launch Neo-Brutalist preloader immediately
initPreloader();

function init() {
  // Background visual effects (stage spotlights & floating fireflies)
  createParticles();
  initSpotlights();
  lockMobileBackground();

  // Interactive Brutalist Confetti triggers
  const logo = $('.brand-logo');
  if (logo) {
    logo.style.cursor = 'pointer';
    logo.addEventListener('click', () => {
      burstBehindLogo({ count: 40 });
    });
  }

  const exploreBtn = $('.scroll-cue');
  if (exploreBtn) {
    exploreBtn.addEventListener('click', () => {
      burstConfetti({ count: 35, origin: { x: 0.5, y: 0.85 } });
    });
  }

  // ── Modal scroll-lock helpers ──────────────────────────
  let savedScrollY = 0;

  function openModal() {
    const modal = document.getElementById('concluded-modal');
    if (!modal) return;
    savedScrollY = window.scrollY;
    document.body.classList.add('modal-open');
    document.body.style.top = `-${savedScrollY}px`;
    modal.classList.add('is-open');
  }

  function closeModal() {
    const modal = document.getElementById('concluded-modal');
    if (!modal) return;
    modal.classList.remove('is-open');
    document.body.classList.remove('modal-open');
    document.body.style.top = '';
    window.scrollTo(0, savedScrollY);
  }

  // ── Modal triggers ────────────────────────────────────
  const regBtn = $('#btn-google-form');
  if (regBtn) {
    regBtn.addEventListener('click', openModal);
  }

  // Modal close — X button
  const modalCloseBtn = $('#modal-close-btn');
  if (modalCloseBtn) {
    modalCloseBtn.addEventListener('click', closeModal);
  }

  // Modal close — clicking backdrop
  const modalOverlay = document.getElementById('concluded-modal');
  if (modalOverlay) {
    modalOverlay.addEventListener('click', (e) => {
      if (e.target === modalOverlay) closeModal();
    });
  }

  // Modal close — Escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeModal();
  });

  // Global helper methods for smooth navigation
  window._app = {
    burstConfetti,
    fireCornerCannons,
    burstBehindLogo,
    scrollToRegister() {
      const reg = $('#register');
      if (reg) reg.scrollIntoView({ behavior: 'smooth' });
    },
    scrollToEvent() {
      const el = $('#event') || $('#event-brutalist') || $('#about');
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    },
    scrollToAbout() {
      const el = $('#event') || $('#event-brutalist') || $('#about');
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    },
    scrollToTeam() {
      const team = $('#team');
      if (team) team.scrollIntoView({ behavior: 'smooth' });
    },
    scrollToTop() {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    },
  };
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}
