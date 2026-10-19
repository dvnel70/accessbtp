import express, { Request, Response } from 'express';
import { createServer as createViteServer } from 'vite';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { INITIAL_SOFTWARES, INITIAL_ORDERS } from './src/data/initialData';
import { Software, Order, OrderStatus, User, AppConfig } from './src/types';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = Number(process.env.PORT) || 3000;
const DATA_DIR = path.join(__dirname, 'data');
const DB_FILE = path.join(DATA_DIR, 'store.json');

// Ensure data folder exists
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

interface DatabaseSchema {
  users: User[];
  softwares: Software[];
  orders: Order[];
  config: AppConfig;
}

const DEFAULT_USERS: User[] = [
  {
    id: 'usr-demo-01',
    name: 'Kouassi Marc Yao',
    email: 'marc.yao.pro@gmail.com',
    password: 'password123',
    phone: '+225 07 48 92 11 34',
    computerDetails: 'Dell XPS 15, Windows 11 64-bit, 32 Go RAM',
    createdAt: '2026-10-15T08:00:00Z'
  }
];

const DEFAULT_DB: DatabaseSchema = {
  users: DEFAULT_USERS,
  softwares: INITIAL_SOFTWARES,
  orders: INITIAL_ORDERS,
  config: {
    waveMode: 'phone_transfer', // 'phone_transfer' or 'api'
    waveApiKey: process.env.WAVE_API_KEY || 'wave_ci_test_sec_9941a87b209e84fc9a',
    waveSandboxMode: true,
    waveMerchantPhone: '+225 07 48 92 11 34', // Numéro Wave Marchand de paiement
    waveMerchantName: 'LogiSoft Distribution',
    googleDriveRootFolder: 'https://drive.google.com/drive/folders/1_LogiSoft_MasterWarehouse_Demo',
    driveManagerEmail: 'elieniamke145@gmail.com', // Gestionnaire des fichiers Drive
    adminEmail: 'danielniamke7@gmail.com'
  }
};

function readDb(): DatabaseSchema {
  try {
    if (fs.existsSync(DB_FILE)) {
      const data = fs.readFileSync(DB_FILE, 'utf-8');
      const parsed = JSON.parse(data);
      if (!parsed.users) parsed.users = DEFAULT_USERS;
      if (!parsed.config) parsed.config = DEFAULT_DB.config;
      if (!parsed.config.waveMerchantPhone) parsed.config.waveMerchantPhone = '+225 07 48 92 11 34';
      if (!parsed.config.waveMode) parsed.config.waveMode = 'phone_transfer';
      return parsed;
    }
  } catch (err) {
    console.error('Error reading db file, using default data:', err);
  }
  writeDb(DEFAULT_DB);
  return DEFAULT_DB;
}

function writeDb(data: DatabaseSchema): void {
  try {
    fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2), 'utf-8');
  } catch (err) {
    console.error('Error writing to database:', err);
  }
}

// Middleware
app.use(express.json());

// API Routes
app.get('/api/health', (_req: Request, res: Response) => {
  res.json({ status: 'ok', service: 'LogiSoft API', time: new Date().toISOString() });
});

// AUTHENTICATION ROUTES (Clients)
app.post('/api/auth/register', (req: Request, res: Response) => {
  const db = readDb();
  const { name, email, password, phone, computerDetails } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({ error: 'Le nom, l\'email et le mot de passe sont obligatoires' });
  }

  const existing = db.users.find((u) => u.email.toLowerCase() === email.trim().toLowerCase());
  if (existing) {
    return res.status(400).json({ error: 'Un compte existe déjà avec cette adresse email' });
  }

  const newUser: User = {
    id: `usr-${Date.now()}`,
    name: name.trim(),
    email: email.trim().toLowerCase(),
    password: password.trim(),
    phone: phone ? phone.trim() : '',
    computerDetails: computerDetails ? computerDetails.trim() : '',
    createdAt: new Date().toISOString()
  };

  db.users.push(newUser);
  writeDb(db);

  // Strip password for response
  const { password: _, ...userWithoutPass } = newUser;
  res.status(201).json({
    token: `token-${newUser.id}-${Date.now()}`,
    user: userWithoutPass
  });
});

