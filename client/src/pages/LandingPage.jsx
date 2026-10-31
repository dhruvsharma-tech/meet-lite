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
  Volume2,
  Crown,
  ArrowRight,
} from 'lucide-react';

/* ─── InView hook ─── */
function useInView(threshold = 0.12) {
  const ref = useRef(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setInView(true); obs.disconnect(); } },
      { threshold }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [threshold]);
  return [ref, inView];
}

/* ─── Animated typewriter word cycler ─── */
const HERO_WORDS = ['Talk.', 'Connect.', 'Stream.', 'Collaborate.', 'Vibe.'];
function TypewriterText() {
  const [idx, setIdx] = useState(0);
  const [displayed, setDisplayed] = useState('');
  const [deleting, setDeleting] = useState(false);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    const word = HERO_WORDS[idx];
    if (paused) {
      const t = setTimeout(() => { setDeleting(true); setPaused(false); }, 1400);
      return () => clearTimeout(t);
    }
    if (!deleting) {
      if (displayed.length < word.length) {
        const t = setTimeout(() => setDisplayed(word.slice(0, displayed.length + 1)), 80);
        return () => clearTimeout(t);
      } else {
        setPaused(true);
      }
    } else {
      if (displayed.length > 0) {
        const t = setTimeout(() => setDisplayed(displayed.slice(0, -1)), 45);
        return () => clearTimeout(t);
      } else {
        setDeleting(false);
        setIdx((prev) => (prev + 1) % HERO_WORDS.length);
      }
    }
  }, [displayed, deleting, paused, idx]);

  return (
    <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#7289da] via-[#a78bfa] to-[#ec4899]">
      {displayed}
      <span className="animate-pulse text-[#7289da]">|</span>
    </span>
  );
}

/* ─── Marquee strip ─── */
const MARQUEE_ITEMS = [
  { text: 'CHAT', icon: '💬' },
  { text: 'VOICE', icon: '🎙️' },
  { text: 'CONNECT', icon: '⚡' },
  { text: 'STREAM', icon: '🎥' },
  { text: 'COLLAB', icon: '👥' },
  { text: 'SHARE', icon: '🔗' },
  { text: 'VIBE', icon: '🎮' },
  { text: 'BUILD', icon: '🚀' },
];
function MarqueeStrip() {
  const items = [...MARQUEE_ITEMS, ...MARQUEE_ITEMS, ...MARQUEE_ITEMS];
  return (
    <div className="overflow-hidden py-5 border-y border-white/8"
      style={{ background: 'linear-gradient(90deg, #1a1b2e 0%, #16213e 50%, #1a1b2e 100%)' }}>
      <div className="flex gap-10 animate-marquee whitespace-nowrap">
        {items.map((item, i) => (
          <span key={i} className="flex items-center gap-3 text-sm font-black tracking-[0.25em] uppercase select-none"
            style={{ color: i % 8 === 0 ? '#7289da' : i % 8 === 2 ? '#a78bfa' : i % 8 === 4 ? '#ec4899' : 'rgba(255,255,255,0.25)' }}>
            <span className="text-base opacity-70">{item.icon}</span>
            {item.text}
            <span className="text-white/15 mx-2">✦</span>
          </span>
        ))}
      </div>
    </div>
  );
}

/* ─── Feature cards data ─── */
const FEATURES = [
  {
    icon: <MessageSquare className="w-6 h-6" />,
    color: '#7289da',
    bg: 'rgba(114,137,218,0.1)',
    title: 'Real-Time Text Chat',
    desc: 'Persistent channels with typing indicators. Messages save to DB — scroll back anytime. Optimistic sends feel instant.',
  },
  {
    icon: <Video className="w-6 h-6" />,
    color: '#43b581',
    bg: 'rgba(67,181,129,0.1)',
    title: 'HD Voice & Video',
    desc: 'Crystal-clear group calls powered by LiveKit SFU. Adaptive streams, simulcast, echo cancellation — zero installs needed.',
  },
  {
    icon: <Monitor className="w-6 h-6" />,
    color: '#f04747',
    bg: 'rgba(240,71,71,0.1)',
    title: 'Screen Share',
    desc: 'Share your screen with everyone in a voice room with one click. Great for co-working, presentations, or just vibing.',
  },
  {
    icon: <Users className="w-6 h-6" />,
    color: '#a78bfa',
    bg: 'rgba(167,139,250,0.1)',
    title: 'Live Presence',
    desc: 'Real-time online/offline dots on every member. The sidebar updates the moment someone connects or leaves.',
  },
  {
    icon: <Link2 className="w-6 h-6" />,
    color: '#faa61a',
    bg: 'rgba(250,166,26,0.1)',
    title: 'Invite Links',
    desc: 'Share a link and anyone joins your server instantly. No friction, no forced sign-up — just drop a link.',
  },
  {
    icon: <Shield className="w-6 h-6" />,
    color: '#7289da',
    bg: 'rgba(114,137,218,0.1)',
    title: 'Secure by Design',
    desc: 'JWT auth with HTTP-only cookies. Role-based permissions — owners manage members, kick users, and control channels.',
  },
];

