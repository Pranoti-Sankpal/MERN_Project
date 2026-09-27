import { Link } from 'react-router-dom';

export default function Unauthorized() {
  return (
    <div className="min-h-screen flex items-center justify-center flex-col gap-3 bg-slate-50">
      <h1 className="text-3xl font-bold text-slate-800">403</h1>
      <p className="text-slate-500">You do not have permission to view this page.</p>
      <Link to="/login" className="btn-primary">Back to login</Link>
    </div>
  );
}
