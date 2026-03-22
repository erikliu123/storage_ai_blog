import { useState, useMemo } from 'react'
import { Link } from 'react-router-dom'
import { papers } from '@/data/papers'
import { PaperCard } from '@/components/PaperCard'
import type { Category } from '@/data/types'
import { getCategoryLabel } from '@/lib/utils'
import { Filter, BookOpen, ArrowRight } from 'lucide-react'
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

      {/* Featured Deep Dive - RASK */}
      <div className="mb-8">
        <Link to="/deep-dive/rask" className="block group">
          <div className="card-paper rounded-2xl overflow-hidden ring-1 ring-primary/20 hover:ring-primary/40 transition-all duration-300">
            <div className="flex flex-col md:flex-row">
              <div className="md:w-1/3 h-40 md:h-auto relative overflow-hidden">
                <img
                  src="/images/rask-arch.png"
                  alt="RASK 架构图"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute top-3 left-3">
                  <span className="bg-primary text-primary-foreground text-xs font-bold px-2 py-1 rounded-md font-mono">
                    深度解读
                  </span>
                </div>
              </div>
              <div className="flex-1 p-5 md:p-6">
                <div className="flex items-center gap-2 mb-2">
                  <span className="tag-ai text-xs font-mono px-2 py-0.5 rounded">FAST 2026</span>
                  <span className="tag-storage text-xs font-mono px-2 py-0.5 rounded">索引结构</span>
                </div>
                <h2 className="text-lg md:text-xl font-bold mb-2 group-hover:text-primary transition-colors">
                  "Range as a Key" is the Key!
                </h2>
                <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                  Fast and Compact Cloud Block Store Index with RASK — 通过范围树和合并策略实现 80% 空间节省、50% 延迟降低
                </p>
                <div className="flex flex-wrap items-center gap-4 text-xs text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <BookOpen className="w-3.5 h-3.5" />
                    15 分钟深度阅读
                  </span>
                  <span className="flex items-center gap-1">
                    <ArrowRight className="w-3.5 h-3.5" />
                    查看完整解读
                  </span>
                </div>
              </div>
            </div>
          </div>
        </Link>
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
