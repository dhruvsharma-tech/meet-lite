import { useState } from 'react';
import { Crown, X } from 'lucide-react';
import { useUIStore } from '../../store/uiStore';
import { useServerStore } from '../../store/serverStore';
import { useAuthStore } from '../../store/authStore';
import api from '../../services/api';
import toast from 'react-hot-toast';
import ConfirmModal from '../common/ConfirmModal';

const EMPTY_MEMBERS = [];

export default function MemberList({ serverId }) {
  const isMemberListOpen = useUIStore((state) => state.isMemberListOpen);
  const toggleMemberList = useUIStore((state) => state.toggleMemberList);
  const members = useServerStore((state) => state.members) || EMPTY_MEMBERS;
  const setMembers = useServerStore((state) => state.setMembers);
  const currentUser = useAuthStore((state) => state.user);
  const currentMember = members.find((m) => m.user?.id === currentUser?.id);
  const isOwner = currentMember?.role === 'OWNER';

  const [confirmConfig, setConfirmConfig] = useState({
    isOpen: false,
    title: '',
    message: '',
    confirmText: '',
    onConfirm: null,
  });

  const closeConfirm = () => {
    setConfirmConfig((prev) => ({ ...prev, isOpen: false }));
  };

  if (!isMemberListOpen) return null;

  // Split by status field
  const online = members.filter((m) => m.status === 'online' || m.user?.isOnline === true);
  const offline = members.filter((m) => m.status !== 'online' && m.user?.isOnline !== true);

  function promptKick(memberId, memberName) {
    setConfirmConfig({
      isOpen: true,
      title: 'Kick Member',
      message: `Are you sure you want to kick ${memberName} from this server? They will not be able to rejoin without an invite link.`,
      confirmText: 'Kick Member',
      onConfirm: async () => {
        closeConfirm();
        try {
          await api.delete(`/api/servers/${serverId}/members/${memberId}`);
          setMembers(members.filter((m) => m.id !== memberId));
          toast.success(`${memberName} kicked`);
        } catch {
          toast.error('Failed to kick member');
        }
      },
    });
  }

  function MemberRow({ member }) {
    const isSelf = member.user?.id === currentUser?.id;
    const canKick = isOwner && !isSelf && member.role !== 'OWNER';

    return (
      <div className="flex items-center gap-2 px-2 py-1.5 rounded-lg hover:bg-white/5 group cursor-default select-none transition-colors">
        {/* Avatar */}
        <div className="relative shrink-0">
          {member.user?.avatar ? (
            <img src={member.user.avatar} alt="" className="w-8 h-8 rounded-full object-cover" />
          ) : (
            <div className="w-8 h-8 rounded-full bg-[#5865f2] flex items-center justify-center text-white text-xs font-bold">
              {member.user?.name?.[0]?.toUpperCase() || '?'}
            </div>
          )}
          {/* Online/Offline dot */}
          <span
            className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-[#0c0d18] ${
              member.status === 'online' || member.user?.isOnline ? 'bg-[#23a55a]' : 'bg-[#80848e]'
            }`}
          />
        </div>

        {/* Name + role */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1 min-w-0">
            <span className="text-sm text-[#dbdee1] truncate">{member.user?.name}</span>
            {member.role === 'OWNER' && (
              <Crown className="w-3.5 h-3.5 text-yellow-400 shrink-0" />
            )}
          </div>
        </div>

        {/* Kick button */}
        {canKick && (
          <button
            onClick={() => promptKick(member.id, member.user?.name)}
            className="opacity-0 group-hover:opacity-100 p-1 rounded hover:bg-[#f23f42]/20 text-[#f23f42] transition-opacity cursor-pointer"
            title="Kick member"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        )}
      </div>
    );
  }

  return (
    <>
      {/* Mobile Backdrop Overlay */}
      <div
        className="fixed inset-0 bg-black/60 z-40 lg:hidden backdrop-blur-xs"
        onClick={toggleMemberList}
      />

      {/* Member List Container: static on lg screens, fixed off-canvas sheet on mobile */}
      <div className="fixed inset-y-0 right-0 z-50 w-72 max-w-[85vw] bg-[#0c0d18] shadow-2xl flex flex-col overflow-hidden border-l border-white/10 lg:static lg:w-60 lg:z-auto lg:shadow-none lg:border-white/5 shrink-0">
        {/* Mobile Header with Close button */}
        <div className="h-12 border-b border-white/5 px-4 flex items-center justify-between font-semibold text-white text-sm shrink-0 lg:hidden">
          <span>Members ({members.length})</span>
          <button
            onClick={toggleMemberList}
            className="p-1.5 rounded-lg text-[#949ba4] hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="px-3 pt-4 pb-2 flex-1 overflow-y-auto">
          {/* ONLINE */}
          {online.length > 0 && (
            <div className="mb-3">
              <p className="text-xs font-semibold text-[#80848e] uppercase tracking-wide px-2 mb-1">
                Online — {online.length}
              </p>
              {online.map((m) => <MemberRow key={m.id} member={m} />)}
            </div>
          )}

          {/* OFFLINE */}
          {offline.length > 0 && (
            <div>
              <p className="text-xs font-semibold text-[#80848e] uppercase tracking-wide px-2 mb-1">
                Offline — {offline.length}
              </p>
              {offline.map((m) => <MemberRow key={m.id} member={m} />)}
            </div>
          )}

          {members.length === 0 && (
            <p className="text-xs text-[#80848e] px-2 mt-2">No members found</p>
          )}
        </div>

        {/* Styled Kick Confirmation Modal */}
        <ConfirmModal
          isOpen={confirmConfig.isOpen}
          onClose={closeConfirm}
          onConfirm={confirmConfig.onConfirm}
          title={confirmConfig.title}
          message={confirmConfig.message}
          confirmText={confirmConfig.confirmText}
          type="danger"
        />
      </div>
    </>
  );
}
