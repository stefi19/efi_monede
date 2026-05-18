import { BrowserRouter, Routes, Route } from 'react-router-dom';
import BottomNav from './components/BottomNav';
import Home from './pages/Home';
import Send from './pages/Send';
import Exchange from './pages/Exchange';
import Cards from './pages/Cards';
import Analytics from './pages/Analytics';
import Profile from './pages/Profile';
import TopUp from './pages/TopUp';

export default function App() {
  return (
    <BrowserRouter>
      <div className="max-w-md mx-auto min-h-screen bg-[#0a0a0a] relative">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/send" element={<Send />} />
          <Route path="/exchange" element={<Exchange />} />
          <Route path="/cards" element={<Cards />} />
          <Route path="/analytics" element={<Analytics />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/topup" element={<TopUp />} />
        </Routes>
        <BottomNav />
      </div>
    </BrowserRouter>
  );
}
