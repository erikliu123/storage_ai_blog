import { Link } from 'react-router-dom'
import {
  ArrowLeft,
  Clock,
  Users,
  Building2,
  BookOpen,
  Target,
  Lightbulb,
  Cpu,
  BarChart3,
  CheckCircle,
  XCircle,
  ExternalLink,
  Zap,
  HardDrive,
  Trash2,
  RefreshCw,
} from 'lucide-react'

export default function DiscoGcDeepDive() {
  return (
    <main className="max-w-4xl mx-auto px-6 py-10 animate-fade-in">
      {/* Back link */}
      <Link
        to="/"
        className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground mb-6 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        返回首页
      </Link>

      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-3">
          <span className="tag-ai text-xs font-mono px-2 py-0.5 rounded">FAST 2026</span>
          <span className="tag-storage text-xs font-mono px-2 py-0.5 rounded">分布式存储</span>
          <span className="bg-purple-500/20 text-purple-400 text-xs font-mono px-2 py-0.5 rounded border border-purple-500/30">
            GC 优化
          </span>
        </div>

        <h1 className="text-2xl sm:text-3xl font-bold mb-3 gradient-text leading-tight">
          Discard-Based Garbage Collection
        </h1>
        <p className="text-lg text-muted-foreground mb-4">
          字节跳动分布式日志存储系统的成本优化实践
        </p>

        {/* Meta */}
        <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground mb-4">
          <span className="flex items-center gap-1.5">
            <Building2 className="w-4 h-4" />
            ByteDance & Tsinghua
          </span>
          <span className="flex items-center gap-1.5">
            <Clock className="w-4 h-4" />
            12 分钟深度阅读
          </span>
          <span className="flex items-center gap-1.5">
            <Users className="w-4 h-4" />
            边润华 等 21 位作者
          </span>
        </div>
      </div>

      {/* Architecture Diagram */}
      <div className="mb-8 rounded-xl overflow-hidden border border-border">
        <img
          src="/images/discogc-arch.png"
          alt="DisCoGC 架构图"
          className="w-full"
        />
      </div>

      {/* TL;DR */}
      <div className="card-paper rounded-xl p-5 mb-8 border-l-4 border-primary">
        <h2 className="flex items-center gap-2 text-sm font-semibold text-primary mb-3">
          <Zap className="w-4 h-4" />
          TL;DR 核心观点
        </h2>
        <ul className="space-y-2 text-sm text-foreground/80">
          <li className="flex items-start gap-2">
            <span className="text-primary">•</span>
            <span><strong>问题：</strong>传统 Compaction GC 在大规模分布式存储中导致 SSD 写放大和空间浪费，每月增加数百万美元 TCO</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-primary">•</span>
            <span><strong>方案：</strong>DisCoGC 结合 Discard 和 Compaction，通过丢弃陈旧数据空间而非移动有效数据来回收空间</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-primary">•</span>
            <span><strong>效果：</strong>TCO 降低约 20%，性能无损，已在字节跳动生产环境验证</span>
          </li>
        </ul>
      </div>

      {/* Problem Background */}
      <section className="mb-8">
        <h2 className="flex items-center gap-2 text-lg font-semibold mb-4">
          <Target className="w-5 h-5 text-orange-400" />
          问题背景
        </h2>

        <div className="space-y-4">
          <div className="card-paper rounded-xl p-4">
            <h3 className="text-sm font-semibold mb-2">ByteStore 存储架构</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              ByteStore 是字节跳动的分布式追加写（append-only）存储系统，作为公司基础设施的底层存储层。采用日志结构（Log-Structured）设计，所有写入都以追加方式完成，数据不可变。
            </p>
          </div>

          <div className="card-paper rounded-xl p-4 border-l-4 border-red-500">
            <h3 className="text-sm font-semibold mb-2 text-red-400">传统 GC 的痛点</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-3">
              <div className="p-3 rounded-lg bg-surface-raised border border-border">
                <div className="flex items-center gap-2 mb-1">
                  <HardDrive className="w-4 h-4 text-red-400" />
                  <span className="text-xs font-medium">写放大严重</span>
                </div>
                <p className="text-xs text-muted-foreground">
                  Compaction 需要移动有效数据，产生额外写入，加速 SSD 磨损
                </p>
              </div>
              <div className="p-3 rounded-lg bg-surface-raised border border-border">
                <div className="flex items-center gap-2 mb-1">
                  <Cpu className="w-4 h-4 text-orange-400" />
                  <span className="text-xs font-medium">空间浪费</span>
                </div>
                <p className="text-xs text-muted-foreground">
                  陈旧数据占用 SSD 空间，直到 Compaction 执行才释放
                </p>
              </div>
              <div className="p-3 rounded-lg bg-surface-raised border border-border">
                <div className="flex items-center gap-2 mb-1">
                  <RefreshCw className="w-4 h-4 text-yellow-400" />
                  <span className="text-xs font-medium">TCO 飙升</span>
                </div>
                <p className="text-xs text-muted-foreground">
                  每月额外增加数百万美元的总拥有成本
                </p>
              </div>
              <div className="p-3 rounded-lg bg-surface-raised border border-border">
                <div className="flex items-center gap-2 mb-1">
                  <BarChart3 className="w-4 h-4 text-purple-400" />
                  <span className="text-xs font-medium">权衡困境</span>
                </div>
                <p className="text-xs text-muted-foreground">
                  激进 Compaction 加剧 SSD 磨损，保守策略则空间利用率低
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Core Innovation */}
      <section className="mb-8">
        <h2 className="flex items-center gap-2 text-lg font-semibold mb-4">
          <Lightbulb className="w-5 h-5 text-yellow-400" />
          核心创新：DisCoGC
        </h2>

        <div className="space-y-4">
          <div className="card-paper rounded-xl p-5">
            <h3 className="text-sm font-semibold mb-3 flex items-center gap-2">
              <Trash2 className="w-4 h-4 text-green-400" />
              Discard 机制
            </h3>
            <p className="text-sm text-muted-foreground leading-relaxed mb-3">
              核心思想：<strong className="text-foreground">直接丢弃陈旧数据占用的空间，而不移动有效数据</strong>。
              利用 SSD 的 TRIM/Discard 指令通知存储设备特定 LBA 范围的数据已无效，设备可以在内部 GC 时忽略这些块。
            </p>
            <div className="bg-surface-raised rounded-lg p-3 border border-border">
              <p className="text-xs text-foreground/80">
                <span className="text-primary font-medium">与传统 Compaction 的区别：</span>
                Compaction 需要读取有效数据、写入新位置、更新索引；Discard 只需标记空间无效，零数据移动。
              </p>
            </div>
          </div>

          <div className="card-paper rounded-xl p-5">
            <h3 className="text-sm font-semibold mb-3">混合策略：Discard + Compaction</h3>
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <span className="flex-shrink-0 w-6 h-6 rounded-full bg-green-500/20 text-green-400 flex items-center justify-center text-xs font-bold">1</span>
                <div>
                  <p className="text-sm font-medium">Discard 优先</p>
                  <p className="text-xs text-muted-foreground">对低有效数据比例的段优先使用 Discard，快速回收空间</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <span className="flex-shrink-0 w-6 h-6 rounded-full bg-blue-500/20 text-blue-400 flex items-center justify-center text-xs font-bold">2</span>
                <div>
                  <p className="text-sm font-medium">Compaction 补充</p>
                  <p className="text-xs text-muted-foreground">对高有效数据比例的段使用传统 Compaction，保留有效数据</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <span className="flex-shrink-0 w-6 h-6 rounded-full bg-purple-500/20 text-purple-400 flex items-center justify-center text-xs font-bold">3</span>
                <div>
                  <p className="text-sm font-medium">动态决策</p>
                  <p className="text-xs text-muted-foreground">根据段的有效数据比例、访问热度、空间紧迫程度动态选择策略</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Technical Details */}
      <section className="mb-8">
        <h2 className="flex items-center gap-2 text-lg font-semibold mb-4">
          <Cpu className="w-5 h-5 text-blue-400" />
          技术细节
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="card-paper rounded-xl p-4">
            <h3 className="text-sm font-semibold mb-2 text-primary">段有效性追踪</h3>
            <p className="text-xs text-muted-foreground">
              维护每个段（Segment）的有效数据比例元数据。当数据被删除或更新时，更新对应段的有效性计数，为 GC 决策提供依据。
            </p>
          </div>
          <div className="card-paper rounded-xl p-4">
            <h3 className="text-sm font-semibold mb-2 text-primary">Discard 粒度管理</h3>
            <p className="text-xs text-muted-foreground">
              支持不同粒度的 Discard 操作：整段丢弃、部分范围丢弃。与 SSD 内部块大小对齐，最大化 TRIM 效率。
            </p>
          </div>
          <div className="card-paper rounded-xl p-4">
            <h3 className="text-sm font-semibold mb-2 text-primary">分布式协调</h3>
            <p className="text-xs text-muted-foreground">
              在分布式环境中协调各节点的 GC 活动，避免热点竞争。集中调度器基于全局视角分配 GC 任务。
            </p>
          </div>
          <div className="card-paper rounded-xl p-4">
            <h3 className="text-sm font-semibold mb-2 text-primary">一致性保证</h3>
            <p className="text-xs text-muted-foreground">
              Discard 操作与索引更新原子化，确保数据一致性。延迟 Discard 执行直到确认无并发访问。
            </p>
          </div>
        </div>
      </section>

      {/* Performance Results */}
      <section className="mb-8">
        <h2 className="flex items-center gap-2 text-lg font-semibold mb-4">
          <BarChart3 className="w-5 h-5 text-green-400" />
          实验结果
        </h2>

        <div className="card-paper rounded-xl p-5 mb-4">
          <h3 className="text-sm font-semibold mb-3">生产环境验证</h3>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="text-center p-3 rounded-lg bg-green-500/10 border border-green-500/20">
              <div className="text-xl font-bold text-green-400 mb-1">~20%</div>
              <div className="text-xs text-muted-foreground">TCO 降低</div>
            </div>
            <div className="text-center p-3 rounded-lg bg-blue-500/10 border border-blue-500/20">
              <div className="text-xl font-bold text-blue-400 mb-1">数百万</div>
              <div className="text-xs text-muted-foreground">美元/月 节省</div>
            </div>
            <div className="text-center p-3 rounded-lg bg-purple-500/10 border border-purple-500/20">
              <div className="text-xl font-bold text-purple-400 mb-1">无损</div>
              <div className="text-xs text-muted-foreground">性能影响</div>
            </div>
            <div className="text-center p-3 rounded-lg bg-yellow-500/10 border border-yellow-500/20">
              <div className="text-xl font-bold text-yellow-400 mb-1">生产</div>
              <div className="text-xs text-muted-foreground">集群验证</div>
            </div>
          </div>
        </div>

        <div className="card-paper rounded-xl p-4">
          <h3 className="text-sm font-semibold mb-2">关键指标改善</h3>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li className="flex items-start gap-2">
              <CheckCircle className="w-4 h-4 text-green-400 flex-shrink-0 mt-0.5" />
              <span><strong className="text-foreground">写放大降低：</strong>减少 Compaction 触发的有效数据移动</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle className="w-4 h-4 text-green-400 flex-shrink-0 mt-0.5" />
              <span><strong className="text-foreground">空间利用率提升：</strong>更快释放陈旧数据占用的空间</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle className="w-4 h-4 text-green-400 flex-shrink-0 mt-0.5" />
              <span><strong className="text-foreground">SSD 寿命延长：</strong>减少不必要的写入操作</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle className="w-4 h-4 text-green-400 flex-shrink-0 mt-0.5" />
              <span><strong className="text-foreground">延迟稳定：</strong>避免 Compaction 造成的 I/O 波动</span>
            </li>
          </ul>
        </div>
      </section>

      {/* Pros & Cons */}
      <section className="mb-8">
        <h2 className="flex items-center gap-2 text-lg font-semibold mb-4">
          优缺点分析
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="card-paper rounded-xl p-4">
            <h3 className="flex items-center gap-2 text-sm font-semibold text-green-400 mb-3">
              <CheckCircle className="w-4 h-4" />
              优势
            </h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li className="flex items-start gap-2">
                <span className="text-green-400">+</span>
                显著降低 TCO（~20%）
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-400">+</span>
                减少写放大，延长 SSD 寿命
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-400">+</span>
                空间回收更快
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-400">+</span>
                大规模生产验证
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-400">+</span>
                兼容现有架构
              </li>
            </ul>
          </div>
          <div className="card-paper rounded-xl p-4">
            <h3 className="flex items-center gap-2 text-sm font-semibold text-red-400 mb-3">
              <XCircle className="w-4 h-4" />
              局限
            </h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li className="flex items-start gap-2">
                <span className="text-red-400">-</span>
                依赖 SSD TRIM 支持和效率
              </li>
              <li className="flex items-start gap-2">
                <span className="text-red-400">-</span>
                需要准确的段有效性追踪
              </li>
              <li className="flex items-start gap-2">
                <span className="text-red-400">-</span>
                分布式协调增加复杂度
              </li>
              <li className="flex items-start gap-2">
                <span className="text-red-400">-</span>
                需要调优决策阈值
              </li>
              <li className="flex items-start gap-2">
                <span className="text-red-400">-</span>
                论文细节公开有限
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* Related Papers */}
      <section className="mb-8">
        <h2 className="flex items-center gap-2 text-lg font-semibold mb-4">
          <BookOpen className="w-5 h-5 text-purple-400" />
          相关论文
        </h2>

        <div className="space-y-2">
          {[
            { title: 'The Log-Structured Merge-Tree (LSM-Tree)', venue: 'Acta Inf. 1996', note: 'LSM 基础论文' },
            { title: 'WiscKey: Separating Keys from Values in SSD-Conscious Storage', venue: 'FAST 2016', note: 'KV 分离优化' },
            { title: 'SlashDB: A Managed Storage System for Log-Structured Key-Value Stores', venue: 'SC 2023', note: '日志存储管理' },
            { title: 'MatrixKV: Reducing Write Stalls and Write Amplification in LSM-Tree', venue: 'ATC 2020', note: 'LSM 写优化' },
          ].map((paper, i) => (
            <div key={i} className="card-paper rounded-lg p-3 flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-foreground">{paper.title}</p>
                <p className="text-xs text-muted-foreground">{paper.venue}</p>
              </div>
              <span className="text-xs text-primary bg-primary/10 px-2 py-0.5 rounded">{paper.note}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <div className="flex flex-wrap gap-3">
        <a
          href="https://www.usenix.org/conference/fast26/presentation/bian"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium bg-primary/10 text-primary border border-primary/20 hover:bg-primary/20 transition-colors"
        >
          <ExternalLink className="w-4 h-4" />
          USENIX 论文页面
        </a>
        <Link
          to="/"
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium bg-surface border border-border text-muted-foreground hover:text-foreground hover:border-primary/30 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          返回首页
        </Link>
      </div>
    </main>
  )
}