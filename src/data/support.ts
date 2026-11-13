import { ConciergeCard, FAQItem, DiagnosticTelemetry } from '../types/support';

export const CONCIERGE_CARDS: ConciergeCard[] = [
  {
    id: 'warranty',
    title: '2-Year Full Hardware Warranty',
    eyebrow: 'ZERO DEDUCTIBLE REPAIR',
    description:
      'Comprehensive global repair and replacement protection covering battery health retention below 80%, OLED ProMotion display calibration, and internal silicon components.',
    iconName: 'ShieldCheck',
    metrics: [
      { label: 'Battery Retention', value: '<80% Free Swap' },
      { label: 'Global Coverage', value: '120+ Countries' },
      { label: 'Out-of-Pocket', value: '₹0 Deductible' },
      { label: 'Parts Standard', value: '100% Genuine OEM' },
    ],
    actionLabel: 'Verify Hardware Coverage',
  },
  {
    id: 'dispatch',
    title: 'Express Global Courier Dispatch',
    eyebrow: 'CLIMATE CONTROLLED LOGISTICS',
    description:
      'Priority climate-controlled courier shipping with real-time active shock, vibration, and thermal telemetry logging across 120+ countries worldwide.',
    iconName: 'Zap',
    metrics: [
      { label: 'Metro Delivery', value: '24–48 Hours' },
      { label: 'Same-Day Cutoff', value: '14:00 UTC' },
      { label: 'Active Telemetry', value: 'Temp & Shock Monitored' },
      { label: 'Return Shipping', value: '100% Prepaid Pickup' },
    ],
    actionLabel: 'Track Delivery Protocol',
  },
  {
    id: 'concierge',
    title: '24/7 Dedicated Concierge',
    eyebrow: 'DIRECT HARDWARE SPECIALIST ACCESS',
    description:
      'Direct, continuous access to specialized AZURE hardware engineers for device onboarding, encrypted peer-to-peer data migration, and over-the-air technical diagnostics.',
    iconName: 'Sparkles',
    metrics: [
      { label: 'Response Target', value: '<30 Seconds' },
      { label: 'Automated Trees', value: 'Zero Bots / Humans Only' },
      { label: 'Replacement Policy', value: 'Advance Unit First' },
      { label: 'Migration Path', value: 'Thunderbolt 4 / P2P' },
    ],
    actionLabel: 'Initiate Specialist Chat',
  },
];

