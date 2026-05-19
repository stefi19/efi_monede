import { doc, getDoc, setDoc, onSnapshot } from 'firebase/firestore';
import { db } from './firebase';
import type { User, ChatMessage } from '../store/useStore';
import { getPushSubscriptionsExcluding } from './pushSubscription';

// ── Stable device ID (per browser tab session) ──────────────────────────────
// We use this so the Firestore listener can skip applying updates that
// originated from this very device (avoiding redundant re-renders / loops).
const DEVICE_KEY = 'efi-device-id';
let deviceId = sessionStorage.getItem(DEVICE_KEY);
if (!deviceId) {
  deviceId = `${Date.now()}-${Math.random().toString(36).slice(2)}`;
  sessionStorage.setItem(DEVICE_KEY, deviceId);
}

// ── Firestore document reference ─────────────────────────────────────────────
const STATE_DOC = doc(db, 'efi-monede', 'state');

export interface RemoteState {
  users: User[];
  messages: ChatMessage[];
  updatedBy: string;
  updatedAt: number;
}

// ── Load once ─────────────────────────────────────────────────────────────────
export async function loadRemoteState(): Promise<RemoteState | null> {
  try {
    const snap = await getDoc(STATE_DOC);
    if (snap.exists()) return snap.data() as RemoteState;
    return null;
  } catch (err) {
    console.warn('[sync] loadRemoteState failed:', err);
    return null;
  }
}

// ── Save (write whole state, tag with device ID) ──────────────────────────────
export async function saveRemoteState(users: User[], messages: ChatMessage[]) {
  try {
    const payload: RemoteState = {
      users,
      messages,
      updatedBy: deviceId!,
      updatedAt: Date.now(),
    };
    await setDoc(STATE_DOC, payload);

    // After saving, send a background push to all OTHER devices so they get
    // notified even when their app is completely closed.
    const last = messages[messages.length - 1];
    if (last) {
      const sender = users.find((u) => u.id === last.fromUserId);
      const title  = last.fromUserId === 'system'
        ? '🔔 Efi Monede'
        : (sender?.name ?? 'Efi Monede');
      _sendBackgroundPush(title, last.text).catch(() => {});
    }
  } catch (err) {
    console.warn('[sync] saveRemoteState failed:', err);
  }
}

/** Fire-and-forget: sends Web Push to all OTHER devices (not the sender) */
async function _sendBackgroundPush(title: string, body: string) {
  try {
    // Exclude the current device so the sender doesn't get their own notification
    const subscriptions = await getPushSubscriptionsExcluding(deviceId!);
    if (!subscriptions.length) return;
    const res = await fetch('/api/push', {
      method:  'POST',
      headers: { 'Content-Type': 'application/json' },
      body:    JSON.stringify({ title, body, subscriptions }),
    });
    if (!res.ok) console.warn('[push] /api/push returned', res.status);
  } catch (err) {
    console.warn('[push] background push failed:', err);
  }
}

// ── Real-time listener ────────────────────────────────────────────────────────
// Calls `callback` only when the change came from ANOTHER device.
export function subscribeToRemoteState(
  callback: (users: User[], messages: ChatMessage[]) => void
): () => void {
  return onSnapshot(STATE_DOC, (snap) => {
    if (!snap.exists()) return;
    const data = snap.data() as RemoteState;
    // Skip snapshots produced by this device's own writes
    if (data.updatedBy === deviceId) return;
    callback(data.users, data.messages);
  });
}
