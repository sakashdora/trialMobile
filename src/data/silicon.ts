import { SiliconMetric, DieBlock, ComputeBenchmark, TechnicalDeepDiveCard } from '../types/silicon';

export const SILICON_METRICS: SiliconMetric[] = [
  {
    id: 'transistors',
    targetValue: 18.6,
    decimals: 1,
    suffix: 'B',
    label: 'Transistors',
    sublabel: 'TSMC N3P Process Node',
    description: 'Sub-3nm gate pitch photolithography delivering +20% compute density per watt.',
    iconName: 'Cpu',
  },
  {
    id: 'npu',
    targetValue: 39,
    decimals: 0,
    suffix: ' TOPS',
    label: 'Neural Engine',
    sublabel: '16-Core Neural Engine',
    description:
      'Dedicated tensor processing units accelerating on-device generative LLMs and computational optics.',
    iconName: 'Zap',
  },
  {
    id: 'display-engine',
    targetValue: 3000,
    decimals: 0,
    suffix: ' Nits',
    label: 'Peak Outdoor OLED',
    sublabel: 'Subpixel Display Engine',
    description:
      'Hardware-driven per-pixel tone mapping with 1Hz–120Hz ProMotion adaptive refresh rate scaling.',
    iconName: 'Sparkles',
  },
  {
    id: 'cooling',
    targetValue: 100,
    decimals: 0,
    suffix: '%',
    label: 'Passive Graphene Cooling',
    sublabel: 'Zero Throttling Architecture',
    description:
      'Dual-layer hexagonal graphene spreader bonded directly to titanium. 0dB silent dissipation.',
    iconName: 'Layers',
  },
];

export const DIE_BLOCKS: DieBlock[] = [
  {
    id: 'perf-cpu',
    name: 'Firestorm Pro Performance Cores',
    category: 'cpu',
    cores: '2 Cores @ 4.05 GHz',
    transistorShare: '22% Die Area',
    description:
      'Wide-decode microarchitecture with 16MB private L2 cache engineered for single-threaded throughput.',
    specs: [
      { label: 'Clock Speed', value: '4.05 GHz Boost' },
      { label: 'L2 Cache', value: '16 MB Ultra-Low Latency' },
      { label: 'Decode Width', value: '8-Wide Execution' },
    ],
    rect: { x: 30, y: 30, width: 240, height: 160, rx: 12 },
  },
  {
    id: 'eff-cpu',
    name: 'Icestorm Pro Efficiency Cores',
    category: 'cpu',
    cores: '4 Cores @ 2.45 GHz',
    transistorShare: '14% Die Area',
    description:
      'Energy-efficient cluster managing background OS routines, audio decoding, and telemetry polling at 1/5th power.',
    specs: [
      { label: 'Clock Speed', value: '2.45 GHz' },
      { label: 'L2 Cache', value: '4 MB Shared' },
      { label: 'Power Profile', value: '< 650 mW Peak' },
    ],
    rect: { x: 30, y: 210, width: 240, height: 160, rx: 12 },
  },
  {
    id: 'neural-engine',
    name: '16-Core Matrix Neural Engine',
    category: 'npu',
    cores: '16 Tensor Cores',
    transistorShare: '26% Die Area',
    description:
      'Dedicated FP16/INT8 matrix-multiplication pipeline delivering 39 TOPS for real-time generative intelligence.',
    specs: [
      { label: 'Throughput', value: '39.0 TOPS FP16' },
      { label: 'Precision Modes', value: 'FP16, INT8, INT4' },
      { label: 'Transformer Boost', value: '2.4x vs A18' },
    ],
    rect: { x: 290, y: 30, width: 280, height: 160, rx: 12 },
  },
  {
    id: 'gpu-cores',
    name: '6-Core Ray Tracing Pro GPU',
    category: 'gpu',
    cores: '6 Shading Clusters',
    transistorShare: '28% Die Area',
    description:
      'Second-generation hardware-accelerated ray tracing with Dynamic Caching and hardware mesh shading.',
    specs: [
      { label: 'Ray Tracing', value: 'Gen-2 BVH Accelerator' },
      { label: 'Feature Set', value: 'Mesh Shading & Dynamic Caching' },
      { label: 'Peak Bandwidth', value: '68 GB/s Unified' },
    ],
    rect: { x: 290, y: 210, width: 280, height: 110, rx: 12 },
  },
  {
    id: 'memory-fabric',
    name: 'Unified Memory Controller & Cache Fabric',
    category: 'memory',
    cores: '128-bit LPDDR5X Interface',
    transistorShare: '10% Die Area',
    description:
      'Sub-nanosecond interconnect fabric tying CPU, GPU, and NPU directly into a zero-copy memory pool.',
    specs: [
      { label: 'Bus Width', value: '128-bit Quad-Channel' },
      { label: 'Bandwidth', value: '68.2 GB/s' },
      { label: 'Latency', value: '< 18 ns Crossbar' },
    ],
    rect: { x: 290, y: 330, width: 280, height: 40, rx: 8 },
  },
];

