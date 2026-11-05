import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { X, Hash, Volume2, Loader2, Radio } from 'lucide-react';
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
      const data = await channelService.createChannel(serverId, { name: name.trim(), type });
      addChannel(data.channel);
      toast.success(`Channel #${data.channel.name} created!`);
      setOpen(false);
      setName('');
      setType('TEXT');
      navigate(`/app/${serverId}/${data.channel.id}`);
    } catch (err) {
      toast.error(err.response?.data?.error || 'Failed to create channel.');
    } finally {
      setIsLoading(false);
    }
  };

  const channelTypes = [
    {
      value: 'TEXT',
      icon: Hash,
      label: 'Text',
      desc: 'Post messages, images, and discuss topics',
      color: 'from-[#5865f2] to-[#7c3aed]',
      ring: 'focus:ring-[#5865f2]',
      border: 'border-[#5865f2]',
      glow: 'shadow-[0_0_20px_rgba(88,101,242,0.3)]',
    },
    {
      value: 'VOICE',
      icon: Volume2,
      label: 'Voice & Video',
      desc: 'Hang out with voice, video, and screen share',
      color: 'from-[#23a55a] to-[#059669]',
      ring: 'focus:ring-[#23a55a]',
      border: 'border-[#23a55a]',
      glow: 'shadow-[0_0_20px_rgba(35,165,90,0.3)]',
    },
  ];

  const activeType = channelTypes.find((t) => t.value === type);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md select-none">
      <div className="w-full max-w-md relative bg-[#111221]/95 backdrop-blur-xl border border-white/10 rounded-2xl shadow-[0_30px_80px_-10px_rgba(0,0,0,0.9),0_0_40px_rgba(124,58,237,0.15)] overflow-hidden">

        {/* Purple glow top accent */}
        <div className="absolute top-0 inset-x-0 h-[2px] bg-gradient-to-r from-transparent via-[#5865f2] to-transparent" />

        {/* Close Button */}
        <button
          onClick={() => setOpen(false)}
          className="absolute top-4 right-4 p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer z-10"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Header */}
        <div className="pt-8 pb-5 px-7">
          <div className={`inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-gradient-to-br ${activeType.color} shadow-lg mb-4 transition-all duration-300`}>
            <activeType.icon className="w-5 h-5 text-white" />
          </div>
          <h2 className="text-2xl font-black tracking-tight text-white mb-1">Create Channel</h2>
          <p className="text-sm text-zinc-400">Choose a type and name for your new channel.</p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="px-7 space-y-5">

            {/* Channel Type Selector */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-zinc-400 mb-2">
                Channel Type
              </label>
              <div className="space-y-2">
                {channelTypes.map(({ value, icon: Icon, label, desc, border, glow }) => (
                  <div
                    key={value}
                    onClick={() => setType(value)}
                    className={`group flex items-center gap-4 p-3.5 rounded-xl cursor-pointer border transition-all duration-200 ${
                      type === value
                        ? `bg-white/8 ${border} ${glow}`
                        : 'bg-white/3 border-white/8 hover:bg-white/6 hover:border-white/15'
                    }`}
                  >
                    {/* Icon circle */}
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 transition-all ${
                      type === value
                        ? `bg-gradient-to-br ${channelTypes.find(t=>t.value===value).color} shadow-md`
                        : 'bg-white/8'
                    }`}>
                      <Icon className={`w-5 h-5 ${type === value ? 'text-white' : 'text-zinc-400'}`} />
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-bold text-white">{label}</div>
                      <div className="text-xs text-zinc-400 leading-tight mt-0.5">{desc}</div>
                    </div>

                    {/* Custom radio dot */}
                    <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 transition-all ${
                      type === value ? `${border} bg-transparent` : 'border-zinc-600'
                    }`}>
                      {type === value && (
                        <div className={`w-2.5 h-2.5 rounded-full bg-gradient-to-br ${channelTypes.find(t=>t.value===value).color}`} />
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Channel Name */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-zinc-400 mb-1.5">
                Channel Name <span className="text-rose-400">*</span>
              </label>
              <div className="relative flex items-center">
                <span className="absolute left-3.5 text-zinc-500 pointer-events-none">
                  {type === 'VOICE' ? <Volume2 className="w-4 h-4" /> : <Hash className="w-4 h-4" />}
                </span>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value.toLowerCase().replace(/\s+/g, '-'))}
                  placeholder="new-channel"
                  required
                  minLength={2}
                  maxLength={32}
                  className="w-full pl-10 pr-4 py-3 bg-[#151728] border border-white/10 rounded-xl text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-[#5865f2] focus:ring-1 focus:ring-[#5865f2] transition-all"
                />
              </div>
            </div>
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
              className={`px-6 py-2.5 bg-gradient-to-r ${activeType.color} disabled:opacity-40 active:scale-[0.98] text-white text-sm font-bold rounded-xl transition-all flex items-center gap-2 cursor-pointer shadow-md`}
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
