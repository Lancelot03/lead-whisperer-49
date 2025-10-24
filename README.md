
# 🚀 Lead Whisperer

![Build Status](https://img.shields.io/badge/build-passing-brightgreen?style=flat-square)
![License](https://img.shields.io/badge/license-MIT-blue?style=flat-square)
![Made with](https://img.shields.io/badge/Made%20with-React%20+%20Vite-61DAFB?style=flat-square&logo=react)

Lead Whisperer is a **modern lead management and engagement tool** built with **React**, **TypeScript**, **Vite**, **Tailwind CSS**, and **shadcn-ui**.  
It helps you capture, analyze, and act on potential customer data with a smooth, responsive interface.

---

## 🖼️ Preview

**URL**: https://lead-whisperer-49.lovable.app

---

## ✨ Features

- ⚡ **Blazing Fast** – Built with Vite for instant development feedback.  
- 🎨 **Beautiful UI** – Styled with Tailwind CSS + shadcn-ui for modern, responsive layouts.  
- 🧠 **Type-Safe Development** – 100% written in TypeScript.  
- 📊 **Lead Insights Dashboard** – Track performance and engagement visually.  
- 🔄 **API Ready** – Integrate easily with REST or GraphQL backends.  
- 🧩 **Modular Architecture** – Extend or reuse components effortlessly.  

---

## ⚙️ Installation

```bash
# Clone the repository
git clone https://github.com/Lancelot03/lead-whisperer-49.git

# Navigate to project directory
cd lead-whisperer-49

# Install dependencies
npm install

# Run the app in development mode
npm run dev

# Build for production
npm run build

# Preview the production build
npm run preview
```
## 🧰 Tech Stack

| Layer           | Tools / Libraries                          |
|-----------------|-------------------------------------------|
| Build & Bundler | Vite                                      |
| Language        | TypeScript                                 |
| UI Framework    | React (with functional components/hooks)  |
| Styling         | Tailwind CSS + shadcn-ui                  |
| Configuration   | `tsconfig.json`, `tsconfig.app.json`, `tsconfig.node.json` |
| Linting & Format| ESLint with `eslint.config.js`            |
| Deployment      | Static-friendly (Netlify / Vercel / GitHub Pages, etc) |


## 🏁 Getting Started

### Prerequisites  
Make sure you have **Node.js** (v16 +) and **npm** or **yarn** installed.

### Installation  
```bash
git clone https://github.com/Lancelot03/lead-whisperer-49.git
cd lead-whisperer-49
npm install        # or: yarn install
npm run dev        # start development server
npm run build      # build for production
npm run preview    # preview production build locally
```
### 🧾 Environment Variables

Create a .env file in the project root and configure your environment variables:

`VITE_API_BASE_URL=https://your-api-url.com`

`VITE_APP_ENV=development`

### Configuration

Duplicate the `.env.example` (or `create .env`) to set environment variables (API keys, back-end endpoints, etc).

Update `vite.config.ts`, `tsconfig.app.json`, or other config files if you need to customize aliases, paths, or build targets.

📁 Project Structure

---

### 🧭 Folder Highlights

| Folder | Purpose |
|--------|----------|
| `components/ui/` | Contains small, reusable, design-focused UI components built using Tailwind and shadcn-ui. |
| `components/layout/` | Defines structural components like headers, sidebars, and footers for consistent page layout. |
| `pages/` | Houses top-level views mapped to routes (Home, Leads, Analytics, Settings). |
| `hooks/` | Contains custom logic hooks for state and UI handling. |
| `lib/` | Manages utility functions, constants, and API service integrations. |
| `styles/` | Handles Tailwind and global CSS settings. |

---

### 💡 Pro Tips
- Use **`npm run lint`** to check code quality.  
- Organize new components in the `components/ui` folder and export them via `index.ts`.  
- Keep reusable logic in `hooks` and avoid state duplication across pages.  
- For backend/API integration, extend the `lib/api.ts` module with your endpoints.  

---

### 🧑‍💻 Usage Guide

Run locally with npm run dev and visit `http://localhost:5173`.

Add new pages in `/src/pages`.

Create reusable components under `/src/components/ui`.

Customize theme via `tailwind.config.ts`.

Integrate API by modifying `/src/lib/api.ts`.

---

### 💬 Contact

Author: Harsh Singh

📧 Email: `harshsinghop3@gmail.com`

🌐 GitHub: `Lancelot03`
