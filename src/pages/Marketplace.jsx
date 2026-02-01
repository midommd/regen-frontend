import React, { useState, useEffect } from 'react';
import axios from 'axios';
import config from '../services/apiConfig';
import { useNavigate } from 'react-router-dom';
import { ShoppingBag, MessageCircle, Search, Filter, Sparkles, Tag, User, ArrowUpRight } from 'lucide-react';
import { useAuthStore } from '../store/useAuthStore'; 
import { chatService } from '../features/chat/chatService'; 

const Marketplace = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('All');
  
  const navigate = useNavigate();
  const { user } = useAuthStore(); 

  const getAvatarUrl = (path) => {
      if (!path) return null;
      if (path.startsWith('http')) return path;
      return `http://127.0.0.1:8000${path}`;
  };

  useEffect(() => {
    const fetchMarket = async () => {
      try {
        const response = await axios.get(`${config.API_URL}/marketplace`);
        setItems(response.data);
      } catch (error) {
        console.error("Error loading market", error);
      } finally {
        setLoading(false);
      }
    };
    fetchMarket();
  }, []);

  const handleContactSeller = async (sellerId, itemTitle) => {
    if (!user) {
      alert("Please login to contact seller");
      navigate('/login');
      return;
    }

    try {
        const conversation = await chatService.startChat(sellerId);
        
        navigate('/inbox', { 
            state: { 
                openChatId: conversation.id,
                newConversationData: conversation 
            } 
        });
    } catch (error) {
        console.error("Chat Error:", error);
        alert("Could not start chat. Please try again.");
    }
  };

  const filteredItems = items.filter(item => {
      const title = item.title || ""; 
      const desc = item.description || "";
      
      const matchesSearch = title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                            desc.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesCategory = filterCategory === 'All' || item.category === filterCategory;
      
      return matchesSearch && matchesCategory;
  });

  const categories = ['All', 'Furniture', 'Fashion', 'Art', 'Tech', 'Home'];

  return (
    <div className="min-h-screen bg-slate-50 pt-28 pb-20 font-sans">
      
      {/* --- HERO SECTION --- */}
      <div className="max-w-7xl mx-auto px-4 mb-16 text-center relative">
          <div className="inline-flex items-center gap-2 bg-white border border-slate-200 text-slate-600 px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider mb-6 animate-fade-in shadow-sm">
              <Sparkles size={14} className="text-brand-green"/> Community Market
          </div>
          
          <h1 className="text-5xl md:text-7xl font-black text-slate-900 mb-6 tracking-tight animate-slide-up">
            Regen <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-green to-teal-400">Market</span>
          </h1>
          
          <p className="text-xl text-slate-500 max-w-2xl mx-auto mb-10 leading-relaxed animate-slide-up" style={{animationDelay: '100ms'}}>
             Discover one-of-a-kind upcycled treasures. Support local makers and shop sustainably.
          </p>

          {/* --- FLOATING SEARCH BAR --- */}
          <div className="bg-white p-3 rounded-[2rem] shadow-xl shadow-slate-200/50 max-w-3xl mx-auto flex flex-col md:flex-row gap-3 border border-slate-100 animate-slide-up relative z-20" style={{animationDelay: '200ms'}}>
              <div className="flex-1 relative group">
                  <div className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-brand-green transition-colors">
                      <Search size={22}/>
                  </div>
                  <input 
                    type="text" 
                    placeholder="Search 'Denim Bag', 'Table'..." 
                    className="w-full h-14 pl-14 pr-6 rounded-3xl bg-slate-50 border-transparent focus:bg-white focus:ring-2 focus:ring-brand-green/20 focus:border-brand-green transition-all font-medium text-slate-700 placeholder:text-slate-400 text-lg outline-none"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
              </div>

              <div className="flex items-center gap-2 overflow-x-auto pb-2 md:pb-0 no-scrollbar px-2">
                  {categories.map(cat => (
                      <button 
                        key={cat}
                        onClick={() => setFilterCategory(cat)}
                        className={`px-5 py-3 rounded-2xl font-bold text-sm whitespace-nowrap transition-all ${
                            filterCategory === cat 
                            ? 'bg-brand-dark text-white shadow-lg transform scale-105' 
                            : 'bg-white text-slate-500 hover:bg-slate-50 border border-transparent hover:border-slate-200'
                        }`}
                      >
                          {cat}
                      </button>
                  ))}
              </div>
          </div>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-3/4 h-32 bg-brand-green/20 blur-[100px] -z-10 rounded-full opacity-50 pointer-events-none"></div>
      </div>

      {/* --- MARKET GRID --- */}
      <div className="max-w-7xl mx-auto px-4">
        {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-8">
                {[1,2,3,4].map(i => <div key={i} className="h-96 bg-white rounded-[2.5rem] shadow-sm animate-pulse"></div>)}
            </div>
        ) : filteredItems.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-8 pb-20">
                {filteredItems.map((item, index) => {
                    const isOwner = user?.id === item.user.id;

                    return (
                        <div 
                            key={item.id} 
                            className="group bg-white rounded-[2rem] p-3 shadow-lg shadow-slate-100 hover:shadow-2xl hover:shadow-brand-green/10 hover:-translate-y-2 transition-all duration-500 flex flex-col relative"
                            style={{ animationDelay: `${index * 50}ms` }}
                        >
                            {/* IMAGE CARD */}
                            <div className="h-64 rounded-[1.5rem] overflow-hidden relative bg-slate-100 isolate">
                                <img 
                                    src={item.image_url} 
                                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" 
                                    alt={item.title}
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-60"></div>
                                <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-md px-3 py-1.5 rounded-full font-black text-slate-900 shadow-sm flex items-center gap-1 text-sm z-10">
                                    <Tag size={12} className="text-brand-green"/> ${item.price}
                                </div>
                                <div className="absolute top-3 left-3 bg-black/40 backdrop-blur-md text-white px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border border-white/10">
                                    {item.category || "Item"}
                                </div>
                            </div>

                            {/* CONTENT */}
                            <div className="pt-5 px-2 pb-2 flex flex-col flex-1">
                                <div className="flex justify-between items-start mb-2">
                                    <h3 className="font-bold text-lg text-slate-800 leading-tight group-hover:text-brand-green transition-colors line-clamp-1">
                                        {item.title || "Untitled"}
                                    </h3>
                                    <ArrowUpRight size={18} className="text-slate-300 group-hover:text-brand-green transition-colors"/>
                                </div>
                                
                                <p className="text-slate-500 text-sm mb-6 line-clamp-2 leading-relaxed h-10">
                                    {item.description || "No description provided."}
                                </p>
                                
                                {/* FOOTER */}
                                <div className="mt-auto flex items-center justify-between border-t border-slate-50 pt-4">
                                    {/* Maker */}
                                    <div className="flex items-center gap-2.5">
                                        <div className="w-9 h-9 rounded-full bg-slate-100 p-0.5 border border-slate-100 shadow-sm">
                                            {item.user.avatar ? (
                                                <img src={getAvatarUrl(item.user.avatar)} className="w-full h-full rounded-full object-cover"/>
                                            ) : (
                                                <div className="w-full h-full rounded-full bg-white flex items-center justify-center text-slate-400"><User size={14}/></div>
                                            )}
                                        </div>
                                        <div className="flex flex-col">
                                            <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Maker</span>
                                            <span className="text-xs font-bold text-slate-700 truncate max-w-[80px]">{item.user.name}</span>
                                        </div>
                                    </div>

                                    {/* Action Button */}
                                    {isOwner ? (
                                        <div className="bg-slate-100 text-slate-400 px-3 py-2 rounded-xl text-[10px] font-bold uppercase tracking-wider border border-slate-200 select-none">
                                            You Own This
                                        </div>
                                    ) : (
                                        <button 
                                            onClick={() => handleContactSeller(item.user.id, item.title)}
                                            className="bg-brand-dark text-white w-10 h-10 rounded-full flex items-center justify-center shadow-lg shadow-brand-dark/20 hover:bg-brand-green hover:scale-110 transition-all duration-300"
                                            title="Chat to Buy"
                                        >
                                            <MessageCircle size={18}/>
                                        </button>
                                    )}
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
        ) : (
            <div className="text-center py-32 bg-white rounded-[3rem] border-2 border-dashed border-slate-200">
                <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-6 text-slate-300">
                   <ShoppingBag size={32}/>
                </div>
                <h3 className="text-2xl font-bold text-slate-700 mb-2">No results found</h3>
                <p className="text-slate-400 mb-6">We couldn't find any items matching "{searchTerm}".</p>
                <button onClick={() => {setSearchTerm(''); setFilterCategory('All');}} className="text-brand-green font-bold hover:underline">
                    Clear Filters
                </button>
            </div>
        )}
      </div>
    </div>
  );
};

export default Marketplace;