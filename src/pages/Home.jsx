import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/useAuthStore'; 
import { 
  Zap, ShieldCheck, Globe, ArrowRight, Camera, ShoppingBag, 
  Users, Recycle, Sparkles, TrendingUp, Hammer 
} from 'lucide-react';
import Button from '../components/Button';

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
      
      {/* --- 1. HERO SECTION (Immersive) --- */}
      <section className="relative min-h-[90vh] flex items-center bg-slate-50 pt-20 pb-20 overflow-hidden">
        
        {/* Animated Background Blobs */}
        <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-brand-light-green/40 rounded-full blur-3xl -translate-y-1/2 translate-x-1/4 animate-pulse-slow"></div>
        <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-blue-100/50 rounded-full blur-3xl translate-y-1/3 -translate-x-1/4 animate-pulse-slow delay-1000"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col lg:flex-row items-center gap-16 relative z-10">
          
          {/* LEFT: Copy */}
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

          {/* RIGHT: 3D/UI Graphic */}
          <div className="flex-1 w-full max-w-2xl relative perspective-1000 group">
            {/* Main Floating Card */}
            <div className="relative rounded-[2.5rem] bg-white shadow-2xl shadow-green-900/10 border border-white/50 p-6 rotate-y-12 rotate-x-6 group-hover:rotate-0 transition-transform duration-700 ease-out">
              
              {/* Simulated App Header */}
              <div className="flex items-center justify-between mb-6 px-2">
                 <div className="flex gap-2">
                    <div className="w-3 h-3 rounded-full bg-red-400"></div>
                    <div className="w-3 h-3 rounded-full bg-yellow-400"></div>
                    <div className="w-3 h-3 rounded-full bg-green-400"></div>
                 </div>
                 <div className="text-xs font-bold text-slate-300 uppercase tracking-widest">Scanning...</div>
              </div>

              {/* Scan Window */}
              <div className="rounded-3xl overflow-hidden aspect-square bg-slate-900 relative">
                 <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1591871937573-7b3167763c8f?auto=format&fit=crop&w=800&q=80')] bg-cover bg-center opacity-80"></div>
                 
                 {/* Scanning Overlay Animation */}
                 <div className="absolute top-0 left-0 w-full h-1 bg-green-400 shadow-[0_0_20px_rgba(74,222,128,0.8)] animate-scan-down"></div>
                 
                 {/* Detected Tags */}
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

            {/* Floating Elements */}
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

      {/* --- 2. BENTO GRID FEATURES --- */}
      <section className="py-24 max-w-7xl mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-black text-slate-800 mb-4">The Cycle of <span className="text-brand-green">Rebirth</span></h2>
          <p className="text-slate-500 max-w-2xl mx-auto">From trash to treasure in three simple steps.</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 auto-rows-[300px]">
           {/* Card 1 */}
           <div className="md:col-span-2 bg-slate-900 rounded-[2.5rem] p-10 relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-blue-600/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 group-hover:bg-blue-600/30 transition-colors"></div>
              <div className="relative z-10 h-full flex flex-col justify-between">
                 <div className="bg-white/10 w-14 h-14 rounded-2xl flex items-center justify-center backdrop-blur-md text-white border border-white/10">
                    <Camera size={28}/>
                 </div>
                 <div>
                    <h3 className="text-3xl font-bold text-white mb-2">AI-Powered Vision</h3>
                    <p className="text-slate-400 max-w-md">Our specialized neural network identifies 50+ types of recyclable materials instantly from a single photo.</p>
                 </div>
              </div>
           </div>

           {/* Card 2 */}
           <div className="bg-green-50 rounded-[2.5rem] p-10 relative overflow-hidden group border border-green-100">
              <div className="absolute bottom-0 right-0 opacity-10 group-hover:opacity-20 transition-opacity">
                 <Zap size={150} className="text-brand-green translate-x-10 translate-y-10"/>
              </div>
              <div className="relative z-10 h-full flex flex-col justify-between">
                 <div className="bg-white w-14 h-14 rounded-2xl flex items-center justify-center shadow-sm text-brand-green">
                    <Zap size={28}/>
                 </div>
                 <div>
                    <h3 className="text-2xl font-bold text-slate-800 mb-2">Instant Blueprints</h3>
                    <p className="text-slate-500 text-sm">Get 3D procedural guides tailored to the object.</p>
                 </div>
              </div>
           </div>

           {/* Card 3 */}
           <div className="bg-white rounded-[2.5rem] p-10 relative overflow-hidden group border border-slate-100 shadow-xl">
              <div className="relative z-10 h-full flex flex-col justify-between">
                 <div className="bg-orange-50 w-14 h-14 rounded-2xl flex items-center justify-center text-orange-500">
                    <ShoppingBag size={28}/>
                 </div>
                 <div>
                    <h3 className="text-2xl font-bold text-slate-800 mb-2">Marketplace</h3>
                    <p className="text-slate-500 text-sm">Sell your creations to a global audience of eco-conscious buyers.</p>
                 </div>
              </div>
           </div>

           {/* Card 4 */}
           <div className="md:col-span-2 bg-gradient-to-br from-brand-green to-teal-600 rounded-[2.5rem] p-10 relative overflow-hidden group text-white">
              <div className="relative z-10 h-full flex flex-col justify-between">
                 <div className="bg-white/20 w-14 h-14 rounded-2xl flex items-center justify-center backdrop-blur-md border border-white/20">
                    <Users size={28}/>
                 </div>
                 <div className="flex justify-between items-end">
                    <div>
                        <h3 className="text-3xl font-bold mb-2">Maker Community</h3>
                        <p className="text-green-100 max-w-md">Join 5,000+ creators turning the planet greener, one scan at a time.</p>
                    </div>
                    <Button onClick={() => navigate('/makers')} className="bg-white !text-brand-dark hover:bg-green-50 shadow-lg">Find Makers</Button>
                 </div>
              </div>
           </div>
        </div>
      </section>

      {/* --- 3. LIVE ACTIVITY FEED (Simulated) --- */}
      <section className="py-20 bg-slate-50 border-y border-slate-200 overflow-hidden">
         <div className="max-w-7xl mx-auto px-4 mb-10 flex justify-between items-end">
            <h2 className="text-2xl font-bold text-slate-800">Live Transformations</h2>
            <div className="flex items-center gap-2 text-green-600 text-sm font-bold animate-pulse">
                <div className="w-2 h-2 bg-green-600 rounded-full"></div> Live Feed
            </div>
         </div>
         
         <div className="flex gap-6 animate-scroll-x hover:pause-scroll w-max px-4">
            {[1,2,3,4,5,6].map((i) => (
                <div key={i} className="w-72 bg-white p-4 rounded-3xl shadow-sm border border-slate-100 flex items-center gap-4">
                    <div className="w-16 h-16 rounded-xl bg-slate-200 overflow-hidden">
                        <img src={`https://source.unsplash.com/random/200x200?recycle&sig=${i}`} className="w-full h-full object-cover"/>
                    </div>
                    <div>
                        <p className="text-xs text-slate-400 font-bold uppercase mb-1">Just Created</p>
                        <h4 className="font-bold text-slate-800 text-sm">Eco Lamp #{i+20}</h4>
                        <p className="text-xs text-brand-green font-bold">Sold for ${20 + i*5}</p>
                    </div>
                </div>
            ))}
         </div>
      </section>

      {/* --- 4. CTA SECTION --- */}
      <section className="px-4 py-24">
        <div className="max-w-7xl mx-auto bg-slate-900 rounded-[3rem] p-12 lg:p-24 relative overflow-hidden text-center shadow-2xl shadow-slate-900/30">
          <div className="relative z-10">
            <h2 className="text-5xl lg:text-7xl font-black text-white mb-8 tracking-tight">Ready to make an <br/><span className="text-brand-green">impact?</span></h2>
            <p className="text-slate-400 mb-12 text-xl max-w-2xl mx-auto leading-relaxed">
              Join the revolution. Whether you're scanning plastic bottles or crafting luxury furniture, your journey starts here.
            </p>
            
            {/* Reuse logic for Bottom CTA */}
            <div className="flex justify-center">
                {user ? (
                    <Button onClick={() => navigate(user.role === 'maker' ? '/inbox' : '/maker')} className="bg-white !text-slate-900 hover:bg-gray-100 text-lg py-5 px-10 shadow-2xl">
                        {user.role === 'maker' ? 'View Requests' : 'Start Scanning'} <ArrowRight className="ml-2"/>
                    </Button>
                ) : (
                    <Button onClick={() => navigate('/register')} className="bg-white !text-slate-900 hover:bg-gray-100 text-lg py-5 px-10 shadow-2xl">
                        Join Now <ArrowRight className="ml-2"/>
                    </Button>
                )}
            </div>
          </div>
          
          {/* Decorative background circle */}
          <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-brand-green/10 rounded-full blur-3xl -mr-32 -mt-32 animate-pulse-slow"></div>
          <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-blue-600/10 rounded-full blur-3xl -ml-32 -mb-32 animate-pulse-slow delay-1000"></div>
        </div>
      </section>
    </div>
  );
};

import { Briefcase } from 'lucide-react'; 

export default Home;