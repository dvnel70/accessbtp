import React from 'react';
import { Settings, ArrowRight } from 'lucide-react';

interface AdminBannerProps {
  onOpenAdmin: () => void;
}

export const AdminBanner: React.FC<AdminBannerProps> = ({ onOpenAdmin }) => {
  return (
    <aside aria-label="Administration" className="bg-slate-900 text-white text-xs py-2 px-4 border-b border-slate-800">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
          <span className="font-bold text-slate-100">Espace Admin</span>
        </div>

        <button
          onClick={onOpenAdmin}
          className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md bg-blue-600 hover:bg-blue-500 active:bg-blue-700 text-white font-semibold text-xs transition-colors cursor-pointer"
        >
          <Settings className="w-3.5 h-3.5" />
          <span>Accéder à l&apos;Espace Admin</span>
          <ArrowRight className="w-3 h-3" />
        </button>
      </div>
    </aside>
  );
};
