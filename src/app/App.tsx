import { AnimatePresence, motion } from 'framer-motion';
import { ArrowLeft, ArrowRight, CalendarDays, Check, ChevronLeft, ChevronRight, Clock, Gem, Heart, Music2, Send, Sparkles, Utensils } from 'lucide-react';
import { useEffect, useMemo, useState, type ReactNode } from 'react';
import { RomanticBackground } from '../components/background/RomanticBackground';
import { PageTransition } from '../components/transitions/PageTransition';
import { Button } from '../components/ui/Button';
import { ProgressIndicator } from '../components/ui/ProgressIndicator';
import { foods } from '../data/foods';
import { restaurants } from '../data/restaurants';
import { useInvitation } from '../hooks/useInvitation';
import { useRomanticMelody } from '../hooks/useRomanticMelody';
import { submitInvitation, trackVisit } from '../lib/api/invitation';
import { MIN_DATE, timeOptions } from '../lib/constants';
import { cn, formatDate } from '../lib/utils';
import type { FoodCategory, Restaurant, Step } from '../types/invitation';

const backMap: Partial<Record<Step, Step>> = {
  message: 'intro',
  question: 'message',
  date: 'question',
  time: 'date',
  food: 'time',
  restaurant: 'food',
  summary: 'restaurant',
};

const monthNames = [
  'Қаңтар',
  'Ақпан',
  'Наурыз',
  'Сәуір',
  'Мамыр',
  'Маусым',
  'Шілде',
  'Тамыз',
  'Қыркүйек',
  'Қазан',
  'Қараша',
  'Желтоқсан',
];

const weekdayNames = ['Дс', 'Сс', 'Ср', 'Бс', 'Жм', 'Сн', 'Жк'];

