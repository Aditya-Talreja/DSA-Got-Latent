/* ========================================================
   DSA Got Latent — Main Application Bootstrap
   ======================================================== */

import { $ } from './utils/dom.js';
import { createParticles, initSpotlights, lockMobileBackground } from './components/background.js';
import { initSeatTracker } from './components/seats.js';
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

  // Live seat availability polling (fetches from Google Sheets via Apps Script)
  initSeatTracker(CONFIG.APPS_SCRIPT_URL, CONFIG.POLL_INTERVAL_MS);

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
      burstConfetti({ count: 60, origin: { x: 0.5, y: 0.7 } });
    });
  }

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
