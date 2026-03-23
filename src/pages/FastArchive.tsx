import { Calendar, MapPin, BookOpen, Image, Zap, Clock, ExternalLink, Table2 } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useState } from 'react'
import { fast2025Papers, fast2024Papers, fast2023Papers, fast2022Papers, type ArchivePaperData } from '@/data/fastArchive'

// Helper function to parse markdown-like content
function formatContent(content: string) {
  // Split by lines and process each line
  const lines = content.split('\n')
  const elements: JSX.Element[] = []

  lines.forEach((line, idx) => {
    // Check for headers (###, ##, #)
    if (line.startsWith('### ')) {
      elements.push(<h4 key={idx} className="text-xs font-bold text-primary mt-3 mb-1">{line.slice(4)}</h4>)
    } else if (line.startsWith('## ')) {
      elements.push(<h3 key={idx} className="text-sm font-bold text-foreground mt-4 mb-2">{line.slice(3)}</h3>)
    } else if (line.startsWith('# ')) {
      elements.push(<h2 key={idx} className="text-base font-bold text-foreground mt-4 mb-2">{line.slice(2)}</h2>)
    }
    // Check for bullet points
    else if (line.startsWith('- ') || line.startsWith('* ')) {
      const text = line.slice(2)
      elements.push(
        <li key={idx} className="text-xs text-muted-foreground ml-3 flex items-start gap-2 my-1">
          <span className="text-primary mt-1">•</span>
          <span>{formatInlineStyles(text)}</span>
        </li>
      )
    }
    // Check for numbered lists
    else if (/^\d+\.\s/.test(line)) {
      const match = line.match(/^(\d+)\.\s(.*)$/)
      if (match) {
        elements.push(
          <li key={idx} className="text-xs text-muted-foreground ml-3 flex items-start gap-2 my-1">
            <span className="text-primary font-bold min-w-[1.2em]">{match[1]}.</span>
            <span>{formatInlineStyles(match[2])}</span>
          </li>
        )
      }
    }
    // Check for table rows (starting with |)
    else if (line.startsWith('|') && line.includes('|')) {
      const cells = line.split('|').filter(c => c.trim())
      // Check if it's a separator row
      if (cells.every(c => /^[-:]+$/.test(c.trim()))) {
        // Skip separator rows for now
        return
      }
      elements.push(
        <div key={idx} className="grid gap-2 my-0.5" style={{ gridTemplateColumns: `repeat(${cells.length}, 1fr)` }}>
          {cells.map((cell, cellIdx) => (
            <div key={cellIdx} className="text-xs px-2 py-1 bg-surface-raised/50 rounded border border-border/30">
              {formatInlineStyles(cell.trim())}
            </div>
          ))}
        </div>
      )
    }
    // Empty line
    else if (line.trim() === '') {
      elements.push(<div key={idx} className="h-2" />)
    }
    // Regular paragraph
    else {
      elements.push(
        <p key={idx} className="text-xs text-muted-foreground leading-relaxed my-1">
          {formatInlineStyles(line)}
        </p>
      )
    }
  })

  return <>{elements}</>
}

// Helper function to format inline styles (bold, code, etc.)
function formatInlineStyles(text: string): JSX.Element {
  // Process bold text (**text**)
  const parts = text.split(/(\*\*[^*]+\*\*)/g)
  return (
    <>
      {parts.map((part, idx) => {
        if (part.startsWith('**') && part.endsWith('**')) {
          return <strong key={idx} className="font-semibold text-foreground">{part.slice(2, -2)}</strong>
        }
        // Process inline code (`code`)
        const codeParts = part.split(/(`[^`]+`)/g)
        return (
          <span key={idx}>
            {codeParts.map((codePart, codeIdx) => {
              if (codePart.startsWith('`') && codePart.endsWith('`')) {
                return <code key={codeIdx} className="px-1 py-0.5 bg-primary/10 text-primary rounded text-[10px] font-mono">{codePart.slice(1, -1)}</code>
              }
              return <span key={codeIdx}>{codePart}</span>
            })}
          </span>
        )
      })}
    </>
  )
}

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
                <div className="flex items-center gap-2 mb-2">
                  <Table2 className="w-3 h-3 text-primary" />
                  <span className="text-xs font-semibold text-foreground">性能指标</span>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {paper.performanceData.map((perf, i) => (
                    <div key={i} className="bg-gradient-to-br from-primary/5 to-primary/10 rounded-lg p-2.5 text-center border border-primary/20">
                      <div className="text-sm font-bold text-primary">{perf.value}</div>
                      <div className="text-xs text-muted-foreground">{perf.metric}</div>
                      {perf.baseline && (
                        <div className="text-[10px] text-muted-foreground/70 mt-0.5">基准: {perf.baseline}</div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Architecture Diagram */}
            {paper.archDiagram && expanded && (
              <div className="mt-3 pt-3 border-t border-border/50">
                <h4 className="text-xs font-semibold text-foreground mb-2 flex items-center gap-2">
                  <Image className="w-3 h-3 text-primary" />
                  架构图
                </h4>
                {paper.archDiagram.startsWith('/') ? (
                  <img src={paper.archDiagram} alt="Architecture Diagram" className="w-full rounded-lg border border-border bg-surface-raised" />
                ) : (
                  <pre className="text-xs text-muted-foreground bg-surface-raised rounded-lg p-3 overflow-x-auto whitespace-pre font-mono leading-tight">{paper.archDiagram.trim()}</pre>
                )}
              </div>
            )}

            {/* Pros & Cons */}
            {expanded && (paper.pros.length > 0 || paper.cons.length > 0) && (
              <div className="mt-3 pt-3 border-t border-border/50 grid grid-cols-1 sm:grid-cols-2 gap-4">
                {paper.pros.length > 0 && (
                  <div className="bg-green-500/5 rounded-lg p-3 border border-green-500/20">
                    <h4 className="text-xs font-bold text-green-500 mb-2 flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-green-500" />
                      优势
                    </h4>
                    <ul className="space-y-1.5">
                      {paper.pros.map((p, i) => (
                        <li key={i} className="text-xs text-muted-foreground leading-relaxed flex items-start gap-2">
                          <span className="text-green-500 mt-0.5">✓</span>
                          <span>{p.replace('✓ ', '')}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
                {paper.cons.length > 0 && (
                  <div className="bg-red-500/5 rounded-lg p-3 border border-red-500/20">
                    <h4 className="text-xs font-bold text-red-400 mb-2 flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-red-400" />
                      局限性
                    </h4>
                    <ul className="space-y-1.5">
                      {paper.cons.map((c, i) => (
                        <li key={i} className="text-xs text-muted-foreground leading-relaxed flex items-start gap-2">
                          <span className="text-red-400 mt-0.5">✗</span>
                          <span>{c.replace('✗ ', '')}</span>
                        </li>
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
                  <div key={i} className="bg-surface-raised/30 rounded-lg p-3 border border-border/30">
                    <h4 className="text-xs font-bold text-primary mb-2 flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-primary" />
                      {section.title}
                    </h4>
                    <div className="prose-sm">{formatContent(section.content)}</div>
                  </div>
                ))}
              </div>
            )}

            {/* Paper URL */}
            {paper.paperUrl && expanded && (
              <div className="mt-3 pt-3 border-t border-border/50">
                <a
                  href={paper.paperUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-xs text-primary hover:text-primary/80 transition-colors font-mono bg-primary/5 px-3 py-1.5 rounded-lg"
                >
                  <ExternalLink className="w-3 h-3" />
                  查看论文原文
                </a>
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