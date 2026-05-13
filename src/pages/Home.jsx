import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/useAuthStore'; 
import '@google/model-viewer'; // Import de model-viewer (remplace Three.js)
import { 
  Zap, ShieldCheck, Globe, ArrowRight, Camera, ShoppingBag, 
  Users, Recycle, Sparkles, TrendingUp, Hammer, Briefcase, ScanLine, Bot
} from 'lucide-react';
import Button from '../components/Button';

// --- MAIN HOME COMPONENT ---
const Home = () => {
  const navigate = useNavigate();
  const { user } = useAuthStore(); 

  const renderHeroAction = () => {
    if (!user) {
      return (
        <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
          <Button onClick={() => navigate('/register')} className="!px-10 !py-4 shadow-xl shadow-brand-green/20">
            Start Creating Free
          </Button>
          <Button variant="secondary" onClick={() => navigate('/marketplace')} className="!px-10 !py-4">
            Explore Shop
          </Button>
        </div>
      );
    }

    if (user.role === 'maker') {
      return (
        <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
          <Button onClick={() => navigate('/inbox')} className="!px-10 !py-4 shadow-xl shadow-blue-500/20 bg-blue-600 hover:bg-blue-700 text-white">
            <Briefcase className="mr-2" size={20}/> Browse Job Requests
          </Button>
          <Button variant="secondary" onClick={() => navigate('/portfolio/upload')} className="!px-10 !py-4">
            Update Portfolio
          </Button>
        </div>
      );
    }

    // Default User (Recycler)
    return (
      <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
        <Button onClick={() => navigate('/maker')} className="!px-10 !py-4 shadow-xl shadow-brand-green/20">
          <Camera className="mr-2" size={20}/> Scan Waste Object
        </Button>
        <Button variant="secondary" onClick={() => navigate('/makers')} className="!px-10 !py-4">
          Hire a Maker
        </Button>
      </div>
    );
  };

  return (
    <div className="animate-fade-in overflow-x-hidden">
      {/* Inline styles for the custom bot animation */}
      <style>{`
        @keyframes botTrailMove {
          0% { transform: translate(30vw, 150px) scale(0.6) rotate(15deg); opacity: 0; }
          20% { opacity: 1; }
          50% { transform: translate(0vw, -30px) scale(1.1) rotate(-10deg); }
          80% { opacity: 1; }
          100% { transform: translate(-40vw, 100px) scale(0.6) rotate(-25deg); opacity: 0; }
        }
        .animate-bot-1 { animation: botTrailMove 10s ease-in-out infinite; }
        .animate-bot-2 { animation: botTrailMove 10s ease-in-out 3.3s infinite; }
        .animate-bot-3 { animation: botTrailMove 10s ease-in-out 6.6s infinite; }
      `}</style>

      {/* --- 1. HERO SECTION --- */}
      <section className="relative min-h-[90vh] flex items-center bg-slate-50 pt-20 pb-20 overflow-hidden">
        <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-brand-light-green/40 rounded-full blur-3xl -translate-y-1/2 translate-x-1/4 animate-pulse-slow"></div>
        <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-blue-100/50 rounded-full blur-3xl translate-y-1/3 -translate-x-1/4 animate-pulse-slow delay-1000"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col lg:flex-row items-center gap-16 relative z-10">
          
          <div className="flex-1 text-center lg:text-left">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white border border-green-100 text-[--color-brand-green] text-xs font-black uppercase tracking-widest mb-8 shadow-sm animate-slide-in-left">
              <Sparkles size={14}/> The Future of Upcycling
            </div>
            
            <h1 className="text-6xl lg:text-8xl font-black text-[--color-brand-dark] leading-[1.05] mb-8 tracking-tight">
              Don't Toss It.<br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[--color-brand-green] to-teal-500">Reimagine It.</span>
            </h1>
            
            <p className="text-xl text-slate-500 mb-12 max-w-xl mx-auto lg:mx-0 font-medium leading-relaxed">
              RegenAI uses advanced Computer Vision to analyze your waste and generate professional upcycling blueprints in seconds.
            </p>
            
            {renderHeroAction()}

            <div className="mt-12 flex items-center justify-center lg:justify-start gap-8 opacity-60 grayscale hover:grayscale-0 transition-all duration-500">
               <p className="text-xs font-bold uppercase tracking-widest text-slate-400">Trusted By</p>
               <div className="flex gap-6">
                 <span className="font-black text-slate-800">ECO<span className="text-green-500">LAB</span></span>
                 <span className="font-black text-slate-800">GREEN<span className="text-blue-500">TECH</span></span>
                 <span className="font-black text-slate-800">RE<span className="text-slate-400">USE</span></span>
               </div>
            </div>
          </div>

          <div className="flex-1 w-full max-w-2xl relative perspective-1000 group">
            <div className="relative rounded-[2.5rem] bg-white shadow-2xl shadow-green-900/10 border border-white/50 p-6 rotate-y-12 rotate-x-6 group-hover:rotate-0 transition-transform duration-700 ease-out">
              
              <div className="flex items-center justify-between mb-6 px-2">
                 <div className="flex gap-2">
                    <div className="w-3 h-3 rounded-full bg-red-400"></div>
                    <div className="w-3 h-3 rounded-full bg-yellow-400"></div>
                    <div className="w-3 h-3 rounded-full bg-green-400"></div>
                 </div>
                 <div className="text-xs font-bold text-slate-300 uppercase tracking-widest">Scanning...</div>
              </div>

              <div className="rounded-3xl overflow-hidden aspect-square bg-slate-900 relative">
                 <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1591871937573-7b3167763c8f?auto=format&fit=crop&w=800&q=80')] bg-cover bg-center opacity-80"></div>
                 <div className="absolute top-0 left-0 w-full h-1 bg-green-400 shadow-[0_0_20px_rgba(74,222,128,0.8)] animate-scan-down"></div>
                 
                 <div className="absolute bottom-6 left-6 flex flex-col gap-2">
                    <div className="bg-black/60 backdrop-blur-md text-white px-4 py-2 rounded-xl text-sm font-bold flex items-center gap-2 animate-fade-in-up">
                       <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                       Denim Fabric (95%)
                    </div>
                    <div className="bg-black/60 backdrop-blur-md text-white px-4 py-2 rounded-xl text-sm font-bold flex items-center gap-2 animate-fade-in-up delay-200">
                       <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse"></div>
                       Potential: Backpack
                    </div>
                 </div>
              </div>
            </div>

            <div className="absolute -top-10 -right-10 bg-white p-6 rounded-3xl shadow-xl animate-bounce-slow">
                <div className="text-4xl font-black text-brand-green mb-1">2.5kg</div>
                <div className="text-xs font-bold text-slate-400 uppercase">CO2 Saved</div>
            </div>
            
            <div className="absolute -bottom-10 -left-10 bg-white p-6 rounded-3xl shadow-xl animate-bounce-slow delay-500">
                <div className="flex -space-x-4">
                    {[1,2,3].map(i => (
                        <div key={i} className="w-10 h-10 rounded-full border-2 border-white bg-slate-200 overflow-hidden">
                            <img src={`https://i.pravatar.cc/100?img=${i+10}`} alt="user"/>
                        </div>
                    ))}
                </div>
                <div className="text-xs font-bold text-slate-400 uppercase mt-2">Makers Ready</div>
            </div>
          </div>
        </div>
      </section>

      {/* --- 2. REFINED BENTO GRID --- */}
      <section className="py-32 max-w-7xl mx-auto px-4">
        <div className="text-center mb-20">
          <h2 className="text-5xl font-black text-slate-900 mb-6">The Cycle of <span className="text-brand-green">Rebirth</span></h2>
          <p className="text-lg text-slate-500 max-w-2xl mx-auto font-medium">Three simple steps to transform everyday waste into extraordinary, functional art using the power of AI.</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 auto-rows-[320px]">
           {/* Card 1 */}
           <div className="md:col-span-2 bg-slate-900 rounded-[3rem] p-12 relative overflow-hidden group hover:shadow-2xl hover:shadow-slate-900/20 transition-all duration-500">
              <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-brand-green/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3 group-hover:bg-brand-green/30 transition-colors duration-700"></div>
              <div className="relative z-10 h-full flex flex-col justify-between">
                 <div className="bg-white/10 w-16 h-16 rounded-2xl flex items-center justify-center backdrop-blur-md text-brand-green border border-white/10 group-hover:scale-110 transition-transform duration-500">
                    <ScanLine size={32}/>
                 </div>
                 <div>
                    <h3 className="text-4xl font-bold text-white mb-4">AI-Powered Vision</h3>
                    <p className="text-slate-400 text-lg max-w-md leading-relaxed">Our specialized neural network maps 50+ types of recyclable materials instantly from a single smartphone photo.</p>
                 </div>
              </div>
           </div>

           {/* Card 2 */}
           <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-[3rem] p-12 relative overflow-hidden group border border-green-100 hover:shadow-xl hover:shadow-green-100/50 transition-all duration-500">
              <div className="absolute -bottom-10 -right-10 opacity-5 group-hover:opacity-20 group-hover:scale-110 transition-all duration-500">
                 <Zap size={200} className="text-brand-green"/>
              </div>
              <div className="relative z-10 h-full flex flex-col justify-between">
                 <div className="bg-white w-16 h-16 rounded-2xl flex items-center justify-center shadow-md text-brand-green group-hover:-translate-y-2 transition-transform duration-500">
                    <Hammer size={32}/>
                 </div>
                 <div>
                    <h3 className="text-3xl font-bold text-slate-800 mb-3">Instant Blueprints</h3>
                    <p className="text-slate-600 font-medium">Get fully procedural 3D construction guides tailored to your exact object.</p>
                 </div>
              </div>
           </div>

           {/* Card 3 */}
           <div className="bg-white rounded-[3rem] p-12 relative overflow-hidden group border border-slate-200 shadow-lg hover:shadow-2xl transition-all duration-500">
              <div className="relative z-10 h-full flex flex-col justify-between">
                 <div className="bg-orange-50 w-16 h-16 rounded-2xl flex items-center justify-center text-orange-500 group-hover:rotate-12 transition-transform duration-500">
                    <ShoppingBag size={32}/>
                 </div>
                 <div>
                    <h3 className="text-3xl font-bold text-slate-800 mb-3">Global Market</h3>
                    <p className="text-slate-600 font-medium">Mint your creations as NFTs and sell them to a global audience of eco-conscious buyers.</p>
                 </div>
              </div>
           </div>

           {/* Card 4 */}
           <div className="md:col-span-2 bg-gradient-to-r from-brand-green to-teal-600 rounded-[3rem] p-12 relative overflow-hidden group text-white hover:shadow-2xl hover:shadow-teal-600/30 transition-all duration-500">
              <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10 mix-blend-overlay"></div>
              <div className="relative z-10 h-full flex flex-col justify-between">
                 <div className="bg-white/20 w-16 h-16 rounded-2xl flex items-center justify-center backdrop-blur-md border border-white/20">
                    <Users size={32}/>
                 </div>
                 <div className="flex flex-col sm:flex-row sm:justify-between sm:items-end gap-6">
                    <div>
                        <h3 className="text-4xl font-bold mb-3">The Maker Network</h3>
                        <p className="text-teal-50 text-lg max-w-md">Don't want to build it yourself? Connect with 5,000+ certified local artisans ready to craft it for you.</p>
                    </div>
                    <Button onClick={() => navigate('/makers')} className="bg-white !text-slate-900 hover:bg-slate-50 shadow-xl !px-8 !py-4 whitespace-nowrap">
                       Find a Maker
                    </Button>
                 </div>
              </div>
           </div>
        </div>
      </section>

      {/* --- 3. AI PROCESSING (MODEL-VIEWER) WITH MOVING BOTS --- */}
      <section className="py-32 bg-slate-900 relative overflow-hidden border-y border-slate-800">
        <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-brand-green/50 to-transparent"></div>
        
        {/* Animated Bots Overlay Container */}
        <div className="absolute inset-0 z-20 pointer-events-none overflow-hidden flex items-center justify-center">
            {/* Bot 1 */}
            <div className="absolute animate-bot-1">
                <div className="bg-slate-800/80 backdrop-blur-sm p-4 rounded-full border border-brand-green shadow-[0_0_30px_rgba(74,222,128,0.4)] text-brand-green">
                    <Bot size={36} />
                </div>
            </div>
            {/* Bot 2 */}
            <div className="absolute animate-bot-2 opacity-70">
                <div className="bg-slate-800/80 backdrop-blur-sm p-3 rounded-full border border-teal-400 shadow-[0_0_20px_rgba(45,212,191,0.4)] text-teal-400">
                    <Bot size={28} />
                </div>
            </div>
            {/* Bot 3 */}
            <div className="absolute animate-bot-3 opacity-50">
                <div className="bg-slate-800/80 backdrop-blur-sm p-2 rounded-full border border-green-300 shadow-[0_0_15px_rgba(134,239,172,0.4)] text-green-300">
                    <Bot size={20} />
                </div>
            </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 flex flex-col lg:flex-row items-center gap-16 relative z-10">
          
          <div className="flex-1 lg:pr-12 text-center lg:text-left">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-slate-800 border border-slate-700 text-brand-green text-xs font-bold uppercase tracking-widest mb-6">
              <Zap size={14} className="animate-pulse"/> Live AI Processing
            </div>
            <h2 className="text-4xl lg:text-6xl font-black text-white mb-6 leading-tight">
              Deconstruct.<br/>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-green to-teal-400">Reconstruct.</span>
            </h2>
            <p className="text-lg text-slate-400 mb-8 leading-relaxed">
              Watch as our proprietary neural engine breaks down physical objects into structural point clouds. By analyzing material density and structural integrity, RegenAI maps entirely new possibilities in real-time.
            </p>
            <div className="flex items-center justify-center lg:justify-start gap-4 text-slate-300 font-medium">
              <div className="flex items-center gap-2">
                <ShieldCheck className="text-brand-green" size={20}/> Material Analysis
              </div>
              <div className="w-1 h-1 bg-slate-600 rounded-full"></div>
              <div className="flex items-center gap-2">
                <Recycle className="text-brand-green" size={20}/> Form Generation
              </div>
            </div>
          </div>

          {/* Model Viewer Canvas Container */}
          <div className="flex-1 w-full relative z-30">
            <div className="absolute inset-0 bg-gradient-to-tr from-brand-green/20 to-transparent rounded-full blur-[100px] pointer-events-none"></div>
            <div className="relative bg-slate-800/50 backdrop-blur-xl border border-slate-700 rounded-[3rem] overflow-hidden shadow-2xl shadow-black/50 aspect-square lg:aspect-auto lg:h-[500px]">
               
               {/* 3D ROBOT GLB COMPONENT */}
               <model-viewer
                 src="/robot.glb"
                 alt="RegenAI 3D Robot"
                 auto-rotate="true"
                 rotation-per-second="30deg"
                 camera-controls="true"
                 disable-zoom="true"
                 shadow-intensity="1"
                 exposure="1"
                 environment-image="neutral"
                 style={{ width: '100%', height: '100%', backgroundColor: 'transparent', outline: 'none' }}
               ></model-viewer>
               
               {/* UI Overlay on top of 3D Canvas */}
               <div className="absolute bottom-6 left-6 right-6 flex justify-between items-end pointer-events-none">
                 <div className="bg-slate-900/80 backdrop-blur p-4 rounded-2xl border border-slate-700">
                    <p className="text-brand-green text-xs font-mono mb-1">STATUS</p>
                    <p className="text-white font-bold tracking-wider">MAPPING TOPOLOGY</p>
                 </div>
                 <div className="flex flex-col items-end gap-2">
                    <div className="h-1 w-24 bg-slate-700 rounded-full overflow-hidden">
                       <div className="h-full bg-brand-green w-3/4 animate-pulse"></div>
                    </div>
                    <p className="text-slate-400 text-xs font-mono">74% COMPLETE</p>
                 </div>
               </div>
            </div>
          </div>

        </div>
      </section>

      {/* --- 4. CTA SECTION --- */}
      <section className="px-4 py-32 bg-slate-50">
        <div className="max-w-6xl mx-auto bg-brand-green rounded-[3rem] p-12 lg:p-24 relative overflow-hidden text-center shadow-2xl shadow-brand-green/20">
          <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/noisy-grid.png')] opacity-20 mix-blend-overlay"></div>
          
          <div className="relative z-10">
            <h2 className="text-5xl lg:text-7xl font-black text-slate-900 mb-8 tracking-tight">
              Ready to make an <br/>impact?
            </h2>
            <p className="text-slate-800 mb-12 text-xl max-w-2xl mx-auto font-medium leading-relaxed">
              Join the revolution. Whether you're scanning plastic bottles to clean your home, or crafting luxury furniture to build your business, your journey starts here.
            </p>
            
            <div className="flex justify-center">
                {user ? (
                    <Button onClick={() => navigate(user.role === 'maker' ? '/inbox' : '/maker')} className="bg-slate-900 !text-white hover:bg-slate-800 text-lg !py-5 !px-12 shadow-2xl rounded-full transition-transform hover:scale-105">
                        {user.role === 'maker' ? 'View Requests' : 'Start Scanning'} <ArrowRight className="ml-2"/>
                    </Button>
                ) : (
                    <Button onClick={() => navigate('/register')} className="bg-slate-900 !text-white hover:bg-slate-800 text-lg !py-5 !px-12 shadow-2xl rounded-full transition-transform hover:scale-105">
                        Join RegenAI Free <ArrowRight className="ml-2"/>
                    </Button>
                )}
            </div>
          </div>
          
          <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-white/20 rounded-full blur-3xl -mr-32 -mt-32 animate-pulse-slow"></div>
          <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-teal-400/20 rounded-full blur-3xl -ml-32 -mb-32 animate-pulse-slow delay-1000"></div>
        </div>
      </section>
    </div>
  );
};

export default Home;