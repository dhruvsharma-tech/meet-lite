import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import {
  MessageSquare,
  Video,
  Users,
  Zap,
  Shield,
  Link2,
  ChevronRight,
  Menu,
  X,
  Mic,
  Monitor,
  Hash,
} from 'lucide-react';

/* ─── tiny hook: intersection observer ─── */
function useInView(threshold = 0.15) {
  const ref = useRef(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setInView(true); obs.disconnect(); } },
      { threshold }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [threshold]);
  return [ref, inView];
}

/* ─── Feature card data ─── */
const FEATURES = [
  {
    icon: <MessageSquare className="w-8 h-8" />,
    color: '#5865f2',
    title: 'Real-Time Chat',
    desc: 'Persistent text channels with typing indicators, emoji reactions, and instant message delivery powered by Socket.IO.',
  },
  {
    icon: <Video className="w-8 h-8" />,
    color: '#23a55a',
    title: 'Voice & Video Calls',
    desc: 'Crystal-clear group voice and video powered by LiveKit SFU — low latency, multi-participant, no extra software needed.',
  },
  {
    icon: <Monitor className="w-8 h-8" />,
    color: '#f23f42',
    title: 'Screen Share',
    desc: 'Share your screen with everyone in the voice channel in one click — presentations, co-working, or just vibing together.',
  },
  {
    icon: <Users className="w-8 h-8" />,
    color: '#eb459e',
    title: 'Live Presence',
    desc: 'See who\'s online, who\'s typing, and who just joined — real-time member list with live online/offline status.',
  },
  {
    icon: <Link2 className="w-8 h-8" />,
    color: '#fee75c',
    title: 'Invite Links',
    desc: 'Share a link, anyone joins your server instantly. Works across browsers, no sign-up friction for existing members.',
  },
  {
    icon: <Shield className="w-8 h-8" />,
    color: '#5865f2',
    title: 'Secure Auth',
    desc: 'JWT-based auth with HTTP-only cookies. Role-based permissions: Owners can manage members, kick users, and control channels.',
  },
];

/* ─── Marquee strip ─── */
const MARQUEE_WORDS = ['TALK', '💬', 'CONNECT', '🎙️', 'STREAM', '🖥️', 'BUILD', '⚡', 'CHILL', '🎮'];

function Marquee() {
  const items = [...MARQUEE_WORDS, ...MARQUEE_WORDS];
  return (
    <div className="overflow-hidden py-4 border-y border-white/10 bg-[#1e1f22]/60">
      <div className="flex gap-8 animate-marquee whitespace-nowrap">
        {items.map((w, i) => (
          <span key={i} className="text-2xl font-black tracking-widest text-white/30 select-none">
            {w}
          </span>
        ))}
      </div>
    </div>
  );
}

/* ─── Feature Section ─── */
function FeatureCard({ icon, color, title, desc, delay = 0 }) {
  const [ref, inView] = useInView();
  return (
    <div
      ref={ref}
      style={{
        transitionDelay: `${delay}ms`,
        opacity: inView ? 1 : 0,
        transform: inView ? 'translateY(0)' : 'translateY(32px)',
      }}
      className="transition-all duration-700 bg-[#2b2d31] border border-white/5 rounded-2xl p-6 hover:border-white/20 hover:scale-[1.02] group"
    >
      <div
        className="w-14 h-14 rounded-xl flex items-center justify-center mb-4 transition-transform group-hover:scale-110"
        style={{ background: `${color}20`, color }}
      >
        {icon}
      </div>
      <h3 className="text-lg font-bold text-white mb-2">{title}</h3>
      <p className="text-[#b5bac1] text-sm leading-relaxed">{desc}</p>
    </div>
  );
}