export function App() {
  const invitation = useInvitation();
  const { state, patch, setStep, toggleFood, reset, selectedFoods, selectedRestaurant, submission } = invitation;
  const [error, setError] = useState('');
  const [sending, setSending] = useState(false);
  const [noAttempts, setNoAttempts] = useState(0);
  const [noPosition, setNoPosition] = useState({ x: 0, y: 0 });
  useRomanticMelody(true);

  useEffect(() => {
    void trackVisit({
      url: window.location.href,
      referrer: document.referrer || 'direct',
      userAgent: navigator.userAgent,
      language: navigator.language,
      platform: navigator.platform,
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      screen: `${window.screen.width}x${window.screen.height}`,
      viewport: `${window.innerWidth}x${window.innerHeight}`,
      colorDepth: window.screen.colorDepth,
      devicePixelRatio: window.devicePixelRatio,
      openedAt: new Date().toISOString(),
    }).catch(() => undefined);
  }, []);

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;
  }, [state.step]);

  const goBack = () => {
    const previous = backMap[state.step];
    if (previous) setStep(previous);
  };

  const moveNoButton = () => {
    const viewportWidth = typeof window === 'undefined' ? 390 : window.innerWidth;
    const maxX = Math.min(124, Math.max(42, (viewportWidth - 280) / 2));
    const maxY = viewportWidth < 640 ? 54 : 42;
    const direction = noAttempts % 2 === 0 ? 1 : -1;
    const nextX = direction * (maxX * (0.55 + Math.random() * 0.45));
    const nextY = (Math.random() > 0.5 ? 1 : -1) * (maxY * (0.45 + Math.random() * 0.55));

    setNoAttempts((count) => count + 1);
    setNoPosition({ x: nextX, y: nextY });
  };

  const confirm = async () => {
    if (!submission) {
      setError('Барлық таңдауларды әдемілеп толық белгілейік.');
      return;
    }

    setSending(true);
    setError('');
    try {
      await submitInvitation(submission);
      patch({ sent: true, step: 'success' });
    } catch {
      setError('Жіберу сәтсіз болды. Тағы бір рет байқап көрейік.');
    } finally {
      setSending(false);
    }
  };

  return (
    <main className="relative min-h-svh overflow-x-hidden text-[#4a1629]">
      <RomanticBackground />
      <ProgressIndicator step={state.step} />
      {backMap[state.step] && (
        <button
          aria-label="Артқа"
          onClick={goBack}
          className="fixed left-5 top-5 z-30 inline-flex h-11 w-11 items-center justify-center rounded-full border border-rose/25 bg-white/55 text-[#5b1b32] shadow-sm backdrop-blur-xl transition hover:bg-white/80 focus:outline-none focus-visible:ring-2 focus-visible:ring-burgundy"
        >
          <ArrowLeft size={18} />
        </button>
      )}

      <AnimatePresence mode="wait">
        {state.step === 'intro' && (
          <PageTransition key="intro">
            <div className="mx-auto max-w-3xl text-center">
              <PremiumSticker />
              <motion.p className="mb-6 text-xs uppercase tracking-[0.35em] text-burgundy/55" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.15 }}>
                кішкентай құпия
              </motion.p>
              <motion.h1 className="font-serif text-5xl leading-tight text-[#4a1629] sm:text-7xl" initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
                Саған бір нәрсе айтқым келген еді...
              </motion.h1>
              <motion.p className="mx-auto mt-6 max-w-xl text-base leading-8 text-[#6d3145] sm:text-lg" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.52 }}>
                Жай ғана мәтін емес, кішкентай тосынсый сияқты ашылсын дедім.
              </motion.p>
              <motion.div className="mt-10" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.72 }}>
                <Button onClick={() => setStep('message')} className="w-52 bg-[#5b1b32] text-white hover:bg-[#6d203c]">
                  Ашу <Heart size={17} />
                </Button>
              </motion.div>
            </div>
          </PageTransition>
        )}

        {state.step === 'message' && <SecondPageMessage onNext={() => setStep('question')} />}

        {false && state.step === 'message' && (
          <PageTransition key="message">
            <div className="mx-auto max-w-2xl text-center">
              <PremiumSticker small />
              <p className="font-serif text-3xl leading-relaxed text-[#4a1629] sm:text-5xl">
                Сенімен өткізетін әр сәттің өз жылуы бар.
              </p>
              <p className="mx-auto mt-8 max-w-xl text-lg leading-9 text-[#6d3145]">
                Сондықтан бүгінгі кешті жай жоспар емес, әдемі естелікке айналдырғым келеді.
              </p>
              <Button onClick={() => setStep('question')} className="mt-10 bg-[#5b1b32] text-white hover:bg-[#6d203c]">
                Келесі <ArrowRight size={17} />
              </Button>
            </div>
          </PageTransition>
        )}

        {state.step === 'question' && (
          <PageTransition key="question">
            <div className="relative mx-auto flex min-h-[calc(100svh-5rem)] w-full max-w-3xl flex-col items-center justify-center text-center sm:min-h-[520px]">
              <PremiumSticker small />
              <motion.div
                className="mb-5 inline-flex items-center gap-2 rounded-full border border-rose/20 bg-white/65 px-4 py-2 text-xs font-bold uppercase tracking-[0.18em] text-[#7c2d48] shadow-sm backdrop-blur-xl"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.35 }}
              >
                <Music2 size={15} /> music on
              </motion.div>
              <h2 className="font-serif text-[2rem] leading-tight text-[#4a1629] sm:text-6xl">
                Сізді бір әдемі кездесуге шақырсам қалай болады? 🥺👉👈
              </h2>
              <p className="mt-3 text-lg font-semibold text-[#8a3650] sm:mt-5 sm:text-xl">Жоқ демесеңіз.. 🥹❤️</p>
              <div className="mt-6 flex w-full flex-col items-center gap-3 sm:mt-10 sm:gap-4">
                <Button onClick={() => setStep('date')} className="w-56 bg-[#5b1b32] text-white hover:bg-[#6d203c]">
                  Иә, барамын <Heart size={17} />
                </Button>
                <div className="relative h-28 w-full max-w-[520px] overflow-visible sm:h-36">
                  <motion.button
                    type="button"
                    className="absolute left-1/2 top-1/2 inline-flex min-h-12 w-60 items-center justify-center rounded-full border border-[#5b1b32]/25 bg-white px-5 text-sm font-bold text-[#5b1b32] shadow-[0_14px_35px_rgba(91,27,50,0.16)] backdrop-blur-xl transition-colors hover:bg-[#fff6fa] focus:outline-none focus-visible:ring-2 focus-visible:ring-burgundy"
                    animate={{ x: noPosition.x - 120, y: noPosition.y - 24 }}
                    transition={{ type: 'spring', stiffness: 320, damping: 22 }}
                    onPointerEnter={moveNoButton}
                    onPointerDown={(event) => {
                      event.preventDefault();
                      moveNoButton();
                    }}
                    onFocus={moveNoButton}
                  >
                    {noAttempts > 2 ? 'Жоқ демеңізші өтініш ❤️' : noAttempts > 0 ? 'Өтініш, иә деңізші 🥹' : 'Жоқ демеңізші өтініш'}
                  </motion.button>
                  <motion.div
                    aria-hidden="true"
                    className="pointer-events-none absolute bottom-1 left-1/2 -translate-x-1/2 rounded-full bg-white/70 px-4 py-2 text-sm font-semibold text-[#8a3650] shadow-sm backdrop-blur-xl"
                    animate={{ y: [0, -4, 0], opacity: [0.78, 1, 0.78] }}
                    transition={{ duration: 2.2, repeat: Infinity, ease: 'easeInOut' }}
                  >
                    🥺💌
                  </motion.div>
                </div>
              </div>
            </div>
          </PageTransition>
        )}

        {state.step === 'date' && (
          <PageTransition key="date">
            <Panel icon={<CalendarDays />} title="Айналу күнін таңдайық" subtitle="10.10.2026 күнінен бастап әдемі бір күнді белгілейміз.">
              <CalendarPicker selectedDate={state.date} onSelect={(date) => patch({ date })} />
              <Button disabled={!state.date || state.date < MIN_DATE} onClick={() => setStep('time')} className="mt-6 w-full bg-[#5b1b32] text-white hover:bg-[#6d203c]">
                Уақытқа өту <ArrowRight size={17} />
              </Button>
            </Panel>
          </PageTransition>
        )}

        {state.step === 'time' && (
          <PageTransition key="time">
            <Panel icon={<Clock />} title="Қай уақыт айналуға ыңғайлы?" subtitle="Уақытты таңдаңыз">
              <div className="grid gap-2 sm:grid-cols-2 sm:gap-3">
                {timeOptions.map((time) => (
                  <button
                    key={time}
                    onClick={() => patch({ time })}
                    className={cn(
                      'group flex h-14 items-center justify-between rounded-2xl border px-4 text-left transition focus:outline-none focus-visible:ring-2 focus-visible:ring-burgundy sm:h-20 sm:rounded-3xl sm:px-5',
                      state.time === time
                        ? 'border-[#5b1b32] bg-[#5b1b32] text-white shadow-[0_20px_50px_rgba(91,27,50,0.22)]'
                        : 'border-rose/20 bg-white/55 text-[#5b1b32] hover:border-rose/45 hover:bg-white/80',
                    )}
                  >
                    <span>
                      <span className="block text-base font-bold sm:text-lg">{time}</span>
                    </span>
                    <Clock size={20} />
                  </button>
                ))}
              </div>
              <Button disabled={!state.time} onClick={() => setStep('food')} className="mt-4 w-full bg-[#5b1b32] text-white hover:bg-[#6d203c] sm:mt-6">
                Тағамдарға өту <ArrowRight size={17} />
              </Button>
            </Panel>
          </PageTransition>
        )}

        {state.step === 'food' && (
          <PageTransition key="food">
            <div className="mx-auto w-full max-w-6xl">
              <Header icon={<Utensils />} title="Қандай тағам ұнайды?" subtitle="Фотоға қарап, көңіліңе жақын бірнеше дәмді таңда." />
              <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                {foods.map((food) => (
                  <button
                    key={food.id}
                    onClick={() => toggleFood(food.id)}
                    className={cn(
                      'group overflow-hidden rounded-[1.6rem] border bg-white/60 text-left shadow-sm backdrop-blur-xl transition duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-burgundy',
                      state.foodIds.includes(food.id)
                        ? 'border-[#5b1b32] shadow-[0_22px_55px_rgba(91,27,50,0.22)]'
                        : 'border-white/70 hover:-translate-y-1 hover:border-rose/45 hover:bg-white/80',
                    )}
                  >
                    <div className="relative aspect-[4/3] overflow-hidden bg-rose/20">
                      {food.image && <img src={food.image} alt={food.title} className="h-full w-full object-cover transition duration-700 group-hover:scale-105" />}
                      <div className="absolute inset-0 bg-gradient-to-t from-[#3f1023]/70 via-transparent to-transparent" />
                      <span className="absolute left-4 top-4 rounded-full bg-white/80 px-3 py-2 text-2xl shadow-sm backdrop-blur-md">{food.icon}</span>
                      {/* <span className="absolute bottom-4 left-4 right-4 rounded-2xl bg-white/18 px-4 py-2 text-sm font-semibold text-white shadow-sm backdrop-blur-md">
                        өзіңізге ұнағанын таңдаңыз
                      </span> */}
                      {state.foodIds.includes(food.id) && (
                        <span className="absolute right-4 top-4 flex h-9 w-9 items-center justify-center rounded-full bg-[#5b1b32] text-white">
                          <Check size={18} />
                        </span>
                      )}
                    </div>
                    <div className="p-5">
                      <h3 className="text-xl font-bold text-[#4a1629]">{food.title}</h3>
                      <p className="mt-2 inline-flex rounded-full bg-[#fff1f6] px-3 py-1 text-xs font-bold uppercase tracking-[0.12em] text-[#8a3650]">
                        бірге дәмін көрейік
                      </p>
                    </div>
                  </button>
                ))}
              </div>
              <Button disabled={state.foodIds.length === 0} onClick={() => setStep('restaurant')} className="mt-8 w-full bg-[#5b1b32] text-white hover:bg-[#6d203c] sm:w-auto">
                Мейрамхана таңдау <ArrowRight size={17} />
              </Button>
            </div>
          </PageTransition>
        )}

        {state.step === 'restaurant' && (
          <PageTransition key="restaurant">
            <div className="mx-auto w-full max-w-6xl">
              <Header icon={<Sparkles />} title="Қай ресторанда тамақтанамыз?" subtitle="Әр орынның өз атмосферасы бар. Біреуін таңдайық." />
              <p className="mx-auto mt-5 max-w-2xl rounded-[1.4rem] border border-white/70 bg-white/60 px-5 py-4 text-center text-base font-semibold leading-7 text-[#6d3145] shadow-sm backdrop-blur-xl">
                Бір жерге барып, жай ғана бірге тамақтанып, әңгімелесіп айналып қайтармыз.
              </p>
              <div className="mt-8 grid gap-5 lg:grid-cols-3">
                {restaurants.map((restaurant) => (
                  <button
                    key={restaurant.id}
                    onClick={() => patch({ restaurantId: restaurant.id })}
                    className={cn(
                      'overflow-hidden rounded-[1.6rem] border bg-white/60 text-left shadow-sm backdrop-blur-xl transition duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-burgundy',
                      state.restaurantId === restaurant.id ? 'border-[#5b1b32] shadow-[0_22px_55px_rgba(91,27,50,0.22)]' : 'border-white/70 hover:-translate-y-1 hover:border-rose/45',
                    )}
                  >
                    <div className="relative aspect-[4/3] overflow-hidden bg-rose/20">
                      <img src={restaurant.image} alt={restaurant.name} className="h-full w-full object-cover transition duration-700 hover:scale-105" />
                      <div className="absolute inset-0 bg-gradient-to-t from-[#3f1023]/58 via-transparent to-transparent" />
                      {/* <span className="absolute bottom-4 left-4 right-4 rounded-2xl bg-white/18 px-4 py-2 text-sm font-semibold text-white shadow-sm backdrop-blur-md">
                        тек екеумізге арналған атмосфера
                      </span> */}
                    </div>
                    <div className="p-5">
                      <div className="flex items-center justify-between gap-3">
                        <h3 className="text-xl font-bold text-[#4a1629]">{restaurant.name}</h3>
                        {state.restaurantId === restaurant.id && <Check className="text-[#5b1b32]" size={21} />}
                      </div>
                      <p className="mt-2 text-xs uppercase tracking-[0.14em] text-[#9b5368]">{restaurant.address}</p>
                      {/* <p className="mt-3 inline-flex rounded-full bg-[#fff1f6] px-3 py-1 text-xs font-bold uppercase tracking-[0.12em] text-[#8a3650]">
                        осы кешке жарасады
                      </p> */}
                    </div>
                  </button>
                ))}
              </div>
              {state.restaurantId === 'her-choice' && (
                <motion.div
                  className="mx-auto mt-6 max-w-xl rounded-[1.4rem] border border-white/70 bg-white/65 p-4 shadow-sm backdrop-blur-xl"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  <label htmlFor="custom-restaurant" className="block text-sm font-bold text-[#5b1b32]">
                    Қай ресторанға барғыңыз келеді?
                  </label>
                  <input
                    id="custom-restaurant"
                    value={state.customRestaurantName}
                    onChange={(event) => patch({ customRestaurantName: event.target.value })}
                    placeholder="Ресторан атын жазыңыз..."
                    className="mt-3 h-12 w-full rounded-2xl border border-rose/20 bg-white/80 px-4 text-sm font-semibold text-[#4a1629] outline-none transition placeholder:text-[#9b5368]/60 focus:border-[#5b1b32]"
                  />
                  <p className="mt-2 text-xs leading-5 text-[#8a3650]">Жазған таңдауыңыз маған Telegram арқылы келеді.</p>
                </motion.div>
              )}
              <Button
                disabled={!state.restaurantId || (state.restaurantId === 'her-choice' && state.customRestaurantName.trim().length === 0)}
                onClick={() => setStep('summary')}
                className="mt-8 w-full bg-[#5b1b32] text-white hover:bg-[#6d203c] sm:w-auto"
              >
                Қорытынды <ArrowRight size={17} />
              </Button>
            </div>
          </PageTransition>
        )}

        {state.step === 'summary' && (
          <SummaryScreen
            date={state.date}
            time={state.time}
            foods={selectedFoods}
            restaurant={selectedRestaurant}
            customRestaurantName={state.customRestaurantName}
            error={error}
            sending={sending}
            onConfirm={confirm}
          />
        )}

        {false && state.step === 'summary' && (
          <PageTransition key="summary">
            <Panel icon={<Heart />} title="Рақмеет" subtitle="Таңдауларың бәрі осында. Кнопканы басып жіберіңіз">
              <SummaryRow label="Күн" value={formatDate(state.date)} />
              <SummaryRow label="Уақыт" value={state.time} />
              <SummaryRow label="Тағамдар" value={selectedFoods.map((food) => food.title).join(', ')} />
              <SummaryRow label="Мейрамхана" value={selectedRestaurant?.name ?? ''} />
              {error && <p className="mt-5 rounded-2xl border border-rose/30 bg-rose/10 px-4 py-3 text-sm text-[#7c2d48]">{error}</p>}
              <Button disabled={sending} onClick={confirm} className="mt-6 w-full bg-[#5b1b32] text-white hover:bg-[#6d203c]">
                {sending ? 'Жіберілуде...' : 'Кездесуді растау'} <Send size={17} />
              </Button>
            </Panel>
          </PageTransition>
        )}

        {state.step === 'success' && <SuccessScreen onReset={reset} />}

        {false && state.step === 'success' && (
          <PageTransition key="success">
            <div className="mx-auto max-w-2xl text-center">
              <motion.div className="mx-auto mb-8 flex h-20 w-20 items-center justify-center rounded-full border border-rose/30 bg-white/65 text-[#5b1b32] shadow-[0_20px_60px_rgba(91,27,50,0.22)]" animate={{ scale: [1, 1.08, 1] }} transition={{ duration: 1.5, repeat: Infinity }}>
                <Heart fill="currentColor" />
              </motion.div>
              <h2 className="font-serif text-4xl leading-tight text-[#4a1629] sm:text-6xl">Онда бұл серуен ерекше болсын</h2>
              <p className="mx-auto mt-6 max-w-lg text-lg leading-8 text-[#6d3145]">Таңдауың сақталды. Енді бұл кездесуді асыға күтемін.</p>
              <Button variant="secondary" onClick={reset} className="mt-9 border-rose/30 bg-white/60 text-[#5b1b32] hover:bg-white/85">
                Қайта бастау
              </Button>
            </div>
          </PageTransition>
        )}
      </AnimatePresence>
    </main>
  );
}

