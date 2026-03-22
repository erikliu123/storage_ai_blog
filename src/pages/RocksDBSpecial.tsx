import { ExternalLink, BookOpen, ThumbsUp, ThumbsDown, Zap, GitBranch, Database } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useState } from 'react'

const rocksdbPapers = [
  {
    id: 'rocksdb-titan',
    title: 'Titan: A BlobDB Implementation for RocksDB',
    authors: ['Ping Xie', 'Yiwu Tang'],
    summary: 'RocksDB BlobDB 实现，将大 value 分离存储到独立文件，减少 compaction 放大。',
    keywords: ['BlobDB', 'Value Separation', 'Compaction'],
    archDiagram: '/images/titan-arch.png',
    modifications: ['实现 BlobDB 接口', 'Value 分离存储', '后台 GC 回收'],
    coreLogic: 'src/db/blobdb/',
    pros: ['✓ 减少写放大（30-50%）', '✓ 降低空间放大', '✓ 适合大 value 场景'],
    cons: ['✗ 读放大可能增加', '✗ GC 开销'],
  },
  {
    id: 'rocksdb-myrocks',
    title: 'MyRocks: LSM-Tree Database Storage Engine for MySQL',
    authors: ['Facebook Team'],
    summary: 'MySQL 存储引擎，基于 RocksDB 开发，支持事务和 MVCC。',
    keywords: ['MySQL', 'Transaction', 'MVCC'],
    archDiagram: '/images/myrocks-arch.png',
    modifications: ['MySQL Handler API', '事务锁管理', 'MVCC 实现'],
    coreLogic: 'mysql/sql/ha_rocksdb.cc',
    pros: ['✓ 空间效率高（50% vs InnoDB）', '✓ 写性能优异', '✓ 支持事务'],
    cons: ['✗ 读性能略低', '✗ 调优复杂'],
  },
  {
    id: 'rocksdb-tikv',
    title: 'TiKV: Distributed Transactional Key-Value Database',
    authors: ['PingCAP Team'],
    summary: '分布式 KV 存储，RocksDB 作为底层引擎，支持 Raft 和分布式事务。',
    keywords: ['Distributed KV', 'Raft', 'Percolator'],
    archDiagram: '/images/tikv-arch.png',
    modifications: ['Raft 日志存储', 'Percolator 事务', 'Coprocessor'],
    coreLogic: 'components/engine_rocks/',
    pros: ['✓ 分布式事务', '✓ 水平扩展', '✓ Raft 高可用'],
    cons: ['✗ 运维复杂度', '✗ 跨 Region 延迟'],
  },
  {
    id: 'rocksdb-cockroachdb',
    title: 'CockroachDB: A Geo-Distributed SQL Database',
    authors: ['Cockroach Labs'],
    summary: '分布式 SQL 数据库，使用 RocksDB（后切换 Pebble）作为存储引擎。',
    keywords: ['Distributed SQL', 'Multi-Model', 'Geo-Distributed'],
    archDiagram: '/images/cockroachdb-arch.png',
    modifications: ['MVCC 层', 'Raft 存储', 'SQL 执行器'],
    coreLogic: 'pkg/storage/rocksdb.go',
    pros: ['✓ 全球分布', '✓ SQL 兼容', '✓ 强一致'],
    cons: ['✗ 跨 Region 延迟', '✗ 资源消耗大'],
  },
  {
    id: 'rocksdb-leveldb',
    title: 'RocksDB vs LevelDB: Performance Comparison',
    authors: ['Facebook'],
    summary: 'RocksDB 基于 LevelDB 开发，针对 SSD 和多核优化，性能显著提升。',
    keywords: ['LSM-Tree', 'Performance', 'SSD Optimization'],
    archDiagram: '/images/rocksdb-sst-arch.png',
    modifications: ['多线程 Compaction', 'SSD 优化', 'Column Families'],
    coreLogic: 'src/compaction/',
    pros: ['✓ 写性能提升 3-5x', '✓ 多核扩展好', '✓ 高度可配置'],
    cons: ['✗ 参数调优复杂', '✗ 内存占用高'],
  },
  {
    id: 'rocksdb-pebble',
    title: 'Pebble: RocksDB Alternative in Go',
    authors: ['Cockroach Labs'],
    summary: 'Go 语言实现的 LSM-Tree 存储，兼容 RocksDB SST 格式，专为 MVCC 优化。',
    keywords: ['Go', 'MVCC-aware', 'RocksDB Compatible'],
    archDiagram: '/images/pebble-arch.png',
    modifications: ['Go 语言重写', 'MVCC 优化', 'Range Deletion'],
    coreLogic: 'pkg/internal/base/',
    pros: ['✓ 纯 Go 实现', '✓ MVCC 友好', '✓ Apache 2.0'],
    cons: ['✗ 社区较小', '✗ 文档较少'],
  },
]

