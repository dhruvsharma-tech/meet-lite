import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Volume2, MessageSquare, Plus, Compass } from 'lucide-react';
import toast from 'react-hot-toast';
import { useServerStore } from '../store/serverStore';
import { useUIStore } from '../store/uiStore';
import serverService from '../services/serverService';
import ServerList from '../components/server/ServerList';
import ChannelSidebar from '../components/channel/ChannelSidebar';
import CreateServerModal from '../components/server/CreateServerModal';
import CreateChannelModal from '../components/channel/CreateChannelModal';
import ChatPanel from '../components/chat/ChatPanel';
import MemberList from '../components/channel/MemberList';
import VoiceRoom from '../components/voice/VoiceRoom';

export default function AppPage() {
  const { serverId, channelId } = useParams();
  const navigate = useNavigate();

  const servers = useServerStore((state) => state.servers);
  const setServers = useServerStore((state) => state.setServers);
  const currentServer = useServerStore((state) => state.currentServer);
  const setCurrentServer = useServerStore((state) => state.setCurrentServer);
  const channels = useServerStore((state) => state.channels);

  const setCreateServerOpen = useUIStore((state) => state.setCreateServerOpen);
  const isMemberListOpen = useUIStore((state) => state.isMemberListOpen);

  const [isLoading, setIsLoading] = useState(false);

  // 1. Load user servers on mount
  useEffect(() => {
    async function loadServers() {
      try {
        const data = await serverService.getServers();
        setServers(data.servers || []);
      } catch (err) {
        console.error('Failed to load servers:', err);
      }
    }
    loadServers();
  }, [setServers]);

  // 2. Load active server details when serverId changes
  useEffect(() => {
    if (!serverId) {
      setCurrentServer(null);
      return;
    }

    async function loadServerDetails() {
      setIsLoading(true);
      try {
        const data = await serverService.getServer(serverId);
        setCurrentServer(data.server);

        // If no channelId in URL and server has channels, default to first channel
        if (!channelId && data.server.channels?.length > 0) {
          navigate(`/app/${serverId}/${data.server.channels[0].id}`, { replace: true });
        }
      } catch (err) {
        console.error('Failed to load server details:', err);
        toast.error(err.response?.data?.message || 'Failed to load server');
        navigate('/app', { replace: true });
      } finally {
        setIsLoading(false);
      }
    }

    loadServerDetails();
  }, [serverId, setCurrentServer, navigate]);

  // Find active channel
  const activeChannel = channels.find((c) => c.id === channelId);

  return (
    <div className="flex h-screen w-full bg-[#313338] text-[#f2f3f5] overflow-hidden select-none font-sans">
      {/* Panel 1: Server List (72px) */}
      <ServerList />

      {/* Panel 2: Channel Sidebar (240px, visible if server selected) */}
      {serverId && <ChannelSidebar />}

      {/* Panel 3: Main Content Viewport */}
      <main className="flex-1 flex flex-col bg-[#313338] overflow-hidden relative">
        {/* State A: No Server Selected */}
        {!serverId ? (
          <div className="flex-1 flex flex-col items-center justify-center p-6 text-center">
            <div className="w-20 h-20 rounded-full bg-[#5865f2]/20 text-[#5865f2] flex items-center justify-center mb-4">
              <Compass className="w-10 h-10" />
            </div>
            <h2 className="text-2xl font-bold text-white mb-2">Welcome to Discord Clone!</h2>
            <p className="text-sm text-[#b5bac1] max-w-md mb-6">
              Create a server to hang out with friends, or join one from an invite link.
            </p>
            <button
              onClick={() => setCreateServerOpen(true)}
              className="px-6 py-2.5 bg-[#5865f2] hover:bg-[#4752c4] text-white text-sm font-medium rounded transition-colors flex items-center gap-2 cursor-pointer shadow-md"
            >
              <Plus className="w-4 h-4" />
              Create a Server
            </button>
          </div>
        ) : !activeChannel ? (
          /* State B: Server Selected but No Channel Selected */
          <div className="flex-1 flex flex-col items-center justify-center p-6 text-center">
            <div className="w-16 h-16 rounded-full bg-[#2b2d31] text-[#80848e] flex items-center justify-center mb-4">
              <MessageSquare className="w-8 h-8" />
            </div>
            <h3 className="text-lg font-bold text-white mb-1">No Channel Selected</h3>
            <p className="text-xs text-[#b5bac1] max-w-sm">
              Pick a text or voice channel from the sidebar on the left to start chatting!
            </p>
          </div>
        ) : activeChannel.type === 'TEXT' ? (
          /* State C: TEXT Channel -> ChatPanel + MemberList */
          <>
            <ChatPanel
              key={activeChannel.id}
              channelId={activeChannel.id}
              channelName={activeChannel.name}
            />
            <MemberList serverId={serverId} />
          </>
        ) : (
          /* State D: VOICE Channel -> VoiceRoom LiveKit */
          <VoiceRoom
            key={activeChannel.id}
            channelId={activeChannel.id}
            channelName={activeChannel.name}
            serverId={serverId}
          />
        )}
      </main>

      {/* Global Modals */}
      <CreateServerModal />
      <CreateChannelModal />
    </div>
  );
}
