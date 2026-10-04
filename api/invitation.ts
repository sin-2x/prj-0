interface VercelRequest {
  method?: string;
  body?: unknown;
}

declare const process: {
  env: Record<string, string | undefined>;
};

interface VercelResponse {
  status: (code: number) => VercelResponse;
  json: (body: unknown) => void;
}

interface SubmissionBody {
  date?: unknown;
  time?: unknown;
  foods?: Array<{ title?: unknown }>;
  restaurant?: { name?: unknown };
  customRestaurantName?: unknown;
}

interface ValidSubmissionBody {
  date: string;
  time: string;
  foods: Array<{ title: string }>;
  restaurant: { name: string };
  customRestaurantName?: string;
}

function isSubmissionBody(value: unknown): value is ValidSubmissionBody {
  if (!value || typeof value !== 'object') return false;
  const body = value as SubmissionBody;

  return (
    typeof body.date === 'string' &&
    typeof body.time === 'string' &&
    Array.isArray(body.foods) &&
    body.foods.length > 0 &&
    body.foods.every((food) => typeof food.title === 'string') &&
    typeof body.restaurant?.name === 'string' &&
    (body.customRestaurantName === undefined || typeof body.customRestaurantName === 'string')
  );
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    res.status(405).json({ ok: false });
    return;
  }

  if (!isSubmissionBody(req.body)) {
    res.status(400).json({ ok: false });
    return;
  }

  const body = req.body;
  const token = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;

  if (!token || !chatId) {
    res.status(500).json({ ok: false });
    return;
  }

  const restaurantName = body.customRestaurantName?.trim() || body.restaurant.name;
  const text = [
    'Кездесу расталды',
    `Күн: ${body.date}`,
    `Уақыт: ${body.time}`,
    `Тағамдар: ${body.foods.map((food) => food.title).join(', ')}`,
    `Мейрамхана: ${restaurantName}`,
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