function LoveSticker({ small = false }: { small?: boolean }) {
  return (
    <motion.div
      className={cn('relative mx-auto mb-5 flex items-center justify-center sm:mb-8', small ? 'h-16 w-16 sm:h-20 sm:w-20' : 'h-20 w-20 sm:h-28 sm:w-28')}
      initial={{ opacity: 0, scale: 0.9, rotate: -4 }}
      animate={{ opacity: 1, scale: 1, rotate: 0 }}
      transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
    >
      <div className="absolute inset-0 rounded-[2rem] bg-white/65 shadow-[0_18px_55px_rgba(137,50,78,0.22)] backdrop-blur-xl" />
      <div className="absolute inset-2 rounded-[1.6rem] border border-rose/20" />
      <motion.div
        className={cn('relative flex items-center justify-center rounded-full bg-[#5b1b32] text-white shadow-lg', small ? 'h-10 w-10 text-2xl sm:h-12 sm:w-12' : 'h-12 w-12 text-3xl sm:h-16 sm:w-16')}
        animate={{ y: [0, -4, 0] }}
        transition={{ duration: 2.4, repeat: Infinity, ease: 'easeInOut' }}
      >
        ❤️
      </motion.div>
      <span className="absolute -right-1 top-3 rounded-full bg-[#fff6df] px-2 py-1 text-lg shadow-sm">✨</span>
      <span className="absolute bottom-2 left-2 rounded-full bg-[#ffdce7] px-2 py-1 text-lg shadow-sm">💌</span>
    </motion.div>
  );
}

