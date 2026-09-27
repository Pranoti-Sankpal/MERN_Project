import { useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { userService } from '../services/userService';
import FormInput from './FormInput';
import ErrorMessage from './ErrorMessage';
import SuccessMessage from './SuccessMessage';

export default function ProfileView() {
  const { user } = useAuth();
  const [name, setName] = useState(user.name);
  const [phone, setPhone] = useState(user.phone || '');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setSuccess('');
    if (!name.trim()) {
      setError('Name cannot be empty.');
      return;
    }
    setLoading(true);
    try {
      await userService.updateUser(user.id, { name, phone });
      setSuccess('Profile updated successfully.');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update profile.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-md">
      <h1 className="text-2xl font-bold text-slate-800 mb-6">My Profile</h1>
      <form onSubmit={handleSubmit} className="card space-y-4">
        <ErrorMessage message={error} />
        <SuccessMessage message={success} />
        <FormInput label="Full name" value={name} onChange={(e) => setName(e.target.value)} />
        <FormInput label="Phone" value={phone} onChange={(e) => setPhone(e.target.value)} />
        <FormInput label="Email" value={user.email} disabled />
        <FormInput label="Role" value={user.role} disabled />
        <button disabled={loading} className="btn-primary w-full">
          {loading ? 'Saving...' : 'Save Changes'}
        </button>
      </form>
    </div>
  );
}
