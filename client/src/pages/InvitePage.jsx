import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import api from '../services/api';
import toast from 'react-hot-toast';
import { Loader2, Users } from 'lucide-react';

export default function InvitePage() {
  const { code } = useParams();
  const navigate = useNavigate();
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(true);
  const [joining, setJoining] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate(`/login?redirect=/invite/${code}`);
      return;
    }

    api.get(`/api/invites/${code}`)
      .then((res) => setPreview(res.data.server))
      .catch(() => setError('Invalid or expired invite link.'))
      .finally(() => setLoading(false));
  }, [code, isAuthenticated]);

  async function handleJoin() {
    setJoining(true);
    try {
      const res = await api.post(`/api/invites/${code}/join`);
      const server = res.data.server;
      toast.success(`Joined ${server.name}!`);
      navigate(`/app/${server.id}`);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to join server');
    } finally {
      setJoining(false);
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-[#313338] flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-[#5865f2]" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-[#313338] flex items-center justify-center text-center px-4">
        <div>
          <p className="text-[#f23f42] text-lg font-semibold mb-2">{error}</p>
          <button
            onClick={() => navigate('/app')}
            className="mt-4 px-6 py-2 bg-[#5865f2] hover:bg-[#4752c4] text-white rounded-md text-sm font-medium transition-colors"
          >
            Back to App
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#313338] flex items-center justify-center px-4">
      <div className="bg-[#2b2d31] rounded-xl p-8 max-w-sm w-full text-center shadow-2xl">
        {/* Server icon */}
        {preview?.icon ? (
          <img
            src={preview.icon}
            alt={preview.name}
            className="w-20 h-20 rounded-2xl mx-auto mb-4 object-cover"
          />
        ) : (
          <div className="w-20 h-20 rounded-2xl mx-auto mb-4 bg-[#5865f2] flex items-center justify-center text-white text-3xl font-bold">
            {preview?.name?.[0]?.toUpperCase()}
          </div>
        )}

        <p className="text-[#b5bac1] text-sm mb-1">You've been invited to join</p>
        <h1 className="text-white text-2xl font-bold mb-2">{preview?.name}</h1>

        <div className="flex items-center justify-center gap-1.5 text-[#80848e] text-sm mb-6">
          <Users className="w-4 h-4" />
          <span>{preview?._count?.members ?? 0} members</span>
        </div>

        <button
          onClick={handleJoin}
          disabled={joining}
          className="w-full py-2.5 bg-[#5865f2] hover:bg-[#4752c4] disabled:opacity-60 text-white rounded-md font-medium transition-colors flex items-center justify-center gap-2 cursor-pointer"
        >
          {joining ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
          {joining ? 'Joining...' : 'Accept Invite'}
        </button>
      </div>
    </div>
  );
}

