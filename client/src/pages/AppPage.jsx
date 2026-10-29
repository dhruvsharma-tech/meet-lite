import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Volume2, MessageSquare, Plus, Compass, Link as LinkIcon } from 'lucide-react';
import toast from 'react-hot-toast';
import { useServerStore } from '../store/serverStore';
import { useUIStore } from '../store/uiStore';
import serverService from '../services/serverService';
import ServerList from '../components/server/ServerList';
import ChannelSidebar from '../components/channel/ChannelSidebar';
import CreateServerModal from '../components/server/CreateServerModal';
import CreateChannelModal from '../components/channel/CreateChannelModal';
import InviteModal from '../components/server/InviteModal';
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

  const openCreateServer = useUIStore((state) => state.openCreateServer);
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
          <div className="flex-1 flex flex-col items-center justify-center p-6 text-center overflow-y-auto">
            <div className="w-16 h-16 rounded-3xl bg-[#5865f2]/20 text-[#5865f2] flex items-center justify-center mb-4 shadow-inner">
              <Compass className="w-9 h-9" />
            </div>
            <h2 className="text-3xl font-extrabold text-white mb-2 tracking-tight">Welcome to Meet-Lite!</h2>
            <p className="text-sm text-[#b5bac1] max-w-md mb-8 leading-relaxed">
              Your space to talk, stream, and hang out with friends. Choose how you want to get started:
            </p>

            {/* Two Onboarding Action Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-2xl w-full text-left">
              {/* Card 1: Create My Own Server */}
              <div
                onClick={() => openCreateServer('CREATE')}
                className="group p-6 bg-[#2b2d31] hover:bg-[#35373c] border border-[#1f2023] hover:border-[#5865f2]/50 rounded-2xl transition-all duration-200 cursor-pointer shadow-lg hover:shadow-xl flex flex-col justify-between"
              >
                <div>
                  <div className="w-12 h-12 rounded-2xl bg-[#5865f2]/20 group-hover:bg-[#5865f2] text-[#5865f2] group-hover:text-white flex items-center justify-center mb-4 transition-colors">
                    <Plus className="w-6 h-6" />
                  </div>
                  <h3 className="text-lg font-bold text-white mb-1.5 flex items-center gap-2">
                    Create My Own Server
                    <span className="text-[11px] font-semibold text-[#5865f2] bg-[#5865f2]/10 px-2 py-0.5 rounded-full">Owner</span>
                  </h3>
                  <p className="text-xs text-[#949ba4] leading-relaxed mb-6">
                    Start your own custom space for friends, study groups, or communities. You have full control over channels and roles.
                  </p>
                </div>
                <button
                  type="button"
                  className="w-full py-2.5 px-4 bg-[#5865f2] hover:bg-[#4752c4] text-white text-xs font-semibold rounded-lg transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-md"
                >
                  <Plus className="w-4 h-4" />
                  Create a Server
                </button>
              </div>

              {/* Card 2: Join a Server */}
              <div
                onClick={() => openCreateServer('JOIN')}
                className="group p-6 bg-[#2b2d31] hover:bg-[#35373c] border border-[#1f2023] hover:border-[#23a55a]/50 rounded-2xl transition-all duration-200 cursor-pointer shadow-lg hover:shadow-xl flex flex-col justify-between"
              >
                <div>
                  <div className="w-12 h-12 rounded-2xl bg-[#23a55a]/20 group-hover:bg-[#23a55a] text-[#23a55a] group-hover:text-white flex items-center justify-center mb-4 transition-colors">
                    <LinkIcon className="w-6 h-6" />
                  </div>
                  <h3 className="text-lg font-bold text-white mb-1.5 flex items-center gap-2">
                    Join an Existing Server
                    <span className="text-[11px] font-semibold text-[#23a55a] bg-[#23a55a]/10 px-2 py-0.5 rounded-full">Invite</span>
                  </h3>
                  <p className="text-xs text-[#949ba4] leading-relaxed mb-6">
                    Have an invite link or an 8-character code from a friend? Enter it here to immediately join their channels and calls.
                  </p>
                </div>
                <button
                  type="button"
                  className="w-full py-2.5 px-4 bg-[#23a55a] hover:bg-[#1f9250] text-white text-xs font-semibold rounded-lg transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-md"
                >
                  <LinkIcon className="w-4 h-4" />
                  Join with Invite
                </button>
              </div>
            </div>
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
      <InviteModal />
    </div>
  );
}
