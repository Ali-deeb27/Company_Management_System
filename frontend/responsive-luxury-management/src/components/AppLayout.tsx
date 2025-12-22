import React, { useState, useEffect } from 'react';
import { useAppContext } from '@/contexts/AppContext';
import { useIsMobile } from '@/hooks/use-mobile';
import { UserRole, User, AuthState } from './cms/types';
import { authApi, tokenManager } from '@/lib/api';
import { useToast } from '@/hooks/use-toast';

// Import all pages
import HomePage from './cms/HomePage';
import LoginPage from './cms/LoginPage';
import SignupPage from './cms/SignupPage';
import Sidebar from './cms/Sidebar';
import Header from './cms/Header';
import DashboardPage from './cms/DashboardPage';
import EmployeesPage from './cms/EmployeesPage';
import DepartmentsPage from './cms/DepartmentsPage';
import InternsPage from './cms/InternsPage';
import ProjectsPage from './cms/ProjectsPage';
import TasksPage from './cms/TasksPage';
import AttendancePage from './cms/AttendancePage';
import PayrollPage from './cms/PayrollPage';
import EventsPage from './cms/EventsPage';
import DocumentsPage from './cms/DocumentsPage';
import ReportsPage from './cms/ReportsPage';
import ProfilePage from './cms/ProfilePage';
import InternshipPage from './cms/InternshipPage';

type AppPage = 'home' | 'login' | 'signup' | 'dashboard' | 'employees' | 'departments' | 
               'interns' | 'projects' | 'tasks' | 'attendance' | 'payroll' | 
               'events' | 'documents' | 'reports' | 'profile' | 'internship';

