import React, { useState, useEffect } from 'react';
import { UserRole } from './types';
import { projectsApi, departmentsApi, Project, Department } from '@/lib/api';
import { useToast } from '@/hooks/use-toast';
import Modal from './Modal';
import { Plus, Edit2, Eye, FolderKanban, Calendar, DollarSign, Loader2 } from 'lucide-react';

interface ProjectsPageProps {
  role: UserRole;
}

const ProjectsPage: React.FC<ProjectsPageProps> = ({ role }) => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [filter, setFilter] = useState<string>('all');
  const [formData, setFormData] = useState({
    name: '',
    department: '',
    budget: '',
    start_date: '',
    end_date: '',
    description: '',
    status: 'planning' as Project['status']
  });
  const { toast } = useToast();

  const canModify = role === 'admin';

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [projRes, deptRes] = await Promise.all([
        projectsApi.getAll(),
        departmentsApi.getAll()
      ]);
      
      if (projRes.data) setProjects(projRes.data);
      if (deptRes.data) setDepartments(deptRes.data);
    } catch (error) {
      toast({ title: 'Error', description: 'Failed to fetch data', variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = async () => {
    setIsSubmitting(true);
    try {
      if (selectedProject) {
        const response = await projectsApi.update(selectedProject.id, {
          name: formData.name,
          department: formData.department,
          budget: Number(formData.budget),
          start_date: formData.start_date,
          end_date: formData.end_date,
          description: formData.description,
          status: formData.status
        });
        
        if (response.error) {
          toast({ title: 'Error', description: response.error, variant: 'destructive' });
        } else {
          toast({ title: 'Success', description: 'Project updated successfully' });
          fetchData();
          setShowAddModal(false);
          resetForm();
        }
      } else {
        const response = await projectsApi.create({
          name: formData.name,
          department: formData.department,
          budget: Number(formData.budget),
          start_date: formData.start_date,
          end_date: formData.end_date,
          description: formData.description,
          status: formData.status
        });
        
        if (response.error) {
          toast({ title: 'Error', description: response.error, variant: 'destructive' });
        } else {
          toast({ title: 'Success', description: 'Project created successfully' });
          fetchData();
          setShowAddModal(false);
          resetForm();
        }
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      department: '',
      budget: '',
      start_date: '',
      end_date: '',
      description: '',
      status: 'planning'
    });
    setSelectedProject(null);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'planning': return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
      case 'in-progress': return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
      case 'completed': return 'bg-green-500/20 text-green-400 border-green-500/30';
      case 'on-hold': return 'bg-red-500/20 text-red-400 border-red-500/30';
      default: return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
    }
  };

  const filteredProjects = filter === 'all' 
    ? projects 
    : projects.filter(p => p.status === filter);

  const totalBudget = projects.reduce((sum, p) => sum + Number(p.budget), 0);

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
          <h1 className="text-2xl font-bold text-white">Projects</h1>
          <p className="text-gray-400">Track and manage all company projects</p>
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
            New Project
          </button>
        )}
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-[#0F2744] border border-[#1E3A5F] rounded-xl p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-[#D4AF37]/10">
              <FolderKanban size={20} className="text-[#D4AF37]" />
            </div>
            <div>
              <p className="text-xl font-bold text-white">{projects.length}</p>
              <p className="text-xs text-gray-400">Total Projects</p>
            </div>
          </div>
        </div>
        <div className="bg-[#0F2744] border border-[#1E3A5F] rounded-xl p-4">
          <p className="text-xl font-bold text-yellow-400">{projects.filter(p => p.status === 'in-progress').length}</p>
          <p className="text-xs text-gray-400">In Progress</p>
        </div>
        <div className="bg-[#0F2744] border border-[#1E3A5F] rounded-xl p-4">
          <p className="text-xl font-bold text-green-400">{projects.filter(p => p.status === 'completed').length}</p>
          <p className="text-xs text-gray-400">Completed</p>
        </div>
        <div className="bg-[#0F2744] border border-[#1E3A5F] rounded-xl p-4">
          <p className="text-xl font-bold text-[#D4AF37]">${(totalBudget / 1000).toFixed(0)}K</p>
          <p className="text-xs text-gray-400">Total Budget</p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-2">
        {['all', 'planning', 'in-progress', 'completed', 'on-hold'].map(status => (
          <button
            key={status}
            onClick={() => setFilter(status)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              filter === status
                ? 'bg-[#D4AF37] text-[#0A1929]'
                : 'bg-[#1E3A5F] text-gray-300 hover:bg-[#2D4A6F]'
            }`}
          >
            {status === 'all' ? 'All' : status.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')}
          </button>
        ))}
      </div>

      {/* Project Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredProjects.map(project => (
          <div
            key={project.id}
            className="bg-[#0F2744] border border-[#1E3A5F] rounded-xl overflow-hidden hover:border-[#D4AF37]/50 transition-all group cursor-pointer"
            onClick={() => {
              setSelectedProject(project);
              setShowViewModal(true);
            }}
          >
            <div className="p-5">
              <div className="flex items-start justify-between mb-3">
                <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(project.status)}`}>
                  {project.status.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')}
                </span>
                {canModify && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedProject(project);
                      setFormData({
                        name: project.name,
                        department: project.department,
                        budget: String(project.budget),
                        start_date: project.start_date,
                        end_date: project.end_date,
                        description: project.description,
                        status: project.status
                      });
                      setShowAddModal(true);
                    }}
                    className="p-1.5 rounded-lg hover:bg-[#1E3A5F] text-gray-400 hover:text-[#D4AF37] opacity-0 group-hover:opacity-100 transition-all"
                  >
                    <Edit2 size={14} />
                  </button>
                )}
              </div>
              
              <h3 className="text-lg font-semibold text-white mb-2">{project.name}</h3>
              <p className="text-sm text-gray-400 mb-4 line-clamp-2">{project.description}</p>
              
              <div className="flex items-center gap-4 text-sm">
                <div className="flex items-center gap-1.5 text-gray-400">
                  <DollarSign size={14} className="text-[#D4AF37]" />
                  <span>${Number(project.budget).toLocaleString()}</span>
                </div>
                <div className="flex items-center gap-1.5 text-gray-400">
                  <Calendar size={14} className="text-blue-400" />
                  <span>{project.end_date}</span>
                </div>
              </div>
            </div>
            
            <div className="px-5 py-3 bg-[#1E3A5F]/30 border-t border-[#1E3A5F]">
              <div className="flex items-center justify-between">
                <span className="text-xs text-gray-400">{project.department}</span>
                <button className="text-xs text-[#D4AF37] hover:underline">View Details</button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredProjects.length === 0 && (
        <div className="text-center py-12">
          <FolderKanban size={48} className="mx-auto text-gray-600 mb-4" />
          <p className="text-gray-400">No projects found</p>
        </div>
      )}

      {/* Add/Edit Modal */}
      <Modal
        isOpen={showAddModal}
        onClose={() => {
          setShowAddModal(false);
          resetForm();
        }}
        title={selectedProject ? 'Edit Project' : 'Create New Project'}
        size="lg"
      >
        <form onSubmit={(e) => { e.preventDefault(); handleAdd(); }} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Project Name</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-4 py-2.5 bg-[#1E3A5F] border border-[#2D4A6F] rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-[#D4AF37]"
              required
            />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
              <label className="block text-sm font-medium text-gray-300 mb-2">Budget</label>
              <input
                type="number"
                value={formData.budget}
                onChange={(e) => setFormData({ ...formData, budget: e.target.value })}
                className="w-full px-4 py-2.5 bg-[#1E3A5F] border border-[#2D4A6F] rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-[#D4AF37]"
                required
              />
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
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Status</label>
            <select
              value={formData.status}
              onChange={(e) => setFormData({ ...formData, status: e.target.value as Project['status'] })}
              className="w-full px-4 py-2.5 bg-[#1E3A5F] border border-[#2D4A6F] rounded-xl text-white focus:outline-none focus:border-[#D4AF37]"
            >
              <option value="planning">Planning</option>
              <option value="in-progress">In Progress</option>
              <option value="completed">Completed</option>
              <option value="on-hold">On Hold</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Description</label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full px-4 py-2.5 bg-[#1E3A5F] border border-[#2D4A6F] rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-[#D4AF37] resize-none"
              rows={3}
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
              {selectedProject ? 'Update' : 'Create'} Project
            </button>
          </div>
        </form>
      </Modal>

      {/* View Modal */}
      <Modal
        isOpen={showViewModal}
        onClose={() => {
          setShowViewModal(false);
          setSelectedProject(null);
        }}
        title="Project Details"
        size="lg"
      >
        {selectedProject && (
          <div className="space-y-6">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="text-xl font-semibold text-white mb-2">{selectedProject.name}</h3>
                <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(selectedProject.status)}`}>
                  {selectedProject.status.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')}
                </span>
              </div>
            </div>
            
            <p className="text-gray-400">{selectedProject.description}</p>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 bg-[#1E3A5F]/50 rounded-xl">
                <p className="text-xs text-gray-400 mb-1">Department</p>
                <p className="text-white">{selectedProject.department}</p>
              </div>
              <div className="p-4 bg-[#1E3A5F]/50 rounded-xl">
                <p className="text-xs text-gray-400 mb-1">Budget</p>
                <p className="text-[#D4AF37] font-semibold">${Number(selectedProject.budget).toLocaleString()}</p>
              </div>
              <div className="p-4 bg-[#1E3A5F]/50 rounded-xl">
                <p className="text-xs text-gray-400 mb-1">Start Date</p>
                <p className="text-white">{selectedProject.start_date}</p>
              </div>
              <div className="p-4 bg-[#1E3A5F]/50 rounded-xl">
                <p className="text-xs text-gray-400 mb-1">End Date</p>
                <p className="text-white">{selectedProject.end_date}</p>
              </div>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default ProjectsPage;
