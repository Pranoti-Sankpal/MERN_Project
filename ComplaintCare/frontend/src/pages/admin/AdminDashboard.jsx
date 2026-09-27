import { useEffect, useState } from 'react';
import { dashboardService } from '../../services/dashboardService';
import DashboardCard from '../../components/DashboardCard';
import ComplaintTable from '../../components/ComplaintTable';
import LoadingSpinner from '../../components/LoadingSpinner';
import ErrorMessage from '../../components/ErrorMessage';

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [categoryBreakdown, setCategoryBreakdown] = useState([]);
  const [priorityBreakdown, setPriorityBreakdown] = useState([]);
  const [recent, setRecent] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    Promise.all([
      dashboardService.getStats(),
      dashboardService.getCategoryBreakdown(),
      dashboardService.getPriorityBreakdown(),
      dashboardService.getRecentComplaints(),
    ])
      .then(([statsRes, catRes, prioRes, recentRes]) => {
        setStats(statsRes.data.stats);
        setCategoryBreakdown(catRes.data.breakdown);
        setPriorityBreakdown(prioRes.data.breakdown);
        setRecent(recentRes.data.complaints);
      })
      .catch((err) => setError(err.response?.data?.message || 'Failed to load dashboard.'))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <LoadingSpinner label="Loading dashboard..." />;

  return (
    <div>
      <h1 className="text-2xl font-bold text-slate-800 mb-6">Admin Dashboard</h1>
      <ErrorMessage message={error} />

      {stats && (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
          <DashboardCard label="Total" value={stats.total} />
          <DashboardCard label="Submitted" value={stats.submitted} accent="text-slate-600" />
          <DashboardCard label="Assigned" value={stats.assigned} accent="text-blue-600" />
          <DashboardCard label="In Progress" value={stats.in_progress} accent="text-amber-600" />
          <DashboardCard label="Resolved" value={stats.resolved} accent="text-emerald-600" />
          <DashboardCard label="Closed" value={stats.closed} accent="text-slate-500" />
        </div>
      )}

      <div className="grid md:grid-cols-2 gap-6 mb-8">
        <div className="card">
          <h2 className="font-semibold text-slate-700 mb-3">Complaints by Category</h2>
          {categoryBreakdown.length === 0 ? (
            <p className="text-sm text-slate-400">No data yet.</p>
          ) : (
            <ul className="space-y-2">
              {categoryBreakdown.map((row) => (
                <li key={row.category} className="flex justify-between text-sm">
                  <span className="text-slate-600">{row.category}</span>
                  <span className="font-semibold text-slate-800">{row.count}</span>
                </li>
              ))}
            </ul>
          )}
        </div>
        <div className="card">
          <h2 className="font-semibold text-slate-700 mb-3">Complaints by Priority</h2>
          {priorityBreakdown.length === 0 ? (
            <p className="text-sm text-slate-400">No data yet.</p>
          ) : (
            <ul className="space-y-2">
              {priorityBreakdown.map((row) => (
                <li key={row.priority} className="flex justify-between text-sm">
                  <span className="text-slate-600">{row.priority}</span>
                  <span className="font-semibold text-slate-800">{row.count}</span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      <h2 className="text-lg font-semibold text-slate-700 mb-3">Recent Complaints</h2>
      <ComplaintTable complaints={recent} basePath="/admin/complaints" />
    </div>
  );
}
