import React, { useState } from 'react';
import { UserRole } from './types';
import { Mail, Lock, Eye, EyeOff, Building2, ChevronDown, ArrowRight, User } from 'lucide-react';

interface SignupPageProps {
  onSignup: (name: string, email: string, password: string, role: UserRole, department: string) => void;
  onNavigateToLogin: () => void;
  onNavigateToHome: () => void;
}

const SignupPage: React.FC<SignupPageProps> = ({ onSignup, onNavigateToLogin, onNavigateToHome }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [role, setRole] = useState<UserRole>('employee');
  const [department, setDepartment] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [showRoleDropdown, setShowRoleDropdown] = useState(false);
  const [showDeptDropdown, setShowDeptDropdown] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);

  const roles: { value: UserRole; label: string }[] = [
    { value: 'admin', label: 'Administrator' },
    { value: 'hr', label: 'HR Manager' },
    { value: 'employee', label: 'Employee' },
    { value: 'intern', label: 'Intern' },
    { value: 'accountant', label: 'Accountant' },
  ];

  const departments = [
    'Engineering',
    'Marketing',
    'Human Resources',
    'Finance',
    'Sales',
    'Operations',
    'Management',
    'Customer Support'
  ];

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};
    
    if (!name.trim()) {
      newErrors.name = 'Name is required';
    }
    
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
    
    if (password !== confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }
    
    if (!department) {
      newErrors.department = 'Please select a department';
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
    
    onSignup(name, email, password, role, department);
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
            Join Our<br />
            <span className="text-[#D4AF37]">Growing Team.</span>
          </h2>
          <p className="text-gray-400 text-lg max-w-md mb-8">
            Create your account and start managing your work efficiently. 
            Experience the power of modern enterprise management.
          </p>
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-[#D4AF37]/20 flex items-center justify-center">
                <svg className="w-5 h-5 text-[#D4AF37]" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              </div>
              <p className="text-gray-300">Secure & encrypted data</p>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-[#D4AF37]/20 flex items-center justify-center">
                <svg className="w-5 h-5 text-[#D4AF37]" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              </div>
              <p className="text-gray-300">Role-based access control</p>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-[#D4AF37]/20 flex items-center justify-center">
                <svg className="w-5 h-5 text-[#D4AF37]" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              </div>
              <p className="text-gray-300">24/7 support available</p>
            </div>
          </div>
        </div>
      </div>

      {/* Right Side - Signup Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-12 overflow-y-auto">
        <div className="w-full max-w-md">
          {/* Mobile Logo */}
          <div className="lg:hidden flex items-center justify-center gap-3 mb-6">
            <div className="w-12 h-12 bg-gradient-to-br from-[#D4AF37] to-[#B8962E] rounded-xl flex items-center justify-center">
              <Building2 size={28} className="text-[#0A1929]" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-[#D4AF37]">CMS</h1>
              <p className="text-gray-400 text-xs">Company Management System</p>
            </div>
          </div>

          <div className="text-center mb-6">
            <h2 className="text-2xl font-bold text-white mb-2">Create Account</h2>
            <p className="text-gray-400">Fill in your details to get started</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Name */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Full Name
              </label>
              <div className="relative">
                <User size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Enter your full name"
                  className={`w-full pl-11 pr-4 py-3 bg-[#1E3A5F] border rounded-xl text-white placeholder-gray-400 focus:outline-none transition-colors ${
                    errors.name ? 'border-red-500' : 'border-[#2D4A6F] focus:border-[#D4AF37]'
                  }`}
                />
              </div>
              {errors.name && <p className="mt-1 text-sm text-red-400">{errors.name}</p>}
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
              {errors.email && <p className="mt-1 text-sm text-red-400">{errors.email}</p>}
            </div>

            {/* Role & Department Row */}
            <div className="grid grid-cols-2 gap-4">
              {/* Role Selection */}
              <div className="relative">
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Role
                </label>
                <button
                  type="button"
                  onClick={() => {
                    setShowRoleDropdown(!showRoleDropdown);
                    setShowDeptDropdown(false);
                  }}
                  className="w-full flex items-center justify-between px-4 py-3 bg-[#1E3A5F] border border-[#2D4A6F] rounded-xl text-white focus:outline-none focus:border-[#D4AF37] transition-colors"
                >
                  <span className="text-sm truncate">{selectedRole?.label}</span>
                  <ChevronDown size={16} className={`text-gray-400 transition-transform flex-shrink-0 ${showRoleDropdown ? 'rotate-180' : ''}`} />
                </button>
                
                {showRoleDropdown && (
                  <div className="absolute z-20 w-full mt-2 bg-[#0F2744] border border-[#1E3A5F] rounded-xl shadow-xl overflow-hidden">
                    {roles.map(r => (
                      <button
                        key={r.value}
                        type="button"
                        onClick={() => {
                          setRole(r.value);
                          setShowRoleDropdown(false);
                        }}
                        className={`w-full px-4 py-2.5 text-left text-sm hover:bg-[#1E3A5F] transition-colors ${
                          role === r.value ? 'bg-[#1E3A5F] text-[#D4AF37]' : 'text-white'
                        }`}
                      >
                        {r.label}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Department Selection */}
              <div className="relative">
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Department
                </label>
                <button
                  type="button"
                  onClick={() => {
                    setShowDeptDropdown(!showDeptDropdown);
                    setShowRoleDropdown(false);
                  }}
                  className={`w-full flex items-center justify-between px-4 py-3 bg-[#1E3A5F] border rounded-xl text-white focus:outline-none transition-colors ${
                    errors.department ? 'border-red-500' : 'border-[#2D4A6F] focus:border-[#D4AF37]'
                  }`}
                >
                  <span className={`text-sm truncate ${department ? 'text-white' : 'text-gray-400'}`}>
                    {department || 'Select...'}
                  </span>
                  <ChevronDown size={16} className={`text-gray-400 transition-transform flex-shrink-0 ${showDeptDropdown ? 'rotate-180' : ''}`} />
                </button>
                
                {showDeptDropdown && (
                  <div className="absolute z-20 w-full mt-2 bg-[#0F2744] border border-[#1E3A5F] rounded-xl shadow-xl overflow-hidden max-h-48 overflow-y-auto">
                    {departments.map(dept => (
                      <button
                        key={dept}
                        type="button"
                        onClick={() => {
                          setDepartment(dept);
                          setShowDeptDropdown(false);
                        }}
                        className={`w-full px-4 py-2.5 text-left text-sm hover:bg-[#1E3A5F] transition-colors ${
                          department === dept ? 'bg-[#1E3A5F] text-[#D4AF37]' : 'text-white'
                        }`}
                      >
                        {dept}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
            {errors.department && <p className="-mt-2 text-sm text-red-400">{errors.department}</p>}

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
                  placeholder="Create a password"
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
              {errors.password && <p className="mt-1 text-sm text-red-400">{errors.password}</p>}
            </div>

            {/* Confirm Password */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Confirm Password
              </label>
              <div className="relative">
                <Lock size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Confirm your password"
                  className={`w-full pl-11 pr-12 py-3 bg-[#1E3A5F] border rounded-xl text-white placeholder-gray-400 focus:outline-none transition-colors ${
                    errors.confirmPassword ? 'border-red-500' : 'border-[#2D4A6F] focus:border-[#D4AF37]'
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
                >
                  {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              {errors.confirmPassword && <p className="mt-1 text-sm text-red-400">{errors.confirmPassword}</p>}
            </div>

            {/* Terms */}
            <label className="flex items-start gap-3 cursor-pointer">
              <input
                type="checkbox"
                className="w-4 h-4 mt-0.5 rounded border-[#2D4A6F] bg-[#1E3A5F] text-[#D4AF37] focus:ring-[#D4AF37] focus:ring-offset-0"
              />
              <span className="text-sm text-gray-400">
                I agree to the{' '}
                <button type="button" className="text-[#D4AF37] hover:underline">Terms of Service</button>
                {' '}and{' '}
                <button type="button" className="text-[#D4AF37] hover:underline">Privacy Policy</button>
              </span>
            </label>

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
                  Create Account
                  <ArrowRight size={18} />
                </>
              )}
            </button>
          </form>

          {/* Sign In Link */}
          <p className="text-center text-gray-400 mt-6">
            Already have an account?{' '}
            <button
              onClick={onNavigateToLogin}
              className="text-[#D4AF37] font-medium hover:underline"
            >
              Sign In
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

      {/* Close dropdowns on outside click */}
      {(showRoleDropdown || showDeptDropdown) && (
        <div
          className="fixed inset-0 z-10"
          onClick={() => {
            setShowRoleDropdown(false);
            setShowDeptDropdown(false);
          }}
        />
      )}
    </div>
  );
};

export default SignupPage;
