export default function ErrorMessage({ message }) {
  if (!message) return null;
  return (
    <div className="rounded-md border border-red-300 bg-red-50 text-red-700 text-sm px-4 py-3 mb-4">
      {message}
    </div>
  );
}
