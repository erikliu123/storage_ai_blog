import { Calendar, MapPin, BookOpen, Image, Zap, Clock } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useState } from 'react'
import { fast2025Papers, fast2024Papers, fast2023Papers, fast2022Papers, type ArchivePaperData } from '@/data/fastArchive'

// Paper Card Component
function ArchivePaperCard({ paper, idx }: { paper: ArchivePaperData; idx: number }) {
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
              <span className="text-xs text-muted-foreground">·</span>
              <span className="text-xs text-primary font-mono">{paper.session}</span>
            </div>

            {/* Contributions */}
            {paper.contributions.length > 0 && (
              <div className="mt-3 pt-3 border-t border-border/50">
                <ul className="space-y-1">
                  {paper.contributions.slice(0, expanded ? undefined : 2).map((c, i) => (
                    <li key={i} className="text-xs text-muted-foreground flex items-start gap-2">
                      <Zap className="w-3 h-3 text-primary flex-shrink-0 mt-0.5" />
                      <span>{c}</span>
                    </li>
                  ))}
                </ul>
                {paper.contributions.length > 2 && (
                  <button
                    onClick={() => setExpanded(!expanded)}
                    className="text-xs text-primary hover:underline mt-2"
                  >
                    {expanded ? '收起' : `展开全部 ${paper.contributions.length} 条贡献`}
                  </button>
                )}
              </div>
            )}

            {/* Performance Data */}
            {paper.performanceData && paper.performanceData.length > 0 && (
              <div className="mt-3 pt-3 border-t border-border/50">
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {paper.performanceData.map((perf, i) => (
                    <div key={i} className="bg-surface-raised rounded-lg p-2 text-center">
                      <div className="text-sm font-bold text-primary">{perf.value}</div>
                      <div className="text-xs text-muted-foreground">{perf.metric}</div>
                      {perf.baseline && (
                        <div className="text-xs text-muted-foreground/70">基准: {perf.baseline}</div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Architecture Diagram */}
            {paper.archDiagram && expanded && (
              <div className="mt-3 pt-3 border-t border-border/50">
                <h4 className="text-xs font-semibold text-foreground mb-2">架构图</h4>
                {paper.archDiagram.startsWith('/') ? (
                  <img src={paper.archDiagram} alt="Architecture Diagram" className="w-full rounded-lg border border-border bg-surface-raised" />
                ) : (
                  <pre className="text-xs text-muted-foreground bg-surface-raised rounded-lg p-3 overflow-x-auto whitespace-pre font-mono leading-tight">{paper.archDiagram.trim()}</pre>
                )}
              </div>
            )}

            {/* Pros & Cons */}
            {expanded && (paper.pros.length > 0 || paper.cons.length > 0) && (
              <div className="mt-3 pt-3 border-t border-border/50 grid grid-cols-1 sm:grid-cols-2 gap-3">
                {paper.pros.length > 0 && (
                  <div>
                    <h4 className="text-xs font-semibold text-green-400 mb-1.5">优势</h4>
                    <ul className="space-y-1">
                      {paper.pros.map((p, i) => (
                        <li key={i} className="text-xs text-muted-foreground leading-relaxed">{p}</li>
                      ))}
                    </ul>
                  </div>
                )}
                {paper.cons.length > 0 && (
                  <div>
                    <h4 className="text-xs font-semibold text-red-400 mb-1.5">局限性</h4>
                    <ul className="space-y-1">
                      {paper.cons.map((c, i) => (
                        <li key={i} className="text-xs text-muted-foreground leading-relaxed">{c}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )}

            {/* Sections */}
            {paper.sections && paper.sections.length > 0 && expanded && (
              <div className="mt-3 pt-3 border-t border-border/50 space-y-3">
                {paper.sections.map((section, i) => (
                  <div key={i}>
                    <h4 className="text-xs font-semibold text-foreground mb-1">{section.title}</h4>
                    <p className="text-xs text-muted-foreground leading-relaxed whitespace-pre-line">{section.content}</p>
                  </div>
                ))}
              </div>
            )}

            {/* Keywords */}
            <div className="flex flex-wrap gap-1.5 mt-3">
              {paper.keywords.map(kw => (
                <span key={kw} className="text-xs px-2 py-0.5 rounded-full bg-surface-raised text-muted-foreground font-mono">
                  {kw}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </article>
  )
}

type YearTab = 2025 | 2024 | 2023 | 2022

const yearData = {
  2025: {
    papers: fast2025Papers,
    date: '2025年2月',
    location: 'Santa Clara, CA, USA',
  },
  2024: {
    papers: fast2024Papers,
    date: '2024年2月',
    location: 'Santa Clara, CA, USA',
  },
  2023: {
    papers: fast2023Papers,
    date: '2023年2月',
    location: 'Santa Clara, CA, USA',
  },
  2022: {
    papers: fast2022Papers,
    date: '2022年2月',
    location: 'Santa Clara, CA, USA',
  },
}

export default function FastArchive() {
  const [selectedYear, setSelectedYear] = useState<YearTab>(2025)
  const currentData = yearData[selectedYear]
  const highlightCount = currentData.papers.filter(p => p.highlight).length
  const diagramCount = currentData.papers.filter(p => p.archDiagram).length

  // Get unique sessions
  const sessions = [...new Set(currentData.papers.map(p => p.session))]

  return (
    <main className="min-h-screen py-10 px-4 md:px-6 lg:px-8 max-w-4xl mx-auto">
      {/* Header */}
      <div className="mb-10">
        <div className="flex items-center gap-2 mb-3">
          <Clock className="w-4 h-4 text-primary" />
          <span className="mono-label text-xs uppercase tracking-widest">Conference Archive</span>
        </div>
        <h1 className="text-2xl font-bold mb-2 gradient-text">FAST 历年论文解读</h1>
        <p className="text-sm text-muted-foreground mb-4">
          USENIX Conference on File and Storage Technologies — 存储系统顶级会议历年精选
        </p>
      </div>

      {/* Year Tabs */}
      <div className="flex gap-2 mb-8 overflow-x-auto pb-2">
        {([2025, 2024, 2023, 2022] as YearTab[]).map(year => (
          <button
            key={year}
            onClick={() => setSelectedYear(year)}
            className={cn(
              'px-4 py-2 rounded-lg text-sm font-mono transition-all flex-shrink-0',
              selectedYear === year
                ? 'bg-primary text-primary-foreground'
                : 'bg-surface-raised text-muted-foreground hover:bg-surface-hover'
            )}
          >
            FAST {year}
          </button>
        ))}
      </div>

      {/* Conference info */}
      <div className="flex flex-wrap items-center gap-4 text-xs text-muted-foreground mb-8">
        <span className="flex items-center gap-1.5">
          <Calendar className="w-3.5 h-3.5" />
          {currentData.date}
        </span>
        <span className="flex items-center gap-1.5">
          <MapPin className="w-3.5 h-3.5" />
          {currentData.location}
        </span>
        <span className="flex items-center gap-1.5">
          <BookOpen className="w-3.5 h-3.5" />
          {currentData.papers.length} 篇论文
        </span>
        <span className="flex items-center gap-1.5 tag-storage rounded-full px-2 py-0.5">
          {highlightCount} 篇重点解读
        </span>
        <span className="flex items-center gap-1.5 tag-ai rounded-full px-2 py-0.5">
          {diagramCount} 篇含架构图
        </span>
      </div>

      {/* Stats cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-10">
        {[
          { label: '重点论文', count: highlightCount, color: 'var(--tag-storage)' },
          { label: '架构图', count: diagramCount, color: 'var(--tag-ai)' },
          { label: '详细解读', count: currentData.papers.filter(p => p.sections).length, color: 'var(--tag-ssd)' },
          { label: '性能数据', count: currentData.papers.filter(p => p.performanceData).length, color: 'var(--muted-foreground)' },
        ].map(stat => (
          <div key={stat.label} className="card-paper rounded-xl p-4 text-center">
            <div className="text-2xl font-bold mb-1" style={{ color: `hsl(${stat.color})` }}>{stat.count}</div>
            <div className="text-xs text-muted-foreground font-mono">{stat.label}</div>
          </div>
        ))}
      </div>

      {/* Papers by session */}
      {sessions.map(session => {
        const sessionPapers = currentData.papers.filter(p => p.session === session)
        return (
          <section key={session} className="mb-10">
            <h2 className="text-sm font-semibold uppercase tracking-widest text-muted-foreground mb-4 flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-primary" />
              {session}
              <span className="font-mono text-xs">({sessionPapers.length})</span>
            </h2>

            <div className="space-y-3">
              {sessionPapers.map((paper, idx) => (
                <ArchivePaperCard key={paper.id} paper={paper} idx={idx} />
              ))}
            </div>
          </section>
        )
      })}

      {/* Footer */}
      <div className="text-center pt-6 border-t border-border">
        <p className="text-xs text-muted-foreground font-mono">
          数据来源：USENIX FAST · 论文解读持续更新中
        </p>
      </div>
    </main>
  )
}