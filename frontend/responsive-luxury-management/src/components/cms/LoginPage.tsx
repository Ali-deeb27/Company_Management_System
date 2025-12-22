import React, { useState } from 'react';
import { UserRole } from './types';
import { Mail, Lock, Eye, EyeOff, Building2, ChevronDown, ArrowRight } from 'lucide-react';

interface LoginPageProps {
  onLogin: (email: string, password: string, role: UserRole) => void;
  onNavigateToSignup: () => void;
  onNavigateToHome: () => void;
}

const LoginPage: React.FC<LoginPageProps> = ({ onLogin, onNavigateToSignup, onNavigateToHome }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<UserRole>('employee');
  const [showPassword, setShowPassword] = useState(false);
  const [showRoleDropdown, setShowRoleDropdown] = useState(false);
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});
  const [isLoading, setIsLoading] = useState(false);

  const roles: { value: UserRole; label: string; description: string }[] = [
    { value: 'admin', label: 'Administrator', description: 'Full system access' },
    { value: 'hr', label: 'HR Manager', description: 'People management' },
    { value: 'employee', label: 'Employee', description: 'Standard access' },
    { value: 'intern', label: 'Intern', description: 'Limited access' },
    { value: 'accountant', label: 'Accountant', description: 'Financial access' },
  ];

  const validateForm = (): boolean => {
    const newErrors: { email?: string; password?: string } = {};
    
    if (!email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = 'Please enter a valid email';
    }
    
    if (!password) {
      newErrors.password = 'Password is required';
    } else if (password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setIsLoading(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    onLogin(email, password, role);
    setIsLoading(false);
  };

  const selectedRole = roles.find(r => r.value === role);

  return (
    <div className="min-h-screen bg-[#0A1929] flex">
      {/* Left Side - Hero */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-[#0A1929] via-[#1E3A5F] to-[#0A1929]" />
        <div className="absolute inset-0 bg-[url('https://d64gsuwffb70l.cloudfront.net/694652c721b6f2132898534e_1766216475465_78938f2e.jpg')] bg-cover bg-center opacity-20" />
        <div className="relative z-10 flex flex-col justify-center px-12 xl:px-20">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-14 h-14 bg-gradient-to-br from-[#D4AF37] to-[#B8962E] rounded-xl flex items-center justify-center">
              <Building2 size={32} className="text-[#0A1929]" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-[#D4AF37]">CMS</h1>
              <p className="text-gray-400 text-sm">Company Management System</p>
            </div>
          </div>
          <h2 className="text-4xl xl:text-5xl font-bold text-white mb-6 leading-tight">
            Enterprise Management,<br />
            <span className="text-[#D4AF37]">Elevated.</span>
          </h2>
          <p className="text-gray-400 text-lg max-w-md mb-8">
            Streamline your operations with our comprehensive management platform. 
            Built for modern enterprises that demand excellence.
          </p>
          <div className="flex items-center gap-8">
            <div>
              <p className="text-3xl font-bold text-white">500+</p>
              <p className="text-gray-400 text-sm">Companies Trust Us</p>
            </div>
            <div className="w-px h-12 bg-[#1E3A5F]" />
            <div>
              <p className="text-3xl font-bold text-white">50k+</p>
              <p className="text-gray-400 text-sm">Active Users</p>
            </div>
            <div className="w-px h-12 bg-[#1E3A5F]" />
            <div>
              <p className="text-3xl font-bold text-white">99.9%</p>
              <p className="text-gray-400 text-sm">Uptime</p>
            </div>
          </div>
        </div>
      </div>

      {/* Right Side - Login Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-12">
        <div className="w-full max-w-md">
          {/* Mobile Logo */}
          <div className="lg:hidden flex items-center justify-center gap-3 mb-8">
            <div className="w-12 h-12 bg-gradient-to-br from-[#D4AF37] to-[#B8962E] rounded-xl flex items-center justify-center">
              <Building2 size={28} className="text-[#0A1929]" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-[#D4AF37]">CMS</h1>
              <p className="text-gray-400 text-xs">Company Management System</p>
            </div>
          </div>

          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-white mb-2">Welcome Back</h2>
            <p className="text-gray-400">Sign in to access your dashboard</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Role Selection */}
            <div className="relative">
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Select Your Role
              </label>
              <button
                type="button"
                onClick={() => setShowRoleDropdown(!showRoleDropdown)}
                className="w-full flex items-center justify-between px-4 py-3 bg-[#1E3A5F] border border-[#2D4A6F] rounded-xl text-white focus:outline-none focus:border-[#D4AF37] transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-[#D4AF37]/20 flex items-center justify-center">
                    <span className="text-[#D4AF37] text-sm font-bold">
                      {selectedRole?.label.charAt(0)}
                    </span>
                  </div>
                  <div className="text-left">
                    <p className="text-sm font-medium">{selectedRole?.label}</p>
                    <p className="text-xs text-gray-400">{selectedRole?.description}</p>
                  </div>
                </div>
                <ChevronDown size={20} className={`text-gray-400 transition-transform ${showRoleDropdown ? 'rotate-180' : ''}`} />
              </button>
              
              {showRoleDropdown && (
                <div className="absolute z-10 w-full mt-2 bg-[#0F2744] border border-[#1E3A5F] rounded-xl shadow-xl overflow-hidden">
                  {roles.map(r => (
                    <button
                      key={r.value}
                      type="button"
                      onClick={() => {
                        setRole(r.value);
                        setShowRoleDropdown(false);
                      }}
                      className={`w-full flex items-center gap-3 px-4 py-3 hover:bg-[#1E3A5F] transition-colors ${
                        role === r.value ? 'bg-[#1E3A5F]' : ''
                      }`}
                    >
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                        role === r.value ? 'bg-[#D4AF37]' : 'bg-[#D4AF37]/20'
                      }`}>
                        <span className={`text-sm font-bold ${
                          role === r.value ? 'text-[#0A1929]' : 'text-[#D4AF37]'
                        }`}>
                          {r.label.charAt(0)}
                        </span>
                      </div>
                      <div className="text-left">
                        <p className="text-sm font-medium text-white">{r.label}</p>
                        <p className="text-xs text-gray-400">{r.description}</p>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Email Address
              </label>
              <div className="relative">
                <Mail size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  className={`w-full pl-11 pr-4 py-3 bg-[#1E3A5F] border rounded-xl text-white placeholder-gray-400 focus:outline-none transition-colors ${
                    errors.email ? 'border-red-500' : 'border-[#2D4A6F] focus:border-[#D4AF37]'
                  }`}
                />
              </div>
              {errors.email && (
                <p className="mt-1 text-sm text-red-400">{errors.email}</p>
              )}
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Password
              </label>
              <div className="relative">
                <Lock size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  className={`w-full pl-11 pr-12 py-3 bg-[#1E3A5F] border rounded-xl text-white placeholder-gray-400 focus:outline-none transition-colors ${
                    errors.password ? 'border-red-500' : 'border-[#2D4A6F] focus:border-[#D4AF37]'
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              {errors.password && (
                <p className="mt-1 text-sm text-red-400">{errors.password}</p>
              )}
            </div>

            {/* Remember & Forgot */}
            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  className="w-4 h-4 rounded border-[#2D4A6F] bg-[#1E3A5F] text-[#D4AF37] focus:ring-[#D4AF37] focus:ring-offset-0"
                />
                <span className="text-sm text-gray-400">Remember me</span>
              </label>
              <button type="button" className="text-sm text-[#D4AF37] hover:underline">
                Forgot password?
              </button>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3.5 bg-gradient-to-r from-[#D4AF37] to-[#B8962E] text-[#0A1929] font-semibold rounded-xl hover:from-[#E5C04A] hover:to-[#D4AF37] transition-all duration-300 flex items-center justify-center gap-2 disabled:opacity-70"
            >
              {isLoading ? (
                <div className="w-5 h-5 border-2 border-[#0A1929] border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  Sign In
                  <ArrowRight size={18} />
                </>
              )}
            </button>
          </form>

          {/* Divider */}
          <div className="flex items-center gap-4 my-6">
            <div className="flex-1 h-px bg-[#1E3A5F]" />
            <span className="text-sm text-gray-400">or</span>
            <div className="flex-1 h-px bg-[#1E3A5F]" />
          </div>

          {/* Sign Up Link */}
          <p className="text-center text-gray-400">
            Don't have an account?{' '}
            <button
              onClick={onNavigateToSignup}
              className="text-[#D4AF37] font-medium hover:underline"
            >
              Sign Up
            </button>
          </p>

          {/* Back to Home */}
          <button
            onClick={onNavigateToHome}
            className="w-full mt-4 py-2.5 border border-[#1E3A5F] text-gray-400 rounded-xl hover:bg-[#1E3A5F] hover:text-white transition-colors"
          >
            Back to Home
          </button>
        </div>
      </div>

      {/* Close dropdown on outside click */}
      {showRoleDropdown && (
        <div
          className="fixed inset-0 z-0"
          onClick={() => setShowRoleDropdown(false)}
        />
      )}
    </div>
  );
};

export default LoginPage;
