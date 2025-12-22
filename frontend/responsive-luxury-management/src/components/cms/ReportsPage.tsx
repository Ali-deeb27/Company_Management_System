import React, { useState } from 'react';
import { UserRole } from './types';
import { mockEmployees, mockDepartments, mockProjects, mockPayrolls, mockAttendance } from './mockData';
import { BarChart3, TrendingUp, Users, DollarSign, Clock, Building2, Download, Filter } from 'lucide-react';

interface ReportsPageProps {
  role: UserRole;
}

const ReportsPage: React.FC<ReportsPageProps> = ({ role }) => {
  const [selectedReport, setSelectedReport] = useState<string>('overview');

  const totalEmployees = mockEmployees.length;
  const totalDepartments = mockDepartments.length;
  const activeProjects = mockProjects.filter(p => p.status === 'in-progress').length;
  const totalPayroll = mockPayrolls.filter(p => p.month.includes('December')).reduce((sum, p) => sum + p.netPay, 0);
  const avgAttendance = 94.5;

  const departmentStats = mockDepartments.map(dept => ({
    name: dept.name,
    employees: dept.employeeCount,
    percentage: Math.round((dept.employeeCount / totalEmployees) * 100)
  }));

  const projectStats = [
    { status: 'Planning', count: mockProjects.filter(p => p.status === 'planning').length, color: 'bg-blue-400' },
    { status: 'In Progress', count: mockProjects.filter(p => p.status === 'in-progress').length, color: 'bg-yellow-400' },
    { status: 'Completed', count: mockProjects.filter(p => p.status === 'completed').length, color: 'bg-green-400' },
    { status: 'On Hold', count: mockProjects.filter(p => p.status === 'on-hold').length, color: 'bg-red-400' },
  ];

  const payrollTrend = [
    { month: 'Jul', amount: 420000 },
    { month: 'Aug', amount: 435000 },
    { month: 'Sep', amount: 445000 },
    { month: 'Oct', amount: 460000 },
    { month: 'Nov', amount: 475000 },
    { month: 'Dec', amount: totalPayroll },
  ];

  const maxPayroll = Math.max(...payrollTrend.map(p => p.amount));

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white">Reports & Analytics</h1>
          <p className="text-gray-400">Company performance insights</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2.5 bg-[#1E3A5F] border border-[#2D4A6F] text-white rounded-xl hover:bg-[#2D4A6F] transition-colors">
          <Download size={18} />
          Export Report
        </button>
      </div>

      {/* Report Tabs */}
      <div className="flex flex-wrap gap-2">
        {['overview', 'employees', 'financial', 'projects'].map(report => (
          <button
            key={report}
            onClick={() => setSelectedReport(report)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              selectedReport === report
                ? 'bg-[#D4AF37] text-[#0A1929]'
                : 'bg-[#1E3A5F] text-gray-300 hover:bg-[#2D4A6F]'
            }`}
          >
            {report.charAt(0).toUpperCase() + report.slice(1)}
          </button>
        ))}
      </div>

      {/* Overview Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
        <div className="bg-[#0F2744] border border-[#1E3A5F] rounded-xl p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-[#D4AF37]/10">
              <Users size={20} className="text-[#D4AF37]" />
            </div>
            <div>
              <p className="text-xl font-bold text-white">{totalEmployees}</p>
              <p className="text-xs text-gray-400">Employees</p>
            </div>
          </div>
        </div>
        <div className="bg-[#0F2744] border border-[#1E3A5F] rounded-xl p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-blue-500/10">
              <Building2 size={20} className="text-blue-400" />
            </div>
            <div>
              <p className="text-xl font-bold text-white">{totalDepartments}</p>
              <p className="text-xs text-gray-400">Departments</p>
            </div>
          </div>
        </div>
        <div className="bg-[#0F2744] border border-[#1E3A5F] rounded-xl p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-green-500/10">
              <BarChart3 size={20} className="text-green-400" />
            </div>
            <div>
              <p className="text-xl font-bold text-white">{activeProjects}</p>
              <p className="text-xs text-gray-400">Active Projects</p>
            </div>
          </div>
        </div>
        <div className="bg-[#0F2744] border border-[#1E3A5F] rounded-xl p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-purple-500/10">
              <DollarSign size={20} className="text-purple-400" />
            </div>
            <div>
              <p className="text-xl font-bold text-white">${(totalPayroll / 1000).toFixed(0)}K</p>
              <p className="text-xs text-gray-400">Monthly Payroll</p>
            </div>
          </div>
        </div>
        <div className="bg-[#0F2744] border border-[#1E3A5F] rounded-xl p-4 col-span-2 sm:col-span-1">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-cyan-500/10">
              <Clock size={20} className="text-cyan-400" />
            </div>
            <div>
              <p className="text-xl font-bold text-white">{avgAttendance}%</p>
              <p className="text-xs text-gray-400">Attendance Rate</p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Payroll Trend */}
        <div className="bg-[#0F2744] border border-[#1E3A5F] rounded-xl p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-white">Payroll Trend</h3>
            <span className="text-sm text-[#D4AF37]">Last 6 months</span>
          </div>
          <div className="flex items-end justify-between h-48 gap-4">
            {payrollTrend.map((item, index) => (
              <div key={index} className="flex-1 flex flex-col items-center gap-2">
                <div className="w-full relative" style={{ height: '160px' }}>
                  <div
                    className="absolute bottom-0 w-full bg-gradient-to-t from-[#D4AF37] to-[#D4AF37]/50 rounded-t-lg transition-all duration-500"
                    style={{ height: `${(item.amount / maxPayroll) * 100}%` }}
                  />
                </div>
                <span className="text-xs text-gray-400">{item.month}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Department Distribution */}
        <div className="bg-[#0F2744] border border-[#1E3A5F] rounded-xl p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-white">Department Distribution</h3>
          </div>
          <div className="space-y-4">
            {departmentStats.slice(0, 6).map((dept, index) => (
              <div key={index}>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm text-gray-300">{dept.name}</span>
                  <span className="text-sm text-[#D4AF37]">{dept.employees} employees</span>
                </div>
                <div className="w-full h-2 bg-[#1E3A5F] rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-[#D4AF37] to-[#B8962E] rounded-full transition-all duration-500"
                    style={{ width: `${dept.percentage}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Project Status */}
        <div className="bg-[#0F2744] border border-[#1E3A5F] rounded-xl p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-white">Project Status</h3>
          </div>
          <div className="grid grid-cols-2 gap-4">
            {projectStats.map((stat, index) => (
              <div key={index} className="p-4 bg-[#1E3A5F]/50 rounded-xl">
                <div className="flex items-center gap-2 mb-2">
                  <div className={`w-3 h-3 rounded-full ${stat.color}`} />
                  <span className="text-sm text-gray-400">{stat.status}</span>
                </div>
                <p className="text-2xl font-bold text-white">{stat.count}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Stats */}
        <div className="bg-[#0F2744] border border-[#1E3A5F] rounded-xl p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-white">Key Metrics</h3>
          </div>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-[#1E3A5F]/50 rounded-xl">
              <div className="flex items-center gap-3">
                <TrendingUp size={20} className="text-green-400" />
                <span className="text-gray-300">Revenue Growth</span>
              </div>
              <span className="text-green-400 font-semibold">+12.5%</span>
            </div>
            <div className="flex items-center justify-between p-4 bg-[#1E3A5F]/50 rounded-xl">
              <div className="flex items-center gap-3">
                <Users size={20} className="text-blue-400" />
                <span className="text-gray-300">Employee Retention</span>
              </div>
              <span className="text-blue-400 font-semibold">95.2%</span>
            </div>
            <div className="flex items-center justify-between p-4 bg-[#1E3A5F]/50 rounded-xl">
              <div className="flex items-center gap-3">
                <BarChart3 size={20} className="text-purple-400" />
                <span className="text-gray-300">Project Completion</span>
              </div>
              <span className="text-purple-400 font-semibold">87.3%</span>
            </div>
            <div className="flex items-center justify-between p-4 bg-[#1E3A5F]/50 rounded-xl">
              <div className="flex items-center gap-3">
                <Clock size={20} className="text-[#D4AF37]" />
                <span className="text-gray-300">Avg. Work Hours</span>
              </div>
              <span className="text-[#D4AF37] font-semibold">8.2h/day</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReportsPage;