const AppLayout: React.FC = () => {
  const { sidebarOpen, toggleSidebar } = useAppContext();
  const isMobile = useIsMobile();
  const { toast } = useToast();

  // Auth state
  const [auth, setAuth] = useState<AuthState>({
    isAuthenticated: false,
    user: null,
    role: null
  });

  // Navigation state
  const [currentPage, setCurrentPage] = useState<AppPage>('home');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Check for existing auth on mount
  useEffect(() => {
    const storedUser = tokenManager.getUser();
    if (storedUser && tokenManager.isAuthenticated()) {
      setAuth({
        isAuthenticated: true,
        user: {
          id: storedUser.id,
          name: storedUser.name,
          email: storedUser.email,
          role: storedUser.role as UserRole,
          department: storedUser.department,
          status: storedUser.status
        },
        role: storedUser.role as UserRole
      });
      setCurrentPage('dashboard');
    }
  }, []);

  // Auto-collapse sidebar on mobile
  useEffect(() => {
    if (isMobile) {
      setSidebarCollapsed(true);
    }
  }, [isMobile]);

  // Token refresh interval
  useEffect(() => {
    if (auth.isAuthenticated) {
      const refreshInterval = setInterval(async () => {
        const result = await authApi.refreshToken();
        if (result.error) {
          handleLogout();
          toast({
            title: 'Session Expired',
            description: 'Please log in again',
            variant: 'destructive'
          });
        }
      }, 30 * 60 * 1000); // Refresh every 30 minutes

      return () => clearInterval(refreshInterval);
    }
  }, [auth.isAuthenticated]);

  // Handle login
  const handleLogin = async (email: string, password: string, role: UserRole) => {
    setIsLoading(true);
    try {
      const result = await authApi.login(email, password, role);
      
      if (result.error) {
        toast({
          title: 'Login Failed',
          description: result.error,
          variant: 'destructive'
        });
        return;
      }

      if (result.data) {
        const user: User = {
          id: result.data.user.id,
          name: result.data.user.name,
          email: result.data.user.email,
          role: result.data.user.role as UserRole,
          department: result.data.user.department,
          status: result.data.user.status
        };

        setAuth({
          isAuthenticated: true,
          user: user,
          role: user.role
        });
        setCurrentPage('dashboard');
        
        toast({
          title: 'Welcome back!',
          description: `Logged in as ${user.name}`
        });
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Handle signup
  const handleSignup = async (name: string, email: string, password: string, role: UserRole, department: string) => {
    setIsLoading(true);
    try {
      const result = await authApi.signup(name, email, password, role, department);
      
      if (result.error) {
        toast({
          title: 'Signup Failed',
          description: result.error,
          variant: 'destructive'
        });
        return;
      }

      if (result.data) {
        const user: User = {
          id: result.data.user.id,
          name: result.data.user.name,
          email: result.data.user.email,
          role: result.data.user.role as UserRole,
          department: result.data.user.department,
          status: result.data.user.status
        };

        setAuth({
          isAuthenticated: true,
          user: user,
          role: user.role
        });
        setCurrentPage('dashboard');
        
        toast({
          title: 'Account Created!',
          description: `Welcome to CMS, ${user.name}`
        });
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Handle logout
  const handleLogout = () => {
    authApi.logout();
    setAuth({
      isAuthenticated: false,
      user: null,
      role: null
    });
    setCurrentPage('home');
    toast({
      title: 'Logged out',
      description: 'You have been successfully logged out'
    });
  };

  // Navigate to page
  const navigateTo = (page: AppPage) => {
    setCurrentPage(page);
    if (isMobile) {
      setSidebarCollapsed(true);
    }
  };

  // Render public pages (home, login, signup)
  if (!auth.isAuthenticated) {
    switch (currentPage) {
      case 'login':
        return (
          <LoginPage
            onLogin={handleLogin}
            onNavigateToSignup={() => setCurrentPage('signup')}
            onNavigateToHome={() => setCurrentPage('home')}
          />
        );
      case 'signup':
        return (
          <SignupPage
            onSignup={handleSignup}
            onNavigateToLogin={() => setCurrentPage('login')}
            onNavigateToHome={() => setCurrentPage('home')}
          />
        );
      default:
        return (
          <HomePage
            onNavigateToLogin={() => setCurrentPage('login')}
            onNavigateToSignup={() => setCurrentPage('signup')}
          />
        );
    }
  }

  // Render authenticated pages
  const renderPage = () => {
    if (!auth.user || !auth.role) return null;

    switch (currentPage) {
      case 'dashboard':
        return (
          <DashboardPage
            role={auth.role}
            userName={auth.user.name}
            onNavigate={(page) => navigateTo(page as AppPage)}
          />
        );
      case 'employees':
        return <EmployeesPage role={auth.role} />;
      case 'departments':
        return <DepartmentsPage role={auth.role} />;
      case 'interns':
        return <InternsPage role={auth.role} />;
      case 'projects':
        return <ProjectsPage role={auth.role} />;
      case 'tasks':
        return <TasksPage role={auth.role} />;
      case 'attendance':
        return <AttendancePage role={auth.role} />;
      case 'payroll':
        return <PayrollPage role={auth.role} />;
      case 'events':
        return <EventsPage role={auth.role} />;
      case 'documents':
        return <DocumentsPage role={auth.role} />;
      case 'reports':
        return <ReportsPage role={auth.role} />;
      case 'profile':
        return <ProfilePage role={auth.role} user={auth.user} />;
      case 'internship':
        return <InternshipPage role={auth.role} user={auth.user} />;
      default:
        return (
          <DashboardPage
            role={auth.role}
            userName={auth.user.name}
            onNavigate={(page) => navigateTo(page as AppPage)}
          />
        );
    }
  };

  return (
    <div className="min-h-screen bg-[#0A1929]">
      {/* Sidebar */}
      <Sidebar
        role={auth.role!}
        currentPage={currentPage}
        onNavigate={(page) => navigateTo(page as AppPage)}
        isCollapsed={sidebarCollapsed}
        onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
        onLogout={handleLogout}
        userName={auth.user?.name || ''}
      />

      {/* Mobile Sidebar Overlay */}
      {isMobile && !sidebarCollapsed && (
        <div
          className="fixed inset-0 bg-black/50 z-40"
          onClick={() => setSidebarCollapsed(true)}
        />
      )}

      {/* Main Content */}
      <div className={`transition-all duration-300 ${sidebarCollapsed ? 'ml-20' : 'ml-64'}`}>
        {/* Header */}
        <Header
          role={auth.role!}
          userName={auth.user?.name || ''}
          currentPage={currentPage}
          onMenuToggle={() => setSidebarCollapsed(!sidebarCollapsed)}
          isSidebarCollapsed={sidebarCollapsed}
          onLogout={handleLogout}
        />

        {/* Page Content */}
        <main className="pt-16 min-h-screen">
          <div className="p-4 md:p-6 lg:p-8">
            {renderPage()}
          </div>
        </main>
      </div>
    </div>
  );
};

export default AppLayout;
