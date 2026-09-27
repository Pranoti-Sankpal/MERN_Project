import { Routes, Route, Navigate } from 'react-router-dom';
import ProtectedRoute from './routes/ProtectedRoute';
import RoleRoute from './routes/RoleRoute';
import DashboardLayout from './layouts/DashboardLayout';

import Login from './pages/public/Login';
import Register from './pages/public/Register';
import Unauthorized from './pages/public/Unauthorized';
import NotFound from './pages/public/NotFound';

import CustomerDashboard from './pages/customer/CustomerDashboard';
import MyComplaints from './pages/customer/MyComplaints';
import CreateComplaint from './pages/customer/CreateComplaint';
import CustomerComplaintDetails from './pages/customer/ComplaintDetails';
import CustomerProfile from './pages/customer/CustomerProfile';

import EmployeeDashboard from './pages/employee/EmployeeDashboard';
import AssignedComplaints from './pages/employee/AssignedComplaints';
import EmployeeComplaintDetails from './pages/employee/ComplaintDetails';
import EmployeeProfile from './pages/employee/EmployeeProfile';

import AdminDashboard from './pages/admin/AdminDashboard';
import AllComplaints from './pages/admin/AllComplaints';
import AdminComplaintDetails from './pages/admin/ComplaintDetails';
import Customers from './pages/admin/Customers';
import Employees from './pages/admin/Employees';
import CreateEmployee from './pages/admin/CreateEmployee';
import Categories from './pages/admin/Categories';
import AdminProfile from './pages/admin/AdminProfile';

import { useAuth } from './hooks/useAuth';
import { roleHomePath } from './utils/roleHome';

function RootRedirect() {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" replace />;
  return <Navigate to={roleHomePath(user.role)} replace />;
}

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<RootRedirect />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/unauthorized" element={<Unauthorized />} />

      <Route element={<ProtectedRoute />}>
        {/* CUSTOMER */}
        <Route element={<RoleRoute roles={['CUSTOMER']} />}>
          <Route element={<DashboardLayout />}>
            <Route path="/customer/dashboard" element={<CustomerDashboard />} />
            <Route path="/customer/complaints" element={<MyComplaints />} />
            <Route path="/customer/complaints/new" element={<CreateComplaint />} />
            <Route path="/customer/complaints/:id" element={<CustomerComplaintDetails />} />
            <Route path="/customer/profile" element={<CustomerProfile />} />
          </Route>
        </Route>

        {/* EMPLOYEE */}
        <Route element={<RoleRoute roles={['EMPLOYEE']} />}>
          <Route element={<DashboardLayout />}>
            <Route path="/employee/dashboard" element={<EmployeeDashboard />} />
            <Route path="/employee/complaints" element={<AssignedComplaints />} />
            <Route path="/employee/complaints/:id" element={<EmployeeComplaintDetails />} />
            <Route path="/employee/profile" element={<EmployeeProfile />} />
          </Route>
        </Route>

        {/* ADMIN */}
        <Route element={<RoleRoute roles={['ADMIN']} />}>
          <Route element={<DashboardLayout />}>
            <Route path="/admin/dashboard" element={<AdminDashboard />} />
            <Route path="/admin/complaints" element={<AllComplaints />} />
            <Route path="/admin/complaints/:id" element={<AdminComplaintDetails />} />
            <Route path="/admin/customers" element={<Customers />} />
            <Route path="/admin/employees" element={<Employees />} />
            <Route path="/admin/employees/new" element={<CreateEmployee />} />
            <Route path="/admin/categories" element={<Categories />} />
            <Route path="/admin/profile" element={<AdminProfile />} />
          </Route>
        </Route>
      </Route>

      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}
