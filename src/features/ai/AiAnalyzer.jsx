import React, { useState, useRef } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Camera, Hammer, Box, Loader, Sparkles, X, UserCheck, ArrowRight, RotateCcw, Save, Circle } from 'lucide-react';
import '@google/model-viewer';
import { generateProceduralModel } from '../../utils/GeometryGenerator';

const PROTOTYPES = {
    chair: "https://modelviewer.dev/shared-assets/models/SheenChair.glb",
    bag: "https://modelviewer.dev/shared-assets/models/MaterialsVariantsShoe.glb",
    lamp: "https://modelviewer.dev/shared-assets/models/IridescenceLamp.glb",
    table: "https://modelviewer.dev/shared-assets/models/Mixer.glb",
    toy: "https://modelviewer.dev/shared-assets/models/RobotExpressive.glb",
    planter: "https://modelviewer.dev/shared-assets/models/WaterBottle.glb",
    shelf: "https://modelviewer.dev/shared-assets/models/NeilArmstrong.glb",
    organizer: "https://modelviewer.dev/shared-assets/models/Drill.glb",
    shoe: "https://modelviewer.dev/shared-assets/models/MaterialsVariantsShoe.glb",
    default: "https://modelviewer.dev/shared-assets/models/Astronaut.glb"
};

