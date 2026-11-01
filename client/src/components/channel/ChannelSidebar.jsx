import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  ChevronDown,
  Plus,
  LogOut,
  Trash2,
  UserPlus,
} from 'lucide-react';
import toast from 'react-hot-toast';
import { useServerStore } from '../../store/serverStore';
import { useAuthStore } from '../../store/authStore';
import { useUIStore } from '../../store/uiStore';
import serverService from '../../services/serverService';
import channelService from '../../services/channelService';
import ChannelItem from './ChannelItem';
import ConfirmModal from '../common/ConfirmModal';

export default function ChannelSidebar() {
  const navigate = useNavigate();
  const { serverId, channelId } = useParams();

  const user = useAuthStore((state) => state.user);
  const clearUser = useAuthStore((state) => state.clearUser);
  const currentServer = useServerStore((state) => state.currentServer);
  const channels = useServerStore((state) => state.channels);
  const removeServer = useServerStore((state) => state.removeServer);
  const removeChannel = useServerStore((state) => state.removeChannel);

  const setCreateChannelOpen = useUIStore((state) => state.setCreateChannelOpen);
  const setInviteModalOpen = useUIStore((state) => state.setInviteModalOpen);

  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [confirmConfig, setConfirmConfig] = useState({
    isOpen: false,
    title: '',
    message: '',
    confirmText: '',
    type: 'danger',
    onConfirm: null,
  });

  const closeConfirm = () => {
    setConfirmConfig((prev) => ({ ...prev, isOpen: false }));
  };

  // Check if current user is server owner
  const isOwner = currentServer?.ownerId === user?.id;

  const textChannels = channels.filter((c) => c.type === 'TEXT');
  const voiceChannels = channels.filter((c) => c.type === 'VOICE');

  const handleDeleteChannel = (id, name) => {
    setConfirmConfig({
      isOpen: true,
      title: 'Delete Channel',
      message: `Are you sure you want to delete #${name || 'this channel'}? All messages and attachments in this channel will be permanently removed.`,
      confirmText: 'Delete Channel',
      type: 'danger',
      onConfirm: async () => {
        closeConfirm();
        try {
          await channelService.deleteChannel(serverId, id);
          removeChannel(id);
          toast.success('Channel deleted.');
          if (channelId === id) {
            const remaining = channels.find((c) => c.id !== id);
            if (remaining) {
              navigate(`/app/${serverId}/${remaining.id}`);
            } else {
              navigate(`/app/${serverId}`);
            }
          }
        } catch {
          toast.error('Failed to delete channel.');
        }
      },
    });
  };

  const handleDeleteServer = () => {
    setIsDropdownOpen(false);
    setConfirmConfig({
      isOpen: true,
      title: 'Delete Server',
      message: `Are you sure you want to delete "${currentServer?.name}"? All channels, voice rooms, and history will be permanently deleted. This cannot be undone.`,
      confirmText: 'Delete Server',
      type: 'danger',
      onConfirm: async () => {
        closeConfirm();
        try {
          await serverService.deleteServer(serverId);
          removeServer(serverId);
          toast.success('Server deleted.');
          navigate('/app');
        } catch {
          toast.error('Failed to delete server.');
        }
      },
    });
  };

  const handleLeaveServer = () => {
    setIsDropdownOpen(false);
    setConfirmConfig({
      isOpen: true,
      title: 'Leave Server',
      message: `Are you sure you want to leave "${currentServer?.name}"? You will need an invite link to rejoin this server.`,
      confirmText: 'Leave Server',
      type: 'danger',
      onConfirm: async () => {
        closeConfirm();
        try {
          await serverService.leaveServer(serverId);
          removeServer(serverId);
          toast.success('Left server.');
          navigate('/app');
        } catch {
          toast.error('Failed to leave server.');
        }
      },
    });
  };

  const handleLogout = () => {
    clearUser();
    navigate('/login');
  };

  const handleOpenInviteModal = () => {
    setIsDropdownOpen(false);
    setInviteModalOpen(true);
  };

  if (!currentServer) return null;

  return (
    <aside className="w-[240px] h-full bg-[#0e101d] flex flex-col select-none shrink-0 border-r border-white/5 relative">
      {/* Server Header Dropdown */}
      <div className="relative">
        <header
          onClick={() => setIsDropdownOpen(!isDropdownOpen)}
          className="h-12 border-b border-white/5 px-4 flex items-center justify-between font-semibold text-white shadow-xs hover:bg-white/5 cursor-pointer transition-colors"
        >
          <span className="truncate">{currentServer.name}</span>
          <ChevronDown
            className={`w-4 h-4 text-[#b5bac1] transition-transform duration-200 ${
              isDropdownOpen ? 'rotate-180' : ''
            }`}
          />
        </header>

        {/* Server Context Menu */}
        {isDropdownOpen && (
          <>
            <div
              className="fixed inset-0 z-40"
              onClick={() => setIsDropdownOpen(false)}
            />
            <div className="absolute top-13 left-2 right-2 bg-[#111214] p-1.5 rounded-md shadow-2xl z-50 text-xs font-medium space-y-1 border border-[#2b2d31]">
              <button
                onClick={() => {
                  setIsDropdownOpen(false);
                  setCreateChannelOpen(true);
                }}
                className="w-full text-left px-2.5 py-2 rounded text-[#949ba4] hover:bg-[#5865f2] hover:text-white flex items-center justify-between cursor-pointer"
              >
                <span>Create Channel</span>
                <Plus className="w-4 h-4" />
              </button>

              <button
                onClick={handleOpenInviteModal}
                className="w-full text-left px-2.5 py-2 rounded text-[#949ba4] hover:bg-[#5865f2] hover:text-white flex items-center justify-between cursor-pointer"
              >
                <span>Invite People</span>
                <UserPlus className="w-4 h-4 text-[#5865f2] group-hover:text-white" />
              </button>

              <div className="h-[1px] bg-[#2b2d31] my-1" />

              {isOwner ? (
                <button
                  onClick={() => {
                    setIsDropdownOpen(false);
                    handleDeleteServer();
                  }}
                  className="w-full text-left px-2.5 py-2 rounded text-[#f23f42] hover:bg-[#f23f42] hover:text-white flex items-center justify-between cursor-pointer"
                >
                  <span>Delete Server</span>
                  <Trash2 className="w-4 h-4" />
                </button>
              ) : (
                <button
                  onClick={() => {
                    setIsDropdownOpen(false);
                    handleLeaveServer();
                  }}
                  className="w-full text-left px-2.5 py-2 rounded text-[#f23f42] hover:bg-[#f23f42] hover:text-white flex items-center justify-between cursor-pointer"
                >
                  <span>Leave Server</span>
                  <LogOut className="w-4 h-4" />
                </button>
              )}
            </div>
          </>
        )}
      </div>

      {/* Channels List Area */}
      <div className="flex-1 overflow-y-auto pt-3 px-1 space-y-4">
        {/* TEXT CHANNELS */}
        <div>
          <div className="flex items-center justify-between px-3 mb-1 text-[11px] font-bold uppercase tracking-wider text-[#949ba4]">
            <span>Text Channels</span>
            {isOwner && (
              <button
                onClick={() => setCreateChannelOpen(true)}
                className="hover:text-white transition-colors cursor-pointer"
                title="Create Text Channel"
              >
                <Plus className="w-4 h-4" />
              </button>
            )}
          </div>
          <div className="space-y-0.5">
            {textChannels.map((c) => (
              <ChannelItem
                key={c.id}
                id={c.id}
                name={c.name}
                type={c.type}
                isActive={c.id === channelId}
                isOwner={isOwner}
                onClick={() => navigate(`/app/${serverId}/${c.id}`)}
                onDelete={handleDeleteChannel}
              />
            ))}
          </div>
        </div>

        {/* VOICE CHANNELS */}
        <div>
          <div className="flex items-center justify-between px-3 mb-1 text-[11px] font-bold uppercase tracking-wider text-[#949ba4]">
            <span>Voice Channels</span>
            {isOwner && (
              <button
                onClick={() => setCreateChannelOpen(true)}
                className="hover:text-white transition-colors cursor-pointer"
                title="Create Voice Channel"
              >
                <Plus className="w-4 h-4" />
              </button>
            )}
          </div>
          <div className="space-y-0.5">
            {voiceChannels.map((c) => (
              <ChannelItem
                key={c.id}
                id={c.id}
                name={c.name}
                type={c.type}
                isActive={c.id === channelId}
                isOwner={isOwner}
                onClick={() => navigate(`/app/${serverId}/${c.id}`)}
                onDelete={handleDeleteChannel}
              />
            ))}
          </div>
        </div>
      </div>

      {/* User Footer Bar */}
      <div className="h-14 bg-[#0a0b14] border-t border-white/5 px-2 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-2 overflow-hidden px-1 py-1 rounded-lg hover:bg-white/5 cursor-pointer transition-colors">
          <div className="relative w-8 h-8 rounded-full bg-[#5865f2] flex items-center justify-center font-bold text-xs text-white shrink-0">
            {user?.name?.[0]?.toUpperCase() || 'U'}
            <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-[#23a55a] border-2 border-[#0a0b14]" />
          </div>
          <div className="truncate text-left">
            <div className="text-xs font-semibold text-white leading-tight truncate">
              {user?.name}
            </div>
            <div className="text-[10px] text-[#949ba4] leading-tight truncate">
              {user?.email}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-1 text-[#b5bac1]">
          <button
            onClick={handleLogout}
            className="p-1.5 rounded hover:bg-[#35373c] hover:text-[#f23f42] transition-colors cursor-pointer"
            title="Log Out"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Styled Confirmation Modal (No ugly browser alert) */}
      <ConfirmModal
        isOpen={confirmConfig.isOpen}
        onClose={closeConfirm}
        onConfirm={confirmConfig.onConfirm}
        title={confirmConfig.title}
        message={confirmConfig.message}
        confirmText={confirmConfig.confirmText}
        type={confirmConfig.type}
      />
    </aside>
  );
}