/* ─── Floating particle dot ─── */
function Particle({ style }) {
  return <div className="absolute rounded-full pointer-events-none" style={style} />;
}

/* ─── App Mockup ─── */
function AppMockup() {
  return (
    <div className="relative w-full max-w-lg mx-auto select-none pointer-events-none">
      {/* Outer glow */}
      <div className="absolute -inset-6 rounded-3xl opacity-30"
        style={{ background: 'radial-gradient(ellipse at center, #7289da 0%, transparent 70%)' }} />
      {/* Window */}
      <div className="relative rounded-2xl overflow-hidden border border-white/10 shadow-2xl"
        style={{ background: '#1e1f22' }}>
        {/* Traffic light bar */}
        <div className="flex items-center gap-2 px-4 py-3 border-b border-white/5"
          style={{ background: '#111214' }}>
          <span className="w-3 h-3 rounded-full bg-[#f04747]" />
          <span className="w-3 h-3 rounded-full bg-[#faa61a]" />
          <span className="w-3 h-3 rounded-full bg-[#43b581]" />
          <span className="ml-4 text-xs text-white/25 font-mono tracking-wide">meet-lite — #general</span>
        </div>
        {/* App body */}
        <div className="flex h-72">
          {/* Server rail */}
          <div className="w-14 flex flex-col items-center gap-3 py-4 border-r border-white/5"
            style={{ background: '#111214' }}>
            {[
              { l: 'M', c: '#7289da' },
              { l: 'G', c: '#43b581' },
              { l: 'D', c: '#a78bfa' },
            ].map(({ l, c }, i) => (
              <div key={i} className="w-10 h-10 rounded-2xl flex items-center justify-center text-sm font-black text-white transition-all"
                style={{ background: `${c}30`, border: `1.5px solid ${c}50`, color: c }}>
                {l}
              </div>
            ))}
            <div className="mt-auto w-10 h-10 rounded-2xl flex items-center justify-center"
              style={{ background: 'rgba(255,255,255,0.05)' }}>
              <span className="text-white/30 text-lg">+</span>
            </div>
          </div>
          {/* Channel list */}
          <div className="w-40 border-r border-white/5 flex flex-col p-3"
            style={{ background: '#2b2d31' }}>
            <p className="text-[10px] font-bold text-white/40 uppercase tracking-widest mb-3 px-1">My Server</p>
            <p className="text-[9px] font-bold text-white/30 uppercase tracking-widest mb-1 px-2">Text</p>
            {['# general', '# random'].map((c, i) => (
              <div key={i} className={`flex items-center gap-1.5 px-2 py-1.5 rounded-md text-[11px] mb-0.5 ${i === 0 ? 'text-white font-semibold' : 'text-white/40'}`}
                style={{ background: i === 0 ? 'rgba(255,255,255,0.08)' : 'transparent' }}>
                <Hash className="w-3 h-3 opacity-60" />{c.slice(2)}
              </div>
            ))}
            <p className="text-[9px] font-bold text-white/30 uppercase tracking-widest mb-1 px-2 mt-3">Voice</p>
            <div className="flex items-center gap-1.5 px-2 py-1.5 rounded-md text-[11px] text-white/40">
              <Volume2 className="w-3 h-3 opacity-60" />General
            </div>
          </div>
          {/* Chat area */}
          <div className="flex-1 flex flex-col p-4 gap-3" style={{ background: '#313338' }}>
            {[
              { u: 'Aryan', c: '#7289da', t: 'Hey bro, just joined! 👋' },
              { u: 'Bhavya', c: '#43b581', t: 'Welcome to Meet-Lite 🚀' },
              { u: 'Charu', c: '#a78bfa', t: 'Let\'s hop in voice? 🎙️' },
            ].map((m, i) => (
              <div key={i} className="flex items-start gap-2">
                <div className="w-7 h-7 rounded-full flex items-center justify-center text-[10px] font-black text-white shrink-0"
                  style={{ background: m.c }}>
                  {m.u[0]}
                </div>
                <div>
                  <p className="text-[10px] font-bold text-white/90">{m.u}
                    <span className="text-white/30 font-normal ml-1.5">Today</span>
                  </p>
                  <p className="text-[11px] text-white/70 mt-0.5">{m.t}</p>
                </div>
              </div>
            ))}
            {/* Typing */}
            <div className="flex items-center gap-1.5 mt-auto text-[10px] text-white/30">
              <span className="flex gap-0.5">
                {[0, 1, 2].map(i => (
                  <span key={i} className="w-1 h-1 rounded-full bg-white/40 animate-bounce"
                    style={{ animationDelay: `${i * 150}ms` }} />
                ))}
              </span>
              <span>Dev is typing…</span>
            </div>
            {/* Input bar */}
            <div className="mt-1 rounded-lg px-3 py-2 text-[10px] text-white/20 border border-white/5"
              style={{ background: 'rgba(255,255,255,0.04)' }}>
              Message #general…
            </div>
          </div>
          {/* Member sidebar */}
          <div className="w-28 border-l border-white/5 p-3" style={{ background: '#2b2d31' }}>
            <p className="text-[9px] font-bold text-white/30 uppercase tracking-widest mb-2">Online — 3</p>
            {[
              { u: 'Aryan', c: '#7289da', online: true, role: 'OWNER' },
              { u: 'Bhavya', c: '#43b581', online: true },
              { u: 'Charu', c: '#a78bfa', online: true },
              { u: 'Dev', c: '#faa61a', online: false },
            ].map((m, i) => (
              <div key={i} className="flex items-center gap-1.5 px-1 py-1 rounded mb-0.5">
                <div className="relative shrink-0">
                  <div className="w-6 h-6 rounded-full flex items-center justify-center text-[9px] font-black text-white"
                    style={{ background: m.c }}>
                    {m.u[0]}
                  </div>
                  <span className={`absolute -bottom-0.5 -right-0.5 w-2 h-2 rounded-full border border-[#2b2d31] ${m.online ? 'bg-[#43b581]' : 'bg-[#72767d]'}`} />
                </div>
                <div className="min-w-0">
                  <p className={`text-[10px] font-medium truncate ${m.online ? 'text-white/80' : 'text-white/30'}`}>{m.u}</p>
                  {m.role === 'OWNER' && <p className="text-[8px] text-[#faa61a]">Owner</p>}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function FeatureCard({ icon, color, bg, title, desc, delay = 0 }) {
  const [ref, inView] = useInView();
  return (
    <div
      ref={ref}
      style={{
        transitionDelay: `${delay}ms`,
        opacity: inView ? 1 : 0,
        transform: inView ? 'translateY(0)' : 'translateY(28px)',
        transition: 'all 0.65s cubic-bezier(0.22,1,0.36,1)',
        background: 'linear-gradient(135deg, rgba(255,255,255,0.03) 0%, rgba(255,255,255,0.01) 100%)',
        border: '1px solid rgba(255,255,255,0.06)',
      }}
      className="group rounded-2xl p-6 cursor-default hover:border-white/15 transition-colors"
    >
      <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-4 transition-transform duration-300 group-hover:scale-110"
        style={{ background: bg, color }}>
        {icon}
      </div>
      <h3 className="text-base font-bold text-white mb-2">{title}</h3>
      <p className="text-sm leading-relaxed" style={{ color: '#8e9297' }}>{desc}</p>
    </div>
  );
}

/* ─── Feature highlight row ─── */
function FeatureRow({ emoji, label, title, desc, accent, mockup, flip = false }) {
  const [ref, inView] = useInView(0.1);
  return (
    <section className="py-24 relative overflow-hidden"
      style={{ background: flip ? '#16181c' : '#1a1b1e' }}>
      {/* Subtle accent blob */}
      <div className="absolute pointer-events-none rounded-full blur-3xl opacity-10"
        style={{
          width: 480, height: 480,
          background: accent,
          [flip ? 'right' : 'left']: -120, top: '50%', transform: 'translateY(-50%)'
        }} />
      <div ref={ref}
        className={`max-w-6xl mx-auto px-6 flex flex-col ${flip ? 'md:flex-row-reverse' : 'md:flex-row'} items-center gap-16`}
        style={{
          opacity: inView ? 1 : 0,
          transform: inView ? 'translateY(0)' : 'translateY(36px)',
          transition: 'all 0.75s cubic-bezier(0.22,1,0.36,1)',
        }}>
        {/* Text */}
        <div className="flex-1 max-w-md">
          <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest mb-4 px-3 py-1.5 rounded-full border"
            style={{ color: accent, borderColor: `${accent}40`, background: `${accent}10` }}>
            <span>{emoji}</span>{label}
          </div>
          <h2 className="text-3xl md:text-4xl font-black leading-tight mb-4 text-white">{title}</h2>
          <p className="text-base leading-relaxed" style={{ color: '#8e9297' }}>{desc}</p>
        </div>
        {/* Mockup */}
        <div className="flex-1 w-full">{mockup}</div>
      </div>
    </section>
  );
}

/* ─── Mini mockups ─── */
function VoiceMockup() {
  const users = [
    { name: 'Aryan', color: '#7289da', speaking: true },
    { name: 'Bhavya', color: '#43b581', speaking: true },
    { name: 'Charu', color: '#a78bfa', speaking: false },
    { name: 'Dev', color: '#faa61a', speaking: false },
  ];
  return (
    <div className="rounded-2xl p-6 max-w-sm mx-auto border border-white/8"
      style={{ background: 'linear-gradient(135deg, #1e2030 0%, #1a1c26 100%)' }}>
      <div className="flex items-center gap-2 mb-5">
        <Volume2 className="w-4 h-4" style={{ color: '#43b581' }} />
        <span className="text-sm font-bold text-white">🔊 General Voice</span>
        <span className="ml-auto text-xs font-semibold px-2 py-0.5 rounded-full"
          style={{ background: '#43b58120', color: '#43b581' }}>
          ● LIVE
        </span>
      </div>
      <div className="grid grid-cols-2 gap-3">
        {users.map((u) => (
          <div key={u.name}
            className="flex flex-col items-center gap-2 p-3 rounded-xl border transition-all"
            style={{
              background: u.speaking ? `${u.color}10` : 'rgba(255,255,255,0.03)',
              borderColor: u.speaking ? `${u.color}40` : 'rgba(255,255,255,0.06)',
            }}>
            <div className="relative">
              <div className="w-12 h-12 rounded-full flex items-center justify-center text-lg font-black text-white"
                style={{ background: `${u.color}30`, border: `2px solid ${u.speaking ? u.color : 'transparent'}` }}>
                {u.name[0]}
              </div>
              {u.speaking && (
                <span className="absolute -bottom-0.5 -right-0.5 w-4 h-4 rounded-full flex items-center justify-center"
                  style={{ background: '#43b581' }}>
                  <Mic className="w-2.5 h-2.5 text-white" />
                </span>
              )}
            </div>
            <span className="text-xs font-semibold" style={{ color: u.speaking ? 'white' : '#72767d' }}>{u.name}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function ChatMockup2() {
  const msgs = [
    { u: 'Aryan', c: '#7289da', t: 'Yo bro kya scene hai? 🔥', time: '10:24 AM' },
    { u: 'Bhavya', c: '#43b581', t: 'Chill kar rhe hain bhai 😎', time: '10:24 AM' },
    { u: 'Charu', c: '#a78bfa', t: 'Voice mein aa jao sablog!', time: '10:25 AM' },
  ];
  return (
    <div className="rounded-2xl overflow-hidden max-w-sm mx-auto border border-white/8"
      style={{ background: '#2b2d31' }}>
      <div className="px-4 py-3 border-b border-white/5 flex items-center gap-2"
        style={{ background: '#1e2124' }}>
        <Hash className="w-4 h-4" style={{ color: '#7289da' }} />
        <span className="text-sm font-bold text-white">general</span>
        <span className="ml-auto text-[11px] font-semibold" style={{ color: '#43b581' }}>● 3 online</span>
      </div>
      <div className="p-4 flex flex-col gap-3" style={{ background: '#36393f' }}>
        {msgs.map((m, i) => (
          <div key={i} className="flex items-start gap-2.5">
            <div className="w-8 h-8 rounded-full shrink-0 flex items-center justify-center text-sm font-black text-white"
              style={{ background: m.c }}>
              {m.u[0]}
            </div>
            <div>
              <div className="flex items-baseline gap-2">
                <span className="text-sm font-bold text-white">{m.u}</span>
                <span className="text-[10px]" style={{ color: '#72767d' }}>{m.time}</span>
              </div>
              <p className="text-sm mt-0.5" style={{ color: '#dcddde' }}>{m.t}</p>
            </div>
          </div>
        ))}
        <div className="flex items-center gap-1.5 mt-1" style={{ color: '#72767d' }}>
          <span className="flex gap-0.5">
            {[0, 1, 2].map(i => (
              <span key={i} className="w-1 h-1 rounded-full animate-bounce"
                style={{ background: '#72767d', animationDelay: `${i * 150}ms` }} />
            ))}
          </span>
          <span className="text-[11px]">Dev is typing…</span>
        </div>
        <div className="rounded-lg px-3 py-2 mt-1 border border-white/5 text-[11px]"
          style={{ background: 'rgba(0,0,0,0.15)', color: '#72767d' }}>
          Message #general…
        </div>
      </div>
    </div>
  );
}

function MembersMockup2() {
  const online = [
    { name: 'Aryan', color: '#7289da', role: 'OWNER' },
    { name: 'Bhavya', color: '#43b581' },
    { name: 'Charu', color: '#a78bfa' },
  ];
  const offline = [{ name: 'Dev', color: '#faa61a' }, { name: 'Esha', color: '#f04747' }];
  return (
    <div className="rounded-2xl p-5 max-w-xs mx-auto border border-white/8"
      style={{ background: '#2b2d31' }}>
      <p className="text-[10px] font-bold uppercase tracking-widest mb-3 px-1" style={{ color: '#8e9297' }}>
        Online — {online.length}
      </p>
      {online.map((m) => (
        <div key={m.name} className="flex items-center gap-2.5 px-2 py-2 rounded-lg mb-1 hover:bg-white/5">
          <div className="relative shrink-0">
            <div className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-black text-white"
              style={{ background: m.color }}>{m.name[0]}</div>
            <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2 bg-[#43b581]"
              style={{ borderColor: '#2b2d31' }} />
          </div>
          <span className="text-sm text-white/90 flex-1">{m.name}</span>
          {m.role === 'OWNER' && <Crown className="w-3.5 h-3.5 text-yellow-400" />}
        </div>
      ))}
      <p className="text-[10px] font-bold uppercase tracking-widest mt-3 mb-2 px-1" style={{ color: '#8e9297' }}>
        Offline — {offline.length}
      </p>
      {offline.map((m) => (
        <div key={m.name} className="flex items-center gap-2.5 px-2 py-2 rounded-lg mb-1 opacity-40">
          <div className="relative shrink-0">
            <div className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-black text-white"
              style={{ background: m.color }}>{m.name[0]}</div>
            <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2 bg-[#72767d]"
              style={{ borderColor: '#2b2d31' }} />
          </div>
          <span className="text-sm text-white/60">{m.name}</span>
        </div>
      ))}
    </div>
  );
}

/* ─── Stats bar ─── */
const STATS = [
  { value: '10–20', label: 'Users per room' },
  { value: '< 100ms', label: 'Latency (LiveKit)' },
  { value: '720p', label: 'Max video quality' },
  { value: '∞', label: 'Message history' },
];

function StatsSection() {
  const [ref, inView] = useInView();
  return (
    <section className="py-16 border-y border-white/5"
      style={{ background: 'linear-gradient(135deg, #16181c 0%, #1a1b2e 50%, #16181c 100%)' }}>
      <div ref={ref}
        className="max-w-5xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-8"
        style={{
          opacity: inView ? 1 : 0,
          transform: inView ? 'translateY(0)' : 'translateY(24px)',
          transition: 'all 0.7s ease',
        }}>
        {STATS.map((s, i) => (
          <div key={i} className="text-center">
            <p className="text-3xl md:text-4xl font-black mb-1"
              style={{ color: ['#7289da', '#43b581', '#a78bfa', '#faa61a'][i] }}>
              {s.value}
            </p>
            <p className="text-sm" style={{ color: '#72767d' }}>{s.label}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

/* ─── Main ─── */
export default function LandingPage() {
  const navigate = useNavigate();
  const { isAuthenticated, isLoading } = useAuthStore();
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const [heroRef, heroInView] = useInView(0.05);
  const [featRef, featInView] = useInView(0.05);
  const [ctaRef, ctaInView] = useInView(0.1);

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 12);
    window.addEventListener('scroll', handler);
    return () => window.removeEventListener('scroll', handler);
  }, []);

  const handleOpenApp = () => navigate(isAuthenticated ? '/app' : '/login');

  const scrollTo = (id) => {
    setMenuOpen(false);
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  };

  // Stable particles (computed once, not on every render)
  const particles = useRef(
    [...Array(28)].map(() => ({
      left: `${Math.random() * 100}%`,
      top: `${Math.random() * 100}%`,
      width: Math.random() > 0.7 ? 3 : 1.5,
      opacity: Math.random() * 0.35 + 0.05,
      color: ['#7289da', '#a78bfa', '#43b581', '#ffffff'][Math.floor(Math.random() * 4)],
      delay: Math.random() * 4,
      duration: 2.5 + Math.random() * 3,
    }))
  ).current;

  return (
    <div className="min-h-screen text-white overflow-x-hidden"
      style={{ background: '#1a1b1e', fontFamily: "'Inter', 'Segoe UI', sans-serif" }}>

      {/* ── NAVBAR ── */}
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? 'shadow-2xl border-b border-white/6' : ''}`}
        style={{
          background: scrolled ? 'rgba(20,21,25,0.92)' : 'transparent',
          backdropFilter: scrolled ? 'blur(16px)' : 'none',
        }}>
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-2.5 cursor-pointer group" onClick={() => scrollTo('hero')}>
            <div className="w-8 h-8 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform"
              style={{ background: 'linear-gradient(135deg, #7289da, #a78bfa)' }}>
              <Zap className="w-4 h-4 text-white" />
            </div>
            <span className="text-lg font-black tracking-tight">Meet<span style={{ color: '#7289da' }}>Lite</span></span>
          </div>

          {/* Desktop links */}
          <div className="hidden md:flex items-center gap-8">
            {[['Features', 'features'], ['About', 'about']].map(([label, id]) => (
              <button key={id} onClick={() => scrollTo(id)}
                className="text-sm font-medium transition-colors hover:text-white"
                style={{ color: '#8e9297' }}>
                {label}
              </button>
            ))}
          </div>

          {/* Auth */}
          <div className="hidden md:flex items-center gap-3">
            {!isLoading && (
              isAuthenticated ? (
                <button onClick={() => navigate('/app')}
                  className="px-5 py-2 rounded-full text-sm font-bold text-white flex items-center gap-1.5 transition-all hover:scale-105"
                  style={{ background: 'linear-gradient(135deg, #7289da, #5e73bc)' }}>
                  Open App <ArrowRight className="w-4 h-4" />
                </button>
              ) : (
                <>
                  <button onClick={() => navigate('/login')}
                    className="px-4 py-2 text-sm font-semibold transition-colors hover:text-white"
                    style={{ color: '#8e9297' }}>
                    Log In
                  </button>
                  <button onClick={() => navigate('/register')}
                    className="px-5 py-2 rounded-full text-sm font-bold text-white transition-all hover:scale-105 hover:shadow-lg"
                    style={{
                      background: 'linear-gradient(135deg, #7289da, #a78bfa)',
                      boxShadow: '0 0 0 transparent',
                    }}
                    onMouseEnter={e => e.target.style.boxShadow = '0 0 20px rgba(114,137,218,0.4)'}
                    onMouseLeave={e => e.target.style.boxShadow = '0 0 0 transparent'}>
                    Sign Up Free
                  </button>
                </>
              )
            )}
          </div>

          {/* Mobile toggle */}
          <button className="md:hidden p-1.5 rounded-lg transition-colors hover:bg-white/10"
            onClick={() => setMenuOpen(p => !p)}>
            {menuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>

        {/* Mobile menu */}
        {menuOpen && (
          <div className="md:hidden border-t border-white/5 px-6 py-5 flex flex-col gap-4"
            style={{ background: 'rgba(20,21,25,0.98)', backdropFilter: 'blur(16px)' }}>
            <button onClick={() => scrollTo('features')} className="text-left text-sm font-medium" style={{ color: '#8e9297' }}>Features</button>
            <button onClick={() => scrollTo('about')} className="text-left text-sm font-medium" style={{ color: '#8e9297' }}>About</button>
            <hr style={{ borderColor: 'rgba(255,255,255,0.06)' }} />
            {!isLoading && (isAuthenticated ? (
              <button onClick={() => navigate('/app')} className="w-full py-2.5 rounded-full text-sm font-bold text-white"
                style={{ background: '#7289da' }}>Open App</button>
            ) : (
              <div className="flex flex-col gap-2">
                <button onClick={() => navigate('/login')} className="w-full py-2.5 rounded-full text-sm font-bold border text-white"
                  style={{ borderColor: 'rgba(255,255,255,0.15)' }}>Log In</button>
                <button onClick={() => navigate('/register')} className="w-full py-2.5 rounded-full text-sm font-bold text-white"
                  style={{ background: 'linear-gradient(135deg,#7289da,#a78bfa)' }}>Sign Up Free</button>
              </div>
            ))}
          </div>
        )}
      </nav>

      {/* ── HERO ── */}
      <section id="hero" ref={heroRef}
        className="relative min-h-screen flex items-center pt-16 overflow-hidden"
        style={{ background: 'linear-gradient(160deg, #0d0e18 0%, #1a1b2e 40%, #1a1b1e 100%)' }}>

        {/* Background grid */}
        <div className="absolute inset-0 pointer-events-none opacity-20"
          style={{
            backgroundImage: 'linear-gradient(rgba(114,137,218,0.15) 1px, transparent 1px), linear-gradient(90deg, rgba(114,137,218,0.15) 1px, transparent 1px)',
            backgroundSize: '60px 60px',
          }} />

        {/* Radial glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 pointer-events-none"
          style={{
            width: 800, height: 600,
            background: 'radial-gradient(ellipse at center, rgba(114,137,218,0.18) 0%, transparent 70%)',
          }} />

        {/* Particles */}
        {particles.map((p, i) => (
          <Particle key={i} style={{
            left: p.left, top: p.top,
            width: p.width, height: p.width,
            background: p.color,
            opacity: p.opacity,
            animation: `pulse ${p.duration}s ${p.delay}s ease-in-out infinite alternate`,
          }} />
        ))}

        <div className="max-w-6xl mx-auto px-6 py-28 grid md:grid-cols-2 gap-16 items-center w-full">
          {/* Left */}
          <div style={{
            opacity: heroInView ? 1 : 0,
            transform: heroInView ? 'translateX(0)' : 'translateX(-40px)',
            transition: 'all 0.9s cubic-bezier(0.22,1,0.36,1)',
          }}>
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border text-xs font-bold mb-7"
              style={{ borderColor: 'rgba(114,137,218,0.35)', background: 'rgba(114,137,218,0.1)', color: '#7289da' }}>
              <Zap className="w-3 h-3" />
              Powered by LiveKit SFU · WebRTC
            </div>

            <h1 className="text-5xl md:text-6xl font-black leading-[1.05] mb-4">
              Your space to<br />
              <TypewriterText />
            </h1>

            <p className="text-base leading-relaxed mb-8 max-w-md" style={{ color: '#8e9297' }}>
              MeetLite is a real-time communication platform with persistent chat, HD voice & video,
              screen sharing, and live presence — built for teams, friends, and communities.
            </p>

            <div className="flex flex-wrap gap-3">
              <button onClick={handleOpenApp}
                className="px-7 py-3.5 rounded-full font-bold text-white flex items-center gap-2 transition-all hover:scale-105"
                style={{
                  background: 'linear-gradient(135deg, #7289da 0%, #5e73bc 100%)',
                  boxShadow: '0 4px 24px rgba(114,137,218,0.35)',
                }}>
                {isAuthenticated ? 'Open App' : 'Launch in Browser'}
                <ArrowRight className="w-4 h-4" />
              </button>
              {!isAuthenticated && (
                <button onClick={() => navigate('/register')}
                  className="px-7 py-3.5 rounded-full font-bold text-white border transition-all hover:scale-105 hover:bg-white/8"
                  style={{ borderColor: 'rgba(255,255,255,0.12)', background: 'rgba(255,255,255,0.04)' }}>
                  Create Account
                </button>
              )}
            </div>

            {/* Social proof / tech tags */}
            <div className="flex flex-wrap gap-2 mt-7">
              {['React 19', 'LiveKit SFU', 'Socket.IO', 'Neon PostgreSQL', 'Prisma'].map((tag) => (
                <span key={tag} className="text-[11px] font-semibold px-2.5 py-1 rounded-full border"
                  style={{ borderColor: 'rgba(255,255,255,0.08)', color: '#72767d', background: 'rgba(255,255,255,0.03)' }}>
                  {tag}
                </span>
              ))}
            </div>
          </div>

          {/* Right: App mockup */}
          <div style={{
            opacity: heroInView ? 1 : 0,
            transform: heroInView ? 'translateX(0)' : 'translateX(40px)',
            transition: 'all 0.9s cubic-bezier(0.22,1,0.36,1) 0.15s',
          }}>
            <AppMockup />
          </div>
        </div>
      </section>

      {/* ── MARQUEE ── */}
      <MarqueeStrip />

      {/* ── STATS ── */}
      <StatsSection />

      {/* ── FEATURES GRID ── */}
      <section id="features" className="py-24" style={{ background: '#1a1b1e' }}>
        <div ref={featRef} className="max-w-6xl mx-auto px-6"
          style={{
            opacity: featInView ? 1 : 0,
            transform: featInView ? 'translateY(0)' : 'translateY(24px)',
            transition: 'all 0.65s ease',
          }}>
          <div className="text-center mb-14">
            <p className="text-xs font-bold uppercase tracking-widest mb-3" style={{ color: '#7289da' }}>What you get</p>
            <h2 className="text-4xl md:text-5xl font-black mb-4 leading-tight">
              Everything you need,<br />
              <span className="text-transparent bg-clip-text" style={{
                backgroundImage: 'linear-gradient(90deg, #7289da, #a78bfa, #43b581)'
              }}>
                nothing you don't.
              </span>
            </h2>
            <p className="text-base max-w-lg mx-auto" style={{ color: '#8e9297' }}>
              No fluff, no bloat. A focused platform with the features that actually matter for real-time communication.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {FEATURES.map((f, i) => (
              <FeatureCard key={i} {...f} delay={i * 75} />
            ))}
          </div>
        </div>
      </section>

      {/* ── FEATURE HIGHLIGHT ROWS ── */}
      <FeatureRow
        emoji="🎙️" label="Voice & Video"
        title="Feel like you're in the same room."
        desc="No plugins, no downloads. Open a voice channel and start talking instantly. HD video with multi-participant support, adaptive streaming, echo cancellation, and noise suppression — all powered by LiveKit's SFU architecture."
        accent="#43b581"
        mockup={<VoiceMockup />}
        flip={false}
      />

      <FeatureRow
        emoji="💬" label="Text Channels"
        title="Organized conversations, always."
        desc="Create channels for different topics. Messages persist in the database — scroll back anytime. Real-time typing indicators, optimistic message delivery, and Socket.IO-powered broadcasting keep everyone in sync."
        accent="#7289da"
        mockup={<ChatMockup2 />}
        flip={true}
      />

      <FeatureRow
        emoji="👥" label="Live Presence"
        title="Always know who's around."
        desc="Live online/offline status on every member. The sidebar updates the moment someone connects, disconnects, or switches tabs. Invite anyone to your server with a shareable link — zero friction."
        accent="#a78bfa"
        mockup={<MembersMockup2 />}
        flip={false}
      />

      {/* ── CTA / ABOUT ── */}
      <section id="about" className="py-28 relative overflow-hidden"
        style={{ background: 'linear-gradient(160deg, #0d0e18 0%, #1a1b2e 100%)' }}>
        {/* Glow */}
        <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
          <div className="rounded-full blur-3xl opacity-20"
            style={{ width: 600, height: 400, background: 'radial-gradient(#7289da, #a78bfa)' }} />
        </div>

        <div ref={ctaRef}
          className="max-w-2xl mx-auto px-6 text-center relative z-10"
          style={{
            opacity: ctaInView ? 1 : 0,
            transform: ctaInView ? 'translateY(0)' : 'translateY(32px)',
            transition: 'all 0.75s ease',
          }}>
          <p className="text-xs font-bold uppercase tracking-widest mb-4" style={{ color: '#a78bfa' }}>Built by developers, for everyone</p>
          <h2 className="text-4xl md:text-5xl font-black mb-5 leading-tight">
            Ready to{' '}
            <span className="text-transparent bg-clip-text"
              style={{ backgroundImage: 'linear-gradient(135deg, #7289da, #a78bfa)' }}>
              MeetLite?
            </span>
          </h2>
          <p className="text-base mb-10 leading-relaxed" style={{ color: '#8e9297' }}>
            Create your server in seconds. Invite your crew with a link. No downloads,
            no installs — just real-time communication that works.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <button onClick={() => navigate('/register')}
              className="px-8 py-4 rounded-full font-bold text-white text-base flex items-center gap-2 transition-all hover:scale-105"
              style={{
                background: 'linear-gradient(135deg, #7289da 0%, #a78bfa 100%)',
                boxShadow: '0 4px 32px rgba(114,137,218,0.4)',
              }}>
              Get Started — It's Free <ArrowRight className="w-5 h-5" />
            </button>
            <button onClick={() => navigate('/login')}
              className="px-8 py-4 rounded-full font-bold text-white text-base border transition-all hover:scale-105 hover:bg-white/8"
              style={{ borderColor: 'rgba(255,255,255,0.12)', background: 'rgba(255,255,255,0.04)' }}>
              Log In
            </button>
          </div>
          <p className="text-xs mt-8" style={{ color: '#4f545c' }}>
            Open source · Built with React · Socket.IO · LiveKit · Neon PostgreSQL · Prisma
          </p>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer className="border-t py-8" style={{ borderColor: 'rgba(255,255,255,0.05)', background: '#111216' }}>
        <div className="max-w-6xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2.5 cursor-pointer" onClick={() => scrollTo('hero')}>
            <div className="w-7 h-7 rounded-lg flex items-center justify-center"
              style={{ background: 'linear-gradient(135deg,#7289da,#a78bfa)' }}>
              <Zap className="w-3.5 h-3.5 text-white" />
            </div>
            <span className="font-black text-sm">Meet<span style={{ color: '#7289da' }}>Lite</span></span>
          </div>

          <p className="text-xs" style={{ color: '#4f545c' }}>
            Built with ❤️ — React · Express · Socket.IO · LiveKit · Neon PostgreSQL
          </p>

          <div className="flex items-center gap-5 text-xs" style={{ color: '#72767d' }}>
            <button onClick={() => scrollTo('features')} className="hover:text-white transition-colors">Features</button>
            <button onClick={() => navigate('/login')} className="hover:text-white transition-colors">Log In</button>
            <button onClick={() => navigate('/register')} className="hover:text-white transition-colors">Sign Up</button>
          </div>
        </div>
      </footer>

      {/* Global pulse animation for particles */}
      <style>{`
        @keyframes pulse {
          0% { opacity: 0.05; transform: scale(1); }
          100% { opacity: 0.35; transform: scale(1.4); }
        }
      `}</style>
    </div>
  );
}
