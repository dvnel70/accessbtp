import { Software, Order } from '../types';

export const INITIAL_SOFTWARES: Software[] = [
  {
    id: 'sw-autocad-2025',
    name: 'AutoCAD & Architecture Suite',
    version: '2025 Pro (FR/EN)',
    category: 'CAO & Architecture',
    priceFCFA: 25000,
    priceEUR: 38,
    shortDescription: 'Solution de référence pour le dessin technique 2D/3D et la conception architecturale de précision.',
    fullDescription: 'AutoCAD Architecture Suite 2025 fournit aux professionnels du bâtiment et de l\'ingénierie des outils puissants pour automatiser les plans, générer des coupes 3D et collaborer efficacement sur des projets DWG de grande envergure.',
    features: [
      'Conception 2D et modélisation 3D avancée avec précision nanométrique',
      'Bibliothèque de plus de 8 500 blocs d\'architecture et symboles techniques',
      'Génération automatique d\'élévations, coupes et nomenclatures',
      'Compatibilité parfaite avec fichiers DWG, DXF, IFC et PDF vectoriels',
      'Moteur de rendu photoréaliste et exportation haute résolution'
    ],
    imagePrimary: '/src/assets/images/product_autocad_design_1792444245306.jpg',
    imageSecondary: '/src/assets/images/hero_software_suite_1792444243588.jpg',
    minSpecs: {
      os: 'Windows 10 / 11 (64-bit version 21H2 ou ultérieure)',
      cpu: 'Processeur 2.5 GHz ou plus rapide (Intel Core i5 / AMD Ryzen 5)',
      ram: '8 Go minimum (16 Go vivement recommandés)',
      gpu: 'GPU 2 Go avec support DirectX 12 et Shader Model 6.0',
      storage: '12 Go d\'espace libre sur disque SSD'
    },
    recommendedSpecs: {
      os: 'Windows 11 64-bit Professionnel',
      cpu: 'Processeur 3.0+ GHz (Intel Core i7/i9 13e/14e gén ou AMD Ryzen 7/9)',
      ram: '32 Go de RAM DDR4/DDR5 haute fréquence',
      gpu: 'NVIDIA RTX 4060 ou supérieure avec 8 Go VRAM dédiée',
      storage: '25 Go d\'espace disponible sur SSD NVMe ultra-rapide'
    },
    osCompatibility: ['Windows 10/11', 'macOS Intel', 'macOS Apple Silicon'],
    includedItems: [
      'Installateur complet hors-ligne pré-vérifié (Contrôle SHA-256)',
      'Accès Google Drive permanent avec bande passante illimitée',
      'Fichiers et documents d\'installation préparés par le gestionnaire',
      'Vérification des prérequis et des dépendances DirectX/C++'
    ],
    googleDriveUrl: 'https://drive.google.com/drive/folders/1aA_AutoCAD2025_Suite_SecuredFiles_Demo',
    googleDriveFolderId: '1aA_AutoCAD2025_Suite',
    fileSize: '4.8 Go',
    active: true,
    featured: true
  },
  {
    id: 'sw-creative-studio-2024',
    name: 'Creative Studio Suite Complete',
    version: '2024 Ultimate (v25.2)',
    category: 'Création & Multimédia',
    priceFCFA: 20000,
    priceEUR: 30,
    shortDescription: 'L\'ensemble tout-en-un pour la retouche photo professionnelle, le montage vidéo 4K et les effets visuels.',
    fullDescription: 'Une suite complète regroupant les outils incontournables pour les graphistes, vidéastes et créateurs de contenu. Comprend modules de retouche photo haute résolution, découpe vectorielle, montage vidéo multi-pistes et étalonnage colorimétrique de pointe.',
    features: [
      'Retouche photographique non destructive avec calques et masques intelligents',
      'Montage vidéo multi-caméras 4K/8K avec étalonnage colorimétrique professionnel',
      'Accélération matérielle complète GPU CUDA / Metal / OpenCL',
      'Création vectorielle sans perte et typographie avancée',
      'Pack de plugins et filtres créatifs pré-installés'
    ],
    imagePrimary: '/src/assets/images/product_creative_suite_1792444245074.jpg',
    imageSecondary: '/src/assets/images/hero_software_suite_1792444243588.jpg',
    minSpecs: {
      os: 'Windows 10/11 ou macOS 12 (Monterey) ou ultérieur',
      cpu: 'Processeur multicœur Intel 6e génération ou AMD Ryzen 1000 / Apple M1',
      ram: '8 Go de mémoire vive',
      gpu: 'Carte graphique 2 Go de mémoire VRAM avec DirectX 12',
      storage: '15 Go d\'espace disponible sur SSD'
    },
    recommendedSpecs: {
      os: 'Windows 11 ou macOS Sonoma / Sequoia',
      cpu: 'Intel Core i7/i9 8 cœurs ou Apple Silicon M2/M3 Pro/Max',
      ram: '16 Go à 32 Go de mémoire unifiée / RAM',
      gpu: 'NVIDIA RTX série 30/40 ou Apple M-Series GPU (4 Go+ VRAM)',
      storage: 'SSD NVMe rapide avec au moins 30 Go d\'espace libre'
    },
    osCompatibility: ['Windows 10/11', 'macOS Intel', 'macOS Apple Silicon'],
    includedItems: [
      'Fichiers d\'installation originaux compressés en archive sécurisée',
      'Lien d\'accès direct vers le dossier privé Google Drive',
      'Fiche explicative pas à pas avec captures d\'écran pour chaque étape',
      'Vidéothèque d\'aide à l\'installation et à l\'optimisation des performances',
      'Vérification de la compatibilité matérielle par notre équipe'
    ],
    googleDriveUrl: 'https://drive.google.com/drive/folders/1bB_CreativeStudio_2024_SecuredFiles_Demo',
    googleDriveFolderId: '1bB_CreativeStudio2024',
    fileSize: '7.2 Go',
    active: true,
    featured: true
  },
  {
    id: 'sw-office-pro-2024',
    name: 'Pack Bureautique Entreprise Pro',
    version: '2024 LTSC Professional Plus',
    category: 'Bureautique & Gestion',
    priceFCFA: 15000,
    priceEUR: 23,
    shortDescription: 'Suite bureautique complète sans abonnement avec traitement de texte, tableur avancé et présentations.',
    fullDescription: 'Le standard de la bureautique d\'entreprise pour professionnels, étudiants et indépendants. Traitement de texte, tableur avec macros et tableaux croisés dynamiques, gestion de courriels et bases de données en version perpétuelle.',
    features: [
      'Applications complètes : Traitement de texte, Tableur pro, Présentations, Messagerie & Base de données',
      'Utilisation 100% hors-ligne sans abonnement mensuel contraignant',
      'Prise en charge native des formats modernes DOCX, XLSX, PPTX, PDF',
      'Outils d\'analyse de données approfondis et graphiques dynamiques',
      'Interface personnalisable disponible en français et anglais'
    ],
    imagePrimary: '/src/assets/images/product_office_dev_1792444246239.jpg',
    imageSecondary: '/src/assets/images/installation_guide_drive_1792444245259.jpg',
    minSpecs: {
      os: 'Windows 10 / 11 (32-bit ou 64-bit) ou macOS 11+',
      cpu: 'Processeur 2 cœurs à 1.6 GHz ou supérieur',
      ram: '4 Go de RAM',
      gpu: 'Résolution d\'affichage minimale 1280 x 768',
      storage: '6 Go d\'espace disque libre'
    },
    recommendedSpecs: {
      os: 'Windows 11 64-bit ou macOS Sonoma',
      cpu: 'Processeur 4 cœurs à 2.4 GHz ou Apple Silicon M1/M2/M3',
      ram: '8 Go de RAM ou plus',
      gpu: 'Carte graphique compatible DirectX 10 / Metal pour accélération fluide',
      storage: '10 Go sur SSD pour une réactivité instantanée'
    },
    osCompatibility: ['Windows 10/11', 'macOS Intel', 'macOS Apple Silicon'],
    includedItems: [
      'Image ISO d\'installation officielle propre et vérifiée',
      'Dossier Google Drive avec téléchargement direct haute vitesse',
      'Guide PDF illustré complet : montage ISO, installation et paramétrage',
      'Script d\'optimisation système pour démarrage rapide',
      'Garantie d\'assistance à l\'activation et support technique'
    ],
    googleDriveUrl: 'https://drive.google.com/drive/folders/1cC_OfficePro_2024_SecuredFiles_Demo',
    googleDriveFolderId: '1cC_OfficePro2024',
    fileSize: '4.2 Go',
    active: true,
    featured: false
  },
  {
    id: 'sw-revit-bim-2024',
    name: 'Revit BIM & Ingénierie Structure',
    version: '2024 Full Architecture & MEP',
    category: 'CAO & Architecture',
    priceFCFA: 30000,
    priceEUR: 45,
    shortDescription: 'Modélisation des données du bâtiment (BIM) pour architectes, ingénieurs et bureaux d\'études.',
    fullDescription: 'Revit 2024 est la référence absolue pour la modélisation BIM multidisciplinaire. Il permet de coordonner l\'architecture, les structures porteuses et les réseaux techniques (MEP) au sein d\'un seul et même modèle 3D paramétrique intelligent.',
    features: [
      'Modélisation BIM paramétrique avec calcul automatique des quantités',
      'Outils structurels, fluides, ventilation, électricité et plomberie',
      'Détection automatique des collisions et conflits spatiaux',
      'Rendu réaliste en temps réel avec visite virtuelle interactive',
      'Exportation aux standards internationaux IFC 4 et DWG 3D'
    ],
    imagePrimary: '/src/assets/images/hero_software_suite_1792444243588.jpg',
    imageSecondary: '/src/assets/images/product_autocad_design_1792444245306.jpg',
    minSpecs: {
      os: 'Windows 10 / 11 (64-bit)',
      cpu: 'Intel i5 / AMD Ryzen 5 multicœur 2.5 GHz',
      ram: '16 Go de RAM',
      gpu: 'Carte graphique 4 Go compatible DirectX 11 / Shader Model 5',
      storage: '30 Go d\'espace libre sur SSD'
    },
    recommendedSpecs: {
      os: 'Windows 11 64-bit Professionnel',
      cpu: 'Intel Core i7/i9 13e/14e gén 3.5 GHz ou Ryzen 9',
      ram: '32 Go ou 64 Go de RAM pour maquettes complexes',
      gpu: 'NVIDIA RTX 4070 / RTX A4000 avec 12 Go VRAM',
      storage: '50 Go sur SSD NVMe PCIe 4.0'
    },
    osCompatibility: ['Windows 10/11'],
    includedItems: [
      'Package complet avec gabarits français (templates architecturaux FR)',
      'Bibliothèques de familles d\'objets BIM standards pré-intégrées',
      'Dossier Google Drive privé avec liens de secours et miroirs',
      'Guide pas à pas avec vidéo détaillée de configuration des chemins BIM',
      'Assistance à distance en cas de blocage d\'installation'
    ],
    googleDriveUrl: 'https://drive.google.com/drive/folders/1dD_RevitBIM_2024_SecuredFiles_Demo',
    googleDriveFolderId: '1dD_RevitBIM2024',
    fileSize: '12.4 Go',
    active: true,
    featured: true
  },
  {
    id: 'sw-davinci-studio-19',
    name: 'DaVinci Video Studio & FX',
    version: '19.1 Studio Ultra (FR/EN)',
    category: 'Création & Multimédia',
    priceFCFA: 22000,
    priceEUR: 34,
    shortDescription: 'La solution professionnelle n°1 d\'Hollywood pour le montage, l\'étalonnage et la post-production audio.',
    fullDescription: 'Combinant montage vidéo avancé, étalonnage colorimétrique de renommée mondiale, effets visuels Fusion et post-production audio Fairlight, DaVinci Studio permet de créer des productions cinématographiques de qualité studio.',
    features: [
      'Moteur d\'étalonnage HDR étendu avec roues de couleurs et courbes personnalisées',
      'Effets visuels nodaux Fusion et incrustation fond vert ultra-précise',
      'Mixage audio Fairlight jusqu\'à 2 000 pistes avec processeurs dynamiques',
      'Accélération double GPU et compatibilité avec formats RAW de caméras cinéma',
      'Outils IA intégrés pour masquage magique et amélioration de la voix'
    ],
    imagePrimary: '/src/assets/images/product_creative_suite_1792444245074.jpg',
    imageSecondary: '/src/assets/images/installation_guide_drive_1792444245259.jpg',
    minSpecs: {
      os: 'Windows 10/11 ou macOS 13 Ventura',
      cpu: 'Intel Core i7 ou AMD Ryzen 7 / Apple Silicon M1',
      ram: '16 Go de mémoire système (32 Go pour la 4K)',
      gpu: 'GPU 4 Go VRAM compatible OpenCL 1.2 ou CUDA 11',
      storage: '10 Go d\'espace sur SSD rapide'
    },
    recommendedSpecs: {
      os: 'Windows 11 ou macOS Sonoma / Sequoia',
      cpu: 'Intel i9 14900K ou Apple Silicon M3 Max',
      ram: '32 Go à 64 Go de RAM',
      gpu: 'NVIDIA RTX 4070 Ti / 4080 (12 Go+ VRAM)',
      storage: 'SSD NVMe dédié aux caches de travail'
    },
    osCompatibility: ['Windows 10/11', 'macOS Apple Silicon', 'Linux'],
    includedItems: [
      'Archive d\'installation complète et pack de codecs Studio',
      'Partage de dossier Google Drive sécurisé avec accès 24/7',
      'Guide pas à pas de configuration GPU pour éviter les saccades',
      'Tutoriel vidéo d\'activation et d\'initialisation de la base de données',
      'Assistance technique directe par WhatsApp ou AnyDesk'
    ],
    googleDriveUrl: 'https://drive.google.com/drive/folders/1eE_DaVinciStudio_19_SecuredFiles_Demo',
    googleDriveFolderId: '1eE_DaVinciStudio19',
    fileSize: '5.6 Go',
    active: true,
    featured: false
  },
  {
    id: 'sw-ide-dev-suite',
    name: 'Dev Suite IDE & Outils Développeur',
    version: '2024 Pro Ultimate Edition',
    category: 'Développement & IT',
    priceFCFA: 18000,
    priceEUR: 27,
    shortDescription: 'Suite d\'environnements de développement pour le web, mobile, Python, Java, C++ et bases de données.',
    fullDescription: 'Le kit indispensable pour les développeurs professionnels. Regroupe des environnements intégrés ultra-rapides avec analyse statique de code, débogueur visuel, intégration Git native, terminal interactif et connecteurs SQL.',
    features: [
      'Complétion de code intelligente et refactorisation sécurisée',
      'Débogueur pas à pas pour JavaScript, TypeScript, Python, PHP, Java, Go',
      'Client de base de données universel avec explorateur de schémas et requêtes SQL',
      'Outils de conteneurisation Docker et gestion de branches Git intégrés',
      'Profilage de performance et couverture de tests automatisés'
    ],
    imagePrimary: '/src/assets/images/product_office_dev_1792444246239.jpg',
    imageSecondary: '/src/assets/images/hero_software_suite_1792444243588.jpg',
    minSpecs: {
      os: 'Windows 10/11, macOS 12+ ou Linux 64-bit',
      cpu: 'Processeur 4 cœurs 2.0 GHz',
      ram: '8 Go de RAM',
      gpu: 'Résolution minimale 1920 x 1080',
      storage: '8 Go d\'espace libre'
    },
    recommendedSpecs: {
      os: 'Windows 11 64-bit ou macOS Sonoma',
      cpu: 'Processeur 8 cœurs 3.2 GHz ou Apple Silicon M2/M3',
      ram: '16 Go à 32 Go de RAM',
      gpu: 'Carte graphique avec accélération matérielle pour UI fluide',
      storage: '20 Go d\'espace sur SSD NVMe'
    },
    osCompatibility: ['Windows 10/11', 'macOS Intel', 'macOS Apple Silicon', 'Linux'],
    includedItems: [
      'Pack d\'installateurs pour tous les langages et environnements',
      'Accès permanent au dossier Google Drive avec mises à jour',
      'Documentation complète de paramétrage des plugins essentiels',
      'Guide d\'optimisation de la mémoire et de l\'indexation',
      'Assistance personnalisée à la configuration'
    ],
    googleDriveUrl: 'https://drive.google.com/drive/folders/1fF_DevSuite_2024_SecuredFiles_Demo',
    googleDriveFolderId: '1fF_DevSuite2024',
    fileSize: '3.9 Go',
    active: true,
    featured: false
  }
];

