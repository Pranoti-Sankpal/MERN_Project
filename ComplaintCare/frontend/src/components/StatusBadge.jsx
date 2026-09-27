import { STATUS_STYLES, formatStatus } from '../utils/badgeStyles';

export default function StatusBadge({ status }) {
  const style = STATUS_STYLES[status] || 'bg-slate-100 text-slate-700 border-slate-300';
  return (
    <span className={`inline-block px-2.5 py-1 rounded-full text-xs font-semibold border ${style}`}>
      {formatStatus(status)}
    </span>
  );
}
