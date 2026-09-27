import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { userService } from '../../services/userService';
import FormInput from '../../components/FormInput';
import ErrorMessage from '../../components/ErrorMessage';
import SuccessMessage from '../../components/SuccessMessage';

export default function CreateEmployee() {
  const [form, setForm] = useState({ name: '', email: '', phone: '', password: '' });
  const [errors, setErrors] = useState({});
  const [apiError, setApiError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  function update(field, value) {
    setForm((f) => ({ ...f, [field]: value }));
  }

  function validate() {
    const errs = {};
    if (!form.name.trim()) errs.name = 'Name is required.';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) errs.email = 'A valid email is required.';
    if (form.password.length < 6) errs.password = 'Password must be at least 6 characters.';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setApiError('');
    setSuccess('');
    if (!validate()) return;

    setLoading(true);
    try {
      await userService.createEmployee(form);
      setSuccess('Employee account created successfully.');
      setTimeout(() => navigate('/admin/employees'), 1000);
    } catch (err) {
      setApiError(err.response?.data?.message || 'Failed to create employee.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-sm">
      <h1 className="text-2xl font-bold text-slate-800 mb-6">Create Employee</h1>
      <form onSubmit={handleSubmit} className="card space-y-4">
        <ErrorMessage message={apiError} />
        <SuccessMessage message={success} />
        <FormInput label="Full name" value={form.name} onChange={(e) => update('name', e.target.value)} error={errors.name} />
        <FormInput label="Email" type="email" value={form.email} onChange={(e) => update('email', e.target.value)} error={errors.email} />
        <FormInput label="Phone (optional)" value={form.phone} onChange={(e) => update('phone', e.target.value)} />
        <FormInput
          label="Temporary password"
          type="password"
          value={form.password}
          onChange={(e) => update('password', e.target.value)}
          error={errors.password}
        />
        <button disabled={loading} className="btn-primary w-full">
          {loading ? 'Creating...' : 'Create Employee'}
        </button>
      </form>
    </div>
  );
}
