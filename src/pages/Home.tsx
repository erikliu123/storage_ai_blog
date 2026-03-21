import { useState, useMemo } from 'react'
import { papers } from '@/data/papers'
import { PaperCard } from '@/components/PaperCard'
import type { Category } from '@/data/types'
import { getCategoryLabel } from '@/lib/utils'
import { Filter } from 'lucide-react'
import { cn } from '@/lib/utils'

const CATEGORIES: (Category | 'All')[] = ['All', 'AI', 'Storage', 'SSD', 'FileSystem', 'HBM', 'WeChat']
const SOURCES = ['all', 'dblp', 'arxiv', 'wechat'] as const

const SOURCE_LABELS = { all: '全部来源', dblp: 'DBLP 会议', arxiv: 'arXiv', wechat: '公众号' }

export default function Home() {
  const [activeCategory, setActiveCategory] = useState<Category | 'All'>('All')
  const [activeSource, setActiveSource] = useState<typeof SOURCES[number]>('all')
  const [sortBy, setSortBy] = useState<'date' | 'readTime'>('date')

  const filtered = useMemo(() => {
    let list = [...papers]
    if (activeCategory !== 'All') {
      list = list.filter(p => p.category.includes(activeCategory))
    }
    if (activeSource !== 'all') {
      list = list.filter(p => p.source === activeSource)
    }
    list.sort((a, b) => {
      if (sortBy === 'date') return new Date(b.date).getTime() - new Date(a.date).getTime()
      return a.readTime - b.readTime
    })
    return list
  }, [activeCategory, activeSource, sortBy])

  const newCount = papers.filter(p => p.isNew).length

  return (
    <main className="max-w-6xl mx-auto px-6 py-10">
      {/* Hero section */}
      <div className="relative rounded-2xl overflow-hidden mb-10 border border-border">
        <img
          src="/images/hero-banner.png"
          alt="StorageAI Reader — AI 与存储前沿论文"
          className="w-full h-52 object-cover"
          loading="eager"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-background/95 via-background/60 to-transparent flex items-center px-8">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <span className="live-dot animate-pulse-dot" />
              <span className="mono-label text-xs uppercase tracking-widest">每日更新</span>
              <span className="tag-storage rounded-full px-2 py-0.5 text-xs font-mono">{newCount} 篇新文章</span>
            </div>
            <h1 className="text-3xl font-bold tracking-tight mb-2 gradient-text">
              StorageAI Reader
            </h1>
            <p className="text-sm text-muted-foreground max-w-xs leading-relaxed">
              追踪 AI 训练系统、SSD、文件系统、HBM 存储最新论文与公众号精华
            </p>
          </div>
        </div>
      </div>

      {/* Filter bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
        {/* Category pills */}
        <div className="flex flex-wrap gap-2">
          {CATEGORIES.map(cat => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={cn(
                'px-3 py-1 rounded-full text-xs font-medium font-mono transition-all duration-150 border',
                activeCategory === cat
                  ? 'bg-primary text-primary-foreground border-primary'
                  : 'bg-surface text-muted-foreground border-border hover:border-primary/30 hover:text-foreground'
              )}
            >
              {cat === 'All' ? '全部' : getCategoryLabel(cat)}
            </button>
          ))}
        </div>

        {/* Source + Sort */}
        <div className="flex items-center gap-2 flex-shrink-0">
          <Filter className="w-3.5 h-3.5 text-muted-foreground" />
          <select
            value={activeSource}
            onChange={e => setActiveSource(e.target.value as typeof SOURCES[number])}
            className="text-xs font-mono bg-surface border border-border rounded-lg px-2 py-1.5 text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary/30"
          >
            {SOURCES.map(s => <option key={s} value={s}>{SOURCE_LABELS[s]}</option>)}
          </select>
          <select
            value={sortBy}
            onChange={e => setSortBy(e.target.value as 'date' | 'readTime')}
            className="text-xs font-mono bg-surface border border-border rounded-lg px-2 py-1.5 text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary/30"
          >
            <option value="date">最新优先</option>
            <option value="readTime">阅读时长</option>
          </select>
        </div>
      </div>

      {/* Count */}
      <p className="text-xs text-muted-foreground font-mono mb-4">
        共 {filtered.length} 篇文章
      </p>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filtered.map(paper => (
          <PaperCard key={paper.id} paper={paper} />
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-20 text-muted-foreground">
          <p className="text-2xl mb-2">🔍</p>
          <p className="text-sm">该分类下暂无文章</p>
        </div>
      )}
    </main>
  )
}
