# CoinEdge — Live Crypto News

A clean, Vite + React site that displays a **live, auto-scrolling crypto news feed** using a serverless function on Vercel.

## Features
- Serverless API at `/api/rss` that merges headlines from CoinDesk, CoinTelegraph, Decrypt, Bitcoin Magazine, and NewsBTC
- Vertical **auto-scrolling** list with seamless looping
- **Auto-refresh** every 5 minutes
- Fully responsive, modern UI with easy color theming via CSS variables

## Local Development
```bash
npm install
npm run dev
```

## Deploy to Vercel
1. Push or upload this folder to GitHub
2. In Vercel, click **New Project → Continue with GitHub → Select repo**
3. Framework preset: **Vite**
4. Build command: `npm run build`
5. Output directory: `dist`
6. Click **Deploy**

(The `/api/rss` function will deploy automatically as a Serverless Function.)

## Customize
- Colors / spacing: edit `src/styles.css` CSS variables
- Hero copy: `src/App.jsx`
- Feed sources: `api/rss.js`
