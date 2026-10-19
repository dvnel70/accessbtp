import React, { useState } from 'react';
import { Software } from '../types';
import { X, Check, Monitor, Cpu, HardDrive, ShieldCheck, ShoppingCart, Layers, ExternalLink } from 'lucide-react';

interface SoftwareDetailModalProps {
  software: Software | null;
  onClose: () => void;
  onBuy: (software: Software) => void;
}

export const SoftwareDetailModal: React.FC<SoftwareDetailModalProps> = ({ software, onClose, onBuy }) => {
  const [activeImageIndex, setActiveImageIndex] = useState<0 | 1>(0);
  const [activeTab, setActiveTab] = useState<'details' | 'specs' | 'included'>('details');

  if (!software) return null;

  const currentImage = activeImageIndex === 0 ? software.imagePrimary : software.imageSecondary;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto bg-slate-950/70 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="relative w-full max-w-4xl bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden my-8 max-h-[90vh] flex flex-col">
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 bg-slate-50/80">
          <div className="flex items-center gap-3">
            <span className="text-xs font-semibold px-2.5 py-0.5 rounded bg-blue-100 text-blue-800">
              {software.category}
            </span>
            <span className="text-xs text-slate-500">Version {software.version}</span>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-200 rounded-lg transition-colors cursor-pointer"
            aria-label="Fermer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Scrollable Body */}
        <div className="overflow-y-auto p-6 space-y-6 flex-1">
          {/* Top Title & Price Bar */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
            <div>
              <h2 className="text-2xl font-extrabold tracking-tight text-slate-900">
                {software.name}
              </h2>
              <p className="text-sm text-slate-600 mt-0.5">{software.shortDescription}</p>
            </div>

            <div className="text-left sm:text-right shrink-0 bg-blue-50/60 p-3 rounded-xl border border-blue-100">
              <div className="text-[11px] text-blue-700 font-medium">Prix forfaitaire</div>
              <div className="text-2xl font-extrabold text-slate-900 tabular-nums">
                {software.priceFCFA.toLocaleString('fr-FR')}{' '}
                <span className="text-sm font-semibold text-slate-600">FCFA</span>
              </div>
              <div className="text-xs text-slate-500 font-mono">~{software.priceEUR} € · Paiement Wave</div>
            </div>
          </div>

          {/* Dual Image Gallery (Specification requirement: 2 images illustrating interface/features) */}
          <div className="space-y-3">
            <div className="relative aspect-[16/9] sm:aspect-[21/9] rounded-xl overflow-hidden bg-slate-950 border border-slate-200">
              <img
                src={currentImage}
                alt={`${software.name} - Vue ${activeImageIndex + 1}`}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover transition-all duration-300"
              />
              <div className="absolute bottom-3 left-3 bg-slate-900/80 backdrop-blur-md px-3 py-1 rounded text-xs text-white font-medium">
                {activeImageIndex === 0 ? 'Image 1 : Interface principale & Espaces de travail' : 'Image 2 : Outils avancés & Rendu'}
              </div>
            </div>

            {/* Thumbnail selector for the 2 images */}
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => setActiveImageIndex(0)}
                className={`p-2 rounded-xl border text-left flex items-center gap-3 transition-all cursor-pointer ${
                  activeImageIndex === 0
                    ? 'border-blue-600 bg-blue-50/50 shadow-xs ring-1 ring-blue-500'
                    : 'border-slate-200 hover:border-slate-300 bg-slate-50'
                }`}
              >
                <div className="w-14 h-10 rounded overflow-hidden bg-slate-900 shrink-0">
                  <img
                    src={software.imagePrimary}
                    alt="Capture 1"
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="text-xs">
                  <div className="font-semibold text-slate-900">Capture d&apos;écran 1</div>
                  <div className="text-[11px] text-slate-500">Interface principale de travail</div>
                </div>
              </button>

              <button
                onClick={() => setActiveImageIndex(1)}
                className={`p-2 rounded-xl border text-left flex items-center gap-3 transition-all cursor-pointer ${
                  activeImageIndex === 1
                    ? 'border-blue-600 bg-blue-50/50 shadow-xs ring-1 ring-blue-500'
                    : 'border-slate-200 hover:border-slate-300 bg-slate-50'
                }`}
              >
                <div className="w-14 h-10 rounded overflow-hidden bg-slate-900 shrink-0">
                  <img
                    src={software.imageSecondary}
                    alt="Capture 2"
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="text-xs">
                  <div className="font-semibold text-slate-900">Capture d&apos;écran 2</div>
                  <div className="text-[11px] text-slate-500">Fonctionnalités avancées &amp; modules</div>
                </div>
              </button>
            </div>
          </div>

          {/* Navigation Tabs */}
          <div className="flex border-b border-slate-200 gap-6 text-sm font-semibold">
            <button
              onClick={() => setActiveTab('details')}
              className={`pb-2.5 transition-colors cursor-pointer ${
                activeTab === 'details'
                  ? 'border-b-2 border-blue-600 text-blue-600'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              Fonctionnalités &amp; Description
            </button>
            <button
              onClick={() => setActiveTab('specs')}
              className={`pb-2.5 transition-colors cursor-pointer ${
                activeTab === 'specs'
                  ? 'border-b-2 border-blue-600 text-blue-600'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              Configuration minimale &amp; recommandée
            </button>
            <button
              onClick={() => setActiveTab('included')}
              className={`pb-2.5 transition-colors cursor-pointer ${
                activeTab === 'included'
                  ? 'border-b-2 border-blue-600 text-blue-600'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              Éléments inclus dans l&apos;offre
            </button>
          </div>

          {/* Tab 1: Description & Features */}
          {activeTab === 'details' && (
            <div className="space-y-4">
              <p className="text-sm text-slate-700 leading-relaxed">{software.fullDescription}</p>

              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 mb-3">
                  Points forts et fonctionnalités clés :
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {software.features.map((feat, i) => (
                    <div
                      key={i}
                      className="p-3 rounded-xl bg-slate-50 border border-slate-200/80 text-xs text-slate-800 flex items-start gap-2.5"
                    >
                      <Check className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                      <span>{feat}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* OS Compatibility */}
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs">
                <span className="font-bold text-slate-900">Systèmes d&apos;exploitation supportés :</span>
                <div className="flex flex-wrap gap-2 mt-2">
                  {software.osCompatibility.map((os) => (
                    <span
                      key={os}
                      className="px-2.5 py-1 bg-white rounded-lg border border-slate-300 font-medium text-slate-800"
                    >
                      {os}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Tab 2: Technical Specifications (Min vs Recommended) */}
          {activeTab === 'specs' && (
            <div className="space-y-4">
              <p className="text-xs text-slate-500">
                Vérifiez attentivement les spécifications ci-dessous pour vous assurer que votre ordinateur exécutera ce logiciel dans des conditions optimales.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Minimal Specs */}
                <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/60 space-y-3">
                  <div className="flex items-center justify-between pb-2 border-b border-slate-200">
                    <span className="font-bold text-sm text-slate-900">Configuration minimale</span>
                    <span className="text-[11px] text-amber-700 font-semibold bg-amber-50 px-2 py-0.5 rounded">
                      Pour démarrer
                    </span>
                  </div>

                  <dl className="space-y-2 text-xs">
                    <div>
                      <dt className="text-slate-500 font-medium">Système d&apos;exploitation</dt>
                      <dd className="font-semibold text-slate-900">{software.minSpecs.os}</dd>
                    </div>
                    <div>
                      <dt className="text-slate-500 font-medium">Processeur (CPU)</dt>
                      <dd className="font-semibold text-slate-900">{software.minSpecs.cpu}</dd>
                    </div>
                    <div>
                      <dt className="text-slate-500 font-medium">Mémoire vive (RAM)</dt>
                      <dd className="font-semibold text-slate-900">{software.minSpecs.ram}</dd>
                    </div>
                    <div>
                      <dt className="text-slate-500 font-medium">Carte graphique (GPU)</dt>
                      <dd className="font-semibold text-slate-900">{software.minSpecs.gpu}</dd>
                    </div>
                    <div>
                      <dt className="text-slate-500 font-medium">Stockage disque</dt>
                      <dd className="font-semibold text-slate-900">{software.minSpecs.storage}</dd>
                    </div>
                  </dl>
                </div>

                {/* Recommended Specs */}
                <div className="p-4 rounded-xl border border-blue-200 bg-blue-50/30 space-y-3">
                  <div className="flex items-center justify-between pb-2 border-b border-blue-200/60">
                    <span className="font-bold text-sm text-blue-900">Configuration recommandée</span>
                    <span className="text-[11px] text-blue-700 font-semibold bg-blue-100/80 px-2 py-0.5 rounded">
                      Fluidité maximale
                    </span>
                  </div>

                  <dl className="space-y-2 text-xs">
                    <div>
                      <dt className="text-blue-700 font-medium">Système d&apos;exploitation</dt>
                      <dd className="font-semibold text-slate-900">{software.recommendedSpecs.os}</dd>
                    </div>
                    <div>
                      <dt className="text-blue-700 font-medium">Processeur (CPU)</dt>
                      <dd className="font-semibold text-slate-900">{software.recommendedSpecs.cpu}</dd>
                    </div>
                    <div>
                      <dt className="text-blue-700 font-medium">Mémoire vive (RAM)</dt>
                      <dd className="font-semibold text-slate-900">{software.recommendedSpecs.ram}</dd>
                    </div>
                    <div>
                      <dt className="text-blue-700 font-medium">Carte graphique (GPU)</dt>
                      <dd className="font-semibold text-slate-900">{software.recommendedSpecs.gpu}</dd>
                    </div>
                    <div>
                      <dt className="text-blue-700 font-medium">Stockage disque</dt>
                      <dd className="font-semibold text-slate-900">{software.recommendedSpecs.storage}</dd>
                    </div>
                  </dl>
                </div>
              </div>
            </div>
          )}

          {/* Tab 3: Included Items & Delivery Terms */}
          {activeTab === 'included' && (
            <div className="space-y-4">
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
                <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-3">
                  Ce que vous recevez après confirmation de votre paiement :
                </h4>
                <div className="space-y-2.5">
                  {software.includedItems.map((item, idx) => (
                    <div key={idx} className="flex items-start gap-2.5 text-xs text-slate-800">
                      <div className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0 mt-0.5">
                        <Check className="w-3 h-3" />
                      </div>
                      <span className="pt-0.5">{item}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Legal Notice regarding Google Drive & Licences */}
              <div className="p-3.5 rounded-xl bg-amber-50/70 border border-amber-200 text-xs text-amber-900 leading-relaxed">
                <strong>Information importante sur la livraison et les licences :</strong> Les fichiers sont stockés sur un dossier Google Drive privé pour préserver la bande passante et vous offrir un téléchargement haut débit. Dès confirmation du paiement Wave, l&apos;accès vous est transmis. Les licences officielles d&apos;utilisation finale doivent être acquises auprès des éditeurs respectifs si votre usage professionnel l&apos;exige.
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer with Action */}
        <div className="p-4 sm:p-6 border-t border-slate-200 bg-slate-50/90 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="text-xs text-slate-500">
            Taille du dossier : <strong className="text-slate-800 font-mono">{software.fileSize}</strong> · Livraison via <strong>Google Drive</strong>
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto">
            <button
              onClick={onClose}
              className="flex-1 sm:flex-none px-4 py-2.5 text-xs font-semibold text-slate-700 hover:bg-slate-200/80 rounded-xl transition-colors cursor-pointer"
            >
              Fermer
            </button>
            <button
              onClick={() => {
                onClose();
                onBuy(software);
              }}
              className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 px-6 py-2.5 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 active:bg-blue-800 rounded-xl shadow-xs transition-colors cursor-pointer whitespace-nowrap"
            >
              <ShoppingCart className="w-4 h-4" />
              <span>Acheter avec Wave ({software.priceFCFA.toLocaleString('fr-FR')} FCFA)</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
