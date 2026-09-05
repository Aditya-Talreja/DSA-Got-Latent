/* ========================================================
   DSA Got Latent — Main Application Bootstrap
   ======================================================== */

import { $ } from './utils/dom.js';
import { createParticles, initSpotlights } from './components/background.js';
import { initSeatTracker } from './components/seats.js';
import { initPreloader } from './components/loader.js';
import { burstConfetti, fireCornerCannons } from './components/confetti.js';
import { CONFIG } from './config.js';

// Launch Neo-Brutalist preloader immediately
initPreloader();

function init() {
  // Background visual effects (stage spotlights & floating fireflies)
  createParticles();
  initSpotlights();

  // Live seat availability polling (fetches from Google Sheets via Apps Script)
  initSeatTracker(CONFIG.APPS_SCRIPT_URL);

  // Interactive Brutalist Confetti triggers
  const logo = $('.brand-logo');
  if (logo) {
    logo.style.cursor = 'pointer';
    logo.addEventListener('click', (e) => {
      const rect = logo.getBoundingClientRect();
      burstConfetti({
        count: 40,
        origin: {
          x: (rect.left + rect.width / 2) / window.innerWidth,
          y: (rect.top + rect.height / 2) / window.innerHeight
        }
      });
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
    scrollToRegister() {
      const reg = $('#register');
      if (reg) reg.scrollIntoView({ behavior: 'smooth' });
    },
    scrollToAbout() {
      const about = $('#event-brutalist') || $('#about');
      if (about) about.scrollIntoView({ behavior: 'smooth' });
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
