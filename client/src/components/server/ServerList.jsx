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
  const setChannelSidebarOpen = useUIStore((state) => state.setChannelSidebarOpen);

  const [hoveredHome, setHoveredHome] = useState(false);
  const [hoveredAdd, setHoveredAdd] = useState(false);

  return (
    <nav className="w-[68px] sm:w-[72px] h-full bg-[#07080f] border-r border-white/5 flex flex-col items-center py-3 select-none z-30 shrink-0 overflow-y-auto no-scrollbar">
      {/* Home / Direct Messages Icon */}
      <div
        className="relative flex items-center justify-center w-full group cursor-pointer mb-2"
        onMouseEnter={() => setHoveredHome(true)}
        onMouseLeave={() => setHoveredHome(false)}
        onClick={() => {
          navigate('/app');
          setChannelSidebarOpen(false);
        }}
      >
        <span
          className={`absolute left-0 w-1 bg-white rounded-r transition-all duration-200 ${
            !serverId ? 'h-10' : hoveredHome ? 'h-5' : 'h-0'
          }`}
        />
        <div
          className={`w-11 h-11 sm:w-12 sm:h-12 flex items-center justify-center transition-all duration-200 ${
            !serverId
              ? 'rounded-[16px] bg-[#5865f2] text-white shadow-[0_0_15px_rgba(88,101,242,0.4)]'
              : hoveredHome
              ? 'rounded-[16px] bg-[#5865f2] text-white'
              : 'rounded-[24px] bg-[#313338] text-[#dbdee1]'
          }`}
        >
          <Compass className="w-5 h-5 sm:w-6 sm:h-6" />
        </div>

        {/* Tooltip */}
        <div
          className={`absolute left-[76px] sm:left-[80px] z-50 px-3 py-1.5 bg-[#111214] text-white text-xs font-semibold rounded shadow-xl whitespace-nowrap pointer-events-none transition-opacity duration-150 ${
            hoveredHome ? 'opacity-100 scale-100' : 'opacity-0 scale-95'
          }`}
        >
          Direct Messages & Servers
          <span className="absolute top-1/2 -left-1 -translate-y-1/2 border-y-4 border-y-transparent border-r-4 border-r-[#111214]" />
        </div>
      </div>

      {/* Divider */}
      <div className="w-8 h-[2px] bg-white/10 rounded-full my-1.5" />

      {/* User Servers List */}
      <div className="flex-1 w-full space-y-2 flex flex-col items-center">
        {servers.map((s) => (
          <ServerIcon
            key={s.id}
            name={s.name}
            icon={s.icon}
            isActive={s.id === serverId}
            onClick={() => {
              navigate(`/app/${s.id}`);
              setChannelSidebarOpen(true);
            }}
          />
        ))}

        {/* Add a Server Button */}
        <div
          className="relative flex items-center justify-center w-full group cursor-pointer mt-1"
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
            className={`w-11 h-11 sm:w-12 sm:h-12 flex items-center justify-center transition-all duration-200 text-[#23a55a] ${
              hoveredAdd
                ? 'rounded-[16px] bg-[#23a55a] text-white shadow-[0_0_15px_rgba(35,165,90,0.4)]'
                : 'rounded-[24px] bg-[#313338] hover:text-white'
            }`}
          >
            <Plus className="w-5 h-5 sm:w-6 sm:h-6" />
          </div>

          {/* Tooltip */}
          <div
            className={`absolute left-[76px] sm:left-[80px] z-50 px-3 py-1.5 bg-[#111214] text-white text-xs font-semibold rounded shadow-xl whitespace-nowrap pointer-events-none transition-opacity duration-150 ${
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
