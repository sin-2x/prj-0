import type { Step } from '../types/invitation';
import { stepsOrder } from './constants';

export function cn(...classes: Array<string | false | null | undefined>): string {
  return classes.filter(Boolean).join(' ');
}

export function formatDate(value: string): string {
  if (!value) return '';
  const [year, month, day] = value.split('-');
  return `${day}.${month}.${year}`;
}

export function progressFor(step: Step): string {
  const index = stepsOrder.findIndex((item) => item === step);
  if (index < 0) return '';
  return `${String(index + 1).padStart(2, '0')} / ${String(stepsOrder.length).padStart(2, '0')}`;
}
