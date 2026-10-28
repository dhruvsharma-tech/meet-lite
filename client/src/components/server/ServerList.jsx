import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Compass, Plus } from 'lucide-react';
import { useServerStore } from '../../store/serverStore';
import { useUIStore } from '../../store/uiStore';
import ServerIcon from './ServerIcon';

export default function ServerList() {
  const navigate = useNavigate();
  const { serverId } = useParams();
  const servers = useServerStore((state) => state.servers);
  const setCreateServerOpen = useUIStore((state) => state.setCreateServerOpen);

  const [hoveredHome, setHoveredHome] = useState(false);
  const [hoveredAdd, setHoveredAdd] = useState(false);

  return (
    <nav className="w-[72px] h-full bg-[#1e1f22] flex flex-col items-center py-3 select-none z-20 shrink-0 overflow-y-auto no-scrollbar">
      {/* Home / Direct Messages Icon */}
      <div
        className="relative flex items-center justify-center w-full group cursor-pointer mb-2"
        onMouseEnter={() => setHoveredHome(true)}
        onMouseLeave={() => setHoveredHome(false)}
        onClick={() => navigate('/app')}
      >
        <span
          className={`absolute left-0 w-1 bg-white rounded-r transition-all duration-200 ${
            !serverId ? 'h-10' : hoveredHome ? 'h-5' : 'h-0'
          }`}
        />
        <div
          className={`w-12 h-12 flex items-center justify-center transition-all duration-200 ${
            !serverId
              ? 'rounded-[16px] bg-[#5865f2] text-white'
              : hoveredHome
              ? 'rounded-[16px] bg-[#5865f2] text-white'
              : 'rounded-[24px] bg-[#313338] text-[#dbdee1]'
          }`}
        >
          <Compass className="w-6 h-6" />
        </div>

        {/* Tooltip */}
        <div
          className={`absolute left-[80px] z-50 px-3 py-1.5 bg-[#111214] text-white text-xs font-semibold rounded shadow-xl whitespace-nowrap pointer-events-none transition-opacity duration-150 ${
            hoveredHome ? 'opacity-100 scale-100' : 'opacity-0 scale-95'
          }`}
        >
          Direct Messages & Servers
          <span className="absolute top-1/2 -left-1 -translate-y-1/2 border-y-4 border-y-transparent border-r-4 border-r-[#111214]" />
        </div>
      </div>

      {/* Divider */}
      <div className="w-8 h-[2px] bg-[#35373c] rounded mb-2 shrink-0" />

      {/* Server List */}
      <div className="flex-1 w-full flex flex-col items-center space-y-1 overflow-y-auto">
        {servers.map((s) => (
          <ServerIcon
            key={s.id}
            id={s.id}
            name={s.name}
            icon={s.icon}
            isActive={s.id === serverId}
            onClick={() => {
              const defaultChannel = s.channels?.[0]?.id;
              if (defaultChannel) {
                navigate(`/app/${s.id}/${defaultChannel}`);
              } else {
                navigate(`/app/${s.id}`);
              }
            }}
          />
        ))}

        {/* Add a Server Button */}
        <div
          className="relative flex items-center justify-center w-full group cursor-pointer my-1"
          onMouseEnter={() => setHoveredAdd(true)}
          onMouseLeave={() => setHoveredAdd(false)}
          onClick={() => setCreateServerOpen(true)}
        >
          <span
            className={`absolute left-0 w-1 bg-white rounded-r transition-all duration-200 ${
              hoveredAdd ? 'h-5' : 'h-0'
            }`}
          />
          <div
            className={`w-12 h-12 flex items-center justify-center transition-all duration-200 text-[#23a55a] ${
              hoveredAdd
                ? 'rounded-[16px] bg-[#23a55a] text-white'
                : 'rounded-[24px] bg-[#313338] hover:text-white'
            }`}
          >
            <Plus className="w-6 h-6" />
          </div>

          {/* Tooltip */}
          <div
            className={`absolute left-[80px] z-50 px-3 py-1.5 bg-[#111214] text-white text-xs font-semibold rounded shadow-xl whitespace-nowrap pointer-events-none transition-opacity duration-150 ${
              hoveredAdd ? 'opacity-100 scale-100' : 'opacity-0 scale-95'
            }`}
          >
            Add a Server
            <span className="absolute top-1/2 -left-1 -translate-y-1/2 border-y-4 border-y-transparent border-r-4 border-r-[#111214]" />
          </div>
        </div>
      </div>
    </nav>
  );
}

