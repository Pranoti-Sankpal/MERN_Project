import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { authService } from '../../services/authService';
import { useAuth } from '../../hooks/useAuth';
import { roleHomePath } from '../../utils/roleHome';
import FormInput from '../../components/FormInput';
import ErrorMessage from '../../components/ErrorMessage';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { loginSuccess } = useAuth();
  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');

    if (!email || !password) {
      setError('Please enter both email and password.');
      return;
    }

    setLoading(true);
    try {
      const res = await authService.login({ email, password });
      loginSuccess(res.data);
      navigate(roleHomePath(res.data.user.role), { replace: true });
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 px-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-6">
          <h1 className="text-2xl font-bold text-brand-600">ComplaintCare</h1>
          <p className="text-sm text-slate-500 mt-1">Sign in to your account</p>
        </div>
        <form onSubmit={handleSubmit} className="card space-y-4">
          <ErrorMessage message={error} />
          <FormInput
            label="Email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
          />
          <FormInput
            label="Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
          />
          <button type="submit" disabled={loading} className="btn-primary w-full">
            {loading ? 'Signing in...' : 'Sign in'}
          </button>
        </form>
        <p className="text-center text-sm text-slate-500 mt-4">
          New customer?{' '}
          <Link to="/register" className="text-brand-600 font-medium hover:underline">
            Create an account
          </Link>
        </p>
        <div className="card mt-6 text-xs text-slate-500">
          <p className="font-semibold text-slate-600 mb-1">Demo credentials (password: Password123)</p>
          <p>Admin: admin@complaintcare.com</p>
          <p>Employee: ravi.employee@complaintcare.com</p>
          <p>Customer: rahul.customer@example.com</p>
        </div>
      </div>
    </div>
  );
}
