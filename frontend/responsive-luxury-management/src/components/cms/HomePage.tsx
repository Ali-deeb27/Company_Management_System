import React from 'react';
import {
  Building2,
  Users,
  BarChart3,
  Shield,
  Clock,
  FileText,
  ArrowRight,
  CheckCircle,
  Star,
  ChevronRight,
  Mail,
  Phone,
  MapPin,
  Linkedin,
  Twitter,
  Facebook
} from 'lucide-react';

interface HomePageProps {
  onNavigateToLogin: () => void;
  onNavigateToSignup: () => void;
}

const HomePage: React.FC<HomePageProps> = ({ onNavigateToLogin, onNavigateToSignup }) => {
  const features = [
    {
      icon: <Users size={28} />,
      title: 'Employee Management',
      description: 'Comprehensive tools to manage your workforce efficiently with role-based access control.'
    },
    {
      icon: <Building2 size={28} />,
      title: 'Department Organization',
      description: 'Structure your organization with clear hierarchies and department management.'
    },
    {
      icon: <BarChart3 size={28} />,
      title: 'Analytics & Reports',
      description: 'Gain insights with powerful analytics and customizable reporting dashboards.'
    },
    {
      icon: <Shield size={28} />,
      title: 'Secure Access',
      description: 'Enterprise-grade security with role-based permissions and data encryption.'
    },
    {
      icon: <Clock size={28} />,
      title: 'Attendance Tracking',
      description: 'Automated attendance management with real-time tracking and reporting.'
    },
    {
      icon: <FileText size={28} />,
      title: 'Document Management',
      description: 'Centralized document storage with easy access and version control.'
    }
  ];

  const stats = [
    { value: '500+', label: 'Companies' },
    { value: '50,000+', label: 'Active Users' },
    { value: '99.9%', label: 'Uptime' },
    { value: '24/7', label: 'Support' }
  ];

  const testimonials = [
    {
      name: 'Sarah Johnson',
      role: 'HR Director',
      company: 'TechCorp Inc.',
      content: 'CMS has transformed how we manage our workforce. The intuitive interface and powerful features have saved us countless hours.',
      rating: 5
    },
    {
      name: 'Michael Chen',
      role: 'Operations Manager',
      company: 'Global Solutions',
      content: 'The best management system we\'ve used. The role-based access control is exactly what we needed for our growing team.',
      rating: 5
    },
    {
      name: 'Emily Davis',
      role: 'CEO',
      company: 'StartupHub',
      content: 'From payroll to attendance, everything is streamlined. Our productivity has increased significantly since implementing CMS.',
      rating: 5
    }
  ];

  return (
    <div className="min-h-screen bg-[#0A1929]">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-[#0A1929]/90 backdrop-blur-md border-b border-[#1E3A5F]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-[#D4AF37] to-[#B8962E] rounded-lg flex items-center justify-center">
                <Building2 size={24} className="text-[#0A1929]" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-[#D4AF37]">CMS</h1>
                <p className="text-xs text-gray-400 hidden sm:block">Company Management System</p>
              </div>
            </div>
            
            <div className="hidden md:flex items-center gap-8">
              <a href="#features" className="text-gray-300 hover:text-[#D4AF37] transition-colors">Features</a>
              <a href="#about" className="text-gray-300 hover:text-[#D4AF37] transition-colors">About</a>
              <a href="#testimonials" className="text-gray-300 hover:text-[#D4AF37] transition-colors">Testimonials</a>
              <a href="#contact" className="text-gray-300 hover:text-[#D4AF37] transition-colors">Contact</a>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={onNavigateToLogin}
                className="px-4 py-2 text-gray-300 hover:text-white transition-colors"
              >
                Sign In
              </button>
              <button
                onClick={onNavigateToSignup}
                className="px-5 py-2 bg-gradient-to-r from-[#D4AF37] to-[#B8962E] text-[#0A1929] font-semibold rounded-lg hover:from-[#E5C04A] hover:to-[#D4AF37] transition-all"
              >
                Get Started
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 px-4 sm:px-6 lg:px-8 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-[#0A1929] via-[#1E3A5F]/30 to-[#0A1929]" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-[#D4AF37]/5 rounded-full blur-3xl" />
        
        <div className="relative max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-[#D4AF37]/10 border border-[#D4AF37]/30 rounded-full mb-6">
                <span className="w-2 h-2 bg-[#D4AF37] rounded-full animate-pulse" />
                <span className="text-sm text-[#D4AF37]">Trusted by 500+ Companies</span>
              </div>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">
                Enterprise Management,{' '}
                <span className="text-[#D4AF37]">Elevated.</span>
              </h1>
              <p className="text-lg text-gray-400 mb-8 max-w-lg">
                Streamline your operations with our comprehensive management platform. 
                Built for modern enterprises that demand excellence and efficiency.
              </p>
              <div className="flex flex-wrap gap-4">
                <button
                  onClick={onNavigateToSignup}
                  className="px-8 py-4 bg-gradient-to-r from-[#D4AF37] to-[#B8962E] text-[#0A1929] font-semibold rounded-xl hover:from-[#E5C04A] hover:to-[#D4AF37] transition-all flex items-center gap-2"
                >
                  Start Free Trial
                  <ArrowRight size={20} />
                </button>
                <button className="px-8 py-4 border border-[#1E3A5F] text-white rounded-xl hover:bg-[#1E3A5F] transition-colors">
                  Watch Demo
                </button>
              </div>
              
              {/* Stats */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 mt-12 pt-12 border-t border-[#1E3A5F]">
                {stats.map((stat, index) => (
                  <div key={index}>
                    <p className="text-2xl sm:text-3xl font-bold text-white">{stat.value}</p>
                    <p className="text-sm text-gray-400">{stat.label}</p>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="relative hidden lg:block">
              <div className="absolute inset-0 bg-gradient-to-br from-[#D4AF37]/20 to-transparent rounded-3xl blur-2xl" />
              <img
                src="https://d64gsuwffb70l.cloudfront.net/694652c721b6f2132898534e_1766216475465_78938f2e.jpg"
                alt="Dashboard Preview"
                className="relative rounded-2xl shadow-2xl border border-[#1E3A5F]"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 px-4 sm:px-6 lg:px-8 bg-[#0F2744]">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
              Powerful Features for Modern Enterprises
            </h2>
            <p className="text-gray-400 max-w-2xl mx-auto">
              Everything you need to manage your company efficiently, all in one platform.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div
                key={index}
                className="p-6 bg-[#0A1929] border border-[#1E3A5F] rounded-2xl hover:border-[#D4AF37]/50 transition-all duration-300 group"
              >
                <div className="w-14 h-14 bg-[#D4AF37]/10 rounded-xl flex items-center justify-center mb-4 group-hover:bg-[#D4AF37]/20 transition-colors">
                  <span className="text-[#D4AF37]">{feature.icon}</span>
                </div>
                <h3 className="text-xl font-semibold text-white mb-2">{feature.title}</h3>
                <p className="text-gray-400">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl sm:text-4xl font-bold text-white mb-6">
                Built for Teams That <span className="text-[#D4AF37]">Demand Excellence</span>
              </h2>
              <p className="text-gray-400 mb-8">
                Our Company Management System is designed from the ground up to handle the complexities 
                of modern enterprise operations. With role-based access control, you can ensure that 
                every team member has exactly the permissions they need.
              </p>
              <div className="space-y-4">
                {[
                  'Role-based dashboards for Admin, HR, Employees, Interns & Accountants',
                  'Comprehensive employee and department management',
                  'Real-time attendance tracking and payroll processing',
                  'Secure document management and event scheduling'
                ].map((item, index) => (
                  <div key={index} className="flex items-center gap-3">
                    <CheckCircle size={20} className="text-[#D4AF37] flex-shrink-0" />
                    <span className="text-gray-300">{item}</span>
                  </div>
                ))}
              </div>
              <button
                onClick={onNavigateToSignup}
                className="mt-8 px-6 py-3 bg-[#1E3A5F] text-white rounded-xl hover:bg-[#2D4A6F] transition-colors flex items-center gap-2"
              >
                Learn More
                <ChevronRight size={18} />
              </button>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-4">
                <div className="p-6 bg-[#0F2744] border border-[#1E3A5F] rounded-2xl">
                  <p className="text-4xl font-bold text-[#D4AF37] mb-2">5</p>
                  <p className="text-gray-400">User Roles</p>
                </div>
                <div className="p-6 bg-[#0F2744] border border-[#1E3A5F] rounded-2xl">
                  <p className="text-4xl font-bold text-[#D4AF37] mb-2">10+</p>
                  <p className="text-gray-400">Core Modules</p>
                </div>
              </div>
              <div className="space-y-4 mt-8">
                <div className="p-6 bg-[#0F2744] border border-[#1E3A5F] rounded-2xl">
                  <p className="text-4xl font-bold text-[#D4AF37] mb-2">100%</p>
                  <p className="text-gray-400">Responsive</p>
                </div>
                <div className="p-6 bg-[#0F2744] border border-[#1E3A5F] rounded-2xl">
                  <p className="text-4xl font-bold text-[#D4AF37] mb-2">API</p>
                  <p className="text-gray-400">Ready</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="testimonials" className="py-20 px-4 sm:px-6 lg:px-8 bg-[#0F2744]">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
              Trusted by Industry Leaders
            </h2>
            <p className="text-gray-400 max-w-2xl mx-auto">
              See what our customers have to say about their experience with CMS.
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div
                key={index}
                className="p-6 bg-[#0A1929] border border-[#1E3A5F] rounded-2xl"
              >
                <div className="flex gap-1 mb-4">
                  {Array.from({ length: testimonial.rating }).map((_, i) => (
                    <Star key={i} size={18} className="text-[#D4AF37] fill-[#D4AF37]" />
                  ))}
                </div>
                <p className="text-gray-300 mb-6">"{testimonial.content}"</p>
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#D4AF37] to-[#B8962E] flex items-center justify-center">
                    <span className="text-[#0A1929] font-bold">{testimonial.name.charAt(0)}</span>
                  </div>
                  <div>
                    <p className="font-medium text-white">{testimonial.name}</p>
                    <p className="text-sm text-gray-400">{testimonial.role}, {testimonial.company}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-6">
            Ready to Transform Your Operations?
          </h2>
          <p className="text-gray-400 mb-8 max-w-2xl mx-auto">
            Join hundreds of companies that have already streamlined their management processes with CMS.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <button
              onClick={onNavigateToSignup}
              className="px-8 py-4 bg-gradient-to-r from-[#D4AF37] to-[#B8962E] text-[#0A1929] font-semibold rounded-xl hover:from-[#E5C04A] hover:to-[#D4AF37] transition-all flex items-center gap-2"
            >
              Get Started Free
              <ArrowRight size={20} />
            </button>
            <button
              onClick={onNavigateToLogin}
              className="px-8 py-4 border border-[#1E3A5F] text-white rounded-xl hover:bg-[#1E3A5F] transition-colors"
            >
              Sign In
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer id="contact" className="bg-[#0F2744] border-t border-[#1E3A5F] py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
            {/* Brand */}
            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-gradient-to-br from-[#D4AF37] to-[#B8962E] rounded-lg flex items-center justify-center">
                  <Building2 size={24} className="text-[#0A1929]" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-[#D4AF37]">CMS</h3>
                </div>
              </div>
              <p className="text-gray-400 mb-4">
                Enterprise-grade company management system for modern businesses.
              </p>
              <div className="flex gap-4">
                <a href="#" className="w-10 h-10 rounded-lg bg-[#1E3A5F] flex items-center justify-center text-gray-400 hover:text-[#D4AF37] hover:bg-[#2D4A6F] transition-colors">
                  <Linkedin size={18} />
                </a>
                <a href="#" className="w-10 h-10 rounded-lg bg-[#1E3A5F] flex items-center justify-center text-gray-400 hover:text-[#D4AF37] hover:bg-[#2D4A6F] transition-colors">
                  <Twitter size={18} />
                </a>
                <a href="#" className="w-10 h-10 rounded-lg bg-[#1E3A5F] flex items-center justify-center text-gray-400 hover:text-[#D4AF37] hover:bg-[#2D4A6F] transition-colors">
                  <Facebook size={18} />
                </a>
              </div>
            </div>

            {/* Product */}
            <div>
              <h4 className="text-white font-semibold mb-4">Product</h4>
              <ul className="space-y-3">
                <li><a href="#features" className="text-gray-400 hover:text-[#D4AF37] transition-colors">Features</a></li>
                <li><a href="#" className="text-gray-400 hover:text-[#D4AF37] transition-colors">Pricing</a></li>
                <li><a href="#" className="text-gray-400 hover:text-[#D4AF37] transition-colors">Integrations</a></li>
                <li><a href="#" className="text-gray-400 hover:text-[#D4AF37] transition-colors">API</a></li>
              </ul>
            </div>

            {/* Company */}
            <div>
              <h4 className="text-white font-semibold mb-4">Company</h4>
              <ul className="space-y-3">
                <li><a href="#about" className="text-gray-400 hover:text-[#D4AF37] transition-colors">About</a></li>
                <li><a href="#" className="text-gray-400 hover:text-[#D4AF37] transition-colors">Careers</a></li>
                <li><a href="#" className="text-gray-400 hover:text-[#D4AF37] transition-colors">Blog</a></li>
                <li><a href="#" className="text-gray-400 hover:text-[#D4AF37] transition-colors">Press</a></li>
              </ul>
            </div>

            {/* Contact */}
            <div>
              <h4 className="text-white font-semibold mb-4">Contact</h4>
              <ul className="space-y-3">
                <li className="flex items-center gap-3 text-gray-400">
                  <Mail size={16} className="text-[#D4AF37]" />
                  contact@cms.com
                </li>
                <li className="flex items-center gap-3 text-gray-400">
                  <Phone size={16} className="text-[#D4AF37]" />
                  +1 (555) 123-4567
                </li>
                <li className="flex items-center gap-3 text-gray-400">
                  <MapPin size={16} className="text-[#D4AF37]" />
                  San Francisco, CA
                </li>
              </ul>
            </div>
          </div>

          <div className="pt-8 border-t border-[#1E3A5F] flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-gray-400 text-sm">
              © 2024 CMS. All rights reserved.
            </p>
            <div className="flex gap-6">
              <a href="#" className="text-gray-400 hover:text-[#D4AF37] text-sm transition-colors">Privacy Policy</a>
              <a href="#" className="text-gray-400 hover:text-[#D4AF37] text-sm transition-colors">Terms of Service</a>
              <a href="#" className="text-gray-400 hover:text-[#D4AF37] text-sm transition-colors">Cookies</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default HomePage;
