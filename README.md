# 🎨 QuickDoodle — AI-Powered Real-Time Drawing & Guessing Game

QuickDoodle is a fast, fun and modern **real-time drawing & guessing web game** inspired by Skribbl.io.
Draw on a shared canvas, guess words, compete in **private rooms or global rooms**, and enjoy themed prompts and creative rounds.

<img width="1653" height="855" alt="Screenshot 2026-07-23 at 10 57 53 AM" src="https://github.com/user-attachments/assets/10be6ffe-1777-4aae-ac6d-e874772fa2de" />

🧠 **Built-in AI Support:** QuickDoodle includes AI-powered drawing analysis and guessing through locally hosted LLMs (such as Ollama). Running AI locally avoids cloud API costs, rate limits, RPM/RPD restrictions, latency issues, and external service dependencies while providing a more private and developer-friendly experience.

---

## ✨ Features (Frontend)

* ⚡ Built with **Next.js + TypeScript**
* 🎮 Real-time drawing & guessing using **Socket.IO Client**
* 🖌️ Interactive HTML canvas with smooth pens & eraser tools
* 🌐 Private rooms or **global public rooms**
* 🧩 Word prompts & theme-based drawing rounds
* 🧭 Modern UI + responsive layout
* 🔥 Powered by **Turbopack** (Next.js dev bundler) for super-fast development reloads
* 🤖 AI-powered drawing guessing using locally hosted LLMs (Ollama)
* 🔒 Privacy-friendly AI processing with no cloud AI dependency

---

## 🛠️ Tech Stack

| Category       | Tools Used                      |
| -------------- | ------------------------------- |
| Framework      | Next.js (App Router)            |
| Language       | TypeScript                      |
| Real-time Sync | Socket.IO Client                |
| Styling / UI   | Tailwind CSS, custom components |
| AI Integration | Ollama (Local LLMs)             |
| Dev Bundler    | Turbopack (Next.js)             |

---

## 📦 Installation & Running Locally

1. Install dependencies:

```bash
npm install
# or
yarn
# or
pnpm install
# or
bun install
```

2. Run development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

3. Open your browser & navigate to:

👉 [http://localhost:3000](http://localhost:3000)

The app auto-reloads on file changes thanks to **Next.js + Turbopack**.

---

## 📁 Project Structure

```
/src
├── app                     # Next.js App Router
│   ├── game                # Page route: /game/[roomid]
│   ├── globals.css
│   ├── layout.tsx          # Root layout
│   ├── not-found.tsx       # 404 handler
│   └── page.tsx            # Landing page
│
├── components              # Reusable UI components
│   ├── Alert
│   ├── Button
│   ├── Loader
│   ├── Modal
│   ├── Toggle
│   ├── Tooltip
│   └── gamePage            # Game-specific UI
│
├── context                 # React context providers (Theme, Game state... soon)
│
├── hooks
│   └── useSocket.ts        # Custom Socket.IO hook (frontend)
│
├── lib
│   └── socket.ts           # Socket instance + config
│
├── types                   # TypeScript types
│   ├── app
│   │   ├── Alert
│   │   ├── Button
│   │   ├── Game
│   │   ├── Modal
│   │   ├── Toggle
│   │   └── Tooltip
│   └── auth
│
└── views                   # Page-level view components
    ├── app
    │   ├── GamePage
    │   └── LandingPage
    └── auth

```

---

## 🌍 Backend Repository

> The backend (Node.js + Socket.IO + MongoDB) handles room logic, game state & events.

🔗 *[Backend repo link](https://github.com/UsmanDevCraft/quick_doodle_backend)*

---

## 🤖 Local AI Integration

QuickDoodle supports AI-powered drawing guessing through locally hosted language models using **Ollama**.

### Why Local AI?

Instead of relying on cloud AI providers, the AI runs directly on your machine:

- No API costs
- No RPM (Requests Per Minute) limitations
- No RPD (Requests Per Day) limitations
- Lower latency during gameplay
- Better privacy and data control
- Works without external AI subscriptions
- Easy experimentation with different open-source models

This makes QuickDoodle ideal for development, testing, personal deployments, and AI experimentation without worrying about cloud usage limits or recurring costs.

---

## 🤝 Contributions

Feel free to open issues or PRs — suggestions and improvements are welcome!

---

## 🧠 Future Enhancements (Planned)

* Smarter AI agents with improved drawing interpretation
* Multiple AI personalities and difficulty levels
* Save past rounds / game history
* AI-vs-Human game modes
* Custom community word packs

---

### ⭐ If you like the project, give the repo a star 🙂!

---
