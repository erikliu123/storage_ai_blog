import { papers } from '@/data/papers'
import { formatDate, getSourceIcon } from '@/lib/utils'
import { CategoryTag } from '@/components/ui/CategoryTag'
import { Link } from 'react-router-dom'
import { Clock, RefreshCw, GitCommit } from 'lucide-react'

// Group papers by date
function groupByDate(items: typeof papers) {
  const groups: Record<string, typeof papers> = {}
  for (const p of items) {
    if (!groups[p.date]) groups[p.date] = []
    groups[p.date].push(p)
  }
  return Object.entries(groups).sort(([a], [b]) => new Date(b).getTime() - new Date(a).getTime())
}

export default function Daily() {
  const groups = groupByDate(papers)
  const todayStr = new Date().toISOString().slice(0, 10)

  return (
    <main className="max-w-3xl mx-auto px-6 py-10 animate-fade-in">
      {/* Header */}
      <div className="mb-10">
        <div className="flex items-center gap-2 mb-3">
          <span className="live-dot animate-pulse-dot" />
          <span className="mono-label text-xs uppercase tracking-widest">Daily Feed</span>
        </div>
        <h1 className="text-2xl font-bold mb-2 gradient-text">每日更新</h1>
        <p className="text-sm text-muted-foreground">
          每天自动抓取 DBLP 会议录、arXiv 预印本及公众号文章，AI 梳理核心贡献
        </p>
      </div>

      {/* Update sources */}
      <div className="grid grid-cols-3 gap-3 mb-10">
        {[
          { icon: '🔬', label: 'DBLP 会议', desc: 'FAST / OSDI / SOSP / ATC', color: 'var(--tag-storage)' },
          { icon: '📄', label: 'arXiv', desc: 'cs.OS / cs.AR / cs.LG', color: 'var(--tag-ai)' },
          { icon: '💬', label: '公众号', desc: '存储随笔 · 王知鱼', color: 'var(--tag-wechat)' },
        ].map(src => (
          <div key={src.label} className="card-paper rounded-xl p-4">
            <div className="text-xl mb-2">{src.icon}</div>
            <div className="text-xs font-semibold mb-0.5" style={{ color: `hsl(${src.color})` }}>{src.label}</div>
            <div className="text-xs text-muted-foreground font-mono">{src.desc}</div>
          </div>
        ))}
      </div>

      {/* Timeline */}
      <div className="relative">
        {/* Timeline line */}
        <div className="absolute left-4 top-0 bottom-0 w-px bg-border" />

        <div className="space-y-8">
          {groups.map(([date, items]) => {
            const isToday = date === todayStr
            return (
              <div key={date} className="relative pl-12">
                {/* Date dot */}
                <div className={`absolute left-2.5 -translate-x-1/2 w-3 h-3 rounded-full border-2 ${isToday ? 'bg-primary border-primary shadow-glow' : 'bg-surface border-border'}`} />

                {/* Date label */}
                <div className="flex items-center gap-2 mb-3">
                  <span className={`text-xs font-mono font-semibold ${isToday ? 'text-primary' : 'text-muted-foreground'}`}>
                    {isToday ? '今天 · ' : ''}{formatDate(date)}
                  </span>
                  {isToday && <span className="tag-storage rounded-full px-2 py-0.5 text-xs font-mono">最新</span>}
                  <span className="text-xs text-muted-foreground">({items.length} 篇)</span>
                </div>

                {/* Papers for this date */}
                <div className="space-y-2">
                  {items.map(paper => (
                    <Link key={paper.id} to={`/paper/${paper.id}`} className="block group">
                      <div className="card-paper rounded-xl p-4">
                        <div className="flex items-start justify-between gap-3">
                          <div className="flex-1 min-w-0">
                            <div className="flex flex-wrap items-center gap-1.5 mb-1.5">
                              {paper.category.slice(0, 2).map(c => (
                                <CategoryTag key={c} category={c} />
                              ))}
                              <span className="mono-label">{getSourceIcon(paper.source)} {paper.sourceLabel}</span>
                            </div>
                            <h3 className="text-sm font-semibold leading-snug text-foreground group-hover:text-primary transition-colors truncate">
                              {paper.titleZh ?? paper.title}
                            </h3>
                            <p className="text-xs text-muted-foreground mt-1 line-clamp-1">{paper.abstract.slice(0, 80)}...</p>
                          </div>
                          <div className="flex-shrink-0 flex items-center gap-1 text-xs text-muted-foreground">
                            <Clock className="w-3 h-3" />
                            {paper.readTime}m
                          </div>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </main>
  )
}
