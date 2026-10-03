'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles } from 'lucide-react';

interface ToastProps {
  message: string | null;
  onClose?: () => void;
}

export default function Toast({ message }: ToastProps) {
  if (!message) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: 50, scale: 0.9 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 20, scale: 0.9 }}
        className="fixed bottom-6 right-6 z-50 flex items-center gap-3 px-4 py-3 rounded-2xl bg-slate-900/95 dark:bg-white/95 text-white dark:text-slate-900 shadow-2xl border border-slate-700/50 dark:border-slate-200/50 backdrop-blur-md text-xs font-bold"
      >
        <div className="p-1 rounded-lg bg-sky-500 text-white">
          <Sparkles className="w-3.5 h-3.5" />
        </div>
        <span>{message}</span>
      </motion.div>
    </AnimatePresence>
  );
}