export default function RocksDBSpecial() {
  return (
    <main className="max-w-6xl mx-auto px-6 py-10 animate-fade-in">
      {/* Header */}
      <div className="mb-10">
        <div className="flex items-center gap-2 mb-3">
          <Database className="w-4 h-4 text-primary" />
          <span className="mono-label text-xs uppercase tracking-widest">技术专题</span>
        </div>
        <h1 className="text-2xl font-bold mb-2 gradient-text">RocksDB 生态与论文解读</h1>
        <p className="text-sm text-muted-foreground mb-4">
          LSM-Tree 存储引擎的工业实践与学术创新
        </p>
      </div>

      {/* RocksDB intro */}
      <div className="card-paper rounded-xl p-6 mb-10 ring-1 ring-primary/20">
        <div className="flex items-start gap-4 mb-4">
          <div className="w-12 h-12 rounded-lg flex items-center justify-center bg-primary/10">
            <Database className="w-6 h-6 text-primary" />
          </div>
          <div>
            <h2 className="text-base font-bold mb-1">RocksDB 核心架构</h2>
            <p className="text-xs text-muted-foreground">Meta 开源的高性能嵌入式 KV 存储</p>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          <div>
            <h3 className="font-semibold mb-2 flex items-center gap-2">
              <Zap className="w-3.5 h-3.5 text-primary" />
              核心技术
            </h3>
            <ul className="space-y-1">
              <li className="flex items-start gap-2">
                <span className="text-primary mt-0.5">•</span>
                <span>LSM-Tree 架构（MemTable + SST）</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary mt-0.5">•</span>
                <span>Compaction 策略（Leveled/Tiered/FIFO）</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary mt-0.5">•</span>
                <span>Bloom Filter + 前缀压缩</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary mt-0.5">•</span>
                <span>Column Families 隔离</span>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold mb-2 flex items-center gap-2">
              <GitBranch className="w-3.5 h-3.5 text-primary" />
              生态项目
            </h3>
            <ul className="space-y-1">
              <li className="flex items-start gap-2">
                <span className="text-primary mt-0.5">•</span>
                <span>MyRocks（MySQL 引擎）</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary mt-0.5">•</span>
                <span>TiKV（分布式 KV）</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary mt-0.5">•</span>
                <span>CockroachDB（分布式 SQL）</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary mt-0.5">•</span>
                <span>Pebble（Go 实现）</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Papers based on RocksDB */}
      <section className="mb-10">
        <h2 className="text-sm font-semibold uppercase tracking-widest text-muted-foreground mb-4 flex items-center gap-2">
          <BookOpen className="w-4 h-4" />
          基于 RocksDB 的论文与系统
        </h2>
        <div className="space-y-4">
          {rocksdbPapers.map((paper, idx) => (
            <RocksDBPaperCard key={paper.id} paper={paper} idx={idx} />
          ))}
        </div>
      </section>

      {/* Modification patterns */}
      <section className="mb-10">
        <h2 className="text-sm font-semibold uppercase tracking-widest text-muted-foreground mb-4 flex items-center gap-2">
          <GitBranch className="w-4 h-4" />
          常见修改模式
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="card-paper rounded-xl p-4">
            <h3 className="text-xs font-bold mb-2 text-primary">1. 存储格式修改</h3>
            <ul className="text-xs space-y-1">
              <li className="flex items-start gap-2">
                <span className="text-muted-foreground">•</span>
                <span>BlobDB（大 value 分离）</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-muted-foreground">•</span>
                <span>压缩算法优化</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-muted-foreground">•</span>
                <span>SST 格式扩展</span>
              </li>
            </ul>
          </div>
          <div className="card-paper rounded-xl p-4">
            <h3 className="text-xs font-bold mb-2 text-primary">2. Compaction 优化</h3>
            <ul className="text-xs space-y-1">
              <li className="flex items-start gap-2">
                <span className="text-muted-foreground">•</span>
                <span>并行 Compaction</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-muted-foreground">•</span>
                <span>自适应 Compaction</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-muted-foreground">•</span>
                <span>Compaction 限流</span>
              </li>
            </ul>
          </div>
          <div className="card-paper rounded-xl p-4">
            <h3 className="text-xs font-bold mb-2 text-primary">3. 事务与 MVCC</h3>
            <ul className="text-xs space-y-1">
              <li className="flex items-start gap-2">
                <span className="text-muted-foreground">•</span>
                <span>两阶段提交</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-muted-foreground">•</span>
                <span>MVCC 版本控制</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-muted-foreground">•</span>
                <span>快照隔离</span>
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* Footer */}
      <div className="text-center pt-6 border-t border-border">
        <p className="text-xs text-muted-foreground font-mono mb-4">
          源码与文档
        </p>
        <div className="flex justify-center gap-4">
          <a
            href="https://github.com/facebook/rocksdb"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-xs text-primary hover:underline"
          >
            <ExternalLink className="w-3 h-3" />
            RocksDB 源码
          </a>
          <a
            href="https://github.com/facebook/rocksdb/wiki"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-xs text-primary hover:underline"
          >
            <ExternalLink className="w-3 h-3" />
            RocksDB Wiki
          </a>
          <a
            href="https://github.com/pingcap/tikv"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-xs text-primary hover:underline"
          >
            <ExternalLink className="w-3 h-3" />
            TiKV 源码
          </a>
        </div>
      </div>
    </main>
  )
}

