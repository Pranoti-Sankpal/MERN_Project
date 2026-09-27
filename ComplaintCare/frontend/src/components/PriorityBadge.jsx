import { PRIORITY_STYLES } from '../utils/badgeStyles';

export default function PriorityBadge({ priority }) {
  const style = PRIORITY_STYLES[priority] || 'bg-slate-100 text-slate-700 border-slate-300';
  return (
    <span className={`inline-block px-2.5 py-1 rounded-full text-xs font-semibold border ${style}`}>
      {priority}
    </span>
  );
}
