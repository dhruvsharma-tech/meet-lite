import { useState } from 'react';

export default function ServerIcon({ id, name, icon, isActive, onClick }) {
  const [isHovered, setIsHovered] = useState(false);

  // Generate initials fallback if no icon image
  const initials = name
    ? name
        .split(' ')
        .map((w) => w[0])
        .join('')
        .slice(0, 3)
        .toUpperCase()
    : 'D';

  return (
    <div
      className="relative flex items-center justify-center w-full group cursor-pointer my-1"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={onClick}
    >
      {/* Discord Left Indicator Pill */}
      <span
        className={`absolute left-0 w-1 bg-white rounded-r transition-all duration-200 ${
          isActive
            ? 'h-10'
            : isHovered
            ? 'h-5'
            : 'h-0 scale-0'
        }`}
      />

      {/* Server Icon Body */}
      <div
        className={`w-12 h-12 flex items-center justify-center font-semibold text-sm transition-all duration-200 shadow-md select-none overflow-hidden ${
          isActive
            ? 'rounded-[16px] bg-[#5865f2] text-white'
            : isHovered
            ? 'rounded-[16px] bg-[#5865f2] text-white'
            : 'rounded-[24px] bg-[#313338] text-[#dbdee1] hover:text-white'
        }`}
      >
        {icon ? (
          <img src={icon} alt={name} className="w-full h-full object-cover" />
        ) : (
          <span>{initials}</span>
        )}
      </div>

      {/* Floating Tooltip */}
      <div
        className={`absolute left-[80px] z-50 px-3 py-1.5 bg-[#111214] text-white text-xs font-semibold rounded shadow-xl whitespace-nowrap pointer-events-none transition-opacity duration-150 ${
          isHovered ? 'opacity-100 scale-100' : 'opacity-0 scale-95'
        }`}
      >
        {name}
        {/* Tooltip triangle arrow */}
        <span className="absolute top-1/2 -left-1 -translate-y-1/2 border-y-4 border-y-transparent border-r-4 border-r-[#111214]" />
      </div>
    </div>
  );
}

