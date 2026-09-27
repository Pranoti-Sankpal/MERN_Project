import { useEffect, useState } from 'react';
import { complaintService } from '../../services/complaintService';
import ComplaintTable from '../../components/ComplaintTable';
import ComplaintFilters from '../../components/ComplaintFilters';
import LoadingSpinner from '../../components/LoadingSpinner';
import ErrorMessage from '../../components/ErrorMessage';

export default function AssignedComplaints() {
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
      <h1 className="text-2xl font-bold text-slate-800 mb-6">Assigned Complaints</h1>
      <ErrorMessage message={error} />
      <ComplaintFilters filters={filters} onChange={setFilters} />
      {loading ? (
        <LoadingSpinner />
      ) : (
        <ComplaintTable complaints={complaints} basePath="/employee/complaints" columns={['category', 'customer']} />
      )}
    </div>
  );
}
