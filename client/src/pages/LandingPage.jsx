import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import {
  MessageSquare, Video, Users, Zap, Shield, Link2,
  Menu, X, Mic, Monitor, Hash, Volume2, Crown, ArrowRight,
} from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

/* ── Typewriter ── */
const WORDS = ['Talk.', 'Connect.', 'Stream.', 'Collaborate.', 'Vibe.'];
function TypewriterText() {
  const [idx, setIdx] = useState(0);
  const [displayed, setDisplayed] = useState('');
  const [deleting, setDeleting] = useState(false);
  const [paused, setPaused] = useState(false);
  useEffect(() => {
    const word = WORDS[idx];
    if (paused) {
      const t = setTimeout(() => { setDeleting(true); setPaused(false); }, 1400);
      return () => clearTimeout(t);
    }
    if (!deleting) {
      if (displayed.length < word.length) {
        const t = setTimeout(() => setDisplayed(word.slice(0, displayed.length + 1)), 80);
        return () => clearTimeout(t);
      } else { setPaused(true); }
    } else {
      if (displayed.length > 0) {
        const t = setTimeout(() => setDisplayed(displayed.slice(0, -1)), 45);
        return () => clearTimeout(t);
      } else { setDeleting(false); setIdx(p => (p + 1) % WORDS.length); }
    }
  }, [displayed, deleting, paused, idx]);
  return (
    <span style={{ backgroundImage: 'linear-gradient(90deg,#7289da,#a78bfa,#ec4899)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
      {displayed}<span style={{ WebkitTextFillColor: '#7289da' }} className="animate-pulse">|</span>
    </span>
  );
}

/* ── Feature data ── */
const FEATURES = [
  {
    emoji: '💬', accent: '#7289da',
    tag: 'Real-Time Chat',
    title: 'Create your own servers & channels.',
    desc: 'Organize conversations into text channels. Messages persist in the database — scroll back anytime. Typing indicators and instant delivery powered by Socket.IO keep everyone in sync.',
    mockup: 'chat',
  },
  {
    emoji: '🎙️', accent: '#43b581',
    tag: 'Voice & Video',
    title: 'HD calls that feel face-to-face.',
    desc: 'Crystal-clear group voice and video powered by LiveKit SFU. Adaptive streaming, simulcast layers, echo cancellation, and noise suppression — all in your browser, zero installs.',
    mockup: 'voice',
  },
  {
    emoji: '🖥️', accent: '#f04747',
    tag: 'Screen Share',
    title: 'Share your screen live, instantly.',
    desc: "One click and you're streaming your screen to everyone in the voice room. Perfect for presentations, co-working sessions, or just showing off your setup.",
    mockup: 'screen',
  },
  {
    emoji: '👥', accent: '#a78bfa',
    tag: 'Live Presence',
    title: 'Always know who\'s around.',
    desc: 'Live green/grey dots on every member. The sidebar updates the moment someone connects, goes offline, or switches between servers. Real-time, zero delay.',
    mockup: 'members',
  },
  {
    emoji: '🔗', accent: '#faa61a',
    tag: 'Invite Links',
    title: 'One link to bring your people in.',
    desc: "Generate a shareable invite link for your server. Anyone with the link joins instantly — no friction, no forced downloads. Share it anywhere.",
    mockup: 'invite',
  },
  {
    emoji: '🛡️', accent: '#43b581',
    tag: 'Secure Auth',
    title: 'Your data, protected by design.',
    desc: 'JWT authentication with HTTP-only cookies. Role-based permissions — Owners manage members, kick users, and control channels. Nobody gets in without an invite.',
    mockup: 'security',
  },
];

/* ── Mini mockups ── */
function MockupChat() {
  return (
    <div style={{ background: '#2b2d31', borderRadius: 16, overflow: 'hidden', border: '1px solid rgba(255,255,255,0.07)' }}>
      <div style={{ background: '#1e2124', padding: '12px 16px', display: 'flex', alignItems: 'center', gap: 8, borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
        <Hash size={14} color="#7289da" />
        <span style={{ color: '#fff', fontWeight: 700, fontSize: 13 }}>general</span>
        <span style={{ marginLeft: 'auto', color: '#43b581', fontSize: 11, fontWeight: 600 }}>● 4 online</span>
      </div>
      <div style={{ padding: '16px', display: 'flex', flexDirection: 'column', gap: 14 }}>
        {[
          { u: 'Aryan', c: '#7289da', t: 'Server bana liya! 🎉' },
          { u: 'Bhavya', c: '#43b581', t: 'Bhai welcome hoon! 🚀' },
          { u: 'Charu', c: '#a78bfa', t: 'Voice mein aa jao sablog 🎙️' },
        ].map((m, i) => (
          <div key={i} style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}>
            <div style={{ width: 32, height: 32, borderRadius: '50%', background: m.c, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 900, fontSize: 13, color: '#fff', flexShrink: 0 }}>{m.u[0]}</div>
            <div>
              <div style={{ color: '#fff', fontWeight: 700, fontSize: 12 }}>{m.u} <span style={{ color: '#72767d', fontWeight: 400, fontSize: 10 }}>Today</span></div>
              <div style={{ color: '#dcddde', fontSize: 13, marginTop: 2 }}>{m.t}</div>
            </div>
          </div>
        ))}
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: '#72767d', fontSize: 11, marginTop: 4 }}>
          <span style={{ display: 'flex', gap: 3 }}>{[0,1,2].map(i => <span key={i} className="animate-bounce" style={{ width: 4, height: 4, borderRadius: '50%', background: '#72767d', display: 'inline-block', animationDelay: `${i*150}ms` }} />)}</span>
          Dev is typing…
        </div>
        <div style={{ background: 'rgba(0,0,0,0.2)', borderRadius: 8, padding: '8px 12px', color: '#72767d', fontSize: 12, border: '1px solid rgba(255,255,255,0.05)' }}>Message #general…</div>
      </div>
    </div>
  );
}

function MockupVoice() {
  const users = [{ name: 'Aryan', c: '#7289da', speaking: true }, { name: 'Bhavya', c: '#43b581', speaking: true }, { name: 'Charu', c: '#a78bfa', speaking: false }, { name: 'Dev', c: '#faa61a', speaking: false }];
  return (
    <div style={{ background: '#1e2030', borderRadius: 16, padding: 20, border: '1px solid rgba(255,255,255,0.07)' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
        <Volume2 size={14} color="#43b581" />
        <span style={{ color: '#fff', fontWeight: 700, fontSize: 13 }}>General Voice</span>
        <span style={{ marginLeft: 'auto', background: '#43b58120', color: '#43b581', fontSize: 10, fontWeight: 700, padding: '2px 8px', borderRadius: 99 }}>● LIVE</span>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
        {users.map(u => (
          <div key={u.name} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6, padding: '12px 8px', borderRadius: 12, background: u.speaking ? `${u.c}12` : 'rgba(255,255,255,0.03)', border: `1.5px solid ${u.speaking ? u.c + '40' : 'rgba(255,255,255,0.05)'}` }}>
            <div style={{ position: 'relative' }}>
              <div style={{ width: 44, height: 44, borderRadius: '50%', background: `${u.c}30`, border: `2px solid ${u.speaking ? u.c : 'transparent'}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 900, fontSize: 16, color: u.c }}>{u.name[0]}</div>
              {u.speaking && <span style={{ position: 'absolute', bottom: -2, right: -2, width: 16, height: 16, borderRadius: '50%', background: '#43b581', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Mic size={9} color="#fff" /></span>}
            </div>
            <span style={{ fontSize: 11, fontWeight: 600, color: u.speaking ? '#fff' : '#72767d' }}>{u.name}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function MockupScreen() {
  return (
    <div style={{ background: '#1a1c26', borderRadius: 16, overflow: 'hidden', border: '1px solid rgba(255,255,255,0.07)' }}>
      <div style={{ background: '#111214', padding: '8px 14px', display: 'flex', alignItems: 'center', gap: 6 }}>
        <span style={{ width: 10, height: 10, borderRadius: '50%', background: '#f04747' }} />
        <span style={{ width: 10, height: 10, borderRadius: '50%', background: '#faa61a' }} />
        <span style={{ width: 10, height: 10, borderRadius: '50%', background: '#43b581' }} />
        <span style={{ color: 'rgba(255,255,255,0.3)', fontSize: 11, marginLeft: 8, fontFamily: 'monospace' }}>Screen Share — Active</span>
      </div>
      <div style={{ background: 'linear-gradient(135deg,#1a1c2e,#16181f)', padding: 16, minHeight: 160, display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: 12 }}>
        <Monitor size={40} color="rgba(240,71,71,0.6)" />
        <span style={{ color: 'rgba(255,255,255,0.5)', fontSize: 13 }}>Aryan is sharing their screen</span>
        <div style={{ display: 'flex', gap: 6 }}>
          {['Bhavya', 'Charu', 'Dev'].map((n, i) => (
            <div key={n} style={{ width: 28, height: 28, borderRadius: '50%', background: ['#43b581','#a78bfa','#faa61a'][i], display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, fontWeight: 900, color: '#fff' }}>{n[0]}</div>
          ))}
        </div>
        <span style={{ color: 'rgba(255,255,255,0.3)', fontSize: 11 }}>3 watching</span>
      </div>
    </div>
  );
}

function MockupMembers() {
  const online = [{ n: 'Aryan', c: '#7289da', owner: true }, { n: 'Bhavya', c: '#43b581' }, { n: 'Charu', c: '#a78bfa' }];
  const offline = [{ n: 'Dev', c: '#faa61a' }, { n: 'Esha', c: '#f04747' }];
  return (
    <div style={{ background: '#2b2d31', borderRadius: 16, padding: 20, border: '1px solid rgba(255,255,255,0.07)' }}>
      <p style={{ fontSize: 10, fontWeight: 800, color: '#72767d', textTransform: 'uppercase', letterSpacing: '0.12em', marginBottom: 10 }}>Online — {online.length}</p>
      {online.map(m => (
        <div key={m.n} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '6px 4px', borderRadius: 8 }}>
          <div style={{ position: 'relative' }}>
            <div style={{ width: 32, height: 32, borderRadius: '50%', background: m.c, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 900, fontSize: 13, color: '#fff' }}>{m.n[0]}</div>
            <span style={{ position: 'absolute', bottom: -1, right: -1, width: 11, height: 11, borderRadius: '50%', background: '#43b581', border: '2px solid #2b2d31' }} />
          </div>
          <span style={{ color: '#dcddde', fontSize: 13, flex: 1 }}>{m.n}</span>
          {m.owner && <Crown size={13} color="#faa61a" />}
        </div>
      ))}
      <p style={{ fontSize: 10, fontWeight: 800, color: '#72767d', textTransform: 'uppercase', letterSpacing: '0.12em', margin: '12px 0 8px' }}>Offline — {offline.length}</p>
      {offline.map(m => (
        <div key={m.n} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '6px 4px', opacity: 0.4 }}>
          <div style={{ position: 'relative' }}>
            <div style={{ width: 32, height: 32, borderRadius: '50%', background: m.c, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 900, fontSize: 13, color: '#fff' }}>{m.n[0]}</div>
            <span style={{ position: 'absolute', bottom: -1, right: -1, width: 11, height: 11, borderRadius: '50%', background: '#72767d', border: '2px solid #2b2d31' }} />
          </div>
          <span style={{ color: '#72767d', fontSize: 13 }}>{m.n}</span>
        </div>
      ))}
    </div>
  );
}

function MockupInvite() {
  return (
    <div style={{ background: '#1e2030', borderRadius: 16, padding: 24, border: '1px solid rgba(255,255,255,0.07)' }}>
      <div style={{ textAlign: 'center', marginBottom: 20 }}>
        <div style={{ width: 56, height: 56, borderRadius: 16, background: 'rgba(250,166,26,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 12px' }}>
          <Link2 size={24} color="#faa61a" />
        </div>
        <p style={{ color: '#fff', fontWeight: 700, fontSize: 14 }}>Invite to My Server</p>
        <p style={{ color: '#72767d', fontSize: 12, marginTop: 4 }}>Share this link with friends</p>
      </div>
      <div style={{ background: 'rgba(0,0,0,0.3)', borderRadius: 10, padding: '10px 14px', display: 'flex', alignItems: 'center', gap: 10, border: '1px solid rgba(255,255,255,0.08)', marginBottom: 12 }}>
        <span style={{ color: '#7289da', fontSize: 12, fontFamily: 'monospace', flex: 1 }}>meetlite.app/invite/Xk9mP2</span>
        <div style={{ background: '#7289da', borderRadius: 6, padding: '4px 10px', fontSize: 11, fontWeight: 700, color: '#fff', cursor: 'pointer' }}>Copy</div>
      </div>
      <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
        {[{ n:'Aryan',c:'#7289da'},{n:'Bhavya',c:'#43b581'},{n:'Charu',c:'#a78bfa'}].map(m => (
          <div key={m.n} style={{ width: 28, height: 28, borderRadius: '50%', background: m.c, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 900, fontSize: 11, color: '#fff' }}>{m.n[0]}</div>
        ))}
        <span style={{ color: '#72767d', fontSize: 11, marginLeft: 4 }}>+2 more joined today</span>
      </div>
    </div>
  );
}

function MockupSecurity() {
  return (
    <div style={{ background: '#1e2030', borderRadius: 16, padding: 24, border: '1px solid rgba(255,255,255,0.07)' }}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        {[
          { icon: <Shield size={16} color="#43b581" />, label: 'JWT Auth', sub: 'HTTP-only cookies, no localStorage risk', ok: true },
          { icon: <Shield size={16} color="#43b581" />, label: 'Role Permissions', sub: 'Owner · Member access control', ok: true },
          { icon: <Shield size={16} color="#43b581" />, label: 'Secure Tokens', sub: 'LiveKit tokens expire in 6h', ok: true },
          { icon: <Shield size={16} color="#43b581" />, label: 'Invite Gate', sub: 'No link = no access, ever', ok: true },
        ].map((r, i) => (
          <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 12, background: 'rgba(67,181,129,0.06)', borderRadius: 10, padding: '10px 14px', border: '1px solid rgba(67,181,129,0.12)' }}>
            {r.icon}
            <div style={{ flex: 1 }}>
              <p style={{ color: '#fff', fontSize: 12, fontWeight: 700 }}>{r.label}</p>
              <p style={{ color: '#72767d', fontSize: 11, marginTop: 1 }}>{r.sub}</p>
            </div>
            <span style={{ color: '#43b581', fontSize: 14, fontWeight: 900 }}>✓</span>
          </div>
        ))}
      </div>
    </div>
  );
}

const MOCKUP_MAP = { chat: <MockupChat />, voice: <MockupVoice />, screen: <MockupScreen />, members: <MockupMembers />, invite: <MockupInvite />, security: <MockupSecurity /> };

/* ── App Mockup ── */
function AppMockup() {
  return (
    <div style={{ position: 'relative', width: '100%', maxWidth: 520, margin: '0 auto', userSelect: 'none', pointerEvents: 'none' }}>
      <div style={{ position: 'absolute', inset: -24, borderRadius: 40, background: 'radial-gradient(ellipse at center, rgba(114,137,218,0.22) 0%, transparent 70%)', filter: 'blur(20px)' }} />
      <div style={{ position: 'relative', borderRadius: 18, overflow: 'hidden', border: '1px solid rgba(255,255,255,0.09)', boxShadow: '0 32px 80px rgba(0,0,0,0.5)', background: '#1e1f22' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '10px 16px', background: '#111214', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
          <span style={{ width: 11, height: 11, borderRadius: '50%', background: '#f04747', display: 'inline-block' }} />
          <span style={{ width: 11, height: 11, borderRadius: '50%', background: '#faa61a', display: 'inline-block' }} />
          <span style={{ width: 11, height: 11, borderRadius: '50%', background: '#43b581', display: 'inline-block' }} />
          <span style={{ marginLeft: 14, color: 'rgba(255,255,255,0.25)', fontSize: 11, fontFamily: 'monospace' }}>meetlite — #general</span>
        </div>
        <div style={{ display: 'flex', height: 280 }}>
          {/* Server rail */}
          <div style={{ width: 52, background: '#111214', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10, padding: '12px 0', borderRight: '1px solid rgba(255,255,255,0.05)' }}>
            {[{l:'M',c:'#7289da'},{l:'G',c:'#43b581'},{l:'D',c:'#a78bfa'}].map(({l,c},i)=>(
              <div key={i} style={{ width: 38, height: 38, borderRadius: 12, background: `${c}25`, border: `1.5px solid ${c}45`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 900, fontSize: 13, color: c }}>{l}</div>
            ))}
          </div>
          {/* Sidebar */}
          <div style={{ width: 148, background: '#2b2d31', borderRight: '1px solid rgba(255,255,255,0.05)', padding: 10 }}>
            <p style={{ fontSize: 9, fontWeight: 800, color: 'rgba(255,255,255,0.3)', textTransform: 'uppercase', letterSpacing: '0.15em', marginBottom: 10 }}>My Server</p>
            {['# general','# random'].map((c,i)=>(
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 5, padding: '5px 6px', borderRadius: 6, marginBottom: 3, background: i===0?'rgba(255,255,255,0.08)':'transparent', color: i===0?'#fff':'rgba(255,255,255,0.35)', fontSize: 11, fontWeight: i===0?600:400 }}>
                <Hash size={10} style={{ opacity: 0.6 }} />{c.slice(2)}
              </div>
            ))}
            <p style={{ fontSize: 9, fontWeight: 800, color: 'rgba(255,255,255,0.25)', textTransform: 'uppercase', letterSpacing: '0.15em', margin: '12px 0 6px', padding: '0 4px' }}>Voice</p>
            <div style={{ display: 'flex', alignItems: 'center', gap: 5, padding: '5px 6px', color: 'rgba(255,255,255,0.3)', fontSize: 11 }}><Volume2 size={10} />General</div>
          </div>
          {/* Chat */}
          <div style={{ flex: 1, background: '#313338', display: 'flex', flexDirection: 'column', padding: 12, gap: 10 }}>
            {[{u:'Aryan',c:'#7289da',t:'Hey! 👋'},{u:'Bhavya',c:'#43b581',t:'Welcome! 🚀'},{u:'Charu',c:'#a78bfa',t:'Voice mein aao 🎙️'}].map((m,i)=>(
              <div key={i} style={{ display: 'flex', gap: 8, alignItems: 'flex-start' }}>
                <div style={{ width: 26, height: 26, borderRadius: '50%', background: m.c, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 900, fontSize: 10, color: '#fff', flexShrink: 0 }}>{m.u[0]}</div>
                <div>
                  <p style={{ fontSize: 9, fontWeight: 700, color: '#fff' }}>{m.u} <span style={{ color: 'rgba(255,255,255,0.3)', fontWeight: 400 }}>Today</span></p>
                  <p style={{ fontSize: 10, color: 'rgba(255,255,255,0.7)', marginTop: 1 }}>{m.t}</p>
                </div>
              </div>
            ))}
            <div style={{ marginTop: 'auto', fontSize: 9, color: '#72767d', display: 'flex', alignItems: 'center', gap: 5 }}>
              <span style={{ display: 'flex', gap: 2 }}>{[0,1,2].map(i=><span key={i} className="animate-bounce" style={{ width: 3, height: 3, borderRadius: '50%', background: '#72767d', display: 'inline-block', animationDelay:`${i*150}ms` }} />)}</span>Dev is typing…
            </div>
            <div style={{ background: 'rgba(0,0,0,0.15)', borderRadius: 6, padding: '6px 10px', color: '#72767d', fontSize: 9, border: '1px solid rgba(255,255,255,0.05)' }}>Message #general…</div>
          </div>
          {/* Members */}
          <div style={{ width: 110, background: '#2b2d31', borderLeft: '1px solid rgba(255,255,255,0.05)', padding: 10 }}>
            <p style={{ fontSize: 9, fontWeight: 800, color: 'rgba(255,255,255,0.3)', textTransform: 'uppercase', letterSpacing: '0.12em', marginBottom: 8 }}>Online — 3</p>
            {[{u:'Aryan',c:'#7289da',online:true},{u:'Bhavya',c:'#43b581',online:true},{u:'Charu',c:'#a78bfa',online:true},{u:'Dev',c:'#faa61a',online:false}].map((m,i)=>(
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '4px 2px', marginBottom: 2, opacity: m.online?1:0.4 }}>
                <div style={{ position: 'relative', flexShrink: 0 }}>
                  <div style={{ width: 22, height: 22, borderRadius: '50%', background: m.c, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 900, fontSize: 9, color: '#fff' }}>{m.u[0]}</div>
                  <span style={{ position: 'absolute', bottom: -1, right: -1, width: 8, height: 8, borderRadius: '50%', background: m.online?'#43b581':'#72767d', border: '1.5px solid #2b2d31' }} />
                </div>
                <span style={{ fontSize: 9, color: m.online?'rgba(255,255,255,0.8)':'rgba(255,255,255,0.3)', fontWeight: 500 }}>{m.u}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ── MARQUEE ── */
const MARQUEE_WORDS = [
  { t: 'CHAT', e: '💬' }, { t: 'VOICE', e: '🎙️' }, { t: 'CONNECT', e: '⚡' },
  { t: 'STREAM', e: '🎥' }, { t: 'COLLAB', e: '👥' }, { t: 'SHARE', e: '🔗' },
  { t: 'VIBE', e: '✨' }, { t: 'BUILD', e: '🚀' },
];
function Marquee() {
  const items = [...MARQUEE_WORDS, ...MARQUEE_WORDS, ...MARQUEE_WORDS];
  return (
    <div style={{ overflow: 'hidden', padding: '18px 0', borderTop: '1px solid rgba(255,255,255,0.06)', borderBottom: '1px solid rgba(255,255,255,0.06)', background: 'linear-gradient(90deg,#13141f,#1a1b2e,#13141f)' }}>
      <div className="animate-marquee" style={{ display: 'flex', gap: 32, whiteSpace: 'nowrap', width: 'max-content' }}>
        {items.map((item, i) => {
          const colors = ['#7289da','#a78bfa','#43b581','#faa61a','#f04747','rgba(255,255,255,0.2)'];
          const col = colors[i % colors.length];
          return (
            <span key={i} style={{ display: 'flex', alignItems: 'center', gap: 10, color: col, fontSize: 13, fontWeight: 800, letterSpacing: '0.2em', textTransform: 'uppercase' }}>
              <span style={{ opacity: 0.7 }}>{item.e}</span>
              {item.t}
              <span style={{ color: 'rgba(255,255,255,0.1)', marginLeft: 8 }}>✦</span>
            </span>
          );
        })}
      </div>
    </div>
  );
}

/* ── STATS ── */
const STATS = [
  { val: '10–20', label: 'Users per room', color: '#7289da' },
  { val: '<100ms', label: 'LiveKit latency', color: '#43b581' },
  { val: '720p', label: 'Max video quality', color: '#a78bfa' },
  { val: '∞', label: 'Message history', color: '#faa61a' },
];

/* ── Feature card component with GSAP ── */
function FeatureSection({ feat, index }) {
  const sectionRef = useRef(null);
  const textRef = useRef(null);
  const cardRef = useRef(null);
  const flip = index % 2 === 1;

  useEffect(() => {
    const section = sectionRef.current;
    const text = textRef.current;
    const card = cardRef.current;
    if (!section || !text || !card) return;

    // Text slides in from left/right
    gsap.fromTo(text,
      { opacity: 0, x: flip ? 60 : -60 },
      {
        opacity: 1, x: 0, duration: 0.9, ease: 'power3.out',
        scrollTrigger: { trigger: section, start: 'top 75%', toggleActions: 'play none none reverse' }
      }
    );

    // Card slides in from opposite side
    gsap.fromTo(card,
      { opacity: 0, x: flip ? -60 : 60, scale: 0.95 },
      {
        opacity: 1, x: 0, scale: 1, duration: 0.9, ease: 'power3.out', delay: 0.1,
        scrollTrigger: { trigger: section, start: 'top 75%', toggleActions: 'play none none reverse' }
      }
    );

    return () => { ScrollTrigger.getAll().forEach(t => { if (t.trigger === section) t.kill(); }); };
  }, [flip]);

  // Hover handlers
  const onEnter = () => gsap.to(cardRef.current, { scale: 1.02, y: -4, duration: 0.3, ease: 'power2.out' });
  const onLeave = () => gsap.to(cardRef.current, { scale: 1, y: 0, duration: 0.3, ease: 'power2.out' });

  return (
    <section ref={sectionRef} style={{ padding: '100px 0', background: index % 2 === 0 ? '#1a1b1e' : '#16181c', position: 'relative', overflow: 'hidden' }}>
      {/* Background accent blob */}
      <div style={{
        position: 'absolute', width: 400, height: 400, borderRadius: '50%',
        background: feat.accent, opacity: 0.07, filter: 'blur(80px)', pointerEvents: 'none',
        [flip ? 'right' : 'left']: -100, top: '50%', transform: 'translateY(-50%)',
      }} />
      <div style={{ maxWidth: 1100, margin: '0 auto', padding: '0 24px', display: 'flex', flexDirection: 'column', gap: 60, alignItems: 'center' }}>
        {/* Small tag above */}
        <div ref={textRef} style={{ display: 'flex', flexDirection: flip ? 'row-reverse' : 'row', alignItems: 'center', gap: 60, width: '100%', flexWrap: 'wrap' }}>
          {/* Text */}
          <div style={{ flex: '1 1 360px', maxWidth: 480 }}>
            <div style={{
              display: 'inline-flex', alignItems: 'center', gap: 8, marginBottom: 20,
              padding: '6px 14px', borderRadius: 99, fontSize: 11, fontWeight: 800, letterSpacing: '0.12em', textTransform: 'uppercase',
              background: `${feat.accent}15`, border: `1px solid ${feat.accent}35`, color: feat.accent,
            }}>
              <span style={{ fontSize: 14 }}>{feat.emoji}</span>{feat.tag}
            </div>
            <h2 style={{ fontSize: 'clamp(26px,4vw,42px)', fontWeight: 900, color: '#fff', lineHeight: 1.15, marginBottom: 20, letterSpacing: '-0.02em' }}>
              {feat.title}
            </h2>
            <p style={{ color: '#8e9297', fontSize: 15, lineHeight: 1.75, maxWidth: 420 }}>{feat.desc}</p>
          </div>
          {/* Mockup card */}
          <div ref={cardRef} style={{ flex: '1 1 320px', maxWidth: 440, cursor: 'default' }}
            onMouseEnter={onEnter} onMouseLeave={onLeave}>
            {MOCKUP_MAP[feat.mockup]}
          </div>
        </div>
      </div>
    </section>
  );
}

/* ── MAIN ── */
export default function LandingPage() {
  const navigate = useNavigate();
  const { isAuthenticated, isLoading } = useAuthStore();
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const heroTextRef = useRef(null);
  const heroImgRef = useRef(null);
  const heroTagRef = useRef(null);
  const heroBtnRef = useRef(null);
  const marqueeRef = useRef(null);
  const statsRef = useRef(null);
  const ctaRef = useRef(null);
  const featHeadRef = useRef(null);

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 12);
    window.addEventListener('scroll', handler);
    return () => window.removeEventListener('scroll', handler);
  }, []);

  /* GSAP hero entrance timeline */
  useEffect(() => {
    const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });
    tl.fromTo(heroTagRef.current, { opacity: 0, y: -20 }, { opacity: 1, y: 0, duration: 0.6 })
      .fromTo(heroTextRef.current, { opacity: 0, x: -50 }, { opacity: 1, x: 0, duration: 0.9 }, '-=0.2')
      .fromTo(heroBtnRef.current, { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.6 }, '-=0.4')
      .fromTo(heroImgRef.current, { opacity: 0, x: 60, scale: 0.95 }, { opacity: 1, x: 0, scale: 1, duration: 1 }, '-=0.8');

    /* Stats scroll reveal */
    gsap.fromTo(statsRef.current?.children ? [...statsRef.current.children] : [],
      { opacity: 0, y: 30 },
      { opacity: 1, y: 0, duration: 0.7, stagger: 0.12, ease: 'power3.out',
        scrollTrigger: { trigger: statsRef.current, start: 'top 80%' } }
    );

    /* Features heading */
    gsap.fromTo(featHeadRef.current,
      { opacity: 0, y: 40 },
      { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out',
        scrollTrigger: { trigger: featHeadRef.current, start: 'top 80%' } }
    );

    /* CTA */
    gsap.fromTo(ctaRef.current,
      { opacity: 0, scale: 0.94 },
      { opacity: 1, scale: 1, duration: 0.8, ease: 'power3.out',
        scrollTrigger: { trigger: ctaRef.current, start: 'top 80%' } }
    );

    return () => ScrollTrigger.getAll().forEach(t => t.kill());
  }, []);

  const scrollTo = (id) => {
    setMenuOpen(false);
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleOpenApp = () => navigate(isAuthenticated ? '/app' : '/login');

  return (
    <div style={{ minHeight: '100vh', background: '#1a1b1e', color: '#fff', overflowX: 'hidden', fontFamily: "'Inter','Segoe UI',sans-serif" }}>

      {/* ── NAVBAR ── */}
      <nav style={{
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100,
        background: scrolled ? 'rgba(18,19,24,0.94)' : 'transparent',
        backdropFilter: scrolled ? 'blur(18px)' : 'none',
        borderBottom: scrolled ? '1px solid rgba(255,255,255,0.07)' : 'none',
        transition: 'all 0.3s ease',
      }}>
        <div style={{ maxWidth: 1100, margin: '0 auto', padding: '0 24px', height: 64, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div onClick={() => scrollTo('hero')} style={{ display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer' }}>
            <div style={{ width: 32, height: 32, borderRadius: 10, background: 'linear-gradient(135deg,#7289da,#a78bfa)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Zap size={16} color="#fff" />
            </div>
            <span style={{ fontWeight: 900, fontSize: 18, letterSpacing: '-0.02em' }}>
              Meet<span style={{ color: '#7289da' }}>Lite</span>
            </span>
          </div>

          {/* Desktop links */}
          <div style={{ display: 'flex', gap: 32, alignItems: 'center' }} className="hidden-mobile">
            {[['Features', 'features'], ['About', 'about']].map(([l, id]) => (
              <button key={id} onClick={() => scrollTo(id)}
                style={{ background: 'none', border: 'none', color: '#8e9297', fontSize: 14, fontWeight: 500, cursor: 'pointer', transition: 'color 0.2s' }}
                onMouseEnter={e => e.target.style.color = '#fff'}
                onMouseLeave={e => e.target.style.color = '#8e9297'}>
                {l}
              </button>
            ))}
          </div>

          <div style={{ display: 'flex', gap: 10, alignItems: 'center' }} className="hidden-mobile">
            {!isLoading && (isAuthenticated ? (
              <button onClick={() => navigate('/app')}
                style={{ background: 'linear-gradient(135deg,#7289da,#5e73bc)', border: 'none', color: '#fff', padding: '8px 20px', borderRadius: 99, fontWeight: 700, fontSize: 13, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6 }}>
                Open App <ArrowRight size={14} />
              </button>
            ) : (
              <>
                <button onClick={() => navigate('/login')}
                  style={{ background: 'none', border: 'none', color: '#8e9297', fontSize: 13, fontWeight: 600, cursor: 'pointer' }}>
                  Log In
                </button>
                <button onClick={() => navigate('/register')}
                  style={{ background: 'linear-gradient(135deg,#7289da,#a78bfa)', border: 'none', color: '#fff', padding: '8px 20px', borderRadius: 99, fontWeight: 700, fontSize: 13, cursor: 'pointer', boxShadow: '0 2px 16px rgba(114,137,218,0.35)' }}>
                  Sign Up Free
                </button>
              </>
            ))}
          </div>

          {/* Mobile */}
          <button onClick={() => setMenuOpen(p => !p)} style={{ background: 'none', border: 'none', color: '#fff', cursor: 'pointer', display: 'none' }} className="show-mobile">
            {menuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
        {menuOpen && (
          <div style={{ background: 'rgba(18,19,24,0.98)', backdropFilter: 'blur(18px)', padding: '16px 24px', display: 'flex', flexDirection: 'column', gap: 14, borderTop: '1px solid rgba(255,255,255,0.06)' }}>
            <button onClick={() => scrollTo('features')} style={{ background: 'none', border: 'none', color: '#8e9297', fontSize: 14, fontWeight: 500, cursor: 'pointer', textAlign: 'left' }}>Features</button>
            <button onClick={() => scrollTo('about')} style={{ background: 'none', border: 'none', color: '#8e9297', fontSize: 14, fontWeight: 500, cursor: 'pointer', textAlign: 'left' }}>About</button>
            <hr style={{ borderColor: 'rgba(255,255,255,0.07)', margin: '4px 0' }} />
            {!isLoading && (isAuthenticated ? (
              <button onClick={() => navigate('/app')} style={{ background: '#7289da', border: 'none', color: '#fff', padding: '10px', borderRadius: 99, fontWeight: 700, cursor: 'pointer' }}>Open App</button>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                <button onClick={() => navigate('/login')} style={{ border: '1px solid rgba(255,255,255,0.15)', background: 'none', color: '#fff', padding: '10px', borderRadius: 99, fontWeight: 700, cursor: 'pointer' }}>Log In</button>
                <button onClick={() => navigate('/register')} style={{ background: 'linear-gradient(135deg,#7289da,#a78bfa)', border: 'none', color: '#fff', padding: '10px', borderRadius: 99, fontWeight: 700, cursor: 'pointer' }}>Sign Up Free</button>
              </div>
            ))}
          </div>
        )}
      </nav>

      {/* ── HERO ── */}
      <section id="hero" style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', paddingTop: 64, position: 'relative', overflow: 'hidden', background: 'linear-gradient(160deg,#0c0d1a 0%,#1a1b2e 45%,#1a1b1e 100%)' }}>
        {/* Grid bg */}
        <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', opacity: 0.18, backgroundImage: 'linear-gradient(rgba(114,137,218,0.2) 1px,transparent 1px),linear-gradient(90deg,rgba(114,137,218,0.2) 1px,transparent 1px)', backgroundSize: '64px 64px' }} />
        {/* Radial glow */}
        <div style={{ position: 'absolute', top: 0, left: '50%', transform: 'translateX(-50%)', width: 800, height: 500, background: 'radial-gradient(ellipse at center,rgba(114,137,218,0.2) 0%,transparent 70%)', pointerEvents: 'none' }} />

        <div style={{ maxWidth: 1100, margin: '0 auto', padding: '80px 24px', display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(320px,1fr))', gap: 60, alignItems: 'center', width: '100%' }}>
          {/* Left */}
          <div>
            <div ref={heroTagRef} style={{ opacity: 0 }}>
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '6px 14px', borderRadius: 99, background: 'rgba(114,137,218,0.12)', border: '1px solid rgba(114,137,218,0.35)', color: '#7289da', fontSize: 11, fontWeight: 800, letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 28 }}>
                <Zap size={12} /> Powered by LiveKit SFU · WebRTC
              </div>
            </div>
            <div ref={heroTextRef} style={{ opacity: 0 }}>
              <h1 style={{ fontSize: 'clamp(38px,6vw,66px)', fontWeight: 900, lineHeight: 1.05, marginBottom: 20, letterSpacing: '-0.03em' }}>
                Your space to<br />
                <TypewriterText />
              </h1>
              <p style={{ color: '#8e9297', fontSize: 16, lineHeight: 1.8, marginBottom: 36, maxWidth: 440 }}>
                MeetLite is a real-time communication platform with persistent chat, HD voice & video, screen sharing, and live presence — built for teams, friends, and communities.
              </p>
            </div>
            <div ref={heroBtnRef} style={{ opacity: 0, display: 'flex', gap: 12, flexWrap: 'wrap' }}>
              <button onClick={handleOpenApp}
                style={{ background: 'linear-gradient(135deg,#7289da,#5e73bc)', border: 'none', color: '#fff', padding: '14px 28px', borderRadius: 99, fontWeight: 700, fontSize: 15, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 8, boxShadow: '0 4px 24px rgba(114,137,218,0.4)' }}>
                {isAuthenticated ? 'Open App' : 'Launch in Browser'} <ArrowRight size={16} />
              </button>
              {!isAuthenticated && (
                <button onClick={() => navigate('/register')}
                  style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.13)', color: '#fff', padding: '14px 28px', borderRadius: 99, fontWeight: 700, fontSize: 15, cursor: 'pointer' }}>
                  Create Account
                </button>
              )}
            </div>
            {/* Tech tags */}
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginTop: 28 }}>
              {['React 19', 'LiveKit SFU', 'Socket.IO', 'PostgreSQL', 'Prisma'].map(t => (
                <span key={t} style={{ fontSize: 11, fontWeight: 600, padding: '4px 10px', borderRadius: 99, border: '1px solid rgba(255,255,255,0.08)', color: '#72767d', background: 'rgba(255,255,255,0.03)' }}>{t}</span>
              ))}
            </div>
          </div>
          {/* Right */}
          <div ref={heroImgRef} style={{ opacity: 0 }}>
            <AppMockup />
          </div>
        </div>
      </section>

      {/* ── MARQUEE ── */}
      <Marquee />

      {/* ── STATS ── */}
      <section style={{ padding: '64px 24px', background: 'linear-gradient(135deg,#13141f,#1a1b2e,#13141f)', borderTop: '1px solid rgba(255,255,255,0.05)', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
        <div ref={statsRef} style={{ maxWidth: 900, margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(180px,1fr))', gap: 32, textAlign: 'center' }}>
          {STATS.map((s, i) => (
            <div key={i}>
              <p style={{ fontSize: 'clamp(28px,4vw,42px)', fontWeight: 900, color: s.color, marginBottom: 6 }}>{s.val}</p>
              <p style={{ color: '#72767d', fontSize: 13 }}>{s.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── FEATURES HEADING ── */}
      <div id="features" ref={featHeadRef} style={{ opacity: 0, padding: '80px 24px 20px', textAlign: 'center', background: '#1a1b1e' }}>
        <p style={{ fontSize: 11, fontWeight: 800, color: '#7289da', textTransform: 'uppercase', letterSpacing: '0.2em', marginBottom: 16 }}>What you get</p>
        <h2 style={{ fontSize: 'clamp(28px,5vw,52px)', fontWeight: 900, lineHeight: 1.1, letterSpacing: '-0.02em', marginBottom: 16 }}>
          Everything you need,
          <br />
          <span style={{ backgroundImage: 'linear-gradient(90deg,#7289da,#a78bfa,#43b581)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
            nothing you don't.
          </span>
        </h2>
        <p style={{ color: '#8e9297', fontSize: 16, maxWidth: 520, margin: '0 auto' }}>
          Scroll down to explore each feature. No bloat — just tools that work.
        </p>
      </div>

      {/* ── FEATURE SECTIONS (one by one on scroll) ── */}
      {FEATURES.map((feat, i) => (
        <FeatureSection key={i} feat={feat} index={i} />
      ))}

      {/* ── CTA / ABOUT ── */}
      <section id="about" style={{ padding: '120px 24px', background: 'linear-gradient(160deg,#0c0d1a 0%,#1a1b2e 100%)', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', left: '50%', top: '50%', transform: 'translate(-50%,-50%)', width: 600, height: 400, background: 'radial-gradient(ellipse,rgba(114,137,218,0.18),rgba(167,139,250,0.12),transparent)', borderRadius: '50%', filter: 'blur(40px)', pointerEvents: 'none' }} />
        <div ref={ctaRef} style={{ maxWidth: 640, margin: '0 auto', textAlign: 'center', position: 'relative', opacity: 0 }}>
          <p style={{ fontSize: 11, fontWeight: 800, color: '#a78bfa', textTransform: 'uppercase', letterSpacing: '0.18em', marginBottom: 20 }}>Built for developers, designed for everyone</p>
          <h2 style={{ fontSize: 'clamp(32px,5vw,56px)', fontWeight: 900, marginBottom: 20, letterSpacing: '-0.02em', lineHeight: 1.1 }}>
            Ready to{' '}
            <span style={{ backgroundImage: 'linear-gradient(135deg,#7289da,#a78bfa)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
              MeetLite?
            </span>
          </h2>
          <p style={{ color: '#8e9297', fontSize: 16, lineHeight: 1.8, marginBottom: 40 }}>
            Create your server in seconds. Invite your crew with a link. No downloads, no installs — just real-time communication that works.
          </p>
          <div style={{ display: 'flex', gap: 16, justifyContent: 'center', flexWrap: 'wrap' }}>
            <button onClick={() => navigate('/register')}
              style={{ background: 'linear-gradient(135deg,#7289da,#a78bfa)', border: 'none', color: '#fff', padding: '16px 36px', borderRadius: 99, fontWeight: 700, fontSize: 16, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 8, boxShadow: '0 4px 32px rgba(114,137,218,0.45)' }}>
              Get Started — It's Free <ArrowRight size={18} />
            </button>
            <button onClick={() => navigate('/login')}
              style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.13)', color: '#fff', padding: '16px 36px', borderRadius: 99, fontWeight: 700, fontSize: 16, cursor: 'pointer' }}>
              Log In
            </button>
          </div>
          <p style={{ color: '#4f545c', fontSize: 12, marginTop: 36 }}>
            Open source · React · Express · Socket.IO · LiveKit · Neon PostgreSQL · Prisma
          </p>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer style={{ borderTop: '1px solid rgba(255,255,255,0.05)', padding: '28px 24px', background: '#101114' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto', display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: 16 }}>
          <div onClick={() => scrollTo('hero')} style={{ display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer' }}>
            <div style={{ width: 28, height: 28, borderRadius: 8, background: 'linear-gradient(135deg,#7289da,#a78bfa)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Zap size={14} color="#fff" /></div>
            <span style={{ fontWeight: 900, fontSize: 14 }}>Meet<span style={{ color: '#7289da' }}>Lite</span></span>
          </div>
          <p style={{ color: '#4f545c', fontSize: 12 }}>Built with ❤️ using React · Socket.IO · LiveKit · Neon PostgreSQL</p>
          <div style={{ display: 'flex', gap: 20, fontSize: 12, color: '#72767d' }}>
            {[['Features', () => scrollTo('features')], ['Log In', () => navigate('/login')], ['Sign Up', () => navigate('/register')]].map(([l, fn]) => (
              <button key={l} onClick={fn} style={{ background: 'none', border: 'none', color: '#72767d', fontSize: 12, cursor: 'pointer', transition: 'color 0.2s' }}
                onMouseEnter={e => e.target.style.color = '#fff'}
                onMouseLeave={e => e.target.style.color = '#72767d'}>{l}</button>
            ))}
          </div>
        </div>
      </footer>

      {/* Responsive & utility styles */}
      <style>{`
        @media (max-width: 768px) {
          .hidden-mobile { display: none !important; }
          .show-mobile { display: flex !important; }
        }
        @media (min-width: 769px) {
          .show-mobile { display: none !important; }
        }
        * { box-sizing: border-box; margin: 0; padding: 0; }
        html { scroll-behavior: smooth; }
        button { font-family: inherit; }
        @keyframes pulse-dot {
          0%, 100% { opacity: 0.2; transform: scale(1); }
          50% { opacity: 0.8; transform: scale(1.5); }
        }
      `}</style>
    </div>
  );
}
