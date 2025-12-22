import React, { useState, useEffect } from 'react';
import { UserRole } from './types';
import { departmentsApi, Department } from '@/lib/api';
import { useToast } from '@/hooks/use-toast';
import Modal from './Modal';
import { Plus, Edit2, Trash2, Users, Building2, Loader2 } from 'lucide-react';

interface DepartmentsPageProps {
  role: UserRole;
}

const DepartmentsPage: React.FC<DepartmentsPageProps> = ({ role }) => {
  const [departments, setDepartments] = useState<Department[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedDepartment, setSelectedDepartment] = useState<Department | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    manager: '',
    description: ''
  });
  const { toast } = useToast();

  const canModify = role === 'admin';

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const response = await departmentsApi.getAll();
      if (response.data) setDepartments(response.data);
      if (response.error) {
        toast({ title: 'Error', description: response.error, variant: 'destructive' });
      }
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = async () => {
    setIsSubmitting(true);
    try {
      if (selectedDepartment) {
        const response = await departmentsApi.update(selectedDepartment.id, {
          name: formData.name,
          manager: formData.manager,
          description: formData.description
        });
        
        if (response.error) {
          toast({ title: 'Error', description: response.error, variant: 'destructive' });
        } else {
          toast({ title: 'Success', description: 'Department updated successfully' });
          fetchData();
          setShowAddModal(false);
          resetForm();
        }
      } else {
        const response = await departmentsApi.create({
          name: formData.name,
          manager: formData.manager,
          description: formData.description,
          employee_count: 0
        });
        
        if (response.error) {
          toast({ title: 'Error', description: response.error, variant: 'destructive' });
        } else {
          toast({ title: 'Success', description: 'Department created successfully' });
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
    if (!selectedDepartment) return;
    
    setIsSubmitting(true);
    try {
      const response = await departmentsApi.delete(selectedDepartment.id);
      
      if (response.error) {
        toast({ title: 'Error', description: response.error, variant: 'destructive' });
      } else {
        toast({ title: 'Success', description: 'Department deleted successfully' });
        fetchData();
        setShowDeleteModal(false);
        setSelectedDepartment(null);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetForm = () => {
    setFormData({ name: '', manager: '', description: '' });
    setSelectedDepartment(null);
  };

  const totalEmployees = departments.reduce((sum, dept) => sum + (dept.employee_count || 0), 0);

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
          <h1 className="text-2xl font-bold text-white">Departments</h1>
          <p className="text-gray-400">Manage your company's organizational structure</p>
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
            Add Department
          </button>
        )}
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
        <div className="bg-[#0F2744] border border-[#1E3A5F] rounded-xl p-4">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-xl bg-[#D4AF37]/10">
              <Building2 size={24} className="text-[#D4AF37]" />
            </div>
            <div>
              <p className="text-2xl font-bold text-white">{departments.length}</p>
              <p className="text-sm text-gray-400">Total Departments</p>
            </div>
          </div>
        </div>
        <div className="bg-[#0F2744] border border-[#1E3A5F] rounded-xl p-4">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-xl bg-blue-500/10">
              <Users size={24} className="text-blue-400" />
            </div>
            <div>
              <p className="text-2xl font-bold text-white">{totalEmployees}</p>
              <p className="text-sm text-gray-400">Total Employees</p>
            </div>
          </div>
        </div>
        <div className="bg-[#0F2744] border border-[#1E3A5F] rounded-xl p-4 col-span-2 sm:col-span-1">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-xl bg-green-500/10">
              <Users size={24} className="text-green-400" />
            </div>
            <div>
              <p className="text-2xl font-bold text-white">{departments.length > 0 ? Math.round(totalEmployees / departments.length) : 0}</p>
              <p className="text-sm text-gray-400">Avg per Department</p>
            </div>
          </div>
        </div>
      </div>

      {/* Department Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {departments.map(department => (
          <div
            key={department.id}
            className="bg-[#0F2744] border border-[#1E3A5F] rounded-xl p-6 hover:border-[#D4AF37]/50 transition-all group"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#D4AF37]/20 to-[#D4AF37]/5 flex items-center justify-center">
                <Building2 size={24} className="text-[#D4AF37]" />
              </div>
              {canModify && (
                <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    onClick={() => {
                      setSelectedDepartment(department);
                      setFormData({
                        name: department.name,
                        manager: department.manager,
                        description: department.description
                      });
                      setShowAddModal(true);
                    }}
                    className="p-2 rounded-lg hover:bg-[#1E3A5F] text-gray-400 hover:text-blue-400 transition-colors"
                  >
                    <Edit2 size={16} />
                  </button>
                  <button
                    onClick={() => {
                      setSelectedDepartment(department);
                      setShowDeleteModal(true);
                    }}
                    className="p-2 rounded-lg hover:bg-[#1E3A5F] text-gray-400 hover:text-red-400 transition-colors"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              )}
            </div>
            
            <h3 className="text-lg font-semibold text-white mb-1">{department.name}</h3>
            <p className="text-sm text-gray-400 mb-4 line-clamp-2">{department.description}</p>
            
            <div className="pt-4 border-t border-[#1E3A5F] flex items-center justify-between">
              <div>
                <p className="text-xs text-gray-400">Manager</p>
                <p className="text-sm text-white">{department.manager}</p>
              </div>
              <div className="text-right">
                <p className="text-xs text-gray-400">Employees</p>
                <p className="text-sm text-[#D4AF37] font-semibold">{department.employee_count || 0}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {departments.length === 0 && (
        <div className="text-center py-12 bg-[#0F2744] border border-[#1E3A5F] rounded-xl">
          <Building2 size={48} className="mx-auto text-gray-600 mb-4" />
          <p className="text-gray-400">No departments found</p>
        </div>
      )}

      {/* Add/Edit Modal */}
      <Modal
        isOpen={showAddModal}
        onClose={() => {
          setShowAddModal(false);
          resetForm();
        }}
        title={selectedDepartment ? 'Edit Department' : 'Add New Department'}
        size="md"
      >
        <form onSubmit={(e) => { e.preventDefault(); handleAdd(); }} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Department Name</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-4 py-2.5 bg-[#1E3A5F] border border-[#2D4A6F] rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-[#D4AF37]"
              placeholder="e.g., Engineering"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Manager</label>
            <input
              type="text"
              value={formData.manager}
              onChange={(e) => setFormData({ ...formData, manager: e.target.value })}
              className="w-full px-4 py-2.5 bg-[#1E3A5F] border border-[#2D4A6F] rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-[#D4AF37]"
              placeholder="Manager name"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Description</label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full px-4 py-2.5 bg-[#1E3A5F] border border-[#2D4A6F] rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-[#D4AF37] resize-none"
              rows={3}
              placeholder="Department description..."
              required
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
              {selectedDepartment ? 'Update' : 'Add'} Department
            </button>
          </div>
        </form>
      </Modal>

      {/* Delete Modal */}
      <Modal
        isOpen={showDeleteModal}
        onClose={() => {
          setShowDeleteModal(false);
          setSelectedDepartment(null);
        }}
        title="Delete Department"
        size="sm"
      >
        <div className="space-y-4">
          <p className="text-gray-300">
            Are you sure you want to delete <span className="text-white font-medium">{selectedDepartment?.name}</span>? 
            This will affect {selectedDepartment?.employee_count || 0} employees.
          </p>
          <div className="flex justify-end gap-3">
            <button
              onClick={() => {
                setShowDeleteModal(false);
                setSelectedDepartment(null);
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

export default DepartmentsPage;
