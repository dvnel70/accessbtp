import React, { useState } from 'react';
import { FAQS } from '../data/initialData';
import { ChevronDown, HelpCircle, HardDrive, Smartphone, ShieldCheck, Headphones } from 'lucide-react';

export const FaqSection: React.FC = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const toggle = (idx: number) => {
    setOpenIndex(openIndex === idx ? null : idx);
  };

  return (
    <section id="assistance" className="py-16 bg-white border-t border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Features Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
          <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200/90 space-y-3">
            <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center">
              <HardDrive className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-slate-900">
              Stockage &amp; Livraison Google Drive
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Vos fichiers d&apos;installation volumineux sont hébergés sur Google Drive. Téléchargez à la vitesse maximale de votre connexion, sans limite de bande passante ni coupure.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200/90 space-y-3">
            <div className="w-10 h-10 rounded-xl bg-sky-100 text-[#0b2b48] flex items-center justify-center font-bold">
              <Smartphone className="w-5 h-5 text-sky-600" />
            </div>
            <h3 className="text-base font-bold text-slate-900">
              Paiement Sécurisé Wave API
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Validation instantanée via l&apos;API Wave Checkout. Chaque commande est protégée par un identifiant unique et une vérification serveur stricte avant déblocage.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200/90 space-y-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center">
              <HardDrive className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-slate-900">
              Documents &amp; Fichiers inclus
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Tous les fichiers d&apos;installation ainsi que les instructions et guides rédigés par le gestionnaire sont directement regroupés dans le dossier Google Drive pour chaque logiciel.
            </p>
          </div>
        </div>

        {/* FAQ Accordion */}
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-10">
            <div className="text-xs font-bold text-blue-700 uppercase tracking-wider mb-1">
              Foire Aux Questions
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900">
              Questions fréquentes sur les commandes &amp; l&apos;installation
            </h2>
            <p className="text-sm text-slate-600 mt-1">
              Tout ce que vous devez savoir avant et après votre achat.
            </p>
          </div>

          <div className="space-y-3">
            {FAQS.map((faq, index) => {
              const isOpen = openIndex === index;
              return (
                <div
                  key={index}
                  className="rounded-xl border border-slate-200 overflow-hidden bg-slate-50/50 transition-colors"
                >
                  <button
                    onClick={() => toggle(index)}
                    className="w-full px-5 py-4 text-left flex items-center justify-between gap-4 cursor-pointer hover:bg-slate-100/60 transition-colors"
                  >
                    <span className="text-sm font-bold text-slate-900">{faq.q}</span>
                    <ChevronDown
                      className={`w-4 h-4 text-slate-500 shrink-0 transition-transform duration-200 ${
                        isOpen ? 'rotate-180 text-blue-600' : ''
                      }`}
                    />
                  </button>

                  {isOpen && (
                    <div className="px-5 pb-5 text-xs text-slate-600 leading-relaxed border-t border-slate-100 pt-3">
                      {faq.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};
