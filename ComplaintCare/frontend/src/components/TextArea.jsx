export default function TextArea({ label, error, className = '', ...props }) {
  return (
    <div className={className}>
      {label && <label className="label">{label}</label>}
      <textarea className="input min-h-[100px]" {...props} />
      {error && <p className="text-xs text-red-600 mt-1">{error}</p>}
    </div>
  );
}
