import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { X, Loader2, Server, Link as LinkIcon, Hash, Image } from 'lucide-react';
import toast from 'react-hot-toast';
import { useUIStore } from '../../store/uiStore';
import { useServerStore } from '../../store/serverStore';
import serverService from '../../services/serverService';
import api from '../../services/api';

export default function CreateServerModal() {
  const navigate = useNavigate();
  const isOpen = useUIStore((state) => state.isCreateServerOpen);
  const setOpen = useUIStore((state) => state.setCreateServerOpen);
  const createServerMode = useUIStore((state) => state.createServerMode);
  const addServer = useServerStore((state) => state.addServer);

  const [mode, setMode] = useState(createServerMode || 'CREATE');
  const [name, setName] = useState('');
  const [icon, setIcon] = useState('');
  const [inviteInput, setInviteInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setMode(createServerMode || 'CREATE');
    }
  }, [isOpen, createServerMode]);

  if (!isOpen) return null;

  const handleCreateSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim()) return;
    setIsLoading(true);
    try {
      const data = await serverService.createServer({ name: name.trim(), icon: icon.trim() || undefined });
      addServer(data.server);
      toast.success(`Server "${data.server.name}" created!`);
      setOpen(false);
      setName('');
      setIcon('');
      const defaultChannel = data.server.channels?.[0]?.id;
      navigate(defaultChannel ? `/app/${data.server.id}/${defaultChannel}` : `/app/${data.server.id}`);
    } catch (err) {
      toast.error(err.response?.data?.error || 'Failed to create server.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleJoinSubmit = async (e) => {
    e.preventDefault();
    if (!inviteInput.trim()) return;
    let code = inviteInput.trim();
    if (code.includes('/invite/')) code = code.split('/invite/')[1].split('/')[0].split('?')[0];
    else if (code.includes('/')) code = code.split('/').pop().split('?')[0];
    if (!code) { toast.error('Invalid invite link or code.'); return; }
    setIsLoading(true);
    try {
      const res = await api.post(`/api/invites/${code}/join`);
      const server = res.data.server;
      addServer(server);
      toast.success(`Joined ${server.name}!`);
      setOpen(false);
      setInviteInput('');
      setMode('CREATE');
      const defaultChannel = server.channels?.[0]?.id;
      navigate(defaultChannel ? `/app/${server.id}/${defaultChannel}` : `/app/${server.id}`);
    } catch (err) {
      toast.error(err.response?.data?.message || err.response?.data?.error || 'Failed to join server.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md select-none">
      <div className="w-full max-w-md relative bg-[#111221]/95 backdrop-blur-xl border border-white/10 rounded-2xl shadow-[0_30px_80px_-10px_rgba(0,0,0,0.9),0_0_40px_rgba(124,58,237,0.15)] overflow-hidden">

        {/* Purple glow top accent */}
        <div className="absolute top-0 inset-x-0 h-[2px] bg-gradient-to-r from-transparent via-[#7c3aed] to-transparent" />

        {/* Close Button */}
        <button
          onClick={() => { setOpen(false); setMode('CREATE'); }}
          className="absolute top-4 right-4 p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer z-10"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Header */}
        <div className="pt-8 pb-4 px-7 text-center">
          {/* Icon badge */}
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-gradient-to-br from-[#7c3aed] to-[#5865f2] shadow-[0_0_24px_rgba(124,58,237,0.5)] mb-4">
            <Server className="w-5 h-5 text-white" />
          </div>
          <h2 className="text-2xl font-black tracking-tight text-white mb-1">
            {mode === 'CREATE' ? 'Create a Server' : 'Join a Server'}
          </h2>
          <p className="text-sm text-zinc-400">
            {mode === 'CREATE'
              ? 'Give your new server a name and optional icon.'
              : 'Enter an invite link or 8-character code.'}
          </p>
        </div>

        {/* Mode Switcher Tabs */}
        <div className="mx-7 mb-6 flex gap-1 p-1 bg-white/5 rounded-xl border border-white/8">
          <button
            type="button"
            onClick={() => setMode('CREATE')}
            className={`flex-1 py-2 px-3 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              mode === 'CREATE'
                ? 'bg-gradient-to-r from-[#7c3aed] to-[#5865f2] text-white shadow-md'
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            Create Server
          </button>
          <button
            type="button"
            onClick={() => setMode('JOIN')}
            className={`flex-1 py-2 px-3 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              mode === 'JOIN'
                ? 'bg-gradient-to-r from-[#23a55a] to-[#1f9250] text-white shadow-md'
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            Join with Invite
          </button>
        </div>

        {/* ── CREATE MODE ── */}
        {mode === 'CREATE' ? (
          <form onSubmit={handleCreateSubmit}>
            <div className="px-7 space-y-4">
              {/* Server Name */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-zinc-400 mb-1.5">
                  Server Name <span className="text-rose-400">*</span>
                </label>
                <div className="relative flex items-center">
                  <Hash className="absolute left-3.5 w-4 h-4 text-zinc-500 pointer-events-none" />
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="My awesome server"
                    required
                    minLength={2}
                    maxLength={100}
                    className="w-full pl-10 pr-4 py-3 bg-[#151728] border border-white/10 rounded-xl text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-[#7c3aed] focus:ring-1 focus:ring-[#7c3aed] transition-all"
                  />
                </div>
              </div>

              {/* Server Icon */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-zinc-400 mb-1.5">
                  Server Icon URL <span className="text-zinc-500 normal-case font-normal">(optional)</span>
                </label>
                <div className="relative flex items-center">
                  <Image className="absolute left-3.5 w-4 h-4 text-zinc-500 pointer-events-none" />
                  <input
                    type="url"
                    value={icon}
                    onChange={(e) => setIcon(e.target.value)}
                    placeholder="https://example.com/icon.png"
                    className="w-full pl-10 pr-4 py-3 bg-[#151728] border border-white/10 rounded-xl text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-[#7c3aed] focus:ring-1 focus:ring-[#7c3aed] transition-all"
                  />
                </div>
              </div>

              {/* Switch hint */}
              <p className="text-xs text-zinc-500">
                Have an invite already?{' '}
                <button
                  type="button"
                  onClick={() => setMode('JOIN')}
                  className="text-[#a78bfa] hover:text-white font-semibold hover:underline cursor-pointer transition-colors"
                >
                  Join a Server
                </button>
              </p>
            </div>

            {/* Footer */}
            <div className="mt-6 px-7 pb-7 flex items-center justify-between gap-3">
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="px-5 py-2.5 text-sm font-semibold text-zinc-400 hover:text-white bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl transition-all cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isLoading || !name.trim()}
                className="px-6 py-2.5 bg-gradient-to-r from-[#7c3aed] to-[#5865f2] hover:from-[#6d28d9] hover:to-[#4752c4] disabled:opacity-40 active:scale-[0.98] text-white text-sm font-bold rounded-xl transition-all flex items-center gap-2 cursor-pointer shadow-[0_4px_15px_rgba(124,58,237,0.4)]"
              >
                {isLoading && <Loader2 className="w-4 h-4 animate-spin" />}
                Create Server
              </button>
            </div>
          </form>
        ) : (
          /* ── JOIN MODE ── */
          <form onSubmit={handleJoinSubmit}>
            <div className="px-7 space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-zinc-400 mb-1.5">
                  Invite Link or Code <span className="text-rose-400">*</span>
                </label>
                <div className="relative flex items-center">
                  <LinkIcon className="absolute left-3.5 w-4 h-4 text-zinc-500 pointer-events-none" />
                  <input
                    type="text"
                    value={inviteInput}
                    onChange={(e) => setInviteInput(e.target.value)}
                    placeholder="https://meet-lite.app/invite/abc12345"
                    required
                    className="w-full pl-10 pr-4 py-3 bg-[#151728] border border-white/10 rounded-xl text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-[#23a55a] focus:ring-1 focus:ring-[#23a55a] transition-all"
                  />
                </div>
                <p className="mt-2 text-[11px] text-zinc-500 leading-relaxed">
                  Paste a full invite URL or just the{' '}
                  <span className="text-zinc-300">8-character code</span> from a friend.
                </p>
              </div>
            </div>

            {/* Footer */}
            <div className="mt-6 px-7 pb-7 flex items-center justify-between gap-3">
              <button
                type="button"
                onClick={() => setMode('CREATE')}
                className="px-5 py-2.5 text-sm font-semibold text-zinc-400 hover:text-white bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl transition-all cursor-pointer"
              >
                Back
              </button>
              <button
                type="submit"
                disabled={isLoading || !inviteInput.trim()}
                className="px-6 py-2.5 bg-gradient-to-r from-[#23a55a] to-[#1f9250] hover:from-[#1f9250] hover:to-[#166534] disabled:opacity-40 active:scale-[0.98] text-white text-sm font-bold rounded-xl transition-all flex items-center gap-2 cursor-pointer shadow-[0_4px_15px_rgba(35,165,90,0.4)]"
              >
                {isLoading && <Loader2 className="w-4 h-4 animate-spin" />}
                Join Server
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
