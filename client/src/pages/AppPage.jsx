import { useNavigate, useParams } from 'react-router-dom';
import toast from 'react-hot-toast';
import { LogOut, Hash, Volume2 } from 'lucide-react';
import { useAuthStore } from '../store/authStore';
import authService from '../services/authService';

export default function AppPage() {
  const navigate = useNavigate();
  const { serverId, channelId } = useParams();
  const { user, clearUser } = useAuthStore();

  const handleLogout = async () => {
    try {
      await authService.logout();
      clearUser();
      toast.success('Logged out successfully.');
      navigate('/login');
    } catch (err) {
      toast.error('Failed to logout.');
    }
  };

  return (
    <div className="flex h-screen w-full bg-[#313338] text-[#f2f3f5] font-sans">
      {/* Mini Sidebar placeholder until Step 6 */}
      <div className="w-18 bg-[#1e1f22] flex flex-col items-center py-3 gap-3 border-r border-[#1e1f22]">
        <div className="w-12 h-12 rounded-2xl bg-[#5865f2] flex items-center justify-center text-white font-bold text-lg shadow-md">
          {user?.name?.[0]?.toUpperCase() || 'D'}
        </div>
      </div>

      {/* Main Container */}
      <div className="flex-1 flex flex-col">
        {/* Top Header */}
        <header className="h-12 border-b border-[#1f2023] bg-[#313338] px-4 flex items-center justify-between shadow-sm">
          <div className="flex items-center gap-2 text-sm font-semibold text-[#f2f3f5]">
            <Hash className="w-5 h-5 text-[#80848e]" />
            <span>welcome</span>
            {serverId && <span className="text-xs text-[#80848e]">/ server: {serverId}</span>}
            {channelId && <span className="text-xs text-[#80848e]">/ channel: {channelId}</span>}
          </div>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-[#5865f2] flex items-center justify-center font-bold text-xs text-white">
                {user?.name?.slice(0, 2).toUpperCase() || 'U'}
              </div>
              <div className="text-left hidden sm:block">
                <div className="text-xs font-semibold leading-tight">{user?.name}</div>
                <div className="text-[10px] text-[#23a55a] font-medium leading-tight">● Online</div>
              </div>
            </div>

            <button
              onClick={handleLogout}
              className="p-1.5 rounded hover:bg-[#35373c] text-[#b5bac1] hover:text-[#f23f42] transition-colors cursor-pointer"
              title="Log Out"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </header>

        {/* Content Area */}
        <main className="flex-1 flex flex-col items-center justify-center p-6 text-center">
          <div className="max-w-md bg-[#2b2d31] p-8 rounded-xl shadow-lg border border-[#1e1f22]/40">
            <div className="w-16 h-16 rounded-full bg-[#5865f2]/20 text-[#5865f2] flex items-center justify-center mx-auto mb-4">
              <Volume2 className="w-8 h-8" />
            </div>
            <h2 className="text-xl font-bold mb-2">Welcome to your Discord Space!</h2>
            <p className="text-sm text-[#b5bac1] mb-6">
              You are logged in as <span className="text-white font-semibold">{user?.email}</span>.
              Authentication and persistent sessions are active!
            </p>
            <div className="text-xs text-[#80848e] bg-[#1e1f22] p-3 rounded">
              Ready for Step 5 & 6 (Servers, Channels & 3-Panel Discord Layout).
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

