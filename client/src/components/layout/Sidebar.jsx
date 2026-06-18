import { NavLink } from 'react-router-dom';
import { LayoutDashboard, User, FileText, Building2, BarChart3, ShieldCheck, TrendingUp, Star } from 'lucide-react';
import useAuth from '../../hooks/useAuth';

const Sidebar = () => {
  const { user } = useAuth();

  const studentLinks = [
    { to: '/dashboard', icon: <LayoutDashboard size={18} />, label: 'Dashboard' },
    { to: '/profile', icon: <User size={18} />, label: 'My Profile' },
    { to: '/resume', icon: <FileText size={18} />, label: 'Resume' },
    { to: '/companies', icon: <Building2 size={18} />, label: 'Companies' },
    { to: '/eligibility', icon: <ShieldCheck size={18} />, label: 'Eligibility' },
    { to: '/prediction', icon: <TrendingUp size={18} />, label: 'ML Prediction' },
    { to: '/recommendations', icon: <Star size={18} />, label: 'Recommendations' },
  ];

  const adminLinks = [
    { to: '/admin', icon: <LayoutDashboard size={18} />, label: 'Admin Dashboard' },
    { to: '/admin/students', icon: <User size={18} />, label: 'Students' },
    { to: '/admin/companies', icon: <Building2 size={18} />, label: 'Companies' },
    { to: '/admin/analytics', icon: <BarChart3 size={18} />, label: 'Analytics' },
  ];

  const links = user?.role === 'admin' ? adminLinks : studentLinks;

  return (
    <aside className="w-56 bg-white border-r border-gray-200 min-h-screen px-3 py-6">
      <nav className="flex flex-col gap-1">
        {links.map((link) => (
          <NavLink
            key={link.to}
            to={link.to}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
                isActive
                  ? 'bg-primary-50 text-primary-700'
                  : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
              }`
            }
          >
            {link.icon}
            {link.label}
          </NavLink>
        ))}
      </nav>
    </aside>
  );
};

export default Sidebar;
