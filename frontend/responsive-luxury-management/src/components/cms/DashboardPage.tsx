import React from 'react';
import { UserRole } from './types';
import StatCard from './StatCard';
import {
  Users,
  Building2,
  FolderKanban,
  CheckSquare,
  Clock,
  DollarSign,
  Calendar,
  TrendingUp,
  GraduationCap,
  FileText,
  AlertCircle,
  ArrowUpRight
} from 'lucide-react';

interface DashboardPageProps {
  role: UserRole;
  userName: string;
  onNavigate: (page: string) => void;
}

const DashboardPage: React.FC<DashboardPageProps> = ({ role, userName, onNavigate }) => {
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good Morning';
    if (hour < 17) return 'Good Afternoon';
    return 'Good Evening';
  };

  const recentActivities = [
    { id: 1, action: 'New employee added', user: 'Sarah Mitchell', time: '2 hours ago', type: 'employee' },
    { id: 2, action: 'Project status updated', user: 'Michael Chen', time: '3 hours ago', type: 'project' },
    { id: 3, action: 'Payroll processed', user: 'James Wilson', time: '5 hours ago', type: 'payroll' },
    { id: 4, action: 'New document uploaded', user: 'Emily Davis', time: '6 hours ago', type: 'document' },
    { id: 5, action: 'Attendance marked', user: 'David Brown', time: '8 hours ago', type: 'attendance' },
  ];

  const upcomingEvents = [
    { id: 1, title: 'Engineering Sprint Review', date: 'Dec 20', time: '2:00 PM' },
    { id: 2, title: 'Holiday Party', date: 'Dec 23', time: '6:00 PM' },
    { id: 3, title: 'Annual Company Meeting', date: 'Dec 28', time: '10:00 AM' },
  ];

  const pendingTasks = [
    { id: 1, title: 'Review Q4 reports', priority: 'high', dueDate: 'Today' },
    { id: 2, title: 'Approve leave requests', priority: 'medium', dueDate: 'Tomorrow' },
    { id: 3, title: 'Update employee records', priority: 'low', dueDate: 'Dec 22' },
  ];

  const renderAdminDashboard = () => (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard
          title="Total Employees"
          value="128"
          icon={<Users size={24} />}
          trend={{ value: 12, label: 'vs last month' }}
          color="gold"
        />
        <StatCard
          title="Departments"
          value="8"
          icon={<Building2 size={24} />}
          color="blue"
        />
        <StatCard
          title="Active Projects"
          value="24"
          icon={<FolderKanban size={24} />}
          trend={{ value: 8, label: 'vs last month' }}
          color="green"
        />
        <StatCard
          title="Pending Tasks"
          value="47"
          icon={<CheckSquare size={24} />}
          trend={{ value: -5, label: 'vs last week' }}
          color="orange"
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard
          title="Active Interns"
          value="12"
          icon={<GraduationCap size={24} />}
          color="purple"
        />
        <StatCard
          title="Attendance Rate"
          value="94.5%"
          icon={<Clock size={24} />}
          trend={{ value: 2.3, label: 'vs last week' }}
          color="cyan"
        />
        <StatCard
          title="Monthly Payroll"
          value="$485K"
          icon={<DollarSign size={24} />}
          color="gold"
        />
        <StatCard
          title="Upcoming Events"
          value="6"
          icon={<Calendar size={24} />}
          color="blue"
        />
      </div>
    </>
  );

  const renderHRDashboard = () => (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
      <StatCard
        title="Total Employees"
        value="128"
        icon={<Users size={24} />}
        trend={{ value: 12, label: 'vs last month' }}
        color="gold"
      />
      <StatCard
        title="Active Interns"
        value="12"
        icon={<GraduationCap size={24} />}
        trend={{ value: 3, label: 'new this month' }}
        color="purple"
      />
      <StatCard
        title="Attendance Rate"
        value="94.5%"
        icon={<Clock size={24} />}
        trend={{ value: 2.3, label: 'vs last week' }}
        color="green"
      />
      <StatCard
        title="Pending Requests"
        value="8"
        icon={<FileText size={24} />}
        color="orange"
      />
    </div>
  );

  const renderEmployeeDashboard = () => (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
      <StatCard
        title="My Tasks"
        value="12"
        icon={<CheckSquare size={24} />}
        trend={{ value: -2, label: 'completed today' }}
        color="gold"
      />
      <StatCard
        title="Active Projects"
        value="3"
        icon={<FolderKanban size={24} />}
        color="blue"
      />
      <StatCard
        title="Attendance This Month"
        value="18/20"
        icon={<Clock size={24} />}
        trend={{ value: 90, label: '% attendance' }}
        color="green"
      />
    </div>
  );

  const renderInternDashboard = () => (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
      <StatCard
        title="Assigned Tasks"
        value="5"
        icon={<CheckSquare size={24} />}
        color="gold"
      />
      <StatCard
        title="Days Remaining"
        value="45"
        icon={<Calendar size={24} />}
        color="blue"
      />
      <StatCard
        title="Attendance"
        value="95%"
        icon={<Clock size={24} />}
        trend={{ value: 5, label: 'above average' }}
        color="green"
      />
    </div>
  );

  const renderAccountantDashboard = () => (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
      <StatCard
        title="Monthly Payroll"
        value="$485,000"
        icon={<DollarSign size={24} />}
        trend={{ value: 3.2, label: 'vs last month' }}
        color="gold"
      />
      <StatCard
        title="Pending Payments"
        value="23"
        icon={<Clock size={24} />}
        color="orange"
      />
      <StatCard
        title="Processed This Month"
        value="105"
        icon={<CheckSquare size={24} />}
        color="green"
      />
      <StatCard
        title="Total Deductions"
        value="$121K"
        icon={<TrendingUp size={24} />}
        color="blue"
      />
    </div>
  );

  const renderDashboardStats = () => {
    switch (role) {
      case 'admin':
        return renderAdminDashboard();
      case 'hr':
        return renderHRDashboard();
      case 'employee':
        return renderEmployeeDashboard();
      case 'intern':
        return renderInternDashboard();
      case 'accountant':
        return renderAccountantDashboard();
      default:
        return null;
    }
  };

  const getQuickActions = () => {
    const actions: Record<UserRole, { label: string; page: string; icon: React.ReactNode }[]> = {
      admin: [
        { label: 'Add Employee', page: 'employees', icon: <Users size={18} /> },
        { label: 'Add Department', page: 'departments', icon: <Building2 size={18} /> },
        { label: 'View Reports', page: 'reports', icon: <TrendingUp size={18} /> },
        { label: 'Manage Payroll', page: 'payroll', icon: <DollarSign size={18} /> },
      ],
      hr: [
        { label: 'Add Employee', page: 'employees', icon: <Users size={18} /> },
        { label: 'Add Intern', page: 'interns', icon: <GraduationCap size={18} /> },
        { label: 'View Attendance', page: 'attendance', icon: <Clock size={18} /> },
        { label: 'Manage Events', page: 'events', icon: <Calendar size={18} /> },
      ],
      employee: [
        { label: 'View Tasks', page: 'tasks', icon: <CheckSquare size={18} /> },
        { label: 'My Attendance', page: 'attendance', icon: <Clock size={18} /> },
        { label: 'View Payroll', page: 'payroll', icon: <DollarSign size={18} /> },
        { label: 'Documents', page: 'documents', icon: <FileText size={18} /> },
      ],
      intern: [
        { label: 'My Tasks', page: 'tasks', icon: <CheckSquare size={18} /> },
        { label: 'Attendance', page: 'attendance', icon: <Clock size={18} /> },
        { label: 'Events', page: 'events', icon: <Calendar size={18} /> },
        { label: 'Documents', page: 'documents', icon: <FileText size={18} /> },
      ],
      accountant: [
        { label: 'Process Payroll', page: 'payroll', icon: <DollarSign size={18} /> },
        { label: 'View Reports', page: 'reports', icon: <TrendingUp size={18} /> },
        { label: 'Documents', page: 'documents', icon: <FileText size={18} /> },
      ],
    };
    return actions[role] || [];
  };

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-[#1E3A5F] to-[#0F2744] border border-[#2D4A6F] rounded-2xl p-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-white mb-1">
              {getGreeting()}, {userName.split(' ')[0]}!
            </h1>
            <p className="text-gray-400">
              Here's what's happening with your company today.
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            {getQuickActions().map((action, index) => (
              <button
                key={index}
                onClick={() => onNavigate(action.page)}
                className="flex items-center gap-2 px-4 py-2 bg-[#0A1929] border border-[#1E3A5F] rounded-lg text-gray-300 hover:text-white hover:border-[#D4AF37] transition-all"
              >
                {action.icon}
                <span className="text-sm">{action.label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      {renderDashboardStats()}

      {/* Bottom Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Activity */}
        <div className="lg:col-span-2 bg-[#0F2744] border border-[#1E3A5F] rounded-xl overflow-hidden">
          <div className="p-4 border-b border-[#1E3A5F] flex items-center justify-between">
            <h3 className="font-semibold text-white">Recent Activity</h3>
            <button className="text-sm text-[#D4AF37] hover:underline">View All</button>
          </div>
          <div className="divide-y divide-[#1E3A5F]">
            {recentActivities.map(activity => (
              <div key={activity.id} className="p-4 hover:bg-[#1E3A5F]/30 transition-colors">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-full bg-[#D4AF37]/10 flex items-center justify-center flex-shrink-0">
                    {activity.type === 'employee' && <Users size={18} className="text-[#D4AF37]" />}
                    {activity.type === 'project' && <FolderKanban size={18} className="text-blue-400" />}
                    {activity.type === 'payroll' && <DollarSign size={18} className="text-green-400" />}
                    {activity.type === 'document' && <FileText size={18} className="text-purple-400" />}
                    {activity.type === 'attendance' && <Clock size={18} className="text-orange-400" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-white">{activity.action}</p>
                    <p className="text-xs text-gray-400">by {activity.user}</p>
                  </div>
                  <span className="text-xs text-gray-500">{activity.time}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Column */}
        <div className="space-y-6">
          {/* Upcoming Events */}
          <div className="bg-[#0F2744] border border-[#1E3A5F] rounded-xl overflow-hidden">
            <div className="p-4 border-b border-[#1E3A5F] flex items-center justify-between">
              <h3 className="font-semibold text-white">Upcoming Events</h3>
              <button 
                onClick={() => onNavigate('events')}
                className="text-sm text-[#D4AF37] hover:underline"
              >
                View All
              </button>
            </div>
            <div className="divide-y divide-[#1E3A5F]">
              {upcomingEvents.map(event => (
                <div key={event.id} className="p-4 hover:bg-[#1E3A5F]/30 transition-colors">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-lg bg-[#D4AF37]/10 flex flex-col items-center justify-center">
                      <span className="text-xs text-[#D4AF37]">{event.date.split(' ')[0]}</span>
                      <span className="text-sm font-bold text-white">{event.date.split(' ')[1]}</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-white truncate">{event.title}</p>
                      <p className="text-xs text-gray-400">{event.time}</p>
                    </div>
                    <ArrowUpRight size={16} className="text-gray-400" />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Pending Tasks */}
          {(role === 'admin' || role === 'hr' || role === 'employee') && (
            <div className="bg-[#0F2744] border border-[#1E3A5F] rounded-xl overflow-hidden">
              <div className="p-4 border-b border-[#1E3A5F] flex items-center justify-between">
                <h3 className="font-semibold text-white">Pending Tasks</h3>
                <button 
                  onClick={() => onNavigate('tasks')}
                  className="text-sm text-[#D4AF37] hover:underline"
                >
                  View All
                </button>
              </div>
              <div className="divide-y divide-[#1E3A5F]">
                {pendingTasks.map(task => (
                  <div key={task.id} className="p-4 hover:bg-[#1E3A5F]/30 transition-colors">
                    <div className="flex items-center gap-3">
                      <div className={`w-2 h-2 rounded-full ${
                        task.priority === 'high' ? 'bg-red-400' :
                        task.priority === 'medium' ? 'bg-yellow-400' : 'bg-green-400'
                      }`} />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm text-white truncate">{task.title}</p>
                        <p className="text-xs text-gray-400">Due: {task.dueDate}</p>
                      </div>
                      <span className={`text-xs px-2 py-1 rounded-full ${
                        task.priority === 'high' ? 'bg-red-500/20 text-red-400' :
                        task.priority === 'medium' ? 'bg-yellow-500/20 text-yellow-400' : 'bg-green-500/20 text-green-400'
                      }`}>
                        {task.priority}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
