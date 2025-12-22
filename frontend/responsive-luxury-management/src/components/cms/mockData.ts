import { User, Department, Employee, Intern, Project, Task, Attendance, Payroll, Event, Document } from './types';

export const mockUsers: User[] = [
  { id: '1', name: 'John Anderson', email: 'john@company.com', role: 'admin', department: 'Management', status: 'active' },
  { id: '2', name: 'Sarah Mitchell', email: 'sarah@company.com', role: 'hr', department: 'Human Resources', status: 'active' },
  { id: '3', name: 'Michael Chen', email: 'michael@company.com', role: 'employee', department: 'Engineering', status: 'active' },
  { id: '4', name: 'Emily Davis', email: 'emily@company.com', role: 'employee', department: 'Marketing', status: 'active' },
  { id: '5', name: 'James Wilson', email: 'james@company.com', role: 'accountant', department: 'Finance', status: 'active' },
  { id: '6', name: 'Lisa Thompson', email: 'lisa@company.com', role: 'intern', department: 'Engineering', status: 'active' },
  { id: '7', name: 'David Brown', email: 'david@company.com', role: 'employee', department: 'Sales', status: 'active' },
  { id: '8', name: 'Jennifer Garcia', email: 'jennifer@company.com', role: 'employee', department: 'Engineering', status: 'inactive' },
  { id: '9', name: 'Robert Martinez', email: 'robert@company.com', role: 'hr', department: 'Human Resources', status: 'active' },
  { id: '10', name: 'Amanda Lee', email: 'amanda@company.com', role: 'intern', department: 'Marketing', status: 'active' },
  { id: '11', name: 'Christopher Taylor', email: 'chris@company.com', role: 'employee', department: 'Finance', status: 'active' },
  { id: '12', name: 'Michelle White', email: 'michelle@company.com', role: 'employee', department: 'Operations', status: 'active' },
];

export const mockDepartments: Department[] = [
  { id: '1', name: 'Engineering', manager: 'Michael Chen', description: 'Software development and technical operations', employeeCount: 25 },
  { id: '2', name: 'Marketing', manager: 'Emily Davis', description: 'Brand management and marketing campaigns', employeeCount: 12 },
  { id: '3', name: 'Human Resources', manager: 'Sarah Mitchell', description: 'Employee relations and recruitment', employeeCount: 8 },
  { id: '4', name: 'Finance', manager: 'James Wilson', description: 'Financial planning and accounting', employeeCount: 10 },
  { id: '5', name: 'Sales', manager: 'David Brown', description: 'Sales operations and client relations', employeeCount: 18 },
  { id: '6', name: 'Operations', manager: 'Michelle White', description: 'Business operations and logistics', employeeCount: 15 },
  { id: '7', name: 'Management', manager: 'John Anderson', description: 'Executive leadership and strategy', employeeCount: 5 },
  { id: '8', name: 'Customer Support', manager: 'Rachel Green', description: 'Customer service and support', employeeCount: 20 },
];

