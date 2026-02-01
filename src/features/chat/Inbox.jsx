import React, { useState, useEffect, useRef, useLayoutEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { chatService } from './chatService';
import { useAuthStore } from '../../store/useAuthStore';
import EmojiPicker from 'emoji-picker-react';
import { 
  Send, User, MessageCircle, MoreHorizontal, ArrowLeft, 
  Search, Paperclip, Smile, FileText, X,
  Trash2, Edit2, MoreVertical, Maximize2, AlertTriangle, Loader2, Download, Image as ImageIcon 
} from 'lucide-react';

const ImageAttachment = ({ src, onClick }) => {
    const [error, setError] = useState(false);
    const [loading, setLoading] = useState(true);
    const [hovered, setHovered] = useState(false);

    if (error) {
        return (
            <div className="w-full h-32 bg-gradient-to-br from-red-50 to-red-100 flex flex-col items-center justify-center rounded-xl border border-red-200 p-2 animate-pulse">
                <AlertTriangle className="text-red-500 mb-2 animate-bounce" size={24}/>
                <span className="text-xs font-semibold text-red-500">Failed to Load</span>
            </div>
        );
    }

    return (
        <div 
            className="relative bg-gradient-to-br from-slate-100 to-slate-200 rounded-xl overflow-hidden min-h-[150px] min-w-[200px] cursor-zoom-in transform transition-all duration-300 hover:scale-[1.02] hover:shadow-lg"
            onClick={onClick}
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
        >
            {loading && (
                <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-slate-100 to-slate-200 animate-pulse">
                    <div className="relative">
                        <Loader2 className="animate-spin text-slate-400" size={28}/>
                        <div className="absolute inset-0 blur-lg bg-slate-400/20"></div>
                    </div>
                </div>
            )}
            <div className={`absolute inset-0 bg-gradient-to-t from-black/10 via-transparent to-transparent opacity-0 transition-opacity duration-300 ${hovered ? 'opacity-100' : ''}`}></div>
            {hovered && (
                <div className="absolute inset-0 flex items-center justify-center">
                    <div className="bg-white/90 backdrop-blur-sm rounded-full p-3 transform transition-all duration-300 scale-75 hover:scale-100">
                        <Maximize2 className="text-slate-700" size={20}/>
                    </div>
                </div>
            )}
            <img 
                src={src} 
                className={`w-full h-auto object-cover max-h-[350px] transition-all duration-500 ${loading ? 'opacity-0 scale-95' : 'opacity-100 scale-100'}`}
                onLoad={() => setLoading(false)}
                onError={() => setError(true)}
                alt="Attachment"
            />
        </div>
    );
};

const MessageMenu = ({ message, isMe, onEdit, onDelete, isOpen, onToggle }) => {
    const menuRef = useRef(null);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (menuRef.current && !menuRef.current.contains(event.target)) {
                onToggle();
            }
        };

        if (isOpen) {
            document.addEventListener('mousedown', handleClickOutside);
        }
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [isOpen, onToggle]);

    const isImage = message.attachment_type === 'image';

    return (
        <div className="relative" ref={menuRef}>
            <button 
                onClick={onToggle}
                className={`p-2 rounded-full transition-all duration-300 transform hover:scale-110 ${
                    isOpen 
                    ? 'bg-slate-100 shadow-inner text-slate-700' 
                    : 'text-slate-400 hover:text-slate-600 hover:bg-slate-100/50 opacity-0 group-hover:opacity-100'
                }`}
            >
                <MoreVertical size={16} className="transition-transform duration-300" />
            </button>
            
            {isOpen && (
                <div className="absolute bottom-full mb-2 right-0 w-48 bg-white/95 backdrop-blur-xl shadow-2xl rounded-xl border border-slate-100/50 overflow-hidden z-50 animate-in fade-in slide-in-from-bottom-2">
                    <div className="p-2">
                        {!isImage && (
                            <button 
                                onClick={() => { onEdit(); onToggle(); }}
                                className="w-full flex items-center gap-3 px-3 py-2.5 text-sm hover:bg-slate-50 rounded-lg transition-all duration-200 transform hover:translate-x-1 group/edit"
                            >
                                <div className="p-1.5 bg-amber-100 rounded-lg group-hover/edit:bg-amber-200 transition-colors">
                                    <Edit2 size={14} className="text-amber-700" />
                                </div>
                                <span className="font-medium text-slate-700">Edit Message</span>
                            </button>
                        )}
                        
                        <div className="border-t border-slate-100/50 my-1"></div>
                        
                        <div className="px-2 py-1">
                            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider px-1 pb-1">Delete Options</p>
                            <button 
                                onClick={() => onDelete('everyone')}
                                className="w-full flex items-center gap-3 px-3 py-2.5 text-sm hover:bg-red-50 rounded-lg transition-all duration-200 transform hover:translate-x-1 group/delete-everyone"
                            >
                                <div className="p-1.5 bg-red-100 rounded-lg group-hover/delete-everyone:bg-red-200 transition-colors">
                                    <Trash2 size={14} className="text-red-600" />
                                </div>
                                <div className="flex flex-col items-start">
                                    <span className="font-medium text-red-600">Delete for Everyone</span>
                                    <span className="text-xs text-red-400">All users will lose access</span>
                                </div>
                            </button>
                            
                            <button 
                                onClick={() => onDelete('me')}
                                className="w-full flex items-center gap-3 px-3 py-2.5 text-sm hover:bg-slate-50 rounded-lg transition-all duration-200 transform hover:translate-x-1 group/delete-me mt-1"
                            >
                                <div className="p-1.5 bg-slate-100 rounded-lg group-hover/delete-me:bg-slate-200 transition-colors">
                                    <Trash2 size={14} className="text-slate-600" />
                                </div>
                                <div className="flex flex-col items-start">
                                    <span className="font-medium text-slate-700">Delete for Me</span>
                                    <span className="text-xs text-slate-400">Only visible to you</span>
                                </div>
                            </button>
                        </div>
                    </div>
         
                    <div className="absolute -bottom-1 right-3 w-2 h-2 bg-white transform rotate-45"></div>
                </div>
            )}
        </div>
    );
};