function PremiumSticker({ small = false }: { small?: boolean }) {
  return (
    <motion.div
      className={cn('relative mx-auto mb-5 flex items-center justify-center sm:mb-8', small ? 'h-16 w-16 sm:h-20 sm:w-20' : 'h-20 w-20 sm:h-28 sm:w-28')}
      initial={{ opacity: 0, scale: 0.9, rotate: -4 }}
      animate={{ opacity: 1, scale: 1, rotate: 0 }}
      transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
    >
      <div className="absolute inset-0 rounded-[2rem] bg-white/70 shadow-[0_18px_55px_rgba(137,50,78,0.22)] backdrop-blur-xl" />
      <div className="absolute inset-2 rounded-[1.6rem] border border-rose/20" />
      <motion.div
        className={cn('relative flex items-center justify-center rounded-full bg-[#5b1b32] text-white shadow-lg', small ? 'h-10 w-10 sm:h-12 sm:w-12' : 'h-12 w-12 sm:h-16 sm:w-16')}
        animate={{ y: [0, -4, 0], scale: [1, 1.04, 1] }}
        transition={{ duration: 2.4, repeat: Infinity, ease: 'easeInOut' }}
      >
        <Heart size={small ? 21 : 27} fill="currentColor" strokeWidth={1.8} />
      </motion.div>
      <span className="absolute -right-1 top-2 flex h-7 w-7 items-center justify-center rounded-full bg-[#fff6df] text-[#9b6b18] shadow-sm sm:top-3 sm:h-9 sm:w-9">
        <Sparkles size={16} strokeWidth={1.8} />
      </span>
      <span className="absolute bottom-1 left-1 flex h-7 w-7 items-center justify-center rounded-full bg-[#ffdce7] text-[#9b3857] shadow-sm sm:bottom-2 sm:left-2 sm:h-9 sm:w-9">
        <Gem size={15} strokeWidth={1.8} />
      </span>
    </motion.div>
  );
}

