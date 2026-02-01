import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuthStore } from '../../store/useAuthStore';
import { makerService } from '../maker/makerService';
import ProjectCard from '../../components/ProjectCard';
import Button from '../../components/Button';
import SellModal from '../../components/SellModal';
import { 
  LogOut, Settings, Star, Hammer, Mail, MapPin, 
  Leaf, TrendingUp, MessageSquare, Plus, Trash2, CheckCircle, X, Grid, Inbox, Clock, Check, Briefcase, Image as ImageIcon
} from 'lucide-react';

const ProfilePage = () => {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();
  
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedProject, setSelectedProject] = useState(null); 
  
  const [isSelectionMode, setIsSelectionMode] = useState(false);
  const [selectedIds, setSelectedIds] = useState([]);

  const getAvatarUrl = (path) => {
      if (!path) return null;
      if (path.startsWith('http')) return path; 
      return `http://127.0.0.1:8000${path}`;
  };

  useEffect(() => {
    if (!user) {
        navigate('/login');
    } else {
        loadProjects();
    }
  }, [user, navigate]);

  const loadProjects = async () => {
    try {
      const data = await makerService.getMyProjects();
      setProjects(data);
    } catch (error) {
      console.error("Failed to load projects", error);
    } finally {
      setLoading(false);
    }
  };

  const toggleSelectionMode = () => {
      setIsSelectionMode(!isSelectionMode);
      setSelectedIds([]); 
  };

  const toggleSelectProject = (id) => {
      if (selectedIds.includes(id)) {
          setSelectedIds(prev => prev.filter(itemId => itemId !== id));
      } else {
          setSelectedIds(prev => [...prev, id]);
      }
  };

  const handleBulkDelete = async () => {
      if (!window.confirm(`Are you sure you want to delete ${selectedIds.length} items?`)) return;

      try {
          await Promise.all(selectedIds.map(id => 
              axios.delete(`http://127.0.0.1:8000/api/projects/${id}`, {
                  headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
              })
          ));

          setProjects(prev => prev.filter(p => !selectedIds.includes(p.id)));
          setIsSelectionMode(false);
          setSelectedIds([]);
          
      } catch (error) {
          alert("❌ Error deleting items: " + error.message);
      }
  };

  if (!user) return null;
  const isMaker = user.role === 'maker';

  return (
    <div className="min-h-screen bg-slate-50 pb-32 pt-24 animate-fade-in relative selection:bg-brand-green selection:text-white">
      
      <div className={`fixed bottom-10 left-1/2 transform -translate-x-1/2 bg-slate-900 text-white px-8 py-4 rounded-2xl shadow-2xl z-50 flex items-center gap-6 transition-all duration-500 ease-out ${isSelectionMode ? 'translate-y-0 opacity-100' : 'translate-y-40 opacity-0'}`}>
          <div className="font-bold text-lg flex items-center gap-2">
            <div className="bg-brand-green w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold">
                {selectedIds.length}
            </div>
            <span>Selected</span>
          </div>
          <div className="h-8 w-px bg-slate-700"></div>
          {selectedIds.length > 0 ? (
             <button onClick={handleBulkDelete} className="flex items-center gap-2 text-red-400 hover:text-red-300 font-bold transition-colors">
                <Trash2 size={20}/> Delete Selected
             </button>
          ) : (
             <span className="text-slate-500 text-sm">Select items</span>
          )}
          <button onClick={toggleSelectionMode} className="ml-4 bg-slate-800 p-2 rounded-full hover:bg-slate-700 text-slate-400 hover:text-white"><X size={20}/></button>
      </div>

      <div className="max-w-6xl mx-auto px-4">
        
        {/* --- HEADER --- */}
        <div className="bg-white rounded-[3rem] p-10 shadow-xl shadow-slate-200 border border-white relative overflow-hidden mb-12">
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-gradient-to-br from-brand-light-green/20 to-transparent rounded-full blur-3xl -translate-y-1/2 translate-x-1/4 pointer-events-none"></div>

            <div className="flex flex-col md:flex-row items-center gap-10 relative z-10">
                {/* Avatar */}
                <div className="group relative">
                    <div className="w-36 h-36 rounded-full border-[6px] border-white shadow-2xl overflow-hidden bg-slate-100 relative z-10">
                         <img src={getAvatarUrl(user.avatar) || "https://via.placeholder.com/150"} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"/>
                    </div>
                    <div className="absolute -bottom-2 -right-2 z-20 bg-brand-dark text-white text-xs font-black px-4 py-1.5 rounded-full uppercase tracking-widest shadow-lg">
                        {isMaker ? 'MAKER' : 'ECO'}
                    </div>
                </div>

                <div className="text-center md:text-left flex-1">
                    <h1 className="text-4xl font-black text-slate-800 mb-2">{user.name}</h1>
                    <p className="text-slate-500 font-medium mb-6 max-w-lg mx-auto md:mx-0 leading-relaxed">
                        {user.bio || (isMaker ? "Showcase your craftsmanship and connect with eco-conscious clients." : "No bio yet. Click Edit Profile to tell your story!")}
                    </p>
                    
                    <div className="flex flex-wrap justify-center md:justify-start gap-3">
                        <div className="bg-slate-50 px-4 py-2 rounded-xl text-xs font-bold uppercase text-slate-400 border border-slate-100 flex items-center gap-2">
                            <MapPin size={14} className="text-brand-green"/> Morocco
                        </div>
                        {isMaker && (
                           <div className="bg-slate-50 px-4 py-2 rounded-xl text-xs font-bold uppercase text-slate-400 border border-slate-100 flex items-center gap-2">
                               <Hammer size={14} className="text-brand-green"/> {user.field || "Expert Maker"}
                           </div>
                        )}
                    </div>
                </div>

                {/* Actions */}
                <div className="flex flex-col gap-3 min-w-[180px]">
                    <Button onClick={() => navigate('/inbox')} className="w-full !justify-start bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-200">
                        <Inbox size={18} className="mr-2"/> Messages
                    </Button>

                    <Button variant="outline" onClick={() => navigate('/settings')} className="w-full !justify-start">
                        <Settings size={18} className="mr-2"/> Edit Profile
                    </Button>
                    <Button variant="outline" onClick={() => { logout(); navigate('/'); }} className="w-full !justify-start text-red-500 hover:bg-red-50 border-red-100">
                        <LogOut size={18} className="mr-2"/> Log Out
                    </Button>
                </div>
            </div>
        </div>

        {/* --- DYNAMIC STATS GRID (ADAPTS TO ROLE) --- */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            
            {isMaker ? (
                <>
                    <div onClick={() => navigate('/inbox')} 
                         className="bg-brand-dark text-white p-8 rounded-[2.5rem] shadow-xl hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 cursor-pointer group relative overflow-hidden">
                        <div className="relative z-10">
                            <div className="w-14 h-14 bg-white/10 rounded-2xl flex items-center justify-center mb-4 text-brand-green group-hover:scale-110 transition-transform">
                                <Briefcase size={28}/>
                            </div>
                            <h3 className="text-2xl font-bold mb-1">Job Inquiries</h3>
                            <p className="opacity-60 text-sm">Check new opportunities</p>
                        </div>
                        <div className="absolute -bottom-10 -right-10 w-48 h-48 bg-brand-green/20 rounded-full blur-2xl group-hover:bg-brand-green/30 transition-colors"></div>
                    </div>

                    {/* Card 2: Add to Portfolio (Explicit Action) */}
                    <div onClick={() => navigate('/portfolio/upload')}
                         className="bg-white p-8 rounded-[2.5rem] shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all duration-300 cursor-pointer border border-slate-100 group relative overflow-hidden">
                         <div className="relative z-10">
                            <div className="flex items-center gap-3 mb-2 text-slate-400 text-xs font-bold uppercase tracking-wider">
                                <ImageIcon size={16}/> Portfolio
                            </div>
                            <h3 className="text-3xl font-black text-slate-800 mb-1">Add Work</h3>
                            <p className="text-slate-400 text-sm font-medium">Showcase your skills</p>
                         </div>
                         <div className="absolute -bottom-6 -right-6 w-32 h-32 bg-blue-50 rounded-full blur-xl group-hover:bg-blue-100 transition-colors"></div>
                    </div>

                    {/* Card 3: Reputation/Rating */}
                    <div className="bg-white p-8 rounded-[2.5rem] shadow-lg border border-slate-100">
                         <div className="flex items-center gap-3 mb-2 text-slate-400 text-xs font-bold uppercase tracking-wider">
                            <Star size={16}/> Client Rating
                         </div>
                         <div className="text-5xl font-black text-yellow-400 flex items-center gap-2">
                            4.9 <span className="text-lg text-slate-300 font-bold">/ 5</span>
                         </div>
                    </div>
                </>
            ) : (
                <>
                    {/* Card 1: Scan New Project */}
                    <div onClick={() => navigate('/maker')} 
                         className="bg-brand-dark text-white p-8 rounded-[2.5rem] shadow-xl hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 cursor-pointer group relative overflow-hidden">
                        <div className="relative z-10">
                            <div className="w-14 h-14 bg-white/10 rounded-2xl flex items-center justify-center mb-4 text-brand-green group-hover:scale-110 transition-transform">
                                <Plus size={28}/>
                            </div>
                            <h3 className="text-2xl font-bold mb-1">New Project</h3>
                            <p className="opacity-60 text-sm">Scan & Upcycle Waste</p>
                        </div>
                        <div className="absolute -bottom-10 -right-10 w-48 h-48 bg-brand-green/20 rounded-full blur-2xl group-hover:bg-brand-green/30 transition-colors"></div>
                    </div>

                    {/* Card 2: Total Projects */}
                    <div className="bg-white p-8 rounded-[2.5rem] shadow-lg border border-slate-100">
                         <div className="flex items-center gap-3 mb-2 text-slate-400 text-xs font-bold uppercase tracking-wider">
                            <TrendingUp size={16}/> Total Projects
                         </div>
                         <div className="text-5xl font-black text-slate-800">{projects.length}</div>
                    </div>

                    {/* Card 3: Eco Impact */}
                    <div className="bg-white p-8 rounded-[2.5rem] shadow-lg border border-slate-100">
                         <div className="flex items-center gap-3 mb-2 text-slate-400 text-xs font-bold uppercase tracking-wider">
                            <Leaf size={16}/> Eco Impact
                         </div>
                         <div className="text-5xl font-black text-brand-green">{projects.length * 15}</div>
                    </div>
                </>
            )}
        </div>

        {/* --- PROJECTS / PORTFOLIO SECTION --- */}
        <div className="flex items-center justify-between mb-8">
            <h2 className="text-3xl font-black text-slate-800">
                {isMaker ? "My Portfolio" : "My Items"}
            </h2>
            
            {/* MANAGE BUTTON */}
            {projects.length > 0 && (
                <button 
                    onClick={toggleSelectionMode}
                    className={`px-5 py-2 rounded-full font-bold text-sm transition-all ${
                        isSelectionMode 
                        ? 'bg-slate-200 text-slate-600 hover:bg-slate-300' 
                        : 'bg-white border border-slate-200 text-slate-600 hover:border-brand-green hover:text-brand-green'
                    }`}
                >
                    {isSelectionMode ? 'Cancel Selection' : 'Manage Items'}
                </button>
            )}
        </div>

        {loading ? (
             <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[1,2,3].map(i => <div key={i} className="h-64 bg-slate-200 rounded-[2rem] animate-pulse"></div>)}
             </div>
        ) : projects.length > 0 ? (
             <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pb-20">
                {projects.map((proj) => (
                    <div 
                        key={proj.id} 
                        onClick={() => isSelectionMode && toggleSelectProject(proj.id)}
                        className={`relative group transition-all duration-300 cursor-pointer ${
                            isSelectionMode 
                            ? 'hover:scale-[0.98]' 
                            : 'hover:scale-[1.02]'
                        }`}
                    >
                        {/* THE CARD */}
                        <div className={`transition-all duration-300 h-full ${
                            isSelectionMode && selectedIds.includes(proj.id) 
                            ? 'ring-4 ring-brand-green rounded-[2.5rem] opacity-100 scale-95' 
                            : isSelectionMode ? 'opacity-50 blur-[1px]' : ''
                        }`}>
                            <ProjectCard project={proj} />
                        </div>

                        {/* SELECTION OVERLAY */}
                        {isSelectionMode && (
                            <div className="absolute top-4 right-4 z-50">
                                {selectedIds.includes(proj.id) ? (
                                    <div className="w-8 h-8 bg-brand-green rounded-full flex items-center justify-center text-white shadow-lg scale-110 transition-transform">
                                        <CheckCircle size={20} fill="white" className="text-brand-green"/>
                                    </div>
                                ) : (
                                    <div className="w-8 h-8 bg-white/80 backdrop-blur rounded-full border-2 border-slate-300 hover:border-brand-green transition-colors"></div>
                                )}
                            </div>
                        )}

                        {!isSelectionMode && !isMaker && (
                           <>
                               {!proj.is_for_sale ? (
                                   <>
                                     <div className="absolute top-4 right-4 bg-orange-100 text-orange-700 px-3 py-1 rounded-full text-xs font-bold shadow-sm flex items-center gap-1 border border-orange-200">
                                        <Clock size={12}/> Waiting
                                     </div>
                                     <div className="absolute bottom-6 right-6 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-2 group-hover:translate-y-0">
                                         <button 
                                            onClick={(e) => { e.stopPropagation(); setSelectedProject(proj); }}
                                            className="bg-brand-dark text-white px-5 py-2.5 rounded-full text-xs font-bold shadow-xl hover:bg-brand-green transition-colors flex items-center gap-2"
                                         >
                                            List on Marketplace 💰
                                         </button>
                                     </div>
                                   </>
                               ) : (
                                   <div className="absolute top-4 right-4 bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-xs font-bold shadow-sm flex items-center gap-1 border border-blue-200">
                                      <Check size={12}/> Completed
                                   </div>
                               )}
                           </>
                        )}
                    </div>
                ))}
             </div>
        ) : (
             <div className="text-center py-20 bg-white rounded-[3rem] border-2 border-dashed border-slate-200">
                <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-6 text-slate-300">
                   {isMaker ? <Briefcase size={40}/> : <Grid size={40}/>}
                </div>
                <h3 className="text-2xl font-bold text-slate-700 mb-2">
                    {isMaker ? "No portfolio items yet!" : "It's empty here!"}
                </h3>
                <p className="text-slate-400 mb-8">
                    {isMaker ? "Upload your best work to attract clients." : "Start scanning items or uploading your work."}
                </p>
                <Button onClick={() => navigate(isMaker ? '/portfolio/upload' : '/maker')}>
                   {isMaker ? "Add First Project" : "Start Creating"}
                </Button>
             </div>
        )}

      </div>

      {/* --- SELL MODAL --- */}
      {selectedProject && (
        <SellModal 
          project={selectedProject} 
          onClose={() => setSelectedProject(null)} 
          onSuccess={() => { setSelectedProject(null); loadProjects(); }} 
        />
      )}
    </div>
  );
};

export default ProfilePage;