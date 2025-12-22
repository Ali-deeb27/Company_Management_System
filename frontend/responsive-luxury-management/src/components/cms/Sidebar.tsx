import React from 'react';
import { UserRole } from './types';
import {
  LayoutDashboard,
  Users,
  Building2,
  GraduationCap,
  FolderKanban,
  CheckSquare,
  Clock,
  DollarSign,
  Calendar,
  FileText,
  BarChart3,
  LogOut,
  ChevronLeft,
  ChevronRight,
  User,
  Briefcase
} from 'lucide-react';

interface SidebarProps {
  role: UserRole;
  currentPage: string;
  onNavigate: (page: string) => void;
  isCollapsed: boolean;
  onToggleCollapse: () => void;
  onLogout: () => void;
  userName: string;
}

interface NavItem {
  id: string;
  label: string;
  icon: React.ReactNode;
  roles: UserRole[];
}

const navItems: NavItem[] = [
  { id: 'dashboard', label: 'Dashboard', icon: <LayoutDashboard size={20} />, roles: ['admin', 'hr', 'employee', 'intern', 'accountant'] },
  { id: 'employees', label: 'Employees', icon: <Users size={20} />, roles: ['admin', 'hr'] },
  { id: 'departments', label: 'Departments', icon: <Building2 size={20} />, roles: ['admin', 'hr'] },
  { id: 'interns', label: 'Interns', icon: <GraduationCap size={20} />, roles: ['admin', 'hr'] },
  { id: 'projects', label: 'Projects', icon: <FolderKanban size={20} />, roles: ['admin', 'employee'] },
  { id: 'tasks', label: 'Tasks', icon: <CheckSquare size={20} />, roles: ['admin', 'employee', 'intern'] },
  { id: 'attendance', label: 'Attendance', icon: <Clock size={20} />, roles: ['admin', 'hr', 'employee', 'intern'] },
  { id: 'payroll', label: 'Payroll', icon: <DollarSign size={20} />, roles: ['admin', 'hr', 'accountant', 'employee'] },
  { id: 'events', label: 'Events', icon: <Calendar size={20} />, roles: ['admin', 'hr', 'employee', 'intern'] },
  { id: 'documents', label: 'Documents', icon: <FileText size={20} />, roles: ['admin', 'hr', 'employee', 'intern'] },
  { id: 'reports', label: 'Reports', icon: <BarChart3 size={20} />, roles: ['admin', 'accountant'] },
  { id: 'profile', label: 'My Profile', icon: <User size={20} />, roles: ['employee', 'intern'] },
  { id: 'internship', label: 'My Internship', icon: <Briefcase size={20} />, roles: ['intern'] },
];

const Sidebar: React.FC<SidebarProps> = ({
  role,
  currentPage,
  onNavigate,
  isCollapsed,
  onToggleCollapse,
  onLogout,
  userName
}) => {
  const filteredNavItems = navItems.filter(item => item.roles.includes(role));

  const getRoleLabel = (role: UserRole): string => {
    const labels: Record<UserRole, string> = {
      admin: 'Administrator',
      hr: 'HR Manager',
      employee: 'Employee',
      intern: 'Intern',
      accountant: 'Accountant'
    };
    return labels[role];
  };

  return (
    <aside
      className={`fixed left-0 top-0 h-full bg-[#0A1929] text-white transition-all duration-300 z-50 flex flex-col ${
        isCollapsed ? 'w-20' : 'w-64'
      }`}
    >
      {/* Logo Section */}
      <div className="p-4 border-b border-[#1E3A5F]">
        <div className="flex items-center justify-between">
          <div className={`flex items-center gap-3 ${isCollapsed ? 'justify-center w-full' : ''}`}>
            <div className="w-10 h-10 bg-gradient-to-br from-[#D4AF37] to-[#B8962E] rounded-lg flex items-center justify-center">
              <Building2 size={24} className="text-[#0A1929]" />
            </div>
            {!isCollapsed && (
              <div>
                <h1 className="text-lg font-semibold text-[#D4AF37]">CMS</h1>
                <p className="text-xs text-gray-400">Management System</p>
              </div>
            )}
          </div>
          <button
            onClick={onToggleCollapse}
            className={`p-1.5 rounded-lg hover:bg-[#1E3A5F] transition-colors ${isCollapsed ? 'hidden' : ''}`}
          >
            <ChevronLeft size={18} className="text-gray-400" />
          </button>
        </div>
      </div>

      {/* User Info */}
      {!isCollapsed && (
        <div className="p-4 border-b border-[#1E3A5F]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#1E3A5F] to-[#2D4A6F] flex items-center justify-center">
              <User size={20} className="text-[#D4AF37]" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">{userName}</p>
              <p className="text-xs text-[#D4AF37]">{getRoleLabel(role)}</p>
            </div>
          </div>
        </div>
      )}

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto py-4 px-3">
        <ul className="space-y-1">
          {filteredNavItems.map(item => (
            <li key={item.id}>
              <button
                onClick={() => onNavigate(item.id)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 ${
                  currentPage === item.id
                    ? 'bg-[#D4AF37] text-[#0A1929] font-medium'
                    : 'text-gray-300 hover:bg-[#1E3A5F] hover:text-white'
                } ${isCollapsed ? 'justify-center' : ''}`}
                title={isCollapsed ? item.label : undefined}
              >
                <span className={currentPage === item.id ? 'text-[#0A1929]' : ''}>{item.icon}</span>
                {!isCollapsed && <span className="text-sm">{item.label}</span>}
              </button>
            </li>
          ))}
        </ul>
      </nav>

      {/* Collapse Toggle (Mobile) */}
      {isCollapsed && (
        <div className="p-3 border-t border-[#1E3A5F]">
          <button
            onClick={onToggleCollapse}
            className="w-full p-2 rounded-lg hover:bg-[#1E3A5F] transition-colors flex justify-center"
          >
            <ChevronRight size={18} className="text-gray-400" />
          </button>
        </div>
      )}

      {/* Logout */}
      <div className="p-3 border-t border-[#1E3A5F]">
        <button
          onClick={onLogout}
          className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-gray-300 hover:bg-red-500/20 hover:text-red-400 transition-all ${
            isCollapsed ? 'justify-center' : ''
          }`}
          title={isCollapsed ? 'Logout' : undefined}
        >
          <LogOut size={20} />
          {!isCollapsed && <span className="text-sm">Logout</span>}
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
