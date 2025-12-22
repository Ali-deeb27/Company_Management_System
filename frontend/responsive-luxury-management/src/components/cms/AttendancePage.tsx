import React, { useState, useEffect } from 'react';
import { UserRole } from './types';
import { attendanceApi, Attendance } from '@/lib/api';
import { useToast } from '@/hooks/use-toast';
import DataTable from './DataTable';
import { Calendar, CheckCircle, XCircle, AlertCircle, MinusCircle, Loader2 } from 'lucide-react';

interface AttendancePageProps {
  role: UserRole;
}

const AttendancePage: React.FC<AttendancePageProps> = ({ role }) => {
  const [attendance, setAttendance] = useState<Attendance[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const { toast } = useToast();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const response = await attendanceApi.getAll();
      if (response.data) setAttendance(response.data);
      if (response.error) {
        toast({ title: 'Error', description: response.error, variant: 'destructive' });
      }
    } finally {
      setLoading(false);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'present': return <CheckCircle size={16} className="text-green-400" />;
      case 'absent': return <XCircle size={16} className="text-red-400" />;
      case 'late': return <AlertCircle size={16} className="text-yellow-400" />;
      case 'half-day': return <MinusCircle size={16} className="text-orange-400" />;
      default: return null;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'present': return 'bg-green-500/20 text-green-400';
      case 'absent': return 'bg-red-500/20 text-red-400';
      case 'late': return 'bg-yellow-500/20 text-yellow-400';
      case 'half-day': return 'bg-orange-500/20 text-orange-400';
      default: return 'bg-gray-500/20 text-gray-400';
    }
  };

  const filteredAttendance = attendance.filter(a => a.date === selectedDate);
  const todayStats = {
    present: filteredAttendance.filter(a => a.status === 'present').length,
    absent: filteredAttendance.filter(a => a.status === 'absent').length,
    late: filteredAttendance.filter(a => a.status === 'late').length,
    halfDay: filteredAttendance.filter(a => a.status === 'half-day').length,
  };

  const columns = [
    {
      key: 'user_name',
      label: 'Employee',
      sortable: true,
      render: (record: Attendance) => (
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#D4AF37] to-[#B8962E] flex items-center justify-center">
            <span className="text-[#0A1929] font-semibold">{record.user_name.charAt(0)}</span>
          </div>
          <span className="font-medium text-white">{record.user_name}</span>
        </div>
      )
    },
    { key: 'date', label: 'Date', sortable: true },
    {
      key: 'check_in',
      label: 'Check In',
      render: (record: Attendance) => (
        <span className={record.check_in ? 'text-white' : 'text-gray-500'}>
          {record.check_in || '-'}
        </span>
      )
    },
    {
      key: 'check_out',
      label: 'Check Out',
      render: (record: Attendance) => (
        <span className={record.check_out ? 'text-white' : 'text-gray-500'}>
          {record.check_out || '-'}
        </span>
      )
    },
    {
      key: 'hours_worked',
      label: 'Hours',
      render: (record: Attendance) => (
        <span className="text-[#D4AF37] font-medium">
          {Number(record.hours_worked) > 0 ? `${record.hours_worked}h` : '-'}
        </span>
      )
    },
    {
      key: 'status',
      label: 'Status',
      render: (record: Attendance) => (
        <div className="flex items-center gap-2">
          {getStatusIcon(record.status)}
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(record.status)}`}>
            {record.status.charAt(0).toUpperCase() + record.status.slice(1).replace('-', ' ')}
          </span>
        </div>
      )
    }
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-[#D4AF37]" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white">Attendance</h1>
          <p className="text-gray-400">Track employee attendance</p>
        </div>
        <div className="relative">
          <Calendar size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="pl-10 pr-4 py-2.5 bg-[#1E3A5F] border border-[#2D4A6F] rounded-xl text-white focus:outline-none focus:border-[#D4AF37]"
          />
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-[#0F2744] border border-[#1E3A5F] rounded-xl p-4">
          <p className="text-xl font-bold text-green-400">{todayStats.present}</p>
          <p className="text-xs text-gray-400">Present</p>
        </div>
        <div className="bg-[#0F2744] border border-[#1E3A5F] rounded-xl p-4">
          <p className="text-xl font-bold text-red-400">{todayStats.absent}</p>
          <p className="text-xs text-gray-400">Absent</p>
        </div>
        <div className="bg-[#0F2744] border border-[#1E3A5F] rounded-xl p-4">
          <p className="text-xl font-bold text-yellow-400">{todayStats.late}</p>
          <p className="text-xs text-gray-400">Late</p>
        </div>
        <div className="bg-[#0F2744] border border-[#1E3A5F] rounded-xl p-4">
          <p className="text-xl font-bold text-orange-400">{todayStats.halfDay}</p>
          <p className="text-xs text-gray-400">Half Day</p>
        </div>
      </div>

      <DataTable
        data={filteredAttendance.length > 0 ? filteredAttendance : attendance}
        columns={columns}
        searchPlaceholder="Search by name..."
        emptyMessage="No attendance records for this date"
      />
    </div>
  );
};

export default AttendancePage;