export const mockEmployees: Employee[] = [
  { id: '1', userId: '3', name: 'Michael Chen', email: 'michael@company.com', hireDate: '2020-03-15', position: 'Senior Developer', department: 'Engineering', salary: 95000, bankDetails: '****4521', status: 'active' },
  { id: '2', userId: '4', name: 'Emily Davis', email: 'emily@company.com', hireDate: '2019-07-22', position: 'Marketing Manager', department: 'Marketing', salary: 85000, bankDetails: '****7832', status: 'active' },
  { id: '3', userId: '7', name: 'David Brown', email: 'david@company.com', hireDate: '2021-01-10', position: 'Sales Lead', department: 'Sales', salary: 78000, bankDetails: '****9123', status: 'active' },
  { id: '4', userId: '8', name: 'Jennifer Garcia', email: 'jennifer@company.com', hireDate: '2018-11-05', position: 'Software Engineer', department: 'Engineering', salary: 88000, bankDetails: '****3456', status: 'inactive' },
  { id: '5', userId: '11', name: 'Christopher Taylor', email: 'chris@company.com', hireDate: '2022-02-28', position: 'Financial Analyst', department: 'Finance', salary: 72000, bankDetails: '****6789', status: 'active' },
  { id: '6', userId: '12', name: 'Michelle White', email: 'michelle@company.com', hireDate: '2020-09-14', position: 'Operations Manager', department: 'Operations', salary: 82000, bankDetails: '****2345', status: 'active' },
  { id: '7', userId: '13', name: 'Andrew Johnson', email: 'andrew@company.com', hireDate: '2021-06-01', position: 'UX Designer', department: 'Engineering', salary: 75000, bankDetails: '****5678', status: 'active' },
  { id: '8', userId: '14', name: 'Jessica Williams', email: 'jessica@company.com', hireDate: '2019-04-18', position: 'Content Strategist', department: 'Marketing', salary: 68000, bankDetails: '****8901', status: 'active' },
  { id: '9', userId: '15', name: 'Daniel Moore', email: 'daniel@company.com', hireDate: '2022-08-22', position: 'DevOps Engineer', department: 'Engineering', salary: 92000, bankDetails: '****1234', status: 'active' },
  { id: '10', userId: '16', name: 'Sophia Anderson', email: 'sophia@company.com', hireDate: '2021-11-30', position: 'HR Specialist', department: 'Human Resources', salary: 62000, bankDetails: '****4567', status: 'active' },
  { id: '11', userId: '17', name: 'William Jackson', email: 'william@company.com', hireDate: '2020-05-12', position: 'Account Executive', department: 'Sales', salary: 70000, bankDetails: '****7890', status: 'active' },
  { id: '12', userId: '18', name: 'Olivia Thomas', email: 'olivia@company.com', hireDate: '2023-01-09', position: 'Junior Developer', department: 'Engineering', salary: 58000, bankDetails: '****0123', status: 'active' },
];

export const mockInterns: Intern[] = [
  { id: '1', name: 'Lisa Thompson', email: 'lisa@company.com', department: 'Engineering', mentor: 'Michael Chen', startDate: '2024-06-01', endDate: '2024-12-01', status: 'active' },
  { id: '2', name: 'Amanda Lee', email: 'amanda@company.com', department: 'Marketing', mentor: 'Emily Davis', startDate: '2024-05-15', endDate: '2024-11-15', status: 'active' },
  { id: '3', name: 'Kevin Park', email: 'kevin@company.com', department: 'Finance', mentor: 'James Wilson', startDate: '2024-07-01', endDate: '2025-01-01', status: 'active' },
  { id: '4', name: 'Rachel Kim', email: 'rachel@company.com', department: 'Engineering', mentor: 'Jennifer Garcia', startDate: '2024-03-01', endDate: '2024-09-01', status: 'completed' },
  { id: '5', name: 'Tyler Scott', email: 'tyler@company.com', department: 'Sales', mentor: 'David Brown', startDate: '2024-08-01', endDate: '2025-02-01', status: 'active' },
  { id: '6', name: 'Emma Rodriguez', email: 'emma@company.com', department: 'Human Resources', mentor: 'Sarah Mitchell', startDate: '2024-04-15', endDate: '2024-10-15', status: 'active' },
];

