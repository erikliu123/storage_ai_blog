import { ExternalLink, Calendar, Users, BookOpen, Lightbulb, Target, BarChart3, Code, ThumbsUp, ThumbsDown, Zap, ArrowLeft } from 'lucide-react'
import { Link } from 'react-router-dom'

export default function RaskDeepDive() {
  return (
    <main className="max-w-4xl mx-auto px-6 py-10 animate-fade-in">
      {/* Back */}
      <Link to="/" className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground mb-8 group transition-colors">
        <ArrowLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
        返回论文列表
      </Link>

      {/* Header */}
      <div className="mb-10">
        <div className="flex items-center gap-2 mb-3">
          <span className="tag-ai rounded-full px-3 py-1 text-xs font-mono">FAST 2026</span>
          <span className="tag-storage rounded-full px-3 py-1 text-xs font-mono">SJTU IPAPS</span>
          <span className="tag-ssd rounded-full px-3 py-1 text-xs font-mono">深度解读</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold mb-3 gradient-text leading-tight">
          "Range as a Key" is the Key!
        </h1>
        <h2 className="text-lg text-muted-foreground mb-4">
          Fast and Compact Cloud Block Store Index with RASK
        </h2>
        <div className="flex flex-wrap items-center gap-4 text-xs text-muted-foreground">
          <span className="flex items-center gap-1.5"><Calendar className="w-3.5 h-3.5" />FAST 2026</span>
          <span className="flex items-center gap-1.5"><Users className="w-3.5 h-3.5" />Haoru Zhao, Mingkai Dong, Erci Xu, Zhongyu Wang, Haibo Chen</span>
          <span className="flex items-center gap-1.5"><BookOpen className="w-3.5 h-3.5" />上交 IPAPS</span>
        </div>
      </div>

      {/* TL;DR */}
      <div className="card-paper rounded-xl p-6 mb-8 border-l-4 border-l-primary">
        <h3 className="text-sm font-semibold text-primary mb-2 flex items-center gap-2">
          <Zap className="w-4 h-4" />
          一句话总结
        </h3>
        <p className="text-sm text-foreground/90 leading-relaxed">
          RASK 提出了「<strong>Range as a Key</strong>」的创新索引抽象，将连续的块地址范围作为索引键，相比传统 KV 索引<strong>空间占用降低 80%</strong>，<strong>范围查询延迟降低 50%</strong>。
        </p>
      </div>

      {/* 架构图 */}
      <div className="mb-10">
        <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-3">核心架构对比</h3>
        <div className="rounded-xl overflow-hidden border border-primary/30 ring-2 ring-primary/10">
          <img src="/images/rask-arch.png" alt="RASK 架构图" className="w-full" />
        </div>
        <p className="text-xs text-muted-foreground mt-2 text-center font-mono">
          图：传统 KV 索引 vs RASK Range Key 索引对比
        </p>
      </div>

      {/* 问题背景 */}
      <section className="mb-10">
        <h3 className="flex items-center gap-2 text-lg font-semibold mb-4">
          <Target className="w-5 h-5 text-primary" />
          问题背景：云块存储索引的困境
        </h3>
        <div className="space-y-4 text-sm text-foreground/85 leading-relaxed">
          <p>
            云块存储系统（如 AWS EBS、阿里云云盘）需要维护海量块地址到物理位置的映射索引。传统方案采用<strong>Key-Value 索引</strong>，每个块地址作为独立 Key：
          </p>
          <div className="bg-surface rounded-lg p-4 font-mono text-xs border border-border">
            <div className="text-muted-foreground mb-2">// 传统 KV 索引</div>
            <div>Key: block_addr_0 → Value: physical_location_A</div>
            <div>Key: block_addr_1 → Value: physical_location_B</div>
            <div>Key: block_addr_2 → Value: physical_location_C</div>
            <div>Key: block_addr_3 → Value: physical_location_D</div>
            <div className="text-orange-400 mt-2">// 问题：连续 4 个块，需要 4 个索引项</div>
          </div>
          <p>
            这种方式存在<strong>两大问题</strong>：
          </p>
          <ul className="list-disc list-inside space-y-2 ml-4">
            <li><strong>空间浪费</strong>：连续分配的块各自存储索引项，元数据膨胀严重</li>
            <li><strong>范围查询慢</strong>：查询一个范围需要多次点查，延迟累积</li>
          </ul>
        </div>
      </section>

      {/* 核心创新 */}
      <section className="mb-10">
        <h3 className="flex items-center gap-2 text-lg font-semibold mb-4">
          <Lightbulb className="w-5 h-5 text-yellow-400" />
          核心创新：Range as a Key
        </h3>
        <div className="space-y-4 text-sm text-foreground/85 leading-relaxed">
          <p>
            RASK 的核心洞察是：云块存储中<strong>连续分配是常态</strong>。与其为每个块地址创建索引项，不如将<strong>连续范围作为单一索引键</strong>：
          </p>
          <div className="bg-surface rounded-lg p-4 font-mono text-xs border border-border">
            <div className="text-muted-foreground mb-2">// RASK Range Key 索引</div>
            <div>Key: [block_addr_0, block_addr_3] → Value: physical_location_A</div>
            <div className="text-green-400 mt-2">// 一个索引项覆盖 4 个连续块！</div>
          </div>
          <p>
            这看似简单，但实现上需要解决<strong>三个技术挑战</strong>：
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {[
              { title: '范围合并', desc: '如何高效合并相邻范围？' },
              { title: '范围分裂', desc: '写入中间地址如何处理？' },
              { title: '并发控制', desc: '高并发下如何保证一致性？' },
            ].map((item, i) => (
              <div key={i} className="card-paper rounded-lg p-4">
                <div className="text-xs font-semibold text-primary mb-1">{i + 1}. {item.title}</div>
                <div className="text-xs text-muted-foreground">{item.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 技术方案 */}
      <section className="mb-10">
        <h3 className="flex items-center gap-2 text-lg font-semibold mb-4">
          <Code className="w-5 h-5 text-green-400" />
          技术方案详解
        </h3>
        <div className="space-y-6">
          {/* 方案1 */}
          <div className="card-paper rounded-xl p-5">
            <h4 className="text-sm font-semibold text-foreground mb-3">1. Range Tree 数据结构</h4>
            <p className="text-xs text-foreground/80 leading-relaxed mb-3">
              RASK 设计了专用的 Range Tree 结构，节点存储 [start, end] 范围而非单一 Key。采用 B+ 树变体，支持高效的范围合并和分裂操作。
            </p>
            <div className="bg-surface rounded-lg p-3 font-mono text-xs border border-border">
              <div className="text-muted-foreground">// Range Tree 节点结构</div>
              <div>struct RangeNode {'{'}</div>
              <div className="ml-4">RangeKey key;    // [start_addr, end_addr]</div>
              <div className="ml-4">Location value;  // physical_location</div>
              <div className="ml-4">RangeNode *left, *right;</div>
              <div>{'}'}</div>
            </div>
          </div>

          {/* 方案2 */}
          <div className="card-paper rounded-xl p-5">
            <h4 className="text-sm font-semibold text-foreground mb-3">2. 智能范围合并策略</h4>
            <p className="text-xs text-foreground/80 leading-relaxed mb-3">
              当新写入扩展了已有范围时，RASK 自动合并相邻索引项。合并条件基于空间局部性启发式算法，避免过度合并带来的更新开销。
            </p>
            <div className="flex items-center gap-4 text-xs">
              <div className="flex-1 bg-surface rounded-lg p-3 border border-border">
                <div className="text-muted-foreground mb-1">合并前</div>
                <div className="text-orange-400">[0,10] [11,20] [21,30]</div>
              </div>
              <span className="text-primary">→</span>
              <div className="flex-1 bg-surface rounded-lg p-3 border border-border">
                <div className="text-muted-foreground mb-1">合并后</div>
                <div className="text-green-400">[0,30]</div>
              </div>
            </div>
          </div>

          {/* 方案3 */}
          <div className="card-paper rounded-xl p-5">
            <h4 className="text-sm font-semibold text-foreground mb-3">3. 无锁并发索引</h4>
            <p className="text-xs text-foreground/80 leading-relaxed">
              采用 Copy-on-Write + RCU 机制实现无锁读路径，写操作通过乐观锁保证原子性。读延迟 P99 降低 50%，并发吞吐提升 3x。
            </p>
          </div>
        </div>
      </section>

      {/* 实验结果 */}
      <section className="mb-10">
        <h3 className="flex items-center gap-2 text-lg font-semibold mb-4">
          <BarChart3 className="w-5 h-5 text-blue-400" />
          实验结果
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {[
            { metric: '80%', label: '索引空间占用降低', detail: '相比传统 KV 索引' },
            { metric: '50%', label: '范围查询延迟降低', detail: 'P99 延迟优化' },
            { metric: '3x', label: '并发吞吐提升', detail: '高并发场景' },
            { metric: '10M', label: '索引项数量减少', detail: '从 50M → 40M' },
          ].map((item, i) => (
            <div key={i} className="card-paper rounded-xl p-5 text-center">
              <div className="text-3xl font-bold text-primary mb-1">{item.metric}</div>
              <div className="text-sm font-semibold text-foreground mb-1">{item.label}</div>
              <div className="text-xs text-muted-foreground">{item.detail}</div>
            </div>
          ))}
        </div>
      </section>

      {/* 优缺点 */}
      <section className="mb-10">
        <h3 className="text-lg font-semibold mb-4">优缺点分析</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="card-paper rounded-xl p-5">
            <h4 className="text-sm font-semibold text-green-400 mb-3 flex items-center gap-2">
              <ThumbsUp className="w-4 h-4" />优点
            </h4>
            <ul className="space-y-2 text-xs text-foreground/80">
              <li className="flex items-start gap-2"><span className="text-green-400">+</span>索引空间占用大幅降低（80%）</li>
              <li className="flex items-start gap-2"><span className="text-green-400">+</span>范围查询性能优秀</li>
              <li className="flex items-start gap-2"><span className="text-green-400">+</span>创新性的索引抽象，学术价值高</li>
              <li className="flex items-start gap-2"><span className="text-green-400">+</span>适合云块存储连续分配场景</li>
            </ul>
          </div>
          <div className="card-paper rounded-xl p-5">
            <h4 className="text-sm font-semibold text-orange-400 mb-3 flex items-center gap-2">
              <ThumbsDown className="w-4 h-4" />局限性
            </h4>
            <ul className="space-y-2 text-xs text-foreground/80">
              <li className="flex items-start gap-2"><span className="text-orange-400">-</span>点查询性能可能略逊于传统索引</li>
              <li className="flex items-start gap-2"><span className="text-orange-400">-</span>实现复杂度较高</li>
              <li className="flex items-start gap-2"><span className="text-orange-400">-</span>随机写入场景优势不明显</li>
              <li className="flex items-start gap-2"><span className="text-orange-400">-</span>需要适配现有存储系统</li>
            </ul>
          </div>
        </div>
      </section>

      {/* 适用场景 */}
      <section className="mb-10">
        <h3 className="text-lg font-semibold mb-4">适用场景</h3>
        <div className="flex flex-wrap gap-2">
          {[
            '云块存储系统', '分布式文件系统', '对象存储元数据', '日志结构存储', 'LSM-tree Compaction', '快照与备份系统'
          ].map(tag => (
            <span key={tag} className="px-3 py-1.5 rounded-lg text-xs font-mono bg-primary/10 text-primary border border-primary/20">
              {tag}
            </span>
          ))}
        </div>
      </section>

      {/* 相关论文 */}
      <section className="mb-10">
        <h3 className="text-lg font-semibold mb-4">相关论文</h3>
        <div className="space-y-2 text-xs">
          <div className="card-paper rounded-lg p-3 flex items-center justify-between">
            <span>WiscKey: Separating Keys from Values</span>
            <span className="tag-ai rounded px-2 py-0.5">FAST'16</span>
          </div>
          <div className="card-paper rounded-lg p-3 flex items-center justify-between">
            <span>LSM-tree: The Log-Structured Merge-Tree</span>
            <span className="tag-storage rounded px-2 py-0.5">经典</span>
          </div>
          <div className="card-paper rounded-lg p-3 flex items-center justify-between">
            <span>BetrFS: A Right-Optimized Write-Optimized File System</span>
            <span className="tag-ai rounded px-2 py-0.5">FAST'15</span>
          </div>
        </div>
      </section>

      {/* Footer */}
      <div className="border-t border-border pt-6 flex items-center justify-between">
        <div className="text-xs text-muted-foreground font-mono">
          论文来源：FAST 2026 · 上交 IPAPS
        </div>
        <a
          href="https://arxiv.org/html/2601.14129v1"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 text-xs text-primary hover:underline"
        >
          <ExternalLink className="w-3 h-3" />
          阅读原文
        </a>
      </div>
    </main>
  )
}