import React, { useState } from 'react';
import { User } from '../types';
import { api } from '../services/api';
import { X, UserPlus, LogIn, HardDrive, Smartphone, AlertCircle, CheckCircle2 } from 'lucide-react';

interface UserAuthModalProps {
  onClose: () => void;
  onAuthSuccess: (user: User) => void;
  initialMode?: 'login' | 'register';
}

export const UserAuthModal: React.FC<UserAuthModalProps> = ({
  onClose,
  onAuthSuccess,
  initialMode = 'login'
}) => {
  const [mode, setMode] = useState<'login' | 'register'>(initialMode);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [computerDetails, setComputerDetails] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    try {
      setLoading(true);
      if (mode === 'register') {
        if (!name.trim()) {
          setError('Veuillez renseigner votre nom complet.');
          return;
        }
        if (!email.trim() || !email.includes('@')) {
          setError('Veuillez renseigner une adresse e-mail valide.');
          return;
        }
        if (!password.trim() || password.length < 4) {
          setError('Le mot de passe doit contenir au moins 4 caractères.');
          return;
        }

        const res = await api.register({
          name: name.trim(),
          email: email.trim().toLowerCase(),
          password: password.trim(),
          phone: phone.trim(),
          computerDetails: computerDetails.trim()
        });

        localStorage.setItem('logisoft_user_token', res.token);
        localStorage.setItem('logisoft_user_email', res.user.email);
        onAuthSuccess(res.user);
      } else {
        if (!email.trim() || !password.trim()) {
          setError('Veuillez saisir votre email et votre mot de passe.');
          return;
        }

        const res = await api.login(email.trim().toLowerCase(), password.trim());
        localStorage.setItem('logisoft_user_token', res.token);
        localStorage.setItem('logisoft_user_email', res.user.email);
        onAuthSuccess(res.user);
      }
    } catch (err: any) {
      setError(err.message || 'Une erreur est survenue lors de l\'authentification.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto bg-slate-950/75 backdrop-blur-xs">
      <div className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden my-6">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 bg-slate-50">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-blue-600 text-white flex items-center justify-center font-bold">
              {mode === 'register' ? <UserPlus className="w-4 h-4" /> : <LogIn className="w-4 h-4" />}
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">
                {mode === 'register' ? 'Créer mon compte client' : 'Connexion à mon compte'}
              </h3>
              <p className="text-[11px] text-slate-500">
                Vos logiciels et droits Google Drive seront synchronisés
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-200 rounded-lg transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Mode Selector Tabs */}
        <div className="grid grid-cols-2 p-1.5 bg-slate-100 border-b border-slate-200 text-xs font-bold">
          <button
            type="button"
            onClick={() => {
              setMode('login');
              setError(null);
            }}
            className={`py-2 rounded-lg transition-all cursor-pointer ${
              mode === 'login' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            Se connecter
          </button>
          <button
            type="button"
            onClick={() => {
              setMode('register');
              setError(null);
            }}
            className={`py-2 rounded-lg transition-all cursor-pointer ${
              mode === 'register' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            Créer un compte
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && (
            <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-700 flex items-start gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-600 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          {mode === 'register' && (
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Nom complet <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                required
                placeholder="Ex : Marc Yao"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3.5 py-2 text-xs bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-colors"
              />
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Adresse e-mail (Gmail de préférence) <span className="text-rose-500">*</span>
            </label>
            <input
              type="email"
              required
              placeholder="votre.email@gmail.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3.5 py-2 text-xs bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-colors"
            />
            {mode === 'register' && (
              <span className="text-[10px] text-slate-500 mt-0.5 inline-block">
                L&apos;accès à vos dossiers Google Drive sera octroyé directement à cette adresse.
              </span>
            )}
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Mot de passe <span className="text-rose-500">*</span>
            </label>
            <input
              type="password"
              required
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-3.5 py-2 text-xs bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-colors"
            />
          </div>

          {mode === 'register' && (
            <>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Numéro de téléphone pour Wave
                </label>
                <input
                  type="tel"
                  placeholder="Ex : +225 07 00 00 00 00"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full px-3.5 py-2 text-xs bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-colors"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Caractéristiques de votre ordinateur (Optionnel)
                </label>
                <input
                  type="text"
                  placeholder="Ex : PC Windows 11, Core i7, 16 Go RAM"
                  value={computerDetails}
                  onChange={(e) => setComputerDetails(e.target.value)}
                  className="w-full px-3.5 py-2 text-xs bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-colors"
                />
              </div>
            </>
          )}

          <div className="pt-2">
            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 px-4 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 active:bg-blue-800 rounded-xl transition-colors cursor-pointer shadow-xs disabled:opacity-50"
            >
              {loading
                ? 'Traitement en cours...'
                : mode === 'register'
                ? 'Créer mon compte et continuer'
                : 'Se connecter'}
            </button>
          </div>

          <div className="text-center pt-2">
            <span className="text-xs text-slate-500">
              {mode === 'register' ? 'Vous avez déjà un compte ?' : 'Pas encore de compte ?'}{' '}
              <button
                type="button"
                onClick={() => {
                  setMode(mode === 'register' ? 'login' : 'register');
                  setError(null);
                }}
                className="font-bold text-blue-600 hover:text-blue-700 underline cursor-pointer"
              >
                {mode === 'register' ? 'Connectez-vous ici' : 'Créer un compte gratuitement'}
              </button>
            </span>
          </div>
        </form>
      </div>
    </div>
  );
};