export const mockProjects: Project[] = [
  { id: '1', name: 'Website Redesign', department: 'Engineering', budget: 150000, startDate: '2024-01-15', endDate: '2024-06-30', status: 'in-progress', description: 'Complete overhaul of company website' },
  { id: '2', name: 'Q4 Marketing Campaign', department: 'Marketing', budget: 80000, startDate: '2024-09-01', endDate: '2024-12-31', status: 'planning', description: 'Holiday season marketing initiative' },
  { id: '3', name: 'ERP Implementation', department: 'Operations', budget: 250000, startDate: '2024-02-01', endDate: '2024-12-31', status: 'in-progress', description: 'Enterprise resource planning system rollout' },
  { id: '4', name: 'Mobile App Development', department: 'Engineering', budget: 200000, startDate: '2024-03-01', endDate: '2024-09-30', status: 'in-progress', description: 'Native mobile application for customers' },
  { id: '5', name: 'Sales Training Program', department: 'Sales', budget: 45000, startDate: '2024-04-01', endDate: '2024-05-31', status: 'completed', description: 'Comprehensive sales team training' },
  { id: '6', name: 'Financial Audit 2024', department: 'Finance', budget: 35000, startDate: '2024-01-01', endDate: '2024-03-31', status: 'completed', description: 'Annual financial audit and compliance' },
  { id: '7', name: 'Customer Portal', department: 'Engineering', budget: 120000, startDate: '2024-06-01', endDate: '2024-11-30', status: 'in-progress', description: 'Self-service customer portal development' },
  { id: '8', name: 'Brand Refresh', department: 'Marketing', budget: 60000, startDate: '2024-07-01', endDate: '2024-10-31', status: 'planning', description: 'Company branding and identity update' },
];

export const mockTasks: Task[] = [
  { id: '1', projectId: '1', projectName: 'Website Redesign', assignee: 'Michael Chen', description: 'Design new homepage layout', status: 'completed', startDate: '2024-01-15', endDate: '2024-02-15', priority: 'high' },
  { id: '2', projectId: '1', projectName: 'Website Redesign', assignee: 'Andrew Johnson', description: 'Create responsive navigation', status: 'in-progress', startDate: '2024-02-01', endDate: '2024-03-01', priority: 'high' },
  { id: '3', projectId: '4', projectName: 'Mobile App Development', assignee: 'Daniel Moore', description: 'Set up CI/CD pipeline', status: 'completed', startDate: '2024-03-01', endDate: '2024-03-15', priority: 'medium' },
  { id: '4', projectId: '4', projectName: 'Mobile App Development', assignee: 'Olivia Thomas', description: 'Implement user authentication', status: 'in-progress', startDate: '2024-03-15', endDate: '2024-04-15', priority: 'high' },
  { id: '5', projectId: '2', projectName: 'Q4 Marketing Campaign', assignee: 'Emily Davis', description: 'Develop campaign strategy', status: 'pending', startDate: '2024-09-01', endDate: '2024-09-30', priority: 'high' },
  { id: '6', projectId: '3', projectName: 'ERP Implementation', assignee: 'Michelle White', description: 'Data migration planning', status: 'in-progress', startDate: '2024-02-15', endDate: '2024-04-15', priority: 'high' },
  { id: '7', projectId: '7', projectName: 'Customer Portal', assignee: 'Michael Chen', description: 'API development', status: 'in-progress', startDate: '2024-06-15', endDate: '2024-08-15', priority: 'medium' },
  { id: '8', projectId: '8', projectName: 'Brand Refresh', assignee: 'Jessica Williams', description: 'Brand guidelines document', status: 'pending', startDate: '2024-07-15', endDate: '2024-08-31', priority: 'medium' },
  { id: '9', projectId: '1', projectName: 'Website Redesign', assignee: 'Lisa Thompson', description: 'Unit testing', status: 'pending', startDate: '2024-04-01', endDate: '2024-05-01', priority: 'low' },
  { id: '10', projectId: '4', projectName: 'Mobile App Development', assignee: 'Michael Chen', description: 'Code review and optimization', status: 'pending', startDate: '2024-08-01', endDate: '2024-09-01', priority: 'medium' },
];

