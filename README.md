# Cyber Hero Portfolio

A cinematic, interactive cybersecurity portfolio built with React, Vite, and React Three Fiber.

This project presents my work as a SOC-focused cybersecurity practitioner through a command-center inspired interface, real-time style HUD components, searchable project intelligence, and a 3D scene-backed experience.

## Owner

- Name: Voddiraju Sriman Rutvik
- Focus: SOC Analyst and Cybersecurity Specialist
- LinkedIn: <https://www.linkedin.com/in/sriman-rutvik/>
- GitHub: <https://github.com/sriman676>

## Why This Portfolio

Most portfolios show static cards. This one communicates operational mindset.

- A boot-sequence onboarding flow frames the experience like a secure system startup.
- A tactical UI layer (HUD, search, command terminal, narration) keeps interaction active, not passive.
- Content is centralized in one configuration file so updates are fast, consistent, and scalable.

## Core Features

- 3D cyber environment using React Three Fiber and Drei
- Boot sequence with progressive system initialization visuals
- Dynamic navbar with active section tracking and mobile drawer navigation
- Search overlay with fuzzy matching for skills, projects, certifications, and timeline
- Command-style terminal HUD interactions
- Voice narration mode using browser speech synthesis
- Scroll reveal and animated counters for section storytelling
- Defensive error boundaries for UI and scene stability

## Tech Stack

- React 19
- Vite 8
- Three.js + @react-three/fiber + @react-three/drei + @react-three/postprocessing
- Zustand (state management)
- ESLint 9

## Project Structure

```text
cyber-hero-portfolio/
	public/
		icons/
	src/
		3d/
			CyberScene.jsx
			Avatar.jsx
			CursorTrail.jsx
			PostEffects.jsx
		components/
			BootSequence.jsx
			NavBar.jsx
			PortfolioSections.jsx
			SearchOverlay.jsx
			TerminalHUD.jsx
			VoiceNarrator.jsx
			SystemHUD.jsx
			HUD.jsx
		systems/
			store.js
			audio.js
			AudioSystem.jsx
			DeviceController.jsx
		portfolioConfig.js
		App.jsx
		index.css
		main.jsx
```

## Quick Start

### Prerequisites

- Node.js 20+ recommended
- npm 10+ recommended

### Install

```bash
npm install
```

### Run in Development

```bash
npm run dev
```

### Build for Production

```bash
npm run build
```

### Preview Production Build

```bash
npm run preview
```

### Lint

```bash
npm run lint
```

## Content Management

All portfolio content is managed from:

- `src/portfolioConfig.js`

Update this file to edit:

- Personal details and contact
- Skills and category levels
- Certifications and verification links
- Projects, impact statements, and MITRE mappings
- Timeline and narration scripts

## Performance Notes

- 3D scene is lazy-loaded for faster initial rendering.
- Build output is code-split by major vendor bundles.
- Motion-heavy UI includes reduced-motion fallbacks.
- Current production build completes successfully.

## Accessibility Notes

- ARIA labels are present across navigation, dialogs, and key controls.
- Keyboard interactions are supported for search, menu, and shortcuts.
- Reduced-motion preferences are respected in CSS.

## Personal Branding Direction

This portfolio is intentionally opinionated:

- Strong cyber-operations visual identity
- Narrative-led project storytelling instead of generic card grids
- Recruiter-friendly content architecture with technically deep presentation

## Roadmap

- Add multilingual content support for global roles
- Add analytics dashboard for engagement telemetry
- Add test coverage for interaction-critical components
- Add CI workflow for lint/build verification on every push

## Contact

If you want to collaborate, discuss cybersecurity opportunities, or review my work:

- LinkedIn: <https://www.linkedin.com/in/sriman-rutvik/>
- GitHub: <https://github.com/sriman676>

---

Built to represent discipline, speed, and security-first execution.
