import React, { useState } from 'react';
import axios from 'axios';
import Button from './Button';
import { X, Tag, DollarSign, FileText, LayoutGrid, Image as ImageIcon } from 'lucide-react';

const SellModal = ({ project, onClose, onSuccess }) => {
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    title: project.title || '',
    description: project.description || '',
    category: project.category || 'Furniture',
    price: project.price || ''
  });

  const categories = ['Furniture', 'Fashion', 'Art', 'Tech', 'Home', 'Toys'];

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await axios.put(`http://127.0.0.1:8000/api/projects/${project.id}`, formData, {
        headers: { 
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
            'Content-Type': 'application/json'
        }
      });

      alert("🎉 Item Listed on Marketplace!");
      onSuccess(); 
    } catch (error) {
      console.error(error);
      alert("❌ Listing Failed: " + (error.response?.data?.message || error.message));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fade-in">
      <div className="bg-white w-full max-w-2xl rounded-[2.5rem] shadow-2xl overflow-hidden relative flex flex-col md:flex-row">
       
        <button 
            onClick={onClose}
            className="absolute top-4 right-4 z-50 bg-black/10 hover:bg-black/20 p-2 rounded-full transition-colors"
        >
            <X size={20}/>
        </button>

        <div className="w-full md:w-2/5 bg-slate-100 relative h-48 md:h-auto">
            <img 
                src={project.image_url} 
                alt="Project" 
                className="w-full h-full object-cover"
            />
            <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/60 to-transparent">
                <p className="text-white text-xs font-bold uppercase tracking-wider mb-1">Listing Preview</p>
                <h3 className="text-white font-bold text-lg leading-tight truncate">{formData.title || "Untitled"}</h3>
            </div>
        </div>

        <div className="w-full md:w-3/5 p-8">
            <h2 className="text-2xl font-black text-slate-800 mb-6">List on Marketplace</h2>
            
            <form onSubmit={handleSubmit} className="space-y-5">
                
                {/* 1. TITLE INPUT */}
                <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-400 uppercase tracking-wider ml-1">Product Name</label>
                    <div className="relative">
                        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"><Tag size={18}/></div>
                        <input 
                            type="text" 
                            required
                            placeholder="e.g. Vintage Denim Chair"
                            value={formData.title}
                            onChange={(e) => setFormData({...formData, title: e.target.value})}
                            className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-700 focus:border-brand-green focus:ring-2 focus:ring-brand-green/20 outline-none transition-all"
                        />
                    </div>
                </div>

                {/* 2. PRICE & CATEGORY ROW */}
                <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <label className="text-xs font-bold text-slate-400 uppercase tracking-wider ml-1">Price ($)</label>
                        <div className="relative">
                            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"><DollarSign size={18}/></div>
                            <input 
                                type="number" 
                                required
                                min="0"
                                placeholder="50"
                                value={formData.price}
                                onChange={(e) => setFormData({...formData, price: e.target.value})}
                                className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-700 focus:border-brand-green outline-none"
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-xs font-bold text-slate-400 uppercase tracking-wider ml-1">Category</label>
                        <div className="relative">
                            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"><LayoutGrid size={18}/></div>
                            <select 
                                value={formData.category} 
                                onChange={(e) => setFormData({...formData, category: e.target.value})}
                                className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-700 focus:border-brand-green outline-none appearance-none cursor-pointer"
                            >
                                {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                            </select>
                        </div>
                    </div>
                </div>

                {/* 3. DESCRIPTION INPUT */}
                <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-400 uppercase tracking-wider ml-1">Description</label>
                    <div className="relative">
                        <div className="absolute left-4 top-4 text-slate-400"><FileText size={18}/></div>
                        <textarea 
                            rows="3"
                            required
                            placeholder="Describe your creation..."
                            value={formData.description}
                            onChange={(e) => setFormData({...formData, description: e.target.value})}
                            className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl font-medium text-slate-600 focus:border-brand-green outline-none resize-none"
                        ></textarea>
                    </div>
                </div>

                {/* SUBMIT BUTTON */}
                <Button type="submit" isLoading={loading} className="w-full bg-brand-dark hover:bg-brand-green text-white py-4 rounded-xl text-lg shadow-xl shadow-brand-green/20">
                    Confirm Listing
                </Button>

            </form>
        </div>
      </div>
    </div>
  );
};

export default SellModal;