export const FAQ_ITEMS: FAQItem[] = [
  {
    id: 'warranty-terms',
    category: 'warranty',
    badge: '2-Year Warranty',
    question: 'What is covered under the 2-Year AZURE Care Hardware Warranty?',
    answer:
      'Every AZURE handset includes two full years of comprehensive global hardware coverage from the date of activation. Coverage encompasses all internal silicon microarchitectures (A19 Ultra and A19), display delamination or pixel anomalies on the 120Hz ProMotion OLED panel, optical sensor-shift assemblies, and battery replacement if maximum capacity drops below 80%. Servicing is completed exclusively with genuine factory components at certified regional repair hubs with zero out-of-pocket deductibles.',
    highlights: [
      '24-Month Full Coverage',
      'Free Battery Swap (<80%)',
      'Zero Deductible',
      '120+ Global Labs',
    ],
  },
  {
    id: 'dispatch-sla',
    category: 'dispatch',
    badge: 'Global Transit',
    question: 'How does Express Global Courier Dispatch operate and what are the delivery times?',
    answer:
      'Orders placed before 14:00 UTC are assembled, custom-paired, and dispatched the same business day. We partner with premier global courier fleets utilizing dedicated climate-controlled, tamper-evident aircraft containers equipped with active telemetry logging. Deliveries to North America, Western Europe, and East Asia arrive within 24 to 48 hours, while international destinations across 120+ countries are fulfilled within 48 to 72 hours with end-to-end shock and temperature verification.',
    highlights: [
      'Same-Day Dispatch (<14:00 UTC)',
      '24–48h Metropolitan SLA',
      'Climate-Controlled Air Transit',
      'End-to-End Telemetry',
    ],
  },
  {
    id: 'return-policy',
    category: 'returns',
    badge: 'Risk-Free Trial',
    question: 'What are the conditions of the 14-day zero-restocking return policy?',
    answer:
      'We invite you to experience AZURE hardware in your everyday life for 14 calendar days from physical delivery. If the device does not seamlessly integrate into your workflow, initiate a return via your bag or concierge dashboard for an immediate prepaid courier pickup. We charge zero restocking fees and issue a 100% full refund to your original payment method immediately upon initial courier scan, provided the device and included accessories are in undamaged physical condition.',
    highlights: [
      '14-Day Evaluation Window',
      'Zero Restocking Fees',
      'Free Scheduled Courier Pickup',
      'Instant Refund on Scan',
    ],
  },
  {
    id: 'diagnostics-repair',
    category: 'diagnostics',
    badge: 'Advance Exchange',
    question: 'How do remote hardware diagnostics and device replacements work?',
    answer:
      'If you encounter unexpected hardware behavior, our 24/7 Concierge can initiate an encrypted telemetry diagnostic handshake with your device over secure cellular or Wi-Fi channels to evaluate display gamma, battery impedance, and sensor calibrations. If physical servicing is required, an Advance Replacement device is dispatched immediately before you surrender your existing device, guaranteeing zero workflow interruption.',
    highlights: [
      'Encrypted Over-The-Air Scan',
      'Advance Unit Dispatched First',
      'Zero Workflow Downtime',
      'Onboarding Migration Included',
    ],
  },
  {
    id: 'esim-connectivity',
    category: 'connectivity',
    badge: 'Worldwide 5G',
    question: 'Are AZURE handsets factory unlocked with worldwide 5G carrier compatibility?',
    answer:
      'All AZURE devices ship completely factory-unlocked without carrier contracts or regional restrictions. Featuring dual active eSIM architecture and universal RF modems supporting over 70 global 5G sub-6GHz and mmWave frequency bands, you can effortlessly maintain concurrent domestic and international cellular profiles with seamless worldwide roaming without physical SIM swapping.',
    highlights: [
      '100% Factory Unlocked',
      'Dual Active eSIM Profiles',
      '70+ Global 5G Bands',
      'Sub-6GHz & mmWave',
    ],
  },
  {
    id: 'data-migration',
    category: 'diagnostics',
    badge: 'White Glove',
    question: 'How does the Concierge assist with data migration and device onboarding?',
    answer:
      'Our dedicated concierge specialists guide you through an encrypted, high-speed migration from iOS, Android, or prior AZURE devices. Utilizing high-speed peer-to-peer Wi-Fi 7 direct transfer or Thunderbolt 4 cable bridging via ArmorCable 240W, photos, contacts, credentials, and app states transfer with end-to-end cryptographic encryption. If trading in an old device, our specialists certify cryptographic zero-write drive wiping.',
    highlights: [
      'Thunderbolt 4 & Wi-Fi 7 Transfer',
      'Cross-Platform Migration',
      'Cryptographic Zero-Write Wipe',
      '1-on-1 Specialist Onboarding',
    ],
  },
];

export const DIAGNOSTIC_TELEMETRY_ITEMS: DiagnosticTelemetry[] = [
  {
    component: 'OLED Display & ProMotion',
    status: 'calibrated',
    metric: '120Hz LTPO / P3 Wide Color',
    detail: 'Delta E < 0.8 Color Accuracy Across Luminance Band',
  },
  {
    component: 'Thermal Dissipation Matrix',
    status: 'optimal',
    metric: '24.2°C Idle / Graphene Layer',
    detail: 'Zero Thermal Throttling Overhead Recorded',
  },
  {
    component: 'Battery Chemical Impedance',
    status: 'calibrated',
    metric: '100% Health / 12 Cycles',
    detail: 'Solid-State Battery Anode Resistance Nominal',
  },
  {
    component: 'Cryptographic Entitlement',
    status: 'verified',
    metric: '24-Month Global Care',
    detail: 'Global Reciprocity Enrolled Across 120+ Repair Hubs',
  },
];