app.post('/api/auth/login', (req: Request, res: Response) => {
  const db = readDb();
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: 'Veuillez saisir votre email et mot de passe' });
  }

  const user = db.users.find(
    (u) => u.email.toLowerCase() === email.trim().toLowerCase() && u.password === password.trim()
  );

  if (!user) {
    return res.status(401).json({ error: 'Adresse email ou mot de passe incorrect' });
  }

  const { password: _, ...userWithoutPass } = user;
  res.json({
    token: `token-${user.id}-${Date.now()}`,
    user: userWithoutPass
  });
});

app.get('/api/auth/me', (req: Request, res: Response) => {
  const email = req.query.email as string;
  const db = readDb();
  if (!email) {
    return res.status(400).json({ error: 'Paramètre email manquant' });
  }
  const user = db.users.find((u) => u.email.toLowerCase() === email.toLowerCase());
  if (!user) {
    return res.status(404).json({ error: 'Utilisateur introuvable' });
  }
  const { password: _, ...userWithoutPass } = user;
  res.json(userWithoutPass);
});

app.get('/api/user/orders', (req: Request, res: Response) => {
  const email = (req.query.email as string || '').toLowerCase();
  const userId = req.query.userId as string;
  const db = readDb();

  const userOrders = db.orders.filter(
    (o) => (userId && o.userId === userId) || (email && o.customerEmail.toLowerCase() === email)
  );

  res.json(userOrders);
});

// Softwares API
app.get('/api/software', (req: Request, res: Response) => {
  const db = readDb();
  const includeInactive = req.query.all === 'true';
  const list = includeInactive ? db.softwares : db.softwares.filter((s) => s.active);
  res.json(list);
});

app.get('/api/software/:id', (req: Request, res: Response) => {
  const db = readDb();
  const software = db.softwares.find((s) => s.id === req.params.id);
  if (!software) {
    return res.status(404).json({ error: 'Logiciel introuvable' });
  }
  res.json(software);
});

app.post('/api/software', (req: Request, res: Response) => {
  const db = readDb();
  const newSoftware: Software = {
    ...req.body,
    id: req.body.id || `sw-${Date.now()}`,
    active: req.body.active ?? true
  };
  db.softwares.push(newSoftware);
  writeDb(db);
  res.status(201).json(newSoftware);
});

app.put('/api/software/:id', (req: Request, res: Response) => {
  const db = readDb();
  const index = db.softwares.findIndex((s) => s.id === req.params.id);
  if (index === -1) {
    return res.status(404).json({ error: 'Logiciel introuvable' });
  }
  db.softwares[index] = { ...db.softwares[index], ...req.body };
  writeDb(db);
  res.json(db.softwares[index]);
});

app.delete('/api/software/:id', (req: Request, res: Response) => {
  const db = readDb();
  const index = db.softwares.findIndex((s) => s.id === req.params.id);
  if (index === -1) {
    return res.status(404).json({ error: 'Logiciel introuvable' });
  }
  const deleted = db.softwares.splice(index, 1);
  writeDb(db);
  res.json({ success: true, deleted: deleted[0] });
});

// Orders API
app.get('/api/orders', (req: Request, res: Response) => {
  const db = readDb();
  const { status, search } = req.query;
  let result = db.orders;

  if (status && status !== 'Tous') {
    result = result.filter((o) => o.status === status);
  }

  if (search && typeof search === 'string') {
    const q = search.toLowerCase();
    result = result.filter(
      (o) =>
        o.reference.toLowerCase().includes(q) ||
        o.customerEmail.toLowerCase().includes(q) ||
        o.customerName.toLowerCase().includes(q) ||
        o.customerPhone.includes(q)
    );
  }

  res.json(result);
});

app.get('/api/orders/:idOrRef', (req: Request, res: Response) => {
  const db = readDb();
  const param = req.params.idOrRef.trim().toLowerCase();
  const order = db.orders.find(
    (o) => o.id.toLowerCase() === param || o.reference.toLowerCase() === param || o.customerEmail.toLowerCase() === param
  );
  if (!order) {
    return res.status(404).json({ error: 'Commande introuvable' });
  }
  res.json(order);
});

