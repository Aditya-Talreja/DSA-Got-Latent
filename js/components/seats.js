/* ========================================================
   DSA Got Latent — Live Seat Availability Tracker
   Polls the Google Apps Script API every 5 seconds and
   updates the topic grid with real-time seat counts.
   ======================================================== */

const POLL_INTERVAL = 5000; // 5 seconds

let apiUrl = '';
let pollTimer = null;

/**
 * Initialize the seat tracker.
 * @param {string} appsScriptUrl — Deployed Apps Script web-app URL
 */
export function initSeatTracker(appsScriptUrl) {
  if (!appsScriptUrl || appsScriptUrl === 'YOUR_APPS_SCRIPT_URL_HERE') {
    console.warn('[Seats] No Apps Script URL configured — seat tracking disabled.');
    return;
  }

  apiUrl = appsScriptUrl;
  // First fetch immediately, then start polling
  fetchSeats();
  pollTimer = setInterval(fetchSeats, POLL_INTERVAL);
}

/**
 * Fetch seat data from the API and update the DOM.
 */
async function fetchSeats() {
  try {
    const response = await fetch(apiUrl);
    if (!response.ok) throw new Error(`HTTP ${response.status}`);

    const data = await response.json();
    if (data.status !== 'ok' || !Array.isArray(data.topics)) {
      console.warn('[Seats] Unexpected API response:', data);
      return;
    }

    updateTopicGrid(data.topics);
  } catch (err) {
    console.warn('[Seats] Failed to fetch seat data:', err.message);
  }
}

/**
 * Update each .topic-item in the DOM based on API data.
 * @param {Array<{topic: string, capacity: number, registered: number, available: number}>} topics
 */
function updateTopicGrid(topics) {
  const topicItems = document.querySelectorAll('.topic-item[data-topic]');

  topicItems.forEach(item => {
    const topicName = item.getAttribute('data-topic');
    const match = topics.find(t =>
      t.topic.trim().toLowerCase() === topicName.trim().toLowerCase()
    );

    if (!match) return; // No data for this topic yet

    const available = Number(match.available);
    const capacity = Number(match.capacity);
    const registered = Number(match.registered);

    // Update the seat counter badge
    const seatsEl = item.querySelector('.topic-seats');
    if (seatsEl) {
      if (available <= 0) {
        seatsEl.textContent = 'FULL';
        seatsEl.classList.add('seats-full');
        seatsEl.classList.remove('seats-low');
      } else if (available <= 3) {
        seatsEl.textContent = `${available}/${capacity}`;
        seatsEl.classList.add('seats-low');
        seatsEl.classList.remove('seats-full');
      } else {
        seatsEl.textContent = `${available}/${capacity}`;
        seatsEl.classList.remove('seats-low', 'seats-full');
      }
    }

    // Update the status badge
    const statusEl = item.querySelector('.topic-status');
    if (statusEl) {
      if (available <= 0) {
        statusEl.textContent = 'NOT AVAILABLE';
        item.classList.add('topic-full');
      } else {
        statusEl.textContent = 'AVAILABLE';
        item.classList.remove('topic-full');
      }
    }
  });
}

/**
 * Stop polling (cleanup).
 */
export function stopSeatTracker() {
  if (pollTimer) {
    clearInterval(pollTimer);
    pollTimer = null;
  }
}
