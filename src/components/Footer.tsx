import React from 'react';
import { HardDrive, ShieldCheck, Mail, Phone, MessageSquare } from 'lucide-react';

interface FooterProps {
  onOpenAdmin: () => void;
  onOpenLookup: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onOpenAdmin, onOpenLookup }) => {
  return (
    <footer className="bg-slate-900 text-slate-300 border-t border-slate-800 text-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Brand Info */}
          <div className="space-y-3 md:col-span-1">
            <div className="flex items-center gap-2 text-white font-bold text-base">
              <div className="w-6 h-6 rounded bg-blue-600 flex items-center justify-center text-white">
                <HardDrive className="w-3.5 h-3.5" />
              </div>
              <span>LogiSoft</span>
            </div>
            <p className="text-slate-400 text-xs leading-relaxed">
              Plateforme professionnelle de distribution de logiciels et d&apos;assistance à l&apos;installation. Hébergement cloud Google Drive et paiement sécurisé Wave.
            </p>
          </div>

          {/* Navigation Links */}
          <div className="space-y-2">
            <h4 className="text-white font-semibold text-xs uppercase tracking-wider">Navigation</h4>
            <ul className="space-y-1.5 text-slate-400">
              <li>
                <a href="#catalogue" className="hover:text-white transition-colors">
                  Catalogue des logiciels
                </a>
              </li>
              <li>
                <button onClick={onOpenLookup} className="hover:text-white transition-colors cursor-pointer text-left">
                  Suivre ma commande
                </button>
              </li>
              <li>
                <a href="#assistance" className="hover:text-white transition-colors">
                  Foire aux questions (FAQ)
                </a>
              </li>
            </ul>
          </div>

          {/* Legal / Policy */}
          <div className="space-y-2">
            <h4 className="text-white font-semibold text-xs uppercase tracking-wider">Mentions &amp; Licences</h4>
            <p className="text-slate-400 text-[11px] leading-relaxed">
              Notre prestation inclut la préparation des installateurs, l&apos;infrastructure de téléchargement Google Drive, la rédaction des guides et le support technique. Les licences commerciales officielles doivent être régularisées auprès des éditeurs selon vos usages.
            </p>
          </div>

          {/* Support Contacts */}
          <div className="space-y-2">
            <h4 className="text-white font-semibold text-xs uppercase tracking-wider">Assistance Technique</h4>
            <div className="space-y-1.5 text-slate-400 text-xs">
              <div className="flex items-center gap-2">
                <MessageSquare className="w-3.5 h-3.5 text-emerald-400" />
                <span>Support WhatsApp : +225 07 48 92 11 34</span>
              </div>
              <div className="pt-2">
                <button
                  onClick={onOpenAdmin}
                  className="text-slate-400 hover:text-white text-xs underline cursor-pointer"
                >
                  Accès panneau d&apos;administration
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="pt-8 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-slate-500 text-[11px]">
          <div>
            &copy; {new Date().getFullYear()} LogiSoft. Tous droits réservés. Intégration Wave API &amp; Google Drive.
          </div>
          <div className="flex items-center gap-4">
            <span>Paiements certifiés XOF / FCFA</span>
            <span>·</span>
            <span>Assistance AnyDesk</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
