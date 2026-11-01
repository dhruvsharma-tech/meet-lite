import { useState, useEffect, useRef } from 'react';
import { X, Copy, Check, Loader2, Link2, Sparkles } from 'lucide-react';
import toast from 'react-hot-toast';
import { useUIStore } from '../../store/uiStore';
import { useServerStore } from '../../store/serverStore';
import api from '../../services/api';

async function copyText(text) {
  try {
    if (navigator?.clipboard?.writeText) {
      await navigator.clipboard.writeText(text);
      return true;
    }
  } catch {
    // fallback below
  }

  try {
    const textarea = document.createElement('textarea');
    textarea.value = text;
    textarea.style.position = 'fixed';
    textarea.style.left = '-9999px';
    textarea.style.top = '-9999px';
    document.body.appendChild(textarea);
    textarea.focus();
    textarea.select();
    const ok = document.execCommand('copy');
    document.body.removeChild(textarea);
    return ok;
  } catch {
    return false;
  }
}

export default function InviteModal() {
  const isOpen = useUIStore((state) => state.isInviteModalOpen);
  const setOpen = useUIStore((state) => state.setInviteModalOpen);
  const currentServer = useServerStore((state) => state.currentServer);

  const [inviteUrl, setInviteUrl] = useState('');
  const [inviteCode, setInviteCode] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  const inputRef = useRef(null);

  useEffect(() => {
    if (!isOpen || !currentServer?.id) {
      return;
    }

    let isMounted = true;
    setIsLoading(true);
    setCopied(false);

    async function fetchOrGenerateInvite() {
      try {
        const res = await api.post(`/api/servers/${currentServer.id}/invites`);
        if (!isMounted) return;

        const code = res.data.code;
        const fullUrl = `${window.location.origin}/invite/${code}`;
        setInviteCode(code);
        setInviteUrl(fullUrl);
      } catch {
        if (!isMounted) return;
        toast.error('Failed to generate invite link');
      } finally {
        if (isMounted) setIsLoading(false);
      }
    }

    fetchOrGenerateInvite();

    return () => {
      isMounted = false;
    };
  }, [isOpen, currentServer?.id]);

  if (!isOpen || !currentServer) return null;

  const handleCopy = async () => {
    if (!inviteUrl) return;

    const ok = await copyText(inviteUrl);
    if (ok) {
      setCopied(true);
      toast.success('Invite link copied to clipboard!');
      setTimeout(() => setCopied(false), 2500);
    } else {
      // If clipboard write failed, select text so user can press Ctrl+C
      inputRef.current?.select();
      toast('Press Ctrl+C to copy the link', { icon: '📋' });
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm select-none">
      <div className="w-full max-w-md bg-[#313338] text-[#f2f3f5] rounded-xl shadow-2xl overflow-hidden animate-fade-in border border-[#1e1f22]">
        {/* Header */}
        <div className="p-6 pb-2 relative text-left">
          <button
            onClick={() => setOpen(false)}
            className="absolute top-5 right-5 text-[#80848e] hover:text-white transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
          <div className="flex items-center gap-2 mb-1">
            <Sparkles className="w-5 h-5 text-[#5865f2]" />
            <h2 className="text-lg font-bold text-white">
              Invite friends to {currentServer.name}
            </h2>
          </div>
          <p className="text-xs text-[#b5bac1]">
            Share this link with others to grant them instant access to this server.
          </p>
        </div>

        {/* Content Body */}
        <div className="p-6 pt-3 space-y-4">
          <div>
            <label className="block text-[11px] font-bold uppercase tracking-wider text-[#b5bac1] mb-2">
              Server Invite Link
            </label>

            {isLoading ? (
              <div className="h-11 bg-[#1e1f22] rounded-lg border border-[#1e1f22] flex items-center justify-center text-xs text-[#80848e] gap-2">
                <Loader2 className="w-4 h-4 animate-spin text-[#5865f2]" />
                Generating unique invite link...
              </div>
            ) : (
              <div className="flex items-center bg-[#1e1f22] rounded-lg p-1.5 border border-[#1e1f22] focus-within:border-[#5865f2] transition-colors">
                <div className="pl-2 pr-1 text-[#80848e]">
                  <Link2 className="w-4 h-4" />
                </div>
                <input
                  ref={inputRef}
                  type="text"
                  readOnly
                  value={inviteUrl}
                  onClick={(e) => e.target.select()}
                  className="flex-1 bg-transparent border-none text-white text-xs outline-none px-2 select-all font-mono"
                />
                <button
                  onClick={handleCopy}
                  className={`px-4 py-2 rounded-md text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer shadow-sm ${
                    copied
                      ? 'bg-[#23a55a] text-white hover:bg-[#1f9250]'
                      : 'bg-[#5865f2] hover:bg-[#4752c4] text-white'
                  }`}
                >
                  {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copied ? 'Copied' : 'Copy'}</span>
                </button>
              </div>
            )}
          </div>

          {inviteCode && (
            <div className="bg-[#2b2d31] p-3 rounded-lg border border-[#1f2023] flex items-center justify-between text-xs">
              <span className="text-[#949ba4]">Or share 8-character invite code:</span>
              <span className="font-mono font-bold text-white bg-[#1e1f22] px-2.5 py-1 rounded select-all border border-[#1f2023]">
                {inviteCode}
              </span>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="bg-[#2b2d31] px-6 py-3.5 flex items-center justify-end border-t border-[#1f2023]">
          <button
            onClick={() => setOpen(false)}
            className="px-5 py-2 bg-[#35373c] hover:bg-[#3f4147] text-white text-xs font-semibold rounded-md transition-colors cursor-pointer"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
}

