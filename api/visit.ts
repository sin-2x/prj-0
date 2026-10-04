interface VercelRequest {
  method?: string;
  body?: unknown;
  headers?: Record<string, string | string[] | undefined>;
}

declare const process: {
  env: Record<string, string | undefined>;
};

interface VercelResponse {
  status: (code: number) => VercelResponse;
  json: (body: unknown) => void;
}

interface VisitBody {
  url?: unknown;
  referrer?: unknown;
  userAgent?: unknown;
  language?: unknown;
  platform?: unknown;
  timezone?: unknown;
  screen?: unknown;
  viewport?: unknown;
  colorDepth?: unknown;
  devicePixelRatio?: unknown;
  openedAt?: unknown;
}

interface ValidVisitBody {
  url: string;
  referrer: string;
  userAgent: string;
  language: string;
  platform: string;
  timezone: string;
  screen: string;
  viewport: string;
  colorDepth: number;
  devicePixelRatio: number;
  openedAt: string;
}

function isVisitBody(value: unknown): value is ValidVisitBody {
  if (!value || typeof value !== 'object') return false;
  const body = value as VisitBody;

  return (
    typeof body.url === 'string' &&
    typeof body.referrer === 'string' &&
    typeof body.userAgent === 'string' &&
    typeof body.language === 'string' &&
    typeof body.platform === 'string' &&
    typeof body.timezone === 'string' &&
    typeof body.screen === 'string' &&
    typeof body.viewport === 'string' &&
    typeof body.colorDepth === 'number' &&
    typeof body.devicePixelRatio === 'number' &&
    typeof body.openedAt === 'string'
  );
}

function getHeader(req: VercelRequest, name: string): string {
  const value = req.headers?.[name.toLowerCase()] ?? req.headers?.[name];
  if (Array.isArray(value)) return value[0] ?? '';
  return value ?? '';
}

function trimUserAgent(userAgent: string): string {
  return userAgent.length > 260 ? `${userAgent.slice(0, 260)}...` : userAgent;
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    res.status(405).json({ ok: false });
    return;
  }

  if (!isVisitBody(req.body)) {
    res.status(400).json({ ok: false });
    return;
  }

  const token = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;

  if (!token || !chatId) {
    res.status(500).json({ ok: false });
    return;
  }

  const ip = getHeader(req, 'x-forwarded-for').split(',')[0]?.trim() || 'unknown';
  const country = getHeader(req, 'x-vercel-ip-country') || 'unknown';
  const region = getHeader(req, 'x-vercel-ip-country-region') || 'unknown';
  const city = decodeURIComponent(getHeader(req, 'x-vercel-ip-city') || 'unknown');

  const body = req.body;
  const text = [
    'Сайт ашылды',
    `Уақыты: ${body.openedAt}`,
    `URL: ${body.url}`,
    `Referrer: ${body.referrer}`,
    `IP: ${ip}`,
    `Орны: ${city}, ${region}, ${country}`,
    `Тіл: ${body.language}`,
    `Timezone: ${body.timezone}`,
    `Platform: ${body.platform}`,
    `Screen: ${body.screen}`,
    `Viewport: ${body.viewport}`,
    `DPR: ${body.devicePixelRatio}`,
    `Color depth: ${body.colorDepth}`,
    `User-Agent: ${trimUserAgent(body.userAgent)}`,
  ].join('\n');

  const telegramResponse = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ chat_id: chatId, text }),
  });

  if (!telegramResponse.ok) {
    res.status(502).json({ ok: false });
    return;
  }

  res.status(200).json({ ok: true });
}
