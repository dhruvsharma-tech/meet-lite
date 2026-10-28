import { useEffect } from 'react';
import { Crown, X } from 'lucide-react';
import { useUIStore } from '../../store/uiStore';
import { useServerStore } from '../../store/serverStore';
import { useAuthStore } from '../../store/authStore';
import api from '../../services/api';
import toast from 'react-hot-toast';

const EMPTY_MEMBERS = [];

export default function MemberList({ serverId }) {
  const isMemberListOpen = useUIStore((state) => state.isMemberListOpen);
  const members = useServerStore((state) => state.members) || EMPTY_MEMBERS;
  const setMembers = useServerStore.getState().setMembers;
  const currentUser = useAuthStore((state) => state.user);
  const currentMember = members.find((m) => m.user?.id === currentUser?.id);
  const isOwner = currentMember?.role === 'OWNER';

  useEffect(() => {
    if (!serverId || !isMemberListOpen) return;

    api.get(`/api/servers/${serverId}/members`).then((res) => {
      setMembers(res.data.members);
    }).catch(() => {});
  }, [serverId, isMemberListOpen]);

  if (!isMemberListOpen) return null;

  const online = members.filter((m) => m.user?.isOnline);
  const offline = members.filter((m) => !m.user?.isOnline);

  async function handleKick(memberId, memberName) {
    if (!confirm(`Kick ${memberName}?`)) return;
    try {
      await api.delete(`/api/servers/${serverId}/members/${memberId}`);
      setMembers(members.filter((m) => m.id !== memberId));
      toast.success(`${memberName} kicked`);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to kick member');
    }
  }

  function MemberRow({ member }) {
    const isCurrentUser = member.user?.id === currentUser?.id;
    const canKick = isOwner && !isCurrentUser && member.role !== 'OWNER';

    return (
      <div className="flex items-center gap-2 px-2 py-1 rounded hover:bg-[#35373c] group cursor-default select-none">
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
            className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-[#2b2d31] ${
              member.user?.isOnline ? 'bg-[#23a55a]' : 'bg-[#80848e]'
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

        {/* Kick button — only visible on hover for owners */}
        {canKick && (
          <button
            onClick={() => handleKick(member.id, member.user?.name)}
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
    <div className="w-60 shrink-0 bg-[#2b2d31] flex flex-col overflow-hidden border-l border-[#1f2023]">
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
    </div>
  );
}

