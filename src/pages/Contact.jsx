import React from 'react';
import Input from '../components/Input';
import Button from '../components/Button';
import { Mail, MessageSquare, Send } from 'lucide-react';
import { useUIStore } from '../store/useUIStore';

const Contact = () => {
  const { setNotification } = useUIStore();

  const handleSend = (e) => {
    e.preventDefault();
    setNotification({ type: 'success', message: "Message sent! We'll be in touch soon." });
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-16">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
        <div>
          <h1 className="text-4xl font-black text-[--color-brand-dark] mb-6">Get in Touch</h1>
          <p className="text-gray-500 mb-8 leading-relaxed">
            Have questions about our AI or want to partner with us? Our team is ready to help you save the planet.
          </p>
          <div className="space-y-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-gray-100 rounded-xl"><Mail className="text-gray-600" /></div>
              <div><p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Email Us</p><p className="font-bold">hello@regenai.kesug.com</p></div>
            </div>
          </div>
        </div>

        <div className="bg-white p-8 rounded-[2rem] shadow-2xl border border-gray-50">
          <form onSubmit={handleSend} className="space-y-4">
            <Input label="Your Name" placeholder="Jane Doe" required />
            <Input label="Email" type="email" placeholder="jane@example.com" required />
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-semibold text-gray-700 ml-1">Message</label>
              <textarea 
                className="px-4 py-3 rounded-xl border border-gray-200 bg-gray-50/50 min-h-[120px] focus:border-[--color-brand-green] focus:ring-2 focus:ring-green-50 outline-none transition-all"
                placeholder="How can we help?"
                required
              ></textarea>
            </div>
            <Button type="submit" className="w-full">
              Send Message <Send size={18} />
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Contact;