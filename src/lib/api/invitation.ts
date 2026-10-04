import type { InvitationSubmission } from '../../types/invitation';

export interface VisitPayload {
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

export async function submitInvitation(submission: InvitationSubmission): Promise<void> {
  const response = await fetch('/api/invitation', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(submission),
  });

  if (!response.ok) {
    throw new Error('Invitation submission failed');
  }
}

export async function trackVisit(payload: VisitPayload): Promise<void> {
  const response = await fetch('/api/visit', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    throw new Error('Visit tracking failed');
  }
}
