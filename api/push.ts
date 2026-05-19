/**
 * POST /api/push
 *
 * Receives { title, body, subscriptions } from the client and sends a
 * Web Push notification to every subscription using the VAPID keys stored
 * as Vercel environment variables.
 *
 * The VAPID *private* key never leaves the server — it is only used here
 * to sign the push request, which is why background push requires a server.
 */

import type { VercelRequest, VercelResponse } from '@vercel/node';
import webpush from 'web-push';

// Configure VAPID once per cold-start
webpush.setVapidDetails(
  `mailto:${process.env.VAPID_EMAIL ?? 'contact@efi-monede.vercel.app'}`,
  process.env.VAPID_PUBLIC_KEY!,
  process.env.VAPID_PRIVATE_KEY!,
);

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Only allow POST
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { title, body, subscriptions } = req.body as {
    title: string;
    body:  string;
    subscriptions: PushSubscriptionJSON[];
  };

  if (!subscriptions?.length) {
    return res.status(200).json({ sent: 0 });
  }

  const payload = JSON.stringify({ title, body });

  // Send to all subscriptions in parallel; ignore individual failures
  const results = await Promise.allSettled(
    subscriptions.map((sub) =>
      webpush.sendNotification(sub as Parameters<typeof webpush.sendNotification>[0], payload, {
        TTL: 60 * 60, // keep the push queued for 1 hour if device is offline
      })
    )
  );

  const sent   = results.filter((r) => r.status === 'fulfilled').length;
  const failed = results.length - sent;

  // Collect dead subscription endpoints (410 Gone / 404) so the client can
  // clean them from Firestore and avoid wasting pushes next time.
  const deadEndpoints: string[] = [];
  results.forEach((r, i) => {
    if (r.status === 'rejected') {
      const code = (r.reason as { statusCode?: number })?.statusCode;
      if (code === 410 || code === 404) {
        deadEndpoints.push(subscriptions[i]?.endpoint ?? '');
      }
    }
  });

  if (failed > 0) {
    console.warn(`[push] ${failed}/${results.length} push(es) failed, dead: ${deadEndpoints.length}`);
  }

  return res.status(200).json({ sent, failed, deadEndpoints });
}
