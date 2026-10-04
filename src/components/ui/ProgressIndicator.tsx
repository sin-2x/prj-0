import type { Step } from '../../types/invitation';
import { progressFor } from '../../lib/utils';

export function ProgressIndicator({ step }: { step: Step }) {
  const progress = progressFor(step);
  if (!progress) return null;

  return (
    <div className="fixed left-1/2 top-5 z-20 -translate-x-1/2 rounded-full border border-rose/20 bg-white/55 px-4 py-2 text-xs tracking-[0.22em] text-[#7c2d48] shadow-sm backdrop-blur-xl">
      {progress}
    </div>
  );
}
