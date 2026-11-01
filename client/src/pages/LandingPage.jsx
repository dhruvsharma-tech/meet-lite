import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import gsap from 'gsap';
import {
  MessageSquare, Users, Zap,
  Menu, X, Mic, MicOff, Hash, Volume2, Crown, ArrowRight,
  Sparkles, Radio, CheckCircle2, Gamepad2
} from 'lucide-react';

/* ─────────────────────────────────────────────────────────
   TYPEWRITER EFFECT IN HERO
───────────────────────────────────────────────────────── */
const WORDS = ['Talk.', 'Stream.', 'Connect.', 'Vibe.', 'Build.'];
function TypewriterText() {
  const [idx, setIdx] = useState(0);
  const [chars, setChars] = useState('');
  const [del, setDel] = useState(false);
  const [pause, setPause] = useState(false);

  useEffect(() => {
    const word = WORDS[idx];
    if (pause) {
      const t = setTimeout(() => { setDel(true); setPause(false); }, 1800);
      return () => clearTimeout(t);
    }
    if (!del) {
      if (chars.length < word.length) {
        const t = setTimeout(() => setChars(word.slice(0, chars.length + 1)), 90);
        return () => clearTimeout(t);
      }
      setPause(true);
    } else {
      if (chars.length > 0) {
        const t = setTimeout(() => setChars(chars.slice(0, -1)), 45);
        return () => clearTimeout(t);
      }
      setDel(false);
      setIdx((p) => (p + 1) % WORDS.length);
    }
  }, [chars, del, pause, idx]);

  return (
    <span className="cosmic-gradient-text">
      {chars}<span className="cursor-blink">|</span>
    </span>
  );
}

