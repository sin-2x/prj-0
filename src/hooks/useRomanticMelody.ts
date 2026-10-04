import { useEffect, useRef } from 'react';

const trackUrl = './Sadraddin-Menin-adamym.mp3';
const softVolume = 0.16;

export function useRomanticMelody(active: boolean) {
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    if (!audioRef.current) {
      const audio = new Audio(trackUrl);
      audio.loop = true;
      audio.volume = softVolume;
      audio.preload = 'auto';
      audioRef.current = audio;
    }

    const audio = audioRef.current;

    if (!active) {
      audio.pause();
      audio.currentTime = 0;
      return;
    }

    const play = () => {
      audio.volume = softVolume;
      void audio.play().catch(() => {
        audio.pause();
      });
    };

    play();
    window.addEventListener('pointerdown', play, { once: true });
    window.addEventListener('keydown', play, { once: true });

    return () => {
      window.removeEventListener('pointerdown', play);
      window.removeEventListener('keydown', play);
      audio.pause();
    };
  }, [active]);
}
