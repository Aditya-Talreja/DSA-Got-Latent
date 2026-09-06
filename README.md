# DSA's Got Latent 🎭⚡

> **A Teaching & Creative Visualization Challenge Beyond Conventional Coding.**  
> Organized by **DSA Community [DSAC]**, VIT Bhopal.

---

## 📌 About The Event

**DSA's Got Latent** takes Data Structures and Algorithms beyond compilers and problem-solving platforms onto the live stage. Participants pick an algorithmic topic, explore its real-world intuitions, and build tangible creative representations (posters, working physical/digital models, diagrams, or live demonstrations).

During the live showcase, participants teach their topic completely from scratch, evaluated on **conceptual clarity, teaching ability, creativity, visual representation, and communication**. 

### ⚡ The Latent Gambit (Winner-Take-All Rule)
To raise the stakes, teams predict their own score before the judges reveal it. If their predicted score matches the final judges' score, the team wins the challenge!

---

## 🎨 Visual Design System

The application is built around a bespoke **Cinematic Neo-Brutalist & Swiss Typography** aesthetic:
- **Atmospheric Stage Backdrop**: Deep crimson theater velvet curtains with dynamic, pointer-responsive spotlight cutouts and ambient floating fireflies.
- **Obsidian Noir Surfaces (`#0B0B0E`)**: Dark architecture framed by razor-sharp brutalist outlines and corner brackets.
- **Electric Stage Gold (`#F5B800`)**: Radiant, high-voltage golden accents, masthead ribbons, and metric tags.
- **Dual-Layered Brutalist Shadows**:
  ```css
  box-shadow: 12px 12px 0px #000000, 14px 14px 0px #F5B800;
  ```
  Provides high-contrast physical depth that clearly defines every card against dark stage lighting.
- **Display Typography**: **`Syne` (800 Weight)** paired with technical **`Space Mono`** metadata coordinates and readable **`Inter`** narrative copy.

---

## 🏛 Page Architecture & Sections

1. **Hero Section (`#hero`)**:
   - Illuminated 3D stage brand logo centered under animated ambient spotlights.
   - Brutalist **`EXPLORE OUR EVENT ↓`** button anchored to smooth-scroll downward.

2. **Event Showcase Card (`#event`)**:
   - Masthead ribbon (`DSA Community [DSAC]` // `DSA'S GOT LATENT`).
   - 4 Event Metric Pillars: `Team Size (1–4)`, `Location (AB1 Mini Auditorium)`, `Date (13 Sept 2026)`, `Time (2PM – 5PM)`.
   - Core premise manifesto card with golden accent bar.
   - Two-column protocol grid:
     - **Phase 01: 1-Week Visual Sprint** (`Posters`, `Models`, `Diagrams`, `Demos`, `Analogies`).
     - **Phase 02: Live Stage Defense** (`Clarity`, `Teaching`, `Creativity`, `Visuals`, `Communication`).
   - Standout **Latent Gambit** score-prediction rule callout.

3. **Registration Portal Card (`#register`)**:
   - 4-Tier Pricing Grid:
     - `01 / SOLO`: **₹29** (1 Contender, 2 Minutes)
     - `02 / DUO`: **₹49** (2 Innovators, 3 Minutes)
     - `03 / TRIO`: **₹69** (3 Innovators, 4 Minutes)
     - `04 / SQUAD`: **₹89** (4 Innovators, 5 Minutes)
   - 10-Topic Curated Challenge Grid with directions (Two Pointer, Sliding Window, Binary Search, Linked List, Stack and Queue, Hashing, Tries, Greedy Approaches, Heaps, Binary Trees).
   - Standout allocation disclaimer (`Teams per topic are limited, register fast to avail your preferred topic`).
   - Direct CTA button: **`REGISTER VIA GOOGLE FORMS ↗`**.

4. **Know Our Team Card (`#team`)**:
   - Faculty Leadership: Faculty Coordinator & Faculty Co-Coordinator with college email links.
   - Student Core Team: Community President, General Secretary, and Coordinator with college email links.
   - Official Instagram Channel banner linking to [`@dsac.vit`](https://www.instagram.com/dsac.vit).
   - Dedicated 24/7 query assistance callout box.

---

## 📂 File Structure

```text
├── index.html              # Main single-page semantic HTML structure
├── styles.css              # Master stylesheet index
├── app.js                  # ES Module root entry point
├── .gitignore              # Git ignore configuration
├── README.md               # Project documentation
│
├── background/
│   └── bg.png              # Stage curtain background asset
│
├── images/
│   └── logo.png            # DSA Got Latent illuminated brand logo
│
├── css/
│   ├── brutalist.css       # Complete Neo-Brutalist design system & cards
│   ├── stage.css           # Spotlights, curtain overlay & particle system
│   ├── variables.css       # Color tokens, fonts & spacing scales
│   ├── views.css           # Hero section, brand logo & footer layout
│   └── responsive.css      # Global mobile viewport optimizations
│
└── js/
    ├── app.js              # Application bootstrap & smooth-scroll helpers
    ├── components/
    │   └── background.js   # Dynamic spotlight tracking & particle engine
    └── utils/
        └── dom.js          # Lightweight DOM query helpers
```

---

## 🚀 Running Locally

The website requires no build tools or package dependencies—it runs directly on any modern web browser or lightweight HTTP server:

```bash
# Using npx serve (recommended)
npx -y serve .

# Or using Python 3
python -m http.server 3000
```

Open **`http://localhost:3000`** in your browser.

---

## 👥 Leadership & Credits

- **Faculty Coordinator**: [Faculty Coordinator Name] (`faculty.coordinator@college.edu`)
- **Faculty Co-Coordinator**: [Faculty Co-Coordinator Name] (`faculty.cocoordinator@college.edu`)
- **Community President**: Sejal Mishra (`sejal.24bce11199@vitbhopal.ac.in`)
- **General Secretary**: Akshat Singh (`akshat.24bce10004@vitbhopal.ac.in`)
- **Event Coordinator**: Divyansh Varshney (`divyansh.24bce11063@vitbhopal.ac.in`)
- **Instagram**: [@dsac.vit](https://www.instagram.com/dsac.vit)

---

© 2026 **DSA Community [DSAC]** • Learn. Build. Teach.
