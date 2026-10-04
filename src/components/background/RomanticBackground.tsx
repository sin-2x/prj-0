import { motion } from 'framer-motion';
import { Flower2, Heart, Sparkle, Stars } from 'lucide-react';
import { useEffect, useState } from 'react';

const floatingItems = [
  { Icon: Heart, left: '10%', top: '18%', size: 22, delay: 0 },
  { Icon: Sparkle, left: '22%', top: '72%', size: 18, delay: 0.5 },
  { Icon: Stars, left: '76%', top: '20%', size: 24, delay: 0.2 },
  { Icon: Heart, left: '86%', top: '66%', size: 20, delay: 0.8 },
  { Icon: Sparkle, left: '58%', top: '12%', size: 16, delay: 1.1 },
  { Icon: Stars, left: '42%', top: '82%', size: 22, delay: 0.35 },
  { Icon: Flower2, left: '7%', top: '48%', size: 20, delay: 1.35 },
  { Icon: Flower2, left: '91%', top: '38%', size: 18, delay: 0.9 },
];

const patternItems = [
  { left: '14%', top: '32%', size: 120, delay: 0 },
  { left: '70%', top: '54%', size: 160, delay: 0.6 },
  { left: '48%', top: '10%', size: 92, delay: 1.1 },
];

export function RomanticBackground() {
  const [pointer, setPointer] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handlePointerMove = (event: PointerEvent) => {
      const x = (event.clientX / window.innerWidth - 0.5) * 18;
      const y = (event.clientY / window.innerHeight - 0.5) * 18;
      setPointer({ x, y });
    };

    window.addEventListener('pointermove', handlePointerMove, { passive: true });
    return () => window.removeEventListener('pointermove', handlePointerMove);
  }, []);

  return (
    <div className="fixed inset-0 -z-10 overflow-hidden bg-[#fff3ea]">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_18%_18%,rgba(255,213,225,0.95),transparent_32%),radial-gradient(circle_at_82%_14%,rgba(255,246,204,0.74),transparent_30%),radial-gradient(circle_at_50%_88%,rgba(182,62,96,0.24),transparent_40%),linear-gradient(135deg,#fffaf2_0%,#ffe3eb_46%,#fac5d3_100%)]" />
      <motion.div
        className="absolute -left-28 top-14 h-[26rem] w-[26rem] rounded-full bg-white/65 blur-3xl"
        animate={{ x: [pointer.x, pointer.x + 30, pointer.x], y: [pointer.y, pointer.y - 20, pointer.y], opacity: [0.6, 0.92, 0.6] }}
        transition={{ duration: 12, repeat: Infinity, ease: 'easeInOut' }}
      />
      <motion.div
        className="absolute -bottom-24 right-0 h-[31rem] w-[31rem] rounded-full bg-[#e17d9d]/32 blur-3xl"
        animate={{ x: [-pointer.x, -pointer.x - 28, -pointer.x], y: [-pointer.y, -pointer.y + 22, -pointer.y], opacity: [0.26, 0.44, 0.26] }}
        transition={{ duration: 14, repeat: Infinity, ease: 'easeInOut' }}
      />
      <motion.div
        className="absolute left-[34%] top-[24%] h-52 w-52 rounded-full bg-[#fff2bf]/45 blur-3xl"
        animate={{ x: pointer.x * 0.8, y: pointer.y * 0.8, scale: [1, 1.08, 1] }}
        transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
      />
      {patternItems.map((item, index) => (
        <motion.div
          key={`${item.left}-${item.top}`}
          className="absolute rounded-full border border-[#9b3857]/12"
          style={{ left: item.left, top: item.top, width: item.size, height: item.size }}
          animate={{
            x: [pointer.x * 0.18, pointer.x * -0.16, pointer.x * 0.18],
            y: [pointer.y * 0.16, pointer.y * -0.18, pointer.y * 0.16],
            rotate: [0, index % 2 === 0 ? 12 : -12, 0],
            scale: [1, 1.08, 1],
          }}
          transition={{ duration: 11 + index, delay: item.delay, repeat: Infinity, ease: 'easeInOut' }}
        >
          <div className="absolute inset-3 rounded-full border border-white/45" />
          <div className="absolute left-1/2 top-0 h-full w-px -translate-x-1/2 bg-[#9b3857]/10" />
          <div className="absolute left-0 top-1/2 h-px w-full -translate-y-1/2 bg-white/45" />
        </motion.div>
      ))}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.34)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.26)_1px,transparent_1px)] bg-[size:58px_58px] opacity-28" />

      {floatingItems.map(({ Icon, left, top, size, delay }, index) => (
        <motion.div
          key={`${left}-${top}`}
          className="absolute text-[#9b3857]/34"
          style={{ left, top }}
          animate={{
            x: [pointer.x * (index % 2 === 0 ? 0.55 : -0.45), pointer.x * 0.15],
            y: [pointer.y * (index % 2 === 0 ? 0.45 : -0.5), pointer.y * 0.1 - 14, pointer.y * 0.2],
            rotate: [-4, 5, -4],
            opacity: [0.35, 0.7, 0.35],
          }}
          transition={{ duration: 5.8 + index * 0.35, delay, repeat: Infinity, ease: 'easeInOut' }}
        >
          <Icon size={size} strokeWidth={1.7} />
        </motion.div>
      ))}

      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,rgba(122,39,64,0.13)_100%)]" />
    </div>
  );
}
