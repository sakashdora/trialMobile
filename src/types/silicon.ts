export interface SiliconMetric {
  id: string;
  targetValue: number;
  decimals: number;
  prefix?: string;
  suffix: string;
  label: string;
  sublabel: string;
  description: string;
  iconName: 'Cpu' | 'Zap' | 'Sparkles' | 'Layers';
}

export interface DieBlock {
  id: string;
  name: string;
  category: 'cpu' | 'gpu' | 'npu' | 'memory';
  cores: string;
  transistorShare: string;
  description: string;
  specs: { label: string; value: string }[];
  rect: { x: number; y: number; width: number; height: number; rx?: number };
}

export interface ComputeBenchmark {
  id: string;
  title: string;
  workload: string;
  unit: string;
  a19Score: number;
  a19Display: string;
  baselineName: string;
  baselineScore: number;
  baselineDisplay: string;
  competitorName: string;
  competitorScore: number;
  competitorDisplay: string;
  upliftPercent: number;
  description: string;
}

export interface TechnicalDeepDiveCard {
  id: string;
  badge: string;
  title: string;
  summary: string;
  bullets: string[];
}
