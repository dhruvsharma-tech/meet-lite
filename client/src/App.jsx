import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Home from './pages/Home';
import Room from './pages/Room';
import './socket'; // Initialize socket connection and listener

export default function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-slate-50 text-slate-800 flex flex-col font-sans">
        <header className="border-b border-slate-200 bg-white/80 backdrop-blur px-4 py-3 sticky top-0 z-10">
          <div className="max-w-5xl mx-auto flex items-center justify-between">
            <span className="font-bold text-lg text-indigo-600 tracking-tight">Meet Lite</span>
            <span className="text-xs text-slate-500 font-medium px-2 py-0.5 rounded-full bg-slate-100 border border-slate-200">
              P2P Call
            </span>
          </div>
        </header>
        <main className="flex-1 flex flex-col max-w-5xl w-full mx-auto">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/room/:roomId" element={<Room />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}
