import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Leaf, Menu, X, User, LogOut } from 'lucide-react';
import { useAuthStore } from '../store/useAuthStore';
import { useUIStore } from '../store/useUIStore';
import Button from '../components/Button';

const Navbar = () => {
  const { user, logout } = useAuthStore();
  const { isMobileMenuOpen, toggleMobileMenu } = useUIStore();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const navLinks = [
    { name: 'Marketplace', path: '/marketplace' },
    { name: 'Makers', path: '/makers' },
    { name: 'Contact', path: '/contact' },
  ];

  return (
    <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-100 h-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full">
        <div className="flex justify-between items-center h-full">
          
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group">
            <div className="bg-brand-green p-1.5 rounded-lg group-hover:rotate-12 transition-transform">
              <Leaf className="text-white w-5 h-5" />
            </div>
            <span className="font-bold text-xl tracking-tight text-brand-dark">RegenAI</span>
          </Link>

          {/* Desktop Links */}
          <div className="hidden md:flex items-center gap-8 text-gray-600 font-medium">
            {navLinks.map((link) => (
              <Link key={link.name} to={link.path} className="hover:text-brand-green transition">
                {link.name}
              </Link>
            ))}
          </div>

          {/* Auth Actions (Dynamic) */}
          <div className="hidden md:flex items-center gap-4">
            {user ? (
              <>
                <Link to="/profile" className="flex items-center gap-2 font-bold text-brand-dark hover:text-brand-green transition">
                  <div className="w-8 h-8 rounded-full bg-brand-light-green flex items-center justify-center text-brand-green">
                    <User size={18} />
                  </div>
                  <span>{user.name}</span>
                </Link>
                <button 
                  onClick={handleLogout} 
                  className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-full transition"
                  title="Logout"
                >
                  <LogOut size={20} />
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="text-gray-600 px-4 py-2 hover:text-brand-green font-medium">
                  Login
                </Link>
                <Button onClick={() => navigate('/register')} className="!py-2 !px-5 text-sm">
                  Join Now
                </Button>
              </>
            )}
          </div>

          {/* Mobile Toggle */}
          <button className="md:hidden p-2 text-gray-600" onClick={toggleMobileMenu}>
            {isMobileMenuOpen ? <X /> : <Menu />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-white border-b border-gray-100 p-4 flex flex-col gap-4 absolute w-full shadow-xl">
          {navLinks.map((link) => (
            <Link key={link.name} to={link.path} onClick={toggleMobileMenu} className="font-bold text-gray-700">
              {link.name}
            </Link>
          ))}
          <hr />
          {user ? (
            <>
              <Link to="/profile" onClick={toggleMobileMenu} className="font-bold text-brand-green flex items-center gap-2">
                <User size={18} /> My Profile
              </Link>
              <button onClick={() => { handleLogout(); toggleMobileMenu(); }} className="text-left font-bold text-red-500">
                Logout
              </button>
            </>
          ) : (
            <div className="flex flex-col gap-2">
              <Button onClick={() => { navigate('/login'); toggleMobileMenu(); }} variant="secondary">Login</Button>
              <Button onClick={() => { navigate('/register'); toggleMobileMenu(); }}>Join Now</Button>
            </div>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;