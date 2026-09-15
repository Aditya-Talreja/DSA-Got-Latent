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

  const regBtn = $('#btn-google-form');
  if (regBtn) {
    regBtn.addEventListener('click', () => {
      const modal = document.getElementById('concluded-modal');
      if (modal) modal.classList.add('is-open');
    });
  }

  // Modal close — X button
  const modalCloseBtn = $('#modal-close-btn');
  if (modalCloseBtn) {
    modalCloseBtn.addEventListener('click', () => {
      const modal = document.getElementById('concluded-modal');
      if (modal) modal.classList.remove('is-open');
    });
  }

  // Modal close — clicking backdrop
  const modalOverlay = document.getElementById('concluded-modal');
  if (modalOverlay) {
    modalOverlay.addEventListener('click', (e) => {
      if (e.target === modalOverlay) modalOverlay.classList.remove('is-open');
    });
  }

  // Modal close — Escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      const modal = document.getElementById('concluded-modal');
      if (modal) modal.classList.remove('is-open');
    }
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
