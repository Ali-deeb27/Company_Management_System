import React, { useState, useEffect } from 'react';
import { UserRole } from './types';
import { tasksApi, projectsApi, employeesApi, Task, Project, Employee } from '@/lib/api';
import { useToast } from '@/hooks/use-toast';
import DataTable from './DataTable';
import Modal from './Modal';
import { Plus, Edit2, CheckSquare, Circle, Clock, Loader2 } from 'lucide-react';

interface TasksPageProps {
  role: UserRole;
}

const TasksPage: React.FC<TasksPageProps> = ({ role }) => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [filter, setFilter] = useState<string>('all');
  const [formData, setFormData] = useState({
    project_id: '',
    project_name: '',
    assignee: '',
    description: '',
    status: 'pending' as Task['status'],
    priority: 'medium' as Task['priority'],
    start_date: '',
    end_date: ''
  });
  const { toast } = useToast();

  const canModify = role === 'admin';

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [taskRes, projRes, empRes] = await Promise.all([
        tasksApi.getAll(),
        projectsApi.getAll(),
        employeesApi.getAll()
      ]);
      
      if (taskRes.data) setTasks(taskRes.data);
      if (projRes.data) setProjects(projRes.data);
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
      const project = projects.find(p => p.id === formData.project_id);
      
      if (selectedTask) {
        const response = await tasksApi.update(selectedTask.id, {
          project_id: formData.project_id,
          project_name: project?.name || formData.project_name,
          assignee: formData.assignee,
          description: formData.description,
          status: formData.status,
          priority: formData.priority,
          start_date: formData.start_date,
          end_date: formData.end_date
        });
        
        if (response.error) {
          toast({ title: 'Error', description: response.error, variant: 'destructive' });
        } else {
          toast({ title: 'Success', description: 'Task updated successfully' });
          fetchData();
          setShowAddModal(false);
          resetForm();
        }
      } else {
        const response = await tasksApi.create({
          project_id: formData.project_id,
          project_name: project?.name || '',
          assignee: formData.assignee,
          description: formData.description,
          status: formData.status,
          priority: formData.priority,
          start_date: formData.start_date,
          end_date: formData.end_date
        });
        
        if (response.error) {
          toast({ title: 'Error', description: response.error, variant: 'destructive' });
        } else {
          toast({ title: 'Success', description: 'Task created successfully' });
          fetchData();
          setShowAddModal(false);
          resetForm();
        }
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleStatusChange = async (taskId: string, newStatus: Task['status']) => {
    try {
      const response = await tasksApi.update(taskId, { status: newStatus });
      
      if (response.error) {
        toast({ title: 'Error', description: response.error, variant: 'destructive' });
      } else {
        setTasks(tasks.map(t => t.id === taskId ? { ...t, status: newStatus } : t));
        toast({ title: 'Success', description: 'Task status updated' });
      }
    } catch (error) {
      toast({ title: 'Error', description: 'Failed to update status', variant: 'destructive' });
    }
  };

  const resetForm = () => {
    setFormData({
      project_id: '',
      project_name: '',
      assignee: '',
      description: '',
      status: 'pending',
      priority: 'medium',
      start_date: '',
      end_date: ''
    });
    setSelectedTask(null);
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed': return <CheckSquare size={16} className="text-green-400" />;
      case 'in-progress': return <Clock size={16} className="text-yellow-400" />;
      default: return <Circle size={16} className="text-gray-400" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-500/20 text-green-400';
      case 'in-progress': return 'bg-yellow-500/20 text-yellow-400';
      default: return 'bg-gray-500/20 text-gray-400';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-500/20 text-red-400';
      case 'medium': return 'bg-yellow-500/20 text-yellow-400';
      default: return 'bg-green-500/20 text-green-400';
    }
  };

  const filteredTasks = filter === 'all' ? tasks : tasks.filter(t => t.status === filter);

  const columns = [
    {
      key: 'description',
      label: 'Task',
      sortable: true,
      render: (task: Task) => (
        <div className="flex items-start gap-3">
          <button
            onClick={(e) => {
              e.stopPropagation();
              const newStatus = task.status === 'completed' ? 'pending' : 
                               task.status === 'pending' ? 'in-progress' : 'completed';
              handleStatusChange(task.id, newStatus);
            }}
            className="mt-0.5"
          >
            {getStatusIcon(task.status)}
          </button>
          <div>
            <p className={`font-medium ${task.status === 'completed' ? 'text-gray-500 line-through' : 'text-white'}`}>
              {task.description}
            </p>
            <p className="text-xs text-gray-400">{task.project_name}</p>
          </div>
        </div>
      )
    },
    { key: 'assignee', label: 'Assignee', sortable: true },
    {
      key: 'priority',
      label: 'Priority',
      render: (task: Task) => (
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(task.priority)}`}>
          {task.priority}
        </span>
      )
    },
    {
      key: 'status',
      label: 'Status',
      render: (task: Task) => (
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(task.status)}`}>
          {task.status.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')}
        </span>
      )
    },
    { key: 'end_date', label: 'Due Date', sortable: true }
  ];

  const actions = canModify ? (task: Task) => (
    <button
      onClick={(e) => {
        e.stopPropagation();
        setSelectedTask(task);
        setFormData({
          project_id: task.project_id || '',
          project_name: task.project_name,
          assignee: task.assignee,
          description: task.description,
          status: task.status,
          priority: task.priority,
          start_date: task.start_date,
          end_date: task.end_date
        });
        setShowAddModal(true);
      }}
      className="p-2 rounded-lg hover:bg-[#1E3A5F] text-gray-400 hover:text-blue-400 transition-colors"
    >
      <Edit2 size={16} />
    </button>
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
          <h1 className="text-2xl font-bold text-white">Tasks</h1>
          <p className="text-gray-400">
            {role === 'employee' || role === 'intern' ? 'Your assigned tasks' : 'Manage all project tasks'}
          </p>
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
            Add Task
          </button>
        )}
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-[#0F2744] border border-[#1E3A5F] rounded-xl p-4">
          <p className="text-2xl font-bold text-white">{tasks.length}</p>
          <p className="text-sm text-gray-400">Total Tasks</p>
        </div>
        <div className="bg-[#0F2744] border border-[#1E3A5F] rounded-xl p-4">
          <p className="text-2xl font-bold text-gray-400">{tasks.filter(t => t.status === 'pending').length}</p>
          <p className="text-sm text-gray-400">Pending</p>
        </div>
        <div className="bg-[#0F2744] border border-[#1E3A5F] rounded-xl p-4">
          <p className="text-2xl font-bold text-yellow-400">{tasks.filter(t => t.status === 'in-progress').length}</p>
          <p className="text-sm text-gray-400">In Progress</p>
        </div>
        <div className="bg-[#0F2744] border border-[#1E3A5F] rounded-xl p-4">
          <p className="text-2xl font-bold text-green-400">{tasks.filter(t => t.status === 'completed').length}</p>
          <p className="text-sm text-gray-400">Completed</p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-2">
        {['all', 'pending', 'in-progress', 'completed'].map(status => (
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

      {/* Table */}
      <DataTable
        data={filteredTasks}
        columns={columns}
        actions={actions}
        searchPlaceholder="Search tasks..."
      />

      {/* Add/Edit Modal */}
      <Modal
        isOpen={showAddModal}
        onClose={() => {
          setShowAddModal(false);
          resetForm();
        }}
        title={selectedTask ? 'Edit Task' : 'Create New Task'}
        size="lg"
      >
        <form onSubmit={(e) => { e.preventDefault(); handleAdd(); }} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Task Description</label>
            <input
              type="text"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full px-4 py-2.5 bg-[#1E3A5F] border border-[#2D4A6F] rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-[#D4AF37]"
              required
            />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Project</label>
              <select
                value={formData.project_id}
                onChange={(e) => setFormData({ ...formData, project_id: e.target.value })}
                className="w-full px-4 py-2.5 bg-[#1E3A5F] border border-[#2D4A6F] rounded-xl text-white focus:outline-none focus:border-[#D4AF37]"
                required
              >
                <option value="">Select project</option>
                {projects.map(project => (
                  <option key={project.id} value={project.id}>{project.name}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Assignee</label>
              <select
                value={formData.assignee}
                onChange={(e) => setFormData({ ...formData, assignee: e.target.value })}
                className="w-full px-4 py-2.5 bg-[#1E3A5F] border border-[#2D4A6F] rounded-xl text-white focus:outline-none focus:border-[#D4AF37]"
                required
              >
                <option value="">Select assignee</option>
                {employees.map(emp => (
                  <option key={emp.id} value={emp.name}>{emp.name}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Priority</label>
              <select
                value={formData.priority}
                onChange={(e) => setFormData({ ...formData, priority: e.target.value as Task['priority'] })}
                className="w-full px-4 py-2.5 bg-[#1E3A5F] border border-[#2D4A6F] rounded-xl text-white focus:outline-none focus:border-[#D4AF37]"
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Status</label>
              <select
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value as Task['status'] })}
                className="w-full px-4 py-2.5 bg-[#1E3A5F] border border-[#2D4A6F] rounded-xl text-white focus:outline-none focus:border-[#D4AF37]"
              >
                <option value="pending">Pending</option>
                <option value="in-progress">In Progress</option>
                <option value="completed">Completed</option>
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
              <label className="block text-sm font-medium text-gray-300 mb-2">Due Date</label>
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
              {selectedTask ? 'Update' : 'Create'} Task
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default TasksPage;
