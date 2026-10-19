import React, { useState } from 'react';
import { Order } from '../types';
import { api } from '../services/api';
import { X, Search, AlertCircle, HardDrive, CheckCircle2, Clock, ArrowRight } from 'lucide-react';

interface OrderLookupModalProps {
  onClose: () => void;
  onOpenOrder: (order: Order) => void;
}

export const OrderLookupModal: React.FC<OrderLookupModalProps> = ({ onClose, onOpenOrder }) => {
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [orderResult, setOrderResult] = useState<Order | null>(null);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;

    try {
      setLoading(true);
      setError(null);
      setOrderResult(null);
      const res = await api.getOrder(query.trim());
      setOrderResult(res);
    } catch (err: any) {
      setError(err.message || 'Aucune commande trouvée avec cette référence ou cet e-mail.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto bg-slate-950/70 backdrop-blur-xs">
      <div className="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden my-6">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 bg-slate-50">
          <div className="flex items-center gap-2.5">
            <Search className="w-5 h-5 text-blue-600" />
            <h3 className="text-base font-bold text-slate-900">Suivi de commande &amp; Accès Fichiers</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-200 rounded-lg transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <div className="p-6 space-y-5">
          <form onSubmit={handleSearch} className="space-y-3">
            <label className="block text-xs font-semibold text-slate-700">
              Référence de commande (ex: CMD-2026-XXXX) ou adresse e-mail :
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                required
                placeholder="CMD-2026-... ou votre.email@gmail.com"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="flex-1 px-3.5 py-2 text-xs bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-colors"
              />
              <button
                type="submit"
                disabled={loading}
                className="px-4 py-2 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 active:bg-blue-800 rounded-xl transition-colors cursor-pointer disabled:opacity-50 whitespace-nowrap"
              >
                {loading ? 'Recherche...' : 'Rechercher'}
              </button>
            </div>
            <p className="text-[11px] text-slate-500">
              Saisissez la référence reçue lors de votre commande ou votre e-mail pour retrouver vos fichiers Google Drive.
            </p>
          </form>

          {error && (
            <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-700 flex items-start gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-600 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          {orderResult && (
            <div className="p-4 rounded-xl border border-slate-200 bg-slate-50 space-y-3 animate-in fade-in">
              <div className="flex items-center justify-between pb-2 border-b border-slate-200">
                <span className="font-mono font-bold text-slate-900 text-sm">
                  {orderResult.reference}
                </span>
                <span
                  className={`text-xs font-semibold px-2.5 py-0.5 rounded-full ${
                    orderResult.status === 'Payée' || orderResult.status === 'Livrée' || orderResult.status === 'Livraison en cours'
                      ? 'bg-emerald-100 text-emerald-800'
                      : orderResult.status === 'En attente'
                      ? 'bg-amber-100 text-amber-800'
                      : 'bg-rose-100 text-rose-800'
                  }`}
                >
                  {orderResult.status}
                </span>
              </div>

              <div className="text-xs space-y-1 text-slate-700">
                <div>
                  <strong>Logiciel :</strong> {orderResult.item.softwareName} ({orderResult.item.version})
                </div>
                <div>
                  <strong>Client :</strong> {orderResult.customerName} ({orderResult.customerEmail})
                </div>
                <div>
                  <strong>Montant Wave :</strong> {orderResult.totalFCFA.toLocaleString('fr-FR')} FCFA
                </div>
                <div className="flex items-center gap-1.5 text-blue-700 font-medium pt-1">
                  <HardDrive className="w-3.5 h-3.5" />
                  <span>
                    Google Drive : {orderResult.driveAccessGranted ? 'Accès débloqué' : 'En attente d\'attribution'}
                  </span>
                </div>
              </div>

              {['Payée', 'Livraison en cours', 'Livrée'].includes(orderResult.status) ? (
                <button
                  onClick={() => {
                    onClose();
                    onOpenOrder(orderResult);
                  }}
                  className="w-full inline-flex items-center justify-center gap-2 py-2.5 px-4 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl transition-colors cursor-pointer shadow-xs"
                >
                  <span>Accéder aux fichiers &amp; Dossier Google Drive</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              ) : (
                <div className="p-2.5 rounded-lg bg-amber-50 border border-amber-200 text-[11px] text-amber-800">
                  Cette commande est encore en attente de validation de paiement Wave.
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
