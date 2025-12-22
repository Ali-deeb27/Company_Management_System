import React, { useState, useEffect } from 'react';
import { UserRole } from './types';
import { employeesApi, departmentsApi, Employee, Department } from '@/lib/api';
import { useToast } from '@/hooks/use-toast';
import DataTable from './DataTable';
import Modal from './Modal';
import { Plus, Edit2, Trash2, Eye, Mail, Building2, Loader2 } from 'lucide-react';

interface EmployeesPageProps {
  role: UserRole;
}

const EmployeesPage: React.FC<EmployeesPageProps> = ({ role }) => {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    position: '',
    department: '',
    salary: '',
    hire_date: '',
    bank_details: ''
  });
  const { toast } = useToast();

  const canModify = role === 'admin' || role === 'hr';

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [empResponse, deptResponse] = await Promise.all([
        employeesApi.getAll(),
        departmentsApi.getAll()
      ]);
      
      if (empResponse.data) setEmployees(empResponse.data);
      if (deptResponse.data) setDepartments(deptResponse.data);
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to fetch data',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = async () => {
    setIsSubmitting(true);
    try {
      if (selectedEmployee) {
        const response = await employeesApi.update(selectedEmployee.id, {
          name: formData.name,
          email: formData.email,
          position: formData.position,
          department: formData.department,
          salary: Number(formData.salary),
          hire_date: formData.hire_date,
          bank_details: formData.bank_details
        });
        
        if (response.error) {
          toast({ title: 'Error', description: response.error, variant: 'destructive' });
        } else {
          toast({ title: 'Success', description: 'Employee updated successfully' });
          fetchData();
          setShowAddModal(false);
          resetForm();
        }
      } else {
        const response = await employeesApi.create({
          name: formData.name,
          email: formData.email,
          position: formData.position,
          department: formData.department,
          salary: Number(formData.salary),
          hire_date: formData.hire_date,
          bank_details: formData.bank_details,
          status: 'active'
        });
        
        if (response.error) {
          toast({ title: 'Error', description: response.error, variant: 'destructive' });
        } else {
          toast({ title: 'Success', description: 'Employee added successfully' });
          fetchData();
          setShowAddModal(false);
          resetForm();
        }
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!selectedEmployee) return;
    
    setIsSubmitting(true);
    try {
      const response = await employeesApi.delete(selectedEmployee.id);
      
      if (response.error) {
        toast({ title: 'Error', description: response.error, variant: 'destructive' });
      } else {
        toast({ title: 'Success', description: 'Employee deleted successfully' });
        fetchData();
        setShowDeleteModal(false);
        setSelectedEmployee(null);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      email: '',
      position: '',
      department: '',
      salary: '',
      hire_date: '',
      bank_details: ''
    });
    setSelectedEmployee(null);
  };

  const columns = [
    {
      key: 'name',
      label: 'Employee',
      sortable: true,
      render: (employee: Employee) => (
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#D4AF37] to-[#B8962E] flex items-center justify-center">
            <span className="text-[#0A1929] font-semibold">{employee.name.charAt(0)}</span>
          </div>
          <div>
            <p className="font-medium text-white">{employee.name}</p>
            <p className="text-xs text-gray-400">{employee.email}</p>
          </div>
        </div>
      )
    },
    { key: 'position', label: 'Position', sortable: true },
    { key: 'department', label: 'Department', sortable: true },
    { 
      key: 'salary', 
      label: 'Salary', 
      sortable: true,
      render: (employee: Employee) => (
        <span className="text-[#D4AF37] font-medium">${Number(employee.salary).toLocaleString()}</span>
      )
    },
    { key: 'hire_date', label: 'Hire Date', sortable: true },
    {
      key: 'status',
      label: 'Status',
      render: (employee: Employee) => (
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
          employee.status === 'active' 
            ? 'bg-green-500/20 text-green-400' 
            : 'bg-red-500/20 text-red-400'
        }`}>
          {employee.status}
        </span>
      )
    }
  ];

  const actions = (employee: Employee) => (
    <>
      <button
        onClick={(e) => {
          e.stopPropagation();
          setSelectedEmployee(employee);
          setShowViewModal(true);
        }}
        className="p-2 rounded-lg hover:bg-[#1E3A5F] text-gray-400 hover:text-[#D4AF37] transition-colors"
        title="View"
      >
        <Eye size={16} />
      </button>
      {canModify && (
        <>
          <button
            onClick={(e) => {
              e.stopPropagation();
              setSelectedEmployee(employee);
              setFormData({
                name: employee.name,
                email: employee.email,
                position: employee.position,
                department: employee.department,
                salary: String(employee.salary),
                hire_date: employee.hire_date,
                bank_details: employee.bank_details
              });
              setShowAddModal(true);
            }}
            className="p-2 rounded-lg hover:bg-[#1E3A5F] text-gray-400 hover:text-blue-400 transition-colors"
            title="Edit"
          >
            <Edit2 size={16} />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              setSelectedEmployee(employee);
              setShowDeleteModal(true);
            }}
            className="p-2 rounded-lg hover:bg-[#1E3A5F] text-gray-400 hover:text-red-400 transition-colors"
            title="Delete"
          >
            <Trash2 size={16} />
          </button>
        </>
      )}
    </>
  );

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
          <h1 className="text-2xl font-bold text-white">Employees</h1>
          <p className="text-gray-400">Manage your company's workforce</p>
        </div>
        {canModify && (
          <button
            onClick={() => {
              resetForm();
              setShowAddModal(true);
            }}
            className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-[#D4AF37] to-[#B8962E] text-[#0A1929] font-semibold rounded-xl hover:from-[#E5C04A] hover:to-[#D4AF37] transition-all"
          >
            <Plus size={20} />
            Add Employee
          </button>
        )}
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-[#0F2744] border border-[#1E3A5F] rounded-xl p-4">
          <p className="text-2xl font-bold text-white">{employees.length}</p>
          <p className="text-sm text-gray-400">Total Employees</p>
        </div>
        <div className="bg-[#0F2744] border border-[#1E3A5F] rounded-xl p-4">
          <p className="text-2xl font-bold text-green-400">{employees.filter(e => e.status === 'active').length}</p>
          <p className="text-sm text-gray-400">Active</p>
        </div>
        <div className="bg-[#0F2744] border border-[#1E3A5F] rounded-xl p-4">
          <p className="text-2xl font-bold text-red-400">{employees.filter(e => e.status === 'inactive').length}</p>
          <p className="text-sm text-gray-400">Inactive</p>
        </div>
        <div className="bg-[#0F2744] border border-[#1E3A5F] rounded-xl p-4">
          <p className="text-2xl font-bold text-[#D4AF37]">{departments.length}</p>
          <p className="text-sm text-gray-400">Departments</p>
        </div>
      </div>

      {/* Table */}
      <DataTable
        data={employees}
        columns={columns}
        actions={actions}
        searchPlaceholder="Search employees..."
      />

      {/* Add/Edit Modal */}
      <Modal
        isOpen={showAddModal}
        onClose={() => {
          setShowAddModal(false);
          resetForm();
        }}
        title={selectedEmployee ? 'Edit Employee' : 'Add New Employee'}
        size="lg"
      >
        <form onSubmit={(e) => { e.preventDefault(); handleAdd(); }} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Full Name</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-4 py-2.5 bg-[#1E3A5F] border border-[#2D4A6F] rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-[#D4AF37]"
                placeholder="John Doe"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Email</label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full px-4 py-2.5 bg-[#1E3A5F] border border-[#2D4A6F] rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-[#D4AF37]"
                placeholder="john@company.com"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Position</label>
              <input
                type="text"
                value={formData.position}
                onChange={(e) => setFormData({ ...formData, position: e.target.value })}
                className="w-full px-4 py-2.5 bg-[#1E3A5F] border border-[#2D4A6F] rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-[#D4AF37]"
                placeholder="Software Engineer"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Department</label>
              <select
                value={formData.department}
                onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                className="w-full px-4 py-2.5 bg-[#1E3A5F] border border-[#2D4A6F] rounded-xl text-white focus:outline-none focus:border-[#D4AF37]"
                required
              >
                <option value="">Select department</option>
                {departments.map(dept => (
                  <option key={dept.id} value={dept.name}>{dept.name}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Salary</label>
              <input
                type="number"
                value={formData.salary}
                onChange={(e) => setFormData({ ...formData, salary: e.target.value })}
                className="w-full px-4 py-2.5 bg-[#1E3A5F] border border-[#2D4A6F] rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-[#D4AF37]"
                placeholder="75000"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Hire Date</label>
              <input
                type="date"
                value={formData.hire_date}
                onChange={(e) => setFormData({ ...formData, hire_date: e.target.value })}
                className="w-full px-4 py-2.5 bg-[#1E3A5F] border border-[#2D4A6F] rounded-xl text-white focus:outline-none focus:border-[#D4AF37]"
                required
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Bank Details</label>
            <input
              type="text"
              value={formData.bank_details}
              onChange={(e) => setFormData({ ...formData, bank_details: e.target.value })}
              className="w-full px-4 py-2.5 bg-[#1E3A5F] border border-[#2D4A6F] rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-[#D4AF37]"
              placeholder="****1234"
            />
          </div>
          <div className="flex justify-end gap-3 pt-4">
            <button
              type="button"
              onClick={() => {
                setShowAddModal(false);
                resetForm();
              }}
              className="px-4 py-2.5 border border-[#1E3A5F] text-gray-300 rounded-xl hover:bg-[#1E3A5F] transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-6 py-2.5 bg-gradient-to-r from-[#D4AF37] to-[#B8962E] text-[#0A1929] font-semibold rounded-xl hover:from-[#E5C04A] hover:to-[#D4AF37] transition-all disabled:opacity-50 flex items-center gap-2"
            >
              {isSubmitting && <Loader2 className="w-4 h-4 animate-spin" />}
              {selectedEmployee ? 'Update' : 'Add'} Employee
            </button>
          </div>
        </form>
      </Modal>

      {/* View Modal */}
      <Modal
        isOpen={showViewModal}
        onClose={() => {
          setShowViewModal(false);
          setSelectedEmployee(null);
        }}
        title="Employee Details"
        size="md"
      >
        {selectedEmployee && (
          <div className="space-y-6">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-[#D4AF37] to-[#B8962E] flex items-center justify-center">
                <span className="text-2xl font-bold text-[#0A1929]">{selectedEmployee.name.charAt(0)}</span>
              </div>
              <div>
                <h3 className="text-xl font-semibold text-white">{selectedEmployee.name}</h3>
                <p className="text-[#D4AF37]">{selectedEmployee.position}</p>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 bg-[#1E3A5F]/50 rounded-xl">
                <div className="flex items-center gap-2 text-gray-400 mb-1">
                  <Mail size={14} />
                  <span className="text-xs">Email</span>
                </div>
                <p className="text-white">{selectedEmployee.email}</p>
              </div>
              <div className="p-4 bg-[#1E3A5F]/50 rounded-xl">
                <div className="flex items-center gap-2 text-gray-400 mb-1">
                  <Building2 size={14} />
                  <span className="text-xs">Department</span>
                </div>
                <p className="text-white">{selectedEmployee.department}</p>
              </div>
              <div className="p-4 bg-[#1E3A5F]/50 rounded-xl">
                <p className="text-xs text-gray-400 mb-1">Salary</p>
                <p className="text-[#D4AF37] font-semibold">${Number(selectedEmployee.salary).toLocaleString()}/year</p>
              </div>
              <div className="p-4 bg-[#1E3A5F]/50 rounded-xl">
                <p className="text-xs text-gray-400 mb-1">Hire Date</p>
                <p className="text-white">{selectedEmployee.hire_date}</p>
              </div>
              <div className="p-4 bg-[#1E3A5F]/50 rounded-xl">
                <p className="text-xs text-gray-400 mb-1">Status</p>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                  selectedEmployee.status === 'active' 
                    ? 'bg-green-500/20 text-green-400' 
                    : 'bg-red-500/20 text-red-400'
                }`}>
                  {selectedEmployee.status}
                </span>
              </div>
              <div className="p-4 bg-[#1E3A5F]/50 rounded-xl">
                <p className="text-xs text-gray-400 mb-1">Bank Details</p>
                <p className="text-white">{selectedEmployee.bank_details}</p>
              </div>
            </div>
          </div>
        )}
      </Modal>

      {/* Delete Modal */}
      <Modal
        isOpen={showDeleteModal}
        onClose={() => {
          setShowDeleteModal(false);
          setSelectedEmployee(null);
        }}
        title="Delete Employee"
        size="sm"
      >
        <div className="space-y-4">
          <p className="text-gray-300">
            Are you sure you want to delete <span className="text-white font-medium">{selectedEmployee?.name}</span>? 
            This action cannot be undone.
          </p>
          <div className="flex justify-end gap-3">
            <button
              onClick={() => {
                setShowDeleteModal(false);
                setSelectedEmployee(null);
              }}
              className="px-4 py-2.5 border border-[#1E3A5F] text-gray-300 rounded-xl hover:bg-[#1E3A5F] transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleDelete}
              disabled={isSubmitting}
              className="px-4 py-2.5 bg-red-500 text-white font-semibold rounded-xl hover:bg-red-600 transition-colors disabled:opacity-50 flex items-center gap-2"
            >
              {isSubmitting && <Loader2 className="w-4 h-4 animate-spin" />}
              Delete
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default EmployeesPage;
