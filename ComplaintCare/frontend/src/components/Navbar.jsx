import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  function handleLogout() {
    logout();
    navigate('/login');
  }

  return (
    <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-6 sticky top-0 z-10">
      <div className="flex items-center gap-2">
        <span className="text-xl font-bold text-brand-600">ComplaintCare</span>
        <span className="text-xs text-slate-400 hidden sm:inline">Customer Complaint Management</span>
      </div>
      <div className="flex items-center gap-4">
        {user && (
          <div className="text-right hidden sm:block">
            <p className="text-sm font-medium text-slate-700">{user.name}</p>
            <p className="text-xs text-slate-400">{user.role}</p>
          </div>
        )}
        <button onClick={handleLogout} className="btn-secondary text-sm">
          Logout
        </button>
      </div>
    </header>
  );
}