export const mockAttendance: Attendance[] = [
  { id: '1', userId: '3', userName: 'Michael Chen', date: '2024-12-19', checkIn: '09:00', checkOut: '18:00', hoursWorked: 9, status: 'present' },
  { id: '2', userId: '4', userName: 'Emily Davis', date: '2024-12-19', checkIn: '08:45', checkOut: '17:30', hoursWorked: 8.75, status: 'present' },
  { id: '3', userId: '7', userName: 'David Brown', date: '2024-12-19', checkIn: '09:30', checkOut: '18:30', hoursWorked: 9, status: 'late' },
  { id: '4', userId: '11', userName: 'Christopher Taylor', date: '2024-12-19', checkIn: '09:00', checkOut: '13:00', hoursWorked: 4, status: 'half-day' },
  { id: '5', userId: '12', userName: 'Michelle White', date: '2024-12-19', checkIn: '08:30', checkOut: '17:30', hoursWorked: 9, status: 'present' },
  { id: '6', userId: '3', userName: 'Michael Chen', date: '2024-12-18', checkIn: '09:15', checkOut: '18:15', hoursWorked: 9, status: 'late' },
  { id: '7', userId: '4', userName: 'Emily Davis', date: '2024-12-18', checkIn: '09:00', checkOut: '18:00', hoursWorked: 9, status: 'present' },
  { id: '8', userId: '7', userName: 'David Brown', date: '2024-12-18', checkIn: '', checkOut: '', hoursWorked: 0, status: 'absent' },
  { id: '9', userId: '11', userName: 'Christopher Taylor', date: '2024-12-18', checkIn: '09:00', checkOut: '18:00', hoursWorked: 9, status: 'present' },
  { id: '10', userId: '12', userName: 'Michelle White', date: '2024-12-18', checkIn: '08:45', checkOut: '17:45', hoursWorked: 9, status: 'present' },
  { id: '11', userId: '6', userName: 'Lisa Thompson', date: '2024-12-19', checkIn: '09:00', checkOut: '17:00', hoursWorked: 8, status: 'present' },
  { id: '12', userId: '10', userName: 'Amanda Lee', date: '2024-12-19', checkIn: '09:00', checkOut: '17:00', hoursWorked: 8, status: 'present' },
];

export const mockPayrolls: Payroll[] = [
  { id: '1', employeeId: '1', employeeName: 'Michael Chen', month: 'December 2024', gross: 7916.67, deductions: 1979.17, netPay: 5937.50, status: 'pending' },
  { id: '2', employeeId: '2', employeeName: 'Emily Davis', month: 'December 2024', gross: 7083.33, deductions: 1770.83, netPay: 5312.50, status: 'pending' },
  { id: '3', employeeId: '3', employeeName: 'David Brown', month: 'December 2024', gross: 6500.00, deductions: 1625.00, netPay: 4875.00, status: 'processed' },
  { id: '4', employeeId: '5', employeeName: 'Christopher Taylor', month: 'December 2024', gross: 6000.00, deductions: 1500.00, netPay: 4500.00, status: 'paid' },
  { id: '5', employeeId: '6', employeeName: 'Michelle White', month: 'December 2024', gross: 6833.33, deductions: 1708.33, netPay: 5125.00, status: 'pending' },
  { id: '6', employeeId: '1', employeeName: 'Michael Chen', month: 'November 2024', gross: 7916.67, deductions: 1979.17, netPay: 5937.50, status: 'paid' },
  { id: '7', employeeId: '2', employeeName: 'Emily Davis', month: 'November 2024', gross: 7083.33, deductions: 1770.83, netPay: 5312.50, status: 'paid' },
  { id: '8', employeeId: '3', employeeName: 'David Brown', month: 'November 2024', gross: 6500.00, deductions: 1625.00, netPay: 4875.00, status: 'paid' },
  { id: '9', employeeId: '7', employeeName: 'Andrew Johnson', month: 'December 2024', gross: 6250.00, deductions: 1562.50, netPay: 4687.50, status: 'pending' },
  { id: '10', employeeId: '8', employeeName: 'Jessica Williams', month: 'December 2024', gross: 5666.67, deductions: 1416.67, netPay: 4250.00, status: 'processed' },
  { id: '11', employeeId: '9', employeeName: 'Daniel Moore', month: 'December 2024', gross: 7666.67, deductions: 1916.67, netPay: 5750.00, status: 'pending' },
  { id: '12', employeeId: '12', employeeName: 'Olivia Thomas', month: 'December 2024', gross: 4833.33, deductions: 1208.33, netPay: 3625.00, status: 'pending' },
];

