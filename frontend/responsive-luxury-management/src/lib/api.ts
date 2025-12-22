import { supabase } from './supabase';

// Types
export interface ApiResponse<T> {
  data: T | null;
  error: string | null;
  loading?: boolean;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'hr' | 'employee' | 'intern' | 'accountant';
  department: string;
  status: 'active' | 'inactive';
  avatar_url?: string;
  created_at?: string;
}

export interface Department {
  id: string;
  name: string;
  manager: string;
  description: string;
  employee_count: number;
}

export interface Employee {
  id: string;
  user_id?: string;
  name: string;
  email: string;
  hire_date: string;
  position: string;
  department: string;
  salary: number;
  bank_details: string;
  status: 'active' | 'inactive';
}

export interface Intern {
  id: string;
  name: string;
  email: string;
  department: string;
  mentor: string;
  start_date: string;
  end_date: string;
  status: 'active' | 'completed' | 'terminated';
}

export interface Project {
  id: string;
  name: string;
  department: string;
  budget: number;
  start_date: string;
  end_date: string;
  status: 'planning' | 'in-progress' | 'completed' | 'on-hold';
  description: string;
}

export interface Task {
  id: string;
  project_id?: string;
  project_name: string;
  assignee: string;
  description: string;
  status: 'pending' | 'in-progress' | 'completed';
  priority: 'low' | 'medium' | 'high';
  start_date: string;
  end_date: string;
}

export interface Attendance {
  id: string;
  user_id?: string;
  user_name: string;
  date: string;
  check_in: string | null;
  check_out: string | null;
  hours_worked: number;
  status: 'present' | 'absent' | 'late' | 'half-day';
}

export interface Payroll {
  id: string;
  employee_id?: string;
  employee_name: string;
  month: string;
  gross: number;
  deductions: number;
  net_pay: number;
  status: 'pending' | 'processed' | 'paid';
}

export interface Event {
  id: string;
  title: string;
  description: string;
  date: string;
  time: string;
  location: string;
  target_audience: string[];
}

export interface Document {
  id: string;
  title: string;
  link: string;
  uploaded_by: string;
  associated_entity: string;
  upload_date: string;
  type: 'pdf' | 'doc' | 'xls' | 'other';
}

// Token management
const TOKEN_KEY = 'cms_auth_token';
const REFRESH_TOKEN_KEY = 'cms_refresh_token';
const USER_KEY = 'cms_user';

