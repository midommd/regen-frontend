import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Upload, Link as LinkIcon, Image as ImageIcon, X, CheckCircle, Loader } from 'lucide-react';

const PortfolioUploadPage = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [mode, setMode] = useState('image'); // 'image' or 'link'
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'Furniture', // Default
    external_link: '',
    image: null
  });

  const [preview, setPreview] = useState(null);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
        setFormData({ ...formData, image: file });
        setPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const data = new FormData();
    data.append('title', formData.title);
    data.append('description', formData.description);
    data.append('category', formData.category);
    data.append('media_type', mode);

    if (mode === 'image' && formData.image) {
        data.append('image', formData.image);
    } else if (mode === 'link') {
        data.append('external_link', formData.external_link);
        // Use a placeholder image for links if you want, or handle on backend
    }

    try {
        await axios.post('http://127.0.0.1:8000/api/projects', data, {
            headers: { 
                'Content-Type': 'multipart/form-data',
                'Authorization': `Bearer ${localStorage.getItem('token')}` 
            }
        });
        navigate('/profile'); // Go back to profile
    } catch (error) {
        alert("Upload Failed: " + (error.response?.data?.message || error.message));
    } finally {
        setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 pt-28 pb-20 px-4">
      <div className="max-w-2xl mx-auto bg-white rounded-[2.5rem] shadow-xl border border-slate-100 p-8 md:p-12 relative overflow-hidden">
        
        {/* Header */}
        <div className="text-center mb-10">
            <h1 className="text-4xl font-black text-slate-800 mb-2">Add to Portfolio</h1>
            <p className="text-slate-400 font-medium">Showcase your best upcycling work.</p>
        </div>

        {/* Toggle Mode */}
        <div className="flex bg-slate-100 p-1 rounded-2xl mb-8">
            <button 
                onClick={() => setMode('image')}
                className={`flex-1 py-3 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-all ${mode === 'image' ? 'bg-white text-brand-dark shadow-md' : 'text-slate-400 hover:text-slate-600'}`}
            >
                <ImageIcon size={18}/> Upload Image
            </button>
            <button 
                onClick={() => setMode('link')}
                className={`flex-1 py-3 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-all ${mode === 'link' ? 'bg-white text-blue-600 shadow-md' : 'text-slate-400 hover:text-slate-600'}`}
            >
                <LinkIcon size={18}/> External Link
            </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
            
            {/* 1. MEDIA INPUT */}
            <div>
                <label className="block text-xs font-bold uppercase text-slate-400 mb-2 tracking-wider">
                    {mode === 'image' ? "Project Photo" : "Video/Project URL"}
                </label>
                
                {mode === 'image' ? (
                    <div className="relative group">
                        {preview ? (
                            <div className="relative rounded-3xl overflow-hidden h-64 border-2 border-slate-100 shadow-inner">
                                <img src={preview} className="w-full h-full object-cover"/>
                                <button type="button" onClick={() => { setPreview(null); setFormData({...formData, image: null}); }} className="absolute top-4 right-4 bg-black/50 p-2 rounded-full text-white hover:bg-red-500 transition-colors">
                                    <X size={20}/>
                                </button>
                            </div>
                        ) : (
                            <label className="h-64 border-2 border-dashed border-slate-300 rounded-3xl flex flex-col items-center justify-center cursor-pointer hover:border-brand-green hover:bg-brand-green/5 transition-all group">
                                <div className="w-16 h-16 bg-white rounded-full shadow-lg flex items-center justify-center mb-4 text-brand-green group-hover:scale-110 transition-transform">
                                    <Upload size={28}/>
                                </div>
                                <span className="font-bold text-slate-400 group-hover:text-brand-green">Click to upload</span>
                                <input type="file" className="hidden" accept="image/*" onChange={handleImageChange}/>
                            </label>
                        )}
                    </div>
                ) : (
                    <div className="relative">
                        <LinkIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20}/>
                        <input 
                            type="url" 
                            placeholder="https://youtube.com/..." 
                            className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium"
                            value={formData.external_link}
                            onChange={e => setFormData({...formData, external_link: e.target.value})}
                            required
                        />
                    </div>
                )}
            </div>

            {/* 2. DETAILS */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                    <label className="block text-xs font-bold uppercase text-slate-400 mb-2 tracking-wider">Project Title</label>
                    <input 
                        type="text" 
                        placeholder="e.g. Denim Sofa" 
                        className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-brand-green font-bold text-slate-800"
                        value={formData.title}
                        onChange={e => setFormData({...formData, title: e.target.value})}
                        required
                    />
                </div>
                <div>
                    <label className="block text-xs font-bold uppercase text-slate-400 mb-2 tracking-wider">Category</label>
                    <select 
                        className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-brand-green font-bold text-slate-800 appearance-none"
                        value={formData.category}
                        onChange={e => setFormData({...formData, category: e.target.value})}
                    >
                        <option>Furniture</option>
                        <option>Fashion</option>
                        <option>Decor</option>
                        <option>Tech</option>
                        <option>Art</option>
                    </select>
                </div>
            </div>

            <div>
                <label className="block text-xs font-bold uppercase text-slate-400 mb-2 tracking-wider">Description</label>
                <textarea 
                    rows="4"
                    placeholder="Tell the story of how you made this..." 
                    className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-brand-green font-medium text-slate-600 resize-none"
                    value={formData.description}
                    onChange={e => setFormData({...formData, description: e.target.value})}
                    required
                />
            </div>

            {/* Submit */}
            <button 
                type="submit" 
                disabled={loading}
                className="w-full py-5 bg-brand-dark text-white rounded-2xl font-black text-lg tracking-wide hover:bg-brand-green transition-all shadow-xl hover:shadow-2xl hover:-translate-y-1 flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed"
            >
                {loading ? <Loader className="animate-spin"/> : <><CheckCircle size={22}/> Publish to Portfolio</>}
            </button>

        </form>
      </div>
    </div>
  );
};

export default PortfolioUploadPage;