function SummaryScreen({
  date,
  time,
  foods,
  restaurant,
  customRestaurantName,
  error,
  sending,
  onConfirm,
}: {
  date: string;
  time: string;
  foods: FoodCategory[];
  restaurant?: Restaurant;
  customRestaurantName: string;
  error: string;
  sending: boolean;
  onConfirm: () => void;
}) {
  return (
    <PageTransition key="summary">
      <div className="relative w-full">
        <CelebrationBurst />
        <Panel icon={<Heart />} title="Рақмееет" subtitle="Динара">
          <SummaryRow label="Күн" value={formatDate(date)} />
          <SummaryRow label="Уақыт" value={time} />
          <SummaryRow label="Тағамдар" value={foods.map((food) => food.title).join(', ')} />
          <SummaryRow label="Мейрамхана" value={restaurant?.id === 'her-choice' ? customRestaurantName : restaurant?.name ?? ''} />
          {error && <p className="mt-5 rounded-2xl border border-rose/30 bg-rose/10 px-4 py-3 text-sm text-[#7c2d48]">{error}</p>}
          <Button disabled={sending} onClick={onConfirm} className="mt-6 w-full bg-[#5b1b32] text-white hover:bg-[#6d203c]">
            {sending ? 'Жіберілуде...' : 'Жіберу'} <Send size={17} />
          </Button>
        </Panel>
      </div>
    </PageTransition>
  );
}

