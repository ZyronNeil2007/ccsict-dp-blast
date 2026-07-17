# CCSICT DP Blast Generator 🚀

**Live Website:** [https://zyronneil2007.github.io/ccsict-dp-blast/](https://zyronneil2007.github.io/ccsict-dp-blast/)

A premium, interactive web application built for the **CCSICT CSBO** to generate custom Display Picture (DP) frames for the S.Y. 2026-2027 opening. Users can upload their photo, adjust it under a transparent frame, and instantly download their official DP for social media.

---

## ✨ Features

- **Role-Based Frames:** Supports 5 roles — Freshie, Sophomore, Junior, Senior, and Faculty — each with its own official DP frame.
- **Twibbonize-Style Interaction:** Fluid drag-and-drop repositioning and smooth zoom controls (mouse wheel & pinch-to-zoom on mobile).
- **Client-Side Processing:** All image processing is handled locally in the browser via the HTML5 Canvas API — no uploads, no server, full privacy.
- **Social Integration:** Built-in Web Share API for directly sharing the generated DP to social media platforms.
- **Responsive Design:** Works beautifully across desktop, tablet, and mobile.

---

## 🛠️ Technologies Used

| Layer | Technology |
|---|---|
| Structure | HTML5 |
| Styling | CSS3 (Vanilla), Bootstrap 5 (layout grid) |
| Logic | JavaScript (Vanilla) |
| Icons | Phosphor Icons |
| Typography | Plus Jakarta Sans (Google Fonts) |
| Image Processing | HTML5 `<canvas>` API |

---

## 🚀 Running Locally

No build tools or servers needed. Just clone and open:

```bash
git clone https://github.com/ZyronNeil2007/ccsict-dp-blast.git
cd ccsict-dp-blast
start index.html
```

---

## 📝 Changelog

### v1.2.0 — UI Polish & Code Quality (2026-07-17)

- **ISU Logo Hierarchy:** ISU logo is now larger (92px hero / 54px footer) and centered between the CCSICT and CSBO logos in both the hero and footer for proper institutional branding.
- **Hero Subtitle Updated:** Updated the hero greeting to reflect A.Y. 2026–2027.
- **Hero Button Cleanup:** Removed icons from the "Generate My DP" and "Source Code" hero CTA buttons — text-only for a cleaner, more minimal look.
- **Logo Reordering:** Logo row order corrected to CCSICT → ISU → CSBO in both hero and footer.
- **Code Cleanup — No Comments:** Removed all HTML, CSS, and JavaScript comments from `index.html`, `styles.css`, and `app.js` for a cleaner, production-ready codebase.
- **Design System Preserved:** All visual styles, animations, and interactions remain intact.

### v1.1.1 — Landing Page Redesign

- **Full Page Layout:** Transformed the single-card layout into a complete landing page with distinct hero, process, generator, and footer sections.
- **Sticky Navbar:** Added a persistent top navigation bar with branding and a Source Code link.
- **Hero Section:** Dedicated hero area with heading, subtitle, and CTA buttons.
- **Process Section:** Added a 3-step "How It Works" card section to guide users.
- **Clean Footer:** Simplified footer with project links, version, and developer credit.

### v1.1.0 — "Pro Max" Edition

- **Cinematic Animations:** Staggered CSS entrance animations (`fadeInUp`) for all UI elements.
- **Advanced Glassmorphism:** Enhanced glass card with ambient shadows and noise textures.
- **Gradient Typography:** Gold-to-green gradient on the "DP Blast" title.
- **Micro-interactions:** Smooth glowing focus rings on inputs/dropdowns and fluid button transitions.
- **Mobile Enhancements:** Perfected responsive layout for all screen sizes.
- **Custom Scrollbar:** Sleek dark Forest Green scrollbar.

---

## 👨‍💻 Developer

Developed by **Zyron Neil Bautista** | CCSICT CSBO

*Version 1.2.0*