/* ─── Hero mock UI ─── */
function AppMockup() {
  return (
    <div className="relative w-full max-w-xl mx-auto select-none pointer-events-none">
      {/* Glow blob */}
      <div className="absolute -inset-8 rounded-full bg-[#5865f2]/20 blur-3xl" />
      {/* Window chrome */}
      <div className="relative rounded-2xl overflow-hidden border border-white/10 shadow-2xl bg-[#1e1f22]">
        {/* Title bar */}
        <div className="flex items-center gap-2 px-4 py-3 bg-[#111214] border-b border-white/5">
          <span className="w-3 h-3 rounded-full bg-[#f23f42]" />
          <span className="w-3 h-3 rounded-full bg-[#fee75c]" />
          <span className="w-3 h-3 rounded-full bg-[#23a55a]" />
          <span className="ml-3 text-xs text-white/30 font-mono">meet-lite</span>
        </div>
        {/* App layout */}
        <div className="flex h-64">
          {/* Server rail */}
          <div className="w-14 bg-[#1e1f22] flex flex-col items-center gap-2 py-3">
            {['M', 'G', 'D'].map((l, i) => (
              <div
                key={i}
                className="w-9 h-9 rounded-2xl flex items-center justify-center text-xs font-bold text-white"
                style={{ background: ['#5865f2', '#23a55a', '#eb459e'][i] }}
              >
                {l}
              </div>
            ))}
          </div>
          {/* Channel sidebar */}
          <div className="w-36 bg-[#2b2d31] border-r border-white/5 p-3">
            <p className="text-[10px] font-bold text-[#b5bac1] uppercase tracking-wider mb-2">My Server</p>
            {['# general', '# random', '🔊 voice'].map((c, i) => (
              <div
                key={i}
                className={`flex items-center gap-1 px-1 py-1 rounded text-xs ${i === 0 ? 'text-white bg-white/10' : 'text-[#b5bac1]'}`}
              >
                {c}
              </div>
            ))}
          </div>
          {/* Chat area */}
          <div className="flex-1 bg-[#313338] flex flex-col p-3 gap-2">
            <div className="flex items-start gap-2">
              <div className="w-7 h-7 rounded-full bg-[#5865f2] flex items-center justify-center text-[10px] font-bold text-white shrink-0">A</div>
              <div>
                <p className="text-[10px] font-bold text-white">Aryan <span className="text-[#b5bac1] font-normal">Today</span></p>
                <p className="text-xs text-[#dcddde]">Hey everyone! 👋</p>
              </div>
            </div>
            <div className="flex items-start gap-2">
              <div className="w-7 h-7 rounded-full bg-[#23a55a] flex items-center justify-center text-[10px] font-bold text-white shrink-0">B</div>
              <div>
                <p className="text-[10px] font-bold text-white">Bhavya <span className="text-[#b5bac1] font-normal">Today</span></p>
                <p className="text-xs text-[#dcddde]">Welcome to Meet-Lite 🚀</p>
              </div>
            </div>
            {/* Typing indicator */}
            <div className="mt-auto flex items-center gap-1 text-[10px] text-[#b5bac1]">
              <span className="flex gap-0.5">
                {[0,1,2].map(i => <span key={i} className="w-1 h-1 rounded-full bg-[#b5bac1] animate-bounce" style={{animationDelay:`${i*150}ms`}} />)}
              </span>
              Charu is typing…
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ─── Main Component ─── */
export default function LandingPage() {
  const navigate = useNavigate();
  const { isAuthenticated, isLoading } = useAuthStore();
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const [heroRef, heroInView] = useInView(0.05);
  const [featuresRef, featuresInView] = useInView(0.05);
  const [ctaRef, ctaInView] = useInView(0.1);

  /* Navbar shadow on scroll */
  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', handler);
    return () => window.removeEventListener('scroll', handler);
  }, []);

  const handleOpenApp = () => navigate(isAuthenticated ? '/app' : '/login');

  return (
    <div className="min-h-screen bg-[#1e1f22] text-white overflow-x-hidden">
      {/* ── Navbar ── */}
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled ? 'bg-[#1e1f22]/95 backdrop-blur-md shadow-xl border-b border-white/5' : 'bg-transparent'
        }`}
      >
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => navigate('/')}>
            <div className="w-8 h-8 rounded-full bg-[#5865f2] flex items-center justify-center">
              <Zap className="w-4 h-4 text-white" />
            </div>
            <span className="text-xl font-black tracking-tight">Meet-Lite</span>
          </div>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-8">
            <a href="#features" className="text-sm text-[#b5bac1] hover:text-white transition-colors">Features</a>
            <a href="#about" className="text-sm text-[#b5bac1] hover:text-white transition-colors">About</a>
          </div>

          {/* Auth button */}
          <div className="hidden md:flex items-center gap-3">
            {!isLoading && (
              isAuthenticated ? (
                <button
                  onClick={() => navigate('/app')}
                  className="px-5 py-2 bg-[#5865f2] hover:bg-[#4752c4] text-white text-sm font-semibold rounded-full transition-all hover:scale-105 flex items-center gap-1.5"
                >
                  Open App <ChevronRight className="w-4 h-4" />
                </button>
              ) : (
                <>
                  <button
                    onClick={() => navigate('/login')}
                    className="px-5 py-2 text-sm font-semibold text-white hover:text-[#5865f2] transition-colors"
                  >
                    Log In
                  </button>
                  <button
                    onClick={() => navigate('/register')}
                    className="px-5 py-2 bg-white hover:bg-white/90 text-[#1e1f22] text-sm font-bold rounded-full transition-all hover:scale-105"
                  >
                    Sign Up
                  </button>
                </>
              )
            )}
          </div>

          {/* Mobile menu toggle */}
          <button className="md:hidden text-white" onClick={() => setMenuOpen(p => !p)}>
            {menuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile menu */}
        {menuOpen && (
          <div className="md:hidden bg-[#1e1f22]/98 backdrop-blur-md border-t border-white/5 px-6 py-4 flex flex-col gap-4">
            <a href="#features" className="text-sm text-[#b5bac1]" onClick={() => setMenuOpen(false)}>Features</a>
            <a href="#about" className="text-sm text-[#b5bac1]" onClick={() => setMenuOpen(false)}>About</a>
            <hr className="border-white/10" />
            {!isLoading && (isAuthenticated ? (
              <button onClick={() => navigate('/app')} className="w-full py-2 bg-[#5865f2] rounded-full text-sm font-bold">Open App</button>
            ) : (
              <div className="flex flex-col gap-2">
                <button onClick={() => navigate('/login')} className="w-full py-2 border border-white/20 rounded-full text-sm font-bold">Log In</button>
                <button onClick={() => navigate('/register')} className="w-full py-2 bg-white text-[#1e1f22] rounded-full text-sm font-bold">Sign Up</button>
              </div>
            ))}
          </div>
        )}
      </nav>

      {/* ── Hero ── */}
      <section
        ref={heroRef}
        className="relative min-h-screen flex items-center pt-16"
        style={{
          background: 'radial-gradient(ellipse 80% 60% at 50% -10%, #5865f230 0%, transparent 70%), #1e1f22',
        }}
      >
        {/* Decorative stars */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {[...Array(40)].map((_, i) => (
            <div
              key={i}
              className="absolute w-0.5 h-0.5 rounded-full bg-white/30"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 3}s`,
              }}
            />
          ))}
        </div>

        <div className="max-w-6xl mx-auto px-6 py-24 grid md:grid-cols-2 gap-16 items-center w-full">
          {/* Left: text */}
          <div
            style={{
              opacity: heroInView ? 1 : 0,
              transform: heroInView ? 'translateX(0)' : 'translateX(-40px)',
              transition: 'all 0.8s ease',
            }}
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#5865f2]/20 border border-[#5865f2]/40 text-[#5865f2] text-xs font-semibold mb-6">
              <Zap className="w-3 h-3" /> Powered by LiveKit SFU
            </div>
            <h1 className="text-5xl md:text-6xl font-black leading-tight mb-6">
              Your space to<br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#5865f2] to-[#eb459e]">
                talk, connect
              </span>
              <br />& hang out
            </h1>
            <p className="text-[#b5bac1] text-lg leading-relaxed mb-8 max-w-md">
              Meet-Lite is a real-time communication platform with voice, video, screen share, and persistent group chat — built for teams, friends, and communities.
            </p>
            <div className="flex flex-wrap gap-3">
              <button
                onClick={handleOpenApp}
                className="px-7 py-3.5 bg-[#5865f2] hover:bg-[#4752c4] text-white font-bold rounded-full transition-all hover:scale-105 hover:shadow-[0_0_24px_#5865f240] flex items-center gap-2"
              >
                {isAuthenticated ? 'Open App' : 'Open in Browser'}
                <ChevronRight className="w-5 h-5" />
              </button>
              {!isAuthenticated && (
                <button
                  onClick={() => navigate('/login')}
                  className="px-7 py-3.5 bg-white/10 hover:bg-white/20 border border-white/10 text-white font-bold rounded-full transition-all hover:scale-105 backdrop-blur-sm"
                >
                  Log In
                </button>
              )}
            </div>
          </div>

          {/* Right: mockup */}
          <div
            style={{
              opacity: heroInView ? 1 : 0,
              transform: heroInView ? 'translateX(0)' : 'translateX(40px)',
              transition: 'all 0.8s ease 0.2s',
            }}
          >
            <AppMockup />
          </div>
        </div>
      </section>

      {/* ── Marquee ── */}
      <Marquee />

      {/* ── Features ── */}
      <section id="features" className="py-24 bg-[#1e1f22]">
        <div
          ref={featuresRef}
          className="max-w-6xl mx-auto px-6"
        >
          <div
            className="text-center mb-16"
            style={{
              opacity: featuresInView ? 1 : 0,
              transform: featuresInView ? 'translateY(0)' : 'translateY(24px)',
              transition: 'all 0.6s ease',
            }}
          >
            <h2 className="text-4xl font-black mb-4">
              Everything you need,{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#5865f2] to-[#23a55a]">
                nothing you don't
              </span>
            </h2>
            <p className="text-[#b5bac1] text-lg max-w-xl mx-auto">
              A focused communication platform — no bloat, just the features that matter.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {FEATURES.map((f, i) => (
              <FeatureCard key={i} {...f} delay={i * 80} />
            ))}
          </div>
        </div>
      </section>

      {/* ── Feature highlight rows ── */}
      <FeatureHighlight
        icon={<Video className="w-10 h-10 text-[#23a55a]" />}
        title="Voice & Video that just works"
        desc="No plugins, no downloads. Join a voice channel and talk instantly. Up to HD video with multi-participant support powered by LiveKit's SFU architecture — scales seamlessly."
        color="#23a55a"
        mockup={<VoiceMockup />}
        reverse={false}
      />
      <FeatureHighlight
        icon={<Hash className="w-10 h-10 text-[#5865f2]" />}
        title="Organized text channels"
        desc="Create multiple channels for different topics. Messages persist in the database — scroll back anytime. Real-time typing indicators let you know when someone's replying."
        color="#5865f2"
        mockup={<ChatMockup />}
        reverse={true}
      />
      <FeatureHighlight
        icon={<Users className="w-10 h-10 text-[#eb459e]" />}
        title="See who's around"
        desc="Live online/offline presence for every member. The member list updates in real time as people join, leave, or go offline. Invite anyone with a simple link."
        color="#eb459e"
        mockup={<MembersMockup />}
        reverse={false}
      />

      {/* ── CTA Section ── */}
      <section id="about" className="py-28" style={{ background: 'radial-gradient(ellipse 70% 50% at 50% 100%, #5865f225 0%, transparent 70%), #1e1f22' }}>
        <div
          ref={ctaRef}
          className="max-w-2xl mx-auto px-6 text-center"
          style={{
            opacity: ctaInView ? 1 : 0,
            transform: ctaInView ? 'translateY(0)' : 'translateY(32px)',
            transition: 'all 0.7s ease',
          }}
        >
          <h2 className="text-5xl font-black mb-5">
            Ready to{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#5865f2] to-[#eb459e]">
              Meet-Lite?
            </span>
          </h2>
          <p className="text-[#b5bac1] text-lg mb-10">
            Create your server in seconds. Invite your friends with a link. Start talking.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <button
              onClick={() => navigate('/register')}
              className="px-8 py-4 bg-[#5865f2] hover:bg-[#4752c4] text-white font-bold rounded-full text-lg transition-all hover:scale-105 hover:shadow-[0_0_32px_#5865f240] flex items-center gap-2"
            >
              Get Started — It's Free <ChevronRight className="w-5 h-5" />
            </button>
            {isAuthenticated && (
              <button
                onClick={() => navigate('/app')}
                className="px-8 py-4 bg-white/10 hover:bg-white/20 text-white font-bold rounded-full text-lg transition-all hover:scale-105 border border-white/10"
              >
                Open App
              </button>
            )}
          </div>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="border-t border-white/5 py-8 bg-[#111214]">
        <div className="max-w-6xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-full bg-[#5865f2] flex items-center justify-center">
              <Zap className="w-3 h-3 text-white" />
            </div>
            <span className="font-black text-sm">Meet-Lite</span>
          </div>
          <p className="text-[#b5bac1] text-xs">
            Built with ❤️ using React · Socket.IO · LiveKit · Neon PostgreSQL
          </p>
          <div className="flex items-center gap-4 text-xs text-[#b5bac1]">
            <button onClick={() => navigate('/login')} className="hover:text-white transition-colors">Log In</button>
            <button onClick={() => navigate('/register')} className="hover:text-white transition-colors">Sign Up</button>
          </div>
        </div>
      </footer>
    </div>
  );
}

