import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from './firebase';

const PUSH_DOC  = doc(db, 'efi-monede', 'push-subs');
const VAPID_PUB = import.meta.env.VITE_VAPID_PUBLIC_KEY as string;

/** Stable device ID — same key used in sync.ts */
const DEVICE_KEY = 'efi-device-id';
function getDeviceId(): string {
  let id = sessionStorage.getItem(DEVICE_KEY);
  if (!id) {
    id = `${Date.now()}-${Math.random().toString(36).slice(2)}`;
    sessionStorage.setItem(DEVICE_KEY, id);
  }
  return id;
}

/** Convert URL-safe base64 to ArrayBuffer for pushManager.subscribe */
function urlBase64ToUint8Array(b64: string): ArrayBuffer {
  const padding = '='.repeat((4 - (b64.length % 4)) % 4);
  const base64  = (b64 + padding).replace(/-/g, '+').replace(/_/g, '/');
  const raw     = atob(base64);
  const bytes   = new Uint8Array(raw.length);
  for (let i = 0; i < raw.length; i++) bytes[i] = raw.charCodeAt(i);
  return bytes.buffer as ArrayBuffer;
}

/** Stored entry: subscription JSON + the device that owns it */
export interface StoredSubscription {
  deviceId: string;
  sub: PushSubscriptionJSON;
}

/**
 * Subscribe this device to Web Push and persist in Firestore.
 * Safe to call many times — deduplicates by endpoint.
 */
export async function subscribeToPush(): Promise<boolean> {
  if (!('serviceWorker' in navigator) || !('PushManager' in window)) return false;
  if (!VAPID_PUB) { console.warn('[push] VITE_VAPID_PUBLIC_KEY not set'); return false; }
  if (Notification.permission !== 'granted') return false;

  try {
    const reg = await navigator.serviceWorker.ready;

    let sub = await reg.pushManager.getSubscription();
    if (!sub) {
      sub = await reg.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(VAPID_PUB),
      });
    }

    const entry: StoredSubscription = {
      deviceId: getDeviceId(),
      sub: sub.toJSON() as PushSubscriptionJSON,
    };

    const snap     = await getDoc(PUSH_DOC);
    const existing: StoredSubscription[] = snap.exists()
      ? (snap.data().subscriptions ?? [])
      : [];

    // Upsert: remove old entries for same endpoint OR same device, then add fresh
    const updated = [
      ...existing.filter(
        (e) => e.sub.endpoint !== entry.sub.endpoint && e.deviceId !== entry.deviceId
      ),
      entry,
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
 * Return all subscriptions EXCEPT the sender's own device.
 * Prevents notifying yourself about your own action.
 */
export async function getPushSubscriptionsExcluding(
  excludeDeviceId: string
): Promise<PushSubscriptionJSON[]> {
  try {
    const snap = await getDoc(PUSH_DOC);
    if (!snap.exists()) return [];
    const all: StoredSubscription[] = snap.data().subscriptions ?? [];
    return all
      .filter((e) => e.deviceId !== excludeDeviceId)
      .map((e) => e.sub);
  } catch {
    return [];
  }
}

/** Back-compat — returns all subscriptions without exclusion */
export async function getPushSubscriptions(): Promise<PushSubscriptionJSON[]> {
  return getPushSubscriptionsExcluding('');
}

/**
 * Remove dead subscriptions (410 Gone / 404) from Firestore.
 * Called after /api/push reports dead endpoints so we don't keep sending to them.
 */
export async function removeDeadSubscriptions(deadEndpoints: string[]): Promise<void> {
  if (!deadEndpoints.length) return;
  try {
    const snap = await getDoc(PUSH_DOC);
    if (!snap.exists()) return;
    const all: StoredSubscription[] = snap.data().subscriptions ?? [];
    const clean = all.filter((e) => !deadEndpoints.includes(e.sub.endpoint ?? ''));
    if (clean.length !== all.length) {
      await setDoc(PUSH_DOC, { subscriptions: clean });
      console.log(`[push] removed ${all.length - clean.length} dead subscription(s)`);
    }
  } catch (err) {
    console.warn('[push] removeDeadSubscriptions failed:', err);
  }
}