const AiAnalyzer = () => {
  const navigate = useNavigate();
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [result, setResult] = useState(null);
  const [errorMsg, setErrorMsg] = useState('');
  
  const [generatedModelUrl, setGeneratedModelUrl] = useState(null);

  const [showAR, setShowAR] = useState(false);
  const [showDIY, setShowDIY] = useState(false);

  const [isWebcamOpen, setIsWebcamOpen] = useState(false);
  const videoRef = useRef(null);
  const canvasRef = useRef(null);

  const startCamera = async () => {
    setIsWebcamOpen(true);
    setPreview(null);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: "environment" },
        audio: false 
      });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (err) {
      console.error("Camera Error:", err);
      setErrorMsg("Camera access denied.");
      setIsWebcamOpen(false);
    }
  };

  const stopCamera = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const tracks = videoRef.current.srcObject.getTracks();
      tracks.forEach(track => track.stop());
    }
    setIsWebcamOpen(false);
  };

  const capturePhoto = () => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    if (video && canvas) {
      const context = canvas.getContext('2d');
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      context.drawImage(video, 0, 0, canvas.width, canvas.height);
      
      canvas.toBlob((blob) => {
        const file = new File([blob], "captured_waste.jpg", { type: "image/jpeg" });
        setImage(file);
        setPreview(canvas.toDataURL('image/jpeg'));
        stopCamera();
      }, 'image/jpeg');
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      setPreview(URL.createObjectURL(file));
      setResult(null);
      setGeneratedModelUrl(null);
      setErrorMsg('');
      setIsWebcamOpen(false);
    }
  };

  const clearSelection = () => {
    stopCamera();
    setImage(null);
    setPreview(null);
    setResult(null);
    setGeneratedModelUrl(null);
  };

  const retryAnalysis = () => {
      setResult(null);
      setGeneratedModelUrl(null);
      analyzeImage();
  };

  const analyzeImage = async () => {
    if (!image) return;
    setLoading(true);
    setErrorMsg('');
    setGeneratedModelUrl(null);

    const formData = new FormData();
    formData.append('image', image);

    try {
      const API_URL = "http://127.0.0.1:8000/api/analyze-image";
      const response = await axios.post(API_URL, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      
      const aiData = response.data.data;
      setResult(aiData);

      if (aiData.geometry) {
          console.log("🛠️ Geometry found, building model...", aiData.geometry);
          try {
              const url = await generateProceduralModel(aiData.geometry);
              setGeneratedModelUrl(url);
          } catch (genErr) {
              console.error("3D Generation failed:", genErr);
          }
      }

    } catch (error) {
      const msg = error.response?.data?.message || error.message;
      setErrorMsg(msg.includes("404") ? "Error 404: Route not found." : "Analysis Failed: " + msg);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveToProfile = async () => {
    if (!result || !image) return;
    setSaving(true);
    const formData = new FormData();
    formData.append('title', result.result_project);
    formData.append('description', result.marketing_pitch);
    formData.append('category', result.prototype_category);
    formData.append('image', image); 
    try {
        await axios.post('http://127.0.0.1:8000/api/projects', formData, {
            headers: { 
                'Content-Type': 'multipart/form-data',
                'Authorization': `Bearer ${localStorage.getItem('token')}` 
            }
        });
        alert("✅ Project Saved!");
        navigate('/profile'); 
    } catch (error) {
        alert("❌ Save Failed: " + (error.response?.data?.message || error.message));
    } finally {
        setSaving(false);
    }
  };

  const getModelUrl = () => {
      if (generatedModelUrl) return generatedModelUrl;

      if (!result?.prototype_category) return PROTOTYPES.default;
      const cat = result.prototype_category.toLowerCase();
      return PROTOTYPES[cat] || PROTOTYPES.default;
  };

  return (
    <div className="min-h-screen bg-slate-900 pb-20 pt-24 px-4 font-sans text-white">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-4xl font-black text-center mb-2 text-white">Regen <span className="text-blue-400">Vision</span></h1>
        <p className="text-center text-slate-400 mb-8 font-medium">Turn Waste into Products</p>

        {errorMsg && (
            <div className="bg-red-500/10 border border-red-500 text-red-200 p-4 rounded-xl mb-6 text-center animate-shake">
                {errorMsg}
            </div>
        )}

        {!result && (
          <div className={`bg-slate-800/50 rounded-[2.5rem] border-2 border-dashed transition-all duration-500 overflow-hidden relative ${preview || isWebcamOpen ? 'border-blue-500 shadow-2xl shadow-blue-900/20' : 'border-slate-700'}`}>
            
            {isWebcamOpen ? (
                <div className="relative h-[450px] bg-black">
                    <video ref={videoRef} autoPlay playsInline className="w-full h-full object-cover" />
                    <canvas ref={canvasRef} className="hidden" />
                    <div className="absolute bottom-6 left-0 right-0 flex justify-center items-center gap-8 px-6">
                        <button onClick={stopCamera} className="bg-white/10 backdrop-blur-md p-4 rounded-full text-white hover:bg-white/20 transition-all"><X size={24}/></button>
                        <button onClick={capturePhoto} className="bg-blue-500 p-6 rounded-full text-white hover:bg-blue-400 shadow-xl shadow-blue-500/40 active:scale-90 transition-all border-4 border-white/20"><Circle size={32} fill="white" /></button>
                        <div className="w-14" /> 
                    </div>
                </div>
            ) : preview ? (
                <div className="p-8 animate-fade-in">
                    <div className="relative">
                        <button onClick={clearSelection} className="absolute top-4 right-4 bg-black/50 hover:bg-red-500 p-2.5 rounded-full text-white transition-all z-40 backdrop-blur-md"><X size={20}/></button>
                        <img src={preview} alt="Upload" className="w-full h-80 object-cover rounded-3xl bg-slate-900 border border-slate-700 shadow-inner"/>
                    </div>
                    <button onClick={analyzeImage} disabled={loading} className="mt-8 w-full bg-blue-600 text-white py-5 rounded-[1.5rem] font-black text-lg flex items-center justify-center gap-3 hover:bg-blue-500 transition-all shadow-xl shadow-blue-900/40 active:scale-[0.98]">
                        {loading ? <Loader className="animate-spin"/> : <><Sparkles size={22}/> Generate Vision</>}
                    </button>
                </div>
            ) : (
                <div className="h-[400px] flex flex-col items-center justify-center p-8 text-center space-y-6">
                    <div className="flex gap-4">
                        <button onClick={startCamera} className="flex flex-col items-center gap-3 p-8 bg-slate-700/50 hover:bg-blue-600/20 hover:border-blue-500 border border-transparent rounded-[2rem] transition-all group">
                            <Camera size={48} className="text-slate-500 group-hover:text-blue-400 group-hover:scale-110 transition-all"/>
                            <span className="font-bold text-slate-300">Take Photo</span>
                        </button>
                        <label className="flex flex-col items-center gap-3 p-8 bg-slate-700/50 hover:bg-blue-600/20 hover:border-blue-500 border border-transparent rounded-[2rem] transition-all group cursor-pointer">
                            <input type="file" accept="image/*" onChange={handleImageChange} className="hidden"/>
                            <Box size={48} className="text-slate-500 group-hover:text-blue-400 group-hover:scale-110 transition-all"/>
                            <span className="font-bold text-slate-300">Upload File</span>
                        </label>
                    </div>
                    <div>
                        <p className="font-black text-xl text-white">Analyze Material</p>
                        <p className="text-sm mt-1 text-slate-500 font-medium">AI Analysis & AR Projection</p>
                    </div>
                </div>
            )}
          </div>
        )}

        {loading && (
            <div className="text-center mt-12 animate-in fade-in zoom-in duration-500">
                <div className="w-20 h-20 bg-blue-600 rounded-[2rem] mx-auto mb-6 flex items-center justify-center shadow-2xl shadow-blue-900/50 rotate-12">
                    <Sparkles className="text-white animate-spin" size={40}/>
                </div>
                <h3 className="text-3xl font-black tracking-tight text-white">Dreaming up a design...</h3>
                <p className="text-slate-500 mt-2 font-medium italic">Searching for the best upcycling match</p>
            </div>
        )}

        {result && (
            <div className="animate-in slide-in-from-bottom-8 fade-in duration-700 space-y-6 mt-4">
                <div className="bg-slate-800 p-8 rounded-[3rem] shadow-2xl border border-slate-700 relative overflow-hidden">
                    <div className="flex justify-between items-start mb-6">
                        <div>
                            <p className="text-[10px] font-black text-blue-400 uppercase tracking-[0.2em] mb-1">TRANSFORMATION</p>
                            <h2 className="text-4xl font-black text-white leading-none tracking-tighter">{result.result_project}</h2>
                        </div>
                        <span className="bg-blue-500/10 text-blue-400 px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest border border-blue-500/20">{result.difficulty || "Medium"}</span>
                    </div>

                    <p className="text-xl text-slate-300 mb-10 font-medium leading-relaxed italic">"{result.marketing_pitch}"</p>

                    <div className="grid grid-cols-2 gap-4">
                        <button onClick={() => setShowAR(true)} className="bg-white text-slate-900 py-5 rounded-2xl font-black text-xs uppercase tracking-widest flex flex-col items-center justify-center gap-3 hover:bg-blue-50 transition-all shadow-lg active:scale-95">
                            <Box size={28}/> 
                            {generatedModelUrl ? "View Custom 3D" : "View 3D Model"}
                        </button>
                        
                        <button onClick={() => setShowDIY(true)} className="bg-blue-600 text-white py-5 rounded-2xl font-black text-xs uppercase tracking-widest flex flex-col items-center justify-center gap-3 hover:bg-blue-500 transition-all shadow-xl shadow-blue-900/40 active:scale-95">
                            <Hammer size={28}/> See Blueprint
                        </button>
                    </div>

                    <div className="grid grid-cols-2 gap-4 mt-6 pt-6 border-t border-slate-700/50">
                        <button onClick={retryAnalysis} className="bg-slate-700/50 text-white py-4 rounded-2xl font-bold text-xs uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-slate-600 transition-all"><RotateCcw size={18}/> Try Another</button>
                        <button onClick={handleSaveToProfile} disabled={saving} className="bg-green-600 text-white py-4 rounded-2xl font-bold text-xs uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-green-500 transition-all shadow-lg shadow-green-900/30">{saving ? <Loader className="animate-spin" size={18}/> : <><Save size={18}/> Save Project</>}</button>
                    </div>
                </div>
                <button onClick={clearSelection} className="w-full py-6 text-slate-500 font-black text-xs uppercase tracking-[0.3em] hover:text-white transition-all">Scan Another Item</button>
            </div>
        )}

        {/* --- AR MODAL --- */}
        {showAR && (
            <div className="fixed inset-0 bg-black z-[100] animate-in fade-in duration-300">
                <button onClick={() => setShowAR(false)} className="absolute top-8 right-8 z-[110] bg-white/10 p-4 rounded-full text-white backdrop-blur-xl border border-white/20 hover:bg-white/20 transition-all"><X size={28}/></button>
                
<model-viewer 
    key={getModelUrl()} 
    src={getModelUrl()} 
    ar 
    ar-modes="webxr scene-viewer quick-look" 
    camera-controls 
    auto-rotate 
    shadow-intensity="1.5" 
    shadow-softness="0.5" 
    exposure="1.0"
    environment-image="neutral"
    loading="eager"
    style={{width: '100vw', height: '100vh'}}
>
</model-viewer>

                {generatedModelUrl && (
                    <div className="absolute top-8 left-8 bg-blue-600/20 border border-blue-500/30 backdrop-blur-md px-4 py-2 rounded-xl">
                        <p className="text-[10px] font-black text-blue-400 uppercase tracking-widest">⚡ Custom AI Geometry</p>
                    </div>
                )}
            </div>
        )}

        {showDIY && (
            <div className="fixed inset-0 bg-black/60 backdrop-blur-md z-[100] flex justify-end animate-in fade-in duration-300" onClick={() => setShowDIY(false)}>
                <div className="bg-slate-900 w-full max-w-xl h-full p-10 overflow-y-auto relative border-l border-slate-800 animate-in slide-in-from-right duration-500 shadow-3xl" onClick={e => e.stopPropagation()}>
                    <button onClick={() => setShowDIY(false)} className="absolute top-8 right-8 p-3 hover:bg-slate-800 rounded-full text-slate-400 hover:text-white transition-all"><X size={28}/></button>
                    <h2 className="text-4xl font-black text-white mb-2 tracking-tighter">Blueprint</h2>
                    <p className="text-blue-400 font-black text-xs uppercase tracking-widest mb-12">Estimated Time: {result?.time || "2 Hours"}</p>
                    <div className="space-y-10 relative">
                         <div className="absolute left-[23px] top-6 bottom-6 w-[2px] bg-slate-800"></div>
                        {result?.steps?.map((step, idx) => (
                            <div key={idx} className="relative pl-16 group">
                                <div className="absolute left-0 top-0 w-12 h-12 bg-slate-900 text-blue-400 border-2 border-blue-500/30 rounded-2xl flex items-center justify-center font-black z-10 group-hover:bg-blue-600 group-hover:text-white group-hover:border-blue-600 transition-all duration-300 rotate-3 group-hover:rotate-0 shadow-lg">{idx + 1}</div>
                                <h4 className="font-black text-xl text-white mb-2 tracking-tight">Step {idx + 1}</h4>
                                <p className="text-slate-400 leading-relaxed font-medium text-lg">{step}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        )}
      </div>
    </div>
  );
};

export default AiAnalyzer;