export const COMPUTE_BENCHMARKS: ComputeBenchmark[] = [
  {
    id: 'ai-tokens',
    title: 'On-Device Generative LLM Inference',
    workload: '7B Parameter Model (4-bit Quantized)',
    unit: 'Tokens / Sec',
    a19Score: 42.5,
    a19Display: '42.5 tok/s',
    baselineName: 'A18 Bionic',
    baselineScore: 24.1,
    baselineDisplay: '24.1 tok/s',
    competitorName: 'Leading 4nm Flagship',
    competitorScore: 21.0,
    competitorDisplay: '21.0 tok/s',
    upliftPercent: 76,
    description:
      'Instantaneous local generative text completion, real-time audio translation, and local code synthesis without cloud latency.',
  },
  {
    id: 'geekbench-multi',
    title: 'Geekbench 6 Multi-Core Compute',
    workload: 'Complex Integer & Floating Point Suites',
    unit: 'Score',
    a19Score: 10840,
    a19Display: '10,840',
    baselineName: 'A18 Bionic',
    baselineScore: 7210,
    baselineDisplay: '7,210',
    competitorName: 'Leading 4nm Flagship',
    competitorScore: 7490,
    competitorDisplay: '7,490',
    upliftPercent: 50,
    description:
      'Industry-leading multi-threaded computing capability effortlessly compiling code, rendering 4K HDR streams, and multitasking.',
  },
  {
    id: 'ray-tracing',
    title: '3DMark Solar Bay Ray Tracing',
    workload: 'Hardware Real-Time Ray Tracing (1440p)',
    unit: 'Average FPS',
    a19Score: 68.4,
    a19Display: '68.4 FPS',
    baselineName: 'A18 Bionic',
    baselineScore: 44.2,
    baselineDisplay: '44.2 FPS',
    competitorName: 'Leading 4nm Flagship',
    competitorScore: 41.5,
    competitorDisplay: '41.5 FPS',
    upliftPercent: 55,
    description:
      'Console-grade realistic ambient occlusion, dynamic specular reflections, and volumetric shadow mapping at native 120Hz display refresh.',
  },
];

export const TECHNICAL_DEEP_DIVES: TechnicalDeepDiveCard[] = [
  {
    id: 'tsmc-3nm',
    badge: 'Photolithography',
    title: 'TSMC 3nm N3P Architecture',
    summary:
      'Next-generation EUV immersion lithography with fin-pitch scaling delivering maximum energy efficiency.',
    bullets: [
      '18.6 billion FinFET transistors with reduced parasitic capacitance',
      '+12% clock frequency uplift at identical core thermal envelope',
      'Advanced backside power delivery network mitigating IR drop',
    ],
  },
  {
    id: 'thermal-stability',
    badge: 'Thermodynamics',
    title: 'Hexagonal Graphene Cooling',
    summary:
      'Zero-noise solid-state heat spreaders transferring thermal load seamlessly into the Grade-5 titanium chassis.',
    bullets: [
      '1,800 W/mK in-plane thermal conductivity across dual graphene sheets',
      'Eliminates thermal throttling during sustained 120Hz gaming sessions',
      'Total chassis temperature uniformity with zero hot spots',
    ],
  },
  {
    id: 'neural-engine-deep',
    badge: 'Machine Intelligence',
    title: '39 TOPS Real-Time Engine',
    summary:
      'Direct hardware execution for multi-modal vision and natural speech pipelines completely on-device.',
    bullets: [
      'Dedicated FP16 compute blocks for low-power continuous inference',
      'Private cloud-independent processing protecting biometric and photographic telemetry',
      'Hardware-accelerated computational photography and deep fusion rendering',
    ],
  },
];