function SuccessScreen({ onReset }: { onReset: () => void }) {
  return (
    <PageTransition key="success">
      <div className="relative mx-auto max-w-2xl text-center">
        <motion.div
          className="mx-auto mb-8 flex h-20 w-20 items-center justify-center rounded-full border border-rose/30 bg-white/70 text-[#5b1b32] shadow-[0_20px_60px_rgba(91,27,50,0.22)] backdrop-blur-xl"
          animate={{ scale: [1, 1.08, 1], rotate: [0, -3, 3, 0] }}
          transition={{ duration: 1.5, repeat: Infinity }}
        >
          <Heart fill="currentColor" />
        </motion.div>
        <h2 className="font-serif text-4xl leading-tight text-[#4a1629] sm:text-6xl">Енді бұл кездесуді асыға күтемін.</h2>
        {/* <p className="mx-auto mt-6 max-w-lg text-lg leading-8 text-[#6d3145]">Таңдауың сақталды. Енді бұл кездесуді асыға күтемін.</p> */}
        <Button variant="secondary" onClick={onReset} className="mt-9 border-rose/30 bg-white/70 text-[#5b1b32] hover:bg-white">
          Қайта бастау
        </Button>
      </div>
    </PageTransition>
  );
}

function CelebrationBurst() {
  const colors = ['#5b1b32', '#e17d9d', '#f0c86b', '#ffffff', '#9b3857', '#f7a7bd'];
  const burstOrigins = [
    { left: '50%', top: '34%', delay: 0 },
    { left: '24%', top: '42%', delay: 0.18 },
    { left: '76%', top: '39%', delay: 0.28 },
  ];
  const pieces = useMemo(
    () =>
      Array.from({ length: 156 }, (_, index) => {
        const origin = burstOrigins[index % burstOrigins.length];
        const angle = (index / 26) * Math.PI * 2 + (index % 7) * 0.18;
        const distance = 120 + (index % 11) * 18 + (index % 5) * 9;
        const width = 6 + (index % 4) * 4;
        const height = index % 5 === 0 ? width : 8 + (index % 3) * 5;
        return {
          id: index,
          origin,
          x: Math.cos(angle) * distance,
          y: Math.sin(angle) * distance - 90,
          fall: 160 + (index % 9) * 28,
          rotate: 180 + index * 31,
          delay: origin.delay + (index % 13) * 0.018,
          duration: 2.25 + (index % 8) * 0.08,
          color: colors[index % colors.length],
          width,
          height,
          radius: index % 4 === 0 ? 999 : 3,
        };
      }),
    [],
  );
  const sparkLines = useMemo(
    () =>
      Array.from({ length: 54 }, (_, index) => {
        const angle = (index / 54) * Math.PI * 2;
        const distance = 100 + (index % 6) * 22;
        return {
          id: index,
          x: Math.cos(angle) * distance,
          y: Math.sin(angle) * distance - 80,
          delay: (index % 10) * 0.025,
          rotate: (angle * 180) / Math.PI,
        };
      }),
    [],
  );

  return (
    <div aria-hidden="true" className="pointer-events-none fixed inset-0 z-40 overflow-hidden">
      {burstOrigins.map((origin, index) => (
        <motion.div
          key={`${origin.left}-${origin.top}`}
          className="absolute flex h-16 w-16 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-[#5b1b32] text-white shadow-[0_20px_50px_rgba(91,27,50,0.26)]"
          style={{ left: origin.left, top: origin.top }}
          initial={{ scale: 0.1, opacity: 0 }}
          animate={{ scale: [0.1, 1.18, 0.82], opacity: [0, 1, 0] }}
          transition={{ duration: 1.2, delay: origin.delay, ease: 'easeOut' }}
        >
          <Sparkles size={28} />
        </motion.div>
      ))}
      {sparkLines.map((spark) => (
        <motion.span
          key={`spark-${spark.id}`}
          className="absolute left-1/2 top-[34%] h-px w-14 origin-left rounded-full bg-white shadow-[0_0_16px_rgba(255,255,255,0.95)]"
          initial={{ x: 0, y: 0, opacity: 0, scaleX: 0.2, rotate: spark.rotate }}
          animate={{ x: spark.x, y: spark.y, opacity: [0, 1, 0], scaleX: [0.2, 1, 0.15], rotate: spark.rotate }}
          transition={{ duration: 1.05, delay: spark.delay, ease: 'easeOut' }}
        />
      ))}
      {pieces.map((piece) => (
        <motion.span
          key={piece.id}
          className="absolute block shadow-sm"
          style={{
            left: piece.origin.left,
            top: piece.origin.top,
            width: piece.width,
            height: piece.height,
            borderRadius: piece.radius,
            backgroundColor: piece.color,
          }}
          initial={{ x: 0, y: 0, opacity: 0, rotate: 0, scale: 0.25 }}
          animate={{
            x: piece.x,
            y: [0, piece.y, piece.y + piece.fall],
            opacity: [0, 1, 1, 0.75, 0],
            rotate: [0, piece.rotate, piece.rotate + 240],
            scale: [0.25, 1, 0.95, 0.75],
          }}
          transition={{ duration: piece.duration, delay: piece.delay, ease: [0.16, 1, 0.3, 1] }}
        />
      ))}
      {burstOrigins.flatMap((origin, originIndex) =>
        [0, 1, 2, 3].map((ring) => (
          <motion.span
            key={`${origin.left}-${ring}`}
            className="absolute h-12 w-12 -translate-x-1/2 -translate-y-1/2 rounded-full border border-[#5b1b32]/25"
            style={{ left: origin.left, top: origin.top }}
            initial={{ scale: 0.2, opacity: 0.75 }}
            animate={{ scale: 4.5 + ring * 0.9, opacity: 0 }}
            transition={{ duration: 1.45, delay: originIndex * 0.16 + ring * 0.12, ease: 'easeOut' }}
          />
        )),
      )}
    </div>
  );
}

