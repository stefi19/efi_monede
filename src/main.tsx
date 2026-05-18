import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { registerSW } from 'virtual:pwa-register'
import './index.css'
import App from './App.tsx'
import { notify } from './utils/notify';

// Listen for cross-tab message additions and show a notification
window.addEventListener('storage', (e) => {
  try {
    if (e.key === 'efi-monede-store') {
      const newVal = e.newValue;
      if (!newVal) return;
      const parsed = JSON.parse(newVal);
      const messages = parsed.state?.messages ?? parsed.messages ?? [];
      const last = messages?.[messages.length - 1];
      if (last) {
        // Try to find sender name from stored users
        const users = parsed.state?.users ?? parsed.users ?? [];
        const sender = users.find((u: any) => u.id === last.fromUserId);
        notify(sender ? `${sender.name}` : 'New message', last.text);
      }
    }
  } catch (err) {
    // ignore
  }
});

registerSW({ immediate: true })

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
