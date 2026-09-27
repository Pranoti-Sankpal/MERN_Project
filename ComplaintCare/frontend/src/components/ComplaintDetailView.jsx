import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { complaintService } from '../services/complaintService';
import { userService } from '../services/userService';
import { categoryService } from '../services/categoryService';
import { useAuth } from '../hooks/useAuth';
import StatusBadge from './StatusBadge';
import PriorityBadge from './PriorityBadge';
import LoadingSpinner from './LoadingSpinner';
import ErrorMessage from './ErrorMessage';
import SuccessMessage from './SuccessMessage';
import SelectInput from './SelectInput';
import TextArea from './TextArea';
import { formatDate } from '../utils/dateFormat';

// Renders complaint details plus the actions relevant to the logged-in
// user's role. Ownership/permission is ultimately enforced by the
// backend; the UI simply hides actions that would be rejected anyway.
export default function ComplaintDetailView() {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [complaint, setComplaint] = useState(null);
  const [comments, setComments] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [actionLoading, setActionLoading] = useState(false);

  // Admin assignment form state
  const [assignForm, setAssignForm] = useState({ assigned_employee_id: '', category_id: '', priority: '' });
  // Employee resolution form state
  const [remarks, setRemarks] = useState('');
  // Comment box
  const [newComment, setNewComment] = useState('');

  function load() {
    setLoading(true);
    Promise.all([complaintService.getComplaintById(id), complaintService.getComments(id)])
      .then(([cRes, commentsRes]) => {
        setComplaint(cRes.data.complaint);
        setComments(commentsRes.data.comments);
        setAssignForm({
          assigned_employee_id: cRes.data.complaint.assigned_employee_id || '',
          category_id: cRes.data.complaint.category_id || '',
          priority: cRes.data.complaint.priority || '',
        });
      })
      .catch((err) => setError(err.response?.data?.message || 'Failed to load complaint.'))
      .finally(() => setLoading(false));
  }

  useEffect(() => {
    load();
    if (user.role === 'ADMIN') {
      userService.getUsers({ role: 'EMPLOYEE' }).then((res) => setEmployees(res.data.users));
      categoryService.getCategories().then((res) => setCategories(res.data.categories));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  async function withAction(fn) {
    setError('');
    setSuccess('');
    setActionLoading(true);
    try {
      await fn();
      setSuccess('Action completed successfully.');
      load();
    } catch (err) {
      setError(err.response?.data?.message || 'Action failed.');
    } finally {
      setActionLoading(false);
    }
  }

  async function handleAssign(e) {
    e.preventDefault();
    if (!assignForm.assigned_employee_id) {
      setError('Please select an employee to assign.');
      return;
    }
    withAction(() => complaintService.assignComplaint(id, assignForm));
  }

  async function handleStartWork() {
    withAction(() => complaintService.updateStatus(id, 'IN_PROGRESS'));
  }

  async function handleResolve(e) {
    e.preventDefault();
    if (!remarks.trim()) {
      setError('Resolution remarks are required.');
      return;
    }
    withAction(() => complaintService.resolveComplaint(id, remarks));
  }

  async function handleClose() {
    withAction(() => complaintService.closeComplaint(id));
  }

  async function handleAddComment(e) {
    e.preventDefault();
    if (!newComment.trim()) return;
    setActionLoading(true);
    try {
      await complaintService.addComment(id, newComment);
      setNewComment('');
      const commentsRes = await complaintService.getComments(id);
      setComments(commentsRes.data.comments);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to add comment.');
    } finally {
      setActionLoading(false);
    }
  }

  if (loading) return <LoadingSpinner label="Loading complaint..." />;
  if (!complaint) return <ErrorMessage message={error || 'Complaint not found.'} />;

  const isOwnerCustomer = user.role === 'CUSTOMER' && Number(complaint.customer_id) === Number(user.id);
  const isOwnerEmployee = user.role === 'EMPLOYEE' && Number(complaint.assigned_employee_id) === Number(user.id);
  const isAdmin = user.role === 'ADMIN';

  return (
    <div className="max-w-3xl">
      <button onClick={() => navigate(-1)} className="text-sm text-brand-600 hover:underline mb-4">
        &larr; Back
      </button>

      <ErrorMessage message={error} />
      <SuccessMessage message={success} />

      <div className="card mb-6">
        <div className="flex items-start justify-between mb-3">
          <div>
            <h1 className="text-xl font-bold text-slate-800">
              #{complaint.id} - {complaint.subject}
            </h1>
            <p className="text-sm text-slate-400 mt-1">Created {formatDate(complaint.created_at)}</p>
          </div>
          <div className="flex gap-2">
            <PriorityBadge priority={complaint.priority} />
            <StatusBadge status={complaint.status} />
          </div>
        </div>
        <p className="text-slate-700 whitespace-pre-wrap mb-4">{complaint.description}</p>
        <dl className="grid grid-cols-2 gap-3 text-sm text-slate-500">
          <div>
            <dt className="font-medium text-slate-600">Category</dt>
            <dd>{complaint.category_name || 'Uncategorized'}</dd>
          </div>
          <div>
            <dt className="font-medium text-slate-600">Customer</dt>
            <dd>{complaint.customer_name} ({complaint.customer_email})</dd>
          </div>
          <div>
            <dt className="font-medium text-slate-600">Assigned Employee</dt>
            <dd>{complaint.employee_name || 'Unassigned'}</dd>
          </div>
          <div>
            <dt className="font-medium text-slate-600">Last Updated</dt>
            <dd>{formatDate(complaint.updated_at)}</dd>
          </div>
        </dl>
        {complaint.resolution_remarks && (
          <div className="mt-4 rounded-md bg-emerald-50 border border-emerald-200 p-3 text-sm text-emerald-800">
            <p className="font-semibold mb-1">Resolution remarks</p>
            <p>{complaint.resolution_remarks}</p>
          </div>
        )}
      </div>

      {/* ADMIN: assign / categorize / prioritize */}
      {isAdmin && complaint.status === 'SUBMITTED' && (
        <div className="card mb-6">
          <h2 className="font-semibold text-slate-700 mb-3">Assign Complaint</h2>
          <form onSubmit={handleAssign} className="space-y-3">
            <SelectInput
              label="Category"
              value={assignForm.category_id}
              onChange={(e) => setAssignForm((f) => ({ ...f, category_id: e.target.value }))}
            >
              <option value="">Select category</option>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </SelectInput>
            <SelectInput
              label="Priority"
              value={assignForm.priority}
              onChange={(e) => setAssignForm((f) => ({ ...f, priority: e.target.value }))}
            >
              <option value="LOW">Low</option>
              <option value="MEDIUM">Medium</option>
              <option value="HIGH">High</option>
              <option value="URGENT">Urgent</option>
            </SelectInput>
            <SelectInput
              label="Assign to Employee"
              value={assignForm.assigned_employee_id}
              onChange={(e) => setAssignForm((f) => ({ ...f, assigned_employee_id: e.target.value }))}
            >
              <option value="">Select employee</option>
              {employees.map((emp) => (
                <option key={emp.id} value={emp.id}>
                  {emp.name}
                </option>
              ))}
            </SelectInput>
            <button disabled={actionLoading} className="btn-primary w-full">
              Assign Complaint
            </button>
          </form>
        </div>
      )}

      {/* EMPLOYEE: start work */}
      {isOwnerEmployee && complaint.status === 'ASSIGNED' && (
        <div className="card mb-6">
          <h2 className="font-semibold text-slate-700 mb-3">Start Work</h2>
          <button onClick={handleStartWork} disabled={actionLoading} className="btn-primary">
            Mark as In Progress
          </button>
        </div>
      )}

      {/* EMPLOYEE: resolve */}
      {isOwnerEmployee && complaint.status === 'IN_PROGRESS' && (
        <div className="card mb-6">
          <h2 className="font-semibold text-slate-700 mb-3">Resolve Complaint</h2>
          <form onSubmit={handleResolve} className="space-y-3">
            <TextArea
              label="Resolution remarks"
              value={remarks}
              onChange={(e) => setRemarks(e.target.value)}
              placeholder="Explain how the issue was resolved"
            />
            <button disabled={actionLoading} className="btn-primary w-full">
              Mark as Resolved
            </button>
          </form>
        </div>
      )}

      {/* CUSTOMER / ADMIN: close resolved complaint */}
      {(isOwnerCustomer || isAdmin) && complaint.status === 'RESOLVED' && (
        <div className="card mb-6">
          <h2 className="font-semibold text-slate-700 mb-3">Close Complaint</h2>
          <p className="text-sm text-slate-500 mb-3">
            If you are satisfied with the resolution, you can close this complaint. A closed complaint cannot be reopened.
          </p>
          <button onClick={handleClose} disabled={actionLoading} className="btn-primary">
            Close Complaint
          </button>
        </div>
      )}

      {/* Comments */}
      <div className="card">
        <h2 className="font-semibold text-slate-700 mb-3">Comments</h2>
        <div className="space-y-3 mb-4 max-h-72 overflow-y-auto">
          {comments.length === 0 && <p className="text-sm text-slate-400">No comments yet.</p>}
          {comments.map((c) => (
            <div key={c.id} className="border border-slate-100 rounded-md p-3 bg-slate-50">
              <div className="flex justify-between text-xs text-slate-400 mb-1">
                <span className="font-medium text-slate-600">
                  {c.user_name} <span className="text-slate-400">({c.user_role})</span>
                </span>
                <span>{formatDate(c.created_at)}</span>
              </div>
              <p className="text-sm text-slate-700">{c.comment}</p>
            </div>
          ))}
        </div>
        <form onSubmit={handleAddComment} className="flex gap-2">
          <input
            className="input"
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="Add a comment..."
          />
          <button disabled={actionLoading} className="btn-primary shrink-0">
            Post
          </button>
        </form>
      </div>
    </div>
  );
}
