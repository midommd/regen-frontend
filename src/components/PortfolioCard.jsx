import React from 'react';
import { ExternalLink, Maximize2, PlayCircle } from 'lucide-react';

const PortfolioCard = ({ project }) => {
  const isLink = project.media_type === 'link';
  const imageUrl = project.image_path 
    ? `http://127.0.0.1:8000${project.image_path}` 
    : "https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=800&q=80"; 

  return (
    <div className="group relative w-full h-[400px] rounded-[2rem] overflow-hidden cursor-pointer">
      
      <img 
        src={imageUrl} 
        alt={project.title} 
        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
      />

      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent opacity-60 group-hover:opacity-80 transition-opacity duration-300"></div>

      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white/20 backdrop-blur-md p-4 rounded-full text-white opacity-0 group-hover:opacity-100 transform scale-50 group-hover:scale-100 transition-all duration-300 border border-white/30">
        {isLink ? <PlayCircle size={32} /> : <Maximize2 size={32} />}
      </div>

      <div className="absolute bottom-0 left-0 w-full p-8 translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
        {/* Category Tag */}
        <span className="inline-block px-3 py-1 mb-3 text-[10px] font-black tracking-widest uppercase text-black bg-brand-green rounded-full">
          {project.category}
        </span>

        <h3 className="text-2xl font-black text-white mb-2 leading-tight">{project.title}</h3>
        <p className="text-slate-300 text-sm font-medium line-clamp-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 delay-100">
          {project.description}
        </p>

        {isLink && (
          <div className="mt-4 flex items-center gap-2 text-brand-green text-xs font-bold uppercase tracking-wider opacity-0 group-hover:opacity-100 transition-opacity duration-300 delay-150">
            <ExternalLink size={14}/> Open Project
          </div>
        )}
      </div>
    </div>
  );
};

export default PortfolioCard;