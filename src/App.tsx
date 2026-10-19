import React, { useState, useEffect } from 'react';
import { Software, Order, User } from './types';
import { api } from './services/api';
import { INITIAL_SOFTWARES } from './data/initialData';
import { AdminBanner } from './components/AdminBanner';
import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { SoftwareCatalog } from './components/SoftwareCatalog';
import { SoftwareDetailModal } from './components/SoftwareDetailModal';
import { CheckoutModal } from './components/CheckoutModal';
import { WavePaymentModal } from './components/WavePaymentModal';
import { OrderConfirmationModal } from './components/OrderConfirmationModal';
import { OrderLookupModal } from './components/OrderLookupModal';
import { UserAuthModal } from './components/UserAuthModal';
import { CustomerDashboardModal } from './components/CustomerDashboardModal';
import { AdminPanel } from './components/AdminPanel';
import { FaqSection } from './components/FaqSection';
import { Footer } from './components/Footer';

export default function App() {
  const [softwares, setSoftwares] = useState<Software[]>(INITIAL_SOFTWARES);
  const [selectedCategory, setSelectedCategory] = useState<string>('Tous');
  const [detailSoftware, setDetailSoftware] = useState<Software | null>(null);
  const [checkoutSoftware, setCheckoutSoftware] = useState<Software | null>(null);
  const [activeWaveOrder, setActiveWaveOrder] = useState<Order | null>(null);
  const [confirmedOrder, setConfirmedOrder] = useState<Order | null>(null);
  const [isLookupOpen, setIsLookupOpen] = useState(false);
  const [isAdminOpen, setIsAdminOpen] = useState(false);

  // User Authentication State
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isUserDashboardOpen, setIsUserDashboardOpen] = useState(false);

  // Check saved customer session on mount
  useEffect(() => {
    const savedEmail = localStorage.getItem('logisoft_user_email');
    if (savedEmail) {
      api.getCurrentUser(savedEmail).then((u) => {
        if (u) setCurrentUser(u);
      }).catch(() => {
        localStorage.removeItem('logisoft_user_email');
        localStorage.removeItem('logisoft_user_token');
      });
    }
  }, []);

  // Load software catalogue from backend API
  const loadSoftwares = async () => {
    try {
      const data = await api.getSoftwares();
      if (data && data.length > 0) {
        setSoftwares(data);
      }
    } catch (err) {
      console.warn('API fetch warning, using default catalogue:', err);
    }
  };

  useEffect(() => {
    loadSoftwares();
  }, []);

  const handleStartPurchase = (software: Software) => {
    setDetailSoftware(null);
    setCheckoutSoftware(software);
  };

  const handleOrderCreated = (order: Order) => {
    setCheckoutSoftware(null);
    setActiveWaveOrder(order);
  };

  const handlePaymentSuccess = (updatedOrder: Order) => {
    setActiveWaveOrder(null);
    setConfirmedOrder(updatedOrder);
  };

  const handleLogoutUser = () => {
    localStorage.removeItem('logisoft_user_token');
    localStorage.removeItem('logisoft_user_email');
    setCurrentUser(null);
    setIsUserDashboardOpen(false);
  };

  const scrollToCatalog = () => {
    const el = document.getElementById('catalogue');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      {/* Top Admin Banner */}
      <AdminBanner onOpenAdmin={() => setIsAdminOpen(true)} />

      {/* Top Header */}
      <Header
        currentUser={currentUser}
        onOpenAuth={() => setIsAuthModalOpen(true)}
        onOpenUserDashboard={() => setIsUserDashboardOpen(true)}
        onOpenAdmin={() => setIsAdminOpen(true)}
        onOpenLookup={() => setIsLookupOpen(true)}
        onSelectCategory={(cat) => {
          setSelectedCategory(cat);
          scrollToCatalog();
        }}
      />

      {/* Main Content Sections */}
      <main className="flex-1">
        {/* Hero Section (badge removed) */}
        <Hero
          onExplore={scrollToCatalog}
          onOpenLookup={() => setIsLookupOpen(true)}
        />

        {/* Software Catalog */}
        <SoftwareCatalog
          softwares={softwares}
          selectedCategory={selectedCategory}
          onSelectCategory={setSelectedCategory}
          onOpenDetail={(sw) => setDetailSoftware(sw)}
          onBuy={handleStartPurchase}
        />

        {/* FAQ & Installation Guidelines */}
        <FaqSection />
      </main>

      {/* Footer */}
      <Footer
        onOpenAdmin={() => setIsAdminOpen(true)}
        onOpenLookup={() => setIsLookupOpen(true)}
      />

      {/* MODALS */}
      {/* 1. Software Detail Modal (2 screenshots, full specifications, included items) */}
      <SoftwareDetailModal
        software={detailSoftware}
        onClose={() => setDetailSoftware(null)}
        onBuy={handleStartPurchase}
      />

      {/* 2. Order Checkout Form Modal (Customer info linked to user account) */}
      <CheckoutModal
        software={checkoutSoftware}
        currentUser={currentUser}
        onClose={() => setCheckoutSoftware(null)}
        onOrderCreated={handleOrderCreated}
        onPromptAuth={() => setIsAuthModalOpen(true)}
      />

      {/* 3. Wave Payment Modal (QR Code or Direct Merchant Phone Transfer) */}
      <WavePaymentModal
        order={activeWaveOrder}
        onClose={() => setActiveWaveOrder(null)}
        onPaymentSuccess={handlePaymentSuccess}
      />

      {/* 4. Order Confirmation & Delivery Modal (Google Drive link, 5-step installation guide, checklist) */}
      <OrderConfirmationModal
        order={confirmedOrder}
        onClose={() => setConfirmedOrder(null)}
      />

      {/* 5. Customer Auth Modal (Create account / Login) */}
      {isAuthModalOpen && (
        <UserAuthModal
          onClose={() => setIsAuthModalOpen(false)}
          onAuthSuccess={(user) => {
            setCurrentUser(user);
            setIsAuthModalOpen(false);
          }}
        />
      )}

      {/* 6. Customer Dashboard Modal (Mes Achats & Liens Drive) */}
      {isUserDashboardOpen && currentUser && (
        <CustomerDashboardModal
          user={currentUser}
          onClose={() => setIsUserDashboardOpen(false)}
          onLogout={handleLogoutUser}
          onOpenOrderGuide={(order) => {
            setIsUserDashboardOpen(false);
            setConfirmedOrder(order);
          }}
        />
      )}

      {/* 7. Order Lookup Modal ("Suivre ma commande") */}
      {isLookupOpen && (
        <OrderLookupModal
          onClose={() => setIsLookupOpen(false)}
          onOpenOrder={(ord) => setConfirmedOrder(ord)}
        />
      )}

      {/* 8. Admin Space Modal (Catalog CRUD, Orders table, Google Drive access granting, Wave settings & Step-by-Step Guide) */}
      {isAdminOpen && (
        <AdminPanel
          onClose={() => setIsAdminOpen(false)}
          onRefreshData={loadSoftwares}
          softwares={softwares}
        />
      )}
    </div>
  );
}
