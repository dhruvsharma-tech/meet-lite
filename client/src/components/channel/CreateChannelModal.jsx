import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { X, Hash, Volume2, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';
import { useUIStore } from '../../store/uiStore';
import { useServerStore } from '../../store/serverStore';
import channelService from '../../services/channelService';

export default function CreateChannelModal() {
  const navigate = useNavigate();
  const { serverId } = useParams();
  const isOpen = useUIStore((state) => state.isCreateChannelOpen);
  const setOpen = useUIStore((state) => state.setCreateChannelOpen);
  const addChannel = useServerStore((state) => state.addChannel);

  const [name, setName] = useState('');
  const [type, setType] = useState('TEXT');
  const [isLoading, setIsLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim() || !serverId) return;

    setIsLoading(true);
    try {
      const data = await channelService.createChannel(serverId, {
        name: name.trim(),
        type,
      });

      addChannel(data.channel);
      toast.success(`Channel #${data.channel.name} created!`);
      setOpen(false);
      setName('');
      setType('TEXT');
      navigate(`/app/${serverId}/${data.channel.id}`);
    } catch (err) {
      const msg = err.response?.data?.error || 'Failed to create channel.';
      toast.error(msg);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs select-none">
      <div className="w-full max-w-md bg-[#313338] text-[#f2f3f5] rounded-xl shadow-2xl overflow-hidden animate-fade-in border border-[#1e1f22]">
        {/* Header */}
        <div className="p-6 relative">
          <button
            onClick={() => setOpen(false)}
            className="absolute top-4 right-4 text-[#80848e] hover:text-white transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
          <h2 className="text-xl font-bold text-white mb-1">Create Channel</h2>
          <p className="text-xs text-[#b5bac1]">in Text & Voice Channels</p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit}>
          <div className="px-6 space-y-4">
            {/* Channel Type Selector */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#b5bac1] mb-2">
                Channel Type
              </label>
              <div className="space-y-2">
                {/* TEXT option */}
                <div
                  onClick={() => setType('TEXT')}
                  className={`p-3 rounded-lg flex items-center gap-3 cursor-pointer transition-colors border ${
                    type === 'TEXT'
                      ? 'bg-[#35373c] border-[#5865f2]'
                      : 'bg-[#2b2d31] border-transparent hover:bg-[#35373c]/50'
                  }`}
                >
                  <Hash className="w-6 h-6 text-[#80848e]" />
                  <div className="flex-1">
                    <div className="text-sm font-semibold text-white">Text</div>
                    <div className="text-xs text-[#b5bac1]">
                      Post messages, images, and discuss topics
                    </div>
                  </div>
                  <input
                    type="radio"
                    name="channelType"
                    checked={type === 'TEXT'}
                    onChange={() => setType('TEXT')}
                    className="accent-[#5865f2] cursor-pointer"
                  />
                </div>

                {/* VOICE option */}
                <div
                  onClick={() => setType('VOICE')}
                  className={`p-3 rounded-lg flex items-center gap-3 cursor-pointer transition-colors border ${
                    type === 'VOICE'
                      ? 'bg-[#35373c] border-[#5865f2]'
                      : 'bg-[#2b2d31] border-transparent hover:bg-[#35373c]/50'
                  }`}
                >
                  <Volume2 className="w-6 h-6 text-[#80848e]" />
                  <div className="flex-1">
                    <div className="text-sm font-semibold text-white">Voice & Video</div>
                    <div className="text-xs text-[#b5bac1]">
                      Hang out with voice, video, and screen share
                    </div>
                  </div>
                  <input
                    type="radio"
                    name="channelType"
                    checked={type === 'VOICE'}
                    onChange={() => setType('VOICE')}
                    className="accent-[#5865f2] cursor-pointer"
                  />
                </div>
              </div>
            </div>

            {/* Channel Name */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#b5bac1] mb-2">
                Channel Name <span className="text-[#f23f42]">*</span>
              </label>
              <div className="relative flex items-center">
                <span className="absolute left-3 text-[#80848e]">
                  {type === 'VOICE' ? <Volume2 className="w-4 h-4" /> : '#'}
                </span>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="new-channel"
                  required
                  minLength={2}
                  maxLength={32}
                  className="w-full pl-8 pr-3 py-2.5 bg-[#1e1f22] border border-[#1e1f22] rounded text-sm text-white placeholder-[#80848e] focus:outline-none focus:ring-2 focus:ring-[#5865f2] transition-colors"
                />
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="mt-8 bg-[#2b2d31] px-6 py-4 flex items-center justify-between">
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
              className="px-6 py-2.5 bg-[#5865f2] hover:bg-[#4752c4] disabled:opacity-50 text-white text-sm font-medium rounded transition-colors flex items-center justify-center gap-2 cursor-pointer"
            >
              {isLoading && <Loader2 className="w-4 h-4 animate-spin" />}
              Create Channel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
