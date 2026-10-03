'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bell, X, CheckCheck, Trash2 } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '@/lib/store/store';
import {
  setDrawerOpen,
  markAllAsRead,
  clearNotifications,
  markAsRead,
} from '@/lib/store/notificationsSlice';
import { setSelectedModalItem } from '@/lib/store/contentSlice';
import { CategoryBadge } from '../common/Badge';
import { getTranslation } from '@/lib/i18n/translations';

export default function NotificationDrawer() {
  const dispatch = useAppDispatch();
  const isOpen = useAppSelector((state) => state.notifications.isDrawerOpen);
  const items = useAppSelector((state) => state.notifications.items);
  const language = useAppSelector((state) => state.preferences.language);

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 overflow-hidden bg-black/60 backdrop-blur-sm flex justify-end">
        <motion.div
          initial={{ x: '100%' }}
          animate={{ x: 0 }}
          exit={{ x: '100%' }}
          transition={{ type: 'spring', damping: 25, stiffness: 200 }}
          className="relative w-full max-w-md bg-white dark:bg-slate-900 h-full shadow-2xl border-l border-slate-200 dark:border-slate-800 flex flex-col"
        >
          <div className="p-5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-2 text-sky-500">
              <Bell className="w-5 h-5" />
              <h3 className="font-extrabold text-slate-900 dark:text-white text-base">
                {getTranslation(language, 'notifications')} ({items.filter((i) => !i.read).length})
              </h3>
            </div>
            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={() => dispatch(markAllAsRead())}
                className="p-1.5 rounded-lg text-slate-400 hover:text-sky-500 transition-colors"
                title={getTranslation(language, 'markAllAsRead')}
              >
                <CheckCheck className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => dispatch(setDrawerOpen(false))}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {items.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center p-6 text-slate-400">
                <Bell className="w-10 h-10 mb-2 opacity-30" />
                <p className="text-xs">{getTranslation(language, 'noNotifications')}</p>
              </div>
            ) : (
              items.map((notif) => (
                <div
                  key={notif.id}
                  onClick={() => {
                    dispatch(markAsRead(notif.id));
                    if (notif.item) {
                      dispatch(setSelectedModalItem(notif.item));
                    }
                  }}
                  className={`p-3.5 rounded-2xl border transition-all cursor-pointer ${
                    notif.read
                      ? 'bg-slate-50 dark:bg-slate-850/60 border-slate-200/60 dark:border-slate-800/60 opacity-75'
                      : 'bg-white dark:bg-slate-800 border-sky-500/30 shadow-sm'
                  }`}
                >
                  <div className="flex items-center justify-between gap-2 mb-1">
                    <CategoryBadge category={notif.category} />
                    <span className="text-[10px] text-slate-400">{notif.timestamp}</span>
                  </div>
                  <h4 className="text-xs font-bold text-slate-800 dark:text-slate-100 line-clamp-1">
                    {notif.title}
                  </h4>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 line-clamp-2 mt-1">
                    {notif.description}
                  </p>
                </div>
              ))
            )}
          </div>

          {items.length > 0 && (
            <div className="p-3 bg-slate-50 dark:bg-slate-950/60 border-t border-slate-100 dark:border-slate-800 flex justify-center">
              <button
                type="button"
                onClick={() => dispatch(clearNotifications())}
                className="text-xs font-semibold text-rose-500 hover:text-rose-600 flex items-center gap-1"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Clear All Notifications</span>
              </button>
            </div>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
