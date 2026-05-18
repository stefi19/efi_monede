import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import BottomNav from './components/BottomNav';
import Home from './pages/Home';
import Send from './pages/Send';
import Exchange from './pages/Exchange';
import Cards from './pages/Cards';
import Analytics from './pages/Analytics';
import Profile from './pages/Profile';
import TopUp from './pages/TopUp';
import Login from './pages/Login';
import Chat from './pages/Chat';
import Request from './pages/Request';
import { useStore } from './store/useStore';

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const currentUserId = useStore((s) => s.currentUserId);
  if (!currentUserId) return <Navigate to="/login" replace />;
  return <>{children}</>;
}

export default function App() {
  return (
    <BrowserRouter>
      <div className="max-w-md mx-auto h-full bg-[#0a0a0a] relative overflow-y-auto overflow-x-hidden scrollbar-hide">
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/" element={<ProtectedRoute><Home /></ProtectedRoute>} />
          <Route path="/send" element={<ProtectedRoute><Send /></ProtectedRoute>} />
          <Route path="/exchange" element={<ProtectedRoute><Exchange /></ProtectedRoute>} />
          <Route path="/cards" element={<ProtectedRoute><Cards /></ProtectedRoute>} />
          <Route path="/analytics" element={<ProtectedRoute><Analytics /></ProtectedRoute>} />
          <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
          <Route path="/topup" element={<ProtectedRoute><TopUp /></ProtectedRoute>} />
          <Route path="/chat" element={<ProtectedRoute><Chat /></ProtectedRoute>} />
          <Route path="/request" element={<ProtectedRoute><Request /></ProtectedRoute>} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
        <ProtectedBottomNav />
      </div>
    </BrowserRouter>
  );
}

function ProtectedBottomNav() {
  const currentUserId = useStore((s) => s.currentUserId);
  if (!currentUserId) return null;
  return <BottomNav />;
}
