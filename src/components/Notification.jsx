import React from 'react';
import { useUIStore } from '../store/useUIStore';
import { X, CheckCircle, AlertCircle } from 'lucide-react';

const Notification = () => {
  const { activeNotification, clearNotification } = useUIStore();

  if (!activeNotification) return null;

  const isError = activeNotification.type === 'error';

  return (
    <div className="fixed bottom-6 right-6 z-[100] animate-slide-up">
      <div className={`flex items-center gap-3 px-5 py-4 rounded-2xl shadow-2xl border ${
        isError ? 'bg-red-50 border-red-100 text-red-800' : 'bg-green-50 border-green-100 text-green-800'
      }`}>
        {isError ? <AlertCircle size={20} /> : <CheckCircle size={20} />}
        <p className="font-medium">{activeNotification.message}</p>
        <button onClick={clearNotification} className="ml-2 hover:opacity-70 transition">
          <X size={18} />
        </button>
      </div>
    </div>
  );
};

export default Notification;