export const mockEvents: Event[] = [
  { id: '1', title: 'Annual Company Meeting', description: 'Year-end review and 2025 planning session', date: '2024-12-28', time: '10:00 AM', targetAudience: ['all'], location: 'Main Conference Hall' },
  { id: '2', title: 'Holiday Party', description: 'End of year celebration with team activities', date: '2024-12-23', time: '6:00 PM', targetAudience: ['all'], location: 'Rooftop Lounge' },
  { id: '3', title: 'Engineering Sprint Review', description: 'Q4 sprint retrospective and demo', date: '2024-12-20', time: '2:00 PM', targetAudience: ['Engineering'], location: 'Tech Hub Room A' },
  { id: '4', title: 'Sales Kickoff 2025', description: 'New year sales strategy and targets', date: '2025-01-06', time: '9:00 AM', targetAudience: ['Sales'], location: 'Sales Floor' },
  { id: '5', title: 'HR Policy Update Session', description: 'Review of updated company policies', date: '2025-01-10', time: '11:00 AM', targetAudience: ['all'], location: 'Training Room' },
  { id: '6', title: 'Intern Orientation', description: 'Welcome session for new interns', date: '2025-01-15', time: '9:00 AM', targetAudience: ['Interns', 'HR'], location: 'Welcome Center' },
  { id: '7', title: 'Finance Quarterly Review', description: 'Q4 financial performance review', date: '2025-01-08', time: '3:00 PM', targetAudience: ['Finance', 'Management'], location: 'Finance Conference Room' },
  { id: '8', title: 'Marketing Strategy Workshop', description: '2025 marketing plan development', date: '2025-01-12', time: '10:00 AM', targetAudience: ['Marketing'], location: 'Creative Studio' },
];

export const mockDocuments: Document[] = [
  { id: '1', title: 'Employee Handbook 2024', link: '/docs/handbook.pdf', uploadedBy: 'Sarah Mitchell', associatedEntity: 'HR', uploadDate: '2024-01-15', type: 'pdf' },
  { id: '2', title: 'Q3 Financial Report', link: '/docs/q3-report.pdf', uploadedBy: 'James Wilson', associatedEntity: 'Finance', uploadDate: '2024-10-05', type: 'pdf' },
  { id: '3', title: 'Project Guidelines', link: '/docs/project-guide.pdf', uploadedBy: 'John Anderson', associatedEntity: 'Management', uploadDate: '2024-02-20', type: 'pdf' },
  { id: '4', title: 'Brand Guidelines', link: '/docs/brand-guide.pdf', uploadedBy: 'Emily Davis', associatedEntity: 'Marketing', uploadDate: '2024-03-10', type: 'pdf' },
  { id: '5', title: 'IT Security Policy', link: '/docs/security.pdf', uploadedBy: 'Michael Chen', associatedEntity: 'Engineering', uploadDate: '2024-04-01', type: 'pdf' },
  { id: '6', title: 'Expense Report Template', link: '/docs/expense-template.xls', uploadedBy: 'James Wilson', associatedEntity: 'Finance', uploadDate: '2024-01-10', type: 'xls' },
  { id: '7', title: 'Onboarding Checklist', link: '/docs/onboarding.doc', uploadedBy: 'Sarah Mitchell', associatedEntity: 'HR', uploadDate: '2024-02-01', type: 'doc' },
  { id: '8', title: 'Sales Playbook', link: '/docs/sales-playbook.pdf', uploadedBy: 'David Brown', associatedEntity: 'Sales', uploadDate: '2024-05-15', type: 'pdf' },
  { id: '9', title: 'Intern Program Guide', link: '/docs/intern-guide.pdf', uploadedBy: 'Sarah Mitchell', associatedEntity: 'HR', uploadDate: '2024-06-01', type: 'pdf' },
  { id: '10', title: 'Benefits Summary 2024', link: '/docs/benefits.pdf', uploadedBy: 'Sarah Mitchell', associatedEntity: 'HR', uploadDate: '2024-01-01', type: 'pdf' },
];
