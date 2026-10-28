import { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import toast from 'react-hot-toast';
import { Loader2 } from 'lucide-react';
import authService from '../services/authService';
import { useAuthStore } from '../store/authStore';

export default function LoginPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const redirect = searchParams.get('redirect') || '/app';

  const setUser = useAuthStore((state) => state.setUser);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!email || !password) {
      setError('Please fill in all fields.');
      return;
    }

    setIsLoading(true);
    try {
      const data = await authService.login({ email, password });
      setUser(data.user);
      toast.success(`Welcome back, ${data.user.name}!`);
      navigate(redirect);
    } catch (err) {
      const msg = err.response?.data?.error || 'Invalid email or password.';
      setError(msg);
      toast.error(msg);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-[#1e1f22] p-4 font-sans select-none">
      <div className="w-full max-w-[480px] bg-[#2b2d31] p-8 rounded-lg shadow-2xl border border-[#1e1f22]/50 text-[#f2f3f5]">
        <div className="text-center mb-6">
          <h1 className="text-2xl font-bold tracking-tight text-white mb-2">Welcome back!</h1>
          <p className="text-sm text-[#b5bac1]">We're so excited to see you again!</p>
        </div>

        {error && (
          <div className="mb-4 p-3 rounded bg-[#f23f42]/15 border border-[#f23f42]/40 text-[#f23f42] text-xs font-semibold">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-[#b5bac1] mb-2">
              Email <span className="text-[#f23f42]">*</span>
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-3 py-2.5 bg-[#1e1f22] border border-[#1e1f22] rounded text-sm text-[#f2f3f5] placeholder-[#80848e] focus:outline-none focus:ring-2 focus:ring-[#5865f2] transition-colors"
              placeholder="name@domain.com"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-[#b5bac1] mb-2">
              Password <span className="text-[#f23f42]">*</span>
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full px-3 py-2.5 bg-[#1e1f22] border border-[#1e1f22] rounded text-sm text-[#f2f3f5] placeholder-[#80848e] focus:outline-none focus:ring-2 focus:ring-[#5865f2] transition-colors"
              placeholder="••••••••"
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-2.5 px-4 bg-[#5865f2] hover:bg-[#4752c4] disabled:opacity-50 text-white font-medium text-sm rounded transition-colors duration-150 flex items-center justify-center cursor-pointer"
          >
            {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Log In'}
          </button>
        </form>

        <div className="relative my-6 flex items-center justify-center">
          <div className="border-t border-[#35373c] w-full" />
          <span className="bg-[#2b2d31] px-3 text-xs uppercase font-semibold text-[#80848e] absolute">
            OR
          </span>
        </div>

        <a
          href={`${apiUrl}/api/auth/google`}
          className="w-full py-2.5 px-4 bg-[#313338] hover:bg-[#383a40] text-sm text-[#f2f3f5] font-medium rounded border border-[#383a40] flex items-center justify-center gap-3 transition-colors cursor-pointer"
        >
          <svg className="w-4 h-4" viewBox="0 0 24 24">
            <path
              fill="#EA4335"
              d="M12 5c1.6 0 3 .6 4.1 1.6l3.1-3.1C17.3 1.7 14.8 1 12 1 7.5 1 3.7 3.6 1.9 7.3l3.7 2.9C6.5 7.4 9 5 12 5z"
            />
            <path
              fill="#4285F4"
              d="M23.5 12.3c0-.8-.1-1.6-.2-2.3H12v4.5h6.5c-.3 1.5-1.1 2.8-2.4 3.7l3.7 2.9c2.2-2 3.7-5 3.7-8.8z"
            />
            <path
              fill="#FBBC05"
              d="M5.6 14.8c-.2-.7-.4-1.5-.4-2.8s.2-2.1.4-2.8L1.9 6.3C.7 8.7 0 10.3 0 12s.7 3.3 1.9 5.7l3.7-2.9z"
            />
            <path
              fill="#34A853"
              d="M12 23c3.2 0 6-1.1 8-3l-3.7-2.9c-1.1.7-2.5 1.2-4.3 1.2-3 0-5.5-2-6.4-4.8L1.9 16.4C3.7 20.4 7.5 23 12 23z"
            />
          </svg>
          Continue with Google
        </a>

        <div className="mt-5 text-left text-xs text-[#b5bac1]">
          Need an account?{' '}
          <Link
            to={redirect !== '/app' ? `/register?redirect=${encodeURIComponent(redirect)}` : '/register'}
            className="text-[#00a8fc] hover:underline font-medium"
          >
            Register
          </Link>
        </div>
      </div>
    </div>
  );
}

