import React, { useState } from 'react';
import { UserRole, User } from './types';
import { mockEmployees, mockAttendance, mockTasks } from './mockData';
import { User as UserIcon, Mail, Building2, Calendar, DollarSign, Clock, CheckSquare, Edit2, Save } from 'lucide-react';

interface ProfilePageProps {
  role: UserRole;
  user: User;
}

const ProfilePage: React.FC<ProfilePageProps> = ({ role, user }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: user.name,
    email: user.email
  });

  const employee = mockEmployees.find(e => e.name === user.name) || mockEmployees[0];
  const userAttendance = mockAttendance.filter(a => a.userName === user.name);
  const userTasks = mockTasks.filter(t => t.assignee === user.name);

  const attendanceRate = userAttendance.length > 0
    ? Math.round((userAttendance.filter(a => a.status === 'present').length / userAttendance.length) * 100)
    : 95;

  const completedTasks = userTasks.filter(t => t.status === 'completed').length;
  const pendingTasks = userTasks.filter(t => t.status !== 'completed').length;

  const handleSave = () => {
    setIsEditing(false);
    // In real app, this would call API
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-white">My Profile</h1>
        <p className="text-gray-400">View and manage your personal information</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Profile Card */}
        <div className="lg:col-span-1">
          <div className="bg-[#0F2744] border border-[#1E3A5F] rounded-xl overflow-hidden">
            <div className="h-24 bg-gradient-to-r from-[#D4AF37] to-[#B8962E]" />
            <div className="px-6 pb-6">
              <div className="relative -mt-12 mb-4">
                <div className="w-24 h-24 rounded-full bg-[#0A1929] border-4 border-[#0F2744] flex items-center justify-center">
                  <span className="text-3xl font-bold text-[#D4AF37]">{user.name.charAt(0)}</span>
                </div>
              </div>
              
              {isEditing ? (
                <div className="space-y-4">
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-4 py-2 bg-[#1E3A5F] border border-[#2D4A6F] rounded-lg text-white focus:outline-none focus:border-[#D4AF37]"
                  />
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-4 py-2 bg-[#1E3A5F] border border-[#2D4A6F] rounded-lg text-white focus:outline-none focus:border-[#D4AF37]"
                  />
                  <button
                    onClick={handleSave}
                    className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-[#D4AF37] text-[#0A1929] font-semibold rounded-lg hover:bg-[#E5C04A] transition-colors"
                  >
                    <Save size={16} />
                    Save Changes
                  </button>
                </div>
              ) : (
                <>
                  <h2 className="text-xl font-semibold text-white">{user.name}</h2>
                  <p className="text-[#D4AF37] mb-4">{employee.position}</p>
                  
                  <div className="space-y-3">
                    <div className="flex items-center gap-3 text-gray-400">
                      <Mail size={16} />
                      <span className="text-sm">{user.email}</span>
                    </div>
                    <div className="flex items-center gap-3 text-gray-400">
                      <Building2 size={16} />
                      <span className="text-sm">{user.department}</span>
                    </div>
                    <div className="flex items-center gap-3 text-gray-400">
                      <Calendar size={16} />
                      <span className="text-sm">Joined {employee.hireDate}</span>
                    </div>
                  </div>
                  
                  <button
                    onClick={() => setIsEditing(true)}
                    className="w-full mt-4 flex items-center justify-center gap-2 px-4 py-2 border border-[#1E3A5F] text-gray-300 rounded-lg hover:bg-[#1E3A5F] transition-colors"
                  >
                    <Edit2 size={16} />
                    Edit Profile
                  </button>
                </>
              )}
            </div>
          </div>

          {/* Status Badge */}
          <div className="mt-4 bg-[#0F2744] border border-[#1E3A5F] rounded-xl p-4">
            <div className="flex items-center justify-between">
              <span className="text-gray-400">Status</span>
              <span className="px-3 py-1 bg-green-500/20 text-green-400 rounded-full text-sm font-medium">
                Active
              </span>
            </div>
          </div>
        </div>

        {/* Stats & Details */}
        <div className="lg:col-span-2 space-y-6">
          {/* Quick Stats */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="bg-[#0F2744] border border-[#1E3A5F] rounded-xl p-4">
              <div className="flex items-center gap-2 text-gray-400 mb-2">
                <Clock size={16} />
                <span className="text-xs">Attendance</span>
              </div>
              <p className="text-2xl font-bold text-[#D4AF37]">{attendanceRate}%</p>
            </div>
            <div className="bg-[#0F2744] border border-[#1E3A5F] rounded-xl p-4">
              <div className="flex items-center gap-2 text-gray-400 mb-2">
                <CheckSquare size={16} />
                <span className="text-xs">Completed</span>
              </div>
              <p className="text-2xl font-bold text-green-400">{completedTasks}</p>
            </div>
            <div className="bg-[#0F2744] border border-[#1E3A5F] rounded-xl p-4">
              <div className="flex items-center gap-2 text-gray-400 mb-2">
                <CheckSquare size={16} />
                <span className="text-xs">Pending</span>
              </div>
              <p className="text-2xl font-bold text-yellow-400">{pendingTasks}</p>
            </div>
            <div className="bg-[#0F2744] border border-[#1E3A5F] rounded-xl p-4">
              <div className="flex items-center gap-2 text-gray-400 mb-2">
                <DollarSign size={16} />
                <span className="text-xs">Salary</span>
              </div>
              <p className="text-2xl font-bold text-white">${(employee.salary / 1000).toFixed(0)}K</p>
            </div>
          </div>

          {/* Employment Details */}
          <div className="bg-[#0F2744] border border-[#1E3A5F] rounded-xl p-6">
            <h3 className="text-lg font-semibold text-white mb-4">Employment Details</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-4 bg-[#1E3A5F]/50 rounded-xl">
                <p className="text-xs text-gray-400 mb-1">Employee ID</p>
                <p className="text-white font-medium">EMP-{employee.id.padStart(4, '0')}</p>
              </div>
              <div className="p-4 bg-[#1E3A5F]/50 rounded-xl">
                <p className="text-xs text-gray-400 mb-1">Position</p>
                <p className="text-white font-medium">{employee.position}</p>
              </div>
              <div className="p-4 bg-[#1E3A5F]/50 rounded-xl">
                <p className="text-xs text-gray-400 mb-1">Department</p>
                <p className="text-white font-medium">{employee.department}</p>
              </div>
              <div className="p-4 bg-[#1E3A5F]/50 rounded-xl">
                <p className="text-xs text-gray-400 mb-1">Hire Date</p>
                <p className="text-white font-medium">{employee.hireDate}</p>
              </div>
              <div className="p-4 bg-[#1E3A5F]/50 rounded-xl">
                <p className="text-xs text-gray-400 mb-1">Annual Salary</p>
                <p className="text-[#D4AF37] font-semibold">${employee.salary.toLocaleString()}</p>
              </div>
              <div className="p-4 bg-[#1E3A5F]/50 rounded-xl">
                <p className="text-xs text-gray-400 mb-1">Bank Account</p>
                <p className="text-white font-medium">{employee.bankDetails}</p>
              </div>
            </div>
          </div>

          {/* Recent Tasks */}
          <div className="bg-[#0F2744] border border-[#1E3A5F] rounded-xl p-6">
            <h3 className="text-lg font-semibold text-white mb-4">Recent Tasks</h3>
            <div className="space-y-3">
              {userTasks.slice(0, 4).map(task => (
                <div key={task.id} className="flex items-center justify-between p-3 bg-[#1E3A5F]/50 rounded-xl">
                  <div className="flex items-center gap-3">
                    <div className={`w-2 h-2 rounded-full ${
                      task.status === 'completed' ? 'bg-green-400' :
                      task.status === 'in-progress' ? 'bg-yellow-400' : 'bg-gray-400'
                    }`} />
                    <div>
                      <p className="text-sm text-white">{task.description}</p>
                      <p className="text-xs text-gray-400">{task.projectName}</p>
                    </div>
                  </div>
                  <span className={`text-xs px-2 py-1 rounded-full ${
                    task.status === 'completed' ? 'bg-green-500/20 text-green-400' :
                    task.status === 'in-progress' ? 'bg-yellow-500/20 text-yellow-400' : 'bg-gray-500/20 text-gray-400'
                  }`}>
                    {task.status}
                  </span>
                </div>
              ))}
              {userTasks.length === 0 && (
                <p className="text-center text-gray-400 py-4">No tasks assigned</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
