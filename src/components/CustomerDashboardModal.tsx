import React, { useState, useEffect } from 'react';
import { User, Order } from '../types';
import { api } from '../services/api';
import {
  X,
  User as UserIcon,
  HardDrive,
  ExternalLink,
  DownloadCloud,
  CheckCircle2,
  Clock,
  ShieldCheck,
  LogOut,
  RefreshCw,
  FileText
} from 'lucide-react';

interface CustomerDashboardModalProps {
  user: User;
  onClose: () => void;
  onLogout: () => void;
  onOpenOrderGuide: (order: Order) => void;
}

export const CustomerDashboardModal: React.FC<CustomerDashboardModalProps> = ({
  user,
  onClose,
  onLogout,
  onOpenOrderGuide
}) => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadUserOrders() {
      try {
        setLoading(true);
        const list = await api.getUserOrders(user.email, user.id);
        setOrders(list);
      } catch (err) {
        console.error('Failed to load user orders:', err);
      } finally {
        setLoading(false);
      }
    }
    loadUserOrders();
  }, [user]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto bg-slate-950/75 backdrop-blur-xs">
      <div className="relative w-full max-w-3xl bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden my-6 max-h-[90vh] flex flex-col">
        {/* Top Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 bg-slate-50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center font-bold">
              <UserIcon className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900">
                Mon Espace Client &amp; Mes Logiciels
              </h2>
              <p className="text-xs text-slate-500">
                Connecté en tant que <strong>{user.email}</strong>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onLogout}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs text-slate-600 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Déconnexion</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Scrollable Content */}
        <div className="overflow-y-auto p-6 space-y-6 flex-1">
          {/* User Profile Card */}
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
            <div>
              <span className="text-slate-400 text-[11px] block">Nom du client</span>
              <span className="font-bold text-slate-900 text-sm">{user.name}</span>
            </div>
            <div>
              <span className="text-slate-400 text-[11px] block">Téléphone Wave</span>
              <span className="font-semibold text-slate-800">{user.phone || 'Non renseigné'}</span>
            </div>
            <div>
              <span className="text-slate-400 text-[11px] block">Configuration déclarée</span>
              <span className="text-slate-700 truncate block">{user.computerDetails || 'Standard'}</span>
            </div>
          </div>

          {/* Purchased Software List */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-slate-900">
                Mes achats &amp; Accès Google Drive ({orders.length})
              </h3>
              <span className="text-xs text-slate-500">
                Tous vos logiciels achetés sont conservés ici
              </span>
            </div>

            {loading ? (
              <div className="py-12 text-center text-slate-500 text-xs">
                <RefreshCw className="w-6 h-6 animate-spin mx-auto mb-2 text-blue-500" />
                Chargement de vos logiciels...
              </div>
            ) : orders.length === 0 ? (
              <div className="p-8 text-center bg-slate-50 rounded-2xl border border-slate-200 space-y-2">
                <HardDrive className="w-10 h-10 text-slate-300 mx-auto" />
                <h4 className="text-sm font-bold text-slate-900">Aucun logiciel acheté pour le moment</h4>
                <p className="text-xs text-slate-500 max-w-sm mx-auto">
                  Dès que vous validez une commande avec Wave, vos fichiers Google Drive et guides apparaîtront automatiquement ici.
                </p>
                <div className="pt-2">
                  <button
                    onClick={onClose}
                    className="px-4 py-2 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-xl transition-colors cursor-pointer"
                  >
                    Découvrir le catalogue
                  </button>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                {orders.map((order) => {
                  const isPaid = ['Payée', 'Livraison en cours', 'Livrée'].includes(order.status);
                  return (
                    <div
                      key={order.id}
                      className="p-5 rounded-2xl border border-slate-200 bg-white shadow-xs space-y-4"
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-100">
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-mono text-xs font-bold text-blue-700">
                              {order.reference}
                            </span>
                            <span
                              className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                                isPaid
                                  ? 'bg-emerald-100 text-emerald-800'
                                  : 'bg-amber-100 text-amber-800'
                              }`}
                            >
                              {order.status}
                            </span>
                          </div>
                          <h4 className="text-base font-bold text-slate-900 mt-1">
                            {order.item.softwareName}
                          </h4>
                          <span className="text-xs text-slate-500">{order.item.version}</span>
                        </div>

                        <div className="text-left sm:text-right">
                          <div className="text-sm font-bold text-slate-900 tabular-nums">
                            {order.totalFCFA.toLocaleString('fr-FR')} FCFA
                          </div>
                          <div className="text-[10px] text-slate-400">
                            {new Date(order.createdAt).toLocaleDateString('fr-FR', {
                              day: '2-digit',
                              month: 'short',
                              year: 'numeric'
                            })}
                          </div>
                        </div>
                      </div>

                      {/* Drive Status & Actions */}
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs bg-slate-50 p-3.5 rounded-xl border border-slate-200">
                        <div className="flex items-center gap-2 text-slate-700">
                          <HardDrive className="w-4 h-4 text-blue-600 shrink-0" />
                          <span>
                            Dossier Google Drive :{' '}
                            <strong>
                              {order.driveAccessGranted ? 'Accès autorisé pour votre compte' : 'Attribution des droits en cours'}
                            </strong>
                          </span>
                        </div>

                        <div className="flex items-center gap-2">
                          {isPaid && (
                            <>
                              <a
                                href={order.item.googleDriveUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-slate-950 bg-amber-400 hover:bg-amber-300 rounded-lg shadow-xs transition-colors"
                              >
                                <DownloadCloud className="w-3.5 h-3.5" />
                                <span>Ouvrir Google Drive</span>
                                <ExternalLink className="w-3 h-3" />
                              </a>
                              <button
                                onClick={() => {
                                  onClose();
                                  onOpenOrderGuide(order);
                                }}
                                className="px-3 py-1.5 text-xs font-semibold text-blue-700 bg-blue-50 hover:bg-blue-100 border border-blue-200 rounded-lg transition-colors cursor-pointer"
                              >
                                Détails &amp; Documents
                              </button>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
