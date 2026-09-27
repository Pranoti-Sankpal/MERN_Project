import { useEffect, useState } from 'react';
import { categoryService } from '../../services/categoryService';
import FormInput from '../../components/FormInput';
import ErrorMessage from '../../components/ErrorMessage';
import SuccessMessage from '../../components/SuccessMessage';
import LoadingSpinner from '../../components/LoadingSpinner';
import Modal from '../../components/Modal';

export default function Categories() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const [form, setForm] = useState({ name: '', description: '' });
  const [editing, setEditing] = useState(null); // category being edited, or null
  const [deleteTarget, setDeleteTarget] = useState(null);

  function load() {
    setLoading(true);
    categoryService
      .getCategories()
      .then((res) => setCategories(res.data.categories))
      .catch((err) => setError(err.response?.data?.message || 'Failed to load categories.'))
      .finally(() => setLoading(false));
  }

  useEffect(load, []);

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setSuccess('');
    if (!form.name.trim()) {
      setError('Category name is required.');
      return;
    }
    try {
      if (editing) {
        await categoryService.updateCategory(editing.id, form);
        setSuccess('Category updated successfully.');
      } else {
        await categoryService.createCategory(form);
        setSuccess('Category created successfully.');
      }
      setForm({ name: '', description: '' });
      setEditing(null);
      load();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save category.');
    }
  }

  function startEdit(cat) {
    setEditing(cat);
    setForm({ name: cat.name, description: cat.description || '' });
  }

  function cancelEdit() {
    setEditing(null);
    setForm({ name: '', description: '' });
  }

  async function confirmDelete() {
    try {
      await categoryService.deleteCategory(deleteTarget.id);
      setDeleteTarget(null);
      load();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to delete category.');
      setDeleteTarget(null);
    }
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-slate-800 mb-6">Complaint Categories</h1>

      <div className="grid md:grid-cols-3 gap-6">
        <form onSubmit={handleSubmit} className="card space-y-3 h-fit">
          <h2 className="font-semibold text-slate-700">{editing ? 'Edit Category' : 'Add Category'}</h2>
          <ErrorMessage message={error} />
          <SuccessMessage message={success} />
          <FormInput label="Name" value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} />
          <FormInput
            label="Description"
            value={form.description}
            onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
          />
          <div className="flex gap-2">
            <button className="btn-primary flex-1">{editing ? 'Update' : 'Add'}</button>
            {editing && (
              <button type="button" onClick={cancelEdit} className="btn-secondary flex-1">
                Cancel
              </button>
            )}
          </div>
        </form>

        <div className="md:col-span-2">
          {loading ? (
            <LoadingSpinner />
          ) : (
            <div className="card !p-0 overflow-x-auto">
              <table className="min-w-full divide-y divide-slate-200 text-sm">
                <thead className="bg-slate-50">
                  <tr>
                    <th className="px-4 py-3 text-left font-semibold text-slate-600">Name</th>
                    <th className="px-4 py-3 text-left font-semibold text-slate-600">Description</th>
                    <th className="px-4 py-3 text-left font-semibold text-slate-600"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {categories.map((c) => (
                    <tr key={c.id} className="hover:bg-slate-50">
                      <td className="px-4 py-3 font-medium text-slate-800">{c.name}</td>
                      <td className="px-4 py-3 text-slate-600">{c.description || '-'}</td>
                      <td className="px-4 py-3 text-right space-x-3">
                        <button onClick={() => startEdit(c)} className="text-brand-600 hover:underline">
                          Edit
                        </button>
                        <button onClick={() => setDeleteTarget(c)} className="text-red-600 hover:underline">
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      <Modal open={!!deleteTarget} title="Delete category?" onClose={() => setDeleteTarget(null)}>
        <p className="text-sm text-slate-600 mb-4">
          Are you sure you want to delete "{deleteTarget?.name}"? Complaints in this category will become
          Uncategorized.
        </p>
        <div className="flex gap-2">
          <button onClick={confirmDelete} className="btn-danger flex-1">
            Delete
          </button>
          <button onClick={() => setDeleteTarget(null)} className="btn-secondary flex-1">
            Cancel
          </button>
        </div>
      </Modal>
    </div>
  );
}
