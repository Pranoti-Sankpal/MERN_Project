export default function SuccessMessage({ message }) {
  if (!message) return null;
  return (
    <div className="rounded-md border border-emerald-300 bg-emerald-50 text-emerald-700 text-sm px-4 py-3 mb-4">
      {message}
    </div>
  );
}
