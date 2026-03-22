export interface PaperSection {
  title: string
  content: string
}

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
  sections?: PaperSection[]
  performanceData?: {
    metric: string
    value: string
    baseline?: string
  }[]
}

export const fast2026Papers: PaperData[] = [
  // Cloud Storage at Scale
  {
    id: 'fast2026-here-there-everywhere',
    title: 'Here, There and Everywhere: The Past, the Present and the Future of Local Storage in Cloud',
    authors: ['Leping Yang', 'Yanbo Zhou', 'Gong Zeng', 'Li Zhang', 'Saisai Zhang', 'Ruilin Wu', 'Chaoyang Sun', 'Shiyi Luo', 'Wenrui Li', 'Keqiang Niu', 'Xiaolu Zhang', 'Junping Wu', 'Jiaji Zhu', 'Jiesheng Wu', 'Mariusz Barczak', 'Wayne Gao', 'Ruiming Lu', 'Erci Xu', 'Guangtao Xue'],
    session: 'Cloud Storage at Scale',
    highlight: true,
    summary: '阿里云对本地存储在云环境中演进的全面回顾与展望。FAST 2026最佳论文奖得主，首次完整公开阿里云从2017年到2023年三代商业化云本地存储架构的完整演进路径。',
    keywords: ['Cloud Storage', 'Local Storage', 'Alibaba Cloud', 'Evolution', 'Best Paper'],
    archDiagram: '/images/storage-arch.png',
    contributions: [
      '系统梳理云本地存储 15 年演进历程（HDD → SSD → NVMe → CXL）',
      '深入分析内核栈方案只能发挥NVMe SSD 9.54% IOPS能力的根因',
      '提出突破本地存储物理架构天花板的下一代混合方案',
      '第三代RISTRETTO：4KB随机读IOPS 900K，顺序读吞吐6.7GB/s',
    ],
    pros: ['业界罕见的 15 年演进全景回顾', '来自阿里云一线实践经验', '对 CXL 等未来技术有前瞻分析'],
    cons: ['偏向经验总结，技术深度一般', '缺乏开源代码或 benchmark 数据'],
    sections: [
      {
        title: '云本地存储的核心价值',
        content: '云本地存储将SSD/HDD物理直连到计算服务器，通过虚拟化技术以虚拟磁盘形式暴露给虚拟机/裸金属实例。核心优势：没有数据中心网络的两跳开销，延迟可压缩到十微秒级；能充分释放NVMe SSD的硬件性能；成本远低于高性能云盘。',
      },
      {
        title: '第一代架构（2017-2019）',
        content: '基于Linux内核态存储栈，使用设备映射器实现虚拟化。问题：内核栈开销大，频繁上下文切换，在高IOPS场景下最多只能发挥NVMe SSD 9.54%的IOPS能力。4KB随机读性能仅能达到物理盘的10%左右。',
      },
      {
        title: '第二代架构（2019-2021）',
        content: '引入用户态轮询模式驱动，绕过内核中断处理。采用SPDK构建用户态存储栈。性能提升明显，但仍受限于虚拟化层的软件开销。随机读IOPS提升至物理盘的60%左右。',
      },
      {
        title: '第三代RISTRETTO',
        content: '用户态-内核协同架构，将数据平面完全置于用户态，控制平面保留在内核。引入硬件卸载引擎处理IO路径，实现零拷贝和批量处理。实测：4KB随机读IOPS 900K，顺序读吞吐6.7GB/s，读延迟77μs。',
      },
      {
        title: '未来：CXL内存扩展',
        content: 'CXL将改变本地存储格局。CXL-attached内存可作为介于DRAM和SSD之间的新存储层级，延迟在100-500ns级别，带宽可达32GB/s以上。阿里云正在探索CXL内存池化和CXL-SSD融合方案。',
      },
    ],
    performanceData: [
      { metric: '4KB随机读IOPS', value: '900K', baseline: '物理盘 1M' },
      { metric: '顺序读吞吐', value: '6.7 GB/s', baseline: '物理盘 7 GB/s' },
      { metric: '读延迟', value: '77 μs', baseline: '物理盘 70 μs' },
      { metric: '内核栈IOPS利用率', value: '9.54%', baseline: '理论100%' },
    ],
  },
  {
    id: 'fast2026-cost-efficient-tape',
    title: 'Cost-efficient Archive Cloud Storage with Tape: Design and Deployment',
    authors: ['Qing Wang', 'Fan Yang', 'Qiang Liu', 'Geng Xiao', 'Yongpeng Chen', 'Hao Lan', 'Leiming Chen', 'Bangzhu Chen', 'Chenrui Liu', 'Pingchang Bai', 'Bin Huang', 'Zigan Luo', 'Mingyu Xie', 'Yu Wang', 'Youyou Lu', 'Huatao Wu', 'Jiwu Shu'],
    session: 'Cloud Storage at Scale',
    highlight: true,
    summary: '清华舒继武团队：基于磁带的大规模归档存储系统设计与实践，成本优化方案。',
    keywords: ['Tape Storage', 'Archive', 'Cost Optimization', 'Tsinghua'],
    archDiagram: '/images/tape-archive.png',
    contributions: ['设计 SSD → HDD → Tape 三层存储架构', '实现智能数据生命周期管理策略', '成本降低 70%，可靠性达 99.999999999%'],
    pros: ['冷存储成本优化显著（70% 降低）', '完整的三层架构设计与实现', '来自真实生产环境部署经验'],
    cons: ['磁带技术门槛高，难以复现', '随机读取延迟较高（分钟级）'],
  },
  {
    id: 'fast2026-acos-apple',
    title: "ACOS: Apple's Geo-Distributed Object Store at Exabyte Scale",
    authors: ['Benjamin Baron', 'Aline Bousquet', 'Eric Metens', 'Swapnil Pimpale', 'Nick Puz', 'Marc de Saint Sauveur', 'Varsha Muzumdar', 'Vinay Ari'],
    session: 'Cloud Storage at Scale',
    highlight: true,
    summary: 'Apple 公开其 EB 级地理分布式对象存储系统 ACOS 的架构设计与运维经验。',
    keywords: ['Object Storage', 'Geo-Distributed', 'Exabyte Scale', 'Apple'],
    archDiagram: '/images/acos-apple.png',
    contributions: ['支持 EB 级数据跨洲际复制', '设计跨区域一致性协议', '实现 99.99% 可用性目标'],
    pros: ['Apple 首次公开 EB 级存储架构', '跨洲际复制的工程实践宝贵', '可用性和一致性设计值得借鉴'],
    cons: ['未开源，细节披露有限', '偏向工业实践，学术创新点不多'],
  },
  // LLM Serving & Storage
  {
    id: 'fast2026-solid-attention',
    title: 'SolidAttention: Low-Latency SSD-based Serving on Memory-Constrained PCs',
    authors: ['Xinrui Zheng', 'Dongliang Wei', 'Jianxiang Gao', 'Yixin Song', 'Zeyu Mi', 'Haibo Chen'],
    session: 'LLM Serving & Storage',
    highlight: true,
    summary: '上交 IPAPS 陈海波团队：在内存受限的 PC 上利用 SSD 加速 LLM 推理，KV Cache 卸载到 SSD。通过预测式预取流水线有效掩盖SSD延迟，让消费级GPU也能运行大模型。',
    keywords: ['LLM Serving', 'SSD', 'KV Cache', 'SJTU IPAPS'],
    archDiagram: '/images/solid-attention.png',
    contributions: ['设计 SSD-based KV Cache 存储层', '实现预测式预取流水线掩盖 SSD 延迟', '在 24GB 显存 PC 上运行 70B 模型'],
    pros: ['让消费级 GPU 也能运行大模型', '预取策略有效掩盖 SSD 延迟', '开源代码，易于复现'],
    cons: ['KV Cache 过大时 SSD 写入成为瓶颈', '预测式预取不适用于随机对话场景'],
    sections: [
      {
        title: '核心问题：GPU显存瓶颈',
        content: 'LLM推理的显存占用主要来自两部分：模型权重（70B模型FP16约140GB）和KV Cache（每个token约数MB）。消费级GPU显存仅24GB，无法直接运行大模型。传统方案需要分布式推理或多卡，成本高昂。',
      },
      {
        title: 'SolidAttention架构设计',
        content: '将KV Cache从GPU HBM卸载到SSD，GPU显存仅保留模型权重和当前计算所需的KV Cache块。核心创新：分层存储架构（HBM → DRAM → SSD），KV Cache按层分布存储在SSD上。',
      },
      {
        title: '预测式预取流水线',
        content: '利用Transformer的自回归特性：生成第i个token时，可以预测第i+1个token需要访问的KV Cache位置。提前异步从SSD预取下一层KV Cache到DRAM，计算与IO重叠，掩盖SSD延迟（约100μs）。',
      },
      {
        title: 'KV Cache存储格式',
        content: 'KV Cache按Transformer层分块存储，每层独立管理。采用列式存储格式，便于按需加载。支持压缩存储，压缩比约2-3x，进一步降低SSD带宽需求。',
      },
      {
        title: '性能表现',
        content: '在RTX 4090（24GB显存）上运行Llama-2-70B模型，128K上下文长度，吞吐达15 tokens/s，延迟P99 < 100ms。相比完全GPU方案，吞吐损失<20%，但显存占用降低80%。',
      },
    ],
    performanceData: [
      { metric: '支持模型规模', value: '70B', baseline: '24GB显存GPU' },
      { metric: '128K上下文吞吐', value: '15 tokens/s', baseline: 'RTX 4090' },
      { metric: '延迟P99', value: '<100ms' },
      { metric: '显存占用降低', value: '80%' },
    ],
  },
  {
    id: 'fast2026-cacheslide',
    title: 'CacheSlide: Unlocking Cross Position-Aware KV Cache Reuse for Accelerating LLM Serving',
    authors: ['Yang Liu', 'Yunfei Gu', 'Liqiang Zhang', 'Chentao Wu', 'Guangtao Xue', 'Jie Li', 'Minyi Guo', 'Junhao Hu', 'Jie Meng'],
    session: 'LLM Serving & Storage',
    summary: '跨位置感知的 KV Cache 复用技术，加速 LLM 推理服务。',
    keywords: ['KV Cache', 'LLM Inference', 'Cache Reuse'],
    contributions: ['发现 KV Cache 跨位置复用机会', '设计位置感知缓存替换策略', '推理吞吐提升 1.8x'],
    pros: ['KV Cache 复用率显著提升', '与现有推理框架兼容性好'],
    cons: ['仅适用于相似前缀的请求场景', '需要额外的缓存管理开销'],
  },
  {
    id: 'fast2026-bidaw',
    title: 'Bidaw: Enhancing Key-Value Caching for Interactive LLM Serving via Bidirectional Computation-Storage Awareness',
    authors: ['Shipeng Hu', 'Guangyan Zhang', 'Yuqi Zhou', 'Yaya Wei', 'Ziyan Zhong', 'Jike Chen'],
    session: 'LLM Serving & Storage',
    summary: '双向计算-存储感知的 KV Cache 优化，提升交互式 LLM 服务性能。',
    keywords: ['KV Cache', 'Interactive LLM', 'Computation-Storage'],
    contributions: ['设计双向感知调度框架', '动态调整计算与存储资源分配', '交互式场景首 token 延迟降低 45%'],
    pros: ['专门优化交互式场景', '动态资源调度适应性强'],
    cons: ['调度框架增加系统复杂度', '极端负载下调度决策可能滞后'],
  },
  {
    id: 'fast2026-model-loading',
    title: 'Accelerating Model Loading in LLM Inference by Programmable Page Cache',
    authors: ['Yubo Liu', 'Hongbo Li', 'Xiaojia Huang', 'Yongfeng Wang', 'Hanjun Guo', 'Hui Chen', 'Yuxin Ren', 'Ning Jia'],
    session: 'LLM Serving & Storage',
    summary: '可编程页缓存加速 LLM 推理中的模型加载。',
    keywords: ['Model Loading', 'Page Cache', 'LLM Inference'],
    contributions: ['设计可编程页缓存接口', '按需加载模型权重块', '模型加载时间从 12s 降至 1.5s'],
    pros: ['模型加载时间大幅缩短', '与 Linux 页缓存机制深度集成'],
    cons: ['需要内核模块支持', '首次加载仍需完整读取'],
  },
  {
    id: 'fast2026-flexllm',
    title: 'FlexLLM: Flexible and Efficient LLM Serving via Heterogeneous Memory Management',
    authors: ['Chen Zhang', 'Wei Wang', 'Jun Li', 'Haibo Chen'],
    session: 'LLM Serving & Storage',
    highlight: true,
    summary: '上交 IPAPS：异构内存管理实现灵活高效的 LLM 服务，HBM + DRAM + SSD 三层调度。通过智能分层策略，在有限显存下实现大模型高效推理。',
    keywords: ['LLM Serving', 'Heterogeneous Memory', 'SJTU IPAPS'],
    archDiagram: '/images/flexllm.png',
    contributions: ['设计 HBM → DRAM → SSD 三层内存调度', '热层保留在 HBM，冷层卸载到 SSD', '单卡 A100 吞吐提升 2.3x'],
    pros: ['充分利用异构内存层级', '自适应调度策略，无需人工调参', '吞吐提升显著（2.3x）'],
    cons: ['依赖特定硬件配置（HBM+DRAM+SSD）', '层间数据迁移引入额外开销'],
    sections: [
      {
        title: '异构内存层级分析',
        content: '现代服务器存在显著的内存层级差异：GPU HBM带宽3TB/s，延迟<100ns，容量有限（80GB）；DDR DRAM带宽100GB/s，延迟100ns，容量大（512GB+）；NVMe SSD带宽7GB/s，延迟10μs，容量最大（30TB+）。FlexLLM的目标是充分利用这三层存储。',
      },
      {
        title: '三层调度架构',
        content: 'Layer 1 (HBM)：存储当前计算所需的模型权重和热KV Cache。Layer 2 (DRAM)：存储近期可能访问的KV Cache和冷模型权重。Layer 3 (SSD)：存储历史KV Cache和检查点数据。调度器根据访问频率动态调整数据位置。',
      },
      {
        title: '热点预测与预取',
        content: '基于注意力分数预测哪些KV Cache会在下一轮被访问。热门请求的KV Cache提升至HBM，冷门请求降级至DRAM/SSD。预取窗口设置为2-3个请求，掩盖数据迁移延迟。',
      },
      {
        title: '性能优化策略',
        content: '1) 权重分片：将模型权重按层分布，热层在HBM，冷层在DRAM。2) KV Cache流水线：异步加载下一批KV Cache。3) 带宽感知：根据当前带宽利用率动态调整预取速率。',
      },
      {
        title: '实测效果',
        content: '在A100 80GB上运行Llama-2-70B，相比HBM-only方案，吞吐提升2.3x，显存占用降低60%。支持的最大序列长度从8K提升至128K，延迟增加<15%。',
      },
    ],
    performanceData: [
      { metric: '吞吐提升', value: '2.3x', baseline: 'HBM-only' },
      { metric: '显存占用降低', value: '60%' },
      { metric: '最大序列长度', value: '128K', baseline: '原8K' },
      { metric: '延迟增加', value: '<15%' },
    ],
  },
  // GPU & PIM
  {
    id: 'fast2026-gpu-checkpoint',
    title: 'GPU Checkpoint/Restore Made Fast and Lightweight',
    authors: ['Jiahao Zeng', 'Sanketh Shetty', 'Alexander Solem', 'Yongkun Li'],
    session: 'GPU & PIM',
    highlight: true,
    summary: '快速轻量的 GPU 检查点/恢复机制，对 LLM 训练容错至关重要。通过增量检查点和异步持久化，将检查点时间从分钟级降至秒级。',
    keywords: ['GPU Checkpoint', 'Fault Tolerance', 'LLM Training'],
    archDiagram: '/images/gpu-checkpoint.png',
    contributions: ['增量检查点仅保存变化部分', '异步持久化到 NVMe SSD', '检查点时间从 340s 降至 18s'],
    pros: ['检查点时间大幅缩短（340s → 18s）', '对训练流程零侵入', '支持多 GPU 分布式训练'],
    cons: ['增量检查点恢复需要完整链', 'SSD 带宽不足时可能成为瓶颈'],
    sections: [
      {
        title: 'LLM训练容错挑战',
        content: '大模型训练通常持续数天甚至数周，GPU故障率约0.1%/天。传统检查点方案需要保存完整模型状态（权重+优化器+梯度），175B模型检查点大小约2TB，保存时间超过5分钟，训练效率损失达10-20%。',
      },
      {
        title: '增量检查点设计',
        content: '核心观察：训练过程中，大部分参数变化缓慢。增量检查点仅保存自上次检查点以来变化的参数块。结合差分压缩算法，增量数据量仅为全量检查点的5-10%。',
      },
      {
        title: '异步持久化流水线',
        content: '检查点流程分三阶段：1) 快照：GPU显存拷贝到主机DRAM（毫秒级）；2) 压缩：CPU并行压缩增量数据；3) 持久化：异步写入NVMe SSD。三阶段流水线，训练继续进行，无需等待。',
      },
      {
        title: '分层存储策略',
        content: '检查点数据分层存储：热检查点（最近3个）保存在本地SSD，恢复时间<1分钟；温检查点（最近24小时）保存在远端存储；冷检查点（历史版本）压缩后归档到对象存储。',
      },
      {
        title: '恢复机制',
        content: '恢复时从最新完整检查点开始，依次应用增量检查点。优化：并行加载多个增量；预取下一增量掩盖计算延迟。实测100B模型恢复时间从30分钟降至3分钟。',
      },
    ],
    performanceData: [
      { metric: '检查点时间', value: '18s', baseline: '原340s' },
      { metric: '训练效率损失', value: '1.3%', baseline: '原23%' },
      { metric: '100B模型恢复时间', value: '3min', baseline: '原30min' },
      { metric: '增量数据量', value: '5-10%', baseline: '全量100%' },
    ],
  },
  {
    id: 'fast2026-pim-lora',
    title: 'PIM-LoRA: Efficient LoRA Fine-tuning with Processing-in-Memory',
    authors: ['Yuhang Li', 'Pengfei Xu', 'Xiaoyan Liu', 'Yuxin Wang', 'Mingyu Gao'],
    session: 'GPU & PIM',
    summary: '存内计算加速 LoRA 微调，降低 GPU 内存压力。',
    keywords: ['PIM', 'LoRA', 'Fine-tuning'],
    contributions: ['设计 PIM 友好的 LoRA 计算流程', '减少 GPU 与内存间数据移动', '微调吞吐提升 1.6x'],
    pros: ['降低 GPU 显存压力', 'PIM 计算能效比高'],
    cons: ['依赖特定 PIM 硬件（UPMEM 等）', '通用性受限，需要硬件支持'],
  },
  // SSD & ZNS
  {
    id: 'fast2026-nvcache',
    title: 'NVCache: Non-Volatile Memory Based Cache for High-Performance Storage Systems',
    authors: ['Kai Wu', 'Yanfei Sun', 'Zili Shao'],
    session: 'SSD & ZNS',
    summary: '基于非易失性内存的高速缓存系统设计。',
    keywords: ['NVM', 'Cache', 'Persistent Memory'],
    contributions: ['利用 NVM 持久化特性设计缓存', '崩溃恢复时间 < 100ms', '缓存命中率提升 15%'],
    pros: ['崩溃恢复快速', '缓存命中率高'],
    cons: ['依赖昂贵的 NVM 硬件', 'NVM 写入寿命有限'],
  },
  {
    id: 'fast2026-fastgc',
    title: 'FastGC: Fast Garbage Collection for Zoned Namespace SSDs',
    authors: ['Dongliang Wang', 'Youyou Lu', 'Jiwu Shu'],
    session: 'SSD & ZNS',
    highlight: true,
    summary: '清华舒继武团队：ZNS SSD 快速垃圾回收机制，减少 GC 开销。通过Zone级并行GC和冷热分离策略，大幅降低垃圾回收对写入性能的影响。',
    keywords: ['ZNS', 'Garbage Collection', 'SSD', 'Tsinghua'],
    archDiagram: '/images/fastgc-zns.png',
    contributions: ['设计 Zone 级并行 GC 策略', '冷热分离减少有效数据迁移', 'GC 开销降低 60%，写放大 < 1.5'],
    pros: ['GC 开销降低显著（60%）', '写放大控制优秀（< 1.5）', '与 ZNS 特性深度结合'],
    cons: ['需要 ZNS SSD 硬件支持', '工作负载敏感，随机写性能一般'],
    sections: [
      {
        title: 'ZNS SSD特性与挑战',
        content: 'ZNS（Zoned Namespace）SSD将存储空间划分为固定大小的Zone（通常256MB），每个Zone必须顺序写入。优势：消除传统SSD的FTL开销，降低写放大。挑战：Zone内部碎片化需要GC，传统GC策略效率低下。',
      },
      {
        title: 'Zone级并行GC',
        content: '传统SSD的GC是全局的，需要锁定整个设备。FastGC利用ZNS的Zone独立性，实现并行GC：多个Zone同时进行垃圾回收，互不干扰。GC过程与前台IO并行，减少停顿。',
      },
      {
        title: '冷热分离策略',
        content: '通过访问频率识别冷热数据：热数据频繁更新，冷数据长期不变。GC时优先回收冷数据Zone（有效数据少，迁移开销小）；热数据Zone延迟GC，等待更多失效数据。有效数据迁移量降低70%。',
      },
      {
        title: '写放大优化',
        content: '写放大=（用户写入+GC写入）/用户写入。FastGC策略：1) Zone Reset时无需擦除有效数据；2) 批量迁移同Zone有效数据；3) 按生命周期分组写入。实测写放大<1.5，接近理论极限。',
      },
      {
        title: '性能实测',
        content: '在Samsung PM1733 ZNS SSD上测试：顺序写吞吐6.2GB/s（设备峰值6.4GB/s）；GC开销从传统方案的30%降至12%；随机写性能提升2.1x（混合负载）。',
      },
    ],
    performanceData: [
      { metric: 'GC开销降低', value: '60%' },
      { metric: '写放大', value: '<1.5', baseline: '传统SSD 3-5' },
      { metric: '顺序写吞吐', value: '6.2 GB/s', baseline: '设备峰值6.4GB/s' },
      { metric: '随机写提升', value: '2.1x' },
    ],
  },
  {
    id: 'fast2026-tieredkv',
    title: 'TieredKV: A Tiered Key-Value Store for Heterogeneous Storage Media',
    authors: ['Haoze Song', 'Guoli Wei', 'Yinlong Xu'],
    session: 'SSD & ZNS',
    summary: '异构存储介质分层 KV 存储设计。',
    keywords: ['KV Store', 'Tiered Storage', 'Heterogeneous Media'],
    contributions: ['设计自适应分层策略', '热数据放 Optane，冷数据放 QLC SSD', '成本降低 40%，性能持平'],
    pros: ['成本优化显著（40% 降低）', '自适应分层策略灵活'],
    cons: ['分层策略需要调优', '边界情况性能可能波动'],
  },
  // File System & Indexing
  {
    id: 'fast2026-condensed-fs',
    title: 'Towards Condensed and Efficient Read-Only File System via Sort-Enhanced Compression',
    authors: ['Hao Huang', 'Yifeng Zhang', 'Yanqi Pan', 'Wen Xia', 'Xiangyu Zou', 'Darong Yang', 'Jubin Zhong', 'Hua Liao'],
    session: 'File System & Indexing',
    summary: '排序增强压缩的高效只读文件系统。',
    keywords: ['Read-Only FS', 'Compression', 'Embedded System'],
    contributions: ['利用排序提升压缩率', '设计紧凑元数据格式', '嵌入式场景存储空间节省 35%'],
    pros: ['存储空间节省显著', '适合嵌入式等资源受限场景'],
    cons: ['仅支持只读场景', '排序预处理增加构建时间'],
  },
  {
    id: 'fast2026-rask',
    title: '"Range as a Key" is the Key! Fast and Compact Cloud Block Store Index with RASK',
    authors: ['Haoru Zhao', 'Mingkai Dong', 'Erci Xu', 'Zhongyu Wang', 'Haibo Chen'],
    session: 'File System & Indexing',
    highlight: true,
    summary: '上交 IPAPS：Range as Key 索引设计，云块存储快速紧凑索引。',
    keywords: ['Block Storage', 'Indexing', 'SJTU IPAPS'],
    contributions: ['提出 Range as Key 索引抽象', '索引空间占用降低 80%', '范围查询延迟降低 50%'],
    pros: ['索引空间占用大幅降低', '范围查询性能优秀', '创新性的索引抽象'],
    cons: ['点查询性能可能略逊于传统索引', '实现复杂度较高'],
  },
  {
    id: 'fast2026-dmtree',
    title: 'DMTree: Towards Efficient Tree Indexing on Disaggregated Memory via Compute-side Collaborative Design',
    authors: ['Guoli Wei', 'Yongkun Li', 'Haoze Song', 'Tao Li', 'Lulu Yao', 'Yinlong Xu', 'Heming Cui'],
    session: 'File System & Indexing',
    summary: '分离内存架构上的高效树索引，计算侧协同设计。',
    keywords: ['Disaggregated Memory', 'Tree Index', 'CXL'],
    contributions: ['设计计算侧协同索引结构', '减少跨节点内存访问', '索引查询延迟降低 40%'],
    pros: ['适应分离内存架构趋势', '减少网络开销'],
    cons: ['依赖 CXL 等分离内存硬件', '计算侧缓存一致性管理复杂'],
  },
  // Vector Search & ANN
  {
    id: 'fast2026-odinann',
    title: 'OdinANN: Direct Insert for Consistently Stable Performance in Billion-Scale Graph-Based Vector Search',
    authors: ['Hao Guo', 'Youyou Lu'],
    session: 'Vector Search & ANN',
    summary: '十亿级图向量搜索的直接插入策略，实现稳定性能。',
    keywords: ['Vector Search', 'ANN', 'Graph Index'],
    contributions: ['设计直接插入图构建策略', '避免批量重建带来的性能抖动', '查询延迟 P99 波动 < 5%'],
    pros: ['查询性能稳定，无抖动', '适合实时更新场景'],
    cons: ['索引构建时间较长', '查询绝对性能可能略逊于批量构建'],
  },
  // Distributed Storage
  {
    id: 'fast2026-holistic-scheduling',
    title: 'Holistic and Automated Task Scheduling for Distributed LSM-tree-based Storage',
    authors: ['Yuanming Ren', 'Siyuan Sheng', 'Zhang Cao', 'Yongkun Li', 'Patrick P. C. Lee'],
    session: 'Distributed Storage',
    summary: '分布式 LSM-tree 存储的全局自动化任务调度。',
    keywords: ['LSM-tree', 'Task Scheduling', 'Distributed Storage'],
    contributions: ['设计全局任务调度框架', '自动平衡 Compaction/Flush/Query', '长尾延迟降低 60%'],
    pros: ['长尾延迟优化显著', '自动化调度减少人工干预'],
    cons: ['调度策略调优复杂', '极端负载可能超出调度能力'],
  },
  {
    id: 'fast2026-preparation-meets-opportunity',
    title: 'Preparation Meets Opportunity: Enhancing Data Preprocessing for ML Training With Seneca',
    authors: ['Omkar Desai', 'Ziyang Jiao', 'Shuyi Pei', 'Janki Bhimani', 'Bryan S. Kim'],
    session: 'Distributed Storage',
    summary: 'Seneca：增强 ML 训练数据预处理流程。',
    keywords: ['ML Training', 'Data Preprocessing', 'Pipeline'],
    contributions: ['设计预处理流水线优化框架', '利用空闲时间预取和缓存数据', '训练数据等待时间降低 70%'],
    pros: ['训练效率提升显著', '充分利用 I/O 空闲时间'],
    cons: ['需要准确预测训练数据需求', '额外的缓存空间开销'],
  },
]

export const fast2026Sessions = [...new Set(fast2026Papers.map(p => p.session))]