/* ─── Feature Highlight Sections ─── */
function FeatureHighlight({ icon, title, desc, color, mockup, reverse }) {
  const [ref, inView] = useInView();
  return (
    <section className="py-20" style={{ background: reverse ? '#252628' : '#1e1f22' }}>
      <div
        ref={ref}
        className={`max-w-6xl mx-auto px-6 flex flex-col ${reverse ? 'md:flex-row-reverse' : 'md:flex-row'} items-center gap-16`}
        style={{
          opacity: inView ? 1 : 0,
          transform: inView ? 'translateY(0)' : 'translateY(40px)',
          transition: 'all 0.8s ease',
        }}
      >
        <div className="flex-1">
          <div className="w-16 h-16 rounded-2xl flex items-center justify-center mb-5" style={{ background: `${color}20` }}>
            {icon}
          </div>
          <h2 className="text-3xl md:text-4xl font-black mb-4 leading-tight">{title}</h2>
          <p className="text-[#b5bac1] text-lg leading-relaxed max-w-md">{desc}</p>
        </div>
        <div className="flex-1">{mockup}</div>
      </div>
    </section>
  );
}

/* ─── Mini mockups for feature highlight sections ─── */
function VoiceMockup() {
  return (
    <div className="rounded-2xl bg-[#2b2d31] border border-white/10 p-5 max-w-sm mx-auto">
      <p className="text-xs font-bold text-[#b5bac1] uppercase tracking-wider mb-4">🔊 Voice — 3 connected</p>
      <div className="flex flex-col gap-3">
        {[
          { name: 'Aryan', color: '#5865f2', active: true },
          { name: 'Bhavya', color: '#23a55a', active: true },
          { name: 'Charu', color: '#eb459e', active: false },
        ].map(u => (
          <div key={u.name} className={`flex items-center gap-3 px-3 py-2 rounded-lg ${u.active ? 'bg-[#23a55a]/10 border border-[#23a55a]/20' : 'bg-white/5'}`}>
            <div className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold text-white" style={{ background: u.color }}>{u.name[0]}</div>
            <span className="text-sm font-medium text-white flex-1">{u.name}</span>
            {u.active ? <Mic className="w-4 h-4 text-[#23a55a]" /> : <Mic className="w-4 h-4 text-[#b5bac1] opacity-40" />}
          </div>
        ))}
      </div>
    </div>
  );
}

