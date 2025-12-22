import React from 'react';
import { UserRole, User } from './types';
import { mockInterns, mockTasks, mockAttendance } from './mockData';
import { GraduationCap, Calendar, User as UserIcon, Clock, CheckSquare, Target, Award } from 'lucide-react';

interface InternshipPageProps {
  role: UserRole;
  user: User;
}

const InternshipPage: React.FC<InternshipPageProps> = ({ role, user }) => {
  const intern = mockInterns.find(i => i.name === user.name) || mockInterns[0];
  const userTasks = mockTasks.filter(t => t.assignee === user.name || t.assignee === intern.name);
  const userAttendance = mockAttendance.filter(a => a.userName === user.name || a.userName === intern.name);

  const startDate = new Date(intern.startDate);
  const endDate = new Date(intern.endDate);
  const today = new Date();
  const totalDays = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));
  const daysCompleted = Math.ceil((today.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));
  const daysRemaining = Math.max(0, Math.ceil((endDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)));
  const progress = Math.min(100, Math.round((daysCompleted / totalDays) * 100));

  const completedTasks = userTasks.filter(t => t.status === 'completed').length;
  const totalTasks = userTasks.length;
  const taskProgress = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  const attendanceRate = userAttendance.length > 0
    ? Math.round((userAttendance.filter(a => a.status === 'present').length / userAttendance.length) * 100)
    : 95;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-white">My Internship</h1>
        <p className="text-gray-400">Track your internship progress and details</p>
      </div>

      {/* Progress Overview */}
      <div className="bg-gradient-to-r from-[#1E3A5F] to-[#0F2744] border border-[#2D4A6F] rounded-xl p-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-purple-500 to-purple-700 flex items-center justify-center">
              <GraduationCap size={32} className="text-white" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-white">{intern.name}</h2>
              <p className="text-[#D4AF37]">{intern.department} Intern</p>
              <p className="text-sm text-gray-400">Mentor: {intern.mentor}</p>
            </div>
          </div>
          <div className="flex-1 max-w-md">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-400">Internship Progress</span>
              <span className="text-sm text-[#D4AF37] font-semibold">{progress}%</span>
            </div>
            <div className="w-full h-3 bg-[#0A1929] rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-[#D4AF37] to-[#B8962E] rounded-full transition-all duration-500"
                style={{ width: `${progress}%` }}
              />
            </div>
            <div className="flex items-center justify-between mt-2">
              <span className="text-xs text-gray-500">{intern.startDate}</span>
              <span className="text-xs text-gray-500">{intern.endDate}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-[#0F2744] border border-[#1E3A5F] rounded-xl p-4">
          <div className="flex items-center gap-2 text-gray-400 mb-2">
            <Calendar size={16} />
            <span className="text-xs">Days Remaining</span>
          </div>
          <p className="text-2xl font-bold text-[#D4AF37]">{daysRemaining}</p>
        </div>
        <div className="bg-[#0F2744] border border-[#1E3A5F] rounded-xl p-4">
          <div className="flex items-center gap-2 text-gray-400 mb-2">
            <CheckSquare size={16} />
            <span className="text-xs">Tasks Completed</span>
          </div>
          <p className="text-2xl font-bold text-green-400">{completedTasks}/{totalTasks}</p>
        </div>
        <div className="bg-[#0F2744] border border-[#1E3A5F] rounded-xl p-4">
          <div className="flex items-center gap-2 text-gray-400 mb-2">
            <Clock size={16} />
            <span className="text-xs">Attendance</span>
          </div>
          <p className="text-2xl font-bold text-blue-400">{attendanceRate}%</p>
        </div>
        <div className="bg-[#0F2744] border border-[#1E3A5F] rounded-xl p-4">
          <div className="flex items-center gap-2 text-gray-400 mb-2">
            <Target size={16} />
            <span className="text-xs">Task Progress</span>
          </div>
          <p className="text-2xl font-bold text-purple-400">{taskProgress}%</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Internship Details */}
        <div className="bg-[#0F2744] border border-[#1E3A5F] rounded-xl p-6">
          <h3 className="text-lg font-semibold text-white mb-4">Internship Details</h3>
          <div className="space-y-4">
            <div className="p-4 bg-[#1E3A5F]/50 rounded-xl">
              <p className="text-xs text-gray-400 mb-1">Department</p>
              <p className="text-white font-medium">{intern.department}</p>
            </div>
            <div className="p-4 bg-[#1E3A5F]/50 rounded-xl">
              <p className="text-xs text-gray-400 mb-1">Mentor</p>
              <p className="text-white font-medium">{intern.mentor}</p>
            </div>
            <div className="p-4 bg-[#1E3A5F]/50 rounded-xl">
              <p className="text-xs text-gray-400 mb-1">Duration</p>
              <p className="text-white font-medium">{intern.startDate} - {intern.endDate}</p>
            </div>
            <div className="p-4 bg-[#1E3A5F]/50 rounded-xl">
              <p className="text-xs text-gray-400 mb-1">Status</p>
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                intern.status === 'active' ? 'bg-green-500/20 text-green-400' :
                intern.status === 'completed' ? 'bg-blue-500/20 text-blue-400' : 'bg-red-500/20 text-red-400'
              }`}>
                {intern.status.charAt(0).toUpperCase() + intern.status.slice(1)}
              </span>
            </div>
          </div>
        </div>

        {/* Assigned Tasks */}
        <div className="bg-[#0F2744] border border-[#1E3A5F] rounded-xl p-6">
          <h3 className="text-lg font-semibold text-white mb-4">My Tasks</h3>
          <div className="space-y-3">
            {userTasks.length > 0 ? userTasks.map(task => (
              <div key={task.id} className="flex items-center justify-between p-3 bg-[#1E3A5F]/50 rounded-xl">
                <div className="flex items-center gap-3">
                  <div className={`w-2 h-2 rounded-full ${
                    task.status === 'completed' ? 'bg-green-400' :
                    task.status === 'in-progress' ? 'bg-yellow-400' : 'bg-gray-400'
                  }`} />
                  <div>
                    <p className="text-sm text-white">{task.description}</p>
                    <p className="text-xs text-gray-400">Due: {task.endDate}</p>
                  </div>
                </div>
                <span className={`text-xs px-2 py-1 rounded-full ${
                  task.priority === 'high' ? 'bg-red-500/20 text-red-400' :
                  task.priority === 'medium' ? 'bg-yellow-500/20 text-yellow-400' : 'bg-green-500/20 text-green-400'
                }`}>
                  {task.priority}
                </span>
              </div>
            )) : (
              <p className="text-center text-gray-400 py-4">No tasks assigned yet</p>
            )}
          </div>
        </div>

        {/* Milestones */}
        <div className="lg:col-span-2 bg-[#0F2744] border border-[#1E3A5F] rounded-xl p-6">
          <h3 className="text-lg font-semibold text-white mb-4">Internship Milestones</h3>
          <div className="relative">
            <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-[#1E3A5F]" />
            <div className="space-y-6">
              {[
                { title: 'Onboarding Complete', date: intern.startDate, completed: true },
                { title: 'First Month Review', date: '2024-07-01', completed: progress > 16 },
                { title: 'Mid-term Evaluation', date: '2024-09-01', completed: progress > 50 },
                { title: 'Final Project Submission', date: '2024-11-15', completed: progress > 90 },
                { title: 'Internship Completion', date: intern.endDate, completed: progress >= 100 },
              ].map((milestone, index) => (
                <div key={index} className="relative flex items-start gap-4 pl-10">
                  <div className={`absolute left-2 w-5 h-5 rounded-full border-2 ${
                    milestone.completed 
                      ? 'bg-[#D4AF37] border-[#D4AF37]' 
                      : 'bg-[#0F2744] border-[#1E3A5F]'
                  } flex items-center justify-center`}>
                    {milestone.completed && (
                      <svg className="w-3 h-3 text-[#0A1929]" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    )}
                  </div>
                  <div className="flex-1 pb-2">
                    <p className={`font-medium ${milestone.completed ? 'text-white' : 'text-gray-400'}`}>
                      {milestone.title}
                    </p>
                    <p className="text-xs text-gray-500">{milestone.date}</p>
                  </div>
                  {milestone.completed && (
                    <Award size={16} className="text-[#D4AF37]" />
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InternshipPage;