function SecondPageMessage({ onNext }: { onNext: () => void }) {
  return (
    <PageTransition key="message">
      <div className="mx-auto max-w-3xl text-center">
        <PremiumSticker small />
        <div className="mx-auto max-w-2xl space-y-4 sm:space-y-5">
          <p className="font-serif text-3xl leading-relaxed text-[#4a1629] sm:text-5xl">
            Сенімен бірге өткізген әрбір сәт мен үшін ерекше.
          </p>
          <p className="text-lg leading-8 text-[#6d3145] sm:text-xl sm:leading-9">
            Кейде көп нәрсе керек емес…
          </p>
          <p className="text-lg leading-8 text-[#6d3145] sm:text-xl sm:leading-9">
            Жақын адамыңмен бірге болған бір сәттің өзі жеткілікті.
          </p>
          <p className="text-lg leading-8 text-[#6d3145] sm:text-xl sm:leading-9">
            Мүмкін, бір күні екеуміз бірге серуендеп,
            <br />
            жай ғана әңгімелесіп,айналармыз...
          </p>
        </div>
        <Button onClick={onNext} className="mt-10 bg-[#5b1b32] text-white hover:bg-[#6d203c]">
          Келесі <ArrowRight size={17} />
        </Button>
      </div>
    </PageTransition>
  );
}

function MessageScreen({ onNext }: { onNext: () => void }) {
  return (
    <PageTransition key="message">
      <div className="mx-auto max-w-3xl text-center">
        <PremiumSticker small />
        <div className="mx-auto max-w-2xl space-y-5">
          <p className="font-serif text-3xl leading-relaxed text-[#4a1629] sm:text-5xl">
            Сенімен бірге өткізген әрбір сәт мен үшін ерекше.
          </p>
          <p className="text-lg leading-9 text-[#6d3145] sm:text-xl">
            Кейде көп нәрсе керек емес...
          </p>
          <p className="text-lg leading-9 text-[#6d3145] sm:text-xl">
            Жақын адамыңмен бірге болған бір сәттің өзі жеткілікті.
          </p>
          <p className="text-lg leading-9 text-[#6d3145] sm:text-xl">
            Мүмкін, бір күні екеуміз бірге серуендеп, жай ғана әңгімелесіп, бір әдемі естелікке айналармыз...
          </p>
        </div>
        <Button onClick={onNext} className="mt-10 bg-[#5b1b32] text-white hover:bg-[#6d203c]">
          Келесі <ArrowRight size={17} />
        </Button>
      </div>
    </PageTransition>
  );
}

function CalendarPicker({ selectedDate, onSelect }: { selectedDate: string; onSelect: (date: string) => void }) {
  const minDate = useMemo(() => parseIsoDate(MIN_DATE), []);
  const selected = selectedDate ? parseIsoDate(selectedDate) : minDate;
  const [visibleMonth, setVisibleMonth] = useState(() => new Date(selected.getFullYear(), selected.getMonth(), 1));

  const days = useMemo(() => {
    const firstDay = new Date(visibleMonth.getFullYear(), visibleMonth.getMonth(), 1);
    const leadingEmptyDays = (firstDay.getDay() + 6) % 7;
    const daysInMonth = new Date(visibleMonth.getFullYear(), visibleMonth.getMonth() + 1, 0).getDate();
    return [
      ...Array.from({ length: leadingEmptyDays }, () => null),
      ...Array.from({ length: daysInMonth }, (_, index) => new Date(visibleMonth.getFullYear(), visibleMonth.getMonth(), index + 1)),
    ];
  }, [visibleMonth]);

  const canGoPrevious = visibleMonth.getFullYear() > minDate.getFullYear() || visibleMonth.getMonth() > minDate.getMonth();

  return (
    <div className="rounded-[1.35rem] border border-white/70 bg-white/55 p-3 shadow-sm backdrop-blur-xl sm:rounded-[1.6rem] sm:p-4">
      <div className="mb-3 flex items-center justify-between sm:mb-5">
        <button
          aria-label="Алдыңғы ай"
          disabled={!canGoPrevious}
          onClick={() => setVisibleMonth((month) => addMonths(month, -1))}
          className="flex h-9 w-9 items-center justify-center rounded-full border border-rose/20 bg-white/60 text-[#5b1b32] disabled:opacity-30 sm:h-10 sm:w-10"
        >
          <ChevronLeft size={18} />
        </button>
        <div className="text-center">
          <p className="text-base font-bold text-[#4a1629] sm:text-lg">{monthNames[visibleMonth.getMonth()]}</p>
          <p className="text-xs uppercase tracking-[0.18em] text-[#9b5368]">{visibleMonth.getFullYear()}</p>
        </div>
        <button
          aria-label="Келесі ай"
          onClick={() => setVisibleMonth((month) => addMonths(month, 1))}
          className="flex h-9 w-9 items-center justify-center rounded-full border border-rose/20 bg-white/60 text-[#5b1b32] sm:h-10 sm:w-10"
        >
          <ChevronRight size={18} />
        </button>
      </div>
      <div className="grid grid-cols-7 gap-1.5 text-center text-[0.68rem] font-bold uppercase tracking-[0.1em] text-[#9b5368] sm:gap-2 sm:text-xs sm:tracking-[0.12em]">
        {weekdayNames.map((day) => (
          <span key={day}>{day}</span>
        ))}
      </div>
      <div className="mt-2 grid grid-cols-7 gap-1.5 sm:mt-3 sm:gap-2">
        {days.map((day, index) => {
          if (!day) return <span key={`empty-${index}`} />;

          const iso = toIsoDate(day);
          const isDisabled = iso < MIN_DATE;
          const isSelected = iso === selectedDate;

          return (
            <button
              key={iso}
              disabled={isDisabled}
              onClick={() => onSelect(iso)}
              className={cn(
                'aspect-square rounded-xl text-xs font-bold transition focus:outline-none focus-visible:ring-2 focus-visible:ring-burgundy sm:rounded-2xl sm:text-sm',
                isSelected && 'bg-[#5b1b32] text-white shadow-[0_12px_35px_rgba(91,27,50,0.28)]',
                !isSelected && !isDisabled && 'bg-white/55 text-[#5b1b32] hover:bg-[#ffe5ed]',
                isDisabled && 'cursor-not-allowed bg-white/25 text-[#b58a99]',
              )}
            >
              {day.getDate()}
            </button>
          );
        })}
      </div>
      <p className="mt-3 text-center text-[0.7rem] text-[#8a3650] sm:mt-4 sm:text-xs">Алғашқы қолжетімді күн: 10.10.2026</p>
    </div>
  );
}

