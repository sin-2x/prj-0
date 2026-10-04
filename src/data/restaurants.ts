import type { Restaurant } from '../types/invitation';

export const restaurants: Restaurant[] = [
  {
    id: 'terrace-garden',
    name: 'Terrace Garden',
    description: 'Гүлдер, жұмсақ жарық және тыныш әңгімеге арналған романтикалық терраса атмосферасы.',
    address: 'Жылы терраса, кешкі жарық, жайлы үстел',
    image: '/restourant/Terrace garden restorant.jpg',
  },
  {
    id: 'neo',
    name: 'Neo Restaurant',
    description: 'Заманауи интерьер, әдемі сервировка және ерекше кездесуді кинодағыдай сезіндіретін кеңістік.',
    address: 'City mood, premium dinner, soft lights',
    image: '/restourant/restaurant-neo.jpg',
  },
  {
    id: 'premium-lounge',
    name: 'Premium Lounge',
    description: 'Тыныш lounge, шампан түсті жарық және тек екеумізге арналған салтанатты кеш сезімі.',
    address: 'Lounge атмосферасы, жайлы дивандар, әсем музыка',
    image: '/restourant/Premium-lounge.jpg',
  },
  {
    id: 'her-choice',
    name: 'Өзіңіз таңдаңыз',
    description: 'Егер осы жерлердің орнына басқа бір кафе ұнаса, таңдау толық сіздікі. Қай жер десеңіз де, мен үшін ең маңыздысы сізбен бірге болу.',
    address: 'Сіздің таңдауыңыз, мен қуана келісемін',
    image: '/restourant/Terrace garden restorant.jpg',
  },
];
