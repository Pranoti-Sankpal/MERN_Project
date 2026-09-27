import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { userService } from '../../services/userService';
import LoadingSpinner from '../../components/LoadingSpinner';
import ErrorMessage from '../../components/ErrorMessage';
import EmptyState from '../../components/EmptyState';
import { formatDate } from '../../utils/dateFormat';

export default function Employees() {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    userService
      .getUsers({ role: 'EMPLOYEE' })
      .then((res) => setEmployees(res.data.users))
      .catch((err) => setError(err.response?.data?.message || 'Failed to load employees.'))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-slate-800">Employees</h1>
        <Link to="/admin/employees/new" className="btn-primary">
          + Create Employee
        </Link>
      </div>
      <ErrorMessage message={error} />
      {loading ? (
        <LoadingSpinner />
      ) : employees.length === 0 ? (
        <EmptyState title="No employees yet" description="Create your first employee account." />
      ) : (
        <div className="card !p-0 overflow-x-auto">
          <table className="min-w-full divide-y divide-slate-200 text-sm">
            <thead className="bg-slate-50">
              <tr>
                <th className="px-4 py-3 text-left font-semibold text-slate-600">Name</th>
                <th className="px-4 py-3 text-left font-semibold text-slate-600">Email</th>
                <th className="px-4 py-3 text-left font-semibold text-slate-600">Phone</th>
                <th className="px-4 py-3 text-left font-semibold text-slate-600">Joined</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {employees.map((e) => (
                <tr key={e.id} className="hover:bg-slate-50">
                  <td className="px-4 py-3 font-medium text-slate-800">{e.name}</td>
                  <td className="px-4 py-3 text-slate-600">{e.email}</td>
                  <td className="px-4 py-3 text-slate-600">{e.phone || '-'}</td>
                  <td className="px-4 py-3 text-slate-500">{formatDate(e.created_at)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