function ChatMockup() {
  const msgs = [
    { user: 'Aryan', color: '#5865f2', text: 'Bro did you see that?? 🔥' },
    { user: 'Bhavya', color: '#23a55a', text: 'haha yes bro absolutely insane' },
    { user: 'Charu', color: '#eb459e', text: 'Wait sending the clip rn' },
  ];
  return (
    <div className="rounded-2xl bg-[#313338] border border-white/10 p-4 max-w-sm mx-auto">
      <div className="flex items-center gap-2 mb-4 pb-3 border-b border-white/5">
        <Hash className="w-4 h-4 text-[#b5bac1]" />
        <span className="text-sm font-bold text-white">general</span>
        <span className="ml-auto text-[10px] text-[#23a55a] font-semibold">● 3 online</span>
      </div>
      <div className="flex flex-col gap-3">
        {msgs.map((m, i) => (
          <div key={i} className="flex items-start gap-2">
            <div className="w-7 h-7 rounded-full flex items-center justify-center text-[11px] font-bold text-white shrink-0" style={{ background: m.color }}>{m.user[0]}</div>
            <div>
              <p className="text-[11px] font-bold text-white">{m.user}</p>
              <p className="text-sm text-[#dcddde]">{m.text}</p>
            </div>
          </div>
        ))}
        <div className="flex items-center gap-1 text-[10px] text-[#b5bac1] mt-1">
          <span className="flex gap-0.5">{[0,1,2].map(i => <span key={i} className="w-1 h-1 rounded-full bg-[#b5bac1] animate-bounce" style={{animationDelay:`${i*150}ms`}} />)}</span>
          Aryan is typing…
        </div>
      </div>
    </div>
  );
}

