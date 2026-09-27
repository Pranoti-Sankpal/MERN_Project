import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { complaintService } from '../../services/complaintService';
import ComplaintTable from '../../components/ComplaintTable';
import ComplaintFilters from '../../components/ComplaintFilters';
import LoadingSpinner from '../../components/LoadingSpinner';
import ErrorMessage from '../../components/ErrorMessage';

export default function MyComplaints() {
  const [complaints, setComplaints] = useState([]);
  const [filters, setFilters] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    setLoading(true);
    complaintService
      .getComplaints(filters)
      .then((res) => setComplaints(res.data.complaints))
      .catch((err) => setError(err.response?.data?.message || 'Failed to load complaints.'))
      .finally(() => setLoading(false));
  }, [filters]);

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-slate-800">My Complaints</h1>
        <Link to="/customer/complaints/new" className="btn-primary">
          + Create Complaint
        </Link>
      </div>
      <ErrorMessage message={error} />
      <ComplaintFilters filters={filters} onChange={setFilters} />
      {loading ? (
        <LoadingSpinner />
      ) : (
        <ComplaintTable complaints={complaints} basePath="/customer/complaints" columns={['category', 'employee']} />
      )}
    </div>
  );
}
