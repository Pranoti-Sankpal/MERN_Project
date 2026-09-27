export const STATUS_STYLES = {
  SUBMITTED: 'bg-slate-100 text-slate-700 border-slate-300',
  ASSIGNED: 'bg-blue-100 text-blue-700 border-blue-300',
  IN_PROGRESS: 'bg-amber-100 text-amber-700 border-amber-300',
  RESOLVED: 'bg-emerald-100 text-emerald-700 border-emerald-300',
  CLOSED: 'bg-gray-200 text-gray-600 border-gray-300',
};

export const PRIORITY_STYLES = {
  LOW: 'bg-slate-100 text-slate-600 border-slate-300',
  MEDIUM: 'bg-blue-100 text-blue-700 border-blue-300',
  HIGH: 'bg-orange-100 text-orange-700 border-orange-300',
  URGENT: 'bg-red-100 text-red-700 border-red-300',
};

export function formatStatus(status) {
  return status ? status.replace('_', ' ') : '';
}
