import { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { MessageSquare, Plus, Compass, Link as LinkIcon, Menu } from 'lucide-react';
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

  const setServers = useServerStore((state) => state.setServers);
  const setCurrentServer = useServerStore((state) => state.setCurrentServer);
  const channels = useServerStore((state) => state.channels);

  const openCreateServer = useUIStore((state) => state.openCreateServer);
  const isMobileNavOpen = useUIStore((state) => state.isMobileNavOpen);
  const setMobileNavOpen = useUIStore((state) => state.setMobileNavOpen);

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
      }
    }

    loadServerDetails();
  }, [serverId, channelId, setCurrentServer, navigate]);

  // Find active channel
  const activeChannel = channels.find((c) => c.id === channelId);

  return (
    <div className="flex h-screen w-full bg-[#090a14] text-[#f2f3f5] overflow-hidden select-none font-sans relative">
      {/* Mobile Drawer Backdrop Overlay */}
      {isMobileNavOpen && (
        <div
          className="fixed inset-0 bg-black/70 z-40 backdrop-blur-xs md:hidden transition-opacity"
          onClick={() => setMobileNavOpen(false)}
        />
      )}

      {/* Navigation Sidebars: Static on desktop (md+), Off-canvas Sliding Drawer on mobile */}
      <div
        className={`fixed inset-y-0 left-0 z-50 flex h-full transition-transform duration-300 ease-in-out md:static md:translate-x-0 ${
          isMobileNavOpen ? 'translate-x-0 shadow-2xl' : '-translate-x-full'
        }`}
      >
        {/* Panel 1: Server List (72px) */}
        <ServerList />

        {/* Panel 2: Channel Sidebar (240px, visible if server selected) */}
        {serverId && <ChannelSidebar />}
      </div>

      {/* Panel 3: Main Content Viewport */}
      <main className="flex-1 flex flex-col bg-[#0c0e1a] overflow-hidden relative app-cosmic-bg w-full">
        {/* State A: No Server Selected */}
        {!serverId ? (
          <div className="flex-1 flex flex-col items-center justify-center p-4 sm:p-6 text-center overflow-y-auto app-cosmic-bg relative z-10">
            {/* Mobile Open Drawer Button */}
            <div className="absolute top-3 left-3 md:hidden">
              <button
                onClick={() => setMobileNavOpen(true)}
                className="px-3 py-1.5 rounded-xl bg-[#15172b] border border-white/10 text-white hover:bg-white/10 flex items-center gap-2 text-xs font-semibold shadow-md cursor-pointer"
              >
                <Menu className="w-4 h-4 text-[#5865f2]" />
                <span>Servers</span>
              </button>
            </div>

            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#5865f2]/15 border border-[#5865f2]/30 text-xs font-semibold text-[#a78bfa] mb-4 shadow-[0_0_15px_rgba(88,101,242,0.2)] mt-8 sm:mt-0">
              ✦ Welcome to Your Space
            </span>
            <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-3xl bg-[#5865f2]/20 text-[#5865f2] flex items-center justify-center mb-4 shadow-[0_0_30px_rgba(88,101,242,0.25)] border border-[#5865f2]/30">
              <Compass className="w-8 h-8 sm:w-9 sm:h-9" />
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white mb-2 tracking-tight">Welcome to Meet-Lite!</h2>
            <p className="text-xs sm:text-sm text-[#949ba4] max-w-md mb-6 sm:mb-8 leading-relaxed px-2">
              Your space to talk, stream, and hang out with friends. Choose how you want to get started:
            </p>

            {/* Two Onboarding Action Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-2xl w-full text-left px-2">
              {/* Card 1: Create My Own Server */}
              <div
                onClick={() => openCreateServer('CREATE')}
                className="group p-5 sm:p-6 bg-[#15172b]/85 hover:bg-[#1a1d36] border border-white/10 hover:border-[#5865f2]/60 rounded-2xl transition-all duration-200 cursor-pointer shadow-xl hover:shadow-[0_12px_32px_rgba(88,101,242,0.2)] flex flex-col justify-between backdrop-blur-md"
              >
                <div>
                  <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-2xl bg-[#5865f2]/20 group-hover:bg-[#5865f2] text-[#5865f2] group-hover:text-white flex items-center justify-center mb-3 sm:mb-4 transition-colors">
                    <Plus className="w-5 h-5 sm:w-6 sm:h-6" />
                  </div>
                  <h3 className="text-base sm:text-lg font-bold text-white mb-1.5 flex items-center gap-2">
                    Create My Own Server
                    <span className="text-[10px] sm:text-[11px] font-semibold text-[#5865f2] bg-[#5865f2]/15 px-2 py-0.5 rounded-full border border-[#5865f2]/25">Owner</span>
                  </h3>
                  <p className="text-xs text-[#949ba4] leading-relaxed mb-4 sm:mb-6">
                    Start your own custom space for friends, study groups, or communities. You have full control over channels and roles.
                  </p>
                </div>
                <button
                  type="button"
                  className="w-full py-2 sm:py-2.5 px-4 bg-[#5865f2] hover:bg-[#4752c4] text-white text-xs font-semibold rounded-lg transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-md"
                >
                  <Plus className="w-4 h-4" />
                  Create a Server
                </button>
              </div>

              {/* Card 2: Join a Server */}
              <div
                onClick={() => openCreateServer('JOIN')}
                className="group p-5 sm:p-6 bg-[#15172b]/85 hover:bg-[#1a1d36] border border-white/10 hover:border-[#23a55a]/60 rounded-2xl transition-all duration-200 cursor-pointer shadow-xl hover:shadow-[0_12px_32px_rgba(35,165,90,0.2)] flex flex-col justify-between backdrop-blur-md"
              >
                <div>
                  <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-2xl bg-[#23a55a]/20 group-hover:bg-[#23a55a] text-[#23a55a] group-hover:text-white flex items-center justify-center mb-3 sm:mb-4 transition-colors">
                    <LinkIcon className="w-5 h-5 sm:w-6 sm:h-6" />
                  </div>
                  <h3 className="text-base sm:text-lg font-bold text-white mb-1.5 flex items-center gap-2">
                    Join an Existing Server
                    <span className="text-[10px] sm:text-[11px] font-semibold text-[#23a55a] bg-[#23a55a]/15 px-2 py-0.5 rounded-full border border-[#23a55a]/25">Invite</span>
                  </h3>
                  <p className="text-xs text-[#949ba4] leading-relaxed mb-4 sm:mb-6">
                    Have an invite link or an 8-character code from a friend? Enter it here to immediately join their channels and calls.
                  </p>
                </div>
                <button
                  type="button"
                  className="w-full py-2 sm:py-2.5 px-4 bg-[#23a55a] hover:bg-[#1f9250] text-white text-xs font-semibold rounded-lg transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-md"
                >
                  <LinkIcon className="w-4 h-4" />
                  Join with Invite
                </button>
              </div>
            </div>
          </div>
        ) : !activeChannel ? (
          /* State B: Server Selected but No Channel Selected */
          <div className="flex-1 flex flex-col items-center justify-center p-6 text-center app-cosmic-bg relative">
            <div className="absolute top-3 left-3 md:hidden">
              <button
                onClick={() => setMobileNavOpen(true)}
                className="px-3 py-1.5 rounded-xl bg-[#15172b] border border-white/10 text-white hover:bg-white/10 flex items-center gap-2 text-xs font-semibold shadow-md cursor-pointer"
              >
                <Menu className="w-4 h-4 text-[#5865f2]" />
                <span>Channels</span>
              </button>
            </div>
            <div className="w-16 h-16 rounded-full bg-[#15172b] border border-white/10 text-[#a78bfa] flex items-center justify-center mb-4 shadow-[0_0_20px_rgba(167,139,250,0.2)]">
              <MessageSquare className="w-8 h-8" />
            </div>
            <h3 className="text-lg font-bold text-white mb-1">No Channel Selected</h3>
            <p className="text-xs text-[#949ba4] max-w-sm">
              Pick a text or voice channel from the sidebar to start chatting!
            </p>
          </div>
        ) : activeChannel.type === 'TEXT' ? (
          /* State C: TEXT Channel -> ChatPanel (left) + MemberList (right sidebar) */
          <div className="flex-1 flex flex-row overflow-hidden w-full h-full chat-cosmic-bg relative">
            <ChatPanel
              key={activeChannel.id}
              channelId={activeChannel.id}
              channelName={activeChannel.name}
            />
            <MemberList serverId={serverId} />
          </div>
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
