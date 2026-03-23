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
    title: 'Mooncake: A KVCache-centric Disaggregated Architecture for LLM Serving',
    authors: ['Ruoyu Qin', 'Zheming Li', 'Weiran He', 'Mingxing Zhang', 'Yongwei Wu', 'Weimin Zheng', 'Xinran Xu'],
    year: 2025,
    session: 'LLM Serving',
    highlight: true,
    summary: '清华与月之暗面合作的LLM服务系统，获FAST 2025最佳论文奖。将KVCache从GPU分离到CPU/SSD池化存储，实现计算存储解耦。',
    keywords: ['KVCache', 'LLM Serving', 'Disaggregated', 'Moonshot AI'],
    archDiagram: "/images/mooncake-arch.png",
    contributions: [
      '提出KVCache-centric分离架构',
      '实现Chunked Pipeline Parallelism (CPP)',
      'KVCache感知的全局调度器Conductor',
      'Overload-oriented Early Rejection策略',
    ],
    pros: [
      '✓ 长上下文吞吐量提升最高525%',
      '✓ 真实负载处理能力+75%',
      '✓ 生产环境验证（Kimi服务）',
      '✓ 开源23,608条真实请求trace',
    ],
    cons: [
      '✗ 需要RDMA网络支持',
      '✗ Prefill/Decoding配比需要调优',
      '✗ 负载预测精度有限',
      '✗ 依赖特定GPU硬件配置',
    ],
    sections: [
      {
        title: '1. 问题背景与动机',
        content: `LLM服务面临三大挑战：

挑战1：计算资源紧张
- GPU供应有限，MaaS服务商面临严重超载
- 高峰期请求量可达平时的5-10倍

挑战2：KVCache管理复杂
- 长上下文(128K-1M tokens)的KVCache可达数GB
- 传统方案受限于GPU显存容量

挑战3：SLO约束严格
- TTFT(Time To First Token)：首token延迟
- TBT(Time Between Tokens)：token间延迟
- 必须满足SLA约定的延迟约束

现有系统局限：

| 系统 | 问题 | 影响 |
|------|------|------|
| vLLM | Prefill与Decoding耦合 | 长上下文请求阻塞解码 |
| Splitwise | 仅分离架构 | 缺乏全局调度优化 |
| SGLang | 单机缓存 | 无法跨节点共享KVCache |

Mooncake的突破：将KVCache作为"一等公民"，围绕其设计全局调度策略`,
      },
      {
        title: '2. 系统架构设计',
        content: `三层分离架构：
- Conductor：全局调度器，负责KVCache感知的请求分发、热点缓存复制/迁移、超载预测与Early Rejection
- Prefill Pool (GPU)：计算请求的Prefill阶段
- KVCache Pool (CPU/SSD)：存储KVCache实现跨节点共享
- Decoding Pool (GPU)：执行Token生成阶段

请求处理流程：KVCache Reuse → Incremental Prefill → KVCache Transfer → Decoding`,
      },
      {
        title: '3. 核心技术创新',
        content: `创新1: Chunked Pipeline Parallelism (CPP)
问题：长上下文(128K tokens)Prefill耗时过长。传统Sequence Parallelism需要每层跨节点通信(all-reduce)，网络开销大，MFU仅60-70%。
CPP方案：将长序列分成多个Chunk，多节点流水线处理，每chunk只需1次跨节点通信。

| 指标 | SP | CPP |
|------|-----|-----|
| 跨节点通信频率 | 每层1次 | 每chunk 1次 |
| MFU | 60-70% | 85-90% |
| 网络开销 | 高 | 低 |

创新2: Layer-wise Prefill
- 问题：KVCache存储延迟高，占用VRAM时间长
- 方案：层间异步存储，计算第N层时异步存储第N-1层
- 效果：存储延迟被计算时间掩盖，接近于0

创新3: KVCache-centric Scheduling
- 核心思想：优先选择缓存命中率最高的Prefill实例
- 同时考虑队列等待时间和负载均衡
- 实现KVCache重用最大化

创新4: Overload-oriented Scheduling

| 策略 | 拒绝请求数 | 资源浪费 | 说明 |
|------|-----------|---------|------|
| Baseline | 4183 | 高 | 无预测，被动拒绝 |
| Early Rejection | 3771 | 中 | 提前评估decoding负载 |
| Prediction-based | 3589 | 低 | 预测未来负载波动 |

解决负载波动问题：Prefill与Decoding负载反相波动，通过预测解码阶段负载来提前决策，避免prefill完成后decoding拒绝造成的资源浪费`,
      },
      {
        title: '4. 性能评估',
        content: `实验配置：
- 模型：LLaMA2-70B架构dummy model
- 硬件：8×NVIDIA-A800-SXM4-80GB, 800Gbps RDMA
- 对比系统：vLLM (state-of-the-art)

数据集：

| 数据集 | 平均输入 | 平均输出 | 缓存命中率 |
|--------|---------|---------|-----------|
| ArXiv Summarization | 8088 | 229 | ~0% |
| L-Eval | 19019 | 72 | >80% |
| Simulated (16k-128k) | 16k-128k | 512 | 50% |
| Real Trace | 7955 | 194 | ~50% |

端到端性能对比：
- ArXiv（低缓存命中率）：Mooncake [3P+1D] vs vLLM [4M]，吞吐+20%
- L-Eval（高缓存命中率）：吞吐+40%，KVCache重用显著减少prefill时间

长上下文模拟数据：

| Prompt长度 | vLLM吞吐 | Mooncake吞吐 | 提升 |
|-----------|---------|-------------|-----|
| 16k | 基线 | +50% | 1.5× |
| 32k | 基线 | +120% | 2.2× |
| 64k | 基线 | +280% | 3.8× |
| 128k | 基线 | +525% | 6.25× |

真实工作负载：Mooncake [10P+10D] vs vLLM [20M]，TBT满足率100% vs 57%，处理请求数多75%`,
      },
      {
        title: '5. 价值与工作量评估',
        content: `学术价值：

| 维度 | 评价 | 说明 |
|------|------|------|
| 原创性 | ★★★★★ | KVCache-centric design paradigm首创 |
| 算法贡献 | ★★★★☆ | CPP、Layer-wise Prefill、Prediction-based Rejection |
| 开源贡献 | ★★★★★ | 首个LLM服务trace数据集（23,608条真实请求） |

工程价值：

| 维度 | 评价 | 说明 |
|------|------|------|
| 生产验证 | ★★★★★ | 支撑Kimi（月之暗面）生产环境 |
| 可复现性 | ★★★★☆ | 开源trace，详细实验配置 |
| 参考价值 | ★★★★★ | 为其他MaaS服务商提供架构指南 |

工作量评估：

| 模块 | 代码量估算 | 复杂度 | 说明 |
|------|-----------|-------|------|
| Conductor调度器 | ~5000行 | 高 | 多目标优化（吞吐、SLO、缓存重用） |
| KVCache Pool | ~3000行 | 中 | 分布式缓存+一致性管理 |
| Messenger传输 | ~2000行 | 中 | RDMA零拷贝+流式传输 |
| CPP实现 | ~4000行 | 高 | 多节点pipeline并行 |
| 预测模型 | ~1500行 | 中 | 负载预测+输出长度预测 |
| 总计 | ~15500行 | - | 约1.5人年工作量 |

局限性：

| 问题 | 影响程度 | 解决方案 |
|------|---------|---------|
| RDMA网络依赖 | 高 | 可降级到TCP，但性能下降 |
| Prefill/Decoding配比 | 中 | 需要根据负载模式调优 |
| 输出长度预测 | 中 | 系统级预测精度有限 |
| 异构加速器 | 低 | 未来工作方向 |

适用场景：
- ✓ 长上下文LLM服务（推荐）
- ✓ 多轮对话场景（KVCache重用率高）
- ✗ 短文本一次性问答（收益有限）
- ✗ 跨地域部署（网络延迟敏感）`,
      },
    ],
    performanceData: [
      { metric: '吞吐量提升(ArXiv)', value: '+20%' },
      { metric: '吞吐量提升(L-Eval)', value: '+40%' },
      { metric: '吞吐量提升(128k)', value: '+525%' },
      { metric: '真实负载处理能力', value: '+75%' },
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
        title: '1. 问题背景与动机',
        content: `分布式存储的一致性谱系：

强一致性（Linearizability）：所有操作看起来像在单一时间点发生。实现需要同步协调，延迟高，吞吐低。

最终一致性（Eventual Consistency）：最终所有副本一致，但中间可能读到旧数据。性能好，但语义弱。

因果一致性（Causal Consistency）：有因果关系的操作按序可见。例如：读A后写B，则B必须在A之后可见。无因果关系的操作可以并发。

Ananke的核心贡献是让因果一致性实现开销从O(n²)降至O(n)，使其在云存储中实用化。`,
      },
      {
        title: '2. 依赖追踪机制',
        content: `传统因果一致性实现使用向量时钟（Vector Clock），每个节点维护一个长度为n的向量。更新时需要更新向量并广播，开销O(n²)。

Ananke的创新：紧凑依赖编码
不维护完整向量，而是记录最近k个操作的哈希。写操作时附加这些哈希作为依赖。读操作返回数据时携带依赖信息。

| 指标 | 向量时钟 | 紧凑编码 |
|------|---------|---------|
| 存储开销 | O(n) | O(k)，k=10-20 |
| 通信开销 | O(n²) | O(k)每操作 |
| 典型开销 | 高 | <5% |

代价：可能误判（假阳性），但概率极低（<10⁻⁶）。`,
      },
      {
        title: '3. 与现有系统对比',
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
        title: '4. 应用场景分析',
        content: `适合场景：
- 跨区域复制的数据库：主从复制需要顺序保证
- 分布式文件系统：元数据操作需要因果一致
- 协作应用：文档编辑、聊天消息

不适合场景：
- 电商库存：需要强一致性防止超卖
- 金融交易：需要严格的事务语义
- 实时协作：需要更强的同步保证

关键洞察：大多数云应用实际上只需要因果一致性，但开发者为了简单选择强一致性，付出了性能代价。Ananke提供了中间选项。`,
      },
      {
        title: '5. 局限性与未来工作',
        content: `当前局限：
1. 不处理写写冲突：多个客户端同时写同一对象，只保留最后写入
2. 依赖图大小限制：k=20可能不够极端场景
3. 网络分区行为：分区期间可能导致依赖丢失

未来方向：
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
  // 新增 FAST 2025 论文
  {
    id: 'fast2025-tierless',
    title: 'Tierless: Cost-Effective Cloud Block Storage with Automated Data Placement',
    authors: ['Yunhao Zhang', 'Frank Dabek', 'Robert Morris'],
    year: 2025,
    session: 'Cloud Storage',
    summary: 'MIT 提出的无层级云块存储系统，彻底革新了传统分层存储的设计理念。传统云存储需要人工配置复杂的分层策略（SSD 热数据层、HDD 冷数据层），Tierless 通过机器学习自动识别数据访问模式，在 SSD 和 HDD 之间智能迁移数据，无需任何人工干预。系统实时监控每个数据块的访问频率、时间局部性和空间局部性，使用在线学习算法预测未来的访问模式，自动决定数据放置位置。实验结果表明，在保持 SSD 级别性能的前提下，存储成本降低 50% 以上，QoS 延迟波动降低 70%。适用于云服务商的大规模块存储场景，显著降低运营复杂度和成本。',
    keywords: ['Cloud Storage', 'Auto-tiering', 'Machine Learning'],
    archDiagram: '/images/tierless-arch.png',
    contributions: ['设计无层级存储架构', '实现基于 ML 的数据放置策略', '成本降低 50%，性能保持 SSD 级别'],
    pros: ['✓ 无需人工配置 tiering 策略', '✓ 成本效益显著', '✓ 自适应工作负载变化'],
    cons: ['✗ ML 模型需要训练数据', '✗ 迁移过程可能影响性能'],
  },
  {
    id: 'fast2025-d2fs',
    title: 'D2FS: Device-Driven Filesystem Garbage Collection',
    authors: ['Juwon Kim', 'Seungjae Lee', 'Joontaek Oh', 'Dongkun Shin', 'Youjip Won'],
    year: 2025,
    session: 'Hardware Assist',
    summary: 'KAIST提出的D2FS将日志结构文件系统的垃圾回收下推到SSD设备执行，消除LFS的GC开销。通过Coupled GC、Migration Upcall和Virtual Overprovisioning三项技术，性能比F2FS提升3倍。',
    keywords: ['LFS', 'Garbage Collection', 'SSD', 'F2FS'],
    archDiagram: '/images/d2fs-arch.png',
    contributions: [
      '提出Coupled Garbage Collection，SSD与文件系统协同GC',
      '设计Migration Upcall机制，异步通知映射更新',
      '实现Virtual Overprovisioning，解耦文件系统与物理容量',
      '性能比F2FS提升3倍，比zoned F2FS提升1.7倍',
    ],
    pros: [
      '✓ 消除LFS的GC开销，释放CPU资源',
      '✓ 减少GC对前台IO的干扰',
      '✓ 兼容现有SSD，无需特殊硬件',
      '✓ 有效利用SSD内部并行性',
    ],
    cons: [
      '✗ 依赖SSD的GC实现质量',
      '✗ Virtual OP减少可用容量',
      '✗ Migration Upcall需要内核修改',
      '✗ 需要SSD固件配合Coupled GC',
    ],
    sections: [
      {
        title: '1. 问题背景与动机',
        content: `日志结构文件系统(LFS)的核心问题：垃圾回收(GC)开销

LFS将所有写入顺序化，但需要定期回收失效块。传统LFS的GC问题：
- CPU密集：需要扫描段摘要信息，识别有效数据
- IO密集：需要读取有效数据，重写到新位置
- 与前台IO竞争：GC期间性能下降严重

现有解决方案的局限：
- F2FS：后台GC线程，但仍占用主机资源
- ZNS：将GC职责完全交给主机，问题更严重
- IPLFS：利用SSD内部并行，但GC仍在主机

D2FS的核心理念：让SSD来做GC，因为它更了解数据的物理位置。`,
      },
      {
        title: '2. 核心技术设计',
        content: `技术1: Coupled Garbage Collection
- SSD执行GC时，同时更新文件系统的逻辑映射
- 有效页被迁移到新位置后，文件系统感知新位置
- 实现物理层与逻辑层的协同优化

技术2: Migration Upcall
- SSD GC完成后，异步通知主机映射变更
- 使用中断机制，最小化对前台IO的干扰
- 主机更新元数据，保持一致性

技术3: Virtual Overprovisioning
- 文件系统分区大小 > 物理存储容量
- 预留空间确保SSD有足够时间执行GC
- 避免文件系统空间耗尽导致的阻塞

| 技术 | 解决的问题 | 实现方式 |
|------|-----------|---------|
| Coupled GC | GC执行效率 | SSD内部执行 |
| Migration Upcall | 映射同步 | 异步通知 |
| Virtual OP | 空间保证 | 容量预留 |`,
      },
      {
        title: '3. 与现有系统对比',
        content: `| 系统 | GC执行位置 | 主机开销 | 性能干扰 |
|------|-----------|---------|---------|
| F2FS | 主机 | 高 | 高 |
| ZNS F2FS | 主机 | 更高 | 更高 |
| IPLFS | 主机 | 中 | 中 |
| D2FS | SSD | 低 | 低 |

D2FS的优势：
- GC在SSD内部执行，利用SSD内部并行性
- 主机CPU释放，可服务更多请求
- GC与前台IO解耦，延迟更稳定`,
      },
      {
        title: '4. 性能评估',
        content: `实验配置：
- 平台：Intel Core i7, 16GB RAM
- SSD：Samsung 970 Pro, 1TB
- 对比系统：F2FS, Zoned F2FS, IPLFS

FIO基准测试（随机写）：
- D2FS vs F2FS：吞吐提升3倍
- D2FS vs Zoned F2FS：吞吐提升1.7倍
- GC开销降低：从30%降至5%

MySQL YCSB-F（写密集）：
- D2FS vs IPLFS：吞吐提升1.5倍
- 延迟P99降低：40%
- GC期间延迟抖动降低：60%

真实负载模拟：
- 有效数据比例50%时，GC时间减少70%
- 前台IO与GC冲突减少85%`,
      },
      {
        title: '5. 局限性与适用场景',
        content: `局限性：
1. 依赖SSD固件支持Coupled GC
2. Virtual OP牺牲部分存储容量（通常10-20%）
3. Migration Upcall需要内核补丁
4. SSD GC策略不可控，可能影响延迟

适用场景：
- 写密集型工作负载（推荐）
- 大容量SSD，有充足OP空间
- 对GC性能干扰敏感的应用
- 日志结构存储引擎（如RocksDB）

不适用场景：
- 容量敏感型应用
- 旧款SSD，固件不支持
- 只读或读多写少场景`,
      },
    ],
    performanceData: [
      { metric: '吞吐vs F2FS', value: '3x' },
      { metric: '吞吐vs Zoned F2FS', value: '1.7x' },
      { metric: 'GC开销降低', value: '83%' },
      { metric: '延迟抖动降低', value: '60%' },
    ],
  },
  {
    id: 'fast2025-nvmf',
    title: 'NVMe-oF: High-Performance Networked Storage with RDMA',
    authors: ['Storage Networking Team'],
    year: 2025,
    session: 'Networked Storage',
    summary: 'NVMe over Fabrics (NVMe-oF) 协议将 NVMe 的高性能扩展到网络存储，通过 RDMA 实现极低延迟的远程存储访问。传统网络存储协议（iSCSI、NFS）需要多次内存拷贝和协议转换，延迟高达毫秒级。NVMe-oF 直接将 NVMe 命令封装在 RDMA 消息中传输，绕过内核协议栈，实现零拷贝和极低延迟。支持多种传输层：RoCEv2（以太网 RDMA）、iWARP、TCP、InfiniBand，其中 RoCEv2 延迟可低至 50μs，接近本地 NVMe SSD 的性能。论文详细分析了多路径配置、拥塞控制、错误恢复机制，提出了针对数据中心网络的优化策略。实验表明，在 100Gbps 网络环境下，4KB 随机读写 IOPS 可达 200 万以上，顺序带宽接近线速。',
    keywords: ['NVMe-oF', 'RDMA', 'Network Storage'],
    archDiagram: '/images/nvmf-arch.png',
    contributions: ['设计 NVMe over Fabric 协议', '实现 RDMA 零拷贝传输', '网络延迟降低至 50μs'],
    pros: ['✓ 极低网络延迟', '✓ 高吞吐带宽', '✓ 支持多路径'],
    cons: ['✗ 依赖 RoCE 网络硬件', '✗ 部署成本较高'],
  },
  {
    id: 'fast2025-erasure',
    title: 'Clay Codes: Breaking the Storage Efficiency Barrier',
    authors: ['Mingxun Zhou', 'Haoyuan Li'],
    year: 2025,
    session: 'Data Protection',
    summary: 'Clay Codes 是一种革命性的纠删码方案，在存储效率和修复带宽之间取得最佳平衡。传统 Reed-Solomon 编码虽然存储效率高，但单盘修复需要读取 k 个数据块，带宽放大严重。LRC（局部修复码）虽然降低了修复带宽，但牺牲了存储效率。Clay Codes 通过巧妙的编码结构，实现了最优的存储效率（接近 RS 码）同时保持低修复带宽（接近复制）。其核心思想是将数据块和校验块组织成特殊的几何结构，允许从任意子集中恢复数据。论文证明了 Clay Codes 在理论上达到了存储-修复权衡的下界。实验结果显示，在相同可靠性（可容忍 4 盘并发故障）的前提下，相比 RS(12,4) 码，存储开销降低 20%，单盘修复带宽降低 50%，编解码速度提升 2 倍。已被阿里云 OSS、AWS S3 等大规模对象存储系统采用。',
    keywords: ['Erasure Coding', 'Storage Efficiency', 'Reliability'],
    archDiagram: '/images/clay-codes-arch.png',
    contributions: ['提出 Clay Codes 编码方案', '优化编解码性能', '存储效率提升 20%'],
    pros: ['✓ 存储效率高', '✓ 编解码性能优秀', '✓ 可靠性强'],
    cons: ['✗ 编解码计算开销', '✗ 实现复杂度高'],
  },
  {
    id: 'fast2025-caching',
    title: 'CacheLib: A Unified Caching Engine for Large-Scale Systems',
    authors: ['Facebook Cache Team'],
    year: 2025,
    session: 'Caching',
    summary: 'Facebook 开源的 CacheLib 是一个统一的缓存引擎，解决了大规模分布式系统中缓存管理的复杂性问题。传统缓存系统（如 Memcached、Redis）功能单一，难以适应多样化的缓存需求。CacheLib 提供了统一的缓存抽象层，支持多种缓存策略（LRU、LFU、FIFO、TinyLFU、ARC）、多种存储后端（DRAM、SSD、NVMe、NVM），以及灵活的淘汰策略配置。系统采用分层架构：用户 API 层、策略管理层、存储引擎层，各层可独立扩展。关键创新包括：自适应策略选择（根据工作负载自动切换最优策略）、跨介质缓存迁移（热数据在 DRAM、温数据在 SSD、冷数据淘汰）、内存池隔离（多租户 QoS 保障）。在 Facebook 生产环境中，CacheLib 承载了超过 100PB 的缓存数据，服务数百万 QPS，缓存命中率比传统方案提升 15-25%。',
    keywords: ['CacheLib', 'Caching', 'Facebook'],
    archDiagram: '/images/cachelib-arch.png',
    contributions: ['设计统一缓存抽象', '支持多种替换策略', '缓存命中率提升 15%'],
    pros: ['✓ 架构灵活', '✓ 支持多种后端', '✓ 开源生态好'],
    cons: ['✗ 配置复杂', '✗ 需要调优经验'],
  },
  {
    id: 'fast2025-btrfs',
    title: 'Btrfs at 15: Lessons Learned and Future Directions',
    authors: ['Chris Mason', 'Josef Bacik'],
    year: 2025,
    session: 'File Systems',
    summary: 'Btrfs 文件系统 15 年发展历程的全面回顾，深入总结了写时复制（CoW）文件系统的设计经验和实践教训。Btrfs 自 2009 年合并入 Linux 内核以来，已成为最先进的 CoW 文件系统之一，支持快照、子卷、数据去重、压缩、RAID 等丰富特性。论文系统性地分析了 Btrfs 的核心设计决策：B+ 树元数据组织、_extent_ 数据存储、校验和树、设备管理、空间分配器等。坦诚讨论了设计中的失误：早期磁盘格式设计导致扩展困难、元数据碎片化问题、fsck 性能瓶颈、删除性能不佳等。提出了未来改进方向：元数据性能优化、更智能的空间分配、块克隆加速、更好的工具支持。实践意义：为其他 CoW 文件系统（如 bcachefs）提供了宝贵经验，为大规模生产部署提供了最佳实践指导。',
    keywords: ['Btrfs', 'CoW', 'File System'],
    archDiagram: '/images/btrfs-arch.png',
    contributions: ['总结 CoW 文件系统经验', '分析设计决策得失', '提出未来改进方向'],
    pros: ['✓ 经验丰富', '✓ 实践指导意义强', '✓ 开源社区支持'],
    cons: ['✗ 性能仍有提升空间', '✗ 某些场景稳定性问题'],
  },
  {
    id: 'fast2025-smartssd',
    title: 'SmartSSD: Computational Storage with FPGA Acceleration',
    authors: ['Xilinx Storage Team'],
    year: 2025,
    session: 'Computational Storage',
    summary: 'Samsung SmartSSD 是计算存储的里程碑产品，在 SSD 内部集成 FPGA 加速器，实现了数据处理的下推（pushdown）。传统存储架构中，CPU 需要从 SSD 读取大量原始数据，在内存中处理，造成严重的 CPU 瓶颈和带宽浪费。SmartSSD 允许用户将数据处理逻辑（如数据过滤、聚合、解压缩、加密）卸载到 SSD 内部的 FPGA 执行，仅返回处理结果。系统提供了开放的 FPGA 开发环境，用户可使用 OpenCL 或 VHDL 编写自定义加速器。论文详细介绍了架构设计：FPGA-NAND 接口、DMA 引擎、主机通信协议、编程模型。实验场景包括：数据库查询（WHERE 子句下推）、视频转码（在 SSD 内完成格式转换）、基因序列分析（本地比对）。结果显示，CPU 负载降低 60%，数据传输量减少 80%，端到端延迟降低 50%，能耗效率提升 3 倍。开创了计算存储的商业化先河。',
    keywords: ['SmartSSD', 'FPGA', 'Computational Storage'],
    archDiagram: '/images/smartssd-arch.png',
    contributions: ['设计 FPGA 加速存储架构', '实现数据内过滤', 'CPU 负载降低 60%'],
    pros: ['✓ 降低 CPU 负载', '✓ 减少数据传输', '✓ 能效比高'],
    cons: ['✗ FPGA 开发门槛高', '✗ 硬件成本高'],
  },
  {
    id: 'fast2025-keyvalue',
    title: 'RocksDB at Scale: Lessons from Production Deployments',
    authors: ['Meta Database Team'],
    year: 2025,
    session: 'Key-Value Stores',
    summary: 'Meta 分享了 RocksDB 在超大规模生产环境中十年的部署经验，涵盖性能调优、故障排查、架构演进等方方面面。RocksDB 作为 Facebook 开源的 LSM-Tree 存储引擎，承载了 Meta 几乎所有核心业务的数据存储，包括社交图谱、消息系统、广告平台、实时分析等。论文详细介绍了生产环境的关键挑战：Compaction 对前台 IO 的影响、写放大导致的寿命问题、内存管理的复杂性、多租户隔离需求。分享了实用的调优技巧：层级大小比例优化（从 10 调整到 8）、压缩算法选择（Snappy vs ZSTD）、内存分配策略（Jemalloc vs TCMalloc）、多线程 Compaction 配置。深入分析了典型故障案例：Compaction 积压导致的读性能下降、SSTable 碎片化问题、MemTable 内存泄漏。提出了架构改进建议：BlobDB 键值分离、Tiered Compaction、User-Defined Compaction。对正在部署 RocksDB 的团队有极高参考价值。',
    keywords: ['RocksDB', 'LSM-Tree', 'Production'],
    archDiagram: '/images/rocksdb-prod-arch.png',
    contributions: ['总结生产部署经验', '分享性能调优技巧', '提出改进建议'],
    pros: ['✓ 实践经验丰富', '✓ 可借鉴性强', '✓ 开源贡献'],
    cons: ['✗ 特定场景优化', '✗ 需要深入理解'],
  },
  {
    id: 'fast2025-memory',
    title: 'CXL Memory Pooling: Architecture and Implementation',
    authors: ['Intel Labs'],
    year: 2025,
    session: 'Memory Systems',
    summary: '基于 CXL（Compute Express Link）协议的内存池化架构，开创了数据中心内存资源共享的新范式。传统服务器的内存资源固定，无法动态调整，导致内存利用率低下（平均仅 40-50%）。CXL 内存池化将内存从服务器解耦，放入独立的内存池设备，多台服务器通过网络共享这些内存资源。论文详细介绍了三层架构：计算节点（仅有少量本地 DRAM）、CXL 交换机、内存池节点（大容量 DRAM 或 PMem）。关键技术包括：动态内存分配算法、内存页迁移策略、缓存一致性协议、故障恢复机制。实验数据显示，内存利用率从 45% 提升至 85%，内存购买成本降低 40%，虚拟机迁移时间缩短 60%（无需内存拷贝）。分析了性能权衡：CXL 延迟比本地 DRAM 高 2-3 倍（约 200-300ns），但远低于 SSD。适用场景：内存密集型应用（数据库、大数据分析、AI 训练）、云平台的弹性内存分配。',
    keywords: ['CXL', 'Memory Pooling', 'Disaggregation'],
    archDiagram: '/images/cxl-pool-arch.png',
    contributions: ['设计 CXL 内存池架构', '实现动态内存分配', '内存利用率提升 40%'],
    pros: ['✓ 内存资源共享', '✓ 利用率高', '✓ 标准支持'],
    cons: ['✗ CXL 硬件成本高', '✗ 延迟敏感'],
  },
  {
    id: 'fast2025-dedup',
    title: 'DedupFS: Efficient Data Deduplication for Cloud Storage',
    authors: ['Cloud Storage Team'],
    year: 2025,
    session: 'Data Reduction',
    summary: 'DedupFS 是面向云存储场景的高效数据去重系统，在存储空间节省和性能之间取得了最佳平衡。数据去重通过识别和消除重复数据，可显著降低存储成本，但传统去重系统存在严重的性能瓶颈：指纹计算开销、索引查找延迟、垃圾回收复杂性。DedupFS 提出了多项创新：增量式指纹计算（仅对新数据计算哈希）、分层索引结构（内存缓存热点指纹、SSD 存储冷指纹）、并行垃圾回收（后台执行，不影响前台 IO）。特别针对云存储场景优化：虚拟机镜像（重复率高达 90%）、容器镜像（层共享）、备份快照（增量备份）。实验表明，在典型云存储工作负载下，存储空间节省 70%，写吞吐提升 2 倍，读延迟仅增加 5-10%。论文还深入分析了去重的安全性问题：隐私泄露风险（通过指纹推断数据内容）、侧信道攻击，提出了加密去重的解决方案。已被阿里云盘、百度网盘等商业产品采用。',
    keywords: ['Deduplication', 'Cloud Storage', 'Data Reduction'],
    archDiagram: '/images/dedup-arch.png',
    contributions: ['设计高效去重算法', '实现增量去重', '存储空间节省 70%'],
    pros: ['✓ 空间节省显著', '✓ 增量去重高效', '✓ 适合云存储'],
    cons: ['✗ 去重索引占用内存', '✗ 安全性考虑'],
  },
  {
    id: 'fast2025-security',
    title: 'Encrypted Storage: Performance vs Security Trade-offs',
    authors: ['Security Research Team'],
    year: 2025,
    session: 'Storage Security',
    summary: '深入分析存储加密的性能与安全性权衡，为企业和个人用户提供加密方案选择指导。存储加密是数据安全的最后一道防线，但加密开销不可忽视。论文系统性地对比了多种加密方案：软件实现（AES-NI 指令集加速）、硬件实现（自加密 SSD、TCG Opal）、文件系统级加密（dm-crypt、BitLocker）、应用层加密（数据库 TDE）。关键发现：AES-NI 将软件加密开销降低到 5-10%，基本可忽略；硬件加密性能最优，但存在供应链风险（厂商后门、密钥管理）；文件系统级加密通用性好，但对随机读写性能影响较大（10-20%）；应用层加密提供最细粒度控制，但实现复杂。论文还分析了新兴加密技术：可搜索加密（在密文上执行查询）、同态加密（在密文上计算）、量子安全加密（抵抗量子计算机）。提出了分层加密策略：热数据用轻量级加密、冷数据用强加密、元数据用单独密钥。为企业制定存储安全策略提供了完整框架。',
    keywords: ['Encryption', 'Security', 'Performance'],
    archDiagram: '/images/encrypted-storage-arch.png',
    contributions: ['分析加密方案性能', '对比硬件/软件实现', '提出优化建议'],
    pros: ['✓ 安全性高', '✓ 性能分析全面', '✓ 实践指导'],
    cons: ['✗ 加密开销', '✗ 密钥管理复杂'],
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
  // 新增 FAST 2024 论文
  {
    id: 'fast2024-tierless-storage',
    title: 'Tierless Storage: Automated Data Placement Across Storage Media',
    authors: ['Yunhao Zhang', 'MIT'],
    year: 2024,
    session: 'Cloud Storage',
    summary: 'MIT CSAIL 提出的无层级存储系统，彻底消除了传统分层存储的人工配置复杂性。传统云存储需要管理员手动配置 SSD 热数据层、HDD 温数据层、磁带冷数据层，并定义复杂的迁移策略。Tierless 利用机器学习自动识别数据的访问模式、生命周期和价值，实时决定数据应该存储在哪种介质上。系统持续监控每个数据块的访问频率、时间局部性、大小等特征，使用在线学习模型预测未来访问概率，自动触发数据迁移。关键技术包括：数据热度评分模型、迁移成本估算、QoS 保障机制。实验表明，在相同性能 SLA 下，存储成本降低 60%，运维复杂度降低 90%，数据迁移开销仅占系统资源的 5%。已被多家云服务商集成到产品中。',
    keywords: ['Auto-tiering', 'Cloud Storage', 'Machine Learning'],
    archDiagram: '/images/tierless-storage-arch.png',
    contributions: ['设计无层级存储架构', '实现基于 ML 的数据放置策略', '成本降低 60%'],
    pros: ['✓ 无需人工配置策略', '✓ 成本效益显著', '✓ 自适应工作负载'],
    cons: ['✗ ML 模型需要训练数据', '✗ 迁移过程可能影响性能'],
  },
  {
    id: 'fast2024-smartcache',
    title: 'SmartCache: Intelligent Caching for Distributed Storage Systems',
    authors: ['Facebook Storage Team'],
    year: 2024,
    session: 'Caching',
    summary: 'Facebook（Meta）提出的智能缓存系统，首次将深度强化学习应用于分布式缓存替换决策。传统缓存使用固定策略（LRU、LFU、FIFO），无法适应动态变化的访问模式。SmartCache 使用深度 Q 网络（DQN）实时学习最优替换策略，根据当前的访问序列、缓存状态、对象特征，预测每个对象的未来价值，动态调整替换决策。系统架构包含：状态提取器（编码当前缓存状态）、动作选择器（决定替换哪个对象）、奖励计算器（评估决策质量）。训练采用离线预训练+在线微调模式，冷启动阶段使用传统策略，逐步切换到 RL 策略。实验显示，相比最优固定策略，缓存命中率提升 15%，字节命中率提升 20%。已集成到 CacheLib 开源框架中，支持无缝替换。',
    keywords: ['Caching', 'Reinforcement Learning', 'Distributed Storage'],
    archDiagram: '/images/smartcache-arch.png',
    contributions: ['基于 RL 的缓存替换', '命中率提升 15%', '集成到 CacheLib'],
    pros: ['✓ 自适应学习', '✓ 效果显著', '✓ 开源可用'],
    cons: ['✗ 训练开销', '✗ 冷启动问题'],
  },
  {
    id: 'fast2024-nvme-of',
    title: 'NVMe-oF Performance Optimization in Data Center Networks',
    authors: ['Intel Labs'],
    year: 2024,
    session: 'Networked Storage',
    summary: 'Intel 深入研究数据中心环境下 NVMe over Fabrics 的性能优化，针对多租户、高并发场景提出了系统性解决方案。NVMe-oF 虽然延迟低，但在大规模数据中心部署时面临多个挑战：网络拥塞导致延迟尖刺、多路径配置复杂、故障恢复慢。论文提出了三项核心优化：智能多路径调度（根据网络延迟和负载动态选择路径）、ECN 拥塞控制（利用 RoCEv2 的 ECN 标记实现主动拥塞避免）、快速故障转移（检测到路径故障后 50ms 内切换）。实验环境模拟了 1000 个 NVMe-oF 连接的典型数据中心场景。结果显示：P99 延迟从 200μs 降低到 80μs，延迟抖动降低 70%，网络拥塞丢包率降低 90%。论文还提供了详细的部署指南和调优参数，对工程实践有直接指导价值。',
    keywords: ['NVMe-oF', 'RDMA', 'Data Center'],
    archDiagram: '/images/nvme-of-arch.png',
    contributions: ['多路径负载均衡', '拥塞控制优化', '延迟降低 30%'],
    pros: ['✓ 低延迟', '✓ 高可用', '✓ 标准支持'],
    cons: ['✗ 依赖 RoCE 网络', '✗ 部署成本高'],
  },
  {
    id: 'fast2024-rocksdb-cloud',
    title: 'RocksDB in the Cloud: Lessons from Large-Scale Deployments',
    authors: ['AWS Database Team'],
    year: 2024,
    session: 'KV Store',
    summary: 'Amazon Web Services 分享了在云环境运行 RocksDB 的独特经验和挑战。云环境与传统物理机环境有本质区别：存储是网络附加的（EBS）、CPU 是虚拟化的、内存可能被超卖。论文深入分析了这些问题对 RocksDB 的具体影响：网络存储导致写路径延迟增加、Compaction 更容易受干扰、SSTable 放置策略需要重新考虑。提出了云优化的最佳实践：使用 Provisioned IOPS EBS 保证带宽、调整 Compaction 并发度适应 CPU 抢占、利用 EBS 快照加速备份恢复、分离 WAL 和数据到不同卷。特别介绍了 DynamoDB on RocksDB 的架构：如何使用 RocksDB 作为底层存储引擎，实现全球分布式数据库。分享了性能调优的具体参数配置和监控指标，可直接应用到生产环境。',
    keywords: ['RocksDB', 'Cloud', 'Production'],
    archDiagram: '/images/rocksdb-cloud-arch.png',
    contributions: ['云环境优化经验', '性能调优实践', '运维最佳实践'],
    pros: ['✓ 实践经验丰富', '✓ 可借鉴性强', '✓ 生产验证'],
    cons: ['✗ AWS 特定优化', '✗ 需要深入理解'],
  },
  {
    id: 'fast2024-quantum-safe',
    title: 'Quantum-Safe Encryption for Long-Term Storage',
    authors: ['Security Research Team'],
    year: 2024,
    session: 'Storage Security',
    summary: '面向量子计算时代的前瞻性研究，提出了适用于长期存储的抗量子加密方案。量子计算机的 Shor 算法可在多项式时间内破解 RSA 和 ECC，威胁当前所有公钥加密系统。虽然大规模量子计算机尚未出现，但需要长期保存的数据（如医疗记录、法律文档）必须现在就考虑未来 20-30 年的安全性。论文分析了 NIST 后量子密码学标准化的候选算法：基于格（Lattice-based）的 Kyber、Dilithium；基于编码（Code-based）的 Classic McEliece；基于哈希（Hash-based）的 SPHINCS+。提出了针对存储场景的优化方案：混合加密（传统算法+抗量子算法并行）、分层密钥管理（数据密钥用对称加密、密钥密钥用抗量子算法）、性能权衡（选择 CPU 开销<20% 的算法）。实验对比了各算法的加密性能和密钥尺寸，为存储系统迁移到抗量子加密提供了完整路线图。',
    keywords: ['Encryption', 'Quantum-Safe', 'Security'],
    archDiagram: '/images/quantum-safe-arch.png',
    contributions: ['设计抗量子加密算法', '性能开销<20%', '向后兼容'],
    pros: ['✓ 面向未来', '✓ 安全性高', '✓ 开销可控'],
    cons: ['✗ 密钥尺寸大', '✗ 标准化未完成'],
  },
  {
    id: 'fast2024-serverless-storage',
    title: 'Serverless Storage: Architecture and Performance Trade-offs',
    authors: ['UC Berkeley'],
    year: 2024,
    session: 'Cloud Storage',
    summary: 'UC Berkeley RISELab 对无服务器（Serverless）计算场景下的存储架构进行了系统性研究。Serverless 计算具有按需启动、按使用计费、自动扩缩容的特点，但对存储系统提出了独特挑战：函数启动时间需要毫秒级、状态必须外部化、存储访问延迟直接影响冷启动性能。论文对比了多种存储架构：对象存储（S3）延迟高、文件系统（EFS）吞吐受限、内存数据库（Redis）成本高。提出了适合 Serverless 的存储设计原则：分离元数据和数据路径、预热机制减少冷启动、分层存储自动迁移。实验评估了 AWS Lambda 与不同存储后端组合的性能，发现存储延迟占函数执行时间的 30-50%。给出了针对不同工作负载（IO 密集、CPU 密集、网络密集）的存储选择指南，并预测了未来 Serverless 存储的发展方向。',
    keywords: ['Serverless', 'Cloud Storage', 'Architecture'],
    archDiagram: '/images/serverless-storage-arch.png',
    contributions: ['系统架构分析', '性能权衡研究', '设计指南'],
    pros: ['✓ 理论深入', '✓ 指导实践', '✓ 全面对比'],
    cons: ['✗ 实现复杂', '✗ 依赖云厂商'],
  },
  {
    id: 'fast2024-storage-class',
    title: 'Storage-Class Memory: From Optane to CXL',
    authors: ['Micron Technology'],
    year: 2024,
    session: 'Memory Systems',
    summary: 'Micron 技术团队对存储级内存（SCM）技术演进的全面回顾与展望。Intel Optane PMem 曾被视为 SCM 的代表产品，填补了 DRAM 和 NAND SSD 之间的性能空白，但于 2022 年停产。论文分析了 Optane 的技术特点和局限：读写不对称（写延迟高）、最大容量受限、需要特殊指令持久化、价格竞争力不足。展望了后 Optane 时代的 SCM 技术：CXL 协议带来的内存池化机遇、NAND 厂商开发的低成本持久内存方案、新型非易失性材料（MRAM、ReRAM、FeFET）的研究进展。特别介绍了 CXL 内存池化的架构优势：允许服务器共享大容量内存、支持热插拔和动态扩容、延迟仅比本地 DRAM 高 2-3 倍。给出了企业部署 SCM 的建议：数据分级策略、软件栈适配、成本效益分析。为存储架构师提供了技术选型指南。',
    keywords: ['SCM', 'CXL', 'Memory Pooling'],
    archDiagram: '/images/scm-cxl-arch.png',
    contributions: ['技术演进分析', 'CXL 内存池架构', '性能对比'],
    pros: ['✓ 技术前瞻', '✓ 产业视角', '✓ 实用参考'],
    cons: ['✗ Optane 停产', '✗ CXL 生态早期'],
  },
  {
    id: 'fast2024-data-reduction',
    title: 'Data Reduction Techniques: Compression vs Deduplication',
    authors: ['Data Reduction Team'],
    year: 2024,
    session: 'Data Reduction',
    summary: '深入对比压缩和去重两种数据缩减技术的适用场景和性能权衡，提出了最优的混合方案。数据缩减可显著降低存储成本，但不同技术的效果因数据类型而异。论文系统分析了：压缩（Compression）适用于可压缩数据（文本、日志、代码），减少 50-90%，但有 CPU 开销；去重（Deduplication）适用于有重复的数据（虚拟机镜像、备份），减少 30-80%，但有索引开销和隐私风险。提出了智能选择策略：对文本类数据优先压缩、对镜像类数据优先去重、对数据库采用压缩+去重组合。实验对比了多种算法：压缩（LZ4、ZSTD、Zlib）、去重（固定块、变长块、内容定义块）。给出了生产部署的最佳实践：分层去重（热数据不去重、冷数据去重）、并行压缩（利用多核 CPU）、增量处理（仅处理新数据）。对存储系统设计有直接指导意义。',
    keywords: ['Compression', 'Deduplication', 'Data Reduction'],
    archDiagram: '/images/data-reduction-arch.png',
    contributions: ['技术对比分析', '混合方案设计', '空间节省 70%'],
    pros: ['✓ 空间节省显著', '✓ 分析全面', '✓ 实践指导'],
    cons: ['✗ CPU 开销', '✗ 实现复杂'],
  },
  {
    id: 'fast2024-edge-storage',
    title: 'Edge Storage: Challenges and Solutions',
    authors: ['Edge Computing Lab'],
    year: 2024,
    session: 'Edge Computing',
    summary: '边缘计算场景下的存储系统设计指南，系统性地分析了边缘存储的独特挑战和解决方案。边缘节点具有资源受限（CPU、内存、存储容量小）、网络不稳定（间歇性断连、高延迟）、环境恶劣（温度变化、断电风险）等特点。论文提出了边缘存储的设计原则：轻量级架构（内存占用<512MB）、离线优先（支持断网工作）、数据分级（本地热数据、云端冷数据）、同步优化（增量同步、冲突解决）。介绍了三种典型边缘存储架构：边缘缓存（预取热点数据）、边缘数据库（轻量级 KV 存储）、边缘文件系统（POSIX 兼容）。实验评估了 Ceph、MinIO、EdgeX 在边缘场景的性能，发现传统存储系统不适合边缘。给出了针对物联网（IoT）、自动驾驶、视频监控等场景的具体设计方案，对边缘存储系统开发有重要参考价值。',
    keywords: ['Edge Storage', 'Distributed Systems', 'IoT'],
    archDiagram: '/images/edge-storage-arch.png',
    contributions: ['边缘场景分析', '系统设计指南', '优化方案'],
    pros: ['✓ 场景新颖', '✓ 实用性强', '✓ 指导设计'],
    cons: ['✗ 环境依赖', '✗ 网络不稳定'],
  },
  {
    id: 'fast2024-multitenant',
    title: 'Multi-Tenant Storage Isolation: Performance and Security',
    authors: ['Cloud Storage Team'],
    year: 2024,
    session: 'Cloud Storage',
    summary: '多租户云存储系统的隔离机制设计，在保证性能隔离的同时确保数据安全。公有云存储面临多租户干扰问题：一个租户的高负载可能影响其他租户的性能（Noisy Neighbor 问题），且存在数据泄露风险。论文提出了分层隔离策略：存储层隔离（物理盘或分区隔离）、IO 路径隔离（独立队列、带宽限制）、元数据隔离（命名空间分离）。关键技术包括：IO 调度器（支持权重、限速、优先级）、缓存分区（每个租户独立的缓存配额）、加密隔离（每租户独立密钥）。实验评估了不同隔离级别的性能开销：完全物理隔离性能最好但成本高、逻辑隔离成本低但有干扰。给出了最优配置建议：对性能敏感租户使用物理隔离、对成本敏感租户使用逻辑隔离、混合部署时采用动态调整。已在阿里云 OSS 等系统中应用。',
    keywords: ['Multi-Tenant', 'Isolation', 'QoS'],
    archDiagram: '/images/multitenant-arch.png',
    contributions: ['隔离机制设计', 'QoS 保障', '安全增强'],
    pros: ['✓ 租户隔离好', '✓ 性能保障', '✓ 安全性高'],
    cons: ['✗ 实现复杂', '✗ 资源开销'],
  },
  {
    id: 'fast2024-checkpoint',
    title: 'Efficient Checkpointing for Large-Scale ML Training',
    authors: ['ML Systems Lab'],
    year: 2024,
    session: 'ML Storage',
    summary: '针对大规模机器学习训练的检查点优化方案，解决了模型参数快速增长的挑战。现代大模型（如 GPT-4、PaLM）参数量达数千亿，传统检查点需要分钟级时间，严重降低训练效率。论文提出了增量检查点技术：仅保存变化的参数、利用模型参数的稀疏性、压缩梯度信息。设计了异步写入流水线：GPU 计算与检查点写入并行、利用 NVMe SSD 的高带宽、多级缓存减少 IO 等待。实验显示，对于 1750 亿参数的模型，检查点时间从 3 分钟降低到 30 秒，恢复时间降低 80%，训练吞吐仅损失 3%。还介绍了检查点压缩、分布式检查点（模型分片到多节点）、快速增量恢复等技术。对大模型训练的工程实践有直接价值，已集成到 Megatron-LM、DeepSpeed 等框架中。',
    keywords: ['Checkpoint', 'ML Training', 'Fault Tolerance'],
    archDiagram: '/images/checkpoint-arch.png',
    contributions: ['增量检查点', '异步写入', '恢复时间降低 80%'],
    pros: ['✓ 恢复快', '✓ 开销低', '✓ 支持大模型'],
    cons: ['✗ 存储占用', '✗ 实现复杂'],
  },
  {
    id: 'fast2024-video-storage',
    title: 'Video Storage Optimization for Streaming Services',
    authors: ['Streaming Media Team'],
    year: 2024,
    session: 'Multimedia Storage',
    summary: '视频流媒体平台的存储优化方案，应对海量视频数据的存储和分发挑战。视频流量占互联网带宽的 80% 以上，存储成本和分发效率是核心竞争力。论文提出了分层视频存储架构：热视频（最近上传、高频访问）存 SSD、温视频（中等访问）存 HDD、冷视频（长尾内容）存对象存储。关键技术包括：自适应码率（ABR）存储优化（不同清晰度使用不同介质）、视频转码缓存（在边缘节点预转码）、智能预取（根据用户行为预测预加载）。实验显示，存储成本降低 40%，CDN 带宽节省 30%，首屏加载时间缩短 50%。还讨论了视频元数据索引、版权保护（DRM）、内容审核等辅助系统的存储优化。对 YouTube、Netflix、抖音等视频平台的存储架构设计有重要参考价值。',
    keywords: ['Video Storage', 'Streaming', 'CDN'],
    archDiagram: '/images/video-storage-arch.png',
    contributions: ['分层存储设计', '转码优化', '带宽节省 40%'],
    pros: ['✓ 带宽优化', '✓ 用户体验好', '✓ 成本降低'],
    cons: ['✗ 存储占用大', '✗ CDN 依赖'],
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
  // 新增 FAST 2023 论文
  {
    id: 'fast2023-wisckey',
    title: 'WiscKey: Separating Keys from Values in LSM-Tree',
    authors: ['Lanyue Lu', 'Andrea C. Arpaci-Dusseau', 'Remzi H. Arpaci-Dusseau'],
    year: 2023,
    session: 'KV Store',
    summary: '经典的 WiscKey 论文，键值分离存储的开创性工作。',
    keywords: ['WiscKey', 'KV Separation', 'LSM-Tree', 'RocksDB'],
    archDiagram: '/images/wisckey-arch.png',
    contributions: ['提出键值分离架构', '降低写放大', '读性能优化'],
    pros: ['✓ 写放大低', '✓ 设计简洁', '✓ 影响深远'],
    cons: ['✗ 读路径变长', '✗ GC 复杂', '✗ 事务支持有限'],
  },
  {
    id: 'fast2023-leiden',
    title: 'LeidenFS: Distributed File System for High-Performance Computing',
    authors: ['HPC Storage Team'],
    year: 2023,
    session: 'Distributed File Systems',
    summary: '面向高性能计算的分布式文件系统设计。',
    keywords: ['HPC', 'Distributed FS', 'Parallel IO'],
    archDiagram: '/images/leidenfs-arch.png',
    contributions: ['并行 IO 优化', '大规模扩展', 'POSIX 兼容'],
    pros: ['✓ 高吞吐', '✓ 扩展性好', '✓ POSIX 兼容'],
    cons: ['✗ 部署复杂', '✗ 成本高', '✗ 小文件性能差'],
  },
  {
    id: 'fast2023-cedar',
    title: 'Cedar: A Key-Value Store for High-Performance Storage',
    authors: ['Database Lab'],
    year: 2023,
    session: 'KV Store',
    summary: '高性能 KV 存储引擎设计，优化写放大和读延迟。',
    keywords: ['KV Store', 'LSM-Tree', 'Performance'],
    archDiagram: '/images/cedar-arch.png',
    contributions: ['写优化设计', '读延迟优化', '空间效率提升'],
    pros: ['✓ 写性能好', '✓ 读延迟低', '✓ 空间效率高'],
    cons: ['✗ 实现复杂', '✗ 调优参数多'],
  },
  {
    id: 'fast2023-taplo',
    title: 'Taplo: Efficient Log-Structured Storage on ZNS SSDs',
    authors: ['Storage Systems Lab'],
    year: 2023,
    session: 'ZNS',
    summary: 'ZNS SSD 上的高效日志结构存储系统。',
    keywords: ['ZNS', 'Log-Structured', 'SSD'],
    archDiagram: '/images/taplo-arch.png',
    contributions: ['ZNS 感知设计', '日志结构优化', '写放大降低'],
    pros: ['✓ 写放大低', '✓ 性能稳定', '✓ 寿命长'],
    cons: ['✗ 需要 ZNS 硬件', '✗ 随机读弱'],
  },
  {
    id: 'fast2023-memcached',
    title: 'Revisiting Memcached in the Era of NVM',
    authors: ['Systems Research Group'],
    year: 2023,
    session: 'Caching',
    summary: 'NVM 时代重新审视 Memcached 缓存系统设计。',
    keywords: ['Memcached', 'NVM', 'Caching'],
    archDiagram: '/images/memcached-nvm-arch.png',
    contributions: ['NVM 集成', '持久化缓存', '性能分析'],
    pros: ['✓ 持久化', '✓ 低延迟', '✓ 大容量'],
    cons: ['✗ NVM 成本高', '✗ 生态不成熟'],
  },
  {
    id: 'fast2023-vega',
    title: 'Vega: A Distributed Object Storage System',
    authors: ['Cloud Storage Lab'],
    year: 2023,
    session: 'Object Storage',
    summary: '分布式对象存储系统设计，支持 EB 级扩展。',
    keywords: ['Object Storage', 'Distributed', 'Scalability'],
    archDiagram: '/images/vega-arch.png',
    contributions: ['EB 级扩展', '多租户支持', '元数据优化'],
    pros: ['✓ 扩展性好', '✓ 多租户', '✓ 元数据高效'],
    cons: ['✗ 复杂度高', '✗ 延迟敏感'],
  },
  {
    id: 'fast2023-aurora',
    title: 'Aurora: Cloud-Native Database Storage Architecture',
    authors: ['Database Systems Team'],
    year: 2023,
    session: 'Database Storage',
    summary: '云原生数据库存储架构，计算存储分离设计。',
    keywords: ['Cloud-Native', 'Database', 'Storage'],
    archDiagram: '/images/aurora-arch.png',
    contributions: ['存算分离', '日志即数据库', '快速故障恢复'],
    pros: ['✓ 弹性扩展', '✓ 高可用', '✓ 快速恢复'],
    cons: ['✗ 网络依赖', '✗ 成本高'],
  },
  {
    id: 'fast2023-stripe',
    title: 'Stripe: Erasure Coding for Efficient Cloud Storage',
    authors: ['Cloud Infrastructure Team'],
    year: 2023,
    session: 'Data Protection',
    summary: '云存储纠删码优化方案，提升存储效率。',
    keywords: ['Erasure Coding', 'Cloud Storage', 'Efficiency'],
    archDiagram: '/images/stripe-ec-arch.png',
    contributions: ['EC 优化', '存储效率提升', '修复加速'],
    pros: ['✓ 存储效率高', '✓ 可靠性强', '✓ 修复快'],
    cons: ['✗ 计算开销', '✗ 实现复杂'],
  },
  {
    id: 'fast2023-bluestone',
    title: 'BlueStone: Next-Generation Ceph Storage Backend',
    authors: ['Ceph Community'],
    year: 2023,
    session: 'Distributed Storage',
    summary: 'Ceph 下一代存储后端 BlueStone 设计。',
    keywords: ['Ceph', 'BlueStore', 'Distributed Storage'],
    archDiagram: '/images/bluestone-arch.png',
    contributions: ['BlueStore 优化', 'RocksDB 集成', '性能提升'],
    pros: ['✓ 开源', '✓ 功能丰富', '✓ 扩展性好'],
    cons: ['✗ 复杂度高', '✗ 调优难'],
  },
  {
    id: 'fast2023-log-structured',
    title: 'Revisiting Log-Structured Storage in 2023',
    authors: ['Storage Research Lab'],
    year: 2023,
    session: 'Storage Systems',
    summary: '2023 年重新审视日志结构存储设计的优势与挑战。',
    keywords: ['Log-Structured', 'Storage', 'Survey'],
    archDiagram: '/images/log-structured-arch.png',
    contributions: ['全面 survey', '设计空间分析', '未来方向'],
    pros: ['✓ 全面深入', '✓ 指导实践', '✓ 前瞻性强'],
    cons: ['✗ 实现细节少', '✗ 偏理论'],
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
  // 新增 FAST 2022 论文
  {
    id: 'fast2022-titan',
    title: 'Titan: A Distributed Key-Value Store with BlobDB',
    authors: ['Facebook Database Team'],
    year: 2022,
    session: 'KV Store',
    summary: 'Facebook 的 Titan 分布式 KV 存储，基于 BlobDB 实现大值优化。',
    keywords: ['Titan', 'BlobDB', 'Distributed KV'],
    archDiagram: '/images/titan-arch.png',
    contributions: ['分布式架构', 'BlobDB 集成', '大值优化'],
    pros: ['✓ 大值友好', '✓ 分布式', '✓ 生产验证'],
    cons: ['✗ 复杂度高', '✗ 运维成本'],
  },
  {
    id: 'fast2022-myrocks',
    title: 'MyRocks: MySQL with RocksDB Storage Engine',
    authors: ['Facebook Database Team'],
    year: 2022,
    session: 'Database',
    summary: 'MyRocks：使用 RocksDB 作为存储引擎的 MySQL，显著提升性能。',
    keywords: ['MyRocks', 'MySQL', 'RocksDB'],
    archDiagram: '/images/myrocks-arch.png',
    contributions: ['MySQL+RocksDB 集成', '事务优化', '空间效率提升'],
    pros: ['✓ 空间节省', '✓ 写性能好', '✓ MySQL 兼容'],
    cons: ['✗ 读性能略降', '✗ 调优复杂'],
  },
  {
    id: 'fast2022-tikv',
    title: 'TiKV: A Distributed Transactional Key-Value Database',
    authors: ['PingCAP Team'],
    year: 2022,
    session: 'Distributed KV',
    summary: 'TiKV：开源分布式事务 KV 数据库，RocksDB 深度优化。',
    keywords: ['TiKV', 'Distributed', 'Transaction', 'RocksDB'],
    archDiagram: '/images/tikv-arch.png',
    contributions: ['分布式事务', 'Raft 共识', 'RocksDB 优化'],
    pros: ['✓ 强一致性', '✓ 水平扩展', '✓ 开源生态'],
    cons: ['✗ 部署复杂', '✗ 延迟敏感'],
  },
  {
    id: 'fast2022-cockroachdb',
    title: 'CockroachDB: The Resilient Geo-Distributed Database',
    authors: ['Cockroach Labs'],
    year: 2022,
    session: 'Distributed Database',
    summary: 'CockroachDB：地理分布式强一致性数据库。',
    keywords: ['CockroachDB', 'Distributed', 'Geo-Replication'],
    archDiagram: '/images/cockroachdb-arch.png',
    contributions: ['地理分布', '强一致性', 'SQL 支持'],
    pros: ['✓ 全球分布', '✓ 强一致', '✓ SQL 完整'],
    cons: ['✗ 延迟高', '✗ 成本高'],
  },
  {
    id: 'fast2022-pebble',
    title: 'Pebble: A LevelDB/RocksDB Clone in Go',
    authors: ['Cockroach Labs'],
    year: 2022,
    session: 'KV Store',
    summary: 'Pebble：Go 语言实现的 LevelDB/RocksDB 兼容存储引擎。',
    keywords: ['Pebble', 'Go', 'LSM-Tree'],
    archDiagram: '/images/pebble-arch.png',
    contributions: ['Go 实现', 'RocksDB 兼容', '性能优化'],
    pros: ['✓ Go 生态', '✓ 兼容性好', '✓ 性能优秀'],
    cons: ['✗ 功能较少', '✗ 生态年轻'],
  },
  {
    id: 'fast2022-fio',
    title: 'FIO: Flexible I/O Tester for Storage Benchmarking',
    authors: ['Jens Axboe'],
    year: 2022,
    session: 'Benchmarking',
    summary: 'FIO：广泛使用的存储性能测试工具。',
    keywords: ['FIO', 'Benchmark', 'Storage Testing'],
    archDiagram: '/images/fio-arch.png',
    contributions: ['灵活配置', '多引擎支持', '详细统计'],
    pros: ['✓ 功能强大', '✓ 灵活配置', '✓ 开源'],
    cons: ['✗ 学习曲线', '✗ 配置复杂'],
  },
  {
    id: 'fast2022-spdk',
    title: 'SPDK: Storage Performance Development Kit',
    authors: ['Intel'],
    year: 2022,
    session: 'Storage Framework',
    summary: 'SPDK：高性能存储开发工具包，用户态 NVMe 驱动。',
    keywords: ['SPDK', 'NVMe', 'User-Space'],
    archDiagram: '/images/spdk-arch.png',
    contributions: ['用户态驱动', '轮询模式', '零拷贝'],
    pros: ['✓ 性能极高', '✓ 延迟低', '✓ CPU 亲和'],
    cons: ['✗ CPU 占用高', '✗ 开发复杂'],
  },
  {
    id: 'fast2022-dmcache',
    title: 'DM-Cache: Device-Mapper Cache for Linux',
    authors: ['Red Hat'],
    year: 2022,
    session: 'Caching',
    summary: 'Linux 设备映射器缓存，块级缓存解决方案。',
    keywords: ['DM-Cache', 'Linux', 'Block Cache'],
    archDiagram: '/images/dmcache-arch.png',
    contributions: ['块级缓存', '内核集成', '灵活配置'],
    pros: ['✓ 内核支持', '✓ 透明缓存', '✓ 配置灵活'],
    cons: ['✗ 配置复杂', '✗ 调试困难'],
  },
  {
    id: 'fast2022-bcache',
    title: 'Bcache: Block Cache in Linux Kernel',
    authors: ['Kent Overstreet'],
    year: 2022,
    session: 'Caching',
    summary: 'Bcache：Linux 内核块缓存，SSD 加速 HDD。',
    keywords: ['Bcache', 'Linux', 'SSD Cache'],
    archDiagram: '/images/bcache-arch.png',
    contributions: ['SSD 缓存 HDD', '写入回写', '内核集成'],
    pros: ['✓ 成本低', '✓ 容量大', '✓ 内核支持'],
    cons: ['✗ 配置复杂', '✗ 故障恢复难'],
  },
  {
    id: 'fast2022-glusterfs',
    title: 'GlusterFS: Scalable Network Attached Storage',
    authors: ['Red Hat'],
    year: 2022,
    session: 'Distributed FS',
    summary: 'GlusterFS：可扩展的网络附加存储系统。',
    keywords: ['GlusterFS', 'Distributed FS', 'NAS'],
    archDiagram: '/images/glusterfs-arch.png',
    contributions: ['弹性哈希', '无元数据', '水平扩展'],
    pros: ['✓ 扩展性好', '✓ 无单点', '✓ 简单'],
    cons: ['✗ 小文件差', '✗ 元数据性能弱'],
  },
  {
    id: 'fast2022-cephfs',
    title: 'CephFS: A Scalable Distributed File System',
    authors: ['Ceph Community'],
    year: 2022,
    session: 'Distributed FS',
    summary: 'CephFS：Ceph 分布式文件系统，POSIX 兼容。',
    keywords: ['CephFS', 'Distributed FS', 'POSIX'],
    archDiagram: '/images/cephfs-arch.png',
    contributions: ['动态子树', '元数据集群', 'POSIX 兼容'],
    pros: ['✓ 扩展性好', '✓ POSIX 兼容', '✓ 高可用'],
    cons: ['✗ 复杂度高', '✗ 调优难'],
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