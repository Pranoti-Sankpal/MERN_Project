import { NavLink } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

const LINKS = {
  ADMIN: [
    { to: '/admin/dashboard', label: 'Dashboard' },
    { to: '/admin/complaints', label: 'All Complaints' },
    { to: '/admin/customers', label: 'Customers' },
    { to: '/admin/employees', label: 'Employees' },
    { to: '/admin/categories', label: 'Categories' },
    { to: '/admin/profile', label: 'Profile' },
  ],
  EMPLOYEE: [
    { to: '/employee/dashboard', label: 'Dashboard' },
    { to: '/employee/complaints', label: 'Assigned Complaints' },
    { to: '/employee/profile', label: 'Profile' },
  ],
  CUSTOMER: [
    { to: '/customer/dashboard', label: 'Dashboard' },
    { to: '/customer/complaints', label: 'My Complaints' },
    { to: '/customer/complaints/new', label: 'Create Complaint' },
    { to: '/customer/profile', label: 'Profile' },
  ],
};

export default function Sidebar() {
  const { user } = useAuth();
  const links = user ? LINKS[user.role] || [] : [];

  return (
    <aside className="w-56 shrink-0 bg-white border-r border-slate-200 h-[calc(100vh-4rem)] sticky top-16 py-4">
      <nav className="flex flex-col gap-1 px-3">
        {links.map((link) => (
          <NavLink
            key={link.to}
            to={link.to}
            end
            className={({ isActive }) =>
              `px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                isActive ? 'bg-brand-50 text-brand-700' : 'text-slate-600 hover:bg-slate-100'
              }`
            }
          >
            {link.label}
          </NavLink>
        ))}
      </nav>
    </aside>
  );
}
