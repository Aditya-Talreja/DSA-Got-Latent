/* ========================================================
   DSA Got Latent — Main Application Bootstrap
   ======================================================== */

import { $ } from './utils/dom.js';
import { createParticles, initSpotlights } from './components/background.js';
import { initSeatTracker } from './components/seats.js';

import { CONFIG } from './config.js';

function init() {
  // Background visual effects (stage spotlights & floating fireflies)
  createParticles();
  initSpotlights();

  // Live seat availability polling (fetches from Google Sheets via Apps Script)
  initSeatTracker(CONFIG.APPS_SCRIPT_URL);

  // Global helper methods for smooth navigation
  window._app = {
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
