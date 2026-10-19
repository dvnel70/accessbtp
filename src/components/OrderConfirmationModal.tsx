import React, { useState } from 'react';
import { Order } from '../types';
import {
  X,
  CheckCircle2,
  HardDrive,
  ExternalLink,
  DownloadCloud,
  FolderOpen,
  Copy,
  Check,
  FileText
} from 'lucide-react';

interface OrderConfirmationModalProps {
  order: Order | null;
  onClose: () => void;
}

export const OrderConfirmationModal: React.FC<OrderConfirmationModalProps> = ({ order, onClose }) => {
  const [copiedRef, setCopiedRef] = useState(false);

  if (!order) return null;

  const handleCopyRef = () => {
    navigator.clipboard.writeText(order.reference);
    setCopiedRef(true);
    setTimeout(() => setCopiedRef(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto bg-slate-950/75 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden my-6">
        {/* Top Success Header */}
        <div className="bg-emerald-600 text-white px-6 py-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-xs flex items-center justify-center text-white">
              <CheckCircle2 className="w-6 h-6 text-white" />
            </div>
            <div>
              <div className="text-xs text-emerald-100 font-semibold uppercase tracking-wider">
                Paiement Confirmé avec Succès
              </div>
              <h2 className="text-lg font-bold text-white">
                Accès à vos fichiers &amp; Documents Google Drive
              </h2>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-white/80 hover:text-white hover:bg-white/10 rounded-lg transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Order Reference Card */}
          <div className="flex items-center justify-between p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs">
            <div>
              <div className="text-slate-500 font-medium">Référence de commande</div>
              <div className="flex items-center gap-2 mt-0.5">
                <span className="font-mono font-bold text-slate-900 text-sm">{order.reference}</span>
                <button
                  onClick={handleCopyRef}
                  className="p-1 text-slate-500 hover:text-blue-600 rounded cursor-pointer"
                  title="Copier la référence"
                >
                  {copiedRef ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                </button>
              </div>
            </div>
            <div className="text-right">
              <span className="text-[11px] text-slate-500 font-mono">
                Transaction : {order.waveTransactionId || 'Confirmée'}
              </span>
            </div>
          </div>

          {/* Google Drive Link Box */}
          <div className="p-6 rounded-2xl bg-gradient-to-br from-blue-900 via-indigo-900 to-slate-900 text-white space-y-4 shadow-md">
            <div className="flex items-center gap-2 text-xs text-blue-200 font-medium">
              <HardDrive className="w-4 h-4 text-blue-400" />
              <span>Dossier Cloud Dédié</span>
            </div>

            <div>
              <h3 className="text-xl font-bold tracking-tight text-white">
                {order.item.softwareName}
              </h3>
              <p className="text-xs text-slate-300 mt-1">
                Version : {order.item.version}
              </p>
            </div>

            <p className="text-xs text-blue-100/90 leading-relaxed">
              Les fichiers d&apos;installation ainsi que la documentation et les instructions préparées par le gestionnaire sont directement hébergés sur le dossier Google Drive ci-dessous.
            </p>

            <div className="pt-2">
              <a
                href={order.item.googleDriveUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-3.5 text-sm font-bold text-slate-950 bg-amber-400 hover:bg-amber-300 active:bg-amber-500 rounded-xl transition-all shadow-md"
              >
                <FolderOpen className="w-4 h-4" />
                <span>OUVRIR LE DOSSIER</span>
                <ExternalLink className="w-4 h-4 ml-0.5" />
              </a>
            </div>
          </div>

          {/* Info Card */}
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-700 space-y-2">
            <div className="font-bold text-slate-900 flex items-center gap-1.5">
              <FileText className="w-4 h-4 text-blue-600" />
              <span>Contenu de votre dossier</span>
            </div>
            <ul className="list-disc pl-5 space-y-1 text-slate-600">
              <li>Installateur complet du logiciel (vérifié et sécurisé).</li>
              <li>Document d&apos;instructions et guide d&apos;installation déposé par le gestionnaire.</li>
              <li>Fichiers et compléments nécessaires au fonctionnement du logiciel.</li>
            </ul>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-4 sm:p-5 border-t border-slate-200 bg-slate-50 flex items-center justify-between">
          <div className="text-xs text-slate-500">
            Conservez votre référence <strong className="font-mono text-slate-900">{order.reference}</strong>.
          </div>

          <button
            onClick={onClose}
            className="px-5 py-2 text-xs font-semibold text-slate-700 bg-white hover:bg-slate-100 border border-slate-300 rounded-xl transition-colors cursor-pointer"
          >
            Fermer
          </button>
        </div>
      </div>
    </div>
  );
};
