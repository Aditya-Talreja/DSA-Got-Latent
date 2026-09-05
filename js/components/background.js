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

  spotlights.forEach((el, index) => {
    const intervals = [4500, 6500, 8500];
    const interval = intervals[index % intervals.length];

    function moveToRandom(isInitial = false) {
      const vw = window.innerWidth;
      const vh = window.innerHeight;
      const size = el.offsetWidth || 500;
      const x = Math.random() * (vw - size * 0.4) - size * 0.3;
      const y = Math.random() * (vh - size * 0.4) - size * 0.3;

      if (isInitial) {
        el.style.transition = 'none';
        el.style.transform = `translate3d(${x}px, ${y}px, 0)`;
        void el.offsetHeight; // Force reflow
        el.style.transition = '';
      } else {
        el.style.transform = `translate3d(${x}px, ${y}px, 0)`;
      }
    }

    moveToRandom(true);
    setInterval(() => moveToRandom(false), interval);
  });
}
