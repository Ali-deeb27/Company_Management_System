import React, { useState, useEffect } from 'react';
import { UserRole } from './types';
import { payrollApi, Payroll } from '@/lib/api';
import { useToast } from '@/hooks/use-toast';
import DataTable from './DataTable';
import { DollarSign, TrendingUp, Clock, CheckCircle, Loader2 } from 'lucide-react';

interface PayrollPageProps {
  role: UserRole;
}

const PayrollPage: React.FC<PayrollPageProps> = ({ role }) => {
  const [payrolls, setPayrolls] = useState<Payroll[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<string>('all');
  const { toast } = useToast();

  const canManage = role === 'accountant' || role === 'admin';

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const response = await payrollApi.getAll();
      if (response.data) setPayrolls(response.data);
      if (response.error) {
        toast({ title: 'Error', description: response.error, variant: 'destructive' });
      }
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (payrollId: string, newStatus: Payroll['status']) => {
    if (!canManage) return;
    
    try {
      const response = await payrollApi.update(payrollId, { status: newStatus });
      
      if (response.error) {
        toast({ title: 'Error', description: response.error, variant: 'destructive' });
      } else {
        toast({ title: 'Success', description: 'Payroll status updated' });
        setPayrolls(payrolls.map(p => p.id === payrollId ? { ...p, status: newStatus } : p));
      }
    } catch (error) {
      toast({ title: 'Error', description: 'Failed to update status', variant: 'destructive' });
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'paid': return 'bg-green-500/20 text-green-400';
      case 'processed': return 'bg-blue-500/20 text-blue-400';
      case 'pending': return 'bg-yellow-500/20 text-yellow-400';
      default: return 'bg-gray-500/20 text-gray-400';
    }
  };

  const filteredPayrolls = filter === 'all' ? payrolls : payrolls.filter(p => p.status === filter);

  const decemberPayrolls = payrolls.filter(p => p.month.includes('December'));
  const totalGross = decemberPayrolls.reduce((sum, p) => sum + Number(p.gross), 0);
  const totalDeductions = decemberPayrolls.reduce((sum, p) => sum + Number(p.deductions), 0);
  const totalNet = decemberPayrolls.reduce((sum, p) => sum + Number(p.net_pay), 0);

  const columns = [
    {
      key: 'employee_name',
      label: 'Employee',
      sortable: true,
      render: (payroll: Payroll) => (
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#D4AF37] to-[#B8962E] flex items-center justify-center">
            <span className="text-[#0A1929] font-semibold">{payroll.employee_name.charAt(0)}</span>
          </div>
          <span className="font-medium text-white">{payroll.employee_name}</span>
        </div>
      )
    },
    { key: 'month', label: 'Period', sortable: true },
    {
      key: 'gross',
      label: 'Gross',
      sortable: true,
      render: (payroll: Payroll) => (
        <span className="text-white">${Number(payroll.gross).toLocaleString()}</span>
      )
    },
    {
      key: 'deductions',
      label: 'Deductions',
      render: (payroll: Payroll) => (
        <span className="text-red-400">-${Number(payroll.deductions).toLocaleString()}</span>
      )
    },
    {
      key: 'net_pay',
      label: 'Net Pay',
      sortable: true,
      render: (payroll: Payroll) => (
        <span className="text-[#D4AF37] font-semibold">${Number(payroll.net_pay).toLocaleString()}</span>
      )
    },
    {
      key: 'status',
      label: 'Status',
      render: (payroll: Payroll) => (
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(payroll.status)}`}>
          {payroll.status.charAt(0).toUpperCase() + payroll.status.slice(1)}
        </span>
      )
    }
  ];

  const actions = canManage ? (payroll: Payroll) => (
    <select
      value={payroll.status}
      onChange={(e) => handleStatusChange(payroll.id, e.target.value as Payroll['status'])}
      onClick={(e) => e.stopPropagation()}
      className="px-2 py-1 bg-[#1E3A5F] border border-[#2D4A6F] rounded-lg text-sm text-white focus:outline-none focus:border-[#D4AF37]"
    >
      <option value="pending">Pending</option>
      <option value="processed">Processed</option>
      <option value="paid">Paid</option>
    </select>
  ) : undefined;

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-[#D4AF37]" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white">Payroll</h1>
          <p className="text-gray-400">
            {role === 'employee' ? 'Your salary history' : 'Manage employee payroll'}
          </p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-[#0F2744] border border-[#1E3A5F] rounded-xl p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-[#D4AF37]/10">
              <DollarSign size={20} className="text-[#D4AF37]" />
            </div>
            <div>
              <p className="text-xl font-bold text-white">${totalGross.toLocaleString()}</p>
              <p className="text-xs text-gray-400">Total Gross (Dec)</p>
            </div>
          </div>
        </div>
        <div className="bg-[#0F2744] border border-[#1E3A5F] rounded-xl p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-red-500/10">
              <TrendingUp size={20} className="text-red-400" />
            </div>
            <div>
              <p className="text-xl font-bold text-red-400">${totalDeductions.toLocaleString()}</p>
              <p className="text-xs text-gray-400">Total Deductions</p>
            </div>
          </div>
        </div>
        <div className="bg-[#0F2744] border border-[#1E3A5F] rounded-xl p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-green-500/10">
              <CheckCircle size={20} className="text-green-400" />
            </div>
            <div>
              <p className="text-xl font-bold text-green-400">${totalNet.toLocaleString()}</p>
              <p className="text-xs text-gray-400">Total Net Pay</p>
            </div>
          </div>
        </div>
        <div className="bg-[#0F2744] border border-[#1E3A5F] rounded-xl p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-yellow-500/10">
              <Clock size={20} className="text-yellow-400" />
            </div>
            <div>
              <p className="text-xl font-bold text-yellow-400">
                {payrolls.filter(p => p.status === 'pending').length}
              </p>
              <p className="text-xs text-gray-400">Pending</p>
            </div>
          </div>
        </div>
      </div>

      {/* Summary Card */}
      {canManage && (
        <div className="bg-gradient-to-r from-[#1E3A5F] to-[#0F2744] border border-[#2D4A6F] rounded-xl p-6">
          <h3 className="text-lg font-semibold text-white mb-4">December 2024 Summary</h3>
          <div className="grid grid-cols-3 gap-6">
            <div>
              <p className="text-sm text-gray-400 mb-1">Pending Payments</p>
              <p className="text-2xl font-bold text-yellow-400">
                {decemberPayrolls.filter(p => p.status === 'pending').length}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-400 mb-1">Processed</p>
              <p className="text-2xl font-bold text-blue-400">
                {decemberPayrolls.filter(p => p.status === 'processed').length}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-400 mb-1">Paid</p>
              <p className="text-2xl font-bold text-green-400">
                {decemberPayrolls.filter(p => p.status === 'paid').length}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Filters */}
      <div className="flex flex-wrap gap-2">
        {['all', 'pending', 'processed', 'paid'].map(status => (
          <button
            key={status}
            onClick={() => setFilter(status)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              filter === status
                ? 'bg-[#D4AF37] text-[#0A1929]'
                : 'bg-[#1E3A5F] text-gray-300 hover:bg-[#2D4A6F]'
            }`}
          >
            {status.charAt(0).toUpperCase() + status.slice(1)}
          </button>
        ))}
      </div>

      {/* Table */}
      <DataTable
        data={filteredPayrolls}
        columns={columns}
        actions={actions}
        searchPlaceholder="Search by employee name..."
      />
    </div>
  );
};

export default PayrollPage;
