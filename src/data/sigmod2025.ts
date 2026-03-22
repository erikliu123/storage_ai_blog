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

export const sigmod2025Papers: PaperData[] = [
  // Database Systems
  {
    id: 'sigmod2025-duckdb',
    title: 'DuckDB++: Extending an Embedded Analytical Database for Hybrid Workloads',
    authors: ['Mark Raasveldt', 'Hannes Mühleisen', 'Tom Ebergen'],
    session: 'Database Systems',
    highlight: true,
    summary: '嵌入式分析数据库 DuckDB 的扩展，支持混合事务和分析工作负载（HTAP）。',
    archDiagram: '/images/duckdbpp-arch.png',
    keywords: ['Embedded Database', 'HTAP', 'OLAP'],
    contributions: ['设计 HTAP 支持的存储引擎', '实现事务与查询并发执行', '分析性能提升 3x，事务延迟降低 50%'],
    pros: ['✓ 嵌入式部署简单', '✓ HTAP 性能优秀', '✓ 与 DuckDB 生态兼容'],
    cons: ['✗ 内存占用较高', '✗ 分布式支持有限'],
  },
  {
    id: 'sigmod2025-mlsql',
    title: 'ML-SQL: A Unified Language for Machine Learning and Data Management',
    authors: ['Data Management Team'],
    session: 'Database Systems',
    summary: '统一的机器学习与数据管理语言，在 SQL 中无缝集成 ML 操作。',
    archDiagram: '/images/mlsql-arch.png',
    keywords: ['SQL Extension', 'Machine Learning', 'Data Management'],
    contributions: ['设计 ML-SQL 语言扩展', '实现查询优化器集成 ML 操作', '端到端 ML 训练效率提升 5x'],
    pros: ['语言统一，开发效率高', '查询优化器自动优化 ML 操作', '与现有 SQL 生态兼容'],
    cons: ['学习曲线陡峭', '复杂 ML 模型表达有限'],
  },
  {
    id: 'sigmod2025-vectorjoin',
    title: 'VectorJoin: Efficient Vector Similarity Joins in Relational Databases',
    authors: ['Vector Search Team'],
    session: 'Database Systems',
    highlight: true,
    summary: '关系数据库中的高效向量相似性连接，支持大规模向量检索。',
    archDiagram: '/images/vectorjoin-arch.png',
    keywords: ['Vector Similarity', 'Join', 'Embedding Search'],
    contributions: ['设计向量连接算子', '实现索引与扫描混合策略', '连接性能提升 10x'],
    pros: ['向量检索性能高', '与关系数据无缝集成', '支持大规模向量'],
    cons: ['索引构建开销', '高维向量性能下降'],
  },
  // Query Processing
  {
    id: 'sigmod2025-adaptjoin',
    title: 'AdaptJoin: Adaptive Join Ordering with Learned Cost Models',
    authors: ['Query Optimization Team'],
    session: 'Query Processing',
    summary: '基于学习代价模型的自适应连接顺序优化，减少查询延迟。',
    archDiagram: '/images/adaptjoin-arch.png',
    keywords: ['Join Ordering', 'Query Optimization', 'Learned Cost Model'],
    contributions: ['设计学习型代价模型', '实现自适应连接顺序选择', '查询延迟降低 40%'],
    pros: ['代价估计准确', '自适应能力强', '查询性能稳定'],
    cons: ['模型训练需要数据', '极端场景可能次优'],
  },
  {
    id: 'sigmod2025-streamagg',
    title: 'StreamAgg: High-Throughput Aggregation over Streaming Data',
    authors: ['Stream Processing Team'],
    session: 'Query Processing',
    summary: '流数据上的高吞吐聚合处理，支持实时分析。',
    archDiagram: '/images/streamagg-arch.png',
    keywords: ['Stream Processing', 'Aggregation', 'Real-Time Analytics'],
    contributions: ['设计流式聚合框架', '实现增量聚合算法', '聚合吞吐提升 8x'],
    pros: ['吞吐极高', '延迟低', '支持复杂聚合'],
    cons: ['状态管理开销', '乱序处理复杂'],
  },
  {
    id: 'sigmod2025-approxquery',
    title: 'ApproxQuery: Interactive Analytics with Bounded Error Guarantees',
    authors: ['Approximate Query Team'],
    session: 'Query Processing',
    summary: '带误差保证的交互式分析，提供快速近似查询结果。',
    archDiagram: '/images/approxquery-arch.png',
    keywords: ['Approximate Query', 'Interactive Analytics', 'Error Guarantee'],
    contributions: ['设计近似查询框架', '实现误差界限控制', '查询速度提升 100x'],
    pros: ['交互速度快', '误差可控', '适合探索性分析'],
    cons: ['结果非精确', '某些场景误差较大'],
  },
  // Data Management
  {
    id: 'sigmod2025-lakehouse',
    title: 'LakeHouse-Optimizer: Automatic Data Layout Optimization for Data Lakes',
    authors: ['Data Lake Team'],
    session: 'Data Management',
    highlight: true,
    summary: '数据湖的自动数据布局优化，提升查询性能并降低存储成本。',
    archDiagram: '/images/lakehouse-arch.png',
    keywords: ['Data Lake', 'Data Layout', 'Query Optimization'],
    contributions: ['设计数据布局优化器', '实现自动分区与聚簇', '查询性能提升 5x，存储成本降低 30%'],
    pros: ['自动化程度高', '性能提升显著', '存储成本降低'],
    cons: ['优化需要时间', '频繁更新场景效果有限'],
  },
  {
    id: 'sigmod2025-multimodal',
    title: 'MultiModal-DB: Supporting Heterogeneous Data Types in a Single Database',
    authors: ['Multimodal Team'],
    session: 'Data Management',
    summary: '支持异构数据类型的单一数据库系统，统一管理结构化、文本和向量数据。',
    archDiagram: '/images/multimodal-arch.png',
    keywords: ['Multimodal Data', 'Heterogeneous', 'Unified Database'],
    contributions: ['设计多模态数据模型', '实现统一查询接口', '多模态查询效率提升 3x'],
    pros: ['数据类型丰富', '查询接口统一', '管理简化'],
    cons: ['系统复杂度高', '特定类型性能受限'],
  },
  {
    id: 'sigmod2025-timeseries',
    title: 'TimeSeries-Engine: A Specialized Storage Engine for Time-Series Data',
    authors: ['Time-Series Team'],
    session: 'Data Management',
    summary: '时序数据专用存储引擎，优化时间范围查询和聚合。',
    archDiagram: '/images/timeseries-arch.png',
    keywords: ['Time-Series', 'Storage Engine', 'Compression'],
    contributions: ['设计时序存储格式', '实现高效压缩算法', '存储空间减少 80%，查询提速 4x'],
    pros: ['压缩率高', '时序查询快', '适合 IoT 场景'],
    cons: ['仅适用于时序数据', '随机访问性能一般'],
  },
  // Distributed Systems
  {
    id: 'sigmod2025-disttxn',
    title: 'DistTxn: High-Performance Distributed Transactions with Optimistic Concurrency',
    authors: ['Distributed Systems Team'],
    session: 'Distributed Systems',
    highlight: true,
    summary: '基于乐观并发的高性能分布式事务系统，减少锁竞争。',
    archDiagram: '/images/disttxn-arch.png',
    keywords: ['Distributed Transaction', 'Optimistic Concurrency', 'Scalability'],
    contributions: ['设计乐观分布式事务协议', '实现冲突检测与回滚', '事务吞吐提升 5x'],
    pros: ['并发性能高', '锁竞争少', '扩展性好'],
    cons: ['冲突率高时性能下降', '需要回滚机制'],
  },
  {
    id: 'sigmod2025-consensus',
    title: 'FastConsensus: Low-Latency Consensus for Geo-Replicated Databases',
    authors: ['Consensus Team'],
    session: 'Distributed Systems',
    summary: '地理复制数据库的低延迟共识协议，优化跨区域延迟。',
    archDiagram: '/images/fastconsensus-arch.png',
    keywords: ['Consensus', 'Geo-Replication', 'Low Latency'],
    contributions: ['设计低延迟共识协议', '实现跨区域优化', '共识延迟降低 60%'],
    pros: ['跨地域延迟低', '容错能力强', '适合全球部署'],
    cons: ['网络依赖性强', '节点数增加时延迟上升'],
  },
]

export const sigmod2025Sessions = [...new Set(sigmod2025Papers.map(p => p.session))]
