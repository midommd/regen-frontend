import React from 'react';
import { Clock, CheckCircle, Hammer, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const ProjectCard = ({ project }) => {
  const getStatusStyle = (status) => {
    switch (status) {
      case 'completed': return { bg: 'bg-green-100', text: 'text-green-700', icon: CheckCircle };
      case 'hiring': return { bg: 'bg-blue-100', text: 'text-blue-700', icon: Hammer };
      default: return { bg: 'bg-yellow-100', text: 'text-yellow-700', icon: Clock };
    }
  };

  const style = getStatusStyle(project.status);
  const StatusIcon = style.icon;

  let aiData = {};
  try {
    aiData = typeof project.ai_suggestions === 'string' 
      ? JSON.parse(project.ai_suggestions) 
      : project.ai_suggestions;
  } catch (e) {
    aiData = { material: 'Unknown' };
  }

  return (
    <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden hover:shadow-xl transition-all group">
      {/* Image Section */}
      <div className="h-48 overflow-hidden relative">
        <img 
          src={project.image_url || project.image_path} 
          alt="Project" 
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <div className={`absolute top-3 right-3 px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1 ${style.bg} ${style.text}`}>
          <StatusIcon size={12} /> {project.status.toUpperCase()}
        </div>
      </div>

      {/* Content Section */}
      <div className="p-5">
        <h3 className="font-bold text-lg text-brand-dark mb-1">
          {aiData?.material || 'New Scan'}
        </h3>
        <p className="text-gray-500 text-sm mb-4">
          Created on {new Date(project.created_at).toLocaleDateString()}
        </p>

        <Link 
          to={`/project/${project.id}`} 
          className="inline-flex items-center text-sm font-bold text-brand-green hover:underline"
        >
          View Details <ArrowRight size={16} className="ml-1"/>
        </Link>
      </div>
      
<div className="flex gap-2 mt-4">
    {/* Only show if NOT already for sale */}
    {!project.is_for_sale && (
       <button 
         onClick={(e) => {
            e.preventDefault(); 
            onSellClick(project); 
         }}
         className="flex-1 bg-brand-dark text-white text-xs font-bold py-2 rounded-lg"
       >
         Sell This
       </button>
    )}
</div>
    </div>
  );
};

export default ProjectCard;