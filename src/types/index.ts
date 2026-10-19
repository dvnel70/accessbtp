export type OrderStatus = 'En attente' | 'Payée' | 'Livraison en cours' | 'Livrée' | 'Échouée';

export interface SystemSpecs {
  os: string;
  cpu: string;
  ram: string;
  gpu: string;
  storage: string;
}

export interface Software {
  id: string;
  name: string;
  version: string;
  category: 'CAO & Architecture' | 'Création & Multimédia' | 'Bureautique & Gestion' | 'Développement & IT';
  priceFCFA: number;
  priceEUR: number;
  shortDescription: string;
  fullDescription: string;
  features: string[];
  imagePrimary: string;
  imageSecondary: string;
  minSpecs: SystemSpecs;
  recommendedSpecs: SystemSpecs;
  osCompatibility: ('Windows 10/11' | 'macOS Intel' | 'macOS Apple Silicon' | 'Linux')[];
  includedItems: string[];
  googleDriveUrl: string;
  googleDriveFolderId: string;
  fileSize: string;
  active: boolean;
  featured?: boolean;
}

export interface User {
  id: string;
  name: string;
  email: string;
  password?: string;
  phone: string;
  computerDetails?: string;
  createdAt: string;
}

export interface OrderItem {
  softwareId: string;
  softwareName: string;
  version: string;
  priceFCFA: number;
  googleDriveUrl: string;
}

export interface Order {
  id: string;
  reference: string;
  userId?: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  computerDetails?: string;
  item: OrderItem;
  totalFCFA: number;
  status: OrderStatus;
  waveTransactionId?: string;
  waveCheckoutUrl?: string;
  paymentMethod?: 'wave_api' | 'wave_phone';
  driveAccessGranted: boolean;
  driveGrantedAt?: string;
  createdAt: string;
  updatedAt: string;
  notes?: string;
}

export interface AppConfig {
  waveMode: 'api' | 'phone_transfer';
  waveApiKey: string;
  waveSandboxMode: boolean;
  waveMerchantPhone: string;
  waveMerchantName: string;
  googleDriveRootFolder: string;
  driveManagerEmail: string;
  adminEmail: string;
}

export interface WaveCheckoutResponse {
  success: boolean;
  checkoutUrl: string;
  waveTransactionId: string;
  orderId: string;
  amountFCFA: number;
  currency: string;
  clientReference: string;
  waveMerchantPhone?: string;
  waveMode?: 'api' | 'phone_transfer';
}

export interface AdminUser {
  id: string;
  name: string;
  email: string;
  role: 'superadmin' | 'technician';
}
