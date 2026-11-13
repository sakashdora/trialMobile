export interface ConciergeCard {
  id: string;
  title: string;
  eyebrow: string;
  description: string;
  iconName: 'ShieldCheck' | 'Zap' | 'Sparkles';
  metrics: {
    label: string;
    value: string;
  }[];
  actionLabel: string;
}

export interface FAQItem {
  id: string;
  category: 'warranty' | 'dispatch' | 'returns' | 'diagnostics' | 'connectivity';
  badge: string;
  question: string;
  answer: string;
  highlights: string[];
}

export interface DiagnosticTelemetry {
  component: string;
  status: 'calibrated' | 'optimal' | 'verified';
  metric: string;
  detail: string;
}
