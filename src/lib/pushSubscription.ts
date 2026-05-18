/**
 * Web Push subscription management.
 *
 * Flow:
 *  1. After notification permission is granted, call `subscribeToPush()`.
 *  2. The browser registers with the push service and returns a PushSubscription.
 *  3. We serialise it and store it in Firestore (`efi-monede/push-subs`).
 *  4. When any device calls `/api/push`, it reads all subscriptions from
 *     Firestore and sends a push to each — including to closed/background devices.
 */

import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from './firebase';

const PUSH_DOC  = doc(db, 'efi-monede', 'push-subs');
// Public VAPID key — safe to expose in client code
const VAPID_PUB = import.meta.env.VITE_VAPID_PUBLIC_KEY as string;

/** Convert a URL-safe base64 string to Uint8Array (required by pushManager.subscribe) */
function urlBase64ToUint8Array(b64: string): ArrayBuffer {
  const padding = '='.repeat((4 - (b64.length % 4)) % 4);
  const base64  = (b64 + padding).replace(/-/g, '+').replace(/_/g, '/');
  const raw     = atob(base64);
  const bytes   = new Uint8Array(raw.length);
  for (let i = 0; i < raw.length; i++) bytes[i] = raw.charCodeAt(i);
  return bytes.buffer as ArrayBuffer;
}

/**
 * Subscribe this device to Web Push and persist the subscription in Firestore.
 * Safe to call multiple times — deduplicates by endpoint.
 */
export async function subscribeToPush(): Promise<boolean> {
  if (!('serviceWorker' in navigator) || !('PushManager' in window)) return false;
  if (!VAPID_PUB) { console.warn('[push] VITE_VAPID_PUBLIC_KEY not set'); return false; }
  if (Notification.permission !== 'granted') return false;

  try {
    const reg = await navigator.serviceWorker.ready;

    // Re-use existing subscription if one already exists for this browser
    let sub = await reg.pushManager.getSubscription();
    if (!sub) {
      sub = await reg.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(VAPID_PUB),
      });
    }

    // Upsert into Firestore (dedup by endpoint URL)
    const subJson = sub.toJSON() as PushSubscriptionJSON;
    const snap    = await getDoc(PUSH_DOC);
    const existing: PushSubscriptionJSON[] = snap.exists()
      ? (snap.data().subscriptions ?? [])
      : [];

    const updated = [
      ...existing.filter((s) => s.endpoint !== subJson.endpoint),
      subJson,
    ];
    await setDoc(PUSH_DOC, { subscriptions: updated });

    console.log('[push] subscribed, total devices:', updated.length);
    return true;
  } catch (err) {
    console.warn('[push] subscribe failed:', err);
    return false;
  }
}

/**
 * Read all stored push subscriptions from Firestore.
 * Used by sync.ts before calling /api/push.
 */
export async function getPushSubscriptions(): Promise<PushSubscriptionJSON[]> {
  try {
    const snap = await getDoc(PUSH_DOC);
    if (!snap.exists()) return [];
    return snap.data().subscriptions ?? [];
  } catch {
    return [];
  }
}