/* ─────────────────────────────────────────────────────────
   MARQUEE BANNER
───────────────────────────────────────────────────────── */
const TICKER_ITEMS = [
  'TALK', 'STREAM', 'HANG OUT', 'GAMING', 'CONNECT', 'WATCH TOGETHER', 'VIBE', 'CHAT'
];
function MarqueeBanner() {
  const items = [...TICKER_ITEMS, ...TICKER_ITEMS, ...TICKER_ITEMS, ...TICKER_ITEMS];
  return (
    <div className="marquee-strip">
      <div className="marquee-track">
        {items.map((word, i) => (
          <div key={i} className="marquee-pill">
            <span className="marquee-star">✦</span>
            <span className="marquee-text">{word}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────
   TACTILE ANIMATED BUTTON (PHYSICAL PRESS)
───────────────────────────────────────────────────────── */
function AnimButton({ children, onClick, variant = 'primary', className = '', style = {} }) {
  const btnRef = useRef(null);

  const handleMouseDown = () => {
    gsap.to(btnRef.current, { scale: 0.94, y: 2, duration: 0.08, ease: 'power1.in' });
  };
  const handleMouseUp = () => {
    gsap.to(btnRef.current, { scale: 1, y: 0, duration: 0.25, ease: 'back.out(2.5)' });
  };
  const handleMouseEnter = () => {
    gsap.to(btnRef.current, { y: -2, duration: 0.2, ease: 'power2.out' });
  };
  const handleMouseLeave = () => {
    gsap.to(btnRef.current, { y: 0, scale: 1, duration: 0.25, ease: 'power2.out' });
  };

  return (
    <button
      ref={btnRef}
      onClick={onClick}
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className={`tactile-btn tactile-btn-${variant} ${className}`}
      style={style}
    >
      {children}
    </button>
  );
}

/* ─────────────────────────────────────────────────────────
   BIG FEATURE CARD WITH GSAP HOVER
───────────────────────────────────────────────────────── */
function BigFeatureCard({
  tag,
  title,
  desc,
  accentColor,
  flip = false,
  badge,
  perks = [],
  children
}) {
  const cardRef = useRef(null);
  const glowRef = useRef(null);

  const onMouseEnter = () => {
    gsap.to(cardRef.current, {
      y: -8,
      scale: 1.015,
      borderColor: `${accentColor}88`,
      boxShadow: `0 28px 70px -15px ${accentColor}40, 0 0 0 1px ${accentColor}55`,
      duration: 0.4,
      ease: 'power2.out',
    });
    if (glowRef.current) {
      gsap.to(glowRef.current, { opacity: 0.6, duration: 0.4 });
    }
  };

  const onMouseLeave = () => {
    gsap.to(cardRef.current, {
      y: 0,
      scale: 1,
      borderColor: 'rgba(255, 255, 255, 0.08)',
      boxShadow: '0 18px 45px rgba(0, 0, 0, 0.45)',
      duration: 0.4,
      ease: 'power2.out',
    });
    if (glowRef.current) {
      gsap.to(glowRef.current, { opacity: 0.2, duration: 0.4 });
    }
  };

  return (
    <div
      ref={cardRef}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      className={`big-feature-card ${flip ? 'flipped' : ''}`}
      style={{
        '--card-accent': accentColor,
      }}
    >
      <div
        ref={glowRef}
        className="card-ambient-glow"
        style={{
          background: `radial-gradient(circle at ${flip ? '85%' : '15%'} 35%, ${accentColor}55, transparent 72%)`,
        }}
      />

      {/* Text Info */}
      <div className="card-info">
        <div
          className="card-badge"
          style={{
            color: accentColor,
            borderColor: `${accentColor}55`,
            background: `${accentColor}18`,
          }}
        >
          {badge}
          <span>{tag}</span>
        </div>
        <h2 className="card-title">{title}</h2>
        <p className="card-desc">{desc}</p>
        <div className="card-perks">
          {perks.map((perk, idx) => (
            <div key={idx} className="perk-item">
              <CheckCircle2 size={16} color={accentColor} />
              <span>{perk}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Visual / Mockup Preview */}
      <div className="card-visual">
        {children}
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────
   MOCKUP 1: VOICE CALL & AUDIO GRID (WESTERN NAMES)
───────────────────────────────────────────────────────── */
function VoiceMockup() {
  const [muted, setMuted] = useState(false);
  const participants = [
    { name: 'Alex', role: 'Speaking', color: '#5865F2', speaking: true },
    { name: 'Chloe', role: 'Listening', color: '#43b581', speaking: false },
    { name: 'Jordan', role: 'Speaking', color: '#a78bfa', speaking: true },
    { name: 'Sam', role: 'In Call', color: '#faa61a', speaking: false },
  ];

  return (
    <div className="mockup-frame voice-mockup-frame">
      <div className="mockup-header">
        <div className="flex items-center gap-2">
          <Volume2 size={16} color="#43b581" />
          <span className="font-bold text-xs text-white">Voice Lounge / General</span>
        </div>
        <span className="live-pill">
          <span className="live-dot" /> LIVE 4 CONNECTED
        </span>
      </div>

      <div className="voice-grid">
        {participants.map((p, i) => (
          <div
            key={i}
            className={`voice-tile ${p.speaking ? 'active-speaker' : ''}`}
            style={{ '--speaker-color': p.color }}
          >
            <div
              className="voice-avatar"
              style={{
                background: `${p.color}30`,
                color: p.color,
                border: `2px solid ${p.speaking ? p.color : 'transparent'}`
              }}
            >
              {p.name[0]}
            </div>
            <span className="voice-name">{p.name}</span>
            {p.speaking && (
              <span className="speaking-badge">
                <Mic size={10} color="#fff" />
              </span>
            )}
          </div>
        ))}
      </div>

      <div className="mockup-controls">
        <button
          onClick={() => setMuted(!muted)}
          className={`control-btn ${muted ? 'btn-danger' : 'btn-active'}`}
        >
          {muted ? <MicOff size={14} /> : <Mic size={14} />}
          <span>{muted ? 'Muted' : 'Mic Active'}</span>
        </button>
        <div className="sound-bars">
          <span className="bar bar-1" />
          <span className="bar bar-2" />
          <span className="bar bar-3" />
          <span className="bar bar-4" />
        </div>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────
   MOCKUP 2: LIVE STREAM / GAMING & MOVIE (NO CODE)
───────────────────────────────────────────────────────── */
function StreamMockup() {
  return (
    <div className="mockup-frame stream-mockup-frame">
      <div className="mockup-header">
        <div className="flex items-center gap-2">
          <Gamepad2 size={16} color="#f04747" />
          <span className="font-bold text-xs text-white">Alex's Stream — Cyber Horizon 2077</span>
        </div>
        <span className="stream-badge">LIVE 1080P 60FPS</span>
      </div>

      <div className="game-screen-display">
        {/* Game Scene / Nebula art */}
        <div className="game-visual-stage">
          <div className="space-planet" />
          <div className="space-spaceship" />
          <div className="hud-overlay">
            <div className="hud-status">
              <span className="hud-badge">RANK 1</span>
              <span className="hud-hp">HP 100%</span>
            </div>
            <div className="hud-game-title">CYBER HORIZON · BOSS FIGHT</div>
          </div>
          <div className="stream-bottom-bar">
            <div className="stream-spectators">
              <Users size={12} /> 12 friends watching
            </div>
            <div className="stream-sound-active">
              <Volume2 size={13} color="#43b581" /> HD Audio Live
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────
   MOCKUP 3: SERVER & CHANNEL CHAT (CLEAN ENGLISH)
───────────────────────────────────────────────────────── */
function ServerChatMockup() {
  return (
    <div className="mockup-frame chat-mockup-frame">
      <div className="mockup-header">
        <div className="flex items-center gap-2">
          <Hash size={16} color="#5865F2" />
          <span className="font-bold text-xs text-white">general</span>
        </div>
        <span className="text-[11px] text-zinc-400">Gaming & Chill</span>
      </div>

      <div className="chat-messages-area">
        <div className="chat-bubble">
          <div className="bubble-avatar bg-indigo-600">A</div>
          <div className="bubble-content">
            <div className="bubble-user">
              <span className="user-name">Alex</span>
              <span className="user-time">Today at 7:15 PM</span>
            </div>
            <div className="user-msg">Hey everyone! Jump in the voice lounge, stream is starting now! 🎮</div>
          </div>
        </div>

        <div className="chat-bubble">
          <div className="bubble-avatar bg-emerald-600">C</div>
          <div className="bubble-content">
            <div className="bubble-user">
              <span className="user-name">Chloe</span>
              <span className="user-time">Today at 7:16 PM</span>
            </div>
            <div className="user-msg">Just hopped in! Sound quality is so crystal clear tonight 🔥</div>
          </div>
        </div>

        <div className="chat-bubble">
          <div className="bubble-avatar bg-purple-600">J</div>
          <div className="bubble-content">
            <div className="bubble-user">
              <span className="user-name">Jordan</span>
              <span className="user-time">Today at 7:17 PM</span>
            </div>
            <div className="user-msg">Watching the stream now. Let's go win this match! 🚀</div>
          </div>
        </div>

        <div className="chat-typing-bar">
          <span className="typing-dots">
            <span /><span /><span />
          </span>
          <span className="text-[11px] text-zinc-400">Sam is typing...</span>
        </div>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────
   MOCKUP 4: PRESENCE & MEMBERS (WESTERN NAMES)
───────────────────────────────────────────────────────── */
function PresenceMockup() {
  const members = [
    { name: 'Alex', role: 'Server Owner', online: true, isOwner: true, color: '#5865F2' },
    { name: 'Chloe', role: 'In Voice Call', online: true, isOwner: false, color: '#43b581' },
    { name: 'Jordan', role: 'Streaming Live', online: true, isOwner: false, color: '#f04747' },
    { name: 'Sam', role: 'Online', online: true, isOwner: false, color: '#a78bfa' },
    { name: 'Lucas', role: 'Offline (2h ago)', online: false, isOwner: false, color: '#72767d' },
  ];

  return (
    <div className="mockup-frame presence-mockup-frame">
      <div className="mockup-header">
        <div className="flex items-center gap-2">
          <Users size={16} color="#a78bfa" />
          <span className="font-bold text-xs text-white">Server Members</span>
        </div>
        <span className="online-count">4 ONLINE</span>
      </div>

      <div className="members-stack">
        {members.map((m, idx) => (
          <div key={idx} className={`member-item ${m.online ? 'is-online' : 'is-offline'}`}>
            <div className="member-avatar-box">
              <div className="avatar-circle" style={{ background: m.color }}>
                {m.name[0]}
              </div>
              <span className={`status-indicator ${m.online ? 'dot-online' : 'dot-offline'}`} />
            </div>
            <div className="member-meta">
              <div className="member-display-name">
                <span>{m.name}</span>
                {m.isOwner && <Crown size={12} color="#faa61a" />}
              </div>
              <span className="member-status-text">{m.role}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────
   MAIN LANDING PAGE
───────────────────────────────────────────────────────── */
export default function LandingPage() {
  const navigate = useNavigate();
  const { isAuthenticated, isLoading } = useAuthStore();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const scrollToSection = (id) => {
    setMobileMenuOpen(false);
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <div className="landing-wrapper">
      {/* ── STYLES ── */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap');

        *, *::before, *::after {
          box-sizing: border-box;
          margin: 0;
          padding: 0;
        }

        html {
          scroll-behavior: smooth;
        }

        /* 100% natural, smooth vertical trackpad scroll */
        html, body {
          overflow-x: hidden !important;
          overflow-y: auto !important;
          background: #080914;
          color: #f2f3f5;
          font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
        }

        .landing-wrapper {
          min-height: 100vh;
          width: 100%;
          background: #080914;
          position: relative;
          display: flex;
          flex-direction: column;
        }

        /* ── SPACE / COSMIC BACKGROUND ELEMENTS ── */
        .cosmic-stars-canvas {
          position: fixed;
          inset: 0;
          pointer-events: none;
          z-index: 0;
          background-image: 
            radial-gradient(1px 1px at 20px 30px, #ffffff, rgba(0,0,0,0)),
            radial-gradient(1.5px 1.5px at 100px 150px, #a78bfa, rgba(0,0,0,0)),
            radial-gradient(1px 1px at 240px 80px, #ffffff, rgba(0,0,0,0)),
            radial-gradient(2px 2px at 400px 220px, #7289da, rgba(0,0,0,0)),
            radial-gradient(1px 1px at 550px 120px, #ffffff, rgba(0,0,0,0)),
            radial-gradient(1.5px 1.5px at 720px 290px, #f472b6, rgba(0,0,0,0)),
            radial-gradient(1px 1px at 890px 60px, #ffffff, rgba(0,0,0,0)),
            radial-gradient(2px 2px at 980px 180px, #38bdf8, rgba(0,0,0,0));
          background-repeat: repeat;
          background-size: 1000px 350px;
          opacity: 0.55;
        }

        .cosmic-nebula-glow {
          position: absolute;
          top: -120px;
          left: 50%;
          transform: translateX(-50%);
          width: 1100px;
          height: 650px;
          background: radial-gradient(ellipse at center, rgba(88, 101, 242, 0.28) 0%, rgba(139, 92, 246, 0.18) 45%, transparent 70%);
          filter: blur(50px);
          pointer-events: none;
          z-index: 0;
        }

        .cosmic-secondary-nebula {
          position: absolute;
          top: 800px;
          right: -100px;
          width: 700px;
          height: 500px;
          background: radial-gradient(ellipse at center, rgba(236, 72, 153, 0.15) 0%, rgba(88, 101, 242, 0.1) 50%, transparent 70%);
          filter: blur(60px);
          pointer-events: none;
          z-index: 0;
        }

        /* ── NAVBAR ── */
        .landing-nav {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          height: 70px;
          z-index: 100;
          background: rgba(8, 9, 20, 0.88);
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
          border-bottom: 1px solid rgba(255, 255, 255, 0.08);
          display: flex;
          align-items: center;
        }

        .nav-container {
          max-width: 1200px;
          width: 100%;
          margin: 0 auto;
          padding: 0 24px;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .brand-logo {
          display: flex;
          align-items: center;
          gap: 10px;
          text-decoration: none;
          cursor: pointer;
        }

        .brand-icon {
          width: 36px;
          height: 36px;
          border-radius: 10px;
          background: linear-gradient(135deg, #5865F2, #8b5cf6);
          display: flex;
          align-items: center;
          justify-content: center;
          color: #fff;
          box-shadow: 0 4px 16px rgba(88, 101, 242, 0.5);
        }

        .brand-name {
          font-size: 19px;
          font-weight: 900;
          letter-spacing: -0.02em;
          color: #fff;
        }

        .brand-name span {
          color: #7289da;
        }

        .nav-links-row {
          display: flex;
          align-items: center;
          gap: 32px;
        }

        .nav-btn-link {
          background: transparent;
          border: none;
          color: #b5bac1;
          font-size: 14px;
          font-weight: 600;
          cursor: pointer;
          transition: color 0.2s ease;
        }

        .nav-btn-link:hover {
          color: #ffffff;
        }

        /* ── TACTILE BUTTONS ── */
        .tactile-btn {
          font-family: inherit;
          font-weight: 700;
          font-size: 14px;
          padding: 12px 26px;
          border-radius: 9999px;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          cursor: pointer;
          outline: none;
          border: none;
          user-select: none;
          transition: filter 0.15s ease, background 0.15s ease, border-color 0.15s ease;
        }

        .tactile-btn:active {
          transform: translateY(2px) scale(0.96) !important;
        }

        .tactile-btn-primary {
          background: linear-gradient(135deg, #5865F2 0%, #7289da 100%);
          color: #ffffff;
          box-shadow: 0 6px 24px rgba(88, 101, 242, 0.45);
        }

        .tactile-btn-primary:hover {
          filter: brightness(1.12);
          box-shadow: 0 8px 30px rgba(88, 101, 242, 0.6);
        }

        .tactile-btn-secondary {
          background: rgba(255, 255, 255, 0.08);
          border: 1px solid rgba(255, 255, 255, 0.16);
          color: #ffffff;
        }

        .tactile-btn-secondary:hover {
          background: rgba(255, 255, 255, 0.15);
          border-color: rgba(255, 255, 255, 0.35);
        }

        .tactile-btn-large {
          padding: 16px 36px;
          font-size: 16px;
          border-radius: 9999px;
        }

        /* ── HERO SECTION ── */
        .hero-section {
          padding-top: 140px;
          padding-bottom: 70px;
          position: relative;
          z-index: 1;
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
        }

        .hero-badge-tag {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 8px 18px;
          border-radius: 9999px;
          background: rgba(88, 101, 242, 0.18);
          border: 1px solid rgba(88, 101, 242, 0.4);
          color: #9cb2ff;
          font-size: 12px;
          font-weight: 700;
          letter-spacing: 0.06em;
          text-transform: uppercase;
          margin-bottom: 24px;
        }

        .hero-headline {
          font-size: clamp(42px, 6vw, 76px);
          font-weight: 900;
          letter-spacing: -0.03em;
          line-height: 1.05;
          max-width: 900px;
          margin: 0 auto 22px;
          color: #ffffff;
        }

        .cosmic-gradient-text {
          background: linear-gradient(135deg, #7289da 0%, #c084fc 50%, #f472b6 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }

        .cursor-blink {
          -webkit-text-fill-color: #7289da;
          animation: blink 1s step-end infinite;
        }
        @keyframes blink { 0%, 100% { opacity: 1; } 50% { opacity: 0; } }

        .hero-subhead {
          font-size: clamp(16px, 2vw, 19px);
          line-height: 1.65;
          color: #9da7b3;
          max-width: 660px;
          margin: 0 auto 38px;
        }

        .hero-actions {
          display: flex;
          gap: 16px;
          justify-content: center;
          flex-wrap: wrap;
          margin-bottom: 56px;
        }

        /* ── HERO APP PREVIEW PORTAL (SLEEK 3D INTERFACE) ── */
        .hero-portal-container {
          width: 100%;
          max-width: 960px;
          margin: 0 auto;
          position: relative;
          padding: 0 20px;
        }

        .portal-glass-frame {
          background: linear-gradient(145deg, rgba(28, 30, 48, 0.85), rgba(16, 17, 30, 0.95));
          border: 1px solid rgba(255, 255, 255, 0.12);
          border-radius: 28px;
          padding: 24px;
          box-shadow: 0 30px 80px -15px rgba(0, 0, 0, 0.8), 0 0 40px rgba(88, 101, 242, 0.2);
          backdrop-filter: blur(16px);
          display: grid;
          grid-template-columns: 200px 1fr 220px;
          gap: 20px;
          text-align: left;
        }

        .portal-col-sidebar {
          background: rgba(0, 0, 0, 0.25);
          border-radius: 18px;
          padding: 16px;
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .portal-col-chat {
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          padding: 8px 0;
        }

        .portal-col-members {
          background: rgba(0, 0, 0, 0.25);
          border-radius: 18px;
          padding: 16px;
          display: flex;
          flex-direction: column;
          gap: 10px;
        }

        /* ── TICKER / MARQUEE ── */
        .marquee-strip {
          width: 100%;
          overflow: hidden;
          background: #060710;
          border-top: 1px solid rgba(255, 255, 255, 0.06);
          border-bottom: 1px solid rgba(255, 255, 255, 0.06);
          padding: 16px 0;
          position: relative;
          z-index: 1;
        }

        .marquee-track {
          display: flex;
          white-space: nowrap;
          width: max-content;
          animation: ticker-anim 28s linear infinite;
        }

        @keyframes ticker-anim {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }

        .marquee-pill {
          display: inline-flex;
          align-items: center;
          gap: 12px;
          padding: 0 36px;
        }

        .marquee-star {
          color: #7289da;
          font-size: 14px;
        }

        .marquee-text {
          font-size: 14px;
          font-weight: 900;
          letter-spacing: 0.25em;
          color: rgba(255, 255, 255, 0.8);
        }

        /* ── BIG SCROLLABLE FEATURE CARDS SECTION ── */
        .features-container-section {
          max-width: 1200px;
          width: 100%;
          margin: 0 auto;
          padding: 100px 24px;
          display: flex;
          flex-direction: column;
          gap: 56px;
          position: relative;
          z-index: 1;
        }

        .section-header-title {
          text-align: center;
          margin-bottom: 24px;
        }

        .section-header-title h2 {
          font-size: clamp(34px, 4.5vw, 54px);
          font-weight: 900;
          color: #ffffff;
          letter-spacing: -0.02em;
          margin-bottom: 14px;
        }

        .section-header-title p {
          color: #9da7b3;
          font-size: 16px;
        }

        /* ── BIG FEATURE CARD ── */
        .big-feature-card {
          width: 100%;
          background: #101221;
          border: 1px solid rgba(255, 255, 255, 0.08);
          border-radius: 36px;
          padding: 56px 48px;
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 56px;
          align-items: center;
          position: relative;
          overflow: hidden;
          box-shadow: 0 18px 45px rgba(0, 0, 0, 0.45);
          transition: transform 0.3s ease, border-color 0.3s ease, box-shadow 0.3s ease;
          cursor: pointer;
        }

        .big-feature-card.flipped {
          grid-template-columns: 1fr 1fr;
        }

        .big-feature-card.flipped .card-info {
          order: 2;
        }

        .big-feature-card.flipped .card-visual {
          order: 1;
        }

        .card-ambient-glow {
          position: absolute;
          inset: 0;
          pointer-events: none;
          opacity: 0.2;
          transition: opacity 0.4s ease;
        }

        .card-info {
          display: flex;
          flex-direction: column;
          gap: 18px;
          z-index: 2;
        }

        .card-badge {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 6px 14px;
          border-radius: 9999px;
          border: 1px solid;
          font-size: 11px;
          font-weight: 800;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          width: fit-content;
        }

        .card-title {
          font-size: clamp(28px, 3.2vw, 42px);
          font-weight: 900;
          color: #ffffff;
          line-height: 1.12;
          letter-spacing: -0.02em;
        }

        .card-desc {
          font-size: 16px;
          line-height: 1.7;
          color: #9da7b3;
        }

        .card-perks {
          display: flex;
          flex-direction: column;
          gap: 10px;
          margin-top: 8px;
        }

        .perk-item {
          display: flex;
          align-items: center;
          gap: 10px;
          font-size: 14px;
          color: #dbdee1;
          font-weight: 600;
        }

        .card-visual {
          width: 100%;
          z-index: 2;
        }

        /* ── MOCKUPS INSIDE CARDS ── */
        .mockup-frame {
          background: #17192c;
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 24px;
          padding: 24px;
          box-shadow: 0 20px 48px rgba(0, 0, 0, 0.5);
        }

        .mockup-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding-bottom: 16px;
          border-bottom: 1px solid rgba(255, 255, 255, 0.06);
          margin-bottom: 18px;
        }

        .live-pill {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          background: rgba(67, 181, 129, 0.15);
          color: #43b581;
          font-size: 10px;
          font-weight: 800;
          padding: 3px 8px;
          border-radius: 9999px;
        }

        .live-dot {
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background: #43b581;
          animation: pulse-dot 1.5s infinite;
        }

        @keyframes pulse-dot {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.4; transform: scale(0.8); }
        }

        /* Voice Grid */
        .voice-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 14px;
        }

        .voice-tile {
          background: rgba(255, 255, 255, 0.03);
          border: 1.5px solid rgba(255, 255, 255, 0.08);
          border-radius: 16px;
          padding: 22px 14px;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 10px;
          position: relative;
          transition: transform 0.2s ease, border-color 0.2s ease;
        }

        .voice-tile.active-speaker {
          border-color: #43b581;
          box-shadow: 0 0 16px rgba(67, 181, 129, 0.25);
        }

        .voice-avatar {
          width: 50px;
          height: 50px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 18px;
          font-weight: 900;
        }

        .voice-name {
          font-size: 13px;
          font-weight: 700;
          color: #ffffff;
        }

        .speaking-badge {
          position: absolute;
          top: 10px;
          right: 10px;
          width: 20px;
          height: 20px;
          border-radius: 50%;
          background: #43b581;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .mockup-controls {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-top: 18px;
          padding-top: 14px;
          border-top: 1px solid rgba(255, 255, 255, 0.06);
        }

        .control-btn {
          display: flex;
          align-items: center;
          gap: 6px;
          padding: 8px 16px;
          border-radius: 9999px;
          font-size: 12px;
          font-weight: 700;
          cursor: pointer;
          border: none;
        }

        .btn-active {
          background: rgba(67, 181, 129, 0.2);
          color: #43b581;
          border: 1px solid rgba(67, 181, 129, 0.4);
        }

        .btn-danger {
          background: rgba(240, 71, 71, 0.2);
          color: #f04747;
          border: 1px solid rgba(240, 71, 71, 0.4);
        }

        .sound-bars {
          display: flex;
          align-items: center;
          gap: 4px;
        }

        .sound-bars .bar {
          width: 3px;
          background: #43b581;
          border-radius: 2px;
          animation: bar-wave 1s infinite alternate;
        }

        .bar-1 { height: 14px; animation-delay: 0.1s; }
        .bar-2 { height: 22px; animation-delay: 0.3s; }
        .bar-3 { height: 18px; animation-delay: 0.2s; }
        .bar-4 { height: 10px; animation-delay: 0.4s; }

        @keyframes bar-wave {
          0% { transform: scaleY(0.4); }
          100% { transform: scaleY(1.2); }
        }

        /* ── GAME / MOVIE STREAM DISPLAY (NO CODE) ── */
        .game-screen-display {
          border-radius: 18px;
          overflow: hidden;
          background: #0d0f1a;
          border: 1px solid rgba(255, 255, 255, 0.1);
          position: relative;
        }

        .game-visual-stage {
          height: 220px;
          background: linear-gradient(135deg, #181938 0%, #2b1d42 50%, #0d1b33 100%);
          position: relative;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          padding: 16px;
          overflow: hidden;
        }

        .space-planet {
          position: absolute;
          top: -20px;
          right: 40px;
          width: 90px;
          height: 90px;
          border-radius: 50%;
          background: radial-gradient(circle at 30% 30%, #ec4899, #7c3aed);
          box-shadow: 0 0 30px rgba(236, 72, 153, 0.5);
          opacity: 0.85;
        }

        .space-spaceship {
          position: absolute;
          bottom: 45px;
          left: 60px;
          width: 140px;
          height: 60px;
          background: radial-gradient(ellipse at center, rgba(56, 189, 248, 0.3), transparent);
          border-bottom: 2px solid #38bdf8;
          transform: rotate(-10deg);
        }

        .hud-overlay {
          display: flex;
          justify-content: space-between;
          align-items: center;
          position: relative;
          z-index: 2;
        }

        .hud-status {
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .hud-badge {
          background: #f04747;
          color: #fff;
          font-size: 10px;
          font-weight: 900;
          padding: 2px 8px;
          border-radius: 4px;
        }

        .hud-hp {
          background: rgba(0, 0, 0, 0.6);
          color: #43b581;
          font-size: 10px;
          font-weight: 800;
          padding: 2px 8px;
          border-radius: 4px;
          border: 1px solid rgba(67, 181, 129, 0.4);
        }

        .hud-game-title {
          font-size: 11px;
          font-weight: 800;
          color: #e2e8f0;
          letter-spacing: 0.1em;
          text-shadow: 0 2px 8px rgba(0, 0, 0, 0.8);
        }

        .stream-bottom-bar {
          display: flex;
          justify-content: space-between;
          align-items: center;
          position: relative;
          z-index: 2;
        }

        .stream-spectators {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          background: rgba(0, 0, 0, 0.65);
          padding: 5px 12px;
          border-radius: 9999px;
          font-size: 11px;
          color: #dbdee1;
          border: 1px solid rgba(255, 255, 255, 0.1);
        }

        .stream-sound-active {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          background: rgba(67, 181, 129, 0.15);
          padding: 5px 12px;
          border-radius: 9999px;
          font-size: 11px;
          color: #43b581;
          font-weight: 700;
          border: 1px solid rgba(67, 181, 129, 0.3);
        }

        .stream-badge {
          background: rgba(240, 71, 71, 0.2);
          color: #f04747;
          border: 1px solid rgba(240, 71, 71, 0.4);
          font-size: 10px;
          font-weight: 800;
          padding: 3px 8px;
          border-radius: 6px;
        }

        /* ── CHAT BUBBLES ── */
        .chat-messages-area {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        .chat-bubble {
          display: flex;
          gap: 12px;
          align-items: flex-start;
        }

        .bubble-avatar {
          width: 36px;
          height: 36px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 900;
          font-size: 14px;
          color: #fff;
          flex-shrink: 0;
        }

        .bubble-content {
          display: flex;
          flex-direction: column;
          gap: 3px;
        }

        .bubble-user {
          display: flex;
          align-items: baseline;
          gap: 8px;
        }

        .user-name {
          font-size: 13px;
          font-weight: 700;
          color: #ffffff;
        }

        .user-time {
          font-size: 10px;
          color: #9da7b3;
        }

        .user-msg {
          font-size: 14px;
          color: #dbdee1;
          line-height: 1.45;
        }

        .chat-typing-bar {
          display: flex;
          align-items: center;
          gap: 8px;
          margin-top: 10px;
        }

        .typing-dots {
          display: inline-flex;
          gap: 3px;
        }

        .typing-dots span {
          width: 4px;
          height: 4px;
          background: #72767d;
          border-radius: 50%;
          animation: dot-bounce 1.2s infinite;
        }
        .typing-dots span:nth-child(2) { animation-delay: 0.2s; }
        .typing-dots span:nth-child(3) { animation-delay: 0.4s; }

        @keyframes dot-bounce {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-4px); }
        }

        /* ── PRESENCE STACK ── */
        .members-stack {
          display: flex;
          flex-direction: column;
          gap: 10px;
        }

        .member-item {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 8px 10px;
          border-radius: 12px;
          background: rgba(255, 255, 255, 0.02);
          transition: background 0.2s ease;
        }

        .member-item:hover {
          background: rgba(255, 255, 255, 0.06);
        }

        .member-item.is-offline {
          opacity: 0.45;
        }

        .member-avatar-box {
          position: relative;
        }

        .avatar-circle {
          width: 34px;
          height: 34px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 900;
          font-size: 13px;
          color: #fff;
        }

        .status-indicator {
          position: absolute;
          bottom: -1px;
          right: -1px;
          width: 10px;
          height: 10px;
          border-radius: 50%;
          border: 2px solid #17192c;
        }

        .dot-online {
          background: #43b581;
        }

        .dot-offline {
          background: #72767d;
        }

        .member-meta {
          display: flex;
          flex-direction: column;
        }

        .member-display-name {
          display: flex;
          align-items: center;
          gap: 6px;
          font-size: 13px;
          font-weight: 700;
          color: #ffffff;
        }

        .member-status-text {
          font-size: 11px;
          color: #9da7b3;
        }

        .online-count {
          font-size: 10px;
          font-weight: 800;
          letter-spacing: 0.08em;
          color: #43b581;
          background: rgba(67, 181, 129, 0.12);
          padding: 2px 8px;
          border-radius: 9999px;
        }

        /* ── READY CTA ── */
        .ready-cta-section {
          padding: 130px 24px;
          background: radial-gradient(circle at center, #171936 0%, #080914 75%);
          text-align: center;
          border-top: 1px solid rgba(255, 255, 255, 0.06);
          position: relative;
          z-index: 1;
        }

        .cta-box {
          max-width: 680px;
          margin: 0 auto;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 20px;
        }

        .cta-box h2 {
          font-size: clamp(34px, 5vw, 60px);
          font-weight: 900;
          color: #ffffff;
          line-height: 1.1;
          letter-spacing: -0.025em;
        }

        .cta-box p {
          color: #9da7b3;
          font-size: 17px;
          line-height: 1.7;
          max-width: 520px;
        }

        /* ── FOOTER ── */
        .landing-footer {
          border-top: 1px solid rgba(255, 255, 255, 0.06);
          padding: 40px 24px;
          background: #05060d;
          position: relative;
          z-index: 1;
        }

        .footer-inner {
          max-width: 1200px;
          margin: 0 auto;
          display: flex;
          justify-content: space-between;
          align-items: center;
          flex-wrap: wrap;
          gap: 20px;
        }

        .footer-left {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .footer-text {
          font-size: 13px;
          color: #64748b;
        }

        .footer-links {
          display: flex;
          gap: 24px;
        }

        .footer-link-btn {
          background: transparent;
          border: none;
          color: #9da7b3;
          font-size: 13px;
          cursor: pointer;
          transition: color 0.2s ease;
        }

        .footer-link-btn:hover {
          color: #fff;
        }

        /* ── RESPONSIVE DESIGN ── */
        @media (max-width: 900px) {
          .big-feature-card,
          .big-feature-card.flipped {
            grid-template-columns: 1fr;
            padding: 36px 24px;
            gap: 36px;
          }
          .big-feature-card.flipped .card-info {
            order: 1;
          }
          .big-feature-card.flipped .card-visual {
            order: 2;
          }
          .nav-links-row {
            display: none;
          }
          .mobile-menu-toggle {
            display: block !important;
          }
          .portal-glass-frame {
            grid-template-columns: 1fr;
          }
          .portal-col-sidebar, .portal-col-members {
            display: none;
          }
        }

        .mobile-menu-toggle {
          display: none;
          background: none;
          border: none;
          color: #fff;
          cursor: pointer;
        }
      `}</style>

      {/* ── COSMIC STARS & AMBIENT NEBULA BACKGROUND ── */}
      <div className="cosmic-stars-canvas" />
      <div className="cosmic-nebula-glow" />
      <div className="cosmic-secondary-nebula" />

      {/* ── HEADER NAVIGATION ── */}
      <header className="landing-nav">
        <div className="nav-container">
          <div className="brand-logo" onClick={() => scrollToSection('hero-top')}>
            <div className="brand-icon">
              <Zap size={20} />
            </div>
            <span className="brand-name">
              Meet<span>Lite</span>
            </span>
          </div>

          <div className="nav-links-row">
            <button className="nav-btn-link" onClick={() => scrollToSection('features-section')}>
              Features
            </button>
            <button className="nav-btn-link" onClick={() => scrollToSection('cta-section')}>
              About
            </button>
            {!isLoading && (isAuthenticated ? (
              <AnimButton variant="primary" onClick={() => navigate('/app')}>
                Open App <ArrowRight size={15} />
              </AnimButton>
            ) : (
              <div className="flex items-center gap-3">
                <AnimButton variant="secondary" onClick={() => navigate('/login')}>
                  Log In
                </AnimButton>
                <AnimButton variant="primary" onClick={() => navigate('/register')}>
                  Sign Up Free
                </AnimButton>
              </div>
            ))}
          </div>

          <button className="mobile-menu-toggle" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </header>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div style={{ position: 'fixed', top: 70, left: 0, right: 0, background: '#101221', padding: 24, zIndex: 99, display: 'flex', flexDirection: 'column', gap: 16, borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
          <button className="nav-btn-link" style={{ textAlign: 'left', fontSize: 16 }} onClick={() => scrollToSection('features-section')}>Features</button>
          <button className="nav-btn-link" style={{ textAlign: 'left', fontSize: 16 }} onClick={() => scrollToSection('cta-section')}>About</button>
          <hr style={{ borderColor: 'rgba(255,255,255,0.08)' }} />
          {!isLoading && (isAuthenticated ? (
            <AnimButton variant="primary" onClick={() => navigate('/app')}>Open App</AnimButton>
          ) : (
            <div className="flex flex-col gap-2">
              <AnimButton variant="secondary" onClick={() => navigate('/login')}>Log In</AnimButton>
              <AnimButton variant="primary" onClick={() => navigate('/register')}>Sign Up Free</AnimButton>
            </div>
          ))}
        </div>
      )}

      {/* ── HERO SECTION ── */}
      <section id="hero-top" className="hero-section">
        <div className="hero-badge-tag">
          <Sparkles size={14} /> Real-time Voice, Chat & Streaming
        </div>

        <h1 className="hero-headline">
          GROUP CHAT THAT'S ALL<br />
          <TypewriterText />
        </h1>

        <p className="hero-subhead">
          MeetLite is the easiest place to talk, stream, and hang out with friends. Create custom servers and channels, jump into low-latency voice rooms, and stream games in full HD.
        </p>

        <div className="hero-actions">
          <AnimButton
            variant="primary"
            className="tactile-btn-large"
            onClick={() => navigate(isAuthenticated ? '/app' : '/register')}
          >
            {isAuthenticated ? 'Open MeetLite in Browser' : 'Open MeetLite in your browser'} <ArrowRight size={17} />
          </AnimButton>
          {!isAuthenticated && (
            <AnimButton
              variant="secondary"
              className="tactile-btn-large"
              onClick={() => navigate('/login')}
            >
              Log In to Account
            </AnimButton>
          )}
        </div>

        {/* ── COSMIC PORTAL APP PREVIEW ── */}
        <div className="hero-portal-container">
          <div className="portal-glass-frame">
            {/* Sidebar Channels */}
            <div className="portal-col-sidebar">
              <div className="text-[10px] font-extrabold uppercase tracking-wider text-zinc-400">Channels</div>
              <div className="flex items-center gap-2 p-2 rounded-lg bg-white/10 text-white font-medium text-xs">
                <Hash size={13} color="#7289da" /> general
              </div>
              <div className="flex items-center gap-2 p-2 rounded-lg text-zinc-400 font-medium text-xs">
                <Hash size={13} /> gaming-lounge
              </div>
              <div className="text-[10px] font-extrabold uppercase tracking-wider text-zinc-400 mt-2">Voice Rooms</div>
              <div className="flex items-center gap-2 p-2 rounded-lg text-emerald-400 bg-emerald-500/10 font-medium text-xs">
                <Volume2 size={13} /> Voice Lounge (4)
              </div>
            </div>

            {/* Main Chat Flow */}
            <div className="portal-col-chat">
              <div className="flex items-center gap-2 pb-3 border-b border-white/5">
                <Hash size={15} color="#5865F2" />
                <span className="text-xs font-bold text-white">#general</span>
                <span className="text-[10px] text-zinc-400 ml-auto">High-Definition Connection</span>
              </div>
              <div className="flex flex-col gap-3 my-4">
                <div className="flex gap-2.5 items-start">
                  <div className="w-7 h-7 rounded-full bg-indigo-600 flex items-center justify-center font-bold text-xs text-white">A</div>
                  <div>
                    <div className="text-[11px] font-bold text-white">Alex <span className="text-[9px] font-normal text-zinc-400 ml-1">Today</span></div>
                    <div className="text-xs text-zinc-300">Hey team, jump into the voice lounge! Let's test the stream.</div>
                  </div>
                </div>
                <div className="flex gap-2.5 items-start">
                  <div className="w-7 h-7 rounded-full bg-emerald-600 flex items-center justify-center font-bold text-xs text-white">C</div>
                  <div>
                    <div className="text-[11px] font-bold text-white">Chloe <span className="text-[9px] font-normal text-zinc-400 ml-1">Today</span></div>
                    <div className="text-xs text-zinc-300">Connected! Audio latency is under 50ms, super smooth! 🚀</div>
                  </div>
                </div>
              </div>
              <div className="p-2.5 rounded-lg bg-black/30 border border-white/5 text-xs text-zinc-500">
                Message #general...
              </div>
            </div>

            {/* Member Presence */}
            <div className="portal-col-members">
              <div className="text-[10px] font-extrabold uppercase tracking-wider text-zinc-400">Online — 4</div>
              <div className="flex items-center gap-2">
                <div className="relative">
                  <div className="w-6 h-6 rounded-full bg-indigo-600 flex items-center justify-center font-bold text-[10px] text-white">A</div>
                  <span className="absolute -bottom-0.5 -right-0.5 w-2 h-2 rounded-full bg-emerald-500 border border-zinc-900" />
                </div>
                <span className="text-xs text-zinc-200 font-medium">Alex</span>
                <Crown size={11} color="#faa61a" className="ml-auto" />
              </div>
              <div className="flex items-center gap-2">
                <div className="relative">
                  <div className="w-6 h-6 rounded-full bg-emerald-600 flex items-center justify-center font-bold text-[10px] text-white">C</div>
                  <span className="absolute -bottom-0.5 -right-0.5 w-2 h-2 rounded-full bg-emerald-500 border border-zinc-900" />
                </div>
                <span className="text-xs text-zinc-200 font-medium">Chloe</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="relative">
                  <div className="w-6 h-6 rounded-full bg-purple-600 flex items-center justify-center font-bold text-[10px] text-white">J</div>
                  <span className="absolute -bottom-0.5 -right-0.5 w-2 h-2 rounded-full bg-emerald-500 border border-zinc-900" />
                </div>
                <span className="text-xs text-zinc-200 font-medium">Jordan</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="relative">
                  <div className="w-6 h-6 rounded-full bg-amber-600 flex items-center justify-center font-bold text-[10px] text-white">S</div>
                  <span className="absolute -bottom-0.5 -right-0.5 w-2 h-2 rounded-full bg-emerald-500 border border-zinc-900" />
                </div>
                <span className="text-xs text-zinc-200 font-medium">Sam</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── TICKER MARQUEE ── */}
      <MarqueeBanner />

      {/* ── BIG SCROLLABLE FEATURE CARDS SECTION ── */}
      <section id="features-section" className="features-container-section">
        <div className="section-header-title">
          <h2>Everything you need to hang out.</h2>
          <p>Scroll down to explore each feature card. Hover over cards to interact.</p>
        </div>

        {/* ── CARD 1: CONNECT WITH CALL / VOICE ── */}
        <BigFeatureCard
          tag="LOW-LATENCY VOICE"
          badge={<Radio size={14} />}
          accentColor="#43b581"
          title="Hop into voice channels that feel like the same room."
          desc="No dialing, no ringing, no awkward waiting. Just click on a voice channel to join instantly. With high-performance adaptive streaming, audio stays crisp whether you are 2 friends or a 20-person guild."
          perks={[
            'Browser-based with zero downloads or installs',
            'Automatic echo cancellation & noise suppression',
            'Active speaker visual highlighting'
          ]}
        >
          <VoiceMockup />
        </BigFeatureCard>

        {/* ── CARD 2: LIVE STREAMING & GAMING (NO CODE) ── */}
        <BigFeatureCard
          tag="INSTANT SCREEN STREAM"
          badge={<Gamepad2 size={14} />}
          accentColor="#f04747"
          flip={true}
          title="Stream your gameplay, movies, and shows live."
          desc="Share your game tournaments, watch videos together, or host watch parties with one single click. Stream in ultra-smooth 1080p 60fps right from your browser with zero extra software."
          perks={[
            'One-click high-definition 1080p 60fps streaming',
            'Synchronized live audio sharing',
            'Interactive spectator counter & live indicators'
          ]}
        >
          <StreamMockup />
        </BigFeatureCard>

        {/* ── CARD 3: CHAT ROOMS & SERVERS ── */}
        <BigFeatureCard
          tag="ORGANIZED CHAT ROOMS"
          badge={<MessageSquare size={14} />}
          accentColor="#5865F2"
          title="Create your own servers & dedicated channels."
          desc="Organize your gaming clan, study squad, or friend group with custom text and voice channels. Messages persist forever in cloud history — scroll back anytime with instant real-time delivery."
          perks={[
            'Persistent chat history saved securely in the cloud',
            'Real-time typing indicators & message notifications',
            'Multiple custom text and voice channels per server'
          ]}
        >
          <ServerChatMockup />
        </BigFeatureCard>

        {/* ── CARD 4: REAL-TIME PRESENCE & WHO IS ONLINE ── */}
        <BigFeatureCard
          tag="REAL-TIME PRESENCE"
          badge={<Users size={14} />}
          accentColor="#a78bfa"
          flip={true}
          title="Always see who's online and ready to hang out."
          desc="Real-time green and grey presence dots update across browser tabs in milliseconds. You'll always know who is free to chat, who is currently talking in voice, and who is gaming."
          perks={[
            'Multi-tab synchronized presence status',
            'Server owner crown badges & role distinctions',
            'Instant connection and disconnection updates'
          ]}
        >
          <PresenceMockup />
        </BigFeatureCard>
      </section>

      {/* ── READY CTA / ABOUT ── */}
      <section id="cta-section" className="ready-cta-section">
        <div className="cta-box">
          <h2>Ready to start your journey?</h2>
          <p>
            Join MeetLite today. Create your server in seconds, invite your squad with a simple link, and hang out anytime.
          </p>
          <div className="flex gap-4 flex-wrap justify-center mt-4">
            <AnimButton
              variant="primary"
              className="tactile-btn-large"
              onClick={() => navigate('/register')}
            >
              Get Started — It's Free <ArrowRight size={18} />
            </AnimButton>
            <AnimButton
              variant="secondary"
              className="tactile-btn-large"
              onClick={() => navigate('/login')}
            >
              Log In
            </AnimButton>
          </div>
          <span className="text-xs text-zinc-500 mt-6">
            Fast · Secure · Lightweight · Cloud Connected
          </span>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer className="landing-footer">
        <div className="footer-inner">
          <div className="footer-left">
            <div className="brand-icon" style={{ width: 30, height: 30, borderRadius: 8 }}>
              <Zap size={16} />
            </div>
            <span className="brand-name" style={{ fontSize: 16 }}>
              Meet<span>Lite</span>
            </span>
            <span className="footer-text ml-4">
              Built with ❤️ for real-time communities
            </span>
          </div>

          <div className="footer-links">
            <button className="footer-link-btn" onClick={() => scrollToSection('hero-top')}>
              Home
            </button>
            <button className="footer-link-btn" onClick={() => scrollToSection('features-section')}>
              Features
            </button>
            <button className="footer-link-btn" onClick={() => navigate('/login')}>
              Log In
            </button>
            <button className="footer-link-btn" onClick={() => navigate('/register')}>
              Sign Up
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
}
