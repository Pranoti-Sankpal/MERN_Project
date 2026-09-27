export function roleHomePath(role) {
  if (role === 'ADMIN') return '/admin/dashboard';
  if (role === 'EMPLOYEE') return '/employee/dashboard';
  if (role === 'CUSTOMER') return '/customer/dashboard';
  return '/login';
}
