/// <reference lib="WebWorker" />
import { cleanupOutdatedCaches, precacheAndRoute } from 'workbox-precaching';
import { clientsClaim } from 'workbox-core';

declare const self: ServiceWorkerGlobalScope;

// Take over immediately — don't wait for old SW to expire
self.skipWaiting();
clientsClaim();

// Clean up old Workbox caches from previous SW versions
cleanupOutdatedCaches();

// Precache all assets injected by vite-plugin-pwa
// Access via self property so the literal string "self.__WB_MANIFEST" survives
// compilation — workbox-build's injectManifest does an exact string replacement.
// eslint-disable-next-line @typescript-eslint/no-explicit-any
precacheAndRoute((self as unknown as any).__WB_MANIFEST);

// ── Background Push Notifications ────────────────────────────────────────────
// This event fires when a push arrives from the server, even if the app is
// completely closed. The SW shows the notification here so it always works.
self.addEventListener('push', (event) => {
  if (!event.data) return;

  let payload: { title?: string; body?: string } = {};
  try {
    payload = event.data.json();
  } catch {
    payload = { title: '🔔 Efi Monede', body: event.data.text() };
  }

  const title = payload.title || '🔔 Efi Monede';
  const body  = payload.body  || '';

  event.waitUntil(
    self.registration.showNotification(title, {
      body,
      icon:  '/favicon.svg',
      badge: '/favicon.svg',
      tag:   'efi-monede',          // collapse duplicates
      silent: false,
    } as NotificationOptions)
  );
});

// ── Notification Click ────────────────────────────────────────────────────────
// When user taps the notification, open / focus the app.
self.addEventListener('notificationclick', (event) => {
  event.notification.close();

  event.waitUntil(
    (self as unknown as { clients: Clients }).clients
      .matchAll({ type: 'window', includeUncontrolled: true })
      .then((list) => {
        for (const client of list) {
          if ('focus' in client) return (client as WindowClient).focus();
        }
        return (self as unknown as { clients: Clients }).clients.openWindow('/');
      })
  );
});
