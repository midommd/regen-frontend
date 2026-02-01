import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuthStore } from '../../store/useAuthStore';
import { useUIStore } from '../../store/useUIStore';
import Input from '../../components/Input';
import Button from '../../components/Button';
import { LogIn, Leaf } from 'lucide-react';

const Login = () => {
  const navigate = useNavigate();
  const { login, isLoading } = useAuthStore();
  const { setNotification } = useUIStore();
  const [formData, setFormData] = useState({ email: '', password: '' });

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
    <div className="min-h-[80vh] flex items-center justify-center px-4 animate-fade-in pt-20">
      <div className="max-w-md w-full">
        <div className="text-center mb-10">
          <div className="inline-flex p-3 rounded-2xl bg-[--color-brand-light-green] text-[--color-brand-green] mb-4">
            <Leaf size={32} />
          </div>
          <h1 className="text-3xl font-black text-[--color-brand-dark]">Welcome Back</h1>
        </div>

        <div className="bg-white p-8 rounded-[2rem] shadow-xl border border-gray-50">
          <form onSubmit={handleSubmit} className="space-y-5">
            <Input 
              label="Email" 
              name="email"
              type="email" 
              placeholder="test@regenai.com" 
              value={formData.email}
              onChange={(e) => setFormData({...formData, email: e.target.value})}
            />
            <Input 
              label="Password" 
              name="password"
              type="password" 
              placeholder="••••••••" 
              value={formData.password}
              onChange={(e) => setFormData({...formData, password: e.target.value})}
            />
            <Button type="submit" className="w-full" isLoading={isLoading}>
              Sign In <LogIn size={18} />
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;