import React, { useState, useEffect } from 'react';
import { Software, Order, User } from '../types';
import { api } from '../services/api';
import { X, AlertCircle, HardDrive, UserCheck } from 'lucide-react';

interface CheckoutModalProps {
  software: Software | null;
  currentUser: User | null;
  onClose: () => void;
  onOrderCreated: (order: Order) => void;
  onPromptAuth: () => void;
}

export const CheckoutModal: React.FC<CheckoutModalProps> = ({
  software,
  currentUser,
  onClose,
  onOrderCreated,
  onPromptAuth
}) => {
  const [name, setName] = useState(currentUser?.name || '');
  const [email, setEmail] = useState(currentUser?.email || '');
  const [phone, setPhone] = useState(currentUser?.phone || '');
  const [computerDetails, setComputerDetails] = useState(currentUser?.computerDetails || '');
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (currentUser) {
      setName(currentUser.name);
      setEmail(currentUser.email);
      if (currentUser.phone) setPhone(currentUser.phone);
      if (currentUser.computerDetails) setComputerDetails(currentUser.computerDetails);
    }
  }, [currentUser]);

  if (!software) return null;

  const totalPriceFCFA = software.priceFCFA;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!name.trim()) {
      setError('Veuillez renseigner votre nom complet.');
      return;
    }

    if (!email.trim() || !email.includes('@')) {
      setError('Veuillez fournir une adresse e-mail valide (de préférence @gmail.com pour l\'accès Google Drive).');
      return;
    }

    if (!phone.trim()) {
      setError('Veuillez renseigner votre numéro de téléphone pour le paiement Wave.');
      return;
    }

    try {
      setLoading(true);
      const newOrder = await api.createOrder({
        customerName: name.trim(),
        customerEmail: email.trim().toLowerCase(),
        customerPhone: phone.trim(),
        computerDetails: computerDetails.trim(),
        softwareId: software.id,
        notes: notes.trim(),
        userId: currentUser?.id
      });

      onOrderCreated(newOrder);
    } catch (err: any) {
      setError(err.message || 'Une erreur est survenue lors de la création de la commande.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto bg-slate-950/70 backdrop-blur-xs">
      <div className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden my-6">
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 bg-slate-50/80">
          <div>
            <span className="text-xs font-semibold text-blue-700 uppercase tracking-wider">
              Commande de logiciel
            </span>
            <h2 className="text-lg font-bold text-slate-900">
              Coordonnées de livraison &amp; Paiement Wave
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-200 rounded-lg transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Content */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {error && (
            <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-700 flex items-start gap-2.5">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-rose-600" />
              <span>{error}</span>
            </div>
          )}

          {/* Account status prompt */}
          {currentUser ? (
            <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-800 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <UserCheck className="w-4 h-4 text-emerald-600" />
                <span>
                  Connecté en tant que <strong>{currentUser.email}</strong>. Vos accès Google Drive seront enregistrés sur votre compte.
                </span>
              </div>
            </div>
          ) : (
            <div className="p-3 rounded-xl bg-blue-50 border border-blue-200 text-xs text-blue-800 flex items-center justify-between">
              <span>
                Vous avez un compte ? Connectez-vous pour lier vos achats à votre profil.
              </span>
              <button
                type="button"
                onClick={onPromptAuth}
                className="font-bold underline text-blue-700 hover:text-blue-900 cursor-pointer shrink-0"
              >
                Se connecter
              </button>
            </div>
          )}

          {/* Software Summary Box */}
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-lg bg-slate-900 overflow-hidden shrink-0">
                <img
                  src={software.imagePrimary}
                  alt={software.name}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover"
                />
              </div>
              <div>
                <h4 className="text-sm font-bold text-slate-900">{software.name}</h4>
                <div className="text-xs text-slate-500">
                  {software.version} · Dossier Google Drive ({software.fileSize})
                </div>
              </div>
            </div>

            <div className="text-right shrink-0">
              <div className="text-sm font-extrabold text-slate-900 tabular-nums">
                {software.priceFCFA.toLocaleString('fr-FR')} FCFA
              </div>
              <div className="text-[11px] text-slate-500 font-mono">~{software.priceEUR} €</div>
            </div>
          </div>

          {/* Form Fields */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Nom et prénom <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                required
                placeholder="Ex : Marc Yao"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3.5 py-2 text-xs bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-colors"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Téléphone pour Wave (Mobile Money) <span className="text-rose-500">*</span>
              </label>
              <input
                type="tel"
                required
                placeholder="Ex : +225 07 00 00 00 00"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full px-3.5 py-2 text-xs bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-colors"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Adresse e-mail (Gmail de préférence) <span className="text-rose-500">*</span>
            </label>
            <input
              type="email"
              required
              placeholder="votre.adresse@gmail.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3.5 py-2 text-xs bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-colors"
            />
            <p className="text-[11px] text-slate-500 mt-1 flex items-center gap-1">
              <HardDrive className="w-3 h-3 text-blue-600 inline shrink-0" />
              <span>
                Important : les droits d&apos;accès au dossier Google Drive seront accordés à cette adresse.
              </span>
            </p>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Système de votre ordinateur (Optionnel)
            </label>
            <input
              type="text"
              placeholder="Ex : PC Windows 11 ou Mac M2"
              value={computerDetails}
              onChange={(e) => setComputerDetails(e.target.value)}
              className="w-full px-3.5 py-2 text-xs bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-colors"
            />
          </div>

          {/* Total & Summary Strip */}
          <div className="p-4 rounded-xl bg-slate-900 text-white flex items-center justify-between">
            <div>
              <div className="text-xs text-slate-400 font-medium">Montant total à régler via Wave</div>
              <div className="text-xl font-extrabold tabular-nums tracking-tight text-white">
                {totalPriceFCFA.toLocaleString('fr-FR')}{' '}
                <span className="text-xs font-semibold text-slate-300">FCFA</span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-3.5 py-2 text-xs font-semibold text-slate-300 hover:text-white transition-colors cursor-pointer"
              >
                Annuler
              </button>
              <button
                type="submit"
                disabled={loading}
                className="inline-flex items-center justify-center gap-2 px-5 py-2.5 text-xs font-semibold text-slate-950 bg-amber-400 hover:bg-amber-300 active:bg-amber-500 rounded-xl shadow-xs transition-colors cursor-pointer disabled:opacity-50"
              >
                {loading ? 'Traitement...' : 'Payer avec Wave →'}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
