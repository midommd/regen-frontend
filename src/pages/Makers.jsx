import React, { useState, useEffect } from 'react';
import axios from 'axios';
import config from '../services/apiConfig';
import { chatService } from '../features/chat/chatService'; 
import { useNavigate, useLocation } from 'react-router-dom'; 
import Button from '../components/Button';
import { useAuthStore } from '../store/useAuthStore'; 
import { MessageSquare, Star, Hammer, X, Briefcase, ExternalLink, Grid, PlayCircle, Lock } from 'lucide-react';

const Makers = () => {
  const { user } = useAuthStore(); 
  const [makers, setMakers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedMaker, setSelectedMaker] = useState(null); 
  const [makerProjects, setMakerProjects] = useState([]);
  const navigate = useNavigate();
  const location = useLocation(); 
  
  const projectGoal = location.state?.lookingFor || "";

  useEffect(() => {
    const fetchMakers = async () => {
      try {
        const token = localStorage.getItem('token');
        const headers = token ? { Authorization: `Bearer ${token}` } : {};
        
        const response = await axios.get(`${config.API_URL}/makers`, { headers });
        
        const makersList = Array.isArray(response.data) 
            ? response.data 
            : (response.data.data || []);
            
        setMakers(makersList);
      } catch (error) {
        console.error("Error fetching makers", error);
      } finally {
        setLoading(false);
      }
    };
    fetchMakers();
  }, []);

  useEffect(() => {
    if (selectedMaker) {
        const fetchProjects = async () => {
            try {
                const token = localStorage.getItem('token');
                const headers = token ? { Authorization: `Bearer ${token}` } : {};
                const res = await axios.get(`${config.API_URL}/users/${selectedMaker.id}/projects`, { headers });
                
                const projectsList = Array.isArray(res.data) ? res.data : (res.data.data || []);
                setMakerProjects(projectsList);
            } catch (err) {
                console.error("No projects found", err);
                setMakerProjects([]);
            }
        };
        fetchProjects();
    } else {
        setMakerProjects([]);
    }
  }, [selectedMaker]);

  const checkAuth = (actionCallback) => {
    if (!user) {
        if (window.confirm("You need to login to contact or view full profiles. Go to login?")) {
            navigate('/login');
        }
    } else {
        actionCallback();
    }
  };

  const handleStartChat = async (makerId, makerName) => {
    checkAuth(async () => {
        try {
            const chat = await chatService.startChat(makerId);
            const messageText = projectGoal 
                ? `Hi ${makerName}, I'd like to hire you for my project: ${projectGoal}.`
                : `Hi ${makerName}, I am interested in your work.`;
            
            await chatService.sendMessage(chat.id, messageText);
            navigate('/inbox');
        } catch (error) {
            alert("Could not start chat.");
        }
    });
  };

  const handleViewProfile = (maker) => {
      checkAuth(() => {
          setSelectedMaker(maker);
      });
  };

  const isSelf = selectedMaker && user && selectedMaker.id === user.id;

  return (
    <div className="max-w-6xl mx-auto px-4 py-12 pt-24 animate-fade-in relative">
      <div className="text-center mb-12">
        <h1 className="text-3xl font-black text-brand-dark">Hire a Pro Maker</h1>
        <p className="text-gray-500 mt-2">Find the perfect expert to transform your waste.</p>
        {projectGoal && (
           <div className="mt-4 bg-brand-light-green inline-block px-4 py-2 rounded-full text-brand-dark font-bold text-sm">
             🎯 Looking for: {projectGoal}
           </div>
        )}
      </div>

      {loading ? (
        <div className="text-center p-10">Loading Makers...</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {makers.length > 0 ? makers.map(maker => (
            <div key={maker.id} className="bg-white p-6 rounded-2xl border border-gray-100 hover:shadow-xl hover:border-brand-green/30 transition-all group relative overflow-hidden">
               
               {/* Lock Icon for Guests */}
               {!user && (
                   <div className="absolute top-3 right-3 text-slate-300 bg-slate-50 p-1.5 rounded-full" title="Login to interact">
                       <Lock size={14}/>
                   </div>
               )}

               <div className="flex justify-between items-start mb-4">
                 <div className="w-14 h-14 bg-brand-light-green rounded-full flex items-center justify-center font-bold text-xl text-brand-green uppercase">
                   {maker.name[0]}
                 </div>
                 <span className="flex items-center gap-1 bg-yellow-50 text-yellow-700 px-2 py-1 rounded-lg text-xs font-bold">
                   <Star size={12} className="fill-current"/> {maker.rating || '5.0'}
                 </span>
               </div>
               
               <h3 className="font-bold text-lg text-brand-dark">{maker.name}</h3>
               <div className="flex items-center gap-2 text-sm text-gray-500 mb-2">
                  <Hammer size={14} /> {maker.field || 'General Maker'}
               </div>
               
               <p className="text-gray-400 text-sm mb-6 line-clamp-2 h-10">
                 "{maker.bio || 'Ready to help.'}"
               </p>

               <div className="flex gap-2">
                 {/* VIEW PROFILE (Protected) */}
                 <Button variant="outline" onClick={() => handleViewProfile(maker)} className="flex-1 text-xs">
                   View Profile
                 </Button>
                 
                 {/* HIRE (Protected + Hide Self) */}
                 {(user?.id !== maker.id) && (
                    <Button onClick={() => handleStartChat(maker.id, maker.name)} className="flex-1 text-xs">
                        <MessageSquare size={16} className="mr-1"/> Hire
                    </Button>
                 )}
               </div>
            </div>
          )) : (
            <div className="col-span-3 text-center py-10 bg-slate-50 rounded-2xl border-2 border-dashed border-slate-200">
                <p className="text-gray-400 font-bold">No makers found.</p>
                <p className="text-gray-400 text-sm">Be the first to join!</p>
            </div>
          )}
        </div>
      )}

      {/* --- MAKER DETAILS MODAL --- */}
      {selectedMaker && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-white w-full max-w-3xl rounded-3xl overflow-hidden shadow-2xl relative max-h-[90vh] overflow-y-auto">
            <button onClick={() => setSelectedMaker(null)} className="absolute top-4 right-4 bg-white/20 hover:bg-white/40 text-white p-2 rounded-full z-20 backdrop-blur transition-colors">
              <X size={20}/>
            </button>
            
            {/* Header */}
            <div className="bg-brand-dark text-white p-10 text-center relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-brand-green/20 rounded-full blur-3xl translate-x-10 -translate-y-10"></div>
              
              <div className="relative z-10">
                  <div className="w-24 h-24 bg-white text-brand-dark rounded-full flex items-center justify-center text-4xl font-black mx-auto mb-4 border-4 border-white/20 uppercase shadow-xl">
                    {selectedMaker.name[0]}
                  </div>
                  <h2 className="text-3xl font-bold">{selectedMaker.name}</h2>
                  <p className="opacity-80 flex items-center justify-center gap-2 mt-2">
                    <Hammer size={16}/> {selectedMaker.field} Specialist
                  </p>
              </div>
            </div>

            {/* Body */}
            <div className="p-8">
              {/* Stats */}
              <div className="flex gap-4 mb-8">
                <div className="flex-1 bg-gray-50 p-4 rounded-xl text-center">
                   <div className="text-2xl font-bold text-brand-green">{selectedMaker.experience || '1'}+</div>
                   <div className="text-xs text-gray-500 uppercase font-bold">Years Exp</div>
                </div>
                <div className="flex-1 bg-gray-50 p-4 rounded-xl text-center">
                   <div className="text-2xl font-bold text-yellow-500">{selectedMaker.rating || '5.0'}</div>
                   <div className="text-xs text-gray-500 uppercase font-bold">Rating</div>
                </div>
                <div className="flex-1 bg-gray-50 p-4 rounded-xl text-center">
                   <div className="text-2xl font-bold text-slate-700">{makerProjects.length}</div>
                   <div className="text-xs text-gray-500 uppercase font-bold">Jobs Done</div>
                </div>
              </div>

              {/* Bio */}
              <div className="mb-10">
                  <h3 className="font-bold text-lg mb-3 flex items-center gap-2">
                    <Briefcase size={18}/> About Me
                  </h3>
                  <p className="text-gray-600 leading-relaxed">
                    {selectedMaker.bio || "This maker has not added a bio yet, but they are ready to work!"}
                  </p>
              </div>

              {/* Portfolio Grid */}
              <div className="mb-10">
                  <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
                    <Grid size={18}/> Portfolio & Jobs
                  </h3>
                  
                  {makerProjects.length > 0 ? (
                      <div className="grid grid-cols-2 gap-4">
                          {makerProjects.map(proj => (
                              <div 
                                  key={proj.id} 
                                  onClick={() => proj.media_type === 'link' && window.open(proj.external_link, '_blank')}
                                  className="group relative h-40 bg-slate-100 rounded-xl overflow-hidden cursor-pointer border border-gray-200 flex items-center justify-center"
                              >
                                  {proj.image_path ? (
                                      <img src={`http://127.0.0.1:8000${proj.image_path}`} className="w-full h-full object-cover group-hover:scale-110 transition-transform"/>
                                  ) : (
                                      <div className="flex flex-col items-center text-slate-400 group-hover:text-brand-dark transition-colors">
                                          <PlayCircle size={32} className="mb-2"/>
                                          <span className="text-xs font-bold uppercase tracking-wider">Watch Video</span>
                                      </div>
                                  )}
                                  <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-3">
                                      <p className="text-white text-xs font-bold truncate">{proj.title}</p>
                                  </div>
                              </div>
                          ))}
                      </div>
                  ) : (
                      <div className="bg-gray-50 border-2 border-dashed border-gray-200 rounded-xl p-6 text-center text-gray-400 text-sm">
                          No public projects displayed.
                      </div>
                  )}
              </div>

              {isSelf ? (
                  <div className="w-full py-4 text-center bg-gray-100 rounded-xl text-gray-500 font-bold">
                      This is your profile preview.
                  </div>
              ) : (
                  <Button onClick={() => handleStartChat(selectedMaker.id, selectedMaker.name)} className="w-full py-4 text-lg shadow-xl shadow-brand-green/20">
                    Start Conversation
                  </Button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Makers;