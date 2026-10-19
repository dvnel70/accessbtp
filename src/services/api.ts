import { Software, Order, OrderStatus, WaveCheckoutResponse, User, AppConfig } from '../types';

export const api = {
  // CLIENT AUTHENTICATION
  async register(data: {
    name: string;
    email: string;
    password?: string;
    phone?: string;
    computerDetails?: string;
  }): Promise<{ token: string; user: User }> {
    const res = await fetch('/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || 'Erreur lors de la création du compte');
    }
    return res.json();
  },

  async login(email: string, password?: string): Promise<{ token: string; user: User }> {
    const res = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || 'Identifiants incorrects');
    }
    return res.json();
  },

  async getCurrentUser(email: string): Promise<User> {
    const res = await fetch(`/api/auth/me?email=${encodeURIComponent(email)}`);
    if (!res.ok) throw new Error('Utilisateur introuvable');
    return res.json();
  },

  async getUserOrders(email?: string, userId?: string): Promise<Order[]> {
    const params = new URLSearchParams();
    if (email) params.append('email', email);
    if (userId) params.append('userId', userId);
    const res = await fetch(`/api/user/orders?${params.toString()}`);
    if (!res.ok) throw new Error('Impossible de charger vos commandes');
    return res.json();
  },

  // SOFTWARE CATALOG
  async getSoftwares(includeAll = false): Promise<Software[]> {
    const res = await fetch(`/api/software${includeAll ? '?all=true' : ''}`);
    if (!res.ok) throw new Error('Échec du chargement des logiciels');
    return res.json();
  },

  async getSoftware(id: string): Promise<Software> {
    const res = await fetch(`/api/software/${id}`);
    if (!res.ok) throw new Error('Logiciel introuvable');
    return res.json();
  },

  async saveSoftware(software: Partial<Software>): Promise<Software> {
    const isNew = !software.id || software.id.startsWith('new-');
    const url = isNew ? '/api/software' : `/api/software/${software.id}`;
    const method = isNew ? 'POST' : 'PUT';

    const res = await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(software)
    });
    if (!res.ok) throw new Error('Impossible d\'enregistrer le logiciel');
    return res.json();
  },

  async deleteSoftware(id: string): Promise<boolean> {
    const res = await fetch(`/api/software/${id}`, { method: 'DELETE' });
    if (!res.ok) throw new Error('Impossible de supprimer le logiciel');
    return true;
  },

  // ORDERS
  async getOrders(status?: string, search?: string): Promise<Order[]> {
    const params = new URLSearchParams();
    if (status && status !== 'Tous') params.append('status', status);
    if (search) params.append('search', search);

    const res = await fetch(`/api/orders?${params.toString()}`);
    if (!res.ok) throw new Error('Échec du chargement des commandes');
    return res.json();
  },

  async getOrder(idOrRef: string): Promise<Order> {
    const res = await fetch(`/api/orders/${encodeURIComponent(idOrRef)}`);
    if (!res.ok) throw new Error('Commande introuvable');
    return res.json();
  },

  async createOrder(orderPayload: {
    customerName: string;
    customerEmail: string;
    customerPhone: string;
    computerDetails?: string;
    softwareId: string;
    notes?: string;
    userId?: string;
  }): Promise<Order> {
    const res = await fetch('/api/orders', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(orderPayload)
    });
    if (!res.ok) {
      const errorData = await res.json().catch(() => ({}));
      throw new Error(errorData.error || 'Erreur lors de la création de la commande');
    }
    return res.json();
  },

  // WAVE CHECKOUT & DIRECT PAYMENTS
  async createWaveCheckoutSession(orderId: string): Promise<WaveCheckoutResponse> {
    const res = await fetch('/api/wave/create-checkout-session', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ orderId })
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || 'Erreur lors de l\'initialisation de Wave');
    }
    return res.json();
  },

  async verifyWavePayment(orderId: string): Promise<{
    orderId: string;
    reference: string;
    status: OrderStatus;
    isPaid: boolean;
    waveTransactionId?: string;
    driveAccessGranted: boolean;
    googleDriveUrl: string | null;
  }> {
    const res = await fetch(`/api/wave/verify/${encodeURIComponent(orderId)}`);
    if (!res.ok) throw new Error('Vérification Wave impossible');
    return res.json();
  },

  async simulateWaveWebhook(orderId: string, success: boolean, transactionId?: string): Promise<{
    success: boolean;
    message: string;
    order: Order;
  }> {
    const res = await fetch('/api/wave/simulate-webhook', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ orderId, success, transactionId })
    });
    if (!res.ok) throw new Error('Erreur de traitement de la transaction Wave');
    return res.json();
  },

  // ADMIN ACTIONS
  async grantDriveAccess(orderId: string): Promise<Order> {
    const res = await fetch(`/api/orders/${orderId}/grant-drive`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' }
    });
    if (!res.ok) throw new Error('Impossible d\'accorder l\'accès Google Drive');
    const data = await res.json();
    return data.order;
  },

  async updateOrderStatus(orderId: string, status: OrderStatus, notes?: string): Promise<Order> {
    const res = await fetch(`/api/orders/${orderId}/status`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status, notes })
    });
    if (!res.ok) throw new Error('Impossible de mettre à jour le statut');
    const data = await res.json();
    return data.order;
  },

  async adminLogin(email: string, password: string): Promise<{ token: string; user: any }> {
    const res = await fetch('/api/admin/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || 'Identifiants invalides');
    }
    return res.json();
  },

  async getAdminStats(): Promise<{
    totalOrders: number;
    paidCount: number;
    pendingCount: number;
    deliveredCount: number;
    revenueFCFA: number;
    totalSoftwares: number;
    totalUsers: number;
    config: AppConfig;
  }> {
    const res = await fetch('/api/admin/stats');
    if (!res.ok) throw new Error('Impossible de charger les statistiques');
    return res.json();
  },

  async updateConfig(config: Partial<AppConfig>): Promise<AppConfig> {
    const res = await fetch('/api/admin/config', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(config)
    });
    if (!res.ok) throw new Error('Impossible de mettre à jour la configuration');
    const data = await res.json();
    return data.config;
  }
};
