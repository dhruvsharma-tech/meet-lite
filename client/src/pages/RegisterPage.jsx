import { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import toast from 'react-hot-toast';
import { Loader2, Mail, Lock, User, Zap } from 'lucide-react';
import authService from '../services/authService';
import { useAuthStore } from '../store/authStore';

export default function RegisterPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const redirect = searchParams.get('redirect') || '/app';

  const setUser = useAuthStore((state) => state.setUser);

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const apiUrl = import.meta.env.VITE_API_URL || '';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (name.trim().length < 2) {
      setError('Username must be at least 2 characters long.');
      return;
    }
    if (password.length < 6) {
      setError('Password must be at least 6 characters long.');
      return;
    }

    setIsLoading(true);
    try {
      const data = await authService.register({ name: name.trim(), email, password });
      setUser(data.user);
      toast.success(`Account created! Welcome, ${data.user.name}.`);
      navigate(redirect);
    } catch (err) {
      const msg = err.response?.data?.error || 'Registration failed. Please try again.';
      setError(msg);
      toast.error(msg);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center p-4 md:p-8 font-sans select-none relative overflow-x-hidden bg-[#080914]">
      {/* ── MINIMAL STARRY SPACE CANVAS BACKGROUND ── */}
      <div className="cosmic-stars-canvas" />
      <div className="cosmic-nebula-glow" />

      {/* ── STYLES ── */}
      <style>{`
        .cosmic-stars-canvas {
          position: fixed;
          inset: 0;
          pointer-events: none;
          z-index: 0;
          background-image: 
            radial-gradient(1px 1px at 30px 40px, #ffffff, rgba(0,0,0,0)),
            radial-gradient(1.5px 1.5px at 140px 170px, #c084fc, rgba(0,0,0,0)),
            radial-gradient(1px 1px at 280px 90px, #ffffff, rgba(0,0,0,0)),
            radial-gradient(2px 2px at 450px 240px, #818cf8, rgba(0,0,0,0)),
            radial-gradient(1px 1px at 620px 130px, #ffffff, rgba(0,0,0,0)),
            radial-gradient(1.5px 1.5px at 790px 310px, #f472b6, rgba(0,0,0,0)),
            radial-gradient(1px 1px at 940px 80px, #ffffff, rgba(0,0,0,0)),
            radial-gradient(2px 2px at 1050px 200px, #38bdf8, rgba(0,0,0,0));
          background-repeat: repeat;
          background-size: 1000px 360px;
          opacity: 0.5;
        }

        .cosmic-nebula-glow {
          position: fixed;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          width: 900px;
          height: 600px;
          background: radial-gradient(ellipse at center, rgba(124, 58, 237, 0.22) 0%, rgba(88, 101, 242, 0.14) 45%, transparent 70%);
          filter: blur(60px);
          pointer-events: none;
          z-index: 0;
        }

        .auth-card-wrapper {
          position: relative;
          z-index: 10;
          max-width: 1020px;
          width: 100%;
          background: rgba(17, 18, 33, 0.92);
          backdrop-filter: blur(24px);
          -webkit-backdrop-filter: blur(24px);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 28px;
          box-shadow: 0 30px 80px -15px rgba(0, 0, 0, 0.8), 0 0 40px rgba(124, 58, 237, 0.2);
          overflow: hidden;
          display: grid;
          grid-template-columns: 1fr 1.05fr;
        }

        @media (max-width: 900px) {
          .auth-card-wrapper {
            grid-template-columns: 1fr;
          }
          .auth-showcase-col {
            display: none;
          }
        }
      `}</style>

      {/* ── CENTRAL SPLIT CONTAINER ── */}
      <div className="auth-card-wrapper">
        {/* ── LEFT PANEL: REGISTER FORM ── */}
        <div className="p-8 md:p-12 flex flex-col justify-between">
          <div>
            {/* Brand Logo */}
            <div className="flex items-center gap-2.5 mb-8 cursor-pointer" onClick={() => navigate('/')}>
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#7c3aed] to-[#5865f2] flex items-center justify-center text-white shadow-md">
                <Zap size={18} />
              </div>
              <span className="text-lg font-black tracking-tight text-white">
                Meet<span className="text-[#7289da]">Lite</span>
              </span>
            </div>

            {/* Header */}
            <div className="mb-6">
              <h1 className="text-3xl font-black tracking-tight text-white mb-2">Create an account</h1>
              <p className="text-sm text-zinc-400">Join MeetLite to start voice, video, and text chats</p>
            </div>

            {/* Error Message */}
            {error && (
              <div className="mb-5 p-3 rounded-xl bg-rose-500/15 border border-rose-500/30 text-rose-400 text-xs font-semibold">
                {error}
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-zinc-400 mb-1.5">
                  Display Name
                </label>
                <div className="relative flex items-center">
                  <User className="absolute left-3.5 w-4 h-4 text-zinc-500" />
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    minLength={2}
                    className="w-full pl-10 pr-4 py-3 bg-[#151728] border border-white/10 rounded-xl text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-[#7c3aed] focus:ring-1 focus:ring-[#7c3aed] transition-all"
                    placeholder="What should everyone call you?"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-zinc-400 mb-1.5">
                  Email
                </label>
                <div className="relative flex items-center">
                  <Mail className="absolute left-3.5 w-4 h-4 text-zinc-500" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="w-full pl-10 pr-4 py-3 bg-[#151728] border border-white/10 rounded-xl text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-[#7c3aed] focus:ring-1 focus:ring-[#7c3aed] transition-all"
                    placeholder="name@domain.com"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-zinc-400 mb-1.5">
                  Password
                </label>
                <div className="relative flex items-center">
                  <Lock className="absolute left-3.5 w-4 h-4 text-zinc-500" />
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    minLength={6}
                    className="w-full pl-10 pr-4 py-3 bg-[#151728] border border-white/10 rounded-xl text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-[#7c3aed] focus:ring-1 focus:ring-[#7c3aed] transition-all"
                    placeholder="At least 6 characters"
                  />
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3.5 px-4 bg-gradient-to-r from-[#7c3aed] to-[#5865f2] hover:from-[#6d28d9] hover:to-[#4752c4] active:scale-[0.98] disabled:opacity-50 text-white font-bold text-sm rounded-xl transition-all duration-150 flex items-center justify-center gap-2 cursor-pointer shadow-[0_4px_20px_rgba(124,58,237,0.4)] mt-2"
              >
                {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Create Account'}
              </button>
            </form>

            {/* Divider */}
            <div className="relative my-6 flex items-center justify-center">
              <div className="border-t border-white/10 w-full" />
              <span className="bg-[#111221] px-3 text-xs uppercase font-bold text-zinc-500 absolute">
                Or
              </span>
            </div>

            {/* Google OAuth Register */}
            <a
              href={`${apiUrl}/api/auth/google`}
              className="w-full py-3 px-4 bg-[#151728] hover:bg-[#1a1c32] border border-white/10 hover:border-white/20 active:scale-[0.98] text-white text-xs font-bold rounded-xl transition-all flex items-center justify-center gap-3 cursor-pointer shadow-sm"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.66-5.17 3.66-9.17z"
                />
                <path
                  fill="#34A853"
                  d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.35 24 12 24z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.25C.45 8.18 0 9.99 0 12s.45 3.82 1.25 5.42l4.03-3.15z"
                />
                <path
                  fill="#EA4335"
                  d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.35 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98z"
                />
              </svg>
              Sign up with Google
            </a>
          </div>

          {/* Footer Switch to Login */}
          <div className="mt-8 text-center text-xs text-zinc-400">
            Already have an account?{' '}
            <Link to="/login" className="text-[#a78bfa] hover:text-white font-bold hover:underline ml-1">
              Log In
            </Link>
          </div>
        </div>

        {/* ── RIGHT PANEL: VIBRANT PURPLE SHOWCASE (NO 3D MODEL, NO TECH NAMES) ── */}
        <div className="auth-showcase-col p-6 m-3 bg-gradient-to-br from-[#7c3aed] via-[#6366f1] to-[#3b82f6] rounded-2xl flex flex-col justify-between overflow-hidden relative shadow-2xl">
          {/* Subtle Ambient Radial Glow */}
          <div className="absolute -top-16 -right-16 w-60 h-60 bg-white/10 rounded-full blur-2xl pointer-events-none" />

          {/* Showcase Heading */}
          <div className="relative z-10 mb-5">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-black/20 text-white/90 text-xs font-bold uppercase tracking-wider mb-3 backdrop-blur-sm border border-white/10">
              ✦ Voice, Video & Stream
            </span>
            <h2 className="text-2xl md:text-3xl font-black text-white tracking-tight leading-tight mb-2">
              Your Space to Talk, Stream & Hang Out
            </h2>
            <p className="text-white/80 text-xs md:text-sm leading-relaxed max-w-sm">
              Create your own server in seconds, invite your squad, and hang out in low-latency voice and video calls.
            </p>
          </div>

          {/* ── SLEEK INTERFACE SHOWCASE MOCKUP ── */}
          <div className="relative z-10 w-full flex-1 rounded-xl overflow-hidden border border-white/20 bg-black/35 shadow-2xl backdrop-blur-md p-5 flex flex-col justify-between">
            {/* Mockup Header Tabs */}
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
                <span className="text-xs font-bold text-white tracking-wide">Voice Lounge & Stream</span>
              </div>
              <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                Connected
              </span>
            </div>

            {/* Voice Tiles Grid */}
            <div className="grid grid-cols-2 gap-3 my-4">
              <div className="p-3 rounded-lg bg-white/5 border border-emerald-400/50 shadow-[0_0_15px_rgba(52,211,153,0.15)] flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-full bg-indigo-600 flex items-center justify-center font-bold text-xs text-white">
                  A
                </div>
                <div>
                  <div className="text-xs font-bold text-white leading-tight">Alex</div>
                  <div className="text-[10px] text-emerald-400 font-semibold">Speaking...</div>
                </div>
              </div>

              <div className="p-3 rounded-lg bg-white/5 border border-white/10 flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-full bg-emerald-600 flex items-center justify-center font-bold text-xs text-white">
                  C
                </div>
                <div>
                  <div className="text-xs font-bold text-white leading-tight">Chloe</div>
                  <div className="text-[10px] text-zinc-400">Listening</div>
                </div>
              </div>
            </div>

            {/* Mini Chat Message snippet */}
            <div className="p-3 rounded-lg bg-black/30 border border-white/10 flex items-center gap-2.5">
              <div className="w-6 h-6 rounded-full bg-purple-600 flex items-center justify-center font-bold text-[10px] text-white shrink-0">
                J
              </div>
              <div className="text-xs text-zinc-300 truncate">
                <span className="font-bold text-white mr-1.5">Jordan:</span>
                Screen share is live in 1080p, jump in! 🚀
              </div>
            </div>
          </div>

          {/* Footer attribution tag */}
          <div className="relative z-10 mt-4 flex items-center justify-between text-[11px] text-white/70">
            <span>Fast & Private Communication</span>
            <span>✦ Cloud Connected</span>
          </div>
        </div>
      </div>
    </div>
  );
}