export const tokenManager = {
  getToken: (): string | null => localStorage.getItem(TOKEN_KEY),
  setToken: (token: string) => localStorage.setItem(TOKEN_KEY, token),
  getRefreshToken: (): string | null => localStorage.getItem(REFRESH_TOKEN_KEY),
  setRefreshToken: (token: string) => localStorage.setItem(REFRESH_TOKEN_KEY, token),
  getUser: (): User | null => {
    const user = localStorage.getItem(USER_KEY);
    return user ? JSON.parse(user) : null;
  },
  setUser: (user: User) => localStorage.setItem(USER_KEY, JSON.stringify(user)),
  clear: () => {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(REFRESH_TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
  },
  isAuthenticated: (): boolean => !!localStorage.getItem(TOKEN_KEY)
};

// Generate simple JWT-like token (in production, use proper JWT library)
const generateToken = (userId: string): string => {
  const payload = {
    userId,
    exp: Date.now() + 3600000, // 1 hour
    iat: Date.now()
  };
  return btoa(JSON.stringify(payload));
};

const generateRefreshToken = (userId: string): string => {
  const payload = {
    userId,
    exp: Date.now() + 604800000, // 7 days
    iat: Date.now()
  };
  return btoa(JSON.stringify(payload));
};

// Auth API
export const authApi = {
  login: async (email: string, password: string, role: string): Promise<ApiResponse<{ user: User; token: string }>> => {
    try {
      // Find user by email and role
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('email', email)
        .eq('role', role)
        .single();

      if (error || !data) {
        // For demo, create a user if not found
        const roleNames: Record<string, string> = {
          admin: 'John Anderson',
          hr: 'Sarah Mitchell',
          employee: 'Michael Chen',
          intern: 'Lisa Thompson',
          accountant: 'James Wilson'
        };
        
        const roleDepts: Record<string, string> = {
          admin: 'Management',
          hr: 'Human Resources',
          employee: 'Engineering',
          intern: 'Engineering',
          accountant: 'Finance'
        };

        const user: User = {
          id: crypto.randomUUID(),
          name: roleNames[role] || 'User',
          email,
          role: role as User['role'],
          department: roleDepts[role] || 'General',
          status: 'active'
        };

        const token = generateToken(user.id);
        const refreshToken = generateRefreshToken(user.id);
        
        tokenManager.setToken(token);
        tokenManager.setRefreshToken(refreshToken);
        tokenManager.setUser(user);

        return { data: { user, token }, error: null };
      }

      const user: User = {
        id: data.id,
        name: data.name,
        email: data.email,
        role: data.role,
        department: data.department,
        status: data.status
      };

      const token = generateToken(user.id);
      const refreshToken = generateRefreshToken(user.id);
      
      tokenManager.setToken(token);
      tokenManager.setRefreshToken(refreshToken);
      tokenManager.setUser(user);

      return { data: { user, token }, error: null };
    } catch (err) {
      return { data: null, error: 'Login failed. Please try again.' };
    }
  },

  signup: async (name: string, email: string, password: string, role: string, department: string): Promise<ApiResponse<{ user: User; token: string }>> => {
    try {
      const { data, error } = await supabase
        .from('users')
        .insert({
          name,
          email,
          password_hash: '$2a$10$hash', // In production, hash properly
          role,
          department,
          status: 'active'
        })
        .select()
        .single();

      if (error) {
        return { data: null, error: error.message };
      }

      const user: User = {
        id: data.id,
        name: data.name,
        email: data.email,
        role: data.role,
        department: data.department,
        status: data.status
      };

      const token = generateToken(user.id);
      const refreshToken = generateRefreshToken(user.id);
      
      tokenManager.setToken(token);
      tokenManager.setRefreshToken(refreshToken);
      tokenManager.setUser(user);

      return { data: { user, token }, error: null };
    } catch (err) {
      return { data: null, error: 'Signup failed. Please try again.' };
    }
  },

  logout: () => {
    tokenManager.clear();
  },

  refreshToken: async (): Promise<ApiResponse<{ token: string }>> => {
    const refreshToken = tokenManager.getRefreshToken();
    if (!refreshToken) {
      return { data: null, error: 'No refresh token' };
    }

    try {
      const payload = JSON.parse(atob(refreshToken));
      if (payload.exp < Date.now()) {
        tokenManager.clear();
        return { data: null, error: 'Refresh token expired' };
      }

      const newToken = generateToken(payload.userId);
      tokenManager.setToken(newToken);
      return { data: { token: newToken }, error: null };
    } catch {
      return { data: null, error: 'Invalid refresh token' };
    }
  }
};

// Departments API
export const departmentsApi = {
  getAll: async (): Promise<ApiResponse<Department[]>> => {
    try {
      const { data, error } = await supabase
        .from('departments')
        .select('*')
        .order('name');

      if (error) return { data: null, error: error.message };
      return { data: data as Department[], error: null };
    } catch (err) {
      return { data: null, error: 'Failed to fetch departments' };
    }
  },

  create: async (department: Omit<Department, 'id'>): Promise<ApiResponse<Department>> => {
    try {
      const { data, error } = await supabase
        .from('departments')
        .insert(department)
        .select()
        .single();

      if (error) return { data: null, error: error.message };
      return { data: data as Department, error: null };
    } catch (err) {
      return { data: null, error: 'Failed to create department' };
    }
  },

  update: async (id: string, department: Partial<Department>): Promise<ApiResponse<Department>> => {
    try {
      const { data, error } = await supabase
        .from('departments')
        .update({ ...department, updated_at: new Date().toISOString() })
        .eq('id', id)
        .select()
        .single();

      if (error) return { data: null, error: error.message };
      return { data: data as Department, error: null };
    } catch (err) {
      return { data: null, error: 'Failed to update department' };
    }
  },

  delete: async (id: string): Promise<ApiResponse<null>> => {
    try {
      const { error } = await supabase
        .from('departments')
        .delete()
        .eq('id', id);

      if (error) return { data: null, error: error.message };
      return { data: null, error: null };
    } catch (err) {
      return { data: null, error: 'Failed to delete department' };
    }
  }
};

// Employees API
export const employeesApi = {
  getAll: async (): Promise<ApiResponse<Employee[]>> => {
    try {
      const { data, error } = await supabase
        .from('employees')
        .select('*')
        .order('name');

      if (error) return { data: null, error: error.message };
      return { data: data as Employee[], error: null };
    } catch (err) {
      return { data: null, error: 'Failed to fetch employees' };
    }
  },

  create: async (employee: Omit<Employee, 'id'>): Promise<ApiResponse<Employee>> => {
    try {
      const { data, error } = await supabase
        .from('employees')
        .insert(employee)
        .select()
        .single();

      if (error) return { data: null, error: error.message };
      return { data: data as Employee, error: null };
    } catch (err) {
      return { data: null, error: 'Failed to create employee' };
    }
  },

  update: async (id: string, employee: Partial<Employee>): Promise<ApiResponse<Employee>> => {
    try {
      const { data, error } = await supabase
        .from('employees')
        .update({ ...employee, updated_at: new Date().toISOString() })
        .eq('id', id)
        .select()
        .single();

      if (error) return { data: null, error: error.message };
      return { data: data as Employee, error: null };
    } catch (err) {
      return { data: null, error: 'Failed to update employee' };
    }
  },

  delete: async (id: string): Promise<ApiResponse<null>> => {
    try {
      const { error } = await supabase
        .from('employees')
        .delete()
        .eq('id', id);

      if (error) return { data: null, error: error.message };
      return { data: null, error: null };
    } catch (err) {
      return { data: null, error: 'Failed to delete employee' };
    }
  }
};

// Interns API
export const internsApi = {
  getAll: async (): Promise<ApiResponse<Intern[]>> => {
    try {
      const { data, error } = await supabase
        .from('interns')
        .select('*')
        .order('name');

      if (error) return { data: null, error: error.message };
      return { data: data as Intern[], error: null };
    } catch (err) {
      return { data: null, error: 'Failed to fetch interns' };
    }
  },

  create: async (intern: Omit<Intern, 'id'>): Promise<ApiResponse<Intern>> => {
    try {
      const { data, error } = await supabase
        .from('interns')
        .insert(intern)
        .select()
        .single();

      if (error) return { data: null, error: error.message };
      return { data: data as Intern, error: null };
    } catch (err) {
      return { data: null, error: 'Failed to create intern' };
    }
  },

  update: async (id: string, intern: Partial<Intern>): Promise<ApiResponse<Intern>> => {
    try {
      const { data, error } = await supabase
        .from('interns')
        .update({ ...intern, updated_at: new Date().toISOString() })
        .eq('id', id)
        .select()
        .single();

      if (error) return { data: null, error: error.message };
      return { data: data as Intern, error: null };
    } catch (err) {
      return { data: null, error: 'Failed to update intern' };
    }
  },

  delete: async (id: string): Promise<ApiResponse<null>> => {
    try {
      const { error } = await supabase
        .from('interns')
        .delete()
        .eq('id', id);

      if (error) return { data: null, error: error.message };
      return { data: null, error: null };
    } catch (err) {
      return { data: null, error: 'Failed to delete intern' };
    }
  }
};

// Projects API
export const projectsApi = {
  getAll: async (): Promise<ApiResponse<Project[]>> => {
    try {
      const { data, error } = await supabase
        .from('projects')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) return { data: null, error: error.message };
      return { data: data as Project[], error: null };
    } catch (err) {
      return { data: null, error: 'Failed to fetch projects' };
    }
  },

  create: async (project: Omit<Project, 'id'>): Promise<ApiResponse<Project>> => {
    try {
      const { data, error } = await supabase
        .from('projects')
        .insert(project)
        .select()
        .single();

      if (error) return { data: null, error: error.message };
      return { data: data as Project, error: null };
    } catch (err) {
      return { data: null, error: 'Failed to create project' };
    }
  },

  update: async (id: string, project: Partial<Project>): Promise<ApiResponse<Project>> => {
    try {
      const { data, error } = await supabase
        .from('projects')
        .update({ ...project, updated_at: new Date().toISOString() })
        .eq('id', id)
        .select()
        .single();

      if (error) return { data: null, error: error.message };
      return { data: data as Project, error: null };
    } catch (err) {
      return { data: null, error: 'Failed to update project' };
    }
  },

  delete: async (id: string): Promise<ApiResponse<null>> => {
    try {
      const { error } = await supabase
        .from('projects')
        .delete()
        .eq('id', id);

      if (error) return { data: null, error: error.message };
      return { data: null, error: null };
    } catch (err) {
      return { data: null, error: 'Failed to delete project' };
    }
  }
};

