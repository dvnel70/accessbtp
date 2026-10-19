import React, { useState, useEffect } from 'react';
import { Order, WaveCheckoutResponse } from '../types';
import { api } from '../services/api';
import {
  X,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  QrCode,
  Smartphone,
  RefreshCw,
  Copy,
  Check,
  Send
} from 'lucide-react';

interface WavePaymentModalProps {
  order: Order | null;
  onClose: () => void;
  onPaymentSuccess: (updatedOrder: Order) => void;
}

export const WavePaymentModal: React.FC<WavePaymentModalProps> = ({ order, onClose, onPaymentSuccess }) => {
  const [waveSession, setWaveSession] = useState<WaveCheckoutResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [verifying, setVerifying] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [step, setStep] = useState<'checkout' | 'processing' | 'failed'>('checkout');
  const [copiedPhone, setCopiedPhone] = useState(false);
  const [copiedRef, setCopiedRef] = useState(false);
  const [txIdInput, setTxIdInput] = useState('');

  useEffect(() => {
    if (!order) return;

    let isMounted = true;
    async function initWave() {
      try {
        setLoading(true);
        setError(null);
        const session = await api.createWaveCheckoutSession(order!.id);
        if (isMounted) {
          setWaveSession(session);
        }
      } catch (err: any) {
        if (isMounted) {
          setError(err.message || 'Impossible d\'initialiser le paiement Wave.');
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }

    initWave();

    return () => {
      isMounted = false;
    };
  }, [order]);

  if (!order) return null;

  const merchantPhone = waveSession?.waveMerchantPhone || '+225 07 48 92 11 34';
  const isDirectPhoneMode = waveSession?.waveMode === 'phone_transfer';

  const copyToClipboard = (text: string, type: 'phone' | 'ref') => {
    navigator.clipboard.writeText(text);
    if (type === 'phone') {
      setCopiedPhone(true);
      setTimeout(() => setCopiedPhone(false), 2000);
    } else {
      setCopiedRef(true);
      setTimeout(() => setCopiedRef(false), 2000);
    }
  };

  const handleSimulatePayment = async (success: boolean) => {
    try {
      setVerifying(true);
      setError(null);

      // Simulate webhook call to backend with generated or entered tx id
      const tx = txIdInput.trim() || waveSession?.waveTransactionId || `WAVE_TX_${Date.now()}`;
      const result = await api.simulateWaveWebhook(order.id, success, tx);

      if (success) {
        setStep('processing');
        // Authoritative verification call from server
        const verification = await api.verifyWavePayment(order.id);
        if (verification.isPaid) {
          setTimeout(() => {
            onPaymentSuccess(result.order);
          }, 800);
        } else {
          setError('Le serveur Wave indique que le paiement n\'a pas encore été validé.');
          setStep('checkout');
        }
      } else {
        setStep('failed');
      }
    } catch (err: any) {
      setError(err.message || 'Erreur lors de la vérification de la transaction.');
      setStep('checkout');
    } finally {
      setVerifying(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto bg-slate-950/75 backdrop-blur-xs">
      <div className="relative w-full max-w-xl bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden my-6">
        {/* Top Wave Branded Header */}
        <div className="bg-[#0b2b48] text-white px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-[#1dc4ff] flex items-center justify-center font-black text-slate-950 text-base shadow-sm">
              W
            </div>
            <div>
              <div className="text-xs text-sky-200 font-medium">Paiement Mobile Wave</div>
              <h3 className="text-base font-bold text-white tracking-tight">
                {isDirectPhoneMode ? 'Transfert Wave Marchand' : 'Wave Checkout API'}
              </h3>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white hover:bg-white/10 rounded-lg transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-5">
          {error && (
            <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-700 flex items-start gap-2">
              <AlertTriangle className="w-4 h-4 shrink-0 text-rose-600 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          {loading ? (
            <div className="py-12 text-center space-y-3">
              <RefreshCw className="w-8 h-8 text-sky-500 animate-spin mx-auto" />
              <p className="text-xs text-slate-600 font-medium">
                Génération des informations de paiement Wave...
              </p>
            </div>
          ) : step === 'failed' ? (
            <div className="py-8 text-center space-y-4">
              <div className="w-14 h-14 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center mx-auto">
                <AlertTriangle className="w-7 h-7" />
              </div>
              <div>
                <h4 className="text-base font-bold text-slate-900">Paiement Wave non validé</h4>
                <p className="text-xs text-slate-600 mt-1 max-w-md mx-auto">
                  La transaction n&apos;a pas été confirmée. Aucun montant n&apos;a été retenu. Vous pouvez réessayer à tout moment.
                </p>
              </div>
              <div className="flex items-center justify-center gap-3 pt-2">
                <button
                  onClick={() => setStep('checkout')}
                  className="px-4 py-2 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors cursor-pointer"
                >
                  Réessayer
                </button>
                <button
                  onClick={onClose}
                  className="px-4 py-2 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
                >
                  Fermer
                </button>
              </div>
            </div>
          ) : (
            <>
              {/* Order Recap Banner */}
              <div className="p-4 rounded-xl bg-sky-50/70 border border-sky-200/80 flex items-center justify-between">
                <div>
                  <div className="text-[11px] text-sky-800 font-medium">Référence de Commande</div>
                  <div className="flex items-center gap-1.5 mt-0.5">
                    <span className="text-sm font-mono font-bold text-slate-900">{order.reference}</span>
                    <button
                      type="button"
                      onClick={() => copyToClipboard(order.reference, 'ref')}
                      className="text-slate-400 hover:text-blue-600 p-0.5"
                    >
                      {copiedRef ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                  <div className="text-xs text-slate-600 mt-0.5">
                    Logiciel : <strong>{order.item.softwareName}</strong>
                  </div>
                </div>

                <div className="text-right">
                  <div className="text-[11px] text-sky-800 font-medium">Montant à régler</div>
                  <div className="text-2xl font-extrabold text-slate-900 tabular-nums">
                    {order.totalFCFA.toLocaleString('fr-FR')}{' '}
                    <span className="text-xs font-bold text-sky-700">FCFA</span>
                  </div>
                </div>
              </div>

              {/* Direct Wave Merchant Phone Mode OR QR Checkout */}
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-4">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-xs text-slate-900 flex items-center gap-1.5">
                    <Smartphone className="w-4 h-4 text-sky-600" />
                    <span>Instructions de paiement Wave</span>
                  </span>
                  <span className="text-[11px] text-emerald-700 font-semibold bg-emerald-100/70 px-2 py-0.5 rounded">
                    0% de frais Wave
                  </span>
                </div>

                {/* Step instructions */}
                <div className="space-y-2 text-xs text-slate-700">
                  <div className="flex items-start gap-2.5 p-2 rounded-lg bg-white border border-slate-200">
                    <div className="w-5 h-5 rounded-full bg-blue-100 text-blue-700 font-bold flex items-center justify-center shrink-0 text-[10px]">
                      1
                    </div>
                    <div className="flex-1">
                      <span>Ouvrez votre application Wave sur votre téléphone et envoyez le montant exact vers :</span>
                      <div className="flex items-center gap-2 mt-1">
                        <strong className="text-slate-900 font-mono text-sm">{merchantPhone}</strong>
                        <button
                          type="button"
                          onClick={() => copyToClipboard(merchantPhone, 'phone')}
                          className="px-2 py-0.5 rounded bg-slate-100 hover:bg-slate-200 text-[11px] font-semibold text-slate-700 flex items-center gap-1 cursor-pointer"
                        >
                          {copiedPhone ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                          <span>{copiedPhone ? 'Copié' : 'Copier'}</span>
                        </button>
                      </div>
                      <span className="text-[10px] text-slate-500">Bénéficiaire : LogiSoft Distribution</span>
                    </div>
                  </div>

                  <div className="flex items-start gap-2.5 p-2 rounded-lg bg-white border border-slate-200">
                    <div className="w-5 h-5 rounded-full bg-blue-100 text-blue-700 font-bold flex items-center justify-center shrink-0 text-[10px]">
                      2
                    </div>
                    <div>
                      <span>Mentionnez obligatoirement votre référence dans la note Wave :</span>{' '}
                      <strong className="font-mono text-blue-700">{order.reference}</strong>
                    </div>
                  </div>
                </div>

                {/* Transaction ID input (optional for user) */}
                <div>
                  <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                    ID de transaction Wave reçu par SMS (facultatif) :
                  </label>
                  <input
                    type="text"
                    placeholder="Ex: WAVE_TRX_98214..."
                    value={txIdInput}
                    onChange={(e) => setTxIdInput(e.target.value)}
                    className="w-full px-3 py-1.5 text-xs bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500 font-mono"
                  />
                </div>
              </div>

              {/* Action Validation / Testing */}
              <div className="p-3.5 rounded-xl bg-amber-50 border border-amber-200/80 space-y-2">
                <div className="flex items-center justify-between text-xs font-semibold text-amber-900">
                  <span>Validation du paiement :</span>
                  <span className="text-[10px] bg-amber-200/70 text-amber-900 px-1.5 py-0.5 rounded">
                    Validation instantanée
                  </span>
                </div>

                <div className="flex items-center gap-2 pt-1">
                  <button
                    type="button"
                    disabled={verifying}
                    onClick={() => handleSimulatePayment(true)}
                    className="flex-1 inline-flex items-center justify-center gap-1.5 px-3 py-2.5 text-xs font-bold text-slate-950 bg-emerald-400 hover:bg-emerald-300 active:bg-emerald-500 rounded-lg shadow-xs transition-colors cursor-pointer disabled:opacity-50"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    <span>{verifying ? 'Vérification...' : 'Confirmer mon paiement Wave (Valider)'}</span>
                  </button>

                  <button
                    type="button"
                    disabled={verifying}
                    onClick={() => handleSimulatePayment(false)}
                    className="px-3 py-2 text-xs font-semibold text-rose-700 bg-rose-100 hover:bg-rose-200 rounded-lg transition-colors cursor-pointer disabled:opacity-50"
                  >
                    Annuler
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
