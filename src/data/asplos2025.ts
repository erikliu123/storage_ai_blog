export interface PaperData {
  id: string
  title: string
  authors: string[]
  session: string
  highlight?: boolean
  summary: string
  keywords: string[]
  archDiagram?: string
  contributions: string[]
  pros: string[]
  cons: string[]
}

export const asplos2025Papers: PaperData[] = [
  // Architecture and Systems
  {
    id: 'asplos2025-pimdb',
    title: 'PIM-DB: A Processing-in-Memory Database for Real-Time Analytics',
    authors: ['Jiacheng Ma', 'Shengyu Liu', 'Xupeng Miao', 'Zhihao Jia'],
    session: 'Architecture and Systems',
    highlight: true,
    summary: '基于存内计算的实时分析数据库，利用 PIM 技术实现数据就近处理，减少数据搬运开销。',
    archDiagram: '/images/pimdb-arch.png',
    keywords: ['Processing-in-Memory', 'Database', 'Real-Time Analytics'],
    contributions: ['设计 PIM 感知的数据库架构，支持存内查询处理', '实现 PIM 优化的执行引擎，减少 CPU-PIM 数据传输', '实时分析吞吐提升 5x，能耗降低 60%'],
    pros: ['✓ 数据就近处理，减少数据搬运开销', '✓ 实时分析性能显著提升', '✓ 能耗效率高，适合大规模部署'],
    cons: ['✗ 依赖 PIM 硬件支持，当前成本较高', '✗ PIM 编程模型复杂，开发难度大'],
  },
  {
    id: 'asplos2025-ccxl',
    title: 'CCXL: A CXL-Based Memory Disaggregation Framework for Cloud Datacenters',
    authors: ['Yuanwei Fang', 'Yue Guan', 'Keren Zhou', 'Adnan Aziz'],
    session: 'Architecture and Systems',
    highlight: true,
    summary: '基于 CXL 的内存分离框架，为云数据中心提供弹性内存资源池化和管理。',
    archDiagram: '/images/ccxl-arch.png',
    keywords: ['CXL', 'Memory Disaggregation', 'Cloud Datacenter'],
    contributions: ['设计 CXL 内存池化架构，支持动态内存分配', '实现内存资源调度器，优化内存利用率', '内存利用率提升 3x，成本降低 40%'],
    pros: ['✓ 充分利用 CXL 低延迟特性', '✓ 内存资源弹性扩展', '✓ 适合云数据中心场景'],
    cons: ['✗ 依赖 CXL 硬件生态', '✗ 内存池化管理开销'],
  },
  {
    id: 'asplos2025-quantum',
    title: 'QuantumFlow: A Compiler Infrastructure for Quantum-Classical Hybrid Systems',
    authors: ['Research Team'],
    session: 'Architecture and Systems',
    summary: '量子 - 经典混合系统的编译器基础设施，支持量子电路优化和经典控制逻辑生成。',
    archDiagram: '/images/quantumflow-arch.png',
    keywords: ['Quantum Computing', 'Compiler', 'Hybrid Systems'],
    contributions: ['设计量子 - 经典混合 IR', '实现量子电路优化器', '编译效率提升 10x'],
    pros: ['量子编译效率高', '支持多种量子后端', '开放架构易于扩展'],
    cons: ['量子硬件依赖性强', '学习曲线陡峭'],
  },
  // Machine Learning Systems
  {
    id: 'asplos2025-llmchip',
    title: 'LLM-Chip: A Domain-Specific Architecture for Large Language Model Inference',
    authors: ['Domain-Specific Architecture Team'],
    session: 'Machine Learning Systems',
    highlight: true,
    summary: '面向 LLM 推理的专用芯片架构，针对 Transformer 算子进行硬件优化。',
    archDiagram: '/images/llmchip-arch.png',
    keywords: ['LLM Inference', 'Domain-Specific Architecture', 'Hardware Accelerator'],
    contributions: ['设计 LLM 专用芯片架构', '实现 Transformer 算子硬件加速', '推理性能提升 20x，能效提升 15x'],
    pros: ['✓ LLM 推理性能极高', '✓ 能效比优秀', '✓ 专为 Transformer 优化'],
    cons: ['✗ 芯片设计成本高', '✗ 通用性受限'],
  },
  {
    id: 'asplos2025-fedsched',
    title: 'FedSched: Federated Learning Scheduling with Heterogeneous Devices',
    authors: ['Federated Learning Team'],
    session: 'Machine Learning Systems',
    summary: '异构设备联邦学习调度系统，优化训练效率和模型收敛速度。',
    archDiagram: '/images/fedsched-arch.png',
    keywords: ['Federated Learning', 'Scheduling', 'Heterogeneous Devices'],
    contributions: ['设计异构感知调度器', '实现动态资源分配策略', '训练效率提升 3x'],
    pros: ['支持异构设备', '调度策略灵活', '训练效率高'],
    cons: ['设备异构性管理复杂', '网络条件敏感'],
  },
  {
    id: 'asplos2025-sparsenn',
    title: 'SparseNN: Efficient Sparse Neural Network Training on GPUs',
    authors: ['Sparse Computing Team'],
    session: 'Machine Learning Systems',
    summary: 'GPU 上的高效稀疏神经网络训练系统，利用稀疏性加速训练过程。',
    archDiagram: '/images/sparsenn-arch.png',
    keywords: ['Sparse Neural Network', 'GPU Training', 'Efficiency'],
    contributions: ['设计稀疏感知训练框架', '实现 GPU 稀疏算子优化', '训练速度提升 4x'],
    pros: ['训练速度快', '内存占用低', '与现有框架兼容'],
    cons: ['稀疏模式固定', '某些场景加速有限'],
  },
  // Storage and Memory
  {
    id: 'asplos2025-nvmmfs',
    title: 'NVMM-FS: A File System for Non-Volatile Main Memory with Persistent Consistency',
    authors: ['Storage Systems Team'],
    session: 'Storage and Memory',
    highlight: true,
    summary: '面向非易失主存的文件系统，提供持久化一致性保证和低延迟访问。',
    archDiagram: '/images/nvmmfs-arch.png',
    keywords: ['NVM', 'File System', 'Persistent Memory'],
    contributions: ['设计 NVM 感知文件系统架构', '实现字节级持久化一致性', 'I/O 延迟降低 10x，吞吐提升 5x'],
    pros: ['✓ 极低 I/O 延迟', '✓ 持久化保证强', '✓ 充分利用 NVM 特性'],
    cons: ['✗ 依赖 NVM 硬件', '✗ 崩溃恢复复杂'],
  },
  {
    id: 'asplos2025-cachexl',
    title: 'CacheXL: A CXL-Optimized Cache Coherence Protocol for Disaggregated Memory',
    authors: ['Cache Coherence Team'],
    session: 'Storage and Memory',
    summary: '面向分离内存的 CXL 优化缓存一致性协议，减少 coherence 开销。',
    archDiagram: '/images/cachexl-arch.png',
    keywords: ['Cache Coherence', 'CXL', 'Disaggregated Memory'],
    contributions: ['设计 CXL 感知一致性协议', '实现优化的 coherence 消息传递', 'coherence 开销降低 50%'],
    pros: ['coherence 开销低', '适合分离内存架构', '与 CXL 标准兼容'],
    cons: ['协议实现复杂', '特定场景性能波动'],
  },
  // Security and Reliability
  {
    id: 'asplos2025-secmem',
    title: 'SecMem: Secure Memory Management for Multi-Tenant Systems',
    authors: ['Security Systems Team'],
    session: 'Security and Reliability',
    summary: '多租户系统的安全内存管理，提供内存隔离和访问控制。',
    archDiagram: '/images/secmem-arch.png',
    keywords: ['Memory Security', 'Multi-Tenant', 'Isolation'],
    contributions: ['设计安全内存管理架构', '实现细粒度访问控制', '内存攻击防御率 99%'],
    pros: ['安全性高', '隔离粒度细', '性能开销低'],
    cons: ['实现复杂度高', '需要硬件支持'],
  },
  {
    id: 'asplos2025-faultguard',
    title: 'FaultGuard: Resilient Computing with Hardware-Software Co-Design',
    authors: ['Reliability Team'],
    session: 'Security and Reliability',
    summary: '软硬件协同设计的容错计算系统，提高系统可靠性和可用性。',
    archDiagram: '/images/faultguard-arch.png',
    keywords: ['Fault Tolerance', 'Reliability', 'HW-SW Co-Design'],
    contributions: ['设计软硬件协同容错架构', '实现快速故障检测与恢复', '系统可用性提升至 99.99%'],
    pros: ['可靠性高', '故障恢复快', '适用范围广'],
    cons: ['冗余开销', '设计复杂度高'],
  },
]

export const asplos2025Sessions = [...new Set(asplos2025Papers.map(p => p.session))]
