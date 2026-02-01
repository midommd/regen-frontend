import React, { useState,useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuthStore } from '../../store/useAuthStore';
import { useUIStore } from '../../store/useUIStore';
import Input from '../../components/Input';
import Button from '../../components/Button';
import { UserPlus, Hammer, User } from 'lucide-react';

const Register = () => {
  const navigate = useNavigate();
  const { register, isLoading, user } = useAuthStore();
  const { setNotification } = useUIStore();
  const [role, setRole] = useState('user'); 
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    experience: '',
    field: '',
    bio: ''
  });
  useEffect(() => {
    if (user) {
      navigate('/'); 
    }
  }, [user, navigate]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // 1. Validation Logic
    if (formData.password !== formData.confirmPassword) {
      setNotification({ type: 'error', message: "Passwords do not match!" });
      return;
    }

    if (role === 'maker' && (!formData.experience || !formData.field)) {
      setNotification({ type: 'error', message: "Please fill in your maker details." });
      return;
    }

    // 2. Prepare Payload
    const payload = {
      name: formData.name,
      email: formData.email,
      password: formData.password,
      role: role,
      ...(role === 'maker' && {
        experience: formData.experience,
        field: formData.field,
        bio: formData.bio
      })
    };

    // 3. Send to Service
    const result = await register(payload);
    
    if (result.success) {
      setNotification({ type: 'success', message: `Welcome, ${role === 'maker' ? 'Maker' : 'Eco-Warrior'}!` });
      navigate(role === 'maker' ? '/profile' : '/');
    } else {
      setNotification({ type: 'error', message: result.message });
    }
  };

  return (
    <div className="min-h-[90vh] flex items-center justify-center px-4 animate-fade-in pt-24 pb-12">
      <div className="max-w-lg w-full">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-black text-brand-dark">Join RegenAI</h1>
          <p className="text-gray-500 mt-2">Create an account to start your journey.</p>
        </div>

        <div className="bg-white p-8 rounded-[2rem] shadow-xl border border-gray-50">
          
          {/* Role Selection Toggles */}
          <div className="flex gap-4 mb-8 bg-gray-50 p-2 rounded-xl">
            <button 
              type="button"
              onClick={() => setRole('user')}
              className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-lg font-bold transition-all ${
                role === 'user' ? 'bg-white shadow-md text-brand-dark' : 'text-gray-400 hover:text-gray-600'
              }`}
            >
              <User size={18} /> I'm a User
            </button>
            <button 
              type="button"
              onClick={() => setRole('maker')}
              className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-lg font-bold transition-all ${
                role === 'maker' ? 'bg-brand-green text-white shadow-md' : 'text-gray-400 hover:text-gray-600'
              }`}
            >
              <Hammer size={18} /> I'm a Maker
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Common Fields */}
            <Input 
              label="Full Name" 
              name="name" 
              placeholder="Jane Doe" 
              required 
              value={formData.name} 
              onChange={handleChange}
            />
            <Input 
              label="Email Address" 
              name="email" 
              type="email" 
              placeholder="jane@example.com" 
              required 
              value={formData.email} 
              onChange={handleChange}
            />
            
            <div className="grid grid-cols-2 gap-4">
              <Input 
                label="Password" 
                name="password" 
                type="password" 
                placeholder="••••••" 
                required 
                value={formData.password} 
                onChange={handleChange}
              />
              <Input 
                label="Confirm" 
                name="confirmPassword" 
                type="password" 
                placeholder="••••••" 
                required 
                value={formData.confirmPassword} 
                onChange={handleChange}
              />
            </div>

            {role === 'maker' && (
              <div className="bg-brand-gray/50 p-4 rounded-xl space-y-4 border border-brand-green/20 animate-slide-up">
                <h3 className="font-bold text-brand-green text-sm uppercase tracking-wider">Maker Profile</h3>
                
                <div className="grid grid-cols-2 gap-4">
                   <div className="flex flex-col gap-1.5 w-full">
                      <label className="text-sm font-semibold text-gray-700 ml-1">Field of Work</label>
                      <select 
                        name="field" 
                        className="px-4 py-3 rounded-xl border border-gray-200 focus:border-brand-green outline-none bg-white"
                        value={formData.field}
                        onChange={handleChange}
                        required
                      >
                        <option value="">Select...</option>
                        <option value="Woodworking">Woodworking</option>
                        <option value="Metalworking">Metalworking</option>
                        <option value="Textiles">Textiles & Sewing</option>
                        <option value="Plastic Recycling">Plastic Recycling</option>
                        <option value="Electronics">Electronics</option>
                      </select>
                   </div>

                   <Input 
                      label="Experience (Yrs)" 
                      name="experience" 
                      type="number" 
                      placeholder="e.g. 5" 
                      required 
                      value={formData.experience} 
                      onChange={handleChange}
                   />
                </div>
                
                <div className="flex flex-col gap-1.5">
                  <label className="text-sm font-semibold text-gray-700 ml-1">Short Bio</label>
                  <textarea 
                    name="bio"
                    className="px-4 py-3 rounded-xl border border-gray-200 focus:border-brand-green outline-none bg-white min-h-[80px]"
                    placeholder="Tell us about your craft..."
                    value={formData.bio}
                    onChange={handleChange}
                  ></textarea>
                </div>
              </div>
            )}

            <Button type="submit" className="w-full !py-4 mt-4" isLoading={isLoading}>
              {role === 'maker' ? 'Apply as Maker' : 'Create Account'} <UserPlus size={18} />
            </Button>
          </form>
        </div>

        <p className="text-center mt-8 text-sm text-gray-500">
          Already have an account?{' '}
          <Link to="/login" className="font-bold text-brand-green hover:underline">
            Log in here
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Register;