function Header({ icon, title, subtitle }: { icon: ReactNode; title: string; subtitle: string }) {
  const hasRestaurantSticker = title.includes('ресторан') || title.includes('СЂРµСЃС‚РѕСЂР°РЅ');

  return (
    <div className="text-center">
      {hasRestaurantSticker && <RestaurantSticker />}
      <div className="mx-auto mb-3 flex h-10 w-10 items-center justify-center rounded-full border border-rose/25 bg-white/60 text-[#5b1b32] shadow-sm backdrop-blur-xl sm:mb-5 sm:h-12 sm:w-12">{icon}</div>
      <h2 className="font-serif text-[2rem] leading-tight text-[#4a1629] sm:text-6xl">{title}</h2>
      <p className="mx-auto mt-3 max-w-xl text-sm leading-6 text-[#6d3145] sm:mt-4 sm:text-base sm:leading-7">{subtitle}</p>
    </div>
  );
}

function RestaurantSticker() {
  return (
    <motion.div
      className="relative mx-auto mb-4 flex h-24 w-24 items-center justify-center sm:mb-6 sm:h-28 sm:w-28"
      initial={{ opacity: 0, scale: 0.9, y: 10 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
    >
      <div className="absolute inset-0 rounded-[2rem] bg-white/70 shadow-[0_18px_55px_rgba(137,50,78,0.2)] backdrop-blur-xl" />
      <div className="absolute inset-2 rounded-[1.55rem] border border-rose/20" />
      <motion.div
        className="relative flex h-14 w-14 items-center justify-center rounded-full bg-[#5b1b32] text-white shadow-lg sm:h-16 sm:w-16"
        animate={{ y: [0, -4, 0], rotate: [0, -3, 3, 0] }}
        transition={{ duration: 2.6, repeat: Infinity, ease: 'easeInOut' }}
      >
        <Utensils size={28} strokeWidth={1.8} />
      </motion.div>
      <span className="absolute -right-1 top-3 flex h-8 w-8 items-center justify-center rounded-full bg-[#fff6df] text-[#9b6b18] shadow-sm">
        <Sparkles size={16} strokeWidth={1.8} />
      </span>
      <span className="absolute bottom-2 left-1 flex h-8 w-8 items-center justify-center rounded-full bg-[#ffdce7] text-[#9b3857] shadow-sm">
        <Heart size={16} fill="currentColor" strokeWidth={1.8} />
      </span>
    </motion.div>
  );
}

function Panel({ icon, title, subtitle, children }: { icon: ReactNode; title: string; subtitle: string; children: ReactNode }) {
  return (
    <div className="mx-auto w-full max-w-xl rounded-[1.5rem] border border-white/70 bg-white/45 p-4 shadow-[0_22px_70px_rgba(137,50,78,0.18)] backdrop-blur-2xl sm:rounded-[1.75rem] sm:p-8">
      <Header icon={icon} title={title} subtitle={subtitle} />
      <div className="mt-5 sm:mt-8">{children}</div>
    </div>
  );
}

function SummaryRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-start justify-between gap-4 border-b border-rose/15 py-3 last:border-b-0 sm:gap-5 sm:py-4">
      <span className="text-xs uppercase tracking-[0.16em] text-[#9b5368] sm:text-sm sm:tracking-[0.18em]">{label}</span>
      <span className="max-w-[66%] text-right text-sm font-semibold leading-6 text-[#4a1629] sm:text-base sm:leading-7">{value}</span>
    </div>
  );
}

function parseIsoDate(value: string): Date {
  const [year, month, day] = value.split('-').map(Number);
  return new Date(year, month - 1, day);
}

function toIsoDate(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

function addMonths(date: Date, amount: number): Date {
  return new Date(date.getFullYear(), date.getMonth() + amount, 1);
}
