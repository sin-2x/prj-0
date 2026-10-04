import type { FoodCategory } from '../types/invitation';

const imageParams = '?auto=format&fit=crop&w=900&q=82';

export const foods: FoodCategory[] = [
  {
    id: 'sushi',
    icon: '🍣',
    title: 'Суши',
    description: 'Нәзік роллдар, лосось, нори және әдемі кешке лайық жеңіл дәм.',
    image: `https://images.unsplash.com/photo-1579871494447-9811cf80d66c${imageParams}`,
  },
  {
    id: 'pizza',
    icon: '🍕',
    title: 'Пицца',
    description: 'Ірімшігі созылған, жылы әрі бірге бөлісуге керемет таңдау.',
    image: `https://images.unsplash.com/photo-1513104890138-7c749659a591${imageParams}`,
  },
  {
    id: 'pasta',
    icon: '🍝',
    title: 'Паста',
    description: 'Кремді соус, пармезан және итальяндық романтика.',
    image: `https://images.unsplash.com/photo-1551183053-bf91a1d81141${imageParams}`,
  },
  {
    id: 'steak',
    icon: '🥩',
    title: 'Стейк',
    description: 'Салтанатты кешкі асқа арналған шырынды ет тағамы.',
    image: `https://images.unsplash.com/photo-1546833999-b9f581a1996d${imageParams}`,
  },
  {
    id: 'asian',
    icon: '🍜',
    title: 'Азиялық асхана',
    description: 'Рамен, вок, соустар және ерекше хош иістер.',
    image: `https://images.unsplash.com/photo-1569718212165-3a8278d5f624${imageParams}`,
  },
  {
    id: 'burgers',
    icon: '🍔',
    title: 'Бургерлер',
    description: 'Casual, көңілді және еркін кездесуге арналған дәм.',
    image: `https://images.unsplash.com/photo-1568901346375-23c9450c58cd${imageParams}`,
  },
  {
    id: 'desserts',
    icon: '🍰',
    title: 'Десерттер',
    description: 'Тәтті финал: торт, чизкейк және жұмсақ кофе.',
    image: `https://images.unsplash.com/photo-1578985545062-69928b1d9587${imageParams}`,
  },
  {
    id: 'turkish',
    icon: '🇹🇷',
    title: 'Түрік асханасы',
    description: 'Дәстүрлі түрік тағамдары, кәуап және жылы дастархан.',
    image: `https://images.unsplash.com/photo-1529692236671-f1f6cf9683ba${imageParams}`,
  },
  {
    id: 'kazakh',
    icon: '🇰🇿',
    title: 'Ұлттық тағамдар',
    description: 'Дәстүрлі қазақ тағамдары және үйдегідей жылы дәм.',
    image: `https://images.unsplash.com/photo-1604908176997-125f25cc6f3d${imageParams}`,
  },
  {
    id: 'italian',
    icon: '🇮🇹',
    title: 'Итальян асханасы',
    description: 'Пицца, паста және романтикалық итальян дәмдері.',
    image: `https://images.unsplash.com/photo-1498579150354-977475b7ea0b${imageParams}`,
  },
  {
    id: 'grill',
    icon: '🍖',
    title: 'Ет тағамдары',
    description: 'Гриль, кәуап және хош иісті отта піскен тағамдар.',
    image: `https://images.unsplash.com/photo-1558030006-450675393462${imageParams}`,
  },
  {
    id: 'light',
    icon: '🥗',
    title: 'Жеңіл тағамдар',
    description: 'Салаттар, балғын көкөністер және нәзік жеңіл дәм.',
    image: `https://images.unsplash.com/photo-1512621776951-a57141f2eefd${imageParams}`,
  },
  {
    id: 'coffee',
    icon: '☕',
    title: 'Кофе және тәттілер',
    description: 'Кофе, бәліштер және ұзақ әңгімеге арналған тәттілер.',
    image: `https://images.unsplash.com/photo-1495474472287-4d71bcdd2085${imageParams}`,
  },
];
