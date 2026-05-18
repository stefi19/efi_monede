// iOS Safari (PWA) does NOT support new Notification() — it requires going
// through the service worker via showNotification(). We always prefer the SW
// path and only fall back to the legacy constructor on browsers that lack SW.

import { subscribeToPush } from '../lib/pushSubscription';

export async function requestNotificationPermission(): Promise<boolean> {
  if (!('Notification' in window)) return false;
  if (Notification.permission === 'granted') {
    // Already granted — make sure we're also subscribed to background push
    subscribeToPush().catch(() => {});
    return true;
  }
  if (Notification.permission === 'denied') return false;

  // Must be called from a user-gesture context on iOS
  const result = await Notification.requestPermission();
  if (result === 'granted') {
    // Subscribe to background push immediately while we have a user gesture
    subscribeToPush().catch(() => {});
  }
  return result === 'granted';
}

export async function notify(title: string, body: string) {
  if (!('Notification' in window)) return;
  if (Notification.permission !== 'granted') return;

  const opts: NotificationOptions = {
    body,
    icon: '/favicon.svg',
    badge: '/favicon.svg',
    // Keep silent on iOS (sound controlled by OS)
    silent: false,
  };

  // Prefer SW path — required on iOS PWA, also works on all modern browsers
  if ('serviceWorker' in navigator) {
    try {
      const reg = await navigator.serviceWorker.ready;
      await reg.showNotification(title, opts);
      return;
    } catch {
      // fall through to legacy path
    }
  }

  // Fallback: desktop browsers without active SW
  try {
    new Notification(title, opts);
  } catch {
    // ignore
  }
}
