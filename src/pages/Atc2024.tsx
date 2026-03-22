import { ExternalLink, Calendar, MapPin, BookOpen, Award, Image, ThumbsUp, ThumbsDown, Zap } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useState } from 'react'
import { atc2024Papers, atc2024Sessions, type PaperData } from '@/data/conferences'

function PaperCard({ paper, idx }: { paper: PaperData; idx: number }) {
  const [expanded, setExpanded] = useState(false)

  return (
    <article className={cn('card-paper rounded-xl overflow-hidden', paper.highlight && 'ring-1 ring-primary/20')}>
      <div className="p-5">
        <div className="flex items-start gap-3">
          <span className="flex-shrink-0 w-6 h-6 rounded-lg flex items-center justify-center text-xs font-mono font-bold text-muted-foreground bg-surface-raised border border-border">
            {idx + 1}
          </span>
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-3 mb-2">
              <h3 className="text-sm font-semibold leading-snug text-foreground">{paper.title}</h3>
              <div className="flex items-center gap-2 flex-shrink-0">
                {paper.archDiagram && (
                  <span className="tag-ai rounded-full px-2 py-0.5 text-xs font-mono flex items-center gap-1">
                    <Image className="w-3 h-3" />架构图
                  </span>
                )}
                {paper.highlight && (
                  <span className="tag-storage rounded-full px-2 py-0.5 text-xs font-mono">重点</span>
                )}
              </div>
            </div>
            <p className="text-xs text-muted-foreground leading-relaxed mb-3">{paper.summary}</p>
            <div className="text-xs text-muted-foreground mb-3">
              {paper.authors.slice(0, 3).join(', ')}{paper.authors.length > 3 && ` +${paper.authors.length - 3}`}
            </div>
            <div className="flex flex-wrap gap-1.5 mb-3">
              {paper.keywords.map(kw => (
                <span key={kw} className="px-2 py-0.5 rounded text-xs font-mono bg-surface-raised border border-border text-muted-foreground">{kw}</span>
              ))}
            </div>
            <button onClick={() => setExpanded(!expanded)} className="text-xs text-primary hover:underline flex items-center gap-1">
              {expanded ? '收起详情' : '查看详情（核心贡献 + 优缺点）'}
              <span className={cn('transition-transform', expanded && 'rotate-180')}>▼</span>
            </button>
          </div>
        </div>
      </div>
      {expanded && (
        <div className="border-t border-border bg-surface/50 p-5 animate-fade-in">
          <div className="mb-4">
            <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2 flex items-center gap-1.5">
              <Zap className="w-3.5 h-3.5 text-primary" />核心贡献
            </h4>
            <ul className="space-y-1.5">
              {paper.contributions.map((c, i) => (
                <li key={i} className="flex items-start gap-2 text-xs text-foreground/80">
                  <span className="text-primary mt-0.5">•</span>{c}
                </li>
              ))}
            </ul>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
            <div>
              <h4 className="text-xs font-semibold text-green-400 uppercase tracking-wide mb-2 flex items-center gap-1.5">
                <ThumbsUp className="w-3.5 h-3.5" />优点
              </h4>
              <ul className="space-y-1">
                {paper.pros.map((p, i) => (
                  <li key={i} className="flex items-start gap-2 text-xs text-foreground/80">
                    <span className="text-green-400 mt-0.5">+</span>{p}
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="text-xs font-semibold text-orange-400 uppercase tracking-wide mb-2 flex items-center gap-1.5">
                <ThumbsDown className="w-3.5 h-3.5" />局限性
              </h4>
              <ul className="space-y-1">
                {paper.cons.map((c, i) => (
                  <li key={i} className="flex items-start gap-2 text-xs text-foreground/80">
                    <span className="text-orange-400 mt-0.5">-</span>{c}
                  </li>
                ))}
              </ul>
            </div>
          </div>
          {paper.archDiagram && (
            <div>
              <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2">系统架构图</h4>
              <div className="rounded-lg overflow-hidden border border-primary/30 ring-2 ring-primary/10">
                <img src={paper.archDiagram} alt={`${paper.title} 架构图`} className="w-full" loading="lazy" />
              </div>
            </div>
          )}
        </div>
      )}
    </article>
  )
}

export default function Atc2024() {
  const highlightCount = atc2024Papers.filter(p => p.highlight).length

  return (
    <main className="max-w-5xl mx-auto px-6 py-10 animate-fade-in">
      <div className="mb-10">
        <div className="flex items-center gap-2 mb-3">
          <Award className="w-4 h-4 text-primary" />
          <span className="mono-label text-xs uppercase tracking-widest">Conference Track</span>
        </div>
        <h1 className="text-2xl font-bold mb-2 gradient-text">ATC 2024 论文解读专栏</h1>
        <p className="text-sm text-muted-foreground mb-4">
          USENIX Annual Technical Conference — 系统技术年度会议
        </p>
        <div className="flex flex-wrap items-center gap-4 text-xs text-muted-foreground">
          <span className="flex items-center gap-1.5"><Calendar className="w-3.5 h-3.5" />2024年7月</span>
          <span className="flex items-center gap-1.5"><MapPin className="w-3.5 h-3.5" />Santa Clara, USA</span>
          <span className="flex items-center gap-1.5"><BookOpen className="w-3.5 h-3.5" />{atc2024Papers.length} 篇精选论文</span>
          <span className="tag-storage rounded-full px-2 py-0.5">{highlightCount} 篇重点解读</span>
        </div>
      </div>

      {atc2024Sessions.map(session => {
        const sessionPapers = atc2024Papers.filter(p => p.session === session)
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

      <div className="text-center pt-6 border-t border-border">
        <p className="text-xs text-muted-foreground font-mono">数据来源：USENIX ATC 2024 · 论文解读持续更新中</p>
        <a href="https://www.usenix.org/conference/atc24" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 mt-3 text-xs text-primary hover:underline">
          <ExternalLink className="w-3 h-3" />查看 ATC 2024 官网
        </a>
      </div>
    </main>
  )
}