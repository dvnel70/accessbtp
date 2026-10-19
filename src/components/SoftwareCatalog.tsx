import React, { useState } from 'react';
import { Software } from '../types';
import { Monitor, Apple, HardDrive, Info, ShoppingCart, Check, Search } from 'lucide-react';

interface SoftwareCatalogProps {
  softwares: Software[];
  selectedCategory: string;
  onSelectCategory: (cat: string) => void;
  onOpenDetail: (software: Software) => void;
  onBuy: (software: Software) => void;
}

const CATEGORIES = [
  'Tous',
  'CAO & Architecture',
  'Création & Multimédia',
  'Bureautique & Gestion',
  'Développement & IT'
];

export const SoftwareCatalog: React.FC<SoftwareCatalogProps> = ({
  softwares,
  selectedCategory,
  onSelectCategory,
  onOpenDetail,
  onBuy
}) => {
  const [searchTerm, setSearchTerm] = useState('');

  const filtered = softwares.filter((s) => {
    const matchCat = selectedCategory === 'Tous' || s.category === selectedCategory;
    const matchSearch =
      s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.version.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.shortDescription.toLowerCase().includes(searchTerm.toLowerCase());
    return matchCat && matchSearch;
  });

  return (
    <section id="catalogue" className="py-16 bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
          <div>
            <div className="text-xs font-bold text-blue-700 tracking-wider uppercase mb-1">
              Catalogue Officiel
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900">
              Logiciels disponibles au téléchargement
            </h2>
            <p className="text-sm text-slate-600 mt-1 max-w-xl">
              Chaque logiciel comprend les installateurs complets vérifiés, l&apos;accès à son dossier Google Drive privé et le guide d&apos;installation pas à pas.
            </p>
          </div>

          {/* Search box */}
          <div className="relative w-full md:w-72">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Rechercher un logiciel..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9.5 pr-4 py-2 text-sm bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-colors shadow-xs"
            />
          </div>
        </div>

        {/* Filter Tabs (Interactive Filter Controls) */}
        <div className="flex items-center gap-1.5 p-1.5 bg-slate-200/70 rounded-xl overflow-x-auto mb-10 scrollbar-none">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => onSelectCategory(cat)}
              className={`px-3.5 py-2 text-xs font-semibold rounded-lg transition-all whitespace-nowrap shrink-0 cursor-pointer ${
                selectedCategory === cat
                  ? 'bg-white text-slate-900 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-white/50'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Product Grid */}
        {filtered.length === 0 ? (
          <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center max-w-md mx-auto">
            <HardDrive className="w-12 h-12 text-slate-300 mx-auto mb-3" />
            <h3 className="text-base font-semibold text-slate-900 mb-1">Aucun logiciel trouvé</h3>
            <p className="text-xs text-slate-500 mb-4">
              Aucun résultat ne correspond à votre recherche. Essayez un autre terme ou réinitialisez les filtres.
            </p>
            <button
              onClick={() => {
                setSearchTerm('');
                onSelectCategory('Tous');
              }}
              className="text-xs font-semibold text-blue-600 hover:text-blue-700 underline"
            >
              Réinitialiser les filtres
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filtered.map((software) => (
              <div
                key={software.id}
                className="bg-white rounded-2xl border border-slate-200/90 shadow-xs hover:shadow-md transition-all duration-200 flex flex-col overflow-hidden group"
              >
                {/* Product Image Area */}
                <div className="relative aspect-[4/3] bg-slate-950 overflow-hidden cursor-pointer" onClick={() => onOpenDetail(software)}>
                  <img
                    src={software.imagePrimary}
                    alt={software.name}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover group-hover:scale-103 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-transparent" />

                  {/* Top metadata tags */}
                  <div className="absolute top-3 left-3 right-3 flex items-center justify-between text-xs">
                    <span className="font-semibold text-[11px] text-white/90 bg-slate-900/80 backdrop-blur-md px-2.5 py-1 rounded-md border border-white/10">
                      {software.category}
                    </span>
                    <span className="font-mono text-[11px] text-emerald-300 bg-slate-900/80 backdrop-blur-md px-2 py-0.5 rounded-md border border-white/10">
                      Drive {software.fileSize}
                    </span>
                  </div>

                  {/* Bottom Image Caption */}
                  <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-white text-xs">
                    <span className="font-semibold">{software.version}</span>
                    <span className="text-slate-300 text-[11px]">2 captures d&apos;écran</span>
                  </div>
                </div>

                {/* Card Body */}
                <div className="p-5 flex-1 flex flex-col justify-between">
                  <div className="space-y-2.5">
                    <h3
                      onClick={() => onOpenDetail(software)}
                      className="text-lg font-bold text-slate-900 tracking-tight hover:text-blue-600 transition-colors cursor-pointer"
                    >
                      {software.name}
                    </h3>

                    <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                      {software.shortDescription}
                    </p>

                    {/* Features list preview */}
                    <div className="space-y-1.5 pt-2 border-t border-slate-100">
                      {software.features.slice(0, 3).map((feat, i) => (
                        <div key={i} className="flex items-start gap-2 text-xs text-slate-700">
                          <Check className="w-3.5 h-3.5 text-blue-600 shrink-0 mt-0.5" />
                          <span className="line-clamp-1">{feat}</span>
                        </div>
                      ))}
                    </div>

                    {/* Compatibility */}
                    <div className="flex items-center gap-2 pt-2 text-[11px] text-slate-500">
                      <span className="font-medium">Compatibilité :</span>
                      <div className="flex items-center gap-1.5 text-slate-700">
                        {software.osCompatibility.map((os) => (
                          <span
                            key={os}
                            className="bg-slate-100 px-1.5 py-0.5 rounded text-[10px] font-medium"
                          >
                            {os.includes('Windows') ? 'Windows' : os.includes('macOS') ? 'macOS' : 'Linux'}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Card Bottom / Price & CTA */}
                  <div className="pt-5 mt-4 border-t border-slate-100 flex items-center justify-between gap-3">
                    <div>
                      <div className="text-[11px] text-slate-500">Prix forfaitaire</div>
                      <div className="text-lg font-extrabold text-slate-900 tabular-nums">
                        {software.priceFCFA.toLocaleString('fr-FR')}{' '}
                        <span className="text-xs font-semibold text-slate-600">FCFA</span>
                      </div>
                      <div className="text-[10px] text-slate-500 tabular-nums font-mono">
                        ~{software.priceEUR} €
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => onOpenDetail(software)}
                        className="px-3 py-2 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors cursor-pointer"
                        title="Voir fiche complète et configuration requise"
                      >
                        <Info className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => onBuy(software)}
                        className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 active:bg-blue-800 rounded-lg shadow-xs transition-colors cursor-pointer whitespace-nowrap"
                      >
                        <ShoppingCart className="w-3.5 h-3.5" />
                        <span>Acheter</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};
