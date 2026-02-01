import { MessageSquare } from 'lucide-react';
import { Link } from 'react-router-dom';

<Link to="/inbox" className="relative p-2 text-gray-500 hover:text-brand-green transition">
  <MessageSquare size={24} />
  {unreadCount > 0 && (
    <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white"></span>
  )}
</Link>