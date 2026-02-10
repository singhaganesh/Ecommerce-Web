import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { FiEye, FiEyeOff } from 'react-icons/fi';
import { loginUser } from '../store/actions/authActions';
import { useAuth } from '../context/AuthContext';

const Login = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { login } = useAuth();
  
  const [activeTab, setActiveTab] = useState('User');
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    username: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const roles = ['User', 'Seller', 'Admin'];

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const result = await dispatch(loginUser(formData));
      
      if (result.success) {
        // Update AuthContext with user data
        login(result.user);
        
        // Redirect based on user role
        if (result.user.roles?.includes('ROLE_ADMIN')) {
          navigate('/admin/dashboard', { replace: true });
        } else if (result.user.roles?.includes('ROLE_SELLER')) {
          navigate('/seller/dashboard', { replace: true });
        } else {
          navigate('/', { replace: true });
        }
      } else {
        setError(result.message || 'Login failed');
      }
    } catch (err) {
      setError(err.message || 'An error occurred during login');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-gray-50 flex flex-col min-h-screen font-sans text-gray-900">
      
      {/* Header */}
      <header className="flex justify-between items-center px-6 md:px-12 py-4 bg-white border-b border-gray-100">
        <div className="flex items-center gap-2">
          {/* Logo Icon */}
          <div className="w-6 h-6 bg-blue-600 rounded-sm transform rotate-45 flex items-center justify-center">
            <div className="w-2.5 h-2.5 bg-white rounded-full"></div>
          </div>
          <span className="font-bold text-xl tracking-tight">Unified Login</span>
        </div>
        <button className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-1.5 rounded-md font-medium transition text-sm">
          Help
        </button>
      </header>

      {/* Main Container */}
      <main className="flex-grow flex items-center justify-center p-4">
        <div className="bg-white p-8 rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.1)] border border-gray-100 w-full max-w-[440px]">
          
          {/* Role Switcher Tabs */}
          <div className="flex p-1 bg-gray-100 rounded-xl mb-10">
            {roles.map((role) => (
              <button
                key={role}
                onClick={() => setActiveTab(role)}
                className={`flex-1 py-2 text-sm font-semibold rounded-lg transition-all duration-200 ${
                  activeTab === role 
                    ? 'bg-white text-blue-600 shadow-sm' 
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                {role}
              </button>
            ))}
          </div>

          <h1 className="text-3xl font-extrabold mb-2">Sign In</h1>
          <p className="text-gray-500 mb-8">
            Welcome back! Sign in to your <span className="lowercase">{activeTab}</span> account.
          </p>

          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
              {error}
            </div>
          )}

          <form className="space-y-5" onSubmit={handleSubmit}>
            {/* Username/Email Field */}
            <div>
              <label className="block text-sm font-bold mb-2">Username or Email</label>
              <input 
                type="text"
                name="username"
                value={formData.username}
                onChange={handleChange}
                placeholder="Enter your username or email"
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
              />
            </div>

            {/* Password Field */}
            <div>
              <div className="flex justify-between mb-2">
                <label className="text-sm font-bold">Password</label>
                <Link to="/forgot-password" className="text-sm text-blue-600 hover:underline font-semibold">Forgot password?</Link>
              </div>
              <div className="relative">
                <input 
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Enter your password"
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                />
                <button 
                  type="button" 
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-3.5 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <FiEyeOff className="w-5 h-5"/> : <FiEye className="w-5 h-5"/>}
                </button>
              </div>
            </div>

            <button 
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3.5 rounded-xl transition shadow-lg shadow-blue-200 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Signing in...' : 'Login'}
            </button>
          </form>

          {/* Legal */}
          <p className="text-[11px] text-gray-400 mt-6 leading-relaxed">
            By continuing, you agree to our <a href="#" className="text-blue-600 hover:underline">Conditions of Use</a> and <a href="#" className="text-blue-600 hover:underline">Privacy Notice</a>.
          </p>

          {/* New Here Divider */}
          <div className="relative my-8">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-200"></div>
            </div>
            <div className="relative flex justify-center text-[10px] uppercase font-bold tracking-widest text-gray-400">
              <span className="bg-white px-3">New Here?</span>
            </div>
          </div>

          <Link to="/seller/register">
            <button className="w-full border-2 border-gray-200 py-3 rounded-xl font-bold hover:bg-gray-50 transition text-gray-700 active:scale-[0.98]">
              Create {activeTab} Account
            </button>
          </Link>
        </div>
      </main>

      {/* Footer */}
      <footer className="py-8 text-center text-[11px] text-gray-400">
        <div className="flex justify-center gap-6 mb-3">
          <a href="#" className="hover:text-blue-600">Conditions of Use</a>
          <a href="#" className="hover:text-blue-600">Privacy Notice</a>
          <a href="#" className="hover:text-blue-600">Help Center</a>
        </div>
        <p>© 1996-2024, E-Commerce Central Inc. or its affiliates</p>
      </footer>
    </div>
  );
};

export default Login;