import React, { useState } from 'react';
import { UserRole } from './types';
import {
  Bell,
  Search,
  Menu,
  X,
  ChevronDown,
  User,
  Settings,
  LogOut,
  Moon,
  Sun
} from 'lucide-react';

interface HeaderProps {
  role: UserRole;
  userName: string;
  currentPage: string;
  onMenuToggle: () => void;
  isSidebarCollapsed: boolean;
  onLogout: () => void;
}

const Header: React.FC<HeaderProps> = ({
  role,
  userName,
  currentPage,
  onMenuToggle,
  isSidebarCollapsed,
  onLogout
}) => {
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isDarkMode, setIsDarkMode] = useState(true);

  const notifications = [
    { id: 1, title: 'New task assigned', message: 'You have been assigned to Website Redesign', time: '5 min ago', unread: true },
    { id: 2, title: 'Meeting reminder', message: 'Team standup in 30 minutes', time: '25 min ago', unread: true },
    { id: 3, title: 'Payroll processed', message: 'December payroll has been processed', time: '1 hour ago', unread: false },
    { id: 4, title: 'Document uploaded', message: 'New policy document available', time: '2 hours ago', unread: false },
  ];

  const unreadCount = notifications.filter(n => n.unread).length;

  const getPageTitle = (page: string): string => {
    const titles: Record<string, string> = {
      dashboard: 'Dashboard',
      employees: 'Employee Management',
      departments: 'Department Management',
      interns: 'Intern Management',
      projects: 'Projects',
      tasks: 'Tasks',
      attendance: 'Attendance',
      payroll: 'Payroll',
      events: 'Events',
      documents: 'Documents',
      reports: 'Reports & Analytics',
      profile: 'My Profile',
      internship: 'My Internship'
    };
    return titles[page] || 'Dashboard';
  };

  const getRoleBadgeColor = (role: UserRole): string => {
    const colors: Record<UserRole, string> = {
      admin: 'bg-purple-500/20 text-purple-400',
      hr: 'bg-blue-500/20 text-blue-400',
      employee: 'bg-green-500/20 text-green-400',
      intern: 'bg-orange-500/20 text-orange-400',
      accountant: 'bg-cyan-500/20 text-cyan-400'
    };
    return colors[role];
  };

  return (
    <header className={`fixed top-0 right-0 h-16 bg-[#0F2744] border-b border-[#1E3A5F] z-40 transition-all duration-300 ${
      isSidebarCollapsed ? 'left-20' : 'left-64'
    }`}>
      <div className="h-full px-4 md:px-6 flex items-center justify-between">
        {/* Left Section */}
        <div className="flex items-center gap-4">
          <button
            onClick={onMenuToggle}
            className="p-2 rounded-lg hover:bg-[#1E3A5F] transition-colors lg:hidden"
          >
            <Menu size={20} className="text-gray-300" />
          </button>
          
          <div>
            <h1 className="text-lg font-semibold text-white">{getPageTitle(currentPage)}</h1>
            <p className="text-xs text-gray-400 hidden sm:block">
              Welcome back, {userName.split(' ')[0]}
            </p>
          </div>
        </div>

        {/* Center Section - Search */}
        <div className="hidden md:flex flex-1 max-w-md mx-8">
          <div className="relative w-full">
            <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-[#1E3A5F] border border-[#2D4A6F] rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-[#D4AF37] transition-colors"
            />
          </div>
        </div>

        {/* Right Section */}
        <div className="flex items-center gap-2 md:gap-4">
          {/* Theme Toggle */}
          <button
            onClick={() => setIsDarkMode(!isDarkMode)}
            className="p-2 rounded-lg hover:bg-[#1E3A5F] transition-colors hidden sm:flex"
          >
            {isDarkMode ? (
              <Sun size={20} className="text-[#D4AF37]" />
            ) : (
              <Moon size={20} className="text-gray-300" />
            )}
          </button>

          {/* Notifications */}
          <div className="relative">
            <button
              onClick={() => {
                setShowNotifications(!showNotifications);
                setShowProfile(false);
              }}
              className="p-2 rounded-lg hover:bg-[#1E3A5F] transition-colors relative"
            >
              <Bell size={20} className="text-gray-300" />
              {unreadCount > 0 && (
                <span className="absolute top-1 right-1 w-4 h-4 bg-[#D4AF37] text-[#0A1929] text-xs font-bold rounded-full flex items-center justify-center">
                  {unreadCount}
                </span>
              )}
            </button>

            {showNotifications && (
              <div className="absolute right-0 mt-2 w-80 bg-[#0F2744] border border-[#1E3A5F] rounded-xl shadow-xl overflow-hidden">
                <div className="p-4 border-b border-[#1E3A5F] flex items-center justify-between">
                  <h3 className="font-semibold text-white">Notifications</h3>
                  <span className="text-xs text-[#D4AF37]">{unreadCount} new</span>
                </div>
                <div className="max-h-80 overflow-y-auto">
                  {notifications.map(notification => (
                    <div
                      key={notification.id}
                      className={`p-4 border-b border-[#1E3A5F] hover:bg-[#1E3A5F] transition-colors cursor-pointer ${
                        notification.unread ? 'bg-[#1E3A5F]/30' : ''
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        {notification.unread && (
                          <span className="w-2 h-2 bg-[#D4AF37] rounded-full mt-2 flex-shrink-0" />
                        )}
                        <div className={notification.unread ? '' : 'ml-5'}>
                          <p className="text-sm font-medium text-white">{notification.title}</p>
                          <p className="text-xs text-gray-400 mt-1">{notification.message}</p>
                          <p className="text-xs text-gray-500 mt-1">{notification.time}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="p-3 border-t border-[#1E3A5F]">
                  <button className="w-full text-center text-sm text-[#D4AF37] hover:underline">
                    View all notifications
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Profile Dropdown */}
          <div className="relative">
            <button
              onClick={() => {
                setShowProfile(!showProfile);
                setShowNotifications(false);
              }}
              className="flex items-center gap-2 p-1.5 pr-3 rounded-lg hover:bg-[#1E3A5F] transition-colors"
            >
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#D4AF37] to-[#B8962E] flex items-center justify-center">
                <User size={16} className="text-[#0A1929]" />
              </div>
              <div className="hidden sm:block text-left">
                <p className="text-sm font-medium text-white">{userName}</p>
                <span className={`text-xs px-2 py-0.5 rounded-full ${getRoleBadgeColor(role)}`}>
                  {role.charAt(0).toUpperCase() + role.slice(1)}
                </span>
              </div>
              <ChevronDown size={16} className="text-gray-400 hidden sm:block" />
            </button>

            {showProfile && (
              <div className="absolute right-0 mt-2 w-56 bg-[#0F2744] border border-[#1E3A5F] rounded-xl shadow-xl overflow-hidden">
                <div className="p-4 border-b border-[#1E3A5F]">
                  <p className="font-medium text-white">{userName}</p>
                  <p className="text-sm text-gray-400">{role}@company.com</p>
                </div>
                <div className="p-2">
                  <button className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-gray-300 hover:bg-[#1E3A5F] hover:text-white transition-colors">
                    <User size={18} />
                    <span className="text-sm">My Profile</span>
                  </button>
                  <button className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-gray-300 hover:bg-[#1E3A5F] hover:text-white transition-colors">
                    <Settings size={18} />
                    <span className="text-sm">Settings</span>
                  </button>
                </div>
                <div className="p-2 border-t border-[#1E3A5F]">
                  <button
                    onClick={onLogout}
                    className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-red-400 hover:bg-red-500/20 transition-colors"
                  >
                    <LogOut size={18} />
                    <span className="text-sm">Logout</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Click outside handler */}
      {(showNotifications || showProfile) && (
        <div
          className="fixed inset-0 z-[-1]"
          onClick={() => {
            setShowNotifications(false);
            setShowProfile(false);
          }}
        />
      )}
    </header>
  );
};

export default Header;
