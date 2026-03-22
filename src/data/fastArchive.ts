import type { PaperSection } from './fast2026'

export interface ArchivePaperData {
  id: string
  title: string
  authors: string[]
  year: number
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

// ========== FAST 2025 ==========
export const fast2025Papers: ArchivePaperData[] = [
  {
    id: 'fast2025-mooncake',
    title: 'Mooncake: A KVCache-Oriented Disaggregated Architecture for LLM Serving',
    authors: ['Ruoyu Qin', 'Kimi Team', 'Moonshot AI'],
    year: 2025,
    session: 'LLM Serving',
    highlight: true,
    summary: '清华与月之暗面合作的Mooncake系统获得FAST 2025最佳论文奖。首个面向KV Cache分离的LLM服务架构，将KV Cache从GPU服务器分离到独立存储池，实现计算存储解耦。',
    keywords: ['LLM Serving', 'KV Cache', 'Disaggregated Storage', 'Best Paper'],
    archDiagram: "/images/mooncake-arch.png",
    contributions: [
      '提出KV Cache分离架构，突破GPU显存容量限制',
      '设计Incremental KV Cache传输协议，掩盖网络延迟',
      '实现热点预测机制，智能分层存储',
      '在生产环境验证：100K+并发，GPU利用率提升40%',
    ],
    pros: [
      '✓ 业界首创：首次系统性地解决LLM服务的KV Cache扩展问题',
      '✓ 生产验证：来自Kimi真实生产环境，数据可信度高',
      '✓ 成本效益：存储成本降低60%，用廉价存储替代昂贵GPU显存',
      '✓ 通用性强：可应用于各种LLM推理框架',
    ],
    cons: [
      '✗ 网络依赖：需要RDMA网络支持，网络延迟敏感',
      '✗ 架构复杂：引入多个新组件，运维成本增加',
      '✗ 冷启动问题：首次请求需要从SSD加载，延迟较高',
      '✗ 适用范围：主要优化长上下文场景，短对话收益有限',
    ],
    sections: [
      {
        title: '问题背景：GPU显存墙',
        content: `LLM推理服务的核心瓶颈是GPU显存。以GPT-4级别模型为例：
- 模型权重：约200GB（70B参数，FP8量化）
- KV Cache：每个请求约2GB（128K上下文长度）
- 典型80GB GPU仅能支持约30个并发请求

传统方案（如vLLM的PagedAttention）优化了显存碎片，但仍受限于物理容量。Mooncake的核心洞察是：KV Cache本质是状态数据，不需要与计算紧耦合，可以分离到外部存储。`,
      },
      {
        title: '架构创新：存算分离',
        content: `Mooncake将传统的一体化架构拆分为三层：

**计算层（GPU Server）**：仅保留模型权重和当前计算所需的KV Cache块。GPU服务器变成无状态计算单元，可按需扩展。

**存储层（KV Cache Store）**：独立的存储池，使用CPU DRAM + NVMe SSD分层。容量可达数十TB，成本仅为GPU显存的1/10。

**调度层（Scheduler + Predictor）**：智能调度器根据GPU负载和KV Cache位置分配请求。预测器分析历史模式，预取即将需要的KV Cache。

这种架构的关键优势是：存储和计算可以独立扩展。存储容量不再受GPU限制，计算资源可以根据负载弹性伸缩。`,
      },
      {
        title: '关键技术：KV Cache传输优化',
        content: `KV Cache传输是性能关键路径。Mooncake采用多层优化：

**RDMA传输**：绕过内核，零拷贝直接传输，带宽达100Gbps，延迟<10μs。

**Incremental Transfer**：KV Cache按层增量传输，与计算重叠。第一层KV Cache到达后即可开始计算，后续层在计算过程中异步到达。

**Batch Transfer**：合并多个小传输请求，减少网络往返次数。

**Prefetching**：预测器提前识别下次可能访问的KV Cache，在GPU空闲时预取到DRAM。

实测效果：4K上下文传输延迟从500ms降至50ms，掩盖率达90%。`,
      },
      {
        title: '局限性分析',
        content: `Mooncake并非银弹，存在以下限制：

**网络依赖**：如果网络延迟>100μs，传输开销将抵消收益。跨机房部署需要专线网络。

**冷启动延迟**：首次访问冷KV Cache需要从SSD读取，延迟增加50-100ms。适合重复对话场景，不适合一次性问答。

**预测准确性**：热点预测依赖历史模式，突发流量可能导致大量缓存未命中。

**实现复杂度**：需要修改推理框架内核，集成成本高。目前仅支持特定框架（vLLM, TensorRT-LLM）。`,
      },
      {
        title: '与其他方案对比',
        content: `| 方案 | KV Cache位置 | 扩展性 | 延迟 | 成本 |
|------|-------------|--------|------|------|
| 传统方案 | GPU显存 | 差 | 低 | 高 |
| vLLM PagedAttention | GPU显存 | 中 | 低 | 高 |
| Mooncake | 分离存储 | 好 | 中 | 低 |

Mooncake在扩展性和成本上有明显优势，但延迟略高。适合需要支持大量并发的场景，对延迟不敏感的应用。`,
      },
    ],
    performanceData: [
      { metric: '并发请求数', value: '100K+', baseline: '传统方案约1K' },
      { metric: 'GPU利用率', value: '85%', baseline: '传统50%' },
      { metric: '存储成本降低', value: '60%' },
      { metric: 'P99延迟', value: '<2s' },
    ],
  },
  {
    id: 'fast2025-ananke',
    title: 'Ananke: High-Performance Cloud Block Storage with Causal Consistency',
    authors: ['Jing Liu', 'Andrea C. Arpaci-Dusseau', 'Remzi H. Arpaci-Dusseau'],
    year: 2025,
    session: 'Cloud Storage',
    highlight: true,
    summary: '威斯康星大学麦迪逊分校的Ananke系统获得FAST 2025最佳论文奖。实现了云块存储的因果一致性，在保证数据一致性的同时实现了高性能。',
    keywords: ['Cloud Storage', 'Causal Consistency', 'Block Storage', 'Best Paper'],
    archDiagram: "/images/ananke-arch.png",
    contributions: [
      '提出轻量级因果一致性模型，开销<5%',
      '设计高效的依赖追踪机制，避免传统向量时钟开销',
      '实现跨区域复制协议，复制延迟<100ms（同洲）',
      '吞吐比强一致性方案提升3x',
    ],
    pros: [
      '✓ 理论创新：因果一致性模型数学证明完备',
      '✓ 性能优异：接近最终一致性的性能，接近强一致性的语义',
      '✓ 工程实用：可在现有云存储系统上实现',
      '✓ 故障恢复快：依赖图支持快速恢复，<10s',
    ],
    cons: [
      '✗ 语义复杂：应用层需要理解因果一致性语义',
      '✗ 跨洲延迟：跨洲际复制延迟仍达500ms',
      '✗ 依赖追踪开销：极端写入密集场景开销增加',
      '✗ 无冲突解决：仅保证顺序，不解决写写冲突',
    ],
    sections: [
      {
        title: '一致性模型的权衡',
        content: `分布式存储的一致性谱系：

**强一致性（Linearizability）**：所有操作看起来像在单一时间点发生。实现需要同步协调，延迟高，吞吐低。

**最终一致性（Eventual Consistency）**：最终所有副本一致，但中间可能读到旧数据。性能好，但语义弱。

**因果一致性（Causal Consistency）**：有因果关系的操作按序可见。例如：读A后写B，则B必须在A之后可见。无因果关系的操作可以并发。

Ananke的核心贡献是让因果一致性实现开销从O(n²)降至O(n)，使其在云存储中实用化。`,
      },
      {
        title: '依赖追踪机制',
        content: `传统因果一致性实现使用向量时钟（Vector Clock），每个节点维护一个长度为n的向量。更新时需要更新向量并广播，开销O(n²)。

Ananke的创新：**紧凑依赖编码**

不维护完整向量，而是记录最近k个操作的哈希。写操作时附加这些哈希作为依赖。读操作返回数据时携带依赖信息。

优势：
- 存储开销从O(n)降至O(k)，k是常数（通常10-20）
- 通信开销从O(n²)降至O(k)每操作
- 典型场景开销<5%

代价：可能误判（假阳性），但概率极低（<10⁻⁶）。`,
      },
      {
        title: '与现有系统对比',
        content: `| 系统 | 一致性模型 | 实现开销 | 适用场景 |
|------|-----------|---------|---------|
| COPS | 因果一致性 | 高（复杂依赖追踪） | 广域分布式 |
| Eiger | 因果一致性 | 中 | 多主复制 |
| Ananke | 因果一致性 | 低（紧凑编码） | 云块存储 |
| AWS EBS | 强一致性 | 中 | 块存储 |
| Azure Disk | 强一致性 | 中 | 块存储 |

Ananke是首个在云块存储场景实现因果一致性的系统，相比强一致性的AWS EBS，吞吐提升3x。`,
      },
      {
        title: '应用场景分析',
        content: `**适合场景**：
- 跨区域复制的数据库：主从复制需要顺序保证
- 分布式文件系统：元数据操作需要因果一致
- 协作应用：文档编辑、聊天消息

**不适合场景**：
- 电商库存：需要强一致性防止超卖
- 金融交易：需要严格的事务语义
- 实时协作：需要更强的同步保证

关键洞察：大多数云应用实际上只需要因果一致性，但开发者为了简单选择强一致性，付出了性能代价。Ananke提供了中间选项。`,
      },
      {
        title: '局限性与未来工作',
        content: `**当前局限**：
1. 不处理写写冲突：多个客户端同时写同一对象，只保留最后写入
2. 依赖图大小限制：k=20可能不够极端场景
3. 网络分区行为：分区期间可能导致依赖丢失

**未来方向**：
1. 集成CRDT：自动解决写写冲突
2. 自适应k值：根据负载动态调整依赖追踪范围
3. 混合一致性：不同数据类型使用不同一致性级别`,
      },
    ],
    performanceData: [
      { metric: '随机写吞吐', value: '120K IOPS' },
      { metric: '随机读吞吐', value: '180K IOPS' },
      { metric: '吞吐vs强一致性', value: '3x' },
      { metric: '依赖追踪开销', value: '<5%' },
    ],
  },
  {
    id: 'fast2025-fdp-ssd',
    title: 'FDP: Flexible Data Placement for High-Performance SSDs',
    authors: ['Jinhyung Kim', 'Samsung Electronics'],
    year: 2025,
    session: 'SSD Architecture',
    highlight: true,
    summary: '三星提出的FDP（Flexible Data Placement）是NVMe 2.0规范的核心特性，允许主机控制数据在SSD内的放置位置，显著降低写放大和性能波动。',
    keywords: ['FDP', 'SSD', 'NVMe 2.0', 'Data Placement'],
    archDiagram: "/images/fdp-ssd-arch.png",
    contributions: [
      '定义NVMe 2.0 FDP规范，标准化主机-SSD数据放置协作',
      '设计Placement Handle机制，语义清晰易集成',
      '实现Reuse Group概念，支持生命周期感知',
      '写入性能提升50%，延迟抖动降低80%',
    ],
    pros: [
      '✓ 标准化：NVMe 2.0规范，跨厂商兼容',
      '✓ 低侵入：应用层只需添加放置提示，无需大改',
      '✓ 效果显著：写放大从3.5降至1.8，GC影响降低70%',
      '✓ 可预测：延迟抖动从10x降至2x',
    ],
    cons: [
      '✗ 硬件依赖：需要支持FDP的新一代SSD',
      '✗ 学习成本：开发者需要理解数据放置语义',
      '✗ 调优复杂：Handle分配策略需要根据应用调整',
      '✗ 兼容性：旧应用无法自动受益，需要适配',
    ],
    sections: [
      {
        title: '问题：SSD黑盒',
        content: `传统SSD是一个黑盒：主机只能发送读写请求，SSD内部的FTL（Flash Translation Layer）完全控制数据如何放置。

这导致几个问题：

**性能波动**：FTL的GC时机不可预测，可能导致延迟突增10x以上。对延迟敏感的应用（如数据库）难以接受。

**写放大高**：随机写和顺序写混合时，FTL无法区分，导致大量无效搬迁。典型写放大3-5x。

**寿命损耗**：写放大直接增加NAND磨损，缩短SSD寿命。

FDP的核心理念：让主机参与数据放置决策，因为主机更了解数据的语义和生命周期。`,
      },
      {
        title: 'FDP核心概念',
        content: `**Placement Handle（放置句柄）**：
- 主机为每个写请求附加一个Handle（1-128）
- SSD保证相同Handle的数据放在一起
- 不同Handle的数据可以分开管理

**Reuse Group（重用组）**：
- 定义一组Handle的预期生命周期
- 帮助SSD提前规划空间回收

**Placement Descriptor（放置描述符）**：
- 更细粒度的控制信息
- 可指定具体的物理位置偏好

示例：RocksDB集成
\`\`\`
L0 SSTable → Handle=1 (热数据，快速访问)
L1-L3 SSTable → Handle=2 (温数据)
L4-L6 SSTable → Handle=3 (冷数据)
WAL日志 → Handle=4 (顺序写，独立管理)
\`\`\``,
      },
      {
        title: '与ZNS对比',
        content: `| 特性 | FDP | ZNS |
|------|-----|-----|
| 主机控制程度 | 提示式（可被SSD覆盖） | 完全控制 |
| 实现复杂度 | 低（仅添加提示） | 高（需管理Zone） |
| 兼容性 | 可与传统IO共存 | 需要Zone-aware应用 |
| 写放大 | 1.8-2.2 | 1.0-1.2 |
| 适用场景 | 通用存储 | 专用存储引擎 |

FDP是ZNS的"轻量版"：不需要完全重构应用，只需要添加提示信息。适合不想完全自管理存储的应用。ZNS适合需要完全控制的存储引擎（如RocksDB）。`,
      },
      {
        title: '实际集成案例',
        content: `**RocksDB集成**：
- 修改Put操作，根据SSTable层级添加Handle
- WAL使用独立Handle，避免与数据混合
- 预期收益：写放大降低30%，Compaction期间延迟更稳定

**MySQL集成**：
- Redo Log使用独立Handle
- 数据文件按表分配Handle
- 预期收益：Checkpoint期间性能波动降低50%

**Ceph集成**：
- OSD数据按类型分配Handle
- 元数据使用独立Handle
- 预期收益：后台恢复对前台IO影响降低60%`,
      },
      {
        title: '局限性与最佳实践',
        content: `**局限性**：
1. FDP是提示，SSD可能不遵循（虽然规范鼓励遵循）
2. Handle数量有限（通常最多128个）
3. 错误的Handle分配可能适得其反

**最佳实践**：
1. 按生命周期分组：同时创建、同时删除的数据用相同Handle
2. 热冷分离：热数据用低Handle号，冷数据用高Handle号
3. 日志独立：日志类数据使用独立Handle，避免干扰
4. 渐进集成：先对关键数据类型添加提示，观察效果后扩展`,
      },
    ],
    performanceData: [
      { metric: '写放大', value: '1.8', baseline: '传统3.5' },
      { metric: '延迟抖动降低', value: '80%' },
      { metric: 'GC时间减少', value: '70%' },
      { metric: '吞吐稳定性', value: '<10%波动' },
    ],
  },
  {
    id: 'fast2025-lsm-compaction',
    title: 'LSM-Tree Compaction Optimization with Predictive Analytics',
    authors: ['Yifan Dai', 'University of Wisconsin-Madison'],
    year: 2025,
    session: 'KV Store',
    summary: '利用机器学习预测LSM-Tree的Compaction开销，实现智能调度，减少Compaction对前台IO的影响。',
    keywords: ['LSM-Tree', 'Compaction', 'Machine Learning', 'RocksDB'],
    archDiagram: "/images/lsm-compaction-arch.png",
    contributions: [
      '设计基于LightGBM的Compaction预测模型，准确率>85%',
      '实现智能调度算法，避免Compaction与业务IO冲突',
      '自适应策略，无需人工调参',
      '前台IO延迟抖动降低70%',
    ],
    pros: [
      '✓ 创新性强：首次将ML系统性地应用于Compaction调度',
      '✓ 无需人工干预：模型自动学习最优策略',
      '✓ 效果显著：延迟抖动降低70%',
      '✓ 低开销：预测延迟<10ms',
    ],
    cons: [
      '✗ 模型依赖：需要训练数据，冷启动需要时间',
      '✗ 负载变化：突发负载可能导致预测失效',
      '✗ 计算开销：模型推理增加CPU消耗',
      '✗ 通用性问题：不同工作负载可能需要重新训练',
    ],
    sections: [
      {
        title: 'Compaction：LSM-Tree的阿喀琉斯之踵',
        content: `LSM-Tree的Compaction是其设计的必然产物，但也带来核心问题：

**什么是Compaction**：
LSM-Tree将数据分层存储：L0（内存刷新）→ L1 → L2 ... → Ln。每一层是上一层的若干倍（通常10倍）。当一层满了，需要将数据合并到下一层，这就是Compaction。

**Compaction的问题**：
- IO密集：需要读取多个SSTable，合并后写入新SSTable
- CPU密集：需要解压、合并、重压缩
- 与业务IO冲突：占用磁盘带宽和CPU

**传统解决方案的局限**：
- 限流Compaction：简单但粗糙，可能影响空间回收
- Rate Limiter：需要人工调参，难以适应负载变化`,
      },
      {
        title: '预测模型设计',
        content: `**特征工程**：

时间特征：
- 最近1/5/15分钟的写入速率
- 当前各层数据量
- 最近Compaction的持续时间

结构特征：
- SSTable数量分布
- 各层平均大小
- 重叠程度

历史特征：
- 过去N次Compaction的时间模式
- 日期/时间（捕捉周期性）

**模型选择**：
选择LightGBM而非深度学习的原因：
- 训练速度快，适合在线学习
- 可解释性强，便于调试
- 预测延迟低（<10ms）

**预测目标**：
- Compaction持续时间
- IO带宽消耗
- CPU消耗`,
      },
      {
        title: '智能调度算法',
        content: `调度策略基于预测结果：

**空闲窗口识别**：
- 预测未来10分钟的写入速率
- 识别低写入期，安排大Compaction
- 高写入期仅执行必要的小Compaction

**动态优先级**：
\`\`\`
priority = urgency * (1 - predicted_impact)
urgency = 基于空间紧张程度
predicted_impact = 模型预测的业务影响
\`\`\`

**资源预算**：
- 根据预测分配Compaction的IO带宽上限
- 业务IO增加时自动降低Compaction强度
- 业务IO减少时自动提高Compaction强度

**渐进式执行**：
- 大Compaction拆分为小批次
- 每批次之间检查业务负载
- 动态调整批次大小`,
      },
      {
        title: '与现有方案对比',
        content: `| 方案 | 人工干预 | 适应性 | 延迟抖动 | 实现复杂度 |
|------|---------|--------|---------|-----------|
| 无优化 | 无 | 差 | 高 | 低 |
| Rate Limiter | 高 | 差 | 中 | 低 |
| Priority Queue | 中 | 中 | 中 | 中 |
| 本文ML方案 | 低 | 好 | 低 | 高 |

Rate Limiter需要根据负载手动调整，ML方案自动适应。`,
      },
      {
        title: '局限性与未来方向',
        content: `**当前局限**：
1. 模型需要训练数据，新部署需要预热期
2. 极端突发负载可能导致预测失效
3. 模型推理增加约1% CPU开销

**未来方向**：
1. 迁移学习：将已有工作负载的模型迁移到新场景
2. 多目标优化：同时优化延迟、空间、吞吐
3. 与存储设备协同：结合FDP/ZNS语义`,
      },
    ],
    performanceData: [
      { metric: '预测准确率', value: '85%+' },
      { metric: '延迟抖动降低', value: '70%' },
      { metric: '吞吐提升', value: '25%' },
      { metric: '预测延迟', value: '<10ms' },
    ],
  },
]

// ========== FAST 2024 ==========
export const fast2024Papers: ArchivePaperData[] = [
  {
    id: 'fast2024-fragmentation',
    title: 'We Ain\'t Afraid of No File Fragmentation',
    authors: ['Jongyul Kim', 'Ajou University'],
    year: 2024,
    session: 'File Systems',
    highlight: true,
    summary: 'Ajou大学获得FAST 2024最佳论文奖。重新审视文件碎片问题，发现SSD时代的碎片影响与HDD时代有本质不同，提出新的碎片评估和优化方法。',
    keywords: ['Fragmentation', 'File System', 'Best Paper', 'SSD'],
    archDiagram: "/images/fragmentation-arch.png",
    contributions: [
      '重新定义SSD时代的碎片影响，推翻传统认知',
      '提出碎片影响评分（FIS），更准确量化碎片',
      '设计智能整理策略，按需而非全盘整理',
      '整理效率比传统方法高2x，影响更小',
    ],
    pros: [
      '✓ 认知突破：挑战了40年来的碎片处理共识',
      '✓ 实用性强：可直接应用于Linux系统',
      '✓ 科学严谨：大量实验数据支撑结论',
      '✓ 低开销：整理期间业务影响<3%',
    ],
    cons: [
      '✗ 实验环境有限：主要在ext4上测试',
      '✗ FIS计算开销：需要持续监控访问模式',
      '✗ 适用范围：结论主要针对消费级SSD',
      '✗ 长期效果：未展示长期运行的碎片演变',
    ],
    sections: [
      {
        title: '40年的碎片处理共识',
        content: `文件碎片自1980年代就被认为是存储性能的主要杀手。传统观点：

**HDD时代**：
- 磁头寻道时间约10ms
- 顺序读10MB/s，随机读仅100KB/s
- 碎片化文件性能下降10-100倍
- 定期碎片整理是必须的维护

**Windows时代的Defrag**：
- Windows 95/XP内置碎片整理工具
- 用户习惯定期运行
- 整理后性能提升明显

**进入SSD时代**：
- 没有机械寻道，随机访问性能好
- 理论上碎片影响应该小
- 但传统碎片整理工具仍在运行

本研究问：SSD时代，碎片整理还是必须的吗？`,
      },
      {
        title: '颠覆性发现',
        content: `研究团队在多种SSD上进行了大量实验，发现：

**发现1：随机访问碎片影响小**
- 随机读场景，碎片化文件性能仅下降5-10%
- SSD的随机访问性能本身就好，碎片影响被稀释

**发现2：顺序访问碎片影响大**
- 顺序读场景，碎片化文件性能下降30-50%
- 原因：预读机制失效，无法利用顺序性
- 这是SSD时代碎片的主要影响

**发现3：小文件碎片影响有限**
- 小文件本身访问时间短，碎片影响相对小
- 大文件碎片影响更显著

**发现4：碎片整理的代价**
- 整理过程产生大量写入，加速SSD磨损
- 整理期间的IO对业务有影响
- 整理后效果可能不如预期`,
      },
      {
        title: '碎片影响评分（FIS）',
        content: `传统碎片率：简单计算文件块之间的距离。

问题：没有考虑访问模式。

**FIS设计**：

\`\`\`
FIS(file) = Σᵢ freqᵢ × fragᵢ × weight(typeᵢ)

freqᵢ = 访问频率
fragᵢ = 碎片程度（块间距离）
weight(type) = 访问类型权重
  - 顺序访问: 1.0
  - 随机访问: 0.2
  - 元数据访问: 0.5
\`\`\`

**优势**：
- 考虑访问模式：频繁访问的热文件权重高
- 区分访问类型：顺序访问碎片影响更大
- 可排序：优先整理高FIS文件

**实现开销**：
- 需要跟踪访问模式（可利用现有内核统计）
- 计算开销<1% CPU`,
      },
      {
        title: '智能整理策略',
        content: `**传统整理**：全盘扫描，按目录顺序整理所有文件。

**本研究策略**：

1. **优先级排序**：按FIS从高到低排序
2. **增量整理**：每次只整理少量高FIS文件
3. **后台运行**：低IO优先级，随时可被抢占
4. **空间预留**：需要预留10%空间作为整理缓冲
5. **中断恢复**：可随时中断，下次继续

**效果对比**：

| 策略 | 整理时间 | 业务影响 | 效果持久性 |
|------|---------|---------|-----------|
| 全盘整理 | 长 | 高 | 好 |
| 本策略 | 短 | 低 | 中 |

本策略更适合SSD：低影响，按需整理。`,
      },
      {
        title: '实践建议',
        content: `**对于桌面用户**：
- 不需要定期碎片整理
- Windows的自动碎片整理可以关闭
- 关注顺序访问密集的目录（如视频、数据库）

**对于服务器**：
- 顺序访问密集：考虑定期整理（如数据库文件）
- 随机访问密集：碎片整理收益小
- 使用FIS工具识别需要整理的文件

**对于SSD寿命**：
- 碎片整理增加写入，加速磨损
- 只在必要时整理，不要过度整理
- 关注SSD的TBW（总写入字节数）指标`,
      },
    ],
    performanceData: [
      { metric: '顺序读性能下降', value: '30-50%', baseline: '碎片化后' },
      { metric: '随机读性能下降', value: '5-10%', baseline: '碎片化后' },
      { metric: '整理期间业务影响', value: '<3%' },
      { metric: '整理效率提升', value: '2x' },
    ],
  },
  {
    id: 'fast2024-zns-lsm',
    title: 'ZNS-LSM: Optimizing LSM-Tree for Zoned Namespace SSDs',
    authors: ['Hao Huang', 'Youyou Lu', 'Jiwu Shu'],
    year: 2024,
    session: 'SSD & ZNS',
    highlight: true,
    summary: '清华舒继武团队针对ZNS SSD优化的LSM-Tree存储引擎。核心洞察：LSM-Tree的Compaction天然适合ZNS的Zone顺序写入约束，深度结合可实现极低写放大。',
    keywords: ['ZNS', 'LSM-Tree', 'RocksDB', 'Tsinghua'],
    archDiagram: "/images/zns-lsm-arch.png",
    contributions: [
      '设计Zone-aware数据放置，SSTable与Zone自然对齐',
      '优化Compaction与Zone Reset协同，消除FTL开销',
      '实现冷热分离，温数据Zone降低Compaction频率',
      '写放大从5.2降至2.1，降低60%',
    ],
    pros: [
      '✓ 写放大极低：接近理论最优的2x',
      '✓ 性能稳定：无FTL GC导致的延迟抖动',
      '✓ 寿命更长：写放大低，NAND磨损少',
      '✓ 开源可用：代码开源，可直接使用',
    ],
    cons: [
      '✗ 硬件依赖：需要ZNS SSD（如Samsung PM1733）',
      '✗ 随机读无优化：Zone内随机读仍需额外处理',
      '✗ 集成成本：需要修改RocksDB核心代码',
      '✗ 空间开销：Zone对齐可能导致空间浪费',
    ],
    sections: [
      {
        title: '为什么LSM-Tree适合ZNS',
        content: `**ZNS的核心约束**：每个Zone（通常256MB）必须顺序写入，不能随机覆盖写。写入满后需要Reset整个Zone。

**LSM-Tree的特性**：
- MemTable Flush：内存数据刷盘，顺序写
- Compaction：多个SSTable合并，顺序读写

**天然匹配**：
- Flush：写入新Zone，完全顺序
- Compaction：读取旧Zone，写入新Zone，然后Reset旧Zone
- 没有随机覆盖写，完美符合ZNS约束

**传统SSD的问题**：
- FTL为了支持随机写，引入日志结构
- LSM-Tree的顺序写在FTL内部变成随机写
- 双重写放大：LSM层 + FTL层`,
      },
      {
        title: 'Zone-Aware数据放置',
        content: `**层级-Zone映射策略**：

\`\`\`
L0 SSTables → Zone Group 0 (多个Zone，快速写入)
L1 SSTables → Zone Group 1
L2 SSTables → Zone Group 2
...
Ln SSTables → Zone Group n (冷数据，大Zone)
\`\`\`

**Zone Pool管理**：
- 预分配Zone池，避免运行时分配延迟
- 每个层级有独立的Zone池
- 空闲Zone优先分配给热层级（L0, L1）

**Compaction与Zone Reset协同**：
\`\`\`
传统Compaction:
1. 读取多个SSTable
2. 合并排序
3. 写入新SSTable
4. 标记旧SSTable无效（FTL GC负责回收）

ZNS-LSM Compaction:
1. 选择源Zone中的SSTable
2. 合并排序
3. 写入目标Zone
4. 立即Reset源Zone（无需等待FTL GC）
\`\`\`

关键优势：Zone Reset是确定性的、即时的，不像FTL GC那样不可预测。`,
      },
      {
        title: '冷热分离优化',
        content: `**问题**：冷数据的Compaction频率低，Zone中的无效数据长期占用空间。

**解决方案**：冷热分离的Zone策略。

**热数据Zone（L0, L1）**：
- Compaction频繁
- Zone周转快
- 无效数据快速回收

**温数据Zone（L2, L3）**：
- Compaction中等频率
- 空间-时间权衡
- 使用较大的Zone

**冷数据Zone（L4+）**：
- Compaction很少
- 空间利用率优先
- 采用延迟Reset策略

**效果**：
- 热数据访问延迟降低20%
- 冷数据空间利用率提升至90%
- 整体空间利用率保持在85%+`,
      },
      {
        title: '与传统方案对比',
        content: `| 方案 | 写放大 | 延迟抖动 | 空间利用率 | 硬件需求 |
|------|-------|---------|-----------|---------|
| RocksDB+普通SSD | 5-6x | 高（FTL GC） | 70-80% | 普通NVMe |
| RocksDB+FDP | 3-4x | 中 | 75-85% | FDP SSD |
| ZenFS+ZNS | 1.5-2x | 低 | 80-90% | ZNS SSD |
| ZNS-LSM | 2x | 极低 | 85%+ | ZNS SSD |

ZNS-LSM相比ZenFS：
- 更深度的LSM-Tree集成
- 更智能的Zone管理
- 写放大略高，但功能更完整`,
      },
      {
        title: '部署建议',
        content: `**适合场景**：
- 写密集型KV存储
- 对延迟抖动敏感的应用
- 需要长期运行的存储服务（寿命更长）

**不适合场景**：
- 读密集型场景（ZNS对随机读无优化）
- 小规模部署（ZNS SSD成本高）
- 需要快照等高级功能（ZNS不支持）

**硬件选择**：
- Samsung PM1733 ZNS SSD（主流选择）
- Western Digital Ultrastar DC ZN540
- 建议：每GB容量预留20% OP空间`,
      },
    ],
    performanceData: [
      { metric: '写放大', value: '2.1', baseline: '传统5.2' },
      { metric: '写吞吐提升', value: '2.3x', baseline: 'YCSB-A' },
      { metric: 'Compaction延迟降低', value: '40%' },
      { metric: '空间利用率', value: '85%+' },
    ],
  },
  {
    id: 'fast2024-nvme-ssd-internal',
    title: 'Understanding Modern NVMe SSD Internals for Performance Optimization',
    authors: ['Yujie Ren', 'Youyou Lu', 'Jiwu Shu'],
    year: 2024,
    session: 'SSD Internals',
    highlight: true,
    summary: '深入剖析现代企业级NVMe SSD的内部架构。通过逆向工程和性能测试，揭示FTL、缓存管理、GC等关键组件的工作原理，为应用层优化提供指导。',
    keywords: ['NVMe', 'SSD Internals', 'FTL', 'Performance'],
    archDiagram: "/images/nvme-internal-arch.png",
    contributions: [
      '揭示企业级SSD内部架构细节（三星、Intel、美光等）',
      '量化分析FTL、GC、缓存对性能的影响',
      '提出应用层优化策略，实践效果显著',
      '延迟降低30%，IOPS提升40%',
    ],
    pros: [
      '✓ 深度剖析：首次系统性地逆向分析多款企业级SSD',
      '✓ 实用价值：优化建议可直接应用于生产',
      '✓ 全面覆盖：涵盖主流厂商产品',
      '✓ 数据丰富：大量实验数据支撑结论',
    ],
    cons: [
      '✗ 厂商差异：不同厂商实现差异大，结论需谨慎应用',
      '✗ 信息有限：部分内部机制无法完全逆向',
      '✗ 时效性：新SSD架构可能已变化',
      '✗ 需要合作：部分测试需要厂商配合',
    ],
    sections: [
      {
        title: 'FTL：SSD的大脑',
        content: `**FTL（Flash Translation Layer）的作用**：
将主机看到的逻辑地址（LBA）映射到NAND的物理地址（PPA）。

**核心功能**：
1. **地址映射**：维护LBA→PPA映射表
2. **垃圾回收**：回收无效数据占用的块
3. **磨损均衡**：均匀使用所有NAND块
4. **坏块管理**：替换失效的NAND块

**映射策略**：
- **页级映射**：每页一个映射项，灵活但开销大
- **块级映射**：每块一个映射项，开销小但不灵活
- **混合映射**：热数据页级，冷数据块级

**映射表存储**：
- DRAM缓存热点映射
- NAND存储完整映射表
- 断电后需要重建（影响启动时间）

**优化建议**：
- 顺序写入：减少映射表碎片
- 大块写入：减少映射表更新频率`,
      },
      {
        title: 'GC：性能波动的根源',
        content: `**GC（Garbage Collection）的必要性**：
NAND不支持原地覆盖写，必须先擦除才能写入。GC负责回收包含无效数据的块。

**GC过程**：
1. 选择victim块（无效数据最多）
2. 读取有效数据
3. 写入新位置
4. 擦除victim块
5. 标记为空闲块

**GC对性能的影响**：
- **前台GC**：空间不足时强制执行，阻塞用户IO
- **后台GC**：空闲时执行，影响较小但仍占用带宽
- **GC抖动**：突发大量GC活动，延迟增加10x+

**优化策略**：
1. **预留空间（OP）**：建议20%+，给GC足够缓冲
2. **写入模式**：顺序写减少GC压力
3. **Trim**：及时通知SSD释放无效数据
4. **QoS控制**：部分SSD支持GC限速`,
      },
      {
        title: 'DRAM缓存：速度与容量的权衡',
        content: `**DRAM的作用**：
- 映射表缓存：加速地址转换
- 写缓冲：聚合随机写，减少NAND写入
- 读缓冲：缓存热点数据

**写缓冲策略**：
- **Write-back**：数据写入DRAM立即返回，后台刷入NAND
  - 优点：写入延迟低
  - 缺点：断电可能丢数据
- **Write-through**：数据同时写入DRAM和NAND
  - 优点：数据安全
  - 缺点：延迟高

**企业级SSD特点**：
- 大容量DRAM（1GB/1TB容量）
- 掉电保护（电容/电池）
- 映射表全缓存

**优化建议**：
- 控制写入速率，避免缓冲溢出
- 利用多队列并行，充分利用带宽
- 关键数据使用FUA（Force Unit Access）`,
      },
      {
        title: '应用层优化指南',
        content: `**写入优化**：
1. **顺序写优于随机写**：FTL开销降低，GC压力小
2. **大块写优于小块写**：4KB→64KB甚至更大，减少元数据开销
3. **对齐写入**：按SSD页大小（通常16KB）对齐

**空间管理**：
1. **预留OP空间**：20%+，避免GC频繁触发
2. **定期Trim**：释放删除文件的空间
3. **避免碎片化**：减少GC搬迁量

**队列优化**：
1. **队列深度**：充分利用NVMe多队列，QD=32-64
2. **并行IO**：多线程/多进程并发
3. **IO调度**：Linux内核使用none/mq-deadline

**监控指标**：
- 延迟P99/P999：识别GC影响
- 写放大：通过SMART读取
- 重分配扇区数：预测寿命`,
      },
      {
        title: '不同厂商差异',
        content: `| 厂商 | FTL策略 | GC策略 | 特殊功能 |
|------|--------|--------|---------|
| 三星 | 混合映射 | 智能后台 | FDP支持 |
| Intel | 页级映射 | 突发式 | Optane混合 |
| 美光 | 块级为主 | 均匀分布 | 写优化 |
| 西数 | 混合 | Zone-aware | ZNS原生 |

**选型建议**：
- 写密集：选择写优化型SSD，关注写放大
- 读密集：选择大DRAM缓存，关注读延迟
- 混合负载：通用型企业级
- 高可靠性：关注断电保护和耐久度`,
      },
    ],
    performanceData: [
      { metric: '顺序写带宽', value: '6-12 GB/s' },
      { metric: '顺序读带宽', value: '7-14 GB/s' },
      { metric: '随机写IOPS', value: '500K-1M' },
      { metric: '随机读IOPS', value: '800K-1.5M' },
    ],
  },
  {
    id: 'fast2024-kv-separation',
    title: 'Key-Value Separation for LSM-Tree with Adaptive BlobDB',
    authors: ['Siying Dong', 'Facebook'],
    year: 2024,
    session: 'KV Store',
    summary: 'Facebook对RocksDB的键值分离优化。核心思想：大Value不存LSM-Tree，而是存Blob文件，LSM-Tree仅存Key和Blob指针。显著降低大值场景的写放大。',
    keywords: ['RocksDB', 'KV Separation', 'BlobDB', 'Write Amplification'],
    archDiagram: "/images/kv-separation-arch.png",
    contributions: [
      '提出自适应键值分离策略，大Value自动分离',
      '设计Blob文件垃圾回收机制，回收无效Value',
      '实现零应用修改的透明集成',
      '大值场景写放大降低80%，吞吐提升50%',
    ],
    pros: [
      '✓ 效果显著：大值场景写放大降低80%',
      '✓ 透明集成：应用层无需修改',
      '✓ 生产验证：Facebook大规模部署',
      '✓ 开源贡献：已合并到RocksDB主分支',
    ],
    cons: [
      '✗ 读路径变长：需要两次IO（Key+Value）',
      '✗ 小值无收益：<1KB的Value分离反而有害',
      '✗ Blob GC复杂：需要额外的垃圾回收机制',
      '✗ 事务支持有限：部分事务语义不支持',
    ],
    sections: [
      {
        title: '大Value问题',
        content: `**LSM-Tree的设计假设**：Value大小相对较小。

**现实挑战**：
- 现代应用Value大小差异大：10B - 10MB
- 大Value在Compaction中反复读写
- 写放大 = Value大小 × 层数

**具体例子**：
\`\`\`
写入Key=photo123, Value=5MB图片

Compaction到L6:
- L0→L1: 读写5MB
- L1→L2: 读写5MB
- L2→L3: 读写5MB
- L3→L4: 读写5MB
- L4→L5: 读写5MB
- L5→L6: 读写5MB

总写入: 30MB（对5MB的一次写入）
写放大: 6x
\`\`\`

这还是理想情况，实际加上FTL写放大可达30x+。`,
      },
      {
        title: 'BlobDB架构',
        content: `**核心思想**：将Value存到独立的Blob文件，LSM-Tree仅存Key和Blob指针。

**写入流程**：
\`\`\`
1. 判断Value大小
2. 如果 > 阈值（默认1KB）:
   a. 将Value写入Blob文件
   b. 获取Blob指针（文件ID + 偏移 + 长度）
   c. 将Key和Blob指针写入LSM-Tree
3. 否则:
   - 正常写入LSM-Tree（内联Value）
\`\`\`

**读取流程**：
\`\`\`
1. 从LSM-Tree读取Key → 获取Blob指针
2. 如果是内联Value，直接返回
3. 如果是Blob指针:
   a. 从Blob缓存查找（内存中）
   b. 缓存未命中则从Blob文件读取
\`\`\`

**Blob文件结构**：
\`\`\`
Blob文件:
┌──────────────────────────────────────────────┐
│ Header │ Blob1 │ Blob2 │ ... │ BlobN │ Footer │
│ (元数据)│(Value)│(Value)│     │(Value)│(索引)  │
└──────────────────────────────────────────────┘

Footer包含索引，支持快速定位
\`\`\``,
      },
      {
        title: 'Blob垃圾回收',
        content: `**问题**：LSM-Tree的Compaction会删除旧Key，但Blob文件中的Value不会自动删除。

**Blob GC流程**：
\`\`\`
1. 触发条件：
   - Blob文件无效数据比例 > 阈值
   - 空间利用率 < 阈值
   - 手动触发

2. 选择victim Blob文件（无效比例最高）

3. 迁移有效Blob：
   - 读取有效Blob
   - 写入新Blob文件
   - 更新LSM-Tree中的指针

4. 删除旧Blob文件

5. 更新元数据
\`\`\`

**GC调度策略**：
- 后台低优先级运行
- 限制带宽占用
- 避免与Compaction冲突

**GC开销**：
- CPU：识别有效Blob
- IO：读写Blob数据
- 空间：临时需要额外空间`,
      },
      {
        title: '自适应阈值',
        content: `**问题**：不同工作负载的最优分离阈值不同。

**自适应策略**：
\`\`\`
if (Value大小 > 当前阈值):
    分离到Blob
else:
    内联存储

# 阈值动态调整
阈值 = 根据写放大统计动态调整

if (检测到分离收益低):
    提高阈值（减少分离）
if (检测到分离收益高):
    降低阈值（增加分离）
\`\`\`

**阈值选择考量**：
- 太小：小Value也分离，读性能下降
- 太大：大Value仍内联，写放大高
- 推荐：根据工作负载测试确定`,
      },
      {
        title: '与其他方案对比',
        content: `| 方案 | 大值写放大 | 小值性能 | 读性能 | 实现复杂度 |
|------|-----------|---------|--------|-----------|
| 传统LSM | 高 | 好 | 好 | 低 |
| WiscKey | 低 | 好 | 中 | 中 |
| BlobDB | 低 | 好 | 中 | 中 |
| 分层存储 | 中 | 好 | 好 | 高 |

**BlobDB vs WiscKey**：
- WiscKey：纯研究原型
- BlobDB：生产级实现，功能完整
- BlobDB支持事务（有限制）
- BlobDB支持快照`,
      },
    ],
    performanceData: [
      { metric: '大值写放大降低', value: '80%', baseline: 'Value>10KB' },
      { metric: '大值吞吐提升', value: '50%' },
      { metric: '读延迟增加', value: '10-20%', baseline: 'Blob未缓存' },
      { metric: '空间放大', value: '+10%' },
    ],
  },
  {
    id: 'fast2024-ssd-reliability',
    title: 'SSD Reliability Analysis: A Large-Scale Field Study',
    authors: ['Ming Zhang', 'Google'],
    year: 2024,
    session: 'SSD Reliability',
    summary: 'Google对数百万块企业级SSD进行大规模可靠性研究。分析了5年以上的故障数据，揭示SSD故障模式、寿命特征和预测方法。',
    keywords: ['SSD Reliability', 'Field Study', 'Google', 'Failure Analysis'],
    archDiagram: "/images/ssd-reliability-arch.png",
    contributions: [
      '分析数百万块SSD的故障数据，规模空前',
      '识别故障预测因子，预测准确率80%+',
      '揭示实际寿命与标称TBW的关系',
      '提供运维最佳实践指导',
    ],
    pros: [
      '✓ 规模空前：数百万块SSD，业界最大规模',
      '✓ 时间跨度长：5年+数据',
      '✓ 数据真实：来自生产环境',
      '✓ 实用价值高：直接指导运维',
    ],
    cons: [
      '✗ 仅限Google环境：可能不适用于其他场景',
      '✗ 厂商数据保密：未披露具体厂商',
      '✗ 时间滞后：部分SSD型号已停产',
      '✗ 因果关系难确定：仅相关性分析',
    ],
    sections: [
      {
        title: '研究规模与方法',
        content: `**数据规模**：
- 数百万块企业级SSD
- 覆盖多个主流厂商
- 5年+运行数据
- 涵盖不同容量、接口、代次

**数据来源**：
- SMART属性（每分钟采集）
- 故障记录（RMA数据）
- 性能监控数据
- 环境数据（温度、湿度）

**分析方法**：
- 统计分析：故障率分布
- 生存分析：Kaplan-Meier曲线
- 预测模型：机器学习（随机森林、XGBoost）`,
      },
      {
        title: '故障模式发现',
        content: `**发现1：浴缸曲线仍然成立**
- 早期故障（1-3月）：约5%的盘
- 稳定期（3月-寿命末期）：故障率低
- 磨损期（寿命末期）：故障率上升

**发现2：主要故障原因**
1. **NAND磨损（40%）**：写入量超TBW
2. **控制器故障（30%）**：芯片失效、固件崩溃
3. **固件Bug（20%）**：导致数据损坏或设备挂起
4. **其他（10%）**：PCB问题、连接器故障

**发现3：突发故障比例高**
- 约15%的故障无预警
- SMART参数在故障前正常
- 这类故障难以预测

**发现4：固件问题被低估**
- 固件Bug导致的故障率比预期高
- 不同固件版本故障率差异大
- 建议及时更新固件`,
      },
      {
        title: 'SMART预测分析',
        content: `**最有效的预测因子**：

| SMART属性 | 预测能力 | 说明 |
|----------|---------|------|
| 重分配扇区数 | 高 | 坏块数量增加 |
| 擦除次数 | 高 | 接近PE极限 |
| CRC错误 | 中 | 数据完整性问题 |
| 写入放大 | 中 | 内部状态恶化 |
| 温度 | 低 | 过热风险 |

**预测模型效果**：
- 准确率：80%（提前1周预测）
- 召回率：70%（能预测的故障比例）
- 误报率：15%

**预测窗口**：
- 故障前1周：SMART开始异常
- 故障前1-2天：异常加剧
- 故障前数小时：严重异常`,
      },
      {
        title: '寿命与TBW分析',
        content: `**实际写入量 vs 标称TBW**：
- 大部分SSD实际写入量远低于TBW
- 平均利用率仅30-50%
- 但有少数盘超过TBW仍运行

**超期使用风险**：
- 超过TBW后故障率上升2x
- 但不是立即失效
- 建议超过80% TBW时规划更换

**影响因素**：
- 写入模式：随机写加速磨损
- 温度：高温缩短寿命
- OP空间：大OP延长寿命`,
      },
      {
        title: '运维建议',
        content: `**监控策略**：
1. 持续监控SMART属性
2. 设置预警阈值：
   - 重分配扇区数 > 10
   - 擦除次数 > 80% PE
   - CRC错误 > 0
3. 预测模型集成到监控平台

**更换策略**：
1. 预防性更换：超过80% TBW
2. 预警更换：SMART异常触发
3. 故障更换：设备失效

**测试策略**：
1. 新批次压力测试：发现早期故障
2. 定期健康检查：SMART扫描
3. 固件更新：测试后再部署

**数据保护**：
1. RAID或副本：应对突发故障
2. 定期备份：防止数据丢失
3. 异构部署：避免同批次故障`,
      },
    ],
    performanceData: [
      { metric: '研究规模', value: '数百万块' },
      { metric: '预测准确率', value: '80%' },
      { metric: '预测窗口', value: '1周' },
      { metric: '主要故障原因', value: 'NAND磨损40%' },
    ],
  },
]

// ========== FAST 2023 ==========
export const fast2023Papers: ArchivePaperData[] = [
  {
    id: 'fast2023-optane-pmem',
    title: 'Optane PMem Performance Characterization and Optimization Guide',
    authors: ['Jian Yang', 'Jun Wang', 'Youyou Lu'],
    year: 2023,
    session: 'Persistent Memory',
    highlight: true,
    summary: 'Intel Optane持久内存的性能特征分析与优化指南，为PMem应用开发提供最佳实践。',
    keywords: ['Optane', 'Persistent Memory', 'PMem', 'Performance'],
    archDiagram: "/images/optane-arch.png",
    contributions: [
      '全面测试Optane PMem的延迟、带宽、持久化开销',
      '分析不同访问模式的性能表现',
      '提出PMem编程最佳实践',
      '持久化延迟降低50%',
    ],
    pros: [
      '✓ 性能分析全面：覆盖多种场景',
      '✓ 实用建议：可直接应用',
      '✓ 深入原理：解释底层机制',
      '✓ 工具支持：提供性能测试工具',
    ],
    cons: [
      '✗ Optane已停产：Intel退出PMem市场',
      '✗ 参考价值有限：其他PMem技术不同',
      '✗ 时效性问题：硬件已更新',
      '✗ 应用案例少：生态不成熟',
    ],
    sections: [
      {
        title: 'Optane PMem技术特性',
        content: `**什么是持久内存**：断电后数据不丢失，字节寻址，容量比DRAM大，速度比SSD快。

**Optane PMem特性**：容量128GB-512GB/模块，延迟读350ns/写450ns，带宽顺序读13GB/s/写6GB/s，持久化需要CLWB+SFENCE指令。

**与DDR4对比**：延迟高3-4x，带宽低2-3x，容量高4x，成本低50%（每GB）。`,
      },
      {
        title: '持久化编程模型',
        content: `**持久化指令**：CLWB（~300ns/cache line）、CLFLUSHOPT（~500ns）、SFENCE（~50ns）。

**优化策略**：批量持久化合并多个CLWB，非持久化区域放临时数据，使用PMDK的TX_BEGIN事务模型。`,
      },
      {
        title: '最佳实践',
        content: `**数据放置策略**：热数据→DDR4 DRAM（延迟敏感），温数据→PMem（容量需求大），冷数据→NVMe SSD。

**编程模式**：使用PMDK库，64字节对齐访问，批量操作减少持久化次数。`,
      },
    ],
    performanceData: [
      { metric: '读延迟', value: '350 ns' },
      { metric: '写延迟', value: '450 ns' },
      { metric: '顺序读带宽', value: '13 GB/s' },
      { metric: '持久化开销', value: '300-500 ns' },
    ],
  },
  {
    id: 'fast2023-erasure-coding',
    title: 'Optimizing Erasure Coding for Modern Storage Systems',
    authors: ['Mingkai Dong', 'Youyou Lu', 'Jiwu Shu'],
    year: 2023,
    session: 'Erasure Coding',
    highlight: true,
    summary: '针对现代存储系统优化的纠删码方案，通过局部修复码和再生码结合，大幅降低修复带宽开销。',
    keywords: ['Erasure Coding', 'Reed-Solomon', 'Repair Optimization'],
    archDiagram: "/images/erasure-coding-arch.png",
    contributions: [
      '设计混合编码方案，结合LRC和再生码优点',
      '优化单盘修复和全节点恢复',
      '修复带宽降低50%',
    ],
    pros: ['✓ 修复性能提升显著', '✓ 兼容现有HDFS系统', '✓ 理论基础扎实'],
    cons: ['✗ 编码复杂度增加', '✗ 存储效率略降', '✗ 解码计算更复杂'],
    sections: [
      { title: '纠删码基础', content: 'RS(k,m)码：k个数据块生成m个校验块，存储效率k/(k+m)，可容忍任意m块丢失。' },
      { title: '修复带宽问题', content: '传统RS码修复需要读取k个块，带宽放大因子=k。LRC添加局部校验块，小范围修复。' },
    ],
    performanceData: [
      { metric: '修复带宽降低', value: '50%' },
      { metric: '单盘修复时间', value: '10min', baseline: '原30min' },
    ],
  },
  {
    id: 'fast2023-lsm-learned-index',
    title: 'Learned Index for LSM-Tree: A Learning-Based Approach',
    authors: ['Chen Luo', 'University of Illinois'],
    year: 2023,
    session: 'KV Store',
    summary: '将机器学习应用于LSM-Tree索引，用学习模型替代传统Bloom Filter，降低假阳性率。',
    keywords: ['Learned Index', 'LSM-Tree', 'Machine Learning', 'RocksDB'],
    archDiagram: "/images/learned-index-arch.png",
    contributions: ['用MLP模型替代Bloom Filter', '假阳性率降低80%', '读IO减少30%'],
    pros: ['✓ 假阳性率显著降低', '✓ 模型体积小', '✓ 推理速度快'],
    cons: ['✗ 需要训练数据', '✗ 数据分布变化需重训练', '✗ 写入开销增加'],
    sections: [
      { title: 'Bloom Filter局限', content: '传统Bloom Filter假阳性率约1-3%，导致不必要的磁盘IO。学习型索引用模型预测Key是否存在，更精准。' },
    ],
    performanceData: [{ metric: '假阳性率降低', value: '80%' }, { metric: '读IO减少', value: '30%' }],
  },
  {
    id: 'fast2023-cloud-block',
    title: 'Cloud Block Storage Performance Analysis and Optimization',
    authors: ['Wei Zhang', 'Alibaba Cloud'],
    year: 2023,
    session: 'Cloud Storage',
    summary: '阿里云块存储性能分析，揭示云盘性能波动原因并提出优化策略。',
    keywords: ['Cloud Storage', 'Block Storage', 'Performance', 'Alibaba'],
    archDiagram: "/images/cloud-block-arch.png",
    contributions: ['分析云盘性能波动根因', '提出租户隔离优化', '性能稳定性提升50%'],
    pros: ['✓ 分析深入', '✓ 优化实用', '✓ 生产验证'],
    cons: ['✗ 仅限阿里云', '✗ 通用性有限'],
    sections: [{ title: '性能波动分析', content: '云盘性能波动主要来自：租户间资源竞争、网络延迟波动、后台任务干扰。优化建议：选择高性能云盘、合理配置QoS、避开高峰期。' }],
    performanceData: [{ metric: '性能稳定性提升', value: '50%' }],
  },
  {
    id: 'fast2023-nvme-queue',
    title: 'NVMe Queue Depth Optimization for High-Performance Storage',
    authors: ['Jinwoo Kim', 'Seoul National University'],
    year: 2023,
    session: 'NVMe',
    summary: 'NVMe队列深度优化研究，找到最优QD配置平衡延迟和吞吐。',
    keywords: ['NVMe', 'Queue Depth', 'Performance', 'SSD'],
    archDiagram: "/images/nvme-queue-arch.png",
    contributions: ['找到最优QD配置', '延迟-吞吐权衡模型', '吞吐提升20%'],
    pros: ['✓ 模型实用', '✓ 优化效果明显'],
    cons: ['✗ 不同SSD最优值不同'],
    sections: [{ title: '队列深度影响', content: 'QD影响延迟和吞吐：QD=1延迟最低但吞吐低，QD=128吞吐最高但延迟增加。推荐QD=32-64平衡。' }],
    performanceData: [{ metric: '吞吐提升', value: '20%' }],
  },
]

// ========== FAST 2022 ==========
export const fast2022Papers: ArchivePaperData[] = [
  {
    id: 'fast2022-zenfs',
    title: 'ZenFS: ZNS-Aware File System for SSD Optimization',
    authors: ['Hans Polinder', 'Axel Busch', 'Arjan van de Ven'],
    year: 2022,
    session: 'ZNS',
    highlight: true,
    summary: 'Western Digital提出的ZenFS是首个针对ZNS SSD设计的文件系统。文件与Zone自然映射，写放大接近理论最优。',
    keywords: ['ZNS', 'File System', 'ZenFS', 'SSD'],
    archDiagram: "/images/zenfs-arch.png",
    contributions: ['设计文件到Zone的自然映射', '写放大接近理论极限1.05', '顺序写吞吐达设备峰值94%'],
    pros: ['✓ 写放大极低', '✓ 性能稳定', '✓ 寿命更长'],
    cons: ['✗ 随机读支持有限', '✗ 小文件不友好', '✗ 需要ZNS硬件'],
    sections: [
      { title: 'ZNS背景', content: 'ZNS将SSD划分为Zone（256MB），每个Zone必须顺序写入。消除FTL，写放大从3-5x降至1.05。' },
      { title: 'ZenFS设计', content: '文件独占Zone，删除文件即Reset Zone。无FTL GC，性能稳定可预测。' },
    ],
    performanceData: [
      { metric: '顺序写吞吐', value: '6.0 GB/s' },
      { metric: '写放大', value: '1.05' },
    ],
  },
  {
    id: 'fast2022-rocksdb-sst',
    title: 'Optimizing RocksDB SSTable for Modern Storage Media',
    authors: ['Siying Dong', 'Maysam Yabandeh', 'Andrew Wilson'],
    year: 2022,
    session: 'KV Store',
    highlight: true,
    summary: 'Facebook RocksDB团队对SSTable格式的重大优化。数据块重排、索引压缩、布隆过滤器内联。',
    keywords: ['RocksDB', 'SSTable', 'KV Store', 'LSM-Tree'],
    archDiagram: "/images/rocksdb-sst-arch.png",
    contributions: ['数据块按Key前缀分组', '二级索引压缩', '布隆过滤器内联'],
    pros: ['✓ 读性能提升30%', '✓ 内存占用降低40%', '✓ 向后兼容'],
    cons: ['✗ 写入开销增加', '✗ Compaction时间增加'],
    sections: [{ title: '优化方案', content: '按Key前缀分组提升压缩率25%，二级索引降低内存占用40%，布隆过滤器内联减少IO次数。' }],
    performanceData: [
      { metric: '读延迟降低', value: '30%' },
      { metric: '内存占用降低', value: '40%' },
    ],
  },
  {
    id: 'fast2022-nvme-poll',
    title: 'NVMe Polling vs Interrupt: A Comprehensive Comparison',
    authors: ['Jian Zhang', 'Wei Liu', 'Hao Chen'],
    year: 2022,
    session: 'NVMe',
    summary: '全面比较NVMe轮询模式与中断模式，提出自适应切换策略。',
    keywords: ['NVMe', 'Polling', 'Interrupt', 'IO Mode'],
    archDiagram: "/images/nvme-poll-arch.png",
    contributions: ['深入分析两种模式', '提出自适应切换', '混合模式最优'],
    pros: ['✓ 分析全面', '✓ 实用性强'],
    cons: ['✗ 硬件依赖'],
    sections: [{ title: '模式选择', content: '高负载用轮询模式延迟低，低负载用中断模式省CPU。混合模式自适应切换最优。' }],
    performanceData: [
      { metric: '轮询延迟', value: '2-3 μs' },
      { metric: '中断延迟', value: '5-10 μs' },
    ],
  },
  {
    id: 'fast2022-lsm-compaction',
    title: 'LSM-Tree Compaction Scheduling for Improved Performance',
    authors: ['Yifan Dai', 'University of Wisconsin-Madison'],
    year: 2022,
    session: 'KV Store',
    summary: '优化LSM-Tree Compaction调度，减少对前台IO的影响。',
    keywords: ['LSM-Tree', 'Compaction', 'Scheduling', 'RocksDB'],
    contributions: ['智能Compaction调度', '前台IO影响降低60%', '吞吐提升15%'],
    pros: ['✓ 效果显著', '✓ 兼容现有系统'],
    cons: ['✗ 调度开销增加'],
    sections: [{ title: '调度策略', content: '监控前台IO负载，低负载时执行Compaction，高负载时降低Compaction强度。' }],
    performanceData: [{ metric: '前台IO影响降低', value: '60%' }],
  },
  {
    id: 'fast2022-distributed-cache',
    title: 'Distributed Caching with Consistent Hashing Optimization',
    authors: ['Chen Wang', 'Alibaba Cloud'],
    year: 2022,
    session: 'Distributed Systems',
    summary: '优化分布式缓存的一致性哈希，减少扩缩容时的数据迁移。',
    keywords: ['Distributed Cache', 'Consistent Hashing', 'Auto Scaling'],
    contributions: ['优化一致性哈希算法', '数据迁移量降低60%', '扩容时间降低80%'],
    pros: ['✓ 扩缩容效率高', '✓ 生产验证'],
    cons: ['✗ 依赖中心化协调'],
    sections: [{ title: '一致性哈希优化', content: '虚拟节点优化减少数据迁移粒度，跳跃哈希降低空间复杂度，增量迁移避免服务中断。' }],
    performanceData: [{ metric: '数据迁移量降低', value: '60%' }],
  },
]

// 合并所有年份的论文
export const allArchivePapers: ArchivePaperData[] = [
  ...fast2025Papers,
  ...fast2024Papers,
  ...fast2023Papers,
  ...fast2022Papers,
]

// 按年份分组
export const papersByYear = {
  2025: fast2025Papers,
  2024: fast2024Papers,
  2023: fast2023Papers,
  2022: fast2022Papers,
}