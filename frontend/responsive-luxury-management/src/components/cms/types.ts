// Types for Company Management System

export type UserRole = 'admin' | 'hr' | 'employee' | 'intern' | 'accountant';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  department: string;
  status: 'active' | 'inactive';
  avatar?: string;
}

export interface Department {
  id: string;
  name: string;
  manager: string;
  description: string;
  employeeCount: number;
}

export interface Employee {
  id: string;
  userId: string;
  name: string;
  email: string;
  hireDate: string;
  position: string;
  department: string;
  salary: number;
  bankDetails: string;
  status: 'active' | 'inactive';
}

export interface Intern {
  id: string;
  name: string;
  email: string;
  department: string;
  mentor: string;
  startDate: string;
  endDate: string;
  status: 'active' | 'completed' | 'terminated';
}

export interface Project {
  id: string;
  name: string;
  department: string;
  budget: number;
  startDate: string;
  endDate: string;
  status: 'planning' | 'in-progress' | 'completed' | 'on-hold';
  description: string;
}

export interface Task {
  id: string;
  projectId: string;
  projectName: string;
  assignee: string;
  description: string;
  status: 'pending' | 'in-progress' | 'completed';
  startDate: string;
  endDate: string;
  priority: 'low' | 'medium' | 'high';
}

export interface Attendance {
  id: string;
  userId: string;
  userName: string;
  date: string;
  checkIn: string;
  checkOut: string;
  hoursWorked: number;
  status: 'present' | 'absent' | 'late' | 'half-day';
}

export interface Payroll {
  id: string;
  employeeId: string;
  employeeName: string;
  month: string;
  gross: number;
  deductions: number;
  netPay: number;
  status: 'pending' | 'processed' | 'paid';
}

export interface Event {
  id: string;
  title: string;
  description: string;
  date: string;
  time: string;
  targetAudience: string[];
  location: string;
}

export interface Document {
  id: string;
  title: string;
  link: string;
  uploadedBy: string;
  associatedEntity: string;
  uploadDate: string;
  type: 'pdf' | 'doc' | 'xls' | 'other';
}

export interface AuthState {
  isAuthenticated: boolean;
  user: User | null;
  role: UserRole | null;
}

export interface NavigationItem {
  id: string;
  label: string;
  icon: string;
  path: string;
  roles: UserRole[];
}
