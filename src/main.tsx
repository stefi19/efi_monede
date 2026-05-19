import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { registerSW } from 'virtual:pwa-register'
import './index.css'
import App from './App.tsx'
import { notify } from './utils/notify';
import { subscribeToPush } from './lib/pushSubscription';
import { loadRemoteState, subscribeToRemoteState, saveRemoteState } from './lib/sync';
import { useStore, initialUsers } from './store/useStore';

// ── Bootstrap: load Firestore state once, then subscribe for real-time updates
async function initSync() {
  const applyRemote = useStore.getState()._applyRemote;

  // 1. Load current state from Firestore
  const remote = await loadRemoteState();

  if (remote) {
    // Firestore has data → hydrate store
    applyRemote(remote.users, remote.messages);
  } else {
    // First ever run → seed Firestore with initial users + empty messages
    await saveRemoteState(initialUsers, []);
  }

  // 2. Subscribe to real-time changes from other devices
  subscribeToRemoteState(async (users, messages) => {
    useStore.getState()._applyRemote(users, messages);

    // In-app notification (shown while app is open — the SW handles background)
    const last = messages[messages.length - 1];
    if (last) {
      const sender = users.find((u) => u.id === last.fromUserId);
      const title  = last.fromUserId === 'system' ? '🔔 Efi Monede' : (sender?.name ?? 'New message');
      notify(title, last.text);
    }
  });

  // 3. Register for background push notifications on every startup.
  //    subscribeToPush() is idempotent — it reuses the existing subscription
  //    if one exists, or creates a new one. Calling it here ensures the
  //    Firestore entry is always fresh with the latest deviceId.
  if (Notification.permission === 'granted') {
    subscribeToPush().catch(() => {});
  }
  // Also re-subscribe whenever the SW activates (handles Safari PWA reopens)
  navigator.serviceWorker?.ready.then(() => {
    if (Notification.permission === 'granted') {
      subscribeToPush().catch(() => {});
    }
  });
}

initSync();

registerSW({ immediate: true });

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