app.post('/api/orders', (req: Request, res: Response) => {
  const db = readDb();
  const { customerName, customerEmail, customerPhone, computerDetails, softwareId, notes, userId } = req.body;

  if (!customerName || !customerEmail || !customerPhone || !softwareId) {
    return res.status(400).json({ error: 'Veuillez renseigner tous les champs obligatoires' });
  }

  const software = db.softwares.find((s) => s.id === softwareId);
  if (!software) {
    return res.status(404).json({ error: 'Logiciel sélectionné introuvable' });
  }

  const totalFCFA = software.priceFCFA;
  const refRandom = Math.floor(1000 + Math.random() * 9000);
  const reference = `CMD-2026-${refRandom}`;

  const newOrder: Order = {
    id: `ord-${Date.now()}`,
    reference,
    userId: userId || undefined,
    customerName,
    customerEmail,
    customerPhone,
    computerDetails: computerDetails || '',
    item: {
      softwareId: software.id,
      softwareName: software.name,
      version: software.version,
      priceFCFA: software.priceFCFA,
      googleDriveUrl: software.googleDriveUrl
    },
    totalFCFA,
    status: 'En attente',
    paymentMethod: db.config.waveMode === 'api' ? 'wave_api' : 'wave_phone',
    driveAccessGranted: false,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    notes: notes || ''
  };

  db.orders.unshift(newOrder);
  writeDb(db);
  res.status(201).json(newOrder);
});

// Wave Checkout Integration Endpoints
app.post('/api/wave/create-checkout-session', (req: Request, res: Response) => {
  const db = readDb();
  const { orderId } = req.body;

  const orderIndex = db.orders.findIndex((o) => o.id === orderId || o.reference === orderId);
  if (orderIndex === -1) {
    return res.status(404).json({ error: 'Commande introuvable pour ce paiement Wave' });
  }

  const order = db.orders[orderIndex];
  const waveTxId = `WAVE_TRX_${Date.now()}_${Math.floor(1000 + Math.random() * 9000)}`;
  const checkoutUrl = `https://pay.wave.com/c/checkout-${order.reference.toLowerCase()}`;

  order.waveTransactionId = waveTxId;
  order.waveCheckoutUrl = checkoutUrl;
  order.paymentMethod = db.config.waveMode === 'api' ? 'wave_api' : 'wave_phone';
  order.updatedAt = new Date().toISOString();
  db.orders[orderIndex] = order;
  writeDb(db);

  res.json({
    success: true,
    waveTransactionId: waveTxId,
    checkoutUrl,
    orderId: order.id,
    clientReference: order.reference,
    amountFCFA: order.totalFCFA,
    currency: 'XOF',
    waveMerchantPhone: db.config.waveMerchantPhone,
    waveMode: db.config.waveMode
  });
});

app.get('/api/wave/verify/:orderId', (req: Request, res: Response) => {
  const db = readDb();
  const order = db.orders.find((o) => o.id === req.params.orderId || o.reference === req.params.orderId);

  if (!order) {
    return res.status(404).json({ error: 'Commande introuvable' });
  }

  const isPaid = order.status === 'Payée' || order.status === 'Livraison en cours' || order.status === 'Livrée';

  res.json({
    orderId: order.id,
    reference: order.reference,
    status: order.status,
    isPaid,
    waveTransactionId: order.waveTransactionId,
    driveAccessGranted: order.driveAccessGranted,
    googleDriveUrl: isPaid ? order.item.googleDriveUrl : null
  });
});

// Endpoint to simulate or record Wave webhook/payment callback
app.post('/api/wave/simulate-webhook', (req: Request, res: Response) => {
  const db = readDb();
  const { orderId, success, transactionId } = req.body;

  const orderIndex = db.orders.findIndex((o) => o.id === orderId || o.reference === orderId);
  if (orderIndex === -1) {
    return res.status(404).json({ error: 'Commande introuvable' });
  }

  const order = db.orders[orderIndex];

  if (success) {
    order.status = 'Payée';
    order.waveTransactionId = transactionId || order.waveTransactionId || `WAVE_TRX_${Date.now()}`;
    order.notes = (order.notes ? order.notes + ' | ' : '') + `Paiement Wave validé le ${new Date().toLocaleString('fr-FR')}`;
  } else {
    order.status = 'Échouée';
    order.notes = (order.notes ? order.notes + ' | ' : '') + `Paiement Wave annulé/échoué le ${new Date().toLocaleString('fr-FR')}`;
  }

  order.updatedAt = new Date().toISOString();
  db.orders[orderIndex] = order;
  writeDb(db);

  res.json({
    success: true,
    message: success ? 'Paiement Wave validé par le serveur' : 'Transaction marquée comme échouée',
    order
  });
});

