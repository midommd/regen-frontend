import React, { Suspense, lazy } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import MainLayout from './layouts/MainLayout';

// Pages & Features
const Home = lazy(() => import('./pages/Home'));
const Marketplace = lazy(() => import('./pages/Marketplace'));
const Makers = lazy(() => import('./pages/Makers'));
const Contact = lazy(() => import('./pages/Contact'));
const Login = lazy(() => import('./features/auth/Login'));
const Register = lazy(() => import('./features/auth/Register'));
const MakerDashboard = lazy(() => import('./features/maker/MakerDashboard'));
const ProfilePage = lazy(() => import('./features/profile/ProfilePage')); 
const Inbox = lazy(() => import('./features/chat/Inbox'));
const EditProfile = lazy(() => import('./features/profile/EditProfile'));
import PortfolioUploadPage from './pages/portfolio/PortfolioUploadPage';
import MakerPublicProfile from './pages/maker/MakerPublicProfile';
const Loading = () => (
  <div className="h-screen w-full flex items-center justify-center bg-white">
    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-brand-green"></div>
  </div>
);

function App() {
  return (
    <BrowserRouter>
      <Suspense fallback={<Loading />}>
        <Routes>
          <Route path="/" element={<MainLayout />}>
            <Route index element={<Home />} />
            
            <Route path="login" element={<Login />} />
            <Route path="register" element={<Register />} />
            <Route path="profile" element={<ProfilePage />} />
            <Route path="inbox" element={<Inbox />} />
            <Route path="maker" element={<MakerDashboard />} />
            <Route path="marketplace" element={<Marketplace />} />
            <Route path="makers" element={<Makers />} />
            <Route path="contact" element={<Contact />} />
            <Route path="settings" element={<EditProfile />} />
            <Route path="/portfolio/upload" element={<PortfolioUploadPage />} />
            <Route path="/maker/:id" element={<MakerPublicProfile />} />
            
            <Route path="*" element={<Navigate to="/" replace />} />
          </Route>
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}

export default App;