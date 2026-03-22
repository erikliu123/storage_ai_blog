import { ExternalLink, Calendar, MapPin, BookOpen, Award, Image, ThumbsUp, ThumbsDown, Zap } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useState } from 'react'
import { sigmod2025Papers, sigmod2025Sessions, type PaperData } from '@/data/sigmod2025'

// Paper Card Component
function PaperCard({ paper, idx }: { paper: PaperData; idx: number }) {
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

            <p className="text-xs text-muted-foreground leading-relaxed mb-3">
              {paper.summary}
            </p>

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
            <button
              onClick={() => setExpanded(!expanded)}
              className="mt-3 text-xs text-primary hover:underline flex items-center gap-1"
            >
              {expanded ? '收起详情' : '查看详情（核心贡献 + 优缺点）'}
              <span className={cn('transition-transform', expanded && 'rotate-180')}>▼</span>
            </button>
          </div>
        </div>
      </div>

      {/* Expanded content */}
      {expanded && (
        <div className="border-t border-border bg-surface/50 p-5 animate-fade-in">
          {/* Contributions */}
          <div className="mb-4">
            <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2 flex items-center gap-1.5">
              <Zap className="w-3.5 h-3.5 text-primary" />
              核心贡献
            </h4>
            <ul className="space-y-1.5">
              {paper.contributions.map((c, i) => (
                <li key={i} className="flex items-start gap-2 text-xs text-foreground/80">
                  <span className="text-primary mt-0.5">•</span>
                  {c}
                </li>
              ))}
            </ul>
          </div>

          {/* Pros & Cons */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
            <div>
              <h4 className="text-xs font-semibold text-green-400 uppercase tracking-wide mb-2 flex items-center gap-1.5">
                <ThumbsUp className="w-3.5 h-3.5" />
                优点
              </h4>
              <ul className="space-y-1">
                {paper.pros.map((p, i) => (
                  <li key={i} className="flex items-start gap-2 text-xs text-foreground/80">
                    <span className="text-green-400 mt-0.5">+</span>
                    {p}
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="text-xs font-semibold text-orange-400 uppercase tracking-wide mb-2 flex items-center gap-1.5">
                <ThumbsDown className="w-3.5 h-3.5" />
                局限性
              </h4>
              <ul className="space-y-1">
                {paper.cons.map((c, i) => (
                  <li key={i} className="flex items-start gap-2 text-xs text-foreground/80">
                    <span className="text-orange-400 mt-0.5">-</span>
                    {c}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Architecture diagram */}
          {paper.archDiagram && (
            <div>
              <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2">系统架构图</h4>
              <div className="rounded-lg overflow-hidden border border-primary/30 ring-2 ring-primary/10">
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

export default function Sigmod2025() {
  const highlightCount = sigmod2025Papers.filter(p => p.highlight).length
  const diagramCount = sigmod2025Papers.filter(p => p.archDiagram).length

  return (
    <main className="max-w-5xl mx-auto px-6 py-10 animate-fade-in">
      {/* Header */}
      <div className="mb-10">
        <div className="flex items-center gap-2 mb-3">
          <Award className="w-4 h-4 text-primary" />
          <span className="mono-label text-xs uppercase tracking-widest">Conference Track</span>
        </div>
        <h1 className="text-2xl font-bold mb-2 gradient-text">SIGMOD 2025 论文解读专栏</h1>
        <p className="text-sm text-muted-foreground mb-4">
          International Conference on Management of Data — 数据管理顶级会议
        </p>

        {/* Conference info */}
        <div className="flex flex-wrap items-center gap-4 text-xs text-muted-foreground">
          <span className="flex items-center gap-1.5">
            <Calendar className="w-3.5 h-3.5" />
            2025 年 6 月
          </span>
          <span className="flex items-center gap-1.5">
            <MapPin className="w-3.5 h-3.5" />
            Berlin, Germany
          </span>
          <span className="flex items-center gap-1.5">
            <BookOpen className="w-3.5 h-3.5" />
            {sigmod2025Papers.length} 篇论文
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
          { label: 'Database', count: sigmod2025Papers.filter(p => p.session === 'Database Systems').length, color: 'var(--tag-storage)' },
          { label: 'Query Processing', count: sigmod2025Papers.filter(p => p.session === 'Query Processing').length, color: 'var(--tag-ai)' },
          { label: 'Data Management', count: sigmod2025Papers.filter(p => p.session === 'Data Management').length, color: 'var(--tag-ssd)' },
          { label: 'Distributed', count: sigmod2025Papers.filter(p => p.session === 'Distributed Systems').length, color: 'var(--muted-foreground)' },
        ].map(stat => (
          <div key={stat.label} className="card-paper rounded-xl p-4 text-center">
            <div className="text-2xl font-bold mb-1" style={{ color: `hsl(${stat.color})` }}>{stat.count}</div>
            <div className="text-xs text-muted-foreground font-mono">{stat.label}</div>
          </div>
        ))}
      </div>

      {/* Papers by session */}
      {sigmod2025Sessions.map(session => {
        const sessionPapers = sigmod2025Papers.filter(p => p.session === session)
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
          href="https://dblp.uni-trier.de/db/conf/sigmod/sigmod2025.html"
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