function MembersMockup() {
  const members = [
    { name: 'Aryan', color: '#5865f2', online: true, role: 'Owner' },
    { name: 'Bhavya', color: '#23a55a', online: true, role: 'Member' },
    { name: 'Charu', color: '#eb459e', online: true, role: 'Member' },
    { name: 'Dev', color: '#fee75c', online: false, role: 'Member' },
  ];
  return (
    <div className="rounded-2xl bg-[#2b2d31] border border-white/10 p-5 max-w-xs mx-auto">
      <p className="text-xs font-bold text-[#b5bac1] uppercase tracking-wider mb-4">Members — {members.length}</p>
      <div className="flex flex-col gap-2">
        {members.map(m => (
          <div key={m.name} className="flex items-center gap-3 px-2 py-1.5 rounded-lg hover:bg-white/5">
            <div className="relative">
              <div className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold text-white" style={{ background: m.color }}>{m.name[0]}</div>
              <span className={`absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2 border-[#2b2d31] ${m.online ? 'bg-[#23a55a]' : 'bg-[#80848e]'}`} />
            </div>
            <span className="text-sm text-[#dcddde] flex-1">{m.name}</span>
            {m.role === 'Owner' && <span className="text-[10px] text-[#fee75c] font-bold">OWNER</span>}
          </div>
        ))}
      </div>
    </div>
  );
}

