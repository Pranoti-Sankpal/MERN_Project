export default function EmptyState({ title = 'Nothing here yet', description = '' }) {
  return (
    <div className="text-center py-16">
      <p className="text-slate-600 font-medium">{title}</p>
      {description && <p className="text-slate-400 text-sm mt-1">{description}</p>}
    </div>
  );
}