// Admin actions
app.post('/api/orders/:id/grant-drive', (req: Request, res: Response) => {
  const db = readDb();
  const orderIndex = db.orders.findIndex((o) => o.id === req.params.id);

  if (orderIndex === -1) {
    return res.status(404).json({ error: 'Commande introuvable' });
  }

  const order = db.orders[orderIndex];
  order.driveAccessGranted = true;
  order.driveGrantedAt = new Date().toISOString();
  if (order.status === 'Payée') {
    order.status = 'Livraison en cours';
  }
  order.notes = (order.notes ? order.notes + ' | ' : '') + `Accès Google Drive accordé à ${order.customerEmail}`;
  order.updatedAt = new Date().toISOString();

  db.orders[orderIndex] = order;
  writeDb(db);
  res.json({ success: true, order });
});

app.put('/api/orders/:id/status', (req: Request, res: Response) => {
  const db = readDb();
  const { status, notes } = req.body;
  const orderIndex = db.orders.findIndex((o) => o.id === req.params.id);

  if (orderIndex === -1) {
    return res.status(404).json({ error: 'Commande introuvable' });
  }

  const order = db.orders[orderIndex];
  order.status = status as OrderStatus;
  if (notes) {
    order.notes = notes;
  }
  order.updatedAt = new Date().toISOString();

  db.orders[orderIndex] = order;
  writeDb(db);
  res.json({ success: true, order });
});

app.post('/api/admin/login', (req: Request, res: Response) => {
  const { email, password } = req.body;
  const inputEmail = (email || '').trim().toLowerCase();
  const inputPass = (password || '').trim();

  if (
    (inputEmail === 'danielniamke7@gmail.com' && inputPass === 'Lemyra') ||
    (inputEmail === 'admin@logisoft.com' && inputPass === 'Lemyra')
  ) {
    return res.json({
      success: true,
      token: 'admin-session-token-logisoft-2026',
      user: {
        id: 'adm-01',
        name: 'Daniel Niamke (Admin)',
        email: 'danielniamke7@gmail.com',
        role: 'superadmin'
      }
    });
  }
  res.status(401).json({ error: 'Identifiants incorrects. Veuillez utiliser l\'email et mot de passe administrateur.' });
});

app.get('/api/admin/stats', (_req: Request, res: Response) => {
  const db = readDb();
  const totalOrders = db.orders.length;
  const paidOrders = db.orders.filter((o) => ['Payée', 'Livraison en cours', 'Livrée'].includes(o.status));
  const pendingOrders = db.orders.filter((o) => o.status === 'En attente');
  const deliveredOrders = db.orders.filter((o) => o.status === 'Livrée');
  const revenueFCFA = paidOrders.reduce((acc, o) => acc + o.totalFCFA, 0);

  res.json({
    totalOrders,
    paidCount: paidOrders.length,
    pendingCount: pendingOrders.length,
    deliveredCount: deliveredOrders.length,
    revenueFCFA,
    totalSoftwares: db.softwares.length,
    totalUsers: db.users.length,
    config: db.config
  });
});

app.put('/api/admin/config', (req: Request, res: Response) => {
  const db = readDb();
  db.config = { ...db.config, ...req.body };
  writeDb(db);
  res.json({ success: true, config: db.config });
});

// Setup Vite or static serving
async function startServer() {
  const isProduction = process.env.NODE_ENV === 'production';

  if (!isProduction) {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa'
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req: Request, res: Response) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`LogiSoft server running on port ${PORT} [Mode: ${isProduction ? 'production' : 'development'}]`);
  });
}

startServer().catch((err) => {
  console.error('Failed to start server:', err);
});