export const INITIAL_ORDERS: Order[] = [
  {
    id: 'ord-1001',
    reference: 'CMD-2026-8419',
    customerName: 'Kouassi Marc Yao',
    customerEmail: 'marc.yao.pro@gmail.com',
    customerPhone: '+225 07 48 92 11 34',
    computerDetails: 'Dell XPS 15, Windows 11 64-bit, 32 Go RAM',
    item: {
      softwareId: 'sw-autocad-2025',
      softwareName: 'AutoCAD & Architecture Suite',
      version: '2025 Pro (FR/EN)',
      priceFCFA: 25000,
      googleDriveUrl: 'https://drive.google.com/drive/folders/1aA_AutoCAD2025_Suite_SecuredFiles_Demo'
    },
    totalFCFA: 25000,
    status: 'Livrée',
    waveTransactionId: 'WAVE_TRX_98412895123',
    waveCheckoutUrl: 'https://pay.wave.com/c/cos-8491294',
    driveAccessGranted: true,
    driveGrantedAt: '2026-10-18T10:15:00Z',
    createdAt: '2026-10-18T09:42:00Z',
    updatedAt: '2026-10-18T10:30:00Z',
    notes: 'Accès accordé au dossier Google Drive.'
  },
  {
    id: 'ord-1002',
    reference: 'CMD-2026-9104',
    customerName: 'Amina Diop',
    customerEmail: 'amina.diop.design@gmail.com',
    customerPhone: '+221 77 654 32 10',
    computerDetails: 'MacBook Pro M2 Max, macOS Sonoma, 32 Go',
    item: {
      softwareId: 'sw-creative-studio-2024',
      softwareName: 'Creative Studio Suite Complete',
      version: '2024 Ultimate (v25.2)',
      priceFCFA: 20000,
      googleDriveUrl: 'https://drive.google.com/drive/folders/1bB_CreativeStudio_2024_SecuredFiles_Demo'
    },
    totalFCFA: 20000,
    status: 'Livraison en cours',
    waveTransactionId: 'WAVE_TRX_77192841920',
    waveCheckoutUrl: 'https://pay.wave.com/c/cos-7719284',
    driveAccessGranted: true,
    driveGrantedAt: '2026-10-19T11:20:00Z',
    createdAt: '2026-10-19T11:05:00Z',
    updatedAt: '2026-10-19T11:20:00Z',
    notes: 'Paiement Wave vérifié. Accès Google Drive accordé à amina.diop.design@gmail.com.'
  },
  {
    id: 'ord-1003',
    reference: 'CMD-2026-9532',
    customerName: 'Jean-Baptiste Traoré',
    customerEmail: 'jb.traore.tech@gmail.com',
    customerPhone: '+225 05 98 71 45 60',
    computerDetails: 'PC Tour Asus ROG, Windows 11, RTX 4070',
    item: {
      softwareId: 'sw-revit-bim-2024',
      softwareName: 'Revit BIM & Ingénierie Structure',
      version: '2024 Full Architecture & MEP',
      priceFCFA: 30000,
      googleDriveUrl: 'https://drive.google.com/drive/folders/1dD_RevitBIM_2024_SecuredFiles_Demo'
    },
    totalFCFA: 30000,
    status: 'Payée',
    waveTransactionId: 'WAVE_TRX_55928194012',
    waveCheckoutUrl: 'https://pay.wave.com/c/cos-5592819',
    driveAccessGranted: false,
    createdAt: '2026-10-19T13:45:00Z',
    updatedAt: '2026-10-19T13:48:00Z',
    notes: 'Paiement confirmé par Wave. En attente d\'attribution Google Drive par le gestionnaire.'
  }
];

export const FAQS = [
  {
    q: 'Comment fonctionne la livraison des fichiers via Google Drive ?',
    a: 'Les fichiers d\'installation sont stockés sur un dossier Google Drive sécurisé géré par notre équipe. Dès que votre paiement Wave est validé, vous recevez les instructions et le lien direct vers le dossier de votre logiciel pour télécharger à vitesse maximale.'
  },
  {
    q: 'Comment s\'effectue le paiement avec Wave ?',
    a: 'Le paiement s\'effectue directement via Wave. Vous pouvez envoyer le montant vers le numéro Wave marchand indiqué en mentionnant votre référence de commande, ou valider le paiement directement sur mobile.'
  },
  {
    q: 'Où se trouvent les instructions d\'installation ?',
    a: 'Le gestionnaire dépose directement dans votre dossier Google Drive les fichiers d\'installation ainsi que le document d\'instructions et le guide au format PDF.'
  },
  {
    q: 'Puis-je retrouver mes logiciels achetés ?',
    a: 'Oui ! En vous connectant à votre compte client ou via l\'outil « Suivre ma commande », vous accédez directement à vos liens Google Drive et à l\'historique de vos achats à tout moment.'
  }
];
