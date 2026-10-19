import React, { useState, useEffect } from 'react';
import { Software, Order, OrderStatus, AppConfig } from '../types';
import { api } from '../services/api';
import {
  X,
  Lock,
  HardDrive,
  Users,
  DollarSign,
  Package,
  CheckCircle2,
  Clock,
  Plus,
  Edit2,
  Trash2,
  ExternalLink,
  ShieldCheck,
  Search,
  Filter,
  Check,
  AlertCircle,
  RefreshCw,
  LogOut,
  Smartphone,
  Save,
  ChevronRight,
  Eye,
  Settings,
  FolderOpen
} from 'lucide-react';

interface AdminPanelProps {
  onClose: () => void;
  onRefreshData: () => void;
  softwares: Software[];
}

export const AdminPanel: React.FC<AdminPanelProps> = ({ onClose, onRefreshData, softwares }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [loginError, setLoginError] = useState<string | null>(null);
  const [loginLoading, setLoginLoading] = useState(false);

  // Active View Tab: 'catalog' | 'orders' | 'config'
  const [activeTab, setActiveTab] = useState<'catalog' | 'orders' | 'config'>('catalog');
  const [orders, setOrders] = useState<Order[]>([]);
  const [statusFilter, setStatusFilter] = useState<string>('Tous');
  const [searchOrder, setSearchOrder] = useState<string>('');
  const [searchSoftware, setSearchSoftware] = useState<string>('');
  const [stats, setStats] = useState<any>(null);
  const [loadingOrders, setLoadingOrders] = useState(false);

  // App Configuration
  const [config, setConfig] = useState<AppConfig>({
    waveMode: 'phone_transfer',
    waveApiKey: '',
    waveSandboxMode: true,
    waveMerchantPhone: '+225 07 48 92 11 34',
    waveMerchantName: 'LogiSoft Distribution',
    googleDriveRootFolder: 'https://drive.google.com/drive/folders/1_LogiSoft_MasterWarehouse_Demo',
    driveManagerEmail: 'elieniamke145@gmail.com',
    adminEmail: 'danielniamke7@gmail.com'
  });
  const [savingConfig, setSavingConfig] = useState(false);
  const [configSuccess, setConfigSuccess] = useState(false);

  // Edit / Create software modal
  const [editingSoftware, setEditingSoftware] = useState<Partial<Software> | null>(null);
  const [isSoftwareModalOpen, setIsSoftwareModalOpen] = useState(false);

  // Selected Order Detail Modal
  const [selectedOrderDetail, setSelectedOrderDetail] = useState<Order | null>(null);

  useEffect(() => {
    const token = localStorage.getItem('logisoft_admin_token');
    if (token) {
      setIsAuthenticated(true);
    }
  }, []);

  const loadAdminData = async () => {
    try {
      setLoadingOrders(true);
      const [ordersData, statsData] = await Promise.all([
        api.getOrders(statusFilter, searchOrder),
        api.getAdminStats()
      ]);
      setOrders(ordersData);
      setStats(statsData);
      if (statsData.config) {
        setConfig(statsData.config);
      }
    } catch (err) {
      console.error('Failed to load admin data:', err);
    } finally {
      setLoadingOrders(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      loadAdminData();
    }
  }, [isAuthenticated, statusFilter, searchOrder]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError(null);
    try {
      setLoginLoading(true);
      const res = await api.adminLogin(loginEmail.trim(), loginPassword.trim());
      localStorage.setItem('logisoft_admin_token', res.token);
      setIsAuthenticated(true);
    } catch (err: any) {
      setLoginError(err.message || 'Identifiants administrateur incorrects.');
    } finally {
      setLoginLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('logisoft_admin_token');
    setIsAuthenticated(false);
    setLoginEmail('');
    setLoginPassword('');
  };

  const handleGrantDrive = async (orderId: string) => {
    try {
      const updated = await api.grantDriveAccess(orderId);
      setOrders((prev) => prev.map((o) => (o.id === orderId ? updated : o)));
      if (selectedOrderDetail && selectedOrderDetail.id === orderId) {
        setSelectedOrderDetail(updated);
      }
      loadAdminData();
    } catch (err: any) {
      alert(err.message || 'Erreur lors de l\'attribution des droits Google Drive');
    }
  };

  const handleUpdateStatus = async (orderId: string, newStatus: OrderStatus) => {
    try {
      const updated = await api.updateOrderStatus(orderId, newStatus);
      setOrders((prev) => prev.map((o) => (o.id === orderId ? updated : o)));
      if (selectedOrderDetail && selectedOrderDetail.id === orderId) {
        setSelectedOrderDetail(updated);
      }
      loadAdminData();
    } catch (err: any) {
      alert(err.message || 'Erreur de mise à jour du statut');
    }
  };

  const handleDeleteSoftware = async (id: string, name: string) => {
    if (!window.confirm(`Confirmez-vous la suppression du logiciel "${name}" du catalogue ?`)) {
      return;
    }
    try {
      await api.deleteSoftware(id);
      onRefreshData();
      loadAdminData();
    } catch (err: any) {
      alert(err.message || 'Erreur lors de la suppression');
    }
  };

  const handleSaveSoftware = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingSoftware) return;

    try {
      await api.saveSoftware(editingSoftware);
      setIsSoftwareModalOpen(false);
      setEditingSoftware(null);
      onRefreshData();
      loadAdminData();
    } catch (err: any) {
      alert(err.message || 'Erreur lors de l\'enregistrement du logiciel');
    }
  };

  const handleSaveConfig = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setSavingConfig(true);
      setConfigSuccess(false);
      const updated = await api.updateConfig(config);
      setConfig(updated);
      setConfigSuccess(true);
      setTimeout(() => setConfigSuccess(false), 3000);
    } catch (err: any) {
      alert(err.message || 'Erreur lors de l\'enregistrement des paramètres');
    } finally {
      setSavingConfig(false);
    }
  };

  const filteredSoftwares = softwares.filter((s) => {
    if (!searchSoftware.trim()) return true;
    const q = searchSoftware.toLowerCase();
    return s.name.toLowerCase().includes(q) || s.category.toLowerCase().includes(q) || s.version.toLowerCase().includes(q);
  });

  // CONFIDENTIAL LOGIN SCREEN (No printed credentials, completely private)
  if (!isAuthenticated) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md">
        <div className="relative w-full max-w-sm bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden p-6 sm:p-8 space-y-5">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-slate-900 text-white flex items-center justify-center font-bold">
                <Lock className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900">Espace Administrateur</h3>
                <p className="text-[11px] text-slate-500">Accès restreint et confidentiel</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg cursor-pointer transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {loginError && (
            <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-700 flex items-start gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-600 mt-0.5" />
              <span>{loginError}</span>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Adresse e-mail
              </label>
              <input
                type="email"
                required
                placeholder="Votre e-mail"
                value={loginEmail}
                onChange={(e) => setLoginEmail(e.target.value)}
                className="w-full px-3.5 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-colors"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Mot de passe
              </label>
              <input
                type="password"
                required
                placeholder="Votre mot de passe"
                value={loginPassword}
                onChange={(e) => setLoginPassword(e.target.value)}
                className="w-full px-3.5 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-colors"
              />
            </div>

            <button
              type="submit"
              disabled={loginLoading}
              className="w-full py-2.5 px-4 text-xs font-bold text-white bg-slate-900 hover:bg-slate-800 active:bg-black rounded-xl transition-colors cursor-pointer shadow-sm disabled:opacity-50"
            >
              {loginLoading ? 'Connexion en cours...' : 'Se connecter'}
            </button>
          </form>
        </div>
      </div>
    );
  }

  // AUTHENTICATED ADMIN CONSOLE
  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-slate-100 animate-in fade-in overflow-hidden">
      {/* 1. TOP BAR */}
      <header className="bg-slate-900 text-white px-4 sm:px-8 py-3.5 flex items-center justify-between border-b border-slate-800 shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center font-bold text-white shadow-xs">
            <ShieldCheck className="w-4 h-4" />
          </div>
          <div>
            <h1 className="text-sm font-bold text-white tracking-tight">Panneau d&apos;Administration LogiSoft</h1>
            <p className="text-[11px] text-slate-400">Gestion du catalogue, commandes clients et intégrations</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={onClose}
            className="px-3.5 py-1.5 text-xs font-semibold text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 rounded-lg transition-colors cursor-pointer"
          >
            Retour au site
          </button>
          <button
            onClick={handleLogout}
            className="flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold text-rose-300 hover:text-white bg-rose-950/60 hover:bg-rose-900 border border-rose-800/40 rounded-lg transition-colors cursor-pointer"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Déconnexion</span>
          </button>
        </div>
      </header>

      {/* 2. NAVIGATION BAR & KPI STRIP */}
      <div className="bg-white border-b border-slate-200 px-4 sm:px-8 py-3 flex flex-col md:flex-row md:items-center justify-between gap-4 shrink-0 shadow-xs">
        {/* Navigation Tabs */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveTab('catalog')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'catalog'
                ? 'bg-blue-600 text-white shadow-xs'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            <Package className="w-4 h-4" />
            <span>Catalogue Logiciels ({softwares.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('orders')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'orders'
                ? 'bg-blue-600 text-white shadow-xs'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            <Users className="w-4 h-4" />
            <span>Commandes &amp; Accès Drive ({orders.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('config')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'config'
                ? 'bg-blue-600 text-white shadow-xs'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            <Settings className="w-4 h-4" />
            <span>Configuration Wave &amp; Drive</span>
          </button>
        </div>

        {/* Quick Stats Summary */}
        {stats && (
          <div className="flex items-center gap-4 text-xs">
            <div className="bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-200">
              <span className="text-slate-500 font-medium">Chiffre d&apos;affaires Wave : </span>
              <strong className="text-slate-900 font-bold tabular-nums">
                {stats.revenueFCFA.toLocaleString('fr-FR')} FCFA
              </strong>
            </div>
            <div className="bg-emerald-50 px-3 py-1.5 rounded-lg border border-emerald-200 text-emerald-800">
              <span className="font-medium">Commandes validées : </span>
              <strong>{stats.paidCount}</strong>
            </div>
          </div>
        )}
      </div>

      {/* 3. MAIN WORKSPACE */}
      <main className="flex-1 overflow-y-auto p-4 sm:p-8">
        <div className="max-w-7xl mx-auto space-y-6">

          {/* VIEW 1: CATALOGUE DES LOGICIELS */}
          {activeTab === 'catalog' && (
            <div className="space-y-5">
              {/* Toolbar */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
                <div>
                  <h2 className="text-base font-bold text-slate-900">Gestion des Logiciels du Catalogue</h2>
                  <p className="text-xs text-slate-500">Ajoutez, modifiez ou supprimez les fiches et mettez à jour les liens Google Drive.</p>
                </div>

                <div className="flex items-center gap-3">
                  <div className="relative w-48 sm:w-64">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
                    <input
                      type="text"
                      placeholder="Rechercher un logiciel..."
                      value={searchSoftware}
                      onChange={(e) => setSearchSoftware(e.target.value)}
                      className="w-full pl-8.5 pr-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-1 focus:ring-blue-500"
                    />
                  </div>

                  <button
                    onClick={() => {
                      setEditingSoftware({
                        id: `sw-${Date.now()}`,
                        name: '',
                        version: '2025 Pro',
                        category: 'CAO & Architecture',
                        priceFCFA: 25000,
                        priceEUR: 38,
                        shortDescription: '',
                        fullDescription: '',
                        features: ['Installateur complet vérifié', 'Dossier Google Drive dédié', 'Instructions d\'installation'],
                        imagePrimary: '/src/assets/images/product_autocad_design_1792444245306.jpg',
                        imageSecondary: '/src/assets/images/hero_software_suite_1792444243588.jpg',
                        minSpecs: {
                          os: 'Windows 10/11 64-bit',
                          cpu: 'Intel Core i5',
                          ram: '8 Go',
                          gpu: '2 Go VRAM',
                          storage: '10 Go SSD'
                        },
                        recommendedSpecs: {
                          os: 'Windows 11 64-bit',
                          cpu: 'Intel Core i7 / Ryzen 7',
                          ram: '16 Go',
                          gpu: '6 Go VRAM',
                          storage: '20 Go SSD'
                        },
                        osCompatibility: ['Windows 10/11'],
                        includedItems: ['Installateur complet vérifié', 'Accès direct Google Drive', 'Fichiers & documentation inclus'],
                        googleDriveUrl: 'https://drive.google.com/drive/folders/VOTRE_DOSSIER_ICI',
                        googleDriveFolderId: 'dossier-id',
                        fileSize: '5 Go',
                        active: true
                      });
                      setIsSoftwareModalOpen(true);
                    }}
                    className="inline-flex items-center gap-2 px-4 py-2 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 active:bg-blue-800 rounded-xl shadow-xs transition-colors cursor-pointer shrink-0"
                  >
                    <Plus className="w-4 h-4" />
                    <span>+ Ajouter un logiciel</span>
                  </button>
                </div>
              </div>

              {/* Software Table */}
              <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-slate-100/80 border-b border-slate-200 text-slate-700 font-bold uppercase tracking-wider text-[10px]">
                      <tr>
                        <th className="px-5 py-3.5">Logiciel &amp; Version</th>
                        <th className="px-5 py-3.5">Catégorie</th>
                        <th className="px-5 py-3.5">Prix (FCFA)</th>
                        <th className="px-5 py-3.5">Taille / Stockage</th>
                        <th className="px-5 py-3.5">Lien Google Drive</th>
                        <th className="px-5 py-3.5 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {filteredSoftwares.map((sw) => (
                        <tr key={sw.id} className="hover:bg-slate-50/80 transition-colors">
                          <td className="px-5 py-4">
                            <div className="flex items-center gap-3">
                              <div className="w-12 h-10 rounded-lg bg-slate-900 overflow-hidden shrink-0 border border-slate-200">
                                <img
                                  src={sw.imagePrimary}
                                  alt={sw.name}
                                  referrerPolicy="no-referrer"
                                  className="w-full h-full object-cover"
                                />
                              </div>
                              <div>
                                <div className="font-bold text-slate-900 text-sm">{sw.name}</div>
                                <div className="text-[11px] text-slate-500 font-medium">{sw.version}</div>
                              </div>
                            </div>
                          </td>

                          <td className="px-5 py-4">
                            <span className="px-2.5 py-1 rounded-md bg-slate-100 text-slate-700 font-semibold text-[11px]">
                              {sw.category}
                            </span>
                          </td>

                          <td className="px-5 py-4">
                            <div className="font-extrabold text-slate-900 tabular-nums text-sm">
                              {sw.priceFCFA.toLocaleString('fr-FR')} FCFA
                            </div>
                            <div className="text-[10px] text-slate-400 font-mono">~{sw.priceEUR} €</div>
                          </td>

                          <td className="px-5 py-4">
                            <span className="font-mono text-slate-700 font-semibold">{sw.fileSize}</span>
                          </td>

                          <td className="px-5 py-4 max-w-xs">
                            <a
                              href={sw.googleDriveUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-1.5 text-blue-600 hover:text-blue-800 font-mono text-[11px] truncate"
                              title={sw.googleDriveUrl}
                            >
                              <FolderOpen className="w-3.5 h-3.5 shrink-0" />
                              <span className="truncate">{sw.googleDriveUrl}</span>
                              <ExternalLink className="w-3 h-3 shrink-0" />
                            </a>
                          </td>

                          <td className="px-5 py-4 text-right">
                            <div className="flex items-center justify-end gap-2">
                              <button
                                onClick={() => {
                                  setEditingSoftware(sw);
                                  setIsSoftwareModalOpen(true);
                                }}
                                className="inline-flex items-center gap-1 px-2.5 py-1.5 text-xs font-semibold text-blue-700 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors cursor-pointer"
                              >
                                <Edit2 className="w-3.5 h-3.5" />
                                <span>Modifier</span>
                              </button>
                              <button
                                onClick={() => handleDeleteSoftware(sw.id, sw.name)}
                                className="inline-flex items-center gap-1 px-2.5 py-1.5 text-xs font-semibold text-rose-700 bg-rose-50 hover:bg-rose-100 rounded-lg transition-colors cursor-pointer"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                                <span>Supprimer</span>
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* VIEW 2: GESTION DES COMMANDES & ATTRIBUTION DRIVE */}
          {activeTab === 'orders' && (
            <div className="space-y-5">
              {/* Toolbar */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
                {/* Status Filter Buttons */}
                <div className="flex items-center gap-1.5 overflow-x-auto">
                  {['Tous', 'En attente', 'Payée', 'Livraison en cours', 'Livrée'].map((st) => (
                    <button
                      key={st}
                      onClick={() => setStatusFilter(st)}
                      className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors cursor-pointer whitespace-nowrap ${
                        statusFilter === st
                          ? 'bg-blue-600 text-white'
                          : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                      }`}
                    >
                      {st}
                    </button>
                  ))}
                </div>

                <div className="relative w-full sm:w-64">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
                  <input
                    type="text"
                    placeholder="Filtrer par nom, email ou tél..."
                    value={searchOrder}
                    onChange={(e) => setSearchOrder(e.target.value)}
                    className="w-full pl-8.5 pr-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />
                </div>
              </div>

              {/* Orders Table */}
              <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-slate-100/80 border-b border-slate-200 text-slate-700 font-bold uppercase tracking-wider text-[10px]">
                      <tr>
                        <th className="px-5 py-3.5">Référence / Date</th>
                        <th className="px-5 py-3.5">Acheteur (Gmail)</th>
                        <th className="px-5 py-3.5">Logiciel</th>
                        <th className="px-5 py-3.5">Montant Wave</th>
                        <th className="px-5 py-3.5">Statut</th>
                        <th className="px-5 py-3.5">Accès Google Drive</th>
                        <th className="px-5 py-3.5 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {loadingOrders ? (
                        <tr>
                          <td colSpan={7} className="px-5 py-12 text-center text-slate-500">
                            <RefreshCw className="w-5 h-5 animate-spin mx-auto mb-2 text-blue-500" />
                            Chargement des commandes...
                          </td>
                        </tr>
                      ) : orders.length === 0 ? (
                        <tr>
                          <td colSpan={7} className="px-5 py-12 text-center text-slate-400">
                            Aucune commande trouvée pour ce filtre.
                          </td>
                        </tr>
                      ) : (
                        orders.map((o) => (
                          <tr key={o.id} className="hover:bg-slate-50/80 transition-colors">
                            <td className="px-5 py-4">
                              <div className="font-mono font-bold text-slate-900 text-sm">{o.reference}</div>
                              <div className="text-[10px] text-slate-400">
                                {new Date(o.createdAt).toLocaleDateString('fr-FR', {
                                  day: '2-digit',
                                  month: 'short',
                                  hour: '2-digit',
                                  minute: '2-digit'
                                })}
                              </div>
                            </td>

                            <td className="px-5 py-4">
                              <div className="font-semibold text-slate-900">{o.customerName}</div>
                              <div className="text-blue-700 font-mono text-[11px] font-semibold">{o.customerEmail}</div>
                              <div className="text-slate-400 text-[10px]">{o.customerPhone}</div>
                            </td>

                            <td className="px-5 py-4">
                              <div className="font-bold text-slate-800">{o.item.softwareName}</div>
                              <div className="text-[11px] text-slate-500">{o.item.version}</div>
                            </td>

                            <td className="px-5 py-4 tabular-nums font-bold text-slate-900 text-sm">
                              {o.totalFCFA.toLocaleString('fr-FR')} FCFA
                            </td>

                            <td className="px-5 py-4">
                              <span
                                className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full font-bold text-[10px] ${
                                  o.status === 'Payée' || o.status === 'Livrée' || o.status === 'Livraison en cours'
                                    ? 'bg-emerald-100 text-emerald-800'
                                    : o.status === 'En attente'
                                    ? 'bg-amber-100 text-amber-800'
                                    : 'bg-rose-100 text-rose-800'
                                }`}
                              >
                                {o.status}
                              </span>
                            </td>

                            <td className="px-5 py-4">
                              {o.driveAccessGranted ? (
                                <div className="flex items-center gap-1.5 text-emerald-700 font-semibold">
                                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                                  <span>Accès Accordé</span>
                                </div>
                              ) : (
                                <button
                                  onClick={() => handleGrantDrive(o.id)}
                                  className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg transition-colors cursor-pointer shadow-xs"
                                >
                                  <Check className="w-3.5 h-3.5" />
                                  <span>Accorder l&apos;accès</span>
                                </button>
                              )}
                            </td>

                            <td className="px-5 py-4 text-right">
                              <div className="flex items-center justify-end gap-2">
                                <button
                                  onClick={() => setSelectedOrderDetail(o)}
                                  className="px-2.5 py-1.5 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors cursor-pointer"
                                >
                                  Détails
                                </button>
                                {o.status !== 'Livrée' && (
                                  <button
                                    onClick={() => handleUpdateStatus(o.id, 'Livrée')}
                                    className="px-2.5 py-1.5 text-xs font-semibold text-blue-700 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors cursor-pointer"
                                  >
                                    Terminer
                                  </button>
                                )}
                              </div>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* VIEW 3: CONFIGURATION WAVE & DRIVE */}
          {activeTab === 'config' && (
            <div className="max-w-2xl mx-auto bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-xs space-y-6">
              <div>
                <h2 className="text-base font-bold text-slate-900">Paramètres de Paiement Wave &amp; Google Drive</h2>
                <p className="text-xs text-slate-500 mt-0.5">Modifiez votre numéro de paiement Wave et vos informations de stockage.</p>
              </div>

              {configSuccess && (
                <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-800 flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Paramètres enregistrés avec succès !</span>
                </div>
              )}

              <form onSubmit={handleSaveConfig} className="space-y-5 text-xs">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1.5">
                    Numéro Wave de réception des paiements (Mobile Money) <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={config.waveMerchantPhone || ''}
                    onChange={(e) => setConfig({ ...config, waveMerchantPhone: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl font-mono text-xs focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                  />
                  <p className="text-[11px] text-slate-500 mt-1">
                    Les acheteurs effectuent leur transfert d&apos;argent directement vers ce numéro Wave.
                  </p>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1.5">
                    Nom du marchand affiché
                  </label>
                  <input
                    type="text"
                    value={config.waveMerchantName || ''}
                    onChange={(e) => setConfig({ ...config, waveMerchantName: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1.5">
                    Lien du Dossier Racine Google Drive
                  </label>
                  <input
                    type="text"
                    value={config.googleDriveRootFolder || ''}
                    onChange={(e) => setConfig({ ...config, googleDriveRootFolder: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl font-mono text-xs focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1.5">
                    Compte Gmail gestionnaire Google Drive
                  </label>
                  <input
                    type="email"
                    value={config.driveManagerEmail || 'elieniamke145@gmail.com'}
                    onChange={(e) => setConfig({ ...config, driveManagerEmail: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl font-mono text-xs focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                  />
                  <p className="text-[11px] text-slate-500 mt-1">
                    Compte propriétaire utilisé pour gérer les dossiers et accorder les autorisations.
                  </p>
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={savingConfig}
                    className="inline-flex items-center gap-2 px-5 py-2.5 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 active:bg-blue-800 rounded-xl transition-colors cursor-pointer shadow-xs disabled:opacity-50"
                  >
                    <Save className="w-4 h-4" />
                    <span>{savingConfig ? 'Enregistrement...' : 'Enregistrer les paramètres'}</span>
                  </button>
                </div>
              </form>
            </div>
          )}

        </div>
      </main>

      {/* MODAL: AJOUTER / MODIFIER UN LOGICIEL */}
      {isSoftwareModalOpen && editingSoftware && (
        <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-xs">
          <div className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden max-h-[90vh] flex flex-col">
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 bg-slate-50">
              <h3 className="text-base font-bold text-slate-900">
                {editingSoftware.name ? `Modifier : ${editingSoftware.name}` : 'Ajouter un nouveau logiciel'}
              </h3>
              <button
                onClick={() => setIsSoftwareModalOpen(false)}
                className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveSoftware} className="p-6 space-y-4 overflow-y-auto text-xs flex-1">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Nom du logiciel *</label>
                  <input
                    type="text"
                    required
                    placeholder="Ex : AutoCAD Architecture"
                    value={editingSoftware.name || ''}
                    onChange={(e) => setEditingSoftware({ ...editingSoftware, name: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Version *</label>
                  <input
                    type="text"
                    required
                    placeholder="Ex : 2025 Pro (FR/EN)"
                    value={editingSoftware.version || ''}
                    onChange={(e) => setEditingSoftware({ ...editingSoftware, version: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Catégorie</label>
                  <select
                    value={editingSoftware.category || 'CAO & Architecture'}
                    onChange={(e) => setEditingSoftware({ ...editingSoftware, category: e.target.value as any })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl bg-white"
                  >
                    <option value="CAO & Architecture">CAO &amp; Architecture</option>
                    <option value="Création & Multimédia">Création &amp; Multimédia</option>
                    <option value="Bureautique & Gestion">Bureautique &amp; Gestion</option>
                    <option value="Développement & IT">Développement &amp; IT</option>
                  </select>
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Prix de vente (FCFA) *</label>
                  <input
                    type="number"
                    required
                    value={editingSoftware.priceFCFA || 0}
                    onChange={(e) => setEditingSoftware({ ...editingSoftware, priceFCFA: Number(e.target.value) })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Taille estimée</label>
                  <input
                    type="text"
                    placeholder="Ex : 4.8 Go"
                    value={editingSoftware.fileSize || '5 Go'}
                    onChange={(e) => setEditingSoftware({ ...editingSoftware, fileSize: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Courte description *</label>
                <input
                  type="text"
                  required
                  placeholder="Résumé en une ligne du logiciel..."
                  value={editingSoftware.shortDescription || ''}
                  onChange={(e) => setEditingSoftware({ ...editingSoftware, shortDescription: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Description détaillée</label>
                <textarea
                  rows={3}
                  placeholder="Présentation complète des fonctionnalités..."
                  value={editingSoftware.fullDescription || ''}
                  onChange={(e) => setEditingSoftware({ ...editingSoftware, fullDescription: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Lien du dossier Google Drive *</label>
                <input
                  type="text"
                  required
                  placeholder="https://drive.google.com/drive/folders/..."
                  value={editingSoftware.googleDriveUrl || ''}
                  onChange={(e) => setEditingSoftware({ ...editingSoftware, googleDriveUrl: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl font-mono text-xs"
                />
                <p className="text-[11px] text-slate-500 mt-1">
                  Le client sera directement redirigé vers ce lien après paiement pour ouvrir le dossier.
                </p>
              </div>

              <div className="pt-3 border-t border-slate-200 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsSoftwareModalOpen(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl cursor-pointer"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-xl cursor-pointer shadow-xs"
                >
                  Enregistrer le logiciel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: DÉTAIL COMMANDE */}
      {selectedOrderDetail && (
        <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-xs">
          <div className="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden p-6 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <span className="text-xs font-mono font-bold text-blue-700">
                  {selectedOrderDetail.reference}
                </span>
                <h3 className="text-base font-bold text-slate-900">Détails de la commande</h3>
              </div>
              <button
                onClick={() => setSelectedOrderDetail(null)}
                className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs text-slate-700">
              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-1.5">
                <div><strong>Client :</strong> {selectedOrderDetail.customerName}</div>
                <div><strong>E-mail (Google Drive) :</strong> <span className="font-mono text-blue-700 font-semibold">{selectedOrderDetail.customerEmail}</span></div>
                <div><strong>Téléphone (Wave) :</strong> {selectedOrderDetail.customerPhone}</div>
                {selectedOrderDetail.computerDetails && (
                  <div><strong>Machine :</strong> {selectedOrderDetail.computerDetails}</div>
                )}
              </div>

              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-1.5">
                <div><strong>Produit :</strong> {selectedOrderDetail.item.softwareName} ({selectedOrderDetail.item.version})</div>
                <div><strong>Montant Wave :</strong> {selectedOrderDetail.totalFCFA.toLocaleString('fr-FR')} FCFA</div>
                <div><strong>ID Transaction Wave :</strong> {selectedOrderDetail.waveTransactionId || 'Confirmée'}</div>
              </div>

              <div className="flex items-center justify-between p-3.5 rounded-xl bg-blue-50 border border-blue-200">
                <div>
                  <span className="font-bold text-blue-900 block">Accès Google Drive :</span>
                  <span className="text-blue-700 text-[11px]">
                    {selectedOrderDetail.driveAccessGranted ? 'Accès déjà autorisé' : 'En attente d\'attribution'}
                  </span>
                </div>
                {!selectedOrderDetail.driveAccessGranted && (
                  <button
                    onClick={() => handleGrantDrive(selectedOrderDetail.id)}
                    className="px-3.5 py-1.5 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-lg cursor-pointer shadow-xs"
                  >
                    Accorder l&apos;accès
                  </button>
                )}
              </div>
            </div>

            <div className="pt-2 flex justify-end">
              <button
                onClick={() => setSelectedOrderDetail(null)}
                className="px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-100 rounded-lg cursor-pointer"
              >
                Fermer
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
