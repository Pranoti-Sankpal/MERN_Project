import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { complaintService } from '../../services/complaintService';
import { categoryService } from '../../services/categoryService';
import FormInput from '../../components/FormInput';
import TextArea from '../../components/TextArea';
import SelectInput from '../../components/SelectInput';
import ErrorMessage from '../../components/ErrorMessage';

export default function CreateComplaint() {
  const [form, setForm] = useState({ subject: '', description: '', category_id: '', priority: 'MEDIUM' });
  const [categories, setCategories] = useState([]);
  const [errors, setErrors] = useState({});
  const [apiError, setApiError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    categoryService.getCategories().then((res) => setCategories(res.data.categories));
  }, []);

  function update(field, value) {
    setForm((f) => ({ ...f, [field]: value }));
  }

  function validate() {
    const errs = {};
    if (!form.subject.trim()) errs.subject = 'Subject is required.';
    else if (form.subject.length > 200) errs.subject = 'Subject must be under 200 characters.';
    if (!form.description.trim()) errs.description = 'Description is required.';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setApiError('');
    if (!validate()) return;

    setLoading(true);
    try {
      const res = await complaintService.createComplaint({
        subject: form.subject,
        description: form.description,
        category_id: form.category_id || null,
        priority: form.priority,
      });
      navigate(`/customer/complaints/${res.data.complaint.id}`);
    } catch (err) {
      setApiError(err.response?.data?.message || 'Failed to create complaint.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-xl">
      <h1 className="text-2xl font-bold text-slate-800 mb-6">Create Complaint</h1>
      <form onSubmit={handleSubmit} className="card space-y-4">
        <ErrorMessage message={apiError} />
        <FormInput
          label="Subject"
          value={form.subject}
          onChange={(e) => update('subject', e.target.value)}
          error={errors.subject}
          placeholder="Brief summary of the issue"
        />
        <TextArea
          label="Description"
          value={form.description}
          onChange={(e) => update('description', e.target.value)}
          error={errors.description}
          placeholder="Describe the issue in detail"
        />
        <SelectInput label="Category (optional)" value={form.category_id} onChange={(e) => update('category_id', e.target.value)}>
          <option value="">Select a category</option>
          {categories.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </SelectInput>
        <SelectInput label="Priority" value={form.priority} onChange={(e) => update('priority', e.target.value)}>
          <option value="LOW">Low</option>
          <option value="MEDIUM">Medium</option>
          <option value="HIGH">High</option>
          <option value="URGENT">Urgent</option>
        </SelectInput>
        <button type="submit" disabled={loading} className="btn-primary w-full">
          {loading ? 'Submitting...' : 'Submit Complaint'}
        </button>
      </form>
    </div>
  );
}
