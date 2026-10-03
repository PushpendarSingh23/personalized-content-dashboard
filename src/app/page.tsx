'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAppSelector } from '@/lib/store/store';
import Header from '@/components/layout/Header';
import Sidebar from '@/components/layout/Sidebar';
import ContentFeed from '@/components/feed/ContentFeed';
import TrendingSection from '@/components/trending/TrendingSection';
import FavoritesSection from '@/components/favorites/FavoritesSection';
import AnalyticsSection from '@/components/analytics/AnalyticsSection';
import ContentModal from '@/components/modals/ContentModal';
import SettingsModal from '@/components/modals/SettingsModal';
import AuthModal from '@/components/modals/AuthModal';
import NotificationDrawer from '@/components/modals/NotificationDrawer';
import Toast from '@/components/common/Toast';

export default function DashboardPage() {
  const activeSection = useAppSelector((state) => state.content.activeSection);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 2800);
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-[#090d16] text-slate-900 dark:text-slate-100 transition-colors duration-300">
      {/* Top Header */}
      <Header
        onOpenSettings={() => setIsSettingsOpen(true)}
        onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
      />

      <div className="flex-1 flex w-full max-w-7xl mx-auto">
        {/* Responsive Sidebar */}
        <Sidebar
          isOpen={isSidebarOpen}
          onClose={() => setIsSidebarOpen(false)}
          onOpenSettings={() => setIsSettingsOpen(true)}
        />

        {/* Main Workspace Area */}
        <main className="flex-1 lg:pl-64 p-4 sm:p-6 lg:p-8 min-w-0">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeSection}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.2 }}
            >
              {activeSection === 'feed' && <ContentFeed onToast={showToast} />}
              {activeSection === 'trending' && <TrendingSection onToast={showToast} />}
              {activeSection === 'favorites' && <FavoritesSection onToast={showToast} />}
              {activeSection === 'analytics' && <AnalyticsSection />}
            </motion.div>
          </AnimatePresence>
        </main>
      </div>

      {/* Interactive Overlays & Modals */}
      <ContentModal onToast={showToast} />
      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        onToast={showToast}
      />
      <AuthModal onToast={showToast} />
      <NotificationDrawer />
      <Toast message={toastMessage} onClose={() => setToastMessage(null)} />
    </div>
  );
}
