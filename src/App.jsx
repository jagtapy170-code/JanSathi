import React, { useState } from 'react';
import { LanguageProvider } from './context/LanguageContext';
import { AuthProvider } from './context/AuthContext';
import { AppProvider } from './context/AppContext';

import Navbar from './components/Navbar';
import Footer from './components/Footer';
import JanSahayakChatbot from './components/JanSahayakChatbot';

import HomePage from './pages/HomePage';
import SchemesPage from './pages/SchemesPage';
import EligibilityCheckerPage from './pages/EligibilityCheckerPage';
import GrievancePage from './pages/GrievancePage';
import ResourcesPage from './pages/ResourcesPage';
import AnnouncementsPage from './pages/AnnouncementsPage';
import NotificationsPage from './pages/NotificationsPage';
import AdminDashboardPage from './pages/AdminDashboardPage';
import AuthModal from './pages/AuthModal';

function MainLayout() {
  const [activeTab, setActiveTab] = useState('home');
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedScheme, setSelectedScheme] = useState(null);
  const [authModalOpen, setAuthModalOpen] = useState(false);

  const handleSelectCategory = (catId) => {
    setSelectedCategory(catId);
    setActiveTab('schemes');
  };

  const handleSelectScheme = (sch) => {
    setSelectedScheme(sch);
    setActiveTab('schemes');
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Navbar 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
        onOpenAuth={() => setAuthModalOpen(true)} 
      />

      <main style={{ flex: 1 }}>
        {activeTab === 'home' && (
          <HomePage 
            setActiveTab={setActiveTab}
            onSelectCategory={handleSelectCategory}
            onSelectScheme={handleSelectScheme}
          />
        )}

        {activeTab === 'schemes' && (
          <SchemesPage 
            initialCategory={selectedCategory}
            selectedScheme={selectedScheme}
            onClearSelectedScheme={() => setSelectedScheme(null)}
          />
        )}

        {activeTab === 'eligibility' && (
          <EligibilityCheckerPage 
            setActiveTab={setActiveTab}
            onSelectScheme={handleSelectScheme}
          />
        )}

        {activeTab === 'grievance' && (
          <GrievancePage />
        )}

        {activeTab === 'resources' && (
          <ResourcesPage />
        )}

        {activeTab === 'announcements' && (
          <AnnouncementsPage />
        )}

        {activeTab === 'notifications' && (
          <NotificationsPage 
            onNavigateScheme={(schemeId) => {
              setActiveTab('schemes');
            }}
          />
        )}

        {activeTab === 'admin' && (
          <AdminDashboardPage />
        )}
      </main>

      <Footer setActiveTab={setActiveTab} />

      {/* JanSahayak Chatbot Floating Widget */}
      <JanSahayakChatbot 
        onNavigateScheme={(schId) => {
          setActiveTab('schemes');
        }}
        onNavigateGrievance={() => {
          setActiveTab('grievance');
        }}
      />

      {/* Auth Modal Overlay */}
      {authModalOpen && (
        <AuthModal onClose={() => setAuthModalOpen(false)} />
      )}
    </div>
  );
}

export default function App() {
  return (
    <LanguageProvider>
      <AuthProvider>
        <AppProvider>
          <MainLayout />
        </AppProvider>
      </AuthProvider>
    </LanguageProvider>
  );
}