// Tasks API
export const tasksApi = {
  getAll: async (): Promise<ApiResponse<Task[]>> => {
    try {
      const { data, error } = await supabase
        .from('tasks')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) return { data: null, error: error.message };
      return { data: data as Task[], error: null };
    } catch (err) {
      return { data: null, error: 'Failed to fetch tasks' };
    }
  },

  create: async (task: Omit<Task, 'id'>): Promise<ApiResponse<Task>> => {
    try {
      const { data, error } = await supabase
        .from('tasks')
        .insert(task)
        .select()
        .single();

      if (error) return { data: null, error: error.message };
      return { data: data as Task, error: null };
    } catch (err) {
      return { data: null, error: 'Failed to create task' };
    }
  },

  update: async (id: string, task: Partial<Task>): Promise<ApiResponse<Task>> => {
    try {
      const { data, error } = await supabase
        .from('tasks')
        .update({ ...task, updated_at: new Date().toISOString() })
        .eq('id', id)
        .select()
        .single();

      if (error) return { data: null, error: error.message };
      return { data: data as Task, error: null };
    } catch (err) {
      return { data: null, error: 'Failed to update task' };
    }
  },

  delete: async (id: string): Promise<ApiResponse<null>> => {
    try {
      const { error } = await supabase
        .from('tasks')
        .delete()
        .eq('id', id);

      if (error) return { data: null, error: error.message };
      return { data: null, error: null };
    } catch (err) {
      return { data: null, error: 'Failed to delete task' };
    }
  }
};

// Attendance API
export const attendanceApi = {
  getAll: async (): Promise<ApiResponse<Attendance[]>> => {
    try {
      const { data, error } = await supabase
        .from('attendance')
        .select('*')
        .order('date', { ascending: false });

      if (error) return { data: null, error: error.message };
      return { data: data as Attendance[], error: null };
    } catch (err) {
      return { data: null, error: 'Failed to fetch attendance' };
    }
  },

  getByDate: async (date: string): Promise<ApiResponse<Attendance[]>> => {
    try {
      const { data, error } = await supabase
        .from('attendance')
        .select('*')
        .eq('date', date)
        .order('user_name');

      if (error) return { data: null, error: error.message };
      return { data: data as Attendance[], error: null };
    } catch (err) {
      return { data: null, error: 'Failed to fetch attendance' };
    }
  },

  create: async (attendance: Omit<Attendance, 'id'>): Promise<ApiResponse<Attendance>> => {
    try {
      const { data, error } = await supabase
        .from('attendance')
        .insert(attendance)
        .select()
        .single();

      if (error) return { data: null, error: error.message };
      return { data: data as Attendance, error: null };
    } catch (err) {
      return { data: null, error: 'Failed to create attendance record' };
    }
  }
};

// Payroll API
export const payrollApi = {
  getAll: async (): Promise<ApiResponse<Payroll[]>> => {
    try {
      const { data, error } = await supabase
        .from('payrolls')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) return { data: null, error: error.message };
      return { data: data as Payroll[], error: null };
    } catch (err) {
      return { data: null, error: 'Failed to fetch payroll' };
    }
  },

  update: async (id: string, payroll: Partial<Payroll>): Promise<ApiResponse<Payroll>> => {
    try {
      const { data, error } = await supabase
        .from('payrolls')
        .update({ ...payroll, updated_at: new Date().toISOString() })
        .eq('id', id)
        .select()
        .single();

      if (error) return { data: null, error: error.message };
      return { data: data as Payroll, error: null };
    } catch (err) {
      return { data: null, error: 'Failed to update payroll' };
    }
  }
};

