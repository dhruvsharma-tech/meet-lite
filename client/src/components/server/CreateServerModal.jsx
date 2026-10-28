import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { X, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';
import { useUIStore } from '../../store/uiStore';
import { useServerStore } from '../../store/serverStore';
import serverService from '../../services/serverService';

export default function CreateServerModal() {
  const navigate = useNavigate();
  const isOpen = useUIStore((state) => state.isCreateServerOpen);
  const setOpen = useUIStore((state) => state.setCreateServerOpen);
  const addServer = useServerStore((state) => state.addServer);

  const [name, setName] = useState('');
  const [icon, setIcon] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
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

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs select-none">
      <div className="w-full max-w-md bg-[#313338] text-[#f2f3f5] rounded-xl shadow-2xl overflow-hidden animate-fade-in border border-[#1e1f22]">
        {/* Header */}
        <div className="p-6 text-center relative">
          <button
            onClick={() => setOpen(false)}
            className="absolute top-4 right-4 text-[#80848e] hover:text-white transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
          <h2 className="text-2xl font-bold text-white mb-2">Customize your server</h2>
          <p className="text-sm text-[#b5bac1]">
            Give your new server a personality with a name and an icon. You can always change it later.
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit}>
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
          </div>

          {/* Footer */}
          <div className="mt-8 bg-[#2b2d31] px-6 py-4 flex items-center justify-between">
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="text-sm font-medium text-white hover:underline cursor-pointer"
            >
              Back
            </button>
            <button
              type="submit"
              disabled={isLoading || !name.trim()}
              className="px-6 py-2.5 bg-[#5865f2] hover:bg-[#4752c4] disabled:opacity-50 text-white text-sm font-medium rounded transition-colors flex items-center justify-center gap-2 cursor-pointer"
            >
              {isLoading && <Loader2 className="w-4 h-4 animate-spin" />}
              Create Server
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

