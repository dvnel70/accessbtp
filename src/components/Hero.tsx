import React from 'react';
import { ArrowDown, CheckCircle2, ShieldCheck, DownloadCloud } from 'lucide-react';

interface HeroProps {
  onExplore: () => void;
  onOpenLookup: () => void;
}

export const Hero: React.FC<HeroProps> = ({ onExplore, onOpenLookup }) => {
  return (
    <section className="relative overflow-hidden pt-8 pb-16 lg:pt-12 lg:pb-20 bg-gradient-to-b from-slate-100/60 via-slate-50 to-white border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
          {/* Left Column: Headline and actions */}
          <div className="lg:col-span-7 space-y-6">
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-slate-900 leading-[1.15] text-balance">
              Vente de logiciels professionnels &amp; assistance à l&apos;installation
            </h1>

            <p className="text-base sm:text-lg text-slate-600 leading-relaxed max-w-2xl">
              Accédez aux suites logicielles majeures pour l&apos;architecture, la création graphique, la bureautique et le développement. Fichiers complets hébergés sur <strong>Google Drive</strong>, paiement instantané avec <strong>Wave</strong> et guide d&apos;installation détaillé.
            </p>

            <div className="flex flex-wrap items-center gap-4 pt-2">
              <button
                onClick={onExplore}
                className="inline-flex items-center justify-center gap-2 px-6 py-3.5 text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 active:bg-blue-800 rounded-xl shadow-sm shadow-blue-500/20 transition-all cursor-pointer whitespace-nowrap"
              >
                <span>Découvrir le catalogue</span>
                <ArrowDown className="w-4 h-4" />
              </button>

              <button
                onClick={onOpenLookup}
                className="inline-flex items-center justify-center gap-2 px-5 py-3.5 text-sm font-semibold text-slate-700 bg-white hover:bg-slate-50 active:bg-slate-100 border border-slate-300 rounded-xl shadow-xs transition-all cursor-pointer whitespace-nowrap"
              >
                <DownloadCloud className="w-4 h-4 text-slate-500" />
                <span>Accéder à mes fichiers achetés</span>
              </button>
            </div>

            {/* Trust points */}
            <div className="pt-4 border-t border-slate-200/80 grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs text-slate-600">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Dossiers Google Drive vérifiés</span>
              </div>
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-blue-600 shrink-0" />
                <span>Paiement sécurisé Wave API</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Instructions &amp; Documents inclus</span>
              </div>
            </div>
          </div>

          {/* Right Column: Hero visual asset */}
          <div className="lg:col-span-5 relative">
            <div className="relative rounded-2xl overflow-hidden shadow-xl border border-slate-200/90 bg-slate-900 group">
              <img
                src="/src/assets/images/hero_software_suite_1792444243588.jpg"
                alt="Poste de travail moderne avec logiciels professionnels d'architecture et de création"
                referrerPolicy="no-referrer"
                className="w-full h-[320px] sm:h-[380px] lg:h-[420px] object-cover group-hover:scale-102 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/20 to-transparent pointer-events-none" />

              <div className="absolute bottom-4 left-4 right-4 text-white">
                <div className="flex items-center justify-between text-xs font-medium text-slate-200 bg-slate-900/80 backdrop-blur-md px-3.5 py-2 rounded-lg border border-white/10">
                  <span className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
                    Serveurs Google Drive actifs
                  </span>
                  <span className="tabular-nums font-mono text-emerald-300">Vitesse max 1 Gbps</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
