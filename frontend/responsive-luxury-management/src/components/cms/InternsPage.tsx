import React, { useState, useEffect } from 'react';
import { UserRole } from './types';
import { internsApi, departmentsApi, employeesApi, Intern, Department, Employee } from '@/lib/api';
import { useToast } from '@/hooks/use-toast';
import DataTable from './DataTable';
import Modal from './Modal';
import { Plus, Edit2, Trash2, Eye, GraduationCap, Loader2 } from 'lucide-react';

interface InternsPageProps {
  role: UserRole;
}

const InternsPage: React.FC<InternsPageProps> = ({ role }) => {
  const [interns, setInterns] = useState<Intern[]>([]);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedIntern, setSelectedIntern] = useState<Intern | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    department: '',
    mentor: '',
    start_date: '',
    end_date: ''
  });
  const { toast } = useToast();

  const canModify = role === 'admin' || role === 'hr';

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [internRes, deptRes, empRes] = await Promise.all([
        internsApi.getAll(),
        departmentsApi.getAll(),
        employeesApi.getAll()
      ]);
      
      if (internRes.data) setInterns(internRes.data);
      if (deptRes.data) setDepartments(deptRes.data);
      if (empRes.data) setEmployees(empRes.data);
    } catch (error) {
      toast({ title: 'Error', description: 'Failed to fetch data', variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = async () => {
    setIsSubmitting(true);
    try {
      if (selectedIntern) {
        const response = await internsApi.update(selectedIntern.id, {
          name: formData.name,
          email: formData.email,
          department: formData.department,
          mentor: formData.mentor,
          start_date: formData.start_date,
          end_date: formData.end_date
        });
        
        if (response.error) {
          toast({ title: 'Error', description: response.error, variant: 'destructive' });
        } else {
          toast({ title: 'Success', description: 'Intern updated successfully' });
          fetchData();
          setShowAddModal(false);
          resetForm();
        }
      } else {
        const response = await internsApi.create({
          name: formData.name,
          email: formData.email,
          department: formData.department,
          mentor: formData.mentor,
          start_date: formData.start_date,
          end_date: formData.end_date,
          status: 'active'
        });
        
        if (response.error) {
          toast({ title: 'Error', description: response.error, variant: 'destructive' });
        } else {
          toast({ title: 'Success', description: 'Intern added successfully' });
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
    if (!selectedIntern) return;
    
    setIsSubmitting(true);
    try {
      const response = await internsApi.delete(selectedIntern.id);
      
      if (response.error) {
        toast({ title: 'Error', description: response.error, variant: 'destructive' });
      } else {
        toast({ title: 'Success', description: 'Intern removed successfully' });
        fetchData();
        setShowDeleteModal(false);
        setSelectedIntern(null);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      email: '',
      department: '',
      mentor: '',
      start_date: '',
      end_date: ''
    });
    setSelectedIntern(null);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-500/20 text-green-400';
      case 'completed': return 'bg-blue-500/20 text-blue-400';
      case 'terminated': return 'bg-red-500/20 text-red-400';
      default: return 'bg-gray-500/20 text-gray-400';
    }
  };

  const columns = [
    {
      key: 'name',
      label: 'Intern',
      sortable: true,
      render: (intern: Intern) => (
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-purple-700 flex items-center justify-center">
            <span className="text-white font-semibold">{intern.name.charAt(0)}</span>
          </div>
          <div>
            <p className="font-medium text-white">{intern.name}</p>
            <p className="text-xs text-gray-400">{intern.email}</p>
          </div>
        </div>
      )
    },
    { key: 'department', label: 'Department', sortable: true },
    { key: 'mentor', label: 'Mentor', sortable: true },
    { key: 'start_date', label: 'Start Date', sortable: true },
    { key: 'end_date', label: 'End Date', sortable: true },
    {
      key: 'status',
      label: 'Status',
      render: (intern: Intern) => (
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(intern.status)}`}>
          {intern.status}
        </span>
      )
    }
  ];

  const actions = (intern: Intern) => (
    <>
      <button
        onClick={(e) => {
          e.stopPropagation();
          setSelectedIntern(intern);
          setShowViewModal(true);
        }}
        className="p-2 rounded-lg hover:bg-[#1E3A5F] text-gray-400 hover:text-[#D4AF37] transition-colors"
      >
        <Eye size={16} />
      </button>
      {canModify && (
        <>
          <button
            onClick={(e) => {
              e.stopPropagation();
              setSelectedIntern(intern);
              setFormData({
                name: intern.name,
                email: intern.email,
                department: intern.department,
                mentor: intern.mentor,
                start_date: intern.start_date,
                end_date: intern.end_date
              });
              setShowAddModal(true);
            }}
            className="p-2 rounded-lg hover:bg-[#1E3A5F] text-gray-400 hover:text-blue-400 transition-colors"
          >
            <Edit2 size={16} />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              setSelectedIntern(intern);
              setShowDeleteModal(true);
            }}
            className="p-2 rounded-lg hover:bg-[#1E3A5F] text-gray-400 hover:text-red-400 transition-colors"
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
          <h1 className="text-2xl font-bold text-white">Interns</h1>
          <p className="text-gray-400">Manage internship program participants</p>
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
            Add Intern
          </button>
        )}
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-[#0F2744] border border-[#1E3A5F] rounded-xl p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-purple-500/10">
              <GraduationCap size={20} className="text-purple-400" />
            </div>
            <div>
              <p className="text-xl font-bold text-white">{interns.length}</p>
              <p className="text-xs text-gray-400">Total Interns</p>
            </div>
          </div>
        </div>
        <div className="bg-[#0F2744] border border-[#1E3A5F] rounded-xl p-4">
          <p className="text-xl font-bold text-green-400">{interns.filter(i => i.status === 'active').length}</p>
          <p className="text-xs text-gray-400">Active</p>
        </div>
        <div className="bg-[#0F2744] border border-[#1E3A5F] rounded-xl p-4">
          <p className="text-xl font-bold text-blue-400">{interns.filter(i => i.status === 'completed').length}</p>
          <p className="text-xs text-gray-400">Completed</p>
        </div>
        <div className="bg-[#0F2744] border border-[#1E3A5F] rounded-xl p-4">
          <p className="text-xl font-bold text-[#D4AF37]">{new Set(interns.map(i => i.department)).size}</p>
          <p className="text-xs text-gray-400">Departments</p>
        </div>
      </div>

      {/* Table */}
      <DataTable
        data={interns}
        columns={columns}
        actions={actions}
        searchPlaceholder="Search interns..."
      />

      {/* Add/Edit Modal */}
      <Modal
        isOpen={showAddModal}
        onClose={() => {
          setShowAddModal(false);
          resetForm();
        }}
        title={selectedIntern ? 'Edit Intern' : 'Add New Intern'}
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
              <label className="block text-sm font-medium text-gray-300 mb-2">Mentor</label>
              <select
                value={formData.mentor}
                onChange={(e) => setFormData({ ...formData, mentor: e.target.value })}
                className="w-full px-4 py-2.5 bg-[#1E3A5F] border border-[#2D4A6F] rounded-xl text-white focus:outline-none focus:border-[#D4AF37]"
                required
              >
                <option value="">Select mentor</option>
                {employees.map(emp => (
                  <option key={emp.id} value={emp.name}>{emp.name}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Start Date</label>
              <input
                type="date"
                value={formData.start_date}
                onChange={(e) => setFormData({ ...formData, start_date: e.target.value })}
                className="w-full px-4 py-2.5 bg-[#1E3A5F] border border-[#2D4A6F] rounded-xl text-white focus:outline-none focus:border-[#D4AF37]"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">End Date</label>
              <input
                type="date"
                value={formData.end_date}
                onChange={(e) => setFormData({ ...formData, end_date: e.target.value })}
                className="w-full px-4 py-2.5 bg-[#1E3A5F] border border-[#2D4A6F] rounded-xl text-white focus:outline-none focus:border-[#D4AF37]"
                required
              />
            </div>
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
              {selectedIntern ? 'Update' : 'Add'} Intern
            </button>
          </div>
        </form>
      </Modal>

      {/* View Modal */}
      <Modal
        isOpen={showViewModal}
        onClose={() => {
          setShowViewModal(false);
          setSelectedIntern(null);
        }}
        title="Intern Details"
        size="md"
      >
        {selectedIntern && (
          <div className="space-y-6">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-purple-500 to-purple-700 flex items-center justify-center">
                <span className="text-2xl font-bold text-white">{selectedIntern.name.charAt(0)}</span>
              </div>
              <div>
                <h3 className="text-xl font-semibold text-white">{selectedIntern.name}</h3>
                <p className="text-gray-400">{selectedIntern.email}</p>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 bg-[#1E3A5F]/50 rounded-xl">
                <p className="text-xs text-gray-400 mb-1">Department</p>
                <p className="text-white">{selectedIntern.department}</p>
              </div>
              <div className="p-4 bg-[#1E3A5F]/50 rounded-xl">
                <p className="text-xs text-gray-400 mb-1">Mentor</p>
                <p className="text-white">{selectedIntern.mentor}</p>
              </div>
              <div className="p-4 bg-[#1E3A5F]/50 rounded-xl">
                <p className="text-xs text-gray-400 mb-1">Start Date</p>
                <p className="text-white">{selectedIntern.start_date}</p>
              </div>
              <div className="p-4 bg-[#1E3A5F]/50 rounded-xl">
                <p className="text-xs text-gray-400 mb-1">End Date</p>
                <p className="text-white">{selectedIntern.end_date}</p>
              </div>
              <div className="p-4 bg-[#1E3A5F]/50 rounded-xl col-span-2">
                <p className="text-xs text-gray-400 mb-1">Status</p>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(selectedIntern.status)}`}>
                  {selectedIntern.status}
                </span>
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
          setSelectedIntern(null);
        }}
        title="Remove Intern"
        size="sm"
      >
        <div className="space-y-4">
          <p className="text-gray-300">
            Are you sure you want to remove <span className="text-white font-medium">{selectedIntern?.name}</span> from the internship program?
          </p>
          <div className="flex justify-end gap-3">
            <button
              onClick={() => {
                setShowDeleteModal(false);
                setSelectedIntern(null);
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
              Remove
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default InternsPage;
