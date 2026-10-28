import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { X, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';
import { useUIStore } from '../../store/uiStore';
import { useServerStore } from '../../store/serverStore';
import serverService from '../../services/serverService';
import api from '../../services/api';

export default function CreateServerModal() {
  const navigate = useNavigate();
  const isOpen = useUIStore((state) => state.isCreateServerOpen);
  const setOpen = useUIStore((state) => state.setCreateServerOpen);
  const addServer = useServerStore((state) => state.addServer);

  const [mode, setMode] = useState('CREATE'); // 'CREATE' | 'JOIN'
  const [name, setName] = useState('');
  const [icon, setIcon] = useState('');
  const [inviteInput, setInviteInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  if (!isOpen) return null;

  const handleCreateSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim()) return;

    setIsLoading(true);
    try {
      const data = await serverService.createServer({
        name: name.trim(),
        icon: icon.trim() || undefined,
      });

      addServer(data.server);
      toast.success(`Server "${data.server.name}" created!`);
      setOpen(false);
      setName('');
      setIcon('');

      const defaultChannel = data.server.channels?.[0]?.id;
      if (defaultChannel) {
        navigate(`/app/${data.server.id}/${defaultChannel}`);
      } else {
        navigate(`/app/${data.server.id}`);
      }
    } catch (err) {
      const msg = err.response?.data?.error || 'Failed to create server.';
      toast.error(msg);
    } finally {
      setIsLoading(false);
    }
  };

  const handleJoinSubmit = async (e) => {
    e.preventDefault();
    if (!inviteInput.trim()) return;

    // Extract code if user pasted a full URL (e.g. http://localhost:5173/invite/xyz)
    let code = inviteInput.trim();
    if (code.includes('/invite/')) {
      code = code.split('/invite/')[1].split('/')[0].split('?')[0];
    } else if (code.includes('/')) {
      code = code.split('/').pop().split('?')[0];
    }

    if (!code) {
      toast.error('Invalid invite link or code.');
      return;
    }

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
      if (defaultChannel) {
        navigate(`/app/${server.id}/${defaultChannel}`);
      } else {
        navigate(`/app/${server.id}`);
      }
    } catch (err) {
      const msg = err.response?.data?.message || err.response?.data?.error || 'Failed to join server with this invite.';
      toast.error(msg);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm select-none">
      <div className="w-full max-w-md bg-[#313338] text-[#f2f3f5] rounded-xl shadow-2xl overflow-hidden animate-fade-in border border-[#1e1f22]">
        {/* Header */}
        <div className="p-6 text-center relative">
          <button
            onClick={() => {
              setOpen(false);
              setMode('CREATE');
            }}
            className="absolute top-4 right-4 text-[#80848e] hover:text-white transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
          <h2 className="text-2xl font-bold text-white mb-2">
            {mode === 'CREATE' ? 'Customize your server' : 'Join a Server'}
          </h2>
          <p className="text-sm text-[#b5bac1]">
            {mode === 'CREATE'
              ? 'Give your new server a personality with a name and an icon. You can always change it later.'
              : 'Enter an invite link or invite code to join an existing server.'}
          </p>
        </div>

        {/* Mode: CREATE */}
        {mode === 'CREATE' ? (
          <form onSubmit={handleCreateSubmit}>
            <div className="px-6 space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#b5bac1] mb-2">
                  Server Name <span className="text-[#f23f42]">*</span>
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="My awesome server"
                  required
                  minLength={2}
                  maxLength={100}
                  className="w-full px-3 py-2.5 bg-[#1e1f22] border border-[#1e1f22] rounded text-sm text-white placeholder-[#80848e] focus:outline-none focus:ring-2 focus:ring-[#5865f2] transition-colors"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#b5bac1] mb-2">
                  Server Icon URL (Optional)
                </label>
                <input
                  type="url"
                  value={icon}
                  onChange={(e) => setIcon(e.target.value)}
                  placeholder="https://example.com/icon.png"
                  className="w-full px-3 py-2.5 bg-[#1e1f22] border border-[#1e1f22] rounded text-sm text-white placeholder-[#80848e] focus:outline-none focus:ring-2 focus:ring-[#5865f2] transition-colors"
                />
              </div>

              <div className="pt-2 text-xs text-[#b5bac1]">
                Have an invite already?{' '}
                <button
                  type="button"
                  onClick={() => setMode('JOIN')}
                  className="text-[#00a8fc] hover:underline font-semibold cursor-pointer"
                >
                  Join a Server
                </button>
              </div>
            </div>

            {/* Footer */}
            <div className="mt-6 bg-[#2b2d31] px-6 py-4 flex items-center justify-between">
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="text-sm font-medium text-white hover:underline cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isLoading || !name.trim()}
                className="px-6 py-2.5 bg-[#5865f2] hover:bg-[#4752c4] disabled:opacity-50 text-white text-sm font-medium rounded transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-md"
              >
                {isLoading && <Loader2 className="w-4 h-4 animate-spin" />}
                Create Server
              </button>
            </div>
          </form>
        ) : (
          /* Mode: JOIN */
          <form onSubmit={handleJoinSubmit}>
            <div className="px-6 space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#b5bac1] mb-2">
                  Invite Link or Code <span className="text-[#f23f42]">*</span>
                </label>
                <input
                  type="text"
                  value={inviteInput}
                  onChange={(e) => setInviteInput(e.target.value)}
                  placeholder="http://localhost:5173/invite/abc12345 or abc12345"
                  required
                  className="w-full px-3 py-2.5 bg-[#1e1f22] border border-[#1e1f22] rounded text-sm text-white placeholder-[#80848e] focus:outline-none focus:ring-2 focus:ring-[#5865f2] transition-colors"
                />
              </div>

              <div className="text-[11px] text-[#80848e] leading-relaxed">
                Invites should look like <span className="text-[#dbdee1]">http://localhost:5173/invite/code</span> or just the <span className="text-[#dbdee1]">8-character code</span>.
              </div>
            </div>

            {/* Footer */}
            <div className="mt-6 bg-[#2b2d31] px-6 py-4 flex items-center justify-between">
              <button
                type="button"
                onClick={() => setMode('CREATE')}
                className="text-sm font-medium text-white hover:underline cursor-pointer"
              >
                Back
              </button>
              <button
                type="submit"
                disabled={isLoading || !inviteInput.trim()}
                className="px-6 py-2.5 bg-[#5865f2] hover:bg-[#4752c4] disabled:opacity-50 text-white text-sm font-medium rounded transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-md"
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
