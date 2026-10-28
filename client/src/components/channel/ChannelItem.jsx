import { Hash, Volume2, Trash2 } from 'lucide-react';

export default function ChannelItem({
  id,
  name,
  type,
  isActive,
  isOwner,
  onClick,
  onDelete,
}) {
  return (
    <div
      onClick={onClick}
      className={`group px-2 py-1.5 mx-2 rounded flex items-center justify-between text-sm cursor-pointer select-none transition-colors mb-0.5 ${
        isActive
          ? 'bg-[#35373c] text-white font-medium'
          : 'text-[#949ba4] hover:bg-[#35373c]/50 hover:text-[#dbdee1]'
      }`}
    >
      <div className="flex items-center gap-2 truncate">
        {type === 'VOICE' ? (
          <Volume2 className="w-4 h-4 shrink-0 text-[#80848e] group-hover:text-[#dbdee1]" />
        ) : (
          <Hash className="w-4 h-4 shrink-0 text-[#80848e] group-hover:text-[#dbdee1]" />
        )}
        <span className="truncate">{name}</span>
      </div>

      {/* Owner controls on hover (cannot delete general channel) */}
      {isOwner && name !== 'general' && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            onDelete(id);
          }}
          className="opacity-0 group-hover:opacity-100 p-1 hover:text-[#f23f42] text-[#80848e] transition-opacity cursor-pointer"
          title="Delete Channel"
        >
          <Trash2 className="w-3.5 h-3.5" />
        </button>
      )}
    </div>
  );
}
