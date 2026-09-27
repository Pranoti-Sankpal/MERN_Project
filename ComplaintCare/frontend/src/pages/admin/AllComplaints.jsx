import { useEffect, useState } from 'react';
import { complaintService } from '../../services/complaintService';
import { categoryService } from '../../services/categoryService';
import { userService } from '../../services/userService';
import ComplaintTable from '../../components/ComplaintTable';
import ComplaintFilters from '../../components/ComplaintFilters';
import LoadingSpinner from '../../components/LoadingSpinner';
import ErrorMessage from '../../components/ErrorMessage';

export default function AllComplaints() {
  const [complaints, setComplaints] = useState([]);
  const [categories, setCategories] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [filters, setFilters] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    categoryService.getCategories().then((res) => setCategories(res.data.categories));
    userService.getUsers({ role: 'EMPLOYEE' }).then((res) => setEmployees(res.data.users));
  }, []);

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
      <h1 className="text-2xl font-bold text-slate-800 mb-6">All Complaints</h1>
      <ErrorMessage message={error} />
      <ComplaintFilters
        filters={filters}
        onChange={setFilters}
        categories={categories}
        employees={employees}
        showCategory
        showEmployee
      />
      {loading ? <LoadingSpinner /> : <ComplaintTable complaints={complaints} basePath="/admin/complaints" />}
    </div>
  );
}
