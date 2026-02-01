import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuthStore } from '../../store/useAuthStore'; 
import { 
  MapPin, Hammer, Star, ArrowLeft, Mail, Globe, 
  Instagram, Linkedin, Award, Clock, Users, Edit3 
} from 'lucide-react';
import PortfolioCard from '../../components/PortfolioCard';

const MakerPublicProfile = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user: currentUser } = useAuthStore();
  
  const [maker, setMaker] = useState(null);
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  const isOwnProfile = currentUser && maker && currentUser.id === maker.id;

  useEffect(() => {
    const fetchData = async () => {
        try {
            // Fetch Maker Details
            const userRes = await axios.get(`http://127.0.0.1:8000/api/users/${id}`);
            setMaker(userRes.data);
            
            // Fetch Portfolio
            const projRes = await axios.get(`http://127.0.0.1:8000/api/users/${id}/projects`);
            setProjects(projRes.data);
        } catch (error) {
            console.error("Error", error);
        } finally {
            setLoading(false);
        }
    };
    fetchData();
  }, [id]);

  if (loading) return <div className="min-h-screen flex items-center justify-center bg-slate-50"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-dark"></div></div>;
  if (!maker) return <div className="text-center mt-20 font-bold text-2xl text-slate-400">Maker not found.</div>;

  return (
    <div className="min-h-screen bg-white animate-fade-in">
        
        {/* --- 1. HERO BANNER --- */}
        <div className="h-[350px] relative bg-slate-900 overflow-hidden">
            {/* Artistic Background */}
            <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1618220179428-22790b461013?auto=format&fit=crop&w=2000&q=80')] bg-cover bg-center opacity-30 mix-blend-overlay"></div>
            <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent"></div>
            
            <button onClick={() => navigate(-1)} className="absolute top-8 left-8 bg-white/10 hover:bg-white/20 text-white p-3 rounded-full backdrop-blur transition-all border border-white/20 z-50">
                <ArrowLeft size={24}/>
            </button>
        </div>

        <div className="max-w-7xl mx-auto px-6 -mt-24 relative z-10 pb-20">
            
            <div className="flex flex-col lg:flex-row gap-12 items-start">
                
                {/* --- LEFT: PROFILE CARD --- */}
                <div className="w-full lg:w-1/3">
                    <div className="bg-white p-2 rounded-[2.5rem] shadow-2xl inline-block mb-6 relative">
                        <img 
                            src={maker.avatar ? `http://127.0.0.1:8000${maker.avatar}` : "https://via.placeholder.com/300"} 
                            className="w-48 h-48 rounded-[2rem] object-cover border border-slate-100"
                        />
                        <div className="absolute bottom-4 right-4 bg-brand-green text-white p-2 rounded-full border-4 border-white shadow-lg">
                            <Award size={20}/>
                        </div>
                    </div>
                    
                    <h1 className="text-5xl font-black text-slate-900 mb-2 leading-tight">{maker.name}</h1>
                    <p className="text-lg text-slate-500 font-bold mb-6 flex items-center gap-2 uppercase tracking-wide">
                        <Hammer size={18} className="text-brand-green"/> {maker.field || "Master Craftsman"}
                    </p>

                    {/* Stats Row */}
                    <div className="grid grid-cols-3 gap-3 mb-8">
                        <div className="bg-slate-50 border border-slate-100 p-4 rounded-2xl text-center">
                            <p className="text-2xl font-black text-slate-800">{projects.length}</p>
                            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Works</p>
                        </div>
                        <div className="bg-slate-50 border border-slate-100 p-4 rounded-2xl text-center">
                            <p className="text-2xl font-black text-slate-800">5+</p>
                            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Years</p>
                        </div>
                        <div className="bg-slate-50 border border-slate-100 p-4 rounded-2xl text-center">
                            <div className="flex justify-center items-center gap-1 text-2xl font-black text-yellow-500">
                                4.9
                            </div>
                            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Rating</p>
                        </div>
                    </div>

                    {/* ACTION BUTTON (Smart Logic) */}
                    {isOwnProfile ? (
                        <button 
                            onClick={() => navigate('/settings')}
                            className="w-full bg-slate-100 text-slate-700 py-4 rounded-2xl font-bold text-lg hover:bg-slate-200 transition-all flex items-center justify-center gap-2"
                        >
                            <Edit3 size={20}/> Edit My Profile
                        </button>
                    ) : (
                        <button className="w-full bg-brand-dark text-white py-4 rounded-2xl font-bold text-lg hover:bg-black transition-all shadow-xl shadow-slate-300 flex items-center justify-center gap-2 active:scale-95">
                            <Mail size={20}/> Hire {maker.name.split(' ')[0]}
                        </button>
                    )}

                    {/* Socials */}
                    <div className="flex justify-center gap-4 mt-8">
                        <button className="text-slate-400 hover:text-pink-600 transition-colors"><Instagram size={24}/></button>
                        <button className="text-slate-400 hover:text-blue-700 transition-colors"><Linkedin size={24}/></button>
                        <button className="text-slate-400 hover:text-slate-800 transition-colors"><Globe size={24}/></button>
                    </div>
                </div>

                {/* --- RIGHT: PORTFOLIO & BIO --- */}
                <div className="w-full lg:w-2/3 lg:mt-32">
                    
                    {/* Bio Section */}
                    <div className="mb-16">
                        <h3 className="text-xs font-black text-brand-green uppercase tracking-widest mb-4 flex items-center gap-2">
                            <span className="w-8 h-px bg-brand-green"></span> Biography
                        </h3>
                        <p className="text-xl text-slate-600 leading-relaxed font-medium">
                            {maker.bio || "A passionate creator dedicated to transforming waste into functional art. Specializes in sustainable materials and innovative upcycling techniques."}
                        </p>
                    </div>

                    <div className="h-px w-full bg-slate-100 mb-12"></div>

                    {/* Portfolio Section */}
                    <div>
                        <div className="flex items-end justify-between mb-8">
                            <h2 className="text-4xl font-black text-slate-900">Portfolio</h2>
                            <button className="text-slate-400 font-bold hover:text-brand-green transition-colors text-sm">View All</button>
                        </div>

                        {projects.length > 0 ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                {projects.map(proj => (
                                    <div key={proj.id} onClick={() => proj.media_type === 'link' && window.open(proj.external_link, '_blank')}>
                                        <PortfolioCard project={proj} />
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="bg-slate-50 border-2 border-dashed border-slate-200 rounded-[2rem] p-16 text-center">
                                <div className="inline-block p-4 bg-white rounded-full shadow-sm mb-4">
                                    <Hammer className="text-slate-300" size={32}/>
                                </div>
                                <p className="text-slate-400 font-bold text-lg">No public projects yet.</p>
                                {isOwnProfile && (
                                    <button onClick={() => navigate('/portfolio/upload')} className="mt-4 text-brand-green font-bold text-sm hover:underline">
                                        + Add your first project
                                    </button>
                                )}
                            </div>
                        )}
                    </div>

                </div>
            </div>
        </div>
    </div>
  );
};

export default MakerPublicProfile;