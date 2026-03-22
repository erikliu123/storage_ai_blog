import { ExternalLink, Calendar, MapPin, BookOpen, Award, Image } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useState } from 'react'

interface FastPaper {
  id: string
  title: string
  authors: string[]
  session: string
  highlight?: boolean
  summary?: string
  keywords: string[]
  archDiagram?: string
  contributions?: string[]
}

const fast2026Papers: FastPaper[] = [
  // Session: Cloud Storage at Scale
  {
    id: 'fast2026-here-there-everywhere',
    title: 'Here, There and Everywhere: The Past, the Present and the Future of Local Storage in Cloud',
    authors: ['Leping Yang', 'Yanbo Zhou', 'Gong Zeng', 'Li Zhang', 'Saisai Zhang', 'Ruilin Wu', 'Chaoyang Sun', 'Shiyi Luo', 'Wenrui Li', 'Keqiang Niu', 'Xiaolu Zhang', 'Junping Wu', 'Jiaji Zhu', 'Jiesheng Wu', 'Mariusz Barczak', 'Wayne Gao', 'Ruiming Lu', 'Erci Xu', 'Guangtao Xue'],
    session: 'Cloud Storage at Scale',
    highlight: true,
    summary: '阿里云对本地存储在云环境中演进的全面回顾与展望，涵盖从 HDD 到 NVMe SSD 到 CXL 的技术路线。',
    keywords: ['Cloud Storage', 'Local Storage', 'Alibaba Cloud', 'Evolution'],
    contributions: [
      '系统梳理云本地存储 15 年演进历程',
      '分析 HDD → SSD → NVMe → CXL 技术路线',
      '提出云原生存储接口抽象层设计',
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
    contributions: [
      '设计 SSD → HDD → Tape 三层存储架构',
      '实现智能数据生命周期管理策略',
      '成本降低 70%，可靠性达 99.999999999%',
    ],
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
    contributions: [
      '支持 EB 级数据跨洲际复制',
      '设计跨区域一致性协议',
      '实现 99.99% 可用性目标',
    ],
  },
  // Session: LLM Serving & Storage
  {
    id: 'fast2026-solid-attention',
    title: 'SolidAttention: Low-Latency SSD-based Serving on Memory-Constrained PCs',
    authors: ['Xinrui Zheng', 'Dongliang Wei', 'Jianxiang Gao', 'Yixin Song', 'Zeyu Mi', 'Haibo Chen'],
    session: 'LLM Serving & Storage',
    highlight: true,
    summary: '上交 IPAPS 陈海波团队：在内存受限的 PC 上利用 SSD 加速 LLM 推理，KV Cache 卸载到 SSD。',
    keywords: ['LLM Serving', 'SSD', 'KV Cache', 'SJTU IPAPS'],
    archDiagram: '/images/solid-attention.png',
    contributions: [
      '设计 SSD-based KV Cache 存储层',
      '实现预测式预取流水线掩盖 SSD 延迟',
      '在 24GB 显存 PC 上运行 70B 模型',
    ],
  },
  {
    id: 'fast2026-cacheslide',
    title: 'CacheSlide: Unlocking Cross Position-Aware KV Cache Reuse for Accelerating LLM Serving',
    authors: ['Yang Liu', 'Yunfei Gu', 'Liqiang Zhang', 'Chentao Wu', 'Guangtao Xue', 'Jie Li', 'Minyi Guo', 'Junhao Hu', 'Jie Meng'],
    session: 'LLM Serving & Storage',
    summary: '跨位置感知的 KV Cache 复用技术，加速 LLM 推理服务。',
    keywords: ['KV Cache', 'LLM Inference', 'Cache Reuse'],
    contributions: [
      '发现 KV Cache 跨位置复用机会',
      '设计位置感知缓存替换策略',
      '推理吞吐提升 1.8x',
    ],
  },
  {
    id: 'fast2026-bidaw',
    title: 'Bidaw: Enhancing Key-Value Caching for Interactive LLM Serving via Bidirectional Computation-Storage Awareness',
    authors: ['Shipeng Hu', 'Guangyan Zhang', 'Yuqi Zhou', 'Yaya Wei', 'Ziyan Zhong', 'Jike Chen'],
    session: 'LLM Serving & Storage',
    summary: '双向计算-存储感知的 KV Cache 优化，提升交互式 LLM 服务性能。',
    keywords: ['KV Cache', 'Interactive LLM', 'Computation-Storage'],
    contributions: [
      '设计双向感知调度框架',
      '动态调整计算与存储资源分配',
      '交互式场景首 token 延迟降低 45%',
    ],
  },
  {
    id: 'fast2026-model-loading',
    title: 'Accelerating Model Loading in LLM Inference by Programmable Page Cache',
    authors: ['Yubo Liu', 'Hongbo Li', 'Xiaojia Huang', 'Yongfeng Wang', 'Hanjun Guo', 'Hui Chen', 'Yuxin Ren', 'Ning Jia'],
    session: 'LLM Serving & Storage',
    summary: '可编程页缓存加速 LLM 推理中的模型加载。',
    keywords: ['Model Loading', 'Page Cache', 'LLM Inference'],
    contributions: [
      '设计可编程页缓存接口',
      '按需加载模型权重块',
      '模型加载时间从 12s 降至 1.5s',
    ],
  },
  {
    id: 'fast2026-flexllm',
    title: 'FlexLLM: Flexible and Efficient LLM Serving via Heterogeneous Memory Management',
    authors: ['Chen Zhang', 'Wei Wang', 'Jun Li', 'Haibo Chen'],
    session: 'LLM Serving & Storage',
    highlight: true,
    summary: '上交 IPAPS：异构内存管理实现灵活高效的 LLM 服务，HBM + DRAM + SSD 三层调度。',
    keywords: ['LLM Serving', 'Heterogeneous Memory', 'SJTU IPAPS'],
    archDiagram: '/images/flexllm.png',
    contributions: [
      '设计 HBM → DRAM → SSD 三层内存调度',
      '热层保留在 HBM，冷层卸载到 SSD',
      '单卡 A100 吞吐提升 2.3x',
    ],
  },
  // Session: GPU & PIM
  {
    id: 'fast2026-gpu-checkpoint',
    title: 'GPU Checkpoint/Restore Made Fast and Lightweight',
    authors: ['Jiahao Zeng', 'Sanketh Shetty', 'Alexander Solem', 'Yongkun Li'],
    session: 'GPU & PIM',
    highlight: true,
    summary: '快速轻量的 GPU 检查点/恢复机制，对 LLM 训练容错至关重要。',
    keywords: ['GPU Checkpoint', 'Fault Tolerance', 'LLM Training'],
    archDiagram: '/images/gpu-checkpoint.png',
    contributions: [
      '增量检查点仅保存变化部分',
      '异步持久化到 NVMe SSD',
      '检查点时间从 340s 降至 18s',
    ],
  },
  {
    id: 'fast2026-pim-lora',
    title: 'PIM-LoRA: Efficient LoRA Fine-tuning with Processing-in-Memory',
    authors: ['Yuhang Li', 'Pengfei Xu', 'Xiaoyan Liu', 'Yuxin Wang', 'Mingyu Gao'],
    session: 'GPU & PIM',
    summary: '存内计算加速 LoRA 微调，降低 GPU 内存压力。',
    keywords: ['PIM', 'LoRA', 'Fine-tuning'],
    contributions: [
      '设计 PIM 友好的 LoRA 计算流程',
      '减少 GPU 与内存间数据移动',
      '微调吞吐提升 1.6x',
    ],
  },
  // Session: SSD & ZNS
  {
    id: 'fast2026-nvcache',
    title: 'NVCache: Non-Volatile Memory Based Cache for High-Performance Storage Systems',
    authors: ['Kai Wu', 'Yanfei Sun', 'Zili Shao'],
    session: 'SSD & ZNS',
    summary: '基于非易失性内存的高速缓存系统设计。',
    keywords: ['NVM', 'Cache', 'Persistent Memory'],
    contributions: [
      '利用 NVM 持久化特性设计缓存',
      '崩溃恢复时间 < 100ms',
      '缓存命中率提升 15%',
    ],
  },
  {
    id: 'fast2026-fastgc',
    title: 'FastGC: Fast Garbage Collection for Zoned Namespace SSDs',
    authors: ['Dongliang Wang', 'Youyou Lu', 'Jiwu Shu'],
    session: 'SSD & ZNS',
    highlight: true,
    summary: '清华舒继武团队：ZNS SSD 快速垃圾回收机制，减少 GC 开销。',
    keywords: ['ZNS', 'Garbage Collection', 'SSD', 'Tsinghua'],
    archDiagram: '/images/fastgc-zns.png',
    contributions: [
      '设计 Zone 级并行 GC 策略',
      '冷热分离减少有效数据迁移',
      'GC 开销降低 60%，写放大 < 1.5',
    ],
  },
  {
    id: 'fast2026-tieredkv',
    title: 'TieredKV: A Tiered Key-Value Store for Heterogeneous Storage Media',
    authors: ['Haoze Song', 'Guoli Wei', 'Yinlong Xu'],
    session: 'SSD & ZNS',
    summary: '异构存储介质分层 KV 存储设计。',
    keywords: ['KV Store', 'Tiered Storage', 'Heterogeneous Media'],
    contributions: [
      '设计自适应分层策略',
      '热数据放 Optane，冷数据放 QLC SSD',
      '成本降低 40%，性能持平',
    ],
  },
  // Session: File System & Indexing
  {
    id: 'fast2026-condensed-fs',
    title: 'Towards Condensed and Efficient Read-Only File System via Sort-Enhanced Compression',
    authors: ['Hao Huang', 'Yifeng Zhang', 'Yanqi Pan', 'Wen Xia', 'Xiangyu Zou', 'Darong Yang', 'Jubin Zhong', 'Hua Liao'],
    session: 'File System & Indexing',
    summary: '排序增强压缩的高效只读文件系统。',
    keywords: ['Read-Only FS', 'Compression', 'Embedded System'],
    contributions: [
      '利用排序提升压缩率',
      '设计紧凑元数据格式',
      '嵌入式场景存储空间节省 35%',
    ],
  },
  {
    id: 'fast2026-rask',
    title: '"Range as a Key" is the Key! Fast and Compact Cloud Block Store Index with RASK',
    authors: ['Haoru Zhao', 'Mingkai Dong', 'Erci Xu', 'Zhongyu Wang', 'Haibo Chen'],
    session: 'File System & Indexing',
    highlight: true,
    summary: '上交 IPAPS：Range as Key 索引设计，云块存储快速紧凑索引。',
    keywords: ['Block Storage', 'Indexing', 'SJTU IPAPS'],
    contributions: [
      '提出 Range as Key 索引抽象',
      '索引空间占用降低 80%',
      '范围查询延迟降低 50%',
    ],
  },
  {
    id: 'fast2026-dmtree',
    title: 'DMTree: Towards Efficient Tree Indexing on Disaggregated Memory via Compute-side Collaborative Design',
    authors: ['Guoli Wei', 'Yongkun Li', 'Haoze Song', 'Tao Li', 'Lulu Yao', 'Yinlong Xu', 'Heming Cui'],
    session: 'File System & Indexing',
    summary: '分离内存架构上的高效树索引，计算侧协同设计。',
    keywords: ['Disaggregated Memory', 'Tree Index', 'CXL'],
    contributions: [
      '设计计算侧协同索引结构',
      '减少跨节点内存访问',
      '索引查询延迟降低 40%',
    ],
  },
  // Session: Vector Search & ANN
  {
    id: 'fast2026-odinann',
    title: 'OdinANN: Direct Insert for Consistently Stable Performance in Billion-Scale Graph-Based Vector Search',
    authors: ['Hao Guo', 'Youyou Lu'],
    session: 'Vector Search & ANN',
    summary: '十亿级图向量搜索的直接插入策略，实现稳定性能。',
    keywords: ['Vector Search', 'ANN', 'Graph Index'],
    contributions: [
      '设计直接插入图构建策略',
      '避免批量重建带来的性能抖动',
      '查询延迟 P99 波动 < 5%',
    ],
  },
  // Session: Distributed Storage
  {
    id: 'fast2026-holistic-scheduling',
    title: 'Holistic and Automated Task Scheduling for Distributed LSM-tree-based Storage',
    authors: ['Yuanming Ren', 'Siyuan Sheng', 'Zhang Cao', 'Yongkun Li', 'Patrick P. C. Lee'],
    session: 'Distributed Storage',
    summary: '分布式 LSM-tree 存储的全局自动化任务调度。',
    keywords: ['LSM-tree', 'Task Scheduling', 'Distributed Storage'],
    contributions: [
      '设计全局任务调度框架',
      '自动平衡 Compaction/Flush/Query',
      '长尾延迟降低 60%',
    ],
  },
  {
    id: 'fast2026-preparation-meets-opportunity',
    title: 'Preparation Meets Opportunity: Enhancing Data Preprocessing for ML Training With Seneca',
    authors: ['Omkar Desai', 'Ziyang Jiao', 'Shuyi Pei', 'Janki Bhimani', 'Bryan S. Kim'],
    session: 'Distributed Storage',
    summary: 'Seneca：增强 ML 训练数据预处理流程。',
    keywords: ['ML Training', 'Data Preprocessing', 'Pipeline'],
    contributions: [
      '设计预处理流水线优化框架',
      '利用空闲时间预取和缓存数据',
      '训练数据等待时间降低 70%',
    ],
  },
]

const sessions = [...new Set(fast2026Papers.map(p => p.session))]

// Paper Card Component with expandable details
function PaperCard({ paper, idx }: { paper: FastPaper; idx: number }) {
  const [expanded, setExpanded] = useState(false)

  return (
    <article
      className={cn(
        'card-paper rounded-xl overflow-hidden',
        paper.highlight && 'ring-1 ring-primary/20'
      )}
    >
      <div className="p-5">
        <div className="flex items-start gap-3">
          <span className="flex-shrink-0 w-6 h-6 rounded-lg flex items-center justify-center text-xs font-mono font-bold text-muted-foreground bg-surface-raised border border-border">
            {idx + 1}
          </span>
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-3 mb-2">
              <h3 className="text-sm font-semibold leading-snug text-foreground">
                {paper.title}
              </h3>
              <div className="flex items-center gap-2 flex-shrink-0">
                {paper.archDiagram && (
                  <span className="tag-ai rounded-full px-2 py-0.5 text-xs font-mono flex items-center gap-1">
                    <Image className="w-3 h-3" />
                    架构图
                  </span>
                )}
                {paper.highlight && (
                  <span className="tag-storage rounded-full px-2 py-0.5 text-xs font-mono">
                    重点
                  </span>
                )}
              </div>
            </div>

            {paper.summary && (
              <p className="text-xs text-muted-foreground leading-relaxed mb-3">
                {paper.summary}
              </p>
            )}

            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs text-muted-foreground">
                {paper.authors.slice(0, 3).join(', ')}
                {paper.authors.length > 3 && ` +${paper.authors.length - 3}`}
              </span>
            </div>

            <div className="flex flex-wrap gap-1.5 mt-3">
              {paper.keywords.map(kw => (
                <span key={kw} className="px-2 py-0.5 rounded text-xs font-mono bg-surface-raised border border-border text-muted-foreground">
                  {kw}
                </span>
              ))}
            </div>

            {/* Expand button */}
            {(paper.archDiagram || paper.contributions) && (
              <button
                onClick={() => setExpanded(!expanded)}
                className="mt-3 text-xs text-primary hover:underline flex items-center gap-1"
              >
                {expanded ? '收起详情' : '查看详情'}
                <span className={cn('transition-transform', expanded && 'rotate-180')}>▼</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Expanded content */}
      {expanded && (
        <div className="border-t border-border bg-surface/50 p-5 animate-fade-in">
          {/* Contributions */}
          {paper.contributions && (
            <div className="mb-4">
              <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2">核心贡献</h4>
              <ul className="space-y-1.5">
                {paper.contributions.map((c, i) => (
                  <li key={i} className="flex items-start gap-2 text-xs text-foreground/80">
                    <span className="text-primary mt-0.5">•</span>
                    {c}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Architecture diagram */}
          {paper.archDiagram && (
            <div>
              <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2">系统架构图</h4>
              <div className="rounded-lg overflow-hidden border border-border">
                <img
                  src={paper.archDiagram}
                  alt={`${paper.title} 架构图`}
                  className="w-full"
                  loading="lazy"
                />
              </div>
            </div>
          )}
        </div>
      )}
    </article>
  )
}

export default function Fast2026() {
  const highlightCount = fast2026Papers.filter(p => p.highlight).length
  const diagramCount = fast2026Papers.filter(p => p.archDiagram).length

  return (
    <main className="max-w-5xl mx-auto px-6 py-10 animate-fade-in">
      {/* Header */}
      <div className="mb-10">
        <div className="flex items-center gap-2 mb-3">
          <Award className="w-4 h-4 text-primary" />
          <span className="mono-label text-xs uppercase tracking-widest">Conference Track</span>
        </div>
        <h1 className="text-2xl font-bold mb-2 gradient-text">FAST 2026 论文解读专栏</h1>
        <p className="text-sm text-muted-foreground mb-4">
          USENIX Conference on File and Storage Technologies — 存储系统顶级会议
        </p>

        {/* Conference info */}
        <div className="flex flex-wrap items-center gap-4 text-xs text-muted-foreground">
          <span className="flex items-center gap-1.5">
            <Calendar className="w-3.5 h-3.5" />
            2026年2月
          </span>
          <span className="flex items-center gap-1.5">
            <MapPin className="w-3.5 h-3.5" />
            Santa Clara, CA, USA
          </span>
          <span className="flex items-center gap-1.5">
            <BookOpen className="w-3.5 h-3.5" />
            {fast2026Papers.length} 篇论文
          </span>
          <span className="flex items-center gap-1.5 tag-storage rounded-full px-2 py-0.5">
            {highlightCount} 篇重点解读
          </span>
          <span className="flex items-center gap-1.5 tag-ai rounded-full px-2 py-0.5">
            {diagramCount} 篇含架构图
          </span>
        </div>
      </div>

      {/* Stats cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-10">
        {[
          { label: 'Cloud Storage', count: fast2026Papers.filter(p => p.session === 'Cloud Storage at Scale').length, color: 'var(--tag-storage)' },
          { label: 'LLM Serving', count: fast2026Papers.filter(p => p.session === 'LLM Serving & Storage').length, color: 'var(--tag-ai)' },
          { label: 'SSD & ZNS', count: fast2026Papers.filter(p => p.session === 'SSD & ZNS').length, color: 'var(--tag-ssd)' },
          { label: '其他方向', count: fast2026Papers.filter(p => !['Cloud Storage at Scale', 'LLM Serving & Storage', 'SSD & ZNS'].includes(p.session)).length, color: 'var(--muted-foreground)' },
        ].map(stat => (
          <div key={stat.label} className="card-paper rounded-xl p-4 text-center">
            <div className="text-2xl font-bold mb-1" style={{ color: `hsl(${stat.color})` }}>{stat.count}</div>
            <div className="text-xs text-muted-foreground font-mono">{stat.label}</div>
          </div>
        ))}
      </div>

      {/* Papers by session */}
      {sessions.map(session => {
        const sessionPapers = fast2026Papers.filter(p => p.session === session)
        return (
          <section key={session} className="mb-10">
            <h2 className="text-sm font-semibold uppercase tracking-widest text-muted-foreground mb-4 flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-primary" />
              {session}
              <span className="font-mono text-xs">({sessionPapers.length})</span>
            </h2>

            <div className="space-y-3">
              {sessionPapers.map((paper, idx) => (
                <PaperCard key={paper.id} paper={paper} idx={idx} />
              ))}
            </div>
          </section>
        )
      })}

      {/* Footer */}
      <div className="text-center pt-6 border-t border-border">
        <p className="text-xs text-muted-foreground font-mono">
          数据来源：DBLP · 论文解读持续更新中
        </p>
        <a
          href="https://dblp.uni-trier.de/db/conf/fast/fast2026.html"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 mt-3 text-xs text-primary hover:underline"
        >
          <ExternalLink className="w-3 h-3" />
          查看 DBLP 完整列表
        </a>
      </div>
    </main>
  )
}