const Inbox = () => {
  const location = useLocation();
  const { user } = useAuthStore();
  
  // Data
  const [conversations, setConversations] = useState([]);
  const [activeChat, setActiveChat] = useState(null);
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Input
  const [newMessage, setNewMessage] = useState('');
  const [attachment, setAttachment] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [isSending, setIsSending] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  
  // UI
  const [showEmoji, setShowEmoji] = useState(false);
  const [editingMessage, setEditingMessage] = useState(null); 
  const [menuOpenId, setMenuOpenId] = useState(null);
  const [fullScreenImage, setFullScreenImage] = useState(null);

  const messagesContainerRef = useRef(null);
  const fileInputRef = useRef(null);

  const getSmartUrl = (path) => {
      if (!path) return null;
      if (path === 'pending') return null; 
      if (path.startsWith('blob:')) return path; 
      if (path.startsWith('http')) return path; 
      
      let cleanPath = path.replace(/^\/?(public\/|storage\/)+/, '');
      return `http://127.0.0.1:8000/storage/${cleanPath}`;
  };

  const getAvatar = (path) => {
      if (!path) return null;
      if (path.startsWith('http')) return path;
      return `http://127.0.0.1:8000${path}`;
  };

  useEffect(() => {
    const initInbox = async () => {
        try {
            const data = await chatService.getConversations();
            setConversations(data);
            setLoading(false);
            if (location.state?.openChatId) {
                const target = data.find(c => c.id == location.state.openChatId);
                if (target) setActiveChat(target);
            }
        } catch (e) { console.error(e); }
    };
    initInbox();
  }, [location.state]);

  useEffect(() => {
    let interval;
    if (activeChat) {
        const fetch = () => chatService.getMessages(activeChat.id).then(setMessages);
        fetch();
        interval = setInterval(fetch, 3000);
    }
    return () => clearInterval(interval);
  }, [activeChat]);

  useLayoutEffect(() => {
    if (messagesContainerRef.current) {
        messagesContainerRef.current.scrollTop = messagesContainerRef.current.scrollHeight;
    }
  }, [messages, activeChat, previewUrl, editingMessage]);

  // --- ACTIONS ---
  const handleFileSelect = (e) => {
      const file = e.target.files[0];
      if (file) {
          setAttachment(file);
          if (file.type.startsWith('image/')) {
              setPreviewUrl(URL.createObjectURL(file));
          } else {
              setPreviewUrl(null);
          }
      }
  };

  const handleSend = async (e) => {
      e.preventDefault();

      if (editingMessage) {
          if (!newMessage.trim()) return;
          try {
              await chatService.editMessage(editingMessage.id, newMessage);
              setEditingMessage(null);
              setNewMessage('');
              setMessages(await chatService.getMessages(activeChat.id));
          } catch(e) { alert("Edit Failed"); }
          return;
      }

      if ((!newMessage.trim() && !attachment) || !activeChat) return;

      const tempText = newMessage;
      const tempAttachment = attachment;
      const tempPreview = previewUrl;

      setNewMessage('');
      setAttachment(null);
      setPreviewUrl(null);
      if(fileInputRef.current) fileInputRef.current.value = '';
      setIsSending(true);

      const optimisticMsg = {
          id: Date.now(),
          text: tempText,
          sender_id: user.id,
          attachment_url: tempPreview || 'pending', 
          attachment_type: tempAttachment?.type.startsWith('image/') ? 'image' : (tempAttachment ? 'file' : null),
          created_at: new Date().toISOString(),
          isOptimistic: true
      };
      setMessages(prev => [...prev, optimisticMsg]);

      try {
          await chatService.sendMessage(activeChat.id, tempText, tempAttachment);
          setMessages(await chatService.getMessages(activeChat.id));
      } catch (e) {
          console.error(e);
          alert("Failed to send");
      } finally {
          setIsSending(false);
      }
  };

  const handleDelete = async (msgId, type) => {
      if(!window.confirm("Delete message?")) return;
      await chatService.deleteMessage(msgId, type);
      setMenuOpenId(null);
      setMessages(await chatService.getMessages(activeChat.id));
  };

  const startEdit = (msg) => {
      setNewMessage(msg.text || "");
      setEditingMessage(msg);
      setMenuOpenId(null);
  };

  const toggleMenu = (msgId) => {
      setMenuOpenId(menuOpenId === msgId ? null : msgId);
  };

  return (
    <div className="pt-24 pb-10 px-4 min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex justify-center animate-fade-in font-sans">
      
      {/* Enhanced Lightbox */}
      {fullScreenImage && (
          <div className="fixed inset-0 z-[100] bg-black/95 backdrop-blur-xl flex items-center justify-center p-4 animate-in fade-in duration-300" onClick={() => setFullScreenImage(null)}>
              <button className="absolute top-8 right-8 text-white bg-white/10 p-3 rounded-full hover:bg-white/20 transition-all duration-300 transform hover:scale-110 hover:rotate-90">
                  <X size={28}/>
              </button>
              <img 
                  src={fullScreenImage} 
                  className="max-w-full max-h-[90vh] object-contain rounded-2xl shadow-2xl transform transition-all duration-500 scale-95 animate-in zoom-in"
                  onClick={(e) => e.stopPropagation()}
              />
          </div>
      )}

      <div className="bg-white w-full max-w-7xl h-[85vh] rounded-3xl shadow-2xl overflow-hidden flex border border-slate-100/50 backdrop-blur-sm">
        
        {/* SIDEBAR */}
        <div className={`w-full md:w-1/3 lg:w-1/4 border-r border-slate-100/50 bg-white/95 backdrop-blur-sm flex-col ${activeChat ? 'hidden md:flex' : 'flex'} transform transition-all duration-300`}>
            <div className="p-6 border-b border-slate-50/50">
                <h2 className="text-2xl font-black bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent flex items-center gap-2 mb-6">
                    <MessageCircle className="text-brand-green animate-pulse"/> Inbox
                </h2>
                <div className="relative">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18}/>
                    <input 
                        type="text" 
                        placeholder="Search conversations..." 
                        value={searchTerm} 
                        onChange={(e)=>setSearchTerm(e.target.value)} 
                        className="w-full pl-11 pr-4 py-3 bg-gradient-to-r from-slate-50 to-blue-50 border border-slate-200/50 rounded-2xl text-sm font-medium focus:bg-white focus:ring-2 focus:ring-brand-green/30 outline-none transition-all duration-300"
                    />
                </div>
            </div>
            <div className="overflow-y-auto flex-1 p-3 space-y-1">
                {conversations.filter(c => c.other_user?.name.toLowerCase().includes(searchTerm.toLowerCase())).map(chat => (
                    <div 
                        key={chat.id} 
                        onClick={() => setActiveChat(chat)} 
                        className={`p-3.5 flex items-center gap-4 cursor-pointer rounded-2xl transition-all duration-300 transform hover:scale-[1.02] ${
                            activeChat?.id === chat.id 
                            ? 'bg-gradient-to-r from-brand-green/10 to-blue-100/50 border border-brand-green/30 shadow-sm' 
                            : 'hover:bg-gradient-to-r hover:from-slate-50 hover:to-blue-50/50 border border-transparent hover:border-slate-200/50'
                        }`}
                    >
                        <div className="relative">
                            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-slate-200 to-slate-300 overflow-hidden border-2 border-white shadow-md relative">
                                {chat.other_user?.avatar ? 
                                    <img src={getAvatar(chat.other_user.avatar)} className="w-full h-full object-cover transform transition-transform duration-300 hover:scale-110"/> : 
                                    <User className="m-3 text-slate-400"/>
                                }
                            </div>
                            <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white"></div>
                        </div>
                        <div className="overflow-hidden flex-1">
                            <div className="flex justify-between items-center mb-0.5">
                                <h4 className="font-bold text-slate-800 truncate text-sm">{chat.other_user?.name}</h4>
                                <span className="text-[10px] font-bold text-slate-400">{new Date(chat.updated_at).toLocaleTimeString([], {hour:'2-digit', minute:'2-digit'})}</span>
                            </div>
                            <p className="text-xs truncate font-medium text-slate-500">{chat.last_message}</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>

        {/* CHAT AREA */}
        <div className={`flex-1 flex-col bg-gradient-to-b from-[#F9FAFB] to-blue-50/30 relative ${!activeChat ? 'hidden md:flex' : 'flex'}`}>
            {activeChat ? (
                <>
                    {/* Header */}
                    <div className="p-4 border-b border-slate-100/50 flex items-center justify-between bg-white/95 backdrop-blur-sm z-10 shadow-sm">
                        <div className="flex items-center gap-4">
                            <button onClick={() => setActiveChat(null)} className="md:hidden p-2 -ml-2 text-slate-500 hover:bg-slate-100 rounded-full transition-all duration-300">
                                <ArrowLeft size={20}/>
                            </button>
                            <div className="relative">
                                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-slate-100 to-slate-200 overflow-hidden border-2 border-white shadow-sm">
                                    {activeChat.other_user?.avatar ? 
                                        <img src={getAvatar(activeChat.other_user.avatar)} className="w-full h-full object-cover"/> : 
                                        <User className="m-3 text-slate-400"/>
                                    }
                                </div>
                                <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white animate-pulse"></div>
                            </div>
                            <div>
                                <h3 className="text-lg font-bold text-slate-800">{activeChat.other_user?.name}</h3>
                                <div className="flex items-center gap-2">
                                    <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                                    <span className="text-xs font-bold text-slate-400">Online • Active now</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Messages */}
                    <div className="flex-1 overflow-y-auto p-6 space-y-4 scroll-smooth" ref={messagesContainerRef}>
                        {messages.map((msg, i) => {
                            const isMe = msg.sender_id === user.id;
                            
                            const url = msg.attachment_url;
                            const isImage = (msg.attachment_type === 'image' || (url && url.match(/\.(jpeg|jpg|gif|png|webp|bmp)$/i)));
                            const isFile = !isImage && url && url !== 'pending';

                            if (msg.deleted_everyone) return (
                                <div key={i} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
                                    <div className="px-4 py-2 rounded-xl bg-gradient-to-r from-slate-100 to-slate-200/50 text-slate-400 text-xs italic border border-slate-200/50 animate-pulse">
                                        🚫 Message deleted
                                    </div>
                                </div>
                            );

                            return (
                                <div key={i} className={`flex ${isMe ? 'justify-end' : 'justify-start'} group items-end relative animate-in slide-in-from-bottom-2 duration-300`}>
                                    
                                    {/* ENHANCED MENU */}
                                    {isMe && !msg.isOptimistic && (
                                        <div className="order-first mr-2 transition-all duration-300">
                                            <MessageMenu 
                                                message={msg}
                                                isMe={isMe}
                                                onEdit={() => startEdit(msg)}
                                                onDelete={(type) => handleDelete(msg.id, type)}
                                                isOpen={menuOpenId === msg.id}
                                                onToggle={() => toggleMenu(msg.id)}
                                            />
                                        </div>
                                    )}

                                    {/* BUBBLE */}
                                    <div className={`relative max-w-[75%] rounded-2xl shadow-lg overflow-hidden transform transition-all duration-300 hover:shadow-xl ${
                                        isMe 
                                        ? 'bg-gradient-to-br from-brand-green to-brand-dark text-white rounded-br-none' 
                                        : 'bg-white border border-slate-100/50 text-slate-700 rounded-bl-none'
                                    } ${msg.isOptimistic ? 'opacity-70 animate-pulse' : ''}`}>
                                        
                                        {/* IMAGE COMPONENT */}
                                        {isImage && (
                                            <div className="p-1.5">
                                                <ImageAttachment 
                                                    src={getSmartUrl(msg.attachment_url)} 
                                                    onClick={() => setFullScreenImage(getSmartUrl(msg.attachment_url))}
                                                />
                                            </div>
                                        )}

                                        {/* FILE */}
                                        {isFile && (
                                            <a href={getSmartUrl(msg.attachment_url)} target="_blank" rel="noreferrer" 
                                                className={`flex items-center gap-3 p-3.5 m-1 rounded-xl transform transition-all duration-300 hover:scale-[1.02] ${
                                                    isMe 
                                                    ? 'bg-white/10 hover:bg-white/20 text-white' 
                                                    : 'bg-gradient-to-r from-slate-50 to-blue-50/50 hover:from-slate-100 hover:to-blue-100/50 text-slate-700'
                                                }`}>
                                                <div className={`p-2 rounded-lg ${isMe ? 'bg-white/20' : 'bg-white border border-slate-200/50 shadow-sm'}`}>
                                                    <FileText size={20}/>
                                                </div>
                                                <div className="flex flex-col">
                                                    <span className="text-xs font-bold opacity-80">Attachment</span>
                                                    <span className="text-sm flex items-center gap-1">
                                                        Download <Download size={12}/>
                                                    </span>
                                                </div>
                                            </a>
                                        )}

                                        {/* Text */}
                                        {msg.text && (
                                            <div className="px-4 py-2 text-sm whitespace-pre-wrap relative">
                                                {msg.text}
                                                {editingMessage?.id === msg.id && (
                                                    <div className="absolute -top-2 -right-2 bg-amber-100 text-amber-700 text-xs px-2 py-0.5 rounded-full animate-pulse">
                                                        Editing
                                                    </div>
                                                )}
                                            </div>
                                        )}
                                        
                                        {/* Time */}
                                        <div className={`px-4 pb-2 text-[10px] flex justify-end gap-1.5 font-bold ${isMe ? 'text-white/70' : 'text-slate-400'}`}>
                                            {msg.is_edited && <span className="bg-white/20 px-1.5 py-0.5 rounded">EDITED</span>}
                                            {new Date(msg.created_at).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>

                    {/* Input */}
                    <div className="p-4 bg-white/95 backdrop-blur-sm border-t border-slate-100/50 sticky bottom-0 z-30">
                        {editingMessage && (
                            <div className="flex justify-between items-center bg-gradient-to-r from-amber-50 to-orange-50 text-amber-700 px-4 py-2 rounded-xl text-sm mb-3 border border-amber-200/50 shadow-sm animate-in slide-in-from-top">
                                <span className="flex items-center gap-2 font-semibold">
                                    <Edit2 size={14}/> Editing message...
                                </span>
                                <button 
                                    onClick={() => { setEditingMessage(null); setNewMessage(''); }} 
                                    className="hover:bg-amber-200/50 p-1 rounded-full transition-all duration-300"
                                >
                                    <X size={14}/>
                                </button>
                            </div>
                        )}

                        {attachment && !editingMessage && (
                            <div className="flex items-center gap-3 bg-gradient-to-r from-slate-50 to-blue-50/50 p-3 rounded-xl mb-3 border border-slate-200/50 shadow-sm animate-in slide-in-from-top">
                                {previewUrl ? 
                                    <img src={previewUrl} className="w-12 h-12 rounded-lg object-cover border border-slate-200"/> : 
                                    <div className="p-2 bg-white rounded-lg border border-slate-200">
                                        <FileText className="text-slate-400" size={20}/>
                                    </div>
                                }
                                <span className="text-sm font-semibold truncate max-w-[200px]">{attachment.name}</span>
                                <button 
                                    onClick={() => { setAttachment(null); setPreviewUrl(null); }} 
                                    className="ml-auto p-1.5 text-red-500 hover:bg-red-50 rounded-full transition-all duration-300"
                                >
                                    <X size={16}/>
                                </button>
                            </div>
                        )}

                        {showEmoji && (
                            <div className="absolute bottom-24 left-4 z-50 shadow-2xl rounded-2xl overflow-hidden border border-slate-200/50 animate-in slide-in-from-bottom duration-300">
                                <EmojiPicker 
                                    onEmojiClick={(e) => setNewMessage(p => p + e.emoji)} 
                                    height={320}
                                    width={350}
                                    skinTonesDisabled
                                    previewConfig={{ showPreview: false }}
                                />
                            </div>
                        )}

                        <form onSubmit={handleSend} className="flex gap-3 items-end">
                            <div className="flex gap-1 bg-gradient-to-r from-slate-50 to-blue-50/50 p-2 rounded-xl border border-slate-200/50">
                                <button 
                                    type="button" 
                                    onClick={() => setShowEmoji(!showEmoji)}
                                    className={`p-2.5 rounded-lg transition-all duration-300 transform hover:scale-110 ${
                                        showEmoji 
                                        ? 'bg-white text-brand-green shadow-sm' 
                                        : 'text-slate-500 hover:text-slate-700 hover:bg-white'
                                    }`}
                                >
                                    <Smile size={20}/>
                                </button>
                                {!editingMessage && (
                                    <>
                                        <button 
                                            type="button" 
                                            onClick={() => fileInputRef.current.click()}
                                            className="p-2.5 rounded-lg text-slate-500 hover:text-slate-700 hover:bg-white transition-all duration-300 transform hover:scale-110"
                                        >
                                            <Paperclip size={20}/>
                                        </button>
                                        <input type="file" ref={fileInputRef} onChange={handleFileSelect} className="hidden" />
                                    </>
                                )}
                            </div>
                            <textarea 
                                rows="1" 
                                className="flex-1 bg-gradient-to-r from-slate-50 to-blue-50/50 p-3.5 rounded-xl outline-none text-slate-700 resize-none max-h-32 text-sm border border-slate-200/50 focus:border-brand-green/30 focus:ring-2 focus:ring-brand-green/20 transition-all duration-300"
                                placeholder={editingMessage ? "Update your message..." : "Type your message here..."}
                                value={newMessage}
                                onChange={(e) => setNewMessage(e.target.value)}
                                onKeyDown={(e) => { if(e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend(e); }}}
                            />
                            <button 
                                type="submit" 
                                disabled={isSending || (!newMessage.trim() && !attachment)}
                                className={`p-3.5 rounded-xl text-white shadow-lg transition-all duration-300 transform hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed ${
                                    editingMessage 
                                    ? 'bg-gradient-to-br from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600' 
                                    : 'bg-gradient-to-br from-brand-green to-brand-dark hover:from-brand-green/90 hover:to-brand-dark/90'
                                }`}
                            >
                                {isSending ? (
                                    <Loader2 size={20} className="animate-spin"/>
                                ) : editingMessage ? (
                                    <Edit2 size={20}/>
                                ) : (
                                    <Send size={20}/>
                                )}
                            </button>
                        </form>
                    </div>
                </>
            ) : (
                <div className="flex-1 flex flex-col items-center justify-center text-slate-400 animate-pulse">
                    <div className="relative mb-6">
                        <ImageIcon size={56} className="opacity-20"/>
                        <div className="absolute inset-0 blur-xl bg-brand-green/10 rounded-full"></div>
                    </div>
                    <p className="text-lg font-medium bg-gradient-to-r from-slate-400 to-slate-300 bg-clip-text text-transparent">
                        Select a conversation to start messaging
                    </p>
                </div>
            )}
        </div>
      </div>
    </div>
  );
};

export default Inbox;