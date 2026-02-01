import React, { useState } from 'react';
import { useAuthStore } from '../../store/useAuthStore';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import config from '../../services/apiConfig';
import Button from '../../components/Button';
import Input from '../../components/Input';
import { ArrowLeft, Save, Upload } from 'lucide-react';

const EditProfile = () => {
  const { user, setUser } = useAuthStore();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  
  const [formData, setFormData] = useState({
    name: user?.name || '',
    bio: user?.bio || '',
    field: user?.field || '',
    experience: user?.experience || '',
  });
  const [avatarFile, setAvatarFile] = useState(null);

  if (!user) return null;
  const isMaker = user.role === 'maker';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const payload = new FormData();
    payload.append('name', formData.name);
    payload.append('bio', formData.bio);
    if (isMaker) {
      payload.append('field', formData.field);
      payload.append('experience', formData.experience);
    }
    if (avatarFile) {
      payload.append('avatar', avatarFile);
    }

    try {
      const response = await axios.post(`${config.API_URL}/profile/update`, payload, {
        headers: { 
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
            'Content-Type': 'multipart/form-data'
        }
      });
      
      setUser(response.data.user);
      navigate('/profile');
    } catch (error) {
      console.error(error);
      const serverMessage = error.response?.data?.message || "Unknown Error";
      alert("❌ Update Failed: " + serverMessage);
    } finally {
      setLoading(false);
    
    }
  };
  

  return (
    <div className="max-w-xl mx-auto px-4 py-24 animate-fade-in">
      <button onClick={() => navigate(-1)} className="flex items-center text-gray-500 mb-6 hover:text-brand-dark">
        <ArrowLeft size={18} className="mr-1"/> Back
      </button>

      <h1 className="text-3xl font-black mb-8">Edit Profile</h1>

      <form onSubmit={handleSubmit} className="space-y-6 bg-white p-8 rounded-[2rem] shadow-xl border border-gray-100">
        
        {/* Avatar Upload */}
        <div className="flex flex-col items-center gap-4 mb-6">
          <div className="w-24 h-24 rounded-full bg-brand-light-green flex items-center justify-center overflow-hidden border-4 border-white shadow-md">
             {avatarFile ? (
               <img src={URL.createObjectURL(avatarFile)} className="w-full h-full object-cover"/>
             ) : (
               <img src={user.avatar || "https://via.placeholder.com/150"} className="w-full h-full object-cover"/>
             )}
          </div>
          <label className="cursor-pointer bg-gray-100 px-4 py-2 rounded-full text-sm font-bold hover:bg-gray-200 transition">
            <input type="file" className="hidden" onChange={(e) => setAvatarFile(e.target.files[0])} />
            <Upload size={14} className="inline mr-1"/> Change Photo
          </label>
        </div>

        <Input label="Display Name" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} />

        {isMaker && (
          <div className="grid grid-cols-2 gap-4">
            <Input label="Field (e.g. Wood)" value={formData.field} onChange={(e) => setFormData({...formData, field: e.target.value})} />
            <Input label="Experience (Yrs)" type="number" value={formData.experience} onChange={(e) => setFormData({...formData, experience: e.target.value})} />
          </div>
        )}

        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-semibold text-gray-700 ml-1">Bio / About Me</label>
          <textarea 
            className="px-4 py-3 rounded-xl border border-gray-200 focus:border-brand-green outline-none min-h-[100px]"
            value={formData.bio}
            onChange={(e) => setFormData({...formData, bio: e.target.value})}
            placeholder="Tell people about your work..."
          ></textarea>
        </div>

        <Button type="submit" className="w-full mt-4" isLoading={loading}>
          <Save size={18} className="mr-2"/> Save Changes
        </Button>
      </form>
    </div>
  );
};

export default EditProfile;