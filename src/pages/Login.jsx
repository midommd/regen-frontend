import React, { useState,useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuthStore } from '../store/useAuthStore';
import { useUIStore } from '../store/useUIStore';
import Input from '../components/Input';
import Button from '../components/Button';
import { LogIn, Leaf } from 'lucide-react';

const Login = () => {
  const navigate = useNavigate();
  const { login, isLoading, user } = useAuthStore();
  const { setNotification } = useUIStore();

  const [formData, setFormData] = useState({ email: '', password: '' });
  useEffect(() => {
    if (user) {
      navigate('/'); 
    }
  }, [user, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const result = await login(formData);
    
    if (result.success) {
      setNotification({ type: 'success', message: `Welcome back!` });
      navigate('/');
    } else {
      setNotification({ type: 'error', message: result.message });
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 animate-fade-in">
      <div className="max-w-md w-full">
        {/* Logo & Header */}
        <div className="text-center mb-10">
          <div className="inline-flex p-3 rounded-2xl bg-[--color-brand-light-green] text-[--color-brand-green] mb-4">
            <Leaf size={32} />
          </div>
          <h1 className="text-3xl font-black text-[--color-brand-dark]">Welcome Back</h1>
          <p className="text-gray-500 mt-2">Log in to manage your upcycling projects.</p>
        </div>

        {/* Login Form */}
        <div className="bg-white p-8 rounded-[2rem] shadow-xl border border-gray-50">
          <form onSubmit={handleSubmit} className="space-y-5">
            <Input 
              label="Email Address"
              type="email"
              placeholder="test@regenai.com"
              required
              value={formData.email}
              onChange={(e) => setFormData({...formData, email: e.target.value})}
            />
            <Input 
              label="Password"
              type="password"
              placeholder="••••••••"
              required
              value={formData.password}
              onChange={(e) => setFormData({...formData, password: e.target.value})}
            />
            
            <div className="flex justify-end">
              <button type="button" className="text-xs font-bold text-[--color-brand-green] hover:underline">
                Forgot Password?
              </button>
            </div>

            <Button 
              type="submit" 
              className="w-full !py-4" 
              isLoading={isLoading}
            >
              Sign In <LogIn size={18} />
            </Button>
          </form>

          {/* Testing Hint */}
          <div className="mt-6 p-4 bg-blue-50 rounded-xl border border-blue-100">
            <p className="text-[10px] uppercase tracking-widest font-black text-blue-500 mb-1">Mock Access</p>
            <p className="text-xs text-blue-700">Use <b>test@regenai.com</b> / <b>password</b></p>
          </div>
        </div>

        <p className="text-center mt-8 text-sm text-gray-500">
          Don't have an account?{' '}
          <Link to="/register" className="font-bold text-[--color-brand-green] hover:underline">
            Create one for free
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;