# 🎨 QuickDoodle — Frontend

QuickDoodle is a fast, fun and modern **real-time drawing & guessing web game** inspired by Skribbl.io.
Draw on a shared canvas, guess words, compete in **private rooms or global rooms**, and enjoy themed prompts and creative rounds.

🧠 *Future Plans:* AI agent bots that can guess drawings and allow solo mode.

---

## ✨ Features (Frontend)

* ⚡ Built with **Next.js + TypeScript**
* 🎮 Real-time drawing & guessing using **Socket.IO Client**
* 🖌️ Interactive HTML canvas with smooth pens & eraser tools
* 🌐 Private rooms or **global public rooms**
* 🧩 Word prompts & theme-based drawing rounds
* 🧭 Modern UI + responsive layout
* 🔥 Powered by **Turbopack** (Next.js dev bundler) for super-fast development reloads

---

## 🛠️ Tech Stack

| Category       | Tools Used                      |
| -------------- | ------------------------------- |
| Framework      | Next.js (App Router)            |
| Language       | TypeScript                      |
| Real-time Sync | Socket.IO Client                |
| Styling / UI   | Tailwind CSS, custom components |
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

## 🤝 Contributions

Feel free to open issues or PRs — suggestions and improvements are welcome!

---

## 🧠 Future Enhancements (Planned)

* AI guessing bot
* Solo mode with AI interaction
* Save past rounds / game history

---

### ⭐ If you like the project, give the repo a star 🥹!

---