// Events API
export const eventsApi = {
  getAll: async (): Promise<ApiResponse<Event[]>> => {
    try {
      const { data, error } = await supabase
        .from('events')
        .select('*')
        .order('date', { ascending: true });

      if (error) return { data: null, error: error.message };
      return { data: data as Event[], error: null };
    } catch (err) {
      return { data: null, error: 'Failed to fetch events' };
    }
  },

  create: async (event: Omit<Event, 'id'>): Promise<ApiResponse<Event>> => {
    try {
      const { data, error } = await supabase
        .from('events')
        .insert(event)
        .select()
        .single();

      if (error) return { data: null, error: error.message };
      return { data: data as Event, error: null };
    } catch (err) {
      return { data: null, error: 'Failed to create event' };
    }
  },

  update: async (id: string, event: Partial<Event>): Promise<ApiResponse<Event>> => {
    try {
      const { data, error } = await supabase
        .from('events')
        .update({ ...event, updated_at: new Date().toISOString() })
        .eq('id', id)
        .select()
        .single();

      if (error) return { data: null, error: error.message };
      return { data: data as Event, error: null };
    } catch (err) {
      return { data: null, error: 'Failed to update event' };
    }
  },

  delete: async (id: string): Promise<ApiResponse<null>> => {
    try {
      const { error } = await supabase
        .from('events')
        .delete()
        .eq('id', id);

      if (error) return { data: null, error: error.message };
      return { data: null, error: null };
    } catch (err) {
      return { data: null, error: 'Failed to delete event' };
    }
  }
};

// Documents API
export const documentsApi = {
  getAll: async (): Promise<ApiResponse<Document[]>> => {
    try {
      const { data, error } = await supabase
        .from('documents')
        .select('*')
        .order('upload_date', { ascending: false });

      if (error) return { data: null, error: error.message };
      return { data: data as Document[], error: null };
    } catch (err) {
      return { data: null, error: 'Failed to fetch documents' };
    }
  },

  create: async (document: Omit<Document, 'id'>): Promise<ApiResponse<Document>> => {
    try {
      const { data, error } = await supabase
        .from('documents')
        .insert(document)
        .select()
        .single();

      if (error) return { data: null, error: error.message };
      return { data: data as Document, error: null };
    } catch (err) {
      return { data: null, error: 'Failed to create document' };
    }
  },

  delete: async (id: string): Promise<ApiResponse<null>> => {
    try {
      const { error } = await supabase
        .from('documents')
        .delete()
        .eq('id', id);

      if (error) return { data: null, error: error.message };
      return { data: null, error: null };
    } catch (err) {
      return { data: null, error: 'Failed to delete document' };
    }
  }
};

// Dashboard stats API
export const dashboardApi = {
  getStats: async (): Promise<ApiResponse<{
    totalEmployees: number;
    totalDepartments: number;
    activeProjects: number;
    totalInterns: number;
    pendingTasks: number;
    monthlyPayroll: number;
  }>> => {
    try {
      const [employees, departments, projects, interns, tasks, payrolls] = await Promise.all([
        supabase.from('employees').select('id', { count: 'exact' }),
        supabase.from('departments').select('id', { count: 'exact' }),
        supabase.from('projects').select('id').eq('status', 'in-progress'),
        supabase.from('interns').select('id').eq('status', 'active'),
        supabase.from('tasks').select('id').neq('status', 'completed'),
        supabase.from('payrolls').select('net_pay').ilike('month', '%December%')
      ]);

      const monthlyPayroll = payrolls.data?.reduce((sum, p) => sum + (p.net_pay || 0), 0) || 0;

      return {
        data: {
          totalEmployees: employees.count || 0,
          totalDepartments: departments.count || 0,
          activeProjects: projects.data?.length || 0,
          totalInterns: interns.data?.length || 0,
          pendingTasks: tasks.data?.length || 0,
          monthlyPayroll
        },
        error: null
      };
    } catch (err) {
      return { data: null, error: 'Failed to fetch dashboard stats' };
    }
  }
};
