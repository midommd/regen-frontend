import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Facebook, Twitter, Instagram, Github, 
  Mail, ArrowRight, Heart, Leaf, Recycle 
} from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-brand-dark text-white relative overflow-hidden pt-20 pb-10">
      {/* 🎨 Background Glow Effect */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-brand-green/10 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-64 h-64 bg-blue-500/5 blur-[100px] rounded-full pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 mb-16">
          
          {/* --- BRAND SECTION --- */}
          <div className="lg:col-span-4 space-y-6">
            <Link to="/" className="flex items-center gap-2 group">
              <div className="bg-brand-green p-2 rounded-xl group-hover:rotate-12 transition-transform duration-300">
                <Recycle size={24} className="text-brand-dark" />
              </div>
              <span className="text-2xl font-black tracking-tighter italic">REGEN<span className="text-brand-green">AI</span></span>
            </Link>
            <p className="text-slate-400 text-sm leading-relaxed max-w-sm">
              Revolutionizing sustainability through AI-powered creation. We empower makers to turn waste into high-value treasures for a cleaner planet.
            </p>
            <div className="flex gap-4">
              {[Facebook, Twitter, Instagram, Github].map((Icon, i) => (
                <a key={i} href="#" className="p-2.5 bg-white/5 rounded-xl text-slate-400 hover:bg-brand-green hover:text-brand-dark transition-all duration-300 hover:-translate-y-1">
                  <Icon size={18} />
                </a>
              ))}
            </div>
          </div>

          {/* --- LINKS SECTIONS --- */}
          <div className="lg:col-span-4 grid grid-cols-2 gap-8">
            <div className="space-y-6">
              <h4 className="text-sm font-black uppercase tracking-widest text-brand-green">Platform</h4>
              <ul className="space-y-4">
                {['Marketplace', 'AI Maker', 'Success Stories', 'Community'].map((link) => (
                  <li key={link}>
                    <a href="#" className="text-slate-400 text-sm hover:text-white transition-colors flex items-center gap-2 group">
                      <span className="w-1.5 h-1.5 rounded-full bg-brand-green scale-0 group-hover:scale-100 transition-transform" />
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
            <div className="space-y-6">
              <h4 className="text-sm font-black uppercase tracking-widest text-brand-green">Support</h4>
              <ul className="space-y-4">
                {['About Us', 'Sustainability', 'Contact', 'Privacy Policy'].map((link) => (
                  <li key={link}>
                    <a href="#" className="text-slate-400 text-sm hover:text-white transition-colors flex items-center gap-2 group">
                      <span className="w-1.5 h-1.5 rounded-full bg-brand-green scale-0 group-hover:scale-100 transition-transform" />
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* --- NEWSLETTER SECTION --- */}
          <div className="lg:col-span-4 space-y-6">
            <h4 className="text-sm font-black uppercase tracking-widest text-brand-green">Stay Updated</h4>
            <p className="text-slate-400 text-sm">Join our newsletter to get weekly upcycling inspiration and platform updates.</p>
            <form className="relative group">
              <input 
                type="email" 
                placeholder="Enter your email" 
                className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 text-sm outline-none focus:ring-2 focus:ring-brand-green/50 focus:bg-white/10 transition-all placeholder:text-slate-500"
              />
              <button className="absolute right-2 top-2 bottom-2 bg-brand-green text-brand-dark px-4 rounded-xl font-bold flex items-center gap-2 hover:bg-white transition-colors group-hover:shadow-lg shadow-brand-green/20">
                <span>Join</span>
                <ArrowRight size={16} />
              </button>
            </form>
            <div className="flex items-center gap-3 text-[10px] text-slate-500 font-bold uppercase tracking-tighter bg-white/5 p-3 rounded-xl border border-white/5">
                <Leaf size={14} className="text-brand-green" />
                No spam, just green creation tips.
            </div>
          </div>
        </div>

        {/* --- BOTTOM BAR --- */}
        <div className="border-t border-white/5 pt-10 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-2 text-slate-500 text-xs font-medium">
            © 2026 REGENAI. INC. ALL RIGHTS RESERVED.
          </div>
          
          <div className="flex items-center gap-1.5 text-slate-400 text-sm font-bold bg-white/5 px-4 py-2 rounded-full border border-white/5 italic">
            Designed with <Heart size={14} className="text-red-500 fill-red-500 animate-pulse" /> for the Planet
          </div>

          <div className="flex gap-8 text-xs font-bold text-slate-500 uppercase tracking-widest">
            <a href="#" className="hover:text-brand-green transition-colors">Cookies</a>
            <a href="#" className="hover:text-brand-green transition-colors">Terms</a>
            <a href="#" className="hover:text-brand-green transition-colors">Security</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;