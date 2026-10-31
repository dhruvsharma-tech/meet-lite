import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import gsap from 'gsap';
import {
  MessageSquare, Video, Users, Zap, Shield, Link2,
  Menu, X, Mic, Monitor, Hash, Volume2, Crown, ArrowRight,
} from 'lucide-react';

/* ─────────────────────────────────────────────────────────
   TYPEWRITER
───────────────────────────────────────────────────────── */
const WORDS = ['Talk.', 'Connect.', 'Stream.', 'Vibe.', 'Build.'];
function TypewriterText() {
  const [idx, setIdx] = useState(0);
  const [chars, setChars] = useState('');
  const [del, setDel] = useState(false);
  const [pause, setPause] = useState(false);
  useEffect(() => {
    const word = WORDS[idx];
    if (pause) { const t = setTimeout(() => { setDel(true); setPause(false); }, 1600); return () => clearTimeout(t); }
    if (!del) {
      if (chars.length < word.length) { const t = setTimeout(() => setChars(word.slice(0, chars.length + 1)), 85); return () => clearTimeout(t); }
      setPause(true);
    } else {
      if (chars.length > 0) { const t = setTimeout(() => setChars(chars.slice(0, -1)), 50); return () => clearTimeout(t); }
      setDel(false); setIdx(p => (p + 1) % WORDS.length);
    }
  }, [chars, del, pause, idx]);
  return (
    <span className="ml-grad">
      {chars}<span className="cursor-blink">|</span>
    </span>
  );
}

/* ─────────────────────────────────────────────────────────
   SVG CARTOON CHARACTERS
───────────────────────────────────────────────────────── */
function CharacterA() { // Purple hoodie girl
  return (
    <svg width="90" height="140" viewBox="0 0 90 140" fill="none">
      <circle cx="45" cy="28" r="22" fill="#C9A9FF"/>
      <ellipse cx="45" cy="30" rx="14" ry="16" fill="#F5C5A3"/>
      <circle cx="38" cy="27" r="2.5" fill="#2d2d3a"/>
      <circle cx="52" cy="27" r="2.5" fill="#2d2d3a"/>
      <path d="M40 35 Q45 39 50 35" stroke="#9A6B4B" strokeWidth="1.5" strokeLinecap="round" fill="none"/>
      <path d="M25 26 Q27 10 45 8 Q63 10 65 26" fill="#7289DA" opacity="0.9"/>
      <path d="M20 55 Q18 45 25 40 L45 36 L65 40 Q72 45 70 55 L68 90 L22 90 Z" fill="#5E73BC"/>
      <path d="M20 55 L15 100 L30 102 L35 75 L22 90 Z" fill="#5E73BC"/>
      <path d="M70 55 L75 100 L60 102 L55 75 L68 90 Z" fill="#5E73BC"/>
      <path d="M35 90 L35 138 L42 138 L45 105 L48 138 L55 138 L55 90 Z" fill="#2d2d4a"/>
      <circle cx="30" cy="98" r="8" fill="#F5C5A3"/>
      <circle cx="60" cy="98" r="8" fill="#F5C5A3"/>
      <rect x="28" y="130" width="14" height="9" rx="4" fill="#4a4aff"/>
      <rect x="48" y="130" width="14" height="9" rx="4" fill="#4a4aff"/>
    </svg>
  );
}
function CharacterB() { // Blue robot mascot
  return (
    <svg width="80" height="120" viewBox="0 0 80 120" fill="none">
      <rect x="20" y="20" width="40" height="36" rx="12" fill="#7289DA"/>
      <rect x="26" y="28" width="12" height="8" rx="3" fill="#fff" opacity="0.9"/>
      <rect x="42" y="28" width="12" height="8" rx="3" fill="#fff" opacity="0.9"/>
      <circle cx="32" cy="32" r="3" fill="#5865F2"/>
      <circle cx="48" cy="32" r="3" fill="#5865F2"/>
      <rect x="35" y="40" width="10" height="4" rx="2" fill="#43b581"/>
      <rect x="37" y="12" width="6" height="10" rx="3" fill="#7289DA"/>
      <circle cx="40" cy="10" r="4" fill="#a78bfa"/>
      <rect x="16" y="56" width="48" height="40" rx="10" fill="#5E73BC"/>
      <rect x="28" y="96" width="8" height="20" rx="4" fill="#7289DA"/>
      <rect x="44" y="96" width="8" height="20" rx="4" fill="#7289DA"/>
      <rect x="6" y="60" width="10" height="28" rx="5" fill="#7289DA"/>
      <rect x="64" y="60" width="10" height="28" rx="5" fill="#7289DA"/>
      <circle cx="28" cy="115" r="5" fill="#4a4aff"/>
      <circle cx="52" cy="115" r="5" fill="#4a4aff"/>
    </svg>
  );
}
function CharacterC() { // Pink witch girl
  return (
    <svg width="85" height="135" viewBox="0 0 85 135" fill="none">
      <path d="M30 18 L42 2 L54 18" fill="#2d2d3a" stroke="#1a1a2e" strokeWidth="1"/>
      <rect x="22" y="16" width="41" height="6" rx="3" fill="#1a1a2e"/>
      <circle cx="42" cy="36" r="20" fill="#F5C5A3"/>
      <circle cx="35" cy="33" r="2.5" fill="#2d2d3a"/>
      <circle cx="49" cy="33" r="2.5" fill="#2d2d3a"/>
      <path d="M38 41 Q42 45 46 41" stroke="#9A6B4B" strokeWidth="1.5" strokeLinecap="round" fill="none"/>
      <path d="M30 20 Q20 18 18 28 Q16 36 28 38" fill="#EC4899" opacity="0.7"/>
      <path d="M22 52 Q20 44 28 40 L42 36 L56 40 Q64 44 63 52 L60 88 L24 88 Z" fill="#EC4899"/>
      <path d="M22 52 L18 98 L32 100 L36 72 L24 88 Z" fill="#EC4899"/>
      <path d="M63 52 L67 98 L53 100 L49 72 L60 88 Z" fill="#EC4899"/>
      <path d="M36 88 L36 132 L43 132 L42 104 L43 132 L50 132 L50 88 Z" fill="#2d2d4a"/>
      <circle cx="19" cy="96" r="7" fill="#F5C5A3"/>
      <circle cx="66" cy="96" r="7" fill="#F5C5A3"/>
      <rect x="30" y="126" width="12" height="8" rx="4" fill="#EC4899"/>
      <rect x="44" y="126" width="12" height="8" rx="4" fill="#EC4899"/>
    </svg>
  );
}
function CharacterD() { // Tall cool dude
  return (
    <svg width="70" height="145" viewBox="0 0 70 145" fill="none">
      <circle cx="35" cy="25" r="20" fill="#8D5524"/>
      <ellipse cx="35" cy="27" rx="13" ry="15" fill="#C68642"/>
      <circle cx="29" cy="24" r="2.5" fill="#1a1a2e"/>
      <circle cx="41" cy="24" r="2.5" fill="#1a1a2e"/>
      <path d="M31 32 Q35 36 39 32" stroke="#7A4B2A" strokeWidth="1.5" strokeLinecap="round" fill="none"/>
      <path d="M16 50 Q14 40 20 36 L35 32 L50 36 Q56 40 54 50 L52 92 L18 92 Z" fill="#fff" opacity="0.95"/>
      <path d="M16 50 L11 100 L26 102 L30 74 L18 92 Z" fill="#ddd"/>
      <path d="M54 50 L59 100 L44 102 L40 74 L52 92 Z" fill="#ddd"/>
      <path d="M30 92 L28 142 L36 142 L35 108 L34 142 L42 142 L42 92 Z" fill="#2d2d4a"/>
      <rect x="20" y="136" width="14" height="8" rx="4" fill="#1a1aff"/>
      <rect x="38" y="136" width="14" height="8" rx="4" fill="#1a1aff"/>
      <circle cx="12" cy="98" r="7" fill="#C68642"/>
      <circle cx="58" cy="98" r="7" fill="#C68642"/>
    </svg>
  );
}

