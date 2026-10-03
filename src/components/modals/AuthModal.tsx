'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X,
  User,
  Users,
  Check,
  ShieldCheck,
  LogOut,
  Edit3,
} from 'lucide-react';
import { useAppDispatch, useAppSelector } from '@/lib/store/store';
import {
  setAuthModalOpen,
  switchDemoUser,
  updateProfile,
  logout,
} from '@/lib/store/authSlice';
import { DEMO_PROFILES } from '@/services/mockData';
import { getTranslation } from '@/lib/i18n/translations';

export default function AuthModal({ onToast }: { onToast: (msg: string) => void }) {
  const dispatch = useAppDispatch();
  const isOpen = useAppSelector((state) => state.auth.isAuthModalOpen);
  const user = useAppSelector((state) => state.auth.user);
  const language = useAppSelector((state) => state.preferences.language);

  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState(user.name);
  const [bio, setBio] = useState(user.bio);
  const [role, setRole] = useState(user.role);

  if (!isOpen) return null;

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    dispatch(updateProfile({ name, bio, role }));
    setIsEditing(false);
    onToast('Profile updated successfully!');
  };

  const handleSwitch = (id: string) => {
    dispatch(switchDemoUser(id));
    onToast(`Switched profile to demo user.`);
  };

  const handleLogout = () => {
    dispatch(logout());
    dispatch(setAuthModalOpen(false));
    onToast('Switched to Guest Mode.');
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/70 backdrop-blur-md overflow-y-auto">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="relative w-full max-w-lg bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden my-auto"
        >
          <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-slate-50/50 dark:bg-slate-950/50">
            <div className="flex items-center gap-2 text-sky-500">
              <User className="w-5 h-5" />
              <h2 className="text-lg font-extrabold text-slate-900 dark:text-white">
                User Profile & Demo Accounts
              </h2>
            </div>
            <button
              type="button"
              onClick={() => dispatch(setAuthModalOpen(false))}
              className="p-2 rounded-xl text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="p-6 space-y-6">
            <div className="p-5 rounded-2xl bg-gradient-to-br from-sky-500/10 to-indigo-500/10 border border-sky-500/20 flex flex-col sm:flex-row items-center gap-4 text-center sm:text-left">
              <div className="relative w-16 h-16 rounded-2xl overflow-hidden border-2 border-sky-500 shrink-0 shadow-md">
                <Image src={user.avatar} alt={user.name} fill className="object-cover" />
              </div>
              <div className="space-y-1 flex-1">
                <div className="flex items-center justify-center sm:justify-start gap-2">
                  <h3 className="text-base font-bold text-slate-900 dark:text-white">
                    {user.name}
                  </h3>
                  {user.isAuthenticated && (
                    <ShieldCheck className="w-4 h-4 text-sky-500" />
                  )}
                </div>
                <p className="text-xs text-sky-600 dark:text-sky-400 font-semibold">{user.role}</p>
                <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2">{user.bio}</p>
              </div>
            </div>

            <div className="space-y-3">
              <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                <Users className="w-4 h-4 text-indigo-500" />
                <span>Switch Demo Persona</span>
              </h4>

              <div className="space-y-2">
                {DEMO_PROFILES.map((profile) => {
                  const isActive = user.id === profile.id;
                  return (
                    <button
                      key={profile.id}
                      type="button"
                      onClick={() => handleSwitch(profile.id)}
                      className={`w-full flex items-center justify-between p-3 rounded-2xl border text-left transition-all ${
                        isActive
                          ? 'bg-sky-500/10 border-sky-500 text-sky-600 dark:text-sky-400 shadow-sm'
                          : 'bg-slate-50 dark:bg-slate-800/60 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-100'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className="relative w-9 h-9 rounded-xl overflow-hidden shrink-0 border border-slate-300 dark:border-slate-700">
                          <Image src={profile.avatar} alt={profile.name} fill className="object-cover" />
                        </div>
                        <div>
                          <p className="text-xs font-bold">{profile.name}</p>
                          <p className="text-[11px] text-slate-400">{profile.role}</p>
                        </div>
                      </div>
                      {isActive && <Check className="w-4 h-4 text-sky-500" />}
                    </button>
                  );
                })}
              </div>
            </div>

            {isEditing ? (
              <form onSubmit={handleSaveProfile} className="space-y-3 pt-2 border-t border-slate-100 dark:border-slate-800">
                <div>
                  <label className="text-xs font-semibold text-slate-600 dark:text-slate-400">Full Name</label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 mt-1"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-600 dark:text-slate-400">Role / Title</label>
                  <input
                    type="text"
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 mt-1"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-600 dark:text-slate-400">Bio</label>
                  <textarea
                    value={bio}
                    onChange={(e) => setBio(e.target.value)}
                    rows={2}
                    className="w-full px-3 py-2 text-xs rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 mt-1"
                  />
                </div>
                <div className="flex justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setIsEditing(false)}
                    className="px-3 py-1.5 text-xs text-slate-500"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-1.5 text-xs font-bold rounded-xl bg-sky-500 text-white shadow-sm"
                  >
                    Save Changes
                  </button>
                </div>
              </form>
            ) : (
              <div className="flex items-center justify-between pt-2 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsEditing(true)}
                  className="flex items-center gap-1.5 text-xs font-bold text-sky-500 hover:text-sky-600"
                >
                  <Edit3 className="w-3.5 h-3.5" />
                  <span>{getTranslation(language, 'editProfile')}</span>
                </button>

                <button
                  type="button"
                  onClick={handleLogout}
                  className="flex items-center gap-1.5 text-xs font-bold text-rose-500 hover:text-rose-600"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>{user.isAuthenticated ? getTranslation(language, 'signOut') : 'Guest Mode'}</span>
                </button>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
