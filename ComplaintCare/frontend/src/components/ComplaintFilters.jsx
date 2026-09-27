import SelectInput from './SelectInput';
import SearchBar from './SearchBar';

// A shared filter bar. Pass `showCategory`/`showEmployee` to reveal extra
// filters only where relevant (e.g. Admin sees employee filter).
export default function ComplaintFilters({
  filters,
  onChange,
  categories = [],
  employees = [],
  showCategory = false,
  showEmployee = false,
  showSearch = true,
}) {
  function set(field, value) {
    onChange({ ...filters, [field]: value });
  }

  return (
    <div className="flex flex-wrap gap-3 mb-4 items-end">
      {showSearch && (
        <SearchBar value={filters.search || ''} onChange={(v) => set('search', v)} placeholder="Search subject..." />
      )}
      <SelectInput value={filters.status || ''} onChange={(e) => set('status', e.target.value)} className="w-44">
        <option value="">All statuses</option>
        <option value="SUBMITTED">Submitted</option>
        <option value="ASSIGNED">Assigned</option>
        <option value="IN_PROGRESS">In Progress</option>
        <option value="RESOLVED">Resolved</option>
        <option value="CLOSED">Closed</option>
      </SelectInput>
      <SelectInput value={filters.priority || ''} onChange={(e) => set('priority', e.target.value)} className="w-40">
        <option value="">All priorities</option>
        <option value="LOW">Low</option>
        <option value="MEDIUM">Medium</option>
        <option value="HIGH">High</option>
        <option value="URGENT">Urgent</option>
      </SelectInput>
      {showCategory && (
        <SelectInput
          value={filters.category_id || ''}
          onChange={(e) => set('category_id', e.target.value)}
          className="w-44"
        >
          <option value="">All categories</option>
          {categories.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </SelectInput>
      )}
      {showEmployee && (
        <SelectInput
          value={filters.assigned_employee_id || ''}
          onChange={(e) => set('assigned_employee_id', e.target.value)}
          className="w-48"
        >
          <option value="">All employees</option>
          {employees.map((e) => (
            <option key={e.id} value={e.id}>
              {e.name}
            </option>
          ))}
        </SelectInput>
      )}
    </div>
  );
}
