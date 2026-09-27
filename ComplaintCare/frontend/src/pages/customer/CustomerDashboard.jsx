import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { dashboardService } from '../../services/dashboardService';
import DashboardCard from '../../components/DashboardCard';
import ComplaintTable from '../../components/ComplaintTable';
import LoadingSpinner from '../../components/LoadingSpinner';
import ErrorMessage from '../../components/ErrorMessage';

export default function CustomerDashboard() {
  const [stats, setStats] = useState(null);
  const [recent, setRecent] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    Promise.all([dashboardService.getStats(), dashboardService.getRecentComplaints()])
      .then(([statsRes, recentRes]) => {
        setStats(statsRes.data.stats);
        setRecent(recentRes.data.complaints);
      })
      .catch((err) => setError(err.response?.data?.message || 'Failed to load dashboard.'))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <LoadingSpinner label="Loading your dashboard..." />;

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-slate-800">My Dashboard</h1>
        <Link to="/customer/complaints/new" className="btn-primary">
          + Create Complaint
        </Link>
      </div>
      <ErrorMessage message={error} />
      {stats && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <DashboardCard label="Total Complaints" value={stats.total} />
          <DashboardCard label="Pending" value={stats.pending} accent="text-amber-600" />
          <DashboardCard label="Resolved" value={stats.resolved} accent="text-emerald-600" />
          <DashboardCard label="Closed" value={stats.closed} accent="text-slate-500" />
        </div>
      )}
      <h2 className="text-lg font-semibold text-slate-700 mb-3">Recent Complaints</h2>
      <ComplaintTable complaints={recent} basePath="/customer/complaints" columns={['category']} />
    </div>
  );
}
