import { format, isToday, isYesterday } from 'date-fns';

function formatMessageDate(dateString) {
  try {
    const date = new Date(dateString);
    const timeStr = format(date, 'h:mm a');

    if (isToday(date)) {
      return `Today at ${timeStr}`;
    }
    if (isYesterday(date)) {
      return `Yesterday at ${timeStr}`;
    }
    return `${format(date, 'MM/dd/yyyy')} ${timeStr}`;
  } catch {
    return '';
  }
}

export default function MessageItem({ message, isCompact }) {
  const { user, content, createdAt } = message;

  const initials = user?.name
    ? user.name
        .split(' ')
        .map((w) => w[0])
        .join('')
        .slice(0, 2)
        .toUpperCase()
    : 'U';

  if (isCompact) {
    return (
      <div className="group relative flex items-baseline py-0.5 px-4 hover:bg-[#2e3035]/50 transition-colors">
        <span className="w-12 text-[10px] text-[#80848e] text-right pr-3 opacity-0 group-hover:opacity-100 select-none">
          {format(new Date(createdAt), 'h:mm')}
        </span>
        <div className="flex-1 text-sm text-[#dbdee1] break-words whitespace-pre-wrap">
          {content}
        </div>
      </div>
    );
  }

  return (
    <div className="group relative flex items-start gap-4 py-1.5 px-4 mt-2 hover:bg-[#2e3035]/50 transition-colors">
      {/* Avatar */}
      <div className="w-10 h-10 rounded-full bg-[#5865f2] flex items-center justify-center font-bold text-xs text-white shrink-0 select-none overflow-hidden mt-0.5">
        {user?.avatar ? (
          <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" />
        ) : (
          <span>{initials}</span>
        )}
      </div>

      {/* Message Info + Body */}
      <div className="flex-1 overflow-hidden">
        <div className="flex items-baseline gap-2 mb-0.5">
          <span className="text-sm font-semibold text-white hover:underline cursor-pointer select-none">
            {user?.name || 'Unknown User'}
          </span>
          <span className="text-[11px] text-[#949ba4] select-none">
            {formatMessageDate(createdAt)}
          </span>
        </div>
        <div className="text-sm text-[#dbdee1] break-words whitespace-pre-wrap leading-relaxed">
          {content}
        </div>
      </div>
    </div>
  );
}