function RocksDBPaperCard({ paper, idx }: { paper: any; idx: number }) {
  const [expanded, setExpanded] = useState(false)

  return (
    <article className="card-paper rounded-xl overflow-hidden">
      <div className="p-5">
        <div className="flex items-start gap-3">
          <span className="flex-shrink-0 w-6 h-6 rounded-lg flex items-center justify-center text-xs font-mono font-bold text-muted-foreground bg-surface-raised border border-border">
            {idx + 1}
          </span>
          <div className="flex-1 min-w-0">
            <h3 className="text-sm font-semibold leading-snug text-foreground mb-2">
              {paper.title}
            </h3>
            <p className="text-xs text-muted-foreground leading-relaxed mb-3">
              {paper.summary}
            </p>
            <div className="flex flex-wrap gap-1.5 mb-3">
              {paper.keywords.map((kw: string) => (
                <span key={kw} className="px-2 py-0.5 rounded text-xs font-mono bg-surface-raised border border-border text-muted-foreground">
                  {kw}
                </span>
              ))}
            </div>
            <button
              onClick={() => setExpanded(!expanded)}
              className="text-xs text-primary hover:underline flex items-center gap-1"
            >
              {expanded ? '收起详情' : '查看详情（修改点 + 核心逻辑）'}
              <span className={cn('transition-transform', expanded && 'rotate-180')}>▼</span>
            </button>
          </div>
        </div>
      </div>

      {expanded && (
        <div className="border-t border-border bg-surface/50 p-5 animate-fade-in">
          {/* Architecture diagram */}
          {paper.archDiagram && (
            <div className="mb-4">
              <h4 className="text-xs font-semibold text-muted-foreground mb-2">架构图</h4>
              <img src={paper.archDiagram} alt={paper.title} className="w-full rounded-lg border border-border" />
            </div>
          )}

          {/* Modifications */}
          <div className="mb-4">
            <h4 className="text-xs font-semibold text-primary mb-2 flex items-center gap-1.5">
              <GitBranch className="w-3.5 h-3.5" />
              核心修改点
            </h4>
            <ul className="space-y-1">
              {paper.modifications.map((m: string, i: number) => (
                <li key={i} className="text-xs text-foreground/80 flex items-start gap-2">
                  <span className="text-primary mt-0.5">•</span>
                  {m}
                </li>
              ))}
            </ul>
          </div>

          {/* Core logic location */}
          <div className="mb-4">
            <h4 className="text-xs font-semibold text-muted-foreground mb-2">核心代码位置</h4>
            <code className="text-xs font-mono bg-surface-raised px-2 py-1 rounded border border-border">
              {paper.coreLogic}
            </code>
          </div>

          {/* Pros & Cons */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <h4 className="text-xs font-semibold text-green-400 mb-2 flex items-center gap-1.5">
                <ThumbsUp className="w-3.5 h-3.5" />
                优点
              </h4>
              <ul className="space-y-1">
                {paper.pros.map((p: string, i: number) => (
                  <li key={i} className="text-xs text-foreground/80 flex items-start gap-2">
                    <span className="text-green-400 mt-0.5">+</span>
                    {p}
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="text-xs font-semibold text-orange-400 mb-2 flex items-center gap-1.5">
                <ThumbsDown className="w-3.5 h-3.5" />
                局限性
              </h4>
              <ul className="space-y-1">
                {paper.cons.map((c: string, i: number) => (
                  <li key={i} className="text-xs text-foreground/80 flex items-start gap-2">
                    <span className="text-orange-400 mt-0.5">-</span>
                    {c}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}
    </article>
  )
}
