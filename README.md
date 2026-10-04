# Кездесуге шақыру

Premium romantic invitation built with React, TypeScript, Vite, Tailwind CSS, Framer Motion and a Vercel serverless API route.

## Run locally

```bash
npm install
npm run dev
```

## Build

```bash
npm run build
```

## Telegram setup

1. Create a bot with BotFather.
2. Get the bot token.
3. Get your Telegram chat ID.
4. Add these Vercel Environment Variables:

```txt
TELEGRAM_BOT_TOKEN
TELEGRAM_CHAT_ID
```

5. Redeploy the Vercel project.

The token is used only inside `api/invitation.ts` and is never sent to the frontend.