/* ─────────────────────────────────────────────────────────
   MARQUEE
───────────────────────────────────────────────────────── */
const MARQUEE_ITEMS = [
  { t: 'TALK', e: '💬' }, { t: 'CONNECT', e: '⚡' }, { t: 'STREAM', e: '🎥' },
  { t: 'VOICE', e: '🎙️' }, { t: 'COLLAB', e: '👥' }, { t: 'SHARE', e: '🔗' },
  { t: 'VIBE', e: '✨' }, { t: 'BUILD', e: '🚀' },
];
function Marquee() {
  const triple = [...MARQUEE_ITEMS, ...MARQUEE_ITEMS, ...MARQUEE_ITEMS];
  return (
    <div className="marquee-outer">
      <div className="marquee-inner">
        {triple.map((item, i) => (
          <span key={i} className="marquee-word" style={{ color: ['#7289da','#a78bfa','#43b581','#faa61a','#f04747','rgba(255,255,255,0.25)'][i % 6] }}>
            <span className="marquee-emoji">{item.e}</span>
            {item.t}
            <span className="marquee-dot">✦</span>
          </span>
        ))}
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────
   FEATURE CARDS DATA
───────────────────────────────────────────────────────── */
const FEATURES = [
  { icon: <MessageSquare size={28}/>, color: '#7289da', title: 'Real-Time Chat', desc: 'Persistent text channels. Messages save to DB — scroll back anytime. Typing indicators & instant delivery via Socket.IO.' },
  { icon: <Video size={28}/>, color: '#43b581', title: 'HD Voice & Video', desc: 'Group calls powered by LiveKit SFU. Adaptive streams, simulcast, echo cancellation — zero installs.' },
  { icon: <Monitor size={28}/>, color: '#f04747', title: 'Screen Share', desc: 'Share your screen with one click. Co-work, present, or just vibe together — all inside the voice room.' },
  { icon: <Users size={28}/>, color: '#a78bfa', title: 'Live Presence', desc: 'Real-time green/grey dots on every member. Updates the instant someone joins or leaves.' },
  { icon: <Link2 size={28}/>, color: '#faa61a', title: 'Invite Links', desc: 'One link, instant access. Share with friends — no forced downloads, no friction at all.' },
  { icon: <Shield size={28}/>, color: '#43b581', title: 'Secure Auth', desc: 'JWT + HTTP-only cookies. Role-based permissions — owners manage members, kick users, control channels.' },
];

/* ─────────────────────────────────────────────────────────
   FEATURE CARD WITH GSAP HOVER
───────────────────────────────────────────────────────── */
function FeatureCard({ icon, color, title, desc, delay }) {
  const cardRef = useRef(null);
  const iconRef = useRef(null);

  const onEnter = () => {
    gsap.to(cardRef.current, { y: -8, scale: 1.03, duration: 0.35, ease: 'power2.out',
      boxShadow: `0 20px 50px ${color}25, 0 0 0 1px ${color}35` });
    gsap.to(iconRef.current, { rotation: 12, scale: 1.2, duration: 0.3, ease: 'back.out(2)' });
  };
  const onLeave = () => {
    gsap.to(cardRef.current, { y: 0, scale: 1, duration: 0.4, ease: 'power2.out', boxShadow: 'none' });
    gsap.to(iconRef.current, { rotation: 0, scale: 1, duration: 0.3, ease: 'power2.out' });
  };
  const onClick = () => {
    gsap.timeline()
      .to(cardRef.current, { scale: 0.96, duration: 0.1, ease: 'power1.in' })
      .to(cardRef.current, { scale: 1.03, duration: 0.2, ease: 'back.out(2)' })
      .to(cardRef.current, { scale: 1, duration: 0.15, ease: 'power1.out' });
  };

  return (
    <div
      ref={cardRef}
      className="feat-card reveal-card"
      style={{ animationDelay: `${delay}ms`, cursor: 'pointer' }}
      onMouseEnter={onEnter}
      onMouseLeave={onLeave}
      onClick={onClick}
    >
      <div ref={iconRef} className="feat-icon" style={{ background: `${color}18`, color }}>
        {icon}
      </div>
      <h3 className="feat-title">{title}</h3>
      <p className="feat-desc">{desc}</p>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────
   BIG FEATURE ROWS  (scroll-reveal via CSS)
───────────────────────────────────────────────────────── */
function FeatureRow({ emoji, tag, title, desc, accent, flip, children, delay = 0 }) {
  const rowRef = useRef(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const el = rowRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setVisible(true); obs.disconnect(); } }, { threshold: 0.1 });
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  return (
    <div
      ref={rowRef}
      className={`feat-row ${visible ? 'feat-row-visible' : ''} ${flip ? 'feat-row-flip' : ''}`}
      style={{ '--accent': accent }}
    >
      <div className="feat-row-text">
        <div className="feat-row-tag" style={{ color: accent, borderColor: `${accent}40`, background: `${accent}12` }}>
          <span>{emoji}</span>{tag}
        </div>
        <h2 className="feat-row-title">{title}</h2>
        <p className="feat-row-desc">{desc}</p>
      </div>
      <div className={`feat-row-mockup ${visible ? 'mockup-slide-in' : ''}`} style={{ animationDelay: `${delay}ms` }}>
        {children}
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────
   APP MOCKUP
───────────────────────────────────────────────────────── */
function AppMockup() {
  return (
    <div className="app-mockup-wrap">
      <div className="app-mockup-glow" />
      <div className="app-mockup">
        <div className="app-titlebar">
          <span className="dot dot-r"/><span className="dot dot-y"/><span className="dot dot-g"/>
          <span className="titlebar-label">meetlite — #general</span>
        </div>
        <div className="app-body">
          {/* Server rail */}
          <div className="app-rail">
            {[{l:'M',c:'#7289da'},{l:'G',c:'#43b581'},{l:'D',c:'#a78bfa'}].map(({l,c},i)=>(
              <div key={i} className="rail-icon" style={{ background:`${c}25`, border:`1.5px solid ${c}45`, color:c }}>{l}</div>
            ))}
          </div>
          {/* Sidebar */}
          <div className="app-sidebar">
            <p className="sidebar-label">My Server</p>
            {['general','random'].map((c,i)=>(
              <div key={i} className="sidebar-ch" style={{ background:i===0?'rgba(255,255,255,0.09)':'transparent', color:i===0?'#fff':'rgba(255,255,255,0.35)', fontWeight:i===0?600:400 }}>
                <Hash size={10} style={{opacity:0.6}}/>{c}
              </div>
            ))}
            <p className="sidebar-label" style={{marginTop:10}}>Voice</p>
            <div className="sidebar-ch" style={{color:'rgba(255,255,255,0.3)'}}><Volume2 size={10}/>General</div>
          </div>
          {/* Chat */}
          <div className="app-chat">
            {[{u:'Aryan',c:'#7289da',t:'Hey! 👋'},{u:'Bhavya',c:'#43b581',t:'Welcome! 🚀'},{u:'Charu',c:'#a78bfa',t:'Voice mein aao 🎙️'}].map((m,i)=>(
              <div key={i} className="chat-msg">
                <div className="chat-avatar" style={{background:m.c}}>{m.u[0]}</div>
                <div><p className="chat-name">{m.u}<span className="chat-time">Today</span></p><p className="chat-text">{m.t}</p></div>
              </div>
            ))}
            <div className="chat-typing">
              <span className="typing-dots">{[0,1,2].map(i=><span key={i} style={{animationDelay:`${i*150}ms`}}/>)}</span>
              Dev is typing…
            </div>
            <div className="chat-input">Message #general…</div>
          </div>
          {/* Members */}
          <div className="app-members">
            <p className="sidebar-label">Online — 3</p>
            {[{u:'Aryan',c:'#7289da',on:true},{u:'Bhavya',c:'#43b581',on:true},{u:'Charu',c:'#a78bfa',on:true},{u:'Dev',c:'#faa61a',on:false}].map((m,i)=>(
              <div key={i} className="member-row" style={{opacity:m.on?1:0.4}}>
                <div style={{position:'relative',flexShrink:0}}>
                  <div className="member-av" style={{background:m.c}}>{m.u[0]}</div>
                  <span className="member-dot" style={{background:m.on?'#43b581':'#72767d'}}/>
                </div>
                <span className="member-name" style={{color:m.on?'rgba(255,255,255,0.8)':'rgba(255,255,255,0.3)'}}>{m.u}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────
   MINI MOCKUPS FOR FEATURE ROWS
───────────────────────────────────────────────────────── */
function ChatMini() {
  return (
    <div className="mini-card">
      <div className="mini-header"><Hash size={13} color="#7289da"/><span>general</span><span style={{color:'#43b581',marginLeft:'auto',fontSize:11}}>● 4 online</span></div>
      {[{u:'Aryan',c:'#7289da',t:'Server bana liya! 🎉'},{u:'Bhavya',c:'#43b581',t:'Bhai welcome hoon! 🚀'},{u:'Charu',c:'#a78bfa',t:'Voice mein aa jao 🎙️'}].map((m,i)=>(
        <div key={i} className="mini-msg">
          <div className="mini-av" style={{background:m.c}}>{m.u[0]}</div>
          <div><p className="mini-uname">{m.u}<span className="mini-time">Today</span></p><p className="mini-txt">{m.t}</p></div>
        </div>
      ))}
      <div className="mini-typing"><span className="typing-dots">{[0,1,2].map(i=><span key={i} style={{animationDelay:`${i*150}ms`}}/>)}</span>Dev is typing…</div>
      <div className="mini-input">Message #general…</div>
    </div>
  );
}
function VoiceMini() {
  const users=[{n:'Aryan',c:'#7289da',s:true},{n:'Bhavya',c:'#43b581',s:true},{n:'Charu',c:'#a78bfa',s:false},{n:'Dev',c:'#faa61a',s:false}];
  return (
    <div className="mini-card">
      <div className="mini-header"><Volume2 size={13} color="#43b581"/><span>General Voice</span><span style={{background:'#43b58120',color:'#43b581',fontSize:10,fontWeight:700,padding:'2px 8px',borderRadius:99,marginLeft:'auto'}}>● LIVE</span></div>
      <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:10,marginTop:8}}>
        {users.map(u=>(
          <div key={u.n} style={{display:'flex',flexDirection:'column',alignItems:'center',gap:8,padding:'12px 8px',borderRadius:12,background:u.s?`${u.c}12`:'rgba(255,255,255,0.03)',border:`1.5px solid ${u.s?u.c+'45':'rgba(255,255,255,0.06)'}`}}>
            <div style={{position:'relative'}}>
              <div style={{width:44,height:44,borderRadius:'50%',background:`${u.c}30`,border:`2.5px solid ${u.s?u.c:'transparent'}`,display:'flex',alignItems:'center',justifyContent:'center',fontWeight:900,fontSize:16,color:u.c}}>{u.n[0]}</div>
              {u.s&&<span style={{position:'absolute',bottom:-2,right:-2,width:17,height:17,borderRadius:'50%',background:'#43b581',display:'flex',alignItems:'center',justifyContent:'center'}}><Mic size={9} color="#fff"/></span>}
            </div>
            <span style={{fontSize:11,fontWeight:600,color:u.s?'#fff':'#72767d'}}>{u.n}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
function ScreenMini() {
  return (
    <div className="mini-card" style={{background:'linear-gradient(135deg,#1a1c2e,#16181f)'}}>
      <div className="mini-header"><Monitor size={13} color="#f04747"/><span style={{color:'#f04747'}}>Screen Share</span><span style={{color:'#43b581',marginLeft:'auto',fontSize:11}}>● Live</span></div>
      <div style={{background:'rgba(0,0,0,0.3)',borderRadius:12,padding:24,display:'flex',flexDirection:'column',alignItems:'center',gap:12,margin:'10px 0'}}>
        <Monitor size={36} color="rgba(240,71,71,0.5)"/>
        <span style={{color:'rgba(255,255,255,0.5)',fontSize:13}}>Aryan is sharing screen</span>
        <div style={{display:'flex',gap:8}}>
          {[{n:'Bhavya',c:'#43b581'},{n:'Charu',c:'#a78bfa'},{n:'Dev',c:'#faa61a'}].map(m=>(
            <div key={m.n} style={{width:30,height:30,borderRadius:'50%',background:m.c,display:'flex',alignItems:'center',justifyContent:'center',fontWeight:900,fontSize:12,color:'#fff'}}>{m.n[0]}</div>
          ))}
        </div>
        <span style={{color:'rgba(255,255,255,0.3)',fontSize:12}}>3 watching</span>
      </div>
    </div>
  );
}
function MembersMini() {
  return (
    <div className="mini-card">
      <p style={{fontSize:10,fontWeight:800,color:'#72767d',textTransform:'uppercase',letterSpacing:'0.1em',marginBottom:10}}>Online — 3</p>
      {[{n:'Aryan',c:'#7289da',owner:true},{n:'Bhavya',c:'#43b581'},{n:'Charu',c:'#a78bfa'}].map(m=>(
        <div key={m.n} style={{display:'flex',alignItems:'center',gap:10,padding:'6px 4px',borderRadius:8,marginBottom:4}}>
          <div style={{position:'relative'}}>
            <div style={{width:32,height:32,borderRadius:'50%',background:m.c,display:'flex',alignItems:'center',justifyContent:'center',fontWeight:900,fontSize:13,color:'#fff'}}>{m.n[0]}</div>
            <span style={{position:'absolute',bottom:-1,right:-1,width:11,height:11,borderRadius:'50%',background:'#43b581',border:'2px solid #2b2d31'}}/>
          </div>
          <span style={{color:'#dcddde',fontSize:13,flex:1}}>{m.n}</span>
          {m.owner&&<Crown size={13} color="#faa61a"/>}
        </div>
      ))}
      <p style={{fontSize:10,fontWeight:800,color:'#72767d',textTransform:'uppercase',letterSpacing:'0.1em',margin:'12px 0 8px'}}>Offline — 2</p>
      {[{n:'Dev',c:'#faa61a'},{n:'Esha',c:'#f04747'}].map(m=>(
        <div key={m.n} style={{display:'flex',alignItems:'center',gap:10,padding:'6px 4px',opacity:0.38,marginBottom:4}}>
          <div style={{position:'relative'}}>
            <div style={{width:32,height:32,borderRadius:'50%',background:m.c,display:'flex',alignItems:'center',justifyContent:'center',fontWeight:900,fontSize:13,color:'#fff'}}>{m.n[0]}</div>
            <span style={{position:'absolute',bottom:-1,right:-1,width:11,height:11,borderRadius:'50%',background:'#72767d',border:'2px solid #2b2d31'}}/>
          </div>
          <span style={{color:'#72767d',fontSize:13}}>{m.n}</span>
        </div>
      ))}
    </div>
  );
}

/* ─────────────────────────────────────────────────────────
   ANIMATED BUTTON
───────────────────────────────────────────────────────── */
function AnimBtn({ children, onClick, primary, style = {} }) {
  const ref = useRef(null);
  const handleClick = (e) => {
    gsap.timeline()
      .to(ref.current, { scale: 0.94, duration: 0.08 })
      .to(ref.current, { scale: 1.06, duration: 0.18, ease: 'back.out(3)' })
      .to(ref.current, { scale: 1, duration: 0.12 });
    onClick?.(e);
  };
  return (
    <button ref={ref} onClick={handleClick}
      className={primary ? 'btn-primary' : 'btn-secondary'}
      style={style}>
      {children}
    </button>
  );
}

/* ─────────────────────────────────────────────────────────
   MAIN PAGE
───────────────────────────────────────────────────────── */
export default function LandingPage() {
  const navigate = useNavigate();
  const { isAuthenticated, isLoading } = useAuthStore();
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const heroRef = useRef(null);

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', fn);
    return () => window.removeEventListener('scroll', fn);
  }, []);

  // Hero entrance via GSAP
  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.timeline({ delay: 0.1, defaults: { ease: 'power3.out' } })
        .from('.hero-tag', { opacity: 0, y: -24, duration: 0.6 })
        .from('.hero-h1', { opacity: 0, x: -50, duration: 0.8 }, '-=0.3')
        .from('.hero-p', { opacity: 0, x: -30, duration: 0.6 }, '-=0.4')
        .from('.hero-btns', { opacity: 0, y: 20, duration: 0.5 }, '-=0.3')
        .from('.hero-tags', { opacity: 0, y: 12, duration: 0.4 }, '-=0.2')
        .from('.hero-right', { opacity: 0, x: 60, scale: 0.95, duration: 0.9 }, '-=0.9')
        .from('.hero-chars', { opacity: 0, y: 40, stagger: 0.1, duration: 0.6 }, '-=0.5');
    }, heroRef);
    return () => ctx.revert();
  }, []);

  const scrollTo = id => { setMenuOpen(false); document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' }); };

  return (
    <div className="page-root">

      {/* ── STYLES ── */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap');
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        html { scroll-behavior: smooth; }
        body { overflow-x: hidden; }
        .page-root { min-height: 100vh; background: #13141f; color: #fff; font-family: 'Inter','Segoe UI',sans-serif; overflow-x: hidden; }

        /* NAV */
        .nav { position: fixed; top: 0; left: 0; right: 0; z-index: 100; height: 64px; display: flex; align-items: center; transition: all 0.3s; }
        .nav.scrolled { background: rgba(15,16,26,0.92); backdrop-filter: blur(18px); border-bottom: 1px solid rgba(255,255,255,0.07); }
        .nav-inner { max-width: 1140px; margin: 0 auto; padding: 0 28px; width: 100%; display: flex; align-items: center; justify-content: space-between; }
        .nav-logo { display: flex; align-items: center; gap: 10px; cursor: pointer; text-decoration: none; }
        .nav-logo-icon { width: 34px; height: 34px; border-radius: 10px; background: linear-gradient(135deg,#7289da,#a78bfa); display: flex; align-items: center; justify-content: center; transition: transform 0.2s; }
        .nav-logo:hover .nav-logo-icon { transform: rotate(-8deg) scale(1.1); }
        .nav-logo-text { font-weight: 900; font-size: 18px; letter-spacing: -0.02em; }
        .nav-logo-text span { color: #7289da; }
        .nav-links { display: flex; gap: 32px; align-items: center; }
        .nav-link { background: none; border: none; color: #8e9297; font-size: 14px; font-weight: 500; cursor: pointer; font-family: inherit; transition: color 0.2s; padding: 4px 0; position: relative; }
        .nav-link::after { content: ''; position: absolute; bottom: -2px; left: 0; width: 0; height: 2px; background: #7289da; border-radius: 2px; transition: width 0.25s ease; }
        .nav-link:hover { color: #fff; }
        .nav-link:hover::after { width: 100%; }
        .nav-auth { display: flex; gap: 10px; align-items: center; }

        /* BUTTONS */
        .btn-primary { background: linear-gradient(135deg,#7289da 0%,#5865f2 100%); border: none; color: #fff; padding: 13px 26px; border-radius: 99px; font-weight: 700; font-size: 14px; cursor: pointer; font-family: inherit; display: inline-flex; align-items: center; gap: 8px; box-shadow: 0 4px 20px rgba(114,137,218,0.4); transition: box-shadow 0.2s, opacity 0.2s; }
        .btn-primary:hover { box-shadow: 0 6px 32px rgba(114,137,218,0.55); opacity: 0.95; }
        .btn-secondary { background: rgba(255,255,255,0.06); border: 1px solid rgba(255,255,255,0.14); color: #fff; padding: 13px 26px; border-radius: 99px; font-weight: 700; font-size: 14px; cursor: pointer; font-family: inherit; transition: background 0.2s, border-color 0.2s; }
        .btn-secondary:hover { background: rgba(255,255,255,0.12); border-color: rgba(255,255,255,0.25); }
        .btn-lg { padding: 16px 36px; font-size: 16px; }

        /* HERO */
        .hero { min-height: 100vh; display: flex; align-items: center; padding-top: 64px; position: relative; overflow: hidden; background: linear-gradient(160deg,#0b0c1a 0%,#161728 45%,#13141f 100%); }
        .hero-grid { position: absolute; inset: 0; opacity: 0.15; background-image: linear-gradient(rgba(114,137,218,0.25) 1px,transparent 1px),linear-gradient(90deg,rgba(114,137,218,0.25) 1px,transparent 1px); background-size: 66px 66px; pointer-events: none; }
        .hero-glow { position: absolute; top: -100px; left: 50%; transform: translateX(-50%); width: 900px; height: 600px; background: radial-gradient(ellipse at center,rgba(114,137,218,0.22) 0%,transparent 68%); pointer-events: none; }
        .hero-inner { max-width: 1140px; margin: 0 auto; padding: 80px 28px; display: grid; grid-template-columns: 1fr 1fr; gap: 64px; align-items: center; width: 100%; }
        .hero-left { display: flex; flex-direction: column; gap: 0; }
        .hero-tag { display: inline-flex; align-items: center; gap: 8px; padding: 6px 16px; border-radius: 99px; background: rgba(114,137,218,0.14); border: 1px solid rgba(114,137,218,0.38); color: #7289da; font-size: 11px; font-weight: 800; letter-spacing: 0.1em; text-transform: uppercase; margin-bottom: 28px; width: fit-content; }
        .hero-h1 { font-size: clamp(40px,5.5vw,68px); font-weight: 900; line-height: 1.04; letter-spacing: -0.03em; margin-bottom: 20px; }
        .ml-grad { background-image: linear-gradient(90deg,#7289da,#a78bfa,#ec4899); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text; }
        .cursor-blink { -webkit-text-fill-color: #7289da; animation: blink 1s step-end infinite; }
        @keyframes blink { 0%,100%{opacity:1}50%{opacity:0} }
        .hero-p { color: #8e9297; font-size: 16px; line-height: 1.8; max-width: 440px; margin-bottom: 36px; }
        .hero-btns { display: flex; gap: 14px; flex-wrap: wrap; margin-bottom: 28px; }
        .hero-tags { display: flex; gap: 8px; flex-wrap: wrap; }
        .hero-tag-chip { font-size: 11px; font-weight: 600; padding: 4px 12px; border-radius: 99px; border: 1px solid rgba(255,255,255,0.09); color: #72767d; background: rgba(255,255,255,0.03); }
        .hero-right { position: relative; }

        /* CHARACTERS */
        .hero-chars { display: flex; align-items: flex-end; justify-content: center; gap: 20px; padding: 24px 0 8px; position: relative; }
        .char-wrap { display: flex; flex-direction: column; align-items: center; gap: 6px; animation: char-float var(--dur,4s) var(--delay,0s) ease-in-out infinite alternate; }
        .char-label { font-size: 10px; font-weight: 700; color: rgba(255,255,255,0.3); letter-spacing: 0.05em; }
        @keyframes char-float { 0%{transform:translateY(0)} 100%{transform:translateY(-10px)} }

        /* MARQUEE */
        .marquee-outer { overflow: hidden; padding: 18px 0; border-top: 1px solid rgba(255,255,255,0.07); border-bottom: 1px solid rgba(255,255,255,0.07); background: linear-gradient(90deg,#0f1020,#161728,#0f1020); }
        .marquee-inner { display: flex; gap: 36px; white-space: nowrap; width: max-content; animation: marquee-scroll 30s linear infinite; }
        @keyframes marquee-scroll { 0%{transform:translateX(0)} 100%{transform:translateX(-33.33%)} }
        .marquee-word { display: inline-flex; align-items: center; gap: 10px; font-size: 13px; font-weight: 800; letter-spacing: 0.22em; text-transform: uppercase; }
        .marquee-emoji { opacity: 0.75; font-size: 16px; }
        .marquee-dot { color: rgba(255,255,255,0.1); margin-left: 10px; }

        /* STATS */
        .stats-section { padding: 64px 28px; background: linear-gradient(135deg,#0f1020,#161728,#0f1020); border-top: 1px solid rgba(255,255,255,0.05); border-bottom: 1px solid rgba(255,255,255,0.05); }
        .stats-inner { max-width: 900px; margin: 0 auto; display: grid; grid-template-columns: repeat(4,1fr); gap: 32px; text-align: center; }
        .stat-val { font-size: clamp(30px,4vw,46px); font-weight: 900; margin-bottom: 6px; }
        .stat-lbl { color: #72767d; font-size: 13px; }

        /* FEATURES HEADING */
        .features-head { padding: 90px 28px 16px; text-align: center; background: #13141f; }
        .features-head h2 { font-size: clamp(30px,5vw,54px); font-weight: 900; line-height: 1.1; letter-spacing: -0.025em; margin: 14px 0; }
        .features-head p { color: #8e9297; font-size: 16px; max-width: 500px; margin: 0 auto; }
        .section-eyebrow { font-size: 11px; font-weight: 800; letter-spacing: 0.2em; text-transform: uppercase; color: #7289da; }

        /* FEATURE CARDS GRID */
        .feat-grid { padding: 48px 28px 80px; background: #13141f; }
        .feat-grid-inner { max-width: 1140px; margin: 0 auto; display: grid; grid-template-columns: repeat(auto-fit,minmax(300px,1fr)); gap: 20px; }
        .feat-card { background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.07); border-radius: 20px; padding: 28px; transition: border-color 0.3s; }
        .feat-card:hover { border-color: rgba(255,255,255,0.18); }
        .feat-icon { width: 54px; height: 54px; border-radius: 14px; display: flex; align-items: center; justify-content: center; margin-bottom: 18px; }
        .feat-title { font-size: 17px; font-weight: 800; color: #fff; margin-bottom: 10px; letter-spacing: -0.01em; }
        .feat-desc { color: #8e9297; font-size: 14px; line-height: 1.75; }

        /* REVEAL ANIMATION FOR CARDS */
        .reveal-card { opacity: 0; transform: translateY(30px); animation: reveal-up 0.65s ease forwards; }
        @keyframes reveal-up { to { opacity: 1; transform: translateY(0); } }

        /* FEATURE ROWS */
        .feat-rows-section { background: #111220; }
        .feat-row { max-width: 1140px; margin: 0 auto; padding: 100px 28px; display: flex; gap: 72px; align-items: center; opacity: 0; transform: translateY(40px); transition: opacity 0.8s ease, transform 0.8s ease; }
        .feat-row-visible { opacity: 1; transform: translateY(0); }
        .feat-row-flip { flex-direction: row-reverse; }
        .feat-row-text { flex: 1; min-width: 0; }
        .feat-row-tag { display: inline-flex; align-items: center; gap: 8px; padding: 6px 14px; border-radius: 99px; font-size: 11px; font-weight: 800; letter-spacing: 0.12em; text-transform: uppercase; border: 1px solid; margin-bottom: 20px; }
        .feat-row-title { font-size: clamp(26px,3.5vw,44px); font-weight: 900; color: #fff; line-height: 1.12; margin-bottom: 18px; letter-spacing: -0.025em; }
        .feat-row-desc { color: #8e9297; font-size: 15px; line-height: 1.8; max-width: 420px; }
        .feat-row-mockup { flex: 1; min-width: 0; max-width: 480px; }
        .feat-row-mockup.mockup-slide-in { animation: slide-in 0.7s 0.2s ease both; }
        @keyframes slide-in { from { opacity: 0; transform: translateX(30px) scale(0.97); } to { opacity: 1; transform: translateX(0) scale(1); } }
        .feat-row-flip .feat-row-mockup.mockup-slide-in { animation-name: slide-in-left; }
        @keyframes slide-in-left { from { opacity: 0; transform: translateX(-30px) scale(0.97); } to { opacity: 1; transform: translateX(0) scale(1); } }
        .feat-row + .feat-row { border-top: 1px solid rgba(255,255,255,0.05); }

        /* MINI CARDS */
        .mini-card { background: #1e2030; border-radius: 16px; padding: 18px; border: 1px solid rgba(255,255,255,0.07); }
        .mini-header { display: flex; align-items: center; gap: 8px; padding-bottom: 12px; border-bottom: 1px solid rgba(255,255,255,0.06); margin-bottom: 12px; font-size: 13px; font-weight: 700; color: #fff; }
        .mini-msg { display: flex; gap: 10px; align-items: flex-start; margin-bottom: 12px; }
        .mini-av { width: 32px; height: 32px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-weight: 900; font-size: 13px; color: #fff; flex-shrink: 0; }
        .mini-uname { font-size: 12px; font-weight: 700; color: #fff; }
        .mini-time { color: #72767d; font-weight: 400; font-size: 10px; margin-left: 6px; }
        .mini-txt { font-size: 13px; color: #dcddde; margin-top: 2px; }
        .mini-typing { display: flex; align-items: center; gap: 6px; color: #72767d; font-size: 11px; margin-bottom: 10px; }
        .mini-input { background: rgba(0,0,0,0.22); border-radius: 8px; padding: 9px 13px; color: #72767d; font-size: 12px; border: 1px solid rgba(255,255,255,0.05); }

        /* TYPING DOTS */
        .typing-dots { display: flex; gap: 3px; }
        .typing-dots span { width: 5px; height: 5px; border-radius: 50%; background: #72767d; display: inline-block; animation: bounce-dot 1s ease-in-out infinite; }
        @keyframes bounce-dot { 0%,100%{transform:translateY(0)}50%{transform:translateY(-5px)} }

        /* APP MOCKUP */
        .app-mockup-wrap { position: relative; max-width: 560px; width: 100%; margin: 0 auto; user-select: none; pointer-events: none; }
        .app-mockup-glow { position: absolute; inset: -28px; border-radius: 40px; background: radial-gradient(ellipse at center,rgba(114,137,218,0.25) 0%,transparent 70%); filter: blur(24px); }
        .app-mockup { position: relative; border-radius: 18px; overflow: hidden; border: 1px solid rgba(255,255,255,0.1); box-shadow: 0 32px 80px rgba(0,0,0,0.6); background: #1e1f22; }
        .app-titlebar { display: flex; align-items: center; gap: 6px; padding: 10px 16px; background: #111214; border-bottom: 1px solid rgba(255,255,255,0.05); }
        .dot { width: 11px; height: 11px; border-radius: 50%; display: inline-block; }
        .dot-r { background: #f04747; } .dot-y { background: #faa61a; } .dot-g { background: #43b581; }
        .titlebar-label { margin-left: 14px; color: rgba(255,255,255,0.25); font-size: 11px; font-family: monospace; }
        .app-body { display: flex; height: 290px; }
        .app-rail { width: 52px; background: #111214; display: flex; flex-direction: column; align-items: center; gap: 10px; padding: 12px 0; border-right: 1px solid rgba(255,255,255,0.05); }
        .rail-icon { width: 38px; height: 38px; border-radius: 12px; display: flex; align-items: center; justify-content: center; font-weight: 900; font-size: 13px; }
        .app-sidebar { width: 148px; background: #2b2d31; border-right: 1px solid rgba(255,255,255,0.05); padding: 10px; overflow: hidden; }
        .sidebar-label { font-size: 9px; font-weight: 800; color: rgba(255,255,255,0.3); text-transform: uppercase; letter-spacing: 0.15em; margin-bottom: 8px; padding: 0 4px; }
        .sidebar-ch { display: flex; align-items: center; gap: 5px; padding: 5px 6px; border-radius: 6px; margin-bottom: 3px; font-size: 11px; }
        .app-chat { flex: 1; background: #313338; display: flex; flex-direction: column; padding: 12px; gap: 10px; overflow: hidden; }
        .chat-msg { display: flex; gap: 8px; align-items: flex-start; }
        .chat-avatar { width: 26px; height: 26px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-weight: 900; font-size: 10px; color: #fff; flex-shrink: 0; }
        .chat-name { font-size: 9px; font-weight: 700; color: #fff; }
        .chat-time { color: rgba(255,255,255,0.3); font-weight: 400; margin-left: 5px; }
        .chat-text { font-size: 10px; color: rgba(255,255,255,0.7); margin-top: 1px; }
        .chat-typing { margin-top: auto; font-size: 9px; color: #72767d; display: flex; align-items: center; gap: 5px; }
        .chat-input { background: rgba(0,0,0,0.15); border-radius: 6px; padding: 6px 10px; color: #72767d; font-size: 9px; border: 1px solid rgba(255,255,255,0.05); }
        .app-members { width: 110px; background: #2b2d31; border-left: 1px solid rgba(255,255,255,0.05); padding: 10px; overflow: hidden; }
        .member-row { display: flex; align-items: center; gap: 6px; padding: 4px 2px; margin-bottom: 4px; }
        .member-av { width: 22px; height: 22px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-weight: 900; font-size: 9px; color: #fff; }
        .member-dot { position: absolute; bottom: -1px; right: -1px; width: 8px; height: 8px; border-radius: 50%; border: 1.5px solid #2b2d31; }
        .member-name { font-size: 9px; font-weight: 500; }

        /* CTA */
        .cta-section { padding: 120px 28px; position: relative; overflow: hidden; background: linear-gradient(160deg,#0b0c1a 0%,#161728 100%); }
        .cta-glow { position: absolute; left: 50%; top: 50%; transform: translate(-50%,-50%); width: 600px; height: 400px; background: radial-gradient(ellipse,rgba(114,137,218,0.2),rgba(167,139,250,0.15),transparent); border-radius: 50%; filter: blur(50px); pointer-events: none; }
        .cta-inner { max-width: 640px; margin: 0 auto; text-align: center; position: relative; }
        .cta-h2 { font-size: clamp(34px,5vw,58px); font-weight: 900; margin-bottom: 20px; letter-spacing: -0.025em; line-height: 1.1; }
        .cta-p { color: #8e9297; font-size: 16px; line-height: 1.8; margin-bottom: 44px; max-width: 520px; margin-inline: auto; }
        .cta-btns { display: flex; gap: 16px; justify-content: center; flex-wrap: wrap; }
        .cta-note { color: #4f545c; font-size: 12px; margin-top: 36px; }

        /* FOOTER */
        .footer { border-top: 1px solid rgba(255,255,255,0.06); padding: 28px; background: #0d0e18; }
        .footer-inner { max-width: 1140px; margin: 0 auto; display: flex; flex-wrap: wrap; align-items: center; justify-content: space-between; gap: 16px; }
        .footer-logo { display: flex; align-items: center; gap: 10px; cursor: pointer; }
        .footer-note { color: #4f545c; font-size: 12px; }
        .footer-links { display: flex; gap: 20px; }
        .footer-link { background: none; border: none; color: #72767d; font-size: 12px; cursor: pointer; font-family: inherit; transition: color 0.2s; }
        .footer-link:hover { color: #fff; }

        /* RESPONSIVE */
        @media (max-width: 900px) {
          .hero-inner { grid-template-columns: 1fr; gap: 48px; }
          .hero-right { display: none; }
          .stats-inner { grid-template-columns: 1fr 1fr; }
          .feat-row, .feat-row-flip { flex-direction: column; padding: 60px 28px; gap: 40px; }
          .feat-row-mockup { max-width: 100%; }
          .nav-links, .nav-auth { display: none; }
          .mobile-nav-btn { display: flex !important; }
          .hero-chars { gap: 10px; }
        }
        @media (max-width: 600px) {
          .feat-grid-inner { grid-template-columns: 1fr; }
          .stats-inner { grid-template-columns: 1fr 1fr; gap: 24px; }
          .hero-chars svg { transform: scale(0.75); transform-origin: bottom; }
        }
        .mobile-nav-btn { display: none; background: none; border: none; color: #fff; cursor: pointer; font-family: inherit; }
      `}</style>

      {/* ── NAVBAR ── */}
      <nav className={`nav ${scrolled ? 'scrolled' : ''}`}>
        <div className="nav-inner">
          <div className="nav-logo" onClick={() => scrollTo('hero')}>
            <div className="nav-logo-icon"><Zap size={17} color="#fff"/></div>
            <span className="nav-logo-text">Meet<span>Lite</span></span>
          </div>
          <div className="nav-links">
            <button className="nav-link" onClick={() => scrollTo('features')}>Features</button>
            <button className="nav-link" onClick={() => scrollTo('about')}>About</button>
          </div>
          <div className="nav-auth">
            {!isLoading && (isAuthenticated ? (
              <AnimBtn primary onClick={() => navigate('/app')}>Open App <ArrowRight size={14}/></AnimBtn>
            ) : (
              <>
                <AnimBtn onClick={() => navigate('/login')}>Log In</AnimBtn>
                <AnimBtn primary onClick={() => navigate('/register')}>Sign Up Free</AnimBtn>
              </>
            ))}
          </div>
          <button className="mobile-nav-btn" onClick={() => setMenuOpen(p => !p)}>
            {menuOpen ? <X size={22}/> : <Menu size={22}/>}
          </button>
        </div>
        {menuOpen && (
          <div style={{ background: 'rgba(13,14,24,0.98)', backdropFilter: 'blur(18px)', padding: '20px 28px', display: 'flex', flexDirection: 'column', gap: 16, borderTop: '1px solid rgba(255,255,255,0.07)' }}>
            <button className="nav-link" style={{ textAlign: 'left', fontSize: 16 }} onClick={() => scrollTo('features')}>Features</button>
            <button className="nav-link" style={{ textAlign: 'left', fontSize: 16 }} onClick={() => scrollTo('about')}>About</button>
            <hr style={{ borderColor: 'rgba(255,255,255,0.07)' }} />
            {!isLoading && (isAuthenticated ? (
              <AnimBtn primary onClick={() => navigate('/app')} style={{ width: '100%', justifyContent: 'center' }}>Open App <ArrowRight size={14}/></AnimBtn>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                <AnimBtn onClick={() => navigate('/login')} style={{ width: '100%', justifyContent: 'center' }}>Log In</AnimBtn>
                <AnimBtn primary onClick={() => navigate('/register')} style={{ width: '100%', justifyContent: 'center' }}>Sign Up Free</AnimBtn>
              </div>
            ))}
          </div>
        )}
      </nav>

      {/* ── HERO ── */}
      <section id="hero" className="hero" ref={heroRef}>
        <div className="hero-grid"/>
        <div className="hero-glow"/>
        <div className="hero-inner">
          <div className="hero-left">
            <div className="hero-tag">
              <Zap size={12}/> Powered by LiveKit SFU · WebRTC
            </div>
            <h1 className="hero-h1">
              Your space to<br/><TypewriterText/>
            </h1>
            <p className="hero-p">
              MeetLite is a real-time communication platform — persistent chat, HD voice & video, screen sharing, and live presence. Built for teams, friends, and communities.
            </p>
            <div className="hero-btns">
              <AnimBtn primary onClick={() => navigate(isAuthenticated ? '/app' : '/login')}>
                {isAuthenticated ? 'Open App' : 'Launch in Browser'} <ArrowRight size={15}/>
              </AnimBtn>
              {!isAuthenticated && (
                <AnimBtn onClick={() => navigate('/register')}>Create Account</AnimBtn>
              )}
            </div>
            <div className="hero-tags">
              {['React 19', 'LiveKit SFU', 'Socket.IO', 'PostgreSQL', 'Prisma'].map(t => (
                <span key={t} className="hero-tag-chip">{t}</span>
              ))}
            </div>
          </div>
          <div className="hero-right">
            <AppMockup/>
          </div>
        </div>
        {/* Cartoon Characters */}
        <div className="hero-chars">
          {[
            { C: CharacterA, lbl: 'Sarah', delay: '0s', dur: '3.8s' },
            { C: CharacterB, lbl: 'Bot', delay: '0.6s', dur: '4.5s' },
            { C: CharacterC, lbl: 'Mia', delay: '1.1s', dur: '3.5s' },
            { C: CharacterD, lbl: 'Alex', delay: '0.3s', dur: '4.2s' },
          ].map(({ C, lbl, delay, dur }, i) => (
            <div key={i} className="char-wrap" style={{ '--delay': delay, '--dur': dur }}>
              <C/>
              <span className="char-label">{lbl}</span>
            </div>
          ))}
        </div>
      </section>

      {/* ── MARQUEE ── */}
      <Marquee/>

      {/* ── STATS ── */}
      <div className="stats-section">
        <div className="stats-inner">
          {[
            { val: '10–20', lbl: 'Users per room', c: '#7289da' },
            { val: '<100ms', lbl: 'LiveKit latency', c: '#43b581' },
            { val: '720p', lbl: 'Max video quality', c: '#a78bfa' },
            { val: '∞', lbl: 'Message history', c: '#faa61a' },
          ].map((s, i) => (
            <div key={i} style={{ textAlign: 'center' }}>
              <div className="stat-val" style={{ color: s.c }}>{s.val}</div>
              <div className="stat-lbl">{s.lbl}</div>
            </div>
          ))}
        </div>
      </div>

      {/* ── FEATURES HEADING ── */}
      <div id="features" className="features-head">
        <p className="section-eyebrow">What you get</p>
        <h2>
          Everything you need,<br/>
          <span style={{ backgroundImage: 'linear-gradient(90deg,#7289da,#a78bfa,#43b581)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
            nothing you don't.
          </span>
        </h2>
        <p style={{ color: '#8e9297', fontSize: 16, maxWidth: 500, margin: '14px auto 0' }}>
          Hover over any card. Scroll to discover each feature in detail below.
        </p>
      </div>

      {/* ── FEATURE CARDS GRID ── */}
      <div className="feat-grid">
        <div className="feat-grid-inner">
          {FEATURES.map((f, i) => (
            <FeatureCard key={i} {...f} delay={i * 90}/>
          ))}
        </div>
      </div>

      {/* ── FEATURE DETAIL ROWS ── */}
      <div className="feat-rows-section">
        <FeatureRow emoji="💬" tag="Real-Time Chat" flip={false} accent="#7289da"
          title="Create your own servers & channels."
          desc="Organize conversations into dedicated text channels. Messages persist in the database — scroll back anytime. Real-time typing indicators and instant delivery keep everyone in sync.">
          <ChatMini/>
        </FeatureRow>

        <FeatureRow emoji="🎙️" tag="Voice & Video" flip={true} accent="#43b581" delay={100}
          title="HD calls that feel face-to-face."
          desc="Crystal-clear group calls powered by LiveKit SFU. Adaptive streaming, simulcast layers, echo cancellation, and noise suppression — all in your browser, zero downloads.">
          <VoiceMini/>
        </FeatureRow>

        <FeatureRow emoji="🖥️" tag="Screen Share" flip={false} accent="#f04747" delay={100}
          title="Share your screen live, instantly."
          desc="One click and you're streaming your screen to everyone in the voice room. Perfect for presentations, co-working sessions, debugging, or just showing off your setup.">
          <ScreenMini/>
        </FeatureRow>

        <FeatureRow emoji="👥" tag="Live Presence" flip={true} accent="#a78bfa" delay={100}
          title="Always know who's around."
          desc="Live green/grey dots on every member of your server. The sidebar updates the instant someone connects, disconnects, or switches between servers. Real-time, zero delay.">
          <MembersMini/>
        </FeatureRow>
      </div>

      {/* ── CTA / ABOUT ── */}
      <section id="about" className="cta-section">
        <div className="cta-glow"/>
        <div className="cta-inner">
          <p className="section-eyebrow" style={{ color: '#a78bfa', marginBottom: 16 }}>Built for developers, designed for everyone</p>
          <h2 className="cta-h2">
            Ready to{' '}
            <span style={{ backgroundImage: 'linear-gradient(135deg,#7289da,#a78bfa)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
              MeetLite?
            </span>
          </h2>
          <p className="cta-p">
            Create your server in seconds. Invite your crew with a link. No downloads, no installs — just real-time communication that works.
          </p>
          <div className="cta-btns">
            <AnimBtn primary onClick={() => navigate('/register')} style={{ fontSize: 16, padding: '16px 36px' }}>
              Get Started — It's Free <ArrowRight size={18}/>
            </AnimBtn>
            <AnimBtn onClick={() => navigate('/login')} style={{ fontSize: 16, padding: '16px 36px' }}>
              Log In
            </AnimBtn>
          </div>
          <p className="cta-note">Open source · React · Express · Socket.IO · LiveKit · Neon PostgreSQL · Prisma</p>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer className="footer">
        <div className="footer-inner">
          <div className="footer-logo" onClick={() => scrollTo('hero')}>
            <div className="nav-logo-icon" style={{ width: 28, height: 28, borderRadius: 8 }}><Zap size={14} color="#fff"/></div>
            <span className="nav-logo-text" style={{ fontSize: 15 }}>Meet<span>Lite</span></span>
          </div>
          <p className="footer-note">Built with ❤️ using React · Socket.IO · LiveKit · Neon PostgreSQL</p>
          <div className="footer-links">
            <button className="footer-link" onClick={() => scrollTo('features')}>Features</button>
            <button className="footer-link" onClick={() => navigate('/login')}>Log In</button>
            <button className="footer-link" onClick={() => navigate('/register')}>Sign Up</button>
          </div>
        </div>
      </footer>
    </div>
  );
}
