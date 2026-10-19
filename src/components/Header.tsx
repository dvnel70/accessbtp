import React from 'react';
import { HardDrive, Search, User as UserIcon, UserCheck, LogIn } from 'lucide-react';
import { User } from '../types';

interface HeaderProps {
  currentUser: User | null;
  onOpenAuth: () => void;
  onOpenUserDashboard: () => void;
  onOpenAdmin: () => void;
  onOpenLookup: () => void;
  onSelectCategory: (cat: string) => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentUser,
  onOpenAuth,
  onOpenUserDashboard,
  onOpenAdmin,
  onOpenLookup,
  onSelectCategory
}) => {
  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-8 h-16">
          {/* Zone 1: Single text wordmark */}
          <a
            href="/"
            onClick={(e) => {
              e.preventDefault();
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className="flex items-center gap-2.5 text-xl font-bold tracking-tight text-slate-900 whitespace-nowrap shrink-0 group"
          >
            <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white shadow-sm shadow-blue-500/20 group-hover:bg-blue-700 transition-colors">
              <HardDrive className="w-4 h-4" />
            </div>
            <span>LogiSoft</span>
            <span className="text-xs font-semibold px-2 py-0.5 rounded bg-blue-50 text-blue-700 border border-blue-200/60 hidden sm:inline-block">
              Store &amp; Support
            </span>
          </a>

          {/* Zone 2: Clean single-line text links (Processus & Livraison Drive removed as requested) */}
          <nav className="hidden md:flex items-center gap-7 text-sm font-medium text-slate-600">
            <a
              href="#catalogue"
              onClick={() => onSelectCategory('Tous')}
              className="hover:text-blue-600 transition-colors whitespace-nowrap shrink-0"
            >
              Catalogue Logiciels
            </a>
            <a
              href="#assistance"
              className="hover:text-blue-600 transition-colors whitespace-nowrap shrink-0"
            >
              Assistance &amp; FAQ
            </a>
            <button
              onClick={onOpenLookup}
              className="flex items-center gap-1.5 text-slate-700 hover:text-blue-600 transition-colors whitespace-nowrap shrink-0 cursor-pointer"
            >
              <Search className="w-3.5 h-3.5" />
              <span>Suivre ma commande</span>
            </button>
          </nav>

          {/* Zone 3: 1 primary action / User Account & Admin */}
          <div className="flex items-center gap-3 shrink-0">
            {currentUser ? (
              <button
                onClick={onOpenUserDashboard}
                className="flex items-center gap-2 px-3 py-1.5 text-xs font-semibold text-blue-700 bg-blue-50 hover:bg-blue-100 border border-blue-200 rounded-lg transition-colors whitespace-nowrap shrink-0 cursor-pointer"
              >
                <UserIcon className="w-3.5 h-3.5" />
                <span className="max-w-[120px] truncate">{currentUser.name}</span>
                <span className="text-[10px] bg-blue-200/60 px-1.5 py-0.2 rounded font-bold">
                  Mes Achats
                </span>
              </button>
            ) : (
              <button
                onClick={onOpenAuth}
                className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 active:bg-blue-800 rounded-lg shadow-xs transition-colors whitespace-nowrap shrink-0 cursor-pointer"
              >
                <LogIn className="w-3.5 h-3.5" />
                <span>Connexion / Inscription</span>
              </button>
            )}

            <button
              onClick={onOpenAdmin}
              className="hidden sm:flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 border border-slate-200 rounded-lg transition-colors whitespace-nowrap shrink-0 cursor-pointer"
              title="Panneau d'administration"
            >
              <UserCheck className="w-3.5 h-3.5 text-slate-500" />
              <span>Admin</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
