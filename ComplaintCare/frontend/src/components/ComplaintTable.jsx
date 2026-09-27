import { Link } from 'react-router-dom';
import StatusBadge from './StatusBadge';
import PriorityBadge from './PriorityBadge';
import { formatDate } from '../utils/dateFormat';
import EmptyState from './EmptyState';

// basePath: e.g. '/admin/complaints', '/employee/complaints', '/customer/complaints'
// columns: optional array to control which extra columns show ('customer' | 'employee' | 'category')
export default function ComplaintTable({ complaints, basePath, columns = ['category', 'customer', 'employee'] }) {
  if (!complaints || complaints.length === 0) {
    return <EmptyState title="No complaints found" description="Try adjusting your filters or search." />;
  }

  return (
    <div className="overflow-x-auto card !p-0">
      <table className="min-w-full divide-y divide-slate-200 text-sm">
        <thead className="bg-slate-50">
          <tr>
            <th className="px-4 py-3 text-left font-semibold text-slate-600">ID</th>
            <th className="px-4 py-3 text-left font-semibold text-slate-600">Subject</th>
            {columns.includes('category') && (
              <th className="px-4 py-3 text-left font-semibold text-slate-600">Category</th>
            )}
            {columns.includes('customer') && (
              <th className="px-4 py-3 text-left font-semibold text-slate-600">Customer</th>
            )}
            {columns.includes('employee') && (
              <th className="px-4 py-3 text-left font-semibold text-slate-600">Employee</th>
            )}
            <th className="px-4 py-3 text-left font-semibold text-slate-600">Priority</th>
            <th className="px-4 py-3 text-left font-semibold text-slate-600">Status</th>
            <th className="px-4 py-3 text-left font-semibold text-slate-600">Created</th>
            <th className="px-4 py-3 text-left font-semibold text-slate-600"></th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {complaints.map((c) => (
            <tr key={c.id} className="hover:bg-slate-50">
              <td className="px-4 py-3 text-slate-500">#{c.id}</td>
              <td className="px-4 py-3 font-medium text-slate-800 max-w-xs truncate">{c.subject}</td>
              {columns.includes('category') && (
                <td className="px-4 py-3 text-slate-600">{c.category_name || 'Uncategorized'}</td>
              )}
              {columns.includes('customer') && (
                <td className="px-4 py-3 text-slate-600">{c.customer_name || '-'}</td>
              )}
              {columns.includes('employee') && (
                <td className="px-4 py-3 text-slate-600">{c.employee_name || 'Unassigned'}</td>
              )}
              <td className="px-4 py-3">
                <PriorityBadge priority={c.priority} />
              </td>
              <td className="px-4 py-3">
                <StatusBadge status={c.status} />
              </td>
              <td className="px-4 py-3 text-slate-500 whitespace-nowrap">{formatDate(c.created_at)}</td>
              <td className="px-4 py-3">
                <Link to={`${basePath}/${c.id}`} className="text-brand-600 hover:underline font-medium">
                  View
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
