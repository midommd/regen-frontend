import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';
import Footer from './Footer';
import Notification from '../components/Notification';

const MainLayout = () => {
  return (
    <div className="min-h-screen flex flex-col selection:bg-[--color-brand-light-green] selection:text-[--color-brand-green]">
      <Notification />
      <Navbar />
      <main className="flex-grow pt-18"> 
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};

export default MainLayout;