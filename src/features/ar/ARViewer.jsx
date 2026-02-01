import React from 'react';
import '@google/model-viewer';
import Button from '../../components/Button';
import { ArrowLeft, Smartphone } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const ARViewer = ({ modelUrl, onClose }) => {
  const navigate = useNavigate();

  const displayModel = modelUrl || "https://modelviewer.dev/shared-assets/models/Astronaut.glb";

  return (
    <div className="fixed inset-0 z-50 bg-black flex flex-col animate-fade-in">
      {/* AR Header */}
      <div className="absolute top-0 left-0 right-0 p-4 flex justify-between items-center z-10 bg-gradient-to-b from-black/50 to-transparent">
        <button onClick={onClose} className="text-white p-2 rounded-full bg-white/20 backdrop-blur">
          <ArrowLeft />
        </button>
        <span className="text-white font-bold bg-brand-green px-3 py-1 rounded-full text-sm">
          AR Preview Mode
        </span>
      </div>

      {/* The 3D Viewer */}
      <div className="flex-1 w-full h-full bg-gray-900">
        <model-viewer
          src={displayModel}
          ios-src="" 
          poster="https://via.placeholder.com/400x300.png?text=Loading+AR..."
          alt="A 3D model of the upcycled project"
          shadow-intensity="1"
          camera-controls
          auto-rotate
          ar
          ar-modes="webxr scene-viewer quick-look"
          style={{ width: '100%', height: '100%' }}
        >
          <button slot="ar-button" className="absolute bottom-8 left-1/2 -translate-x-1/2 bg-white text-black px-6 py-3 rounded-full font-bold shadow-lg flex items-center gap-2">
            <Smartphone size={20} /> View in your room
          </button>
        </model-viewer>
      </div>
    </div>
  );
};

export default ARViewer;