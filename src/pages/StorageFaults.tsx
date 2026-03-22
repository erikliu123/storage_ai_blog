import { useState, useMemo } from 'react'
import {
  storageFaults,
  CATEGORY_LABELS,
  CATEGORY_COLORS,
  SOURCE_LABELS,
  SEVERITY_CONFIG,
  getCategoryStats,
  type StorageFault,
  type FaultCategory,
  type FaultSeverity,
  type SourceType,
} from '@/data/faults'
import { cn } from '@/lib/utils'
import {
  AlertOctagon,
  Calendar,
  Building2,
  ChevronDown,
  ExternalLink,
  BookOpen,
  AlertTriangle,
  CheckCircle,
  Lightbulb,
  Filter,
} from 'lucide-react'

export default function StorageFaultsPage() {
  const [activeCategory, setActiveCategory] = useState<FaultCategory | 'all'>('all')
  const [activeSeverity, setActiveSeverity] = useState<FaultSeverity | 'all'>('all')
  const [expandedId, setExpandedId] = useState<string | null>(null)

  const categoryStats = getCategoryStats()
  const categories = Object.keys(categoryStats) as FaultCategory[]

  const filtered = useMemo(() => {
    return storageFaults.filter(f => {
      if (activeCategory !== 'all' && f.category !== activeCategory) return false
      if (activeSeverity !== 'all' && f.severity !== activeSeverity) return false
      return true
    }).sort((a, b) => {
      if (a.isNew !== b.isNew) return a.isNew ? -1 : 1
      const severityOrder = { critical: 0, high: 1, medium: 2, low: 3 }
      if (severityOrder[a.severity] !== severityOrder[b.severity]) {
        return severityOrder[a.severity] - severityOrder[b.severity]
      }
      return b.year - a.year
    })
  }, [activeCategory, activeSeverity])

  const criticalCount = storageFaults.filter(f => f.severity === 'critical').length
  const newCount = storageFaults.filter(f => f.isNew).length

  return (
    <main className="max-w-5xl mx-auto px-6 py-10 animate-fade-in">
      {/* Header */}
      <div className="mb-10">
        <div className="flex items-center gap-2 mb-3">
          <AlertOctagon className="w-4 h-4 text-red-400" />
          <span className="mono-label text-xs uppercase tracking-widest">Industry Failure Analysis</span>
        </div>
        <h1 className="text-2xl font-bold mb-2 gradient-text">存储故障案例分析</h1>
        <p className="text-sm text-muted-foreground mb-4">
          工业界大规模存储故障研究：慢盘、CPU/内存异常、SSD 缺陷等真实案例
        </p>

        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div className="card-paper rounded-xl p-4 text-center">
            <div className="text-2xl font-bold text-primary mb-1">{storageFaults.length}</div>
            <div className="text-xs text-muted-foreground font-mono">案例分析</div>
          </div>
          <div className="card-paper rounded-xl p-4 text-center">
            <div className="text-2xl font-bold text-red-400 mb-1">{criticalCount}</div>
            <div className="text-xs text-muted-foreground font-mono">严重问题</div>
          </div>
          <div className="card-paper rounded-xl p-4 text-center">
            <div className="text-2xl font-bold text-green-400 mb-1">{newCount}</div>
            <div className="text-xs text-muted-foreground font-mono">最新案例</div>
          </div>
          <div className="card-paper rounded-xl p-4 text-center">
            <div className="text-2xl font-bold text-blue-400 mb-1">{categories.length}</div>
            <div className="text-xs text-muted-foreground font-mono">故障类型</div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
        {/* Category filter */}
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setActiveCategory('all')}
            className={cn(
              'px-3 py-1 rounded-full text-xs font-medium font-mono transition-all border',
              activeCategory === 'all'
                ? 'bg-primary text-primary-foreground border-primary'
                : 'bg-surface text-muted-foreground border-border hover:border-primary/30'
            )}
          >
            全部类型
          </button>
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={cn(
                'px-3 py-1 rounded-full text-xs font-medium font-mono transition-all border',
                activeCategory === cat
                  ? 'bg-primary text-primary-foreground border-primary'
                  : 'bg-surface text-muted-foreground border-border hover:border-primary/30'
              )}
            >
              {CATEGORY_LABELS[cat]}
            </button>
          ))}
        </div>

        {/* Severity filter */}
        <div className="flex items-center gap-2">
          <Filter className="w-3.5 h-3.5 text-muted-foreground" />
          <select
            value={activeSeverity}
            onChange={e => setActiveSeverity(e.target.value as FaultSeverity | 'all')}
            className="text-xs font-mono bg-surface border border-border rounded-lg px-2 py-1.5 text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary/30"
          >
            <option value="all">全部严重度</option>
            <option value="critical">严重</option>
            <option value="high">高</option>
            <option value="medium">中</option>
            <option value="low">低</option>
          </select>
        </div>
      </div>

      {/* Count */}
      <p className="text-xs text-muted-foreground font-mono mb-4">
        显示 {filtered.length} 条案例
      </p>

      {/* List */}
      <div className="space-y-3">
        {filtered.map(fault => (
          <FaultCard
            key={fault.id}
            fault={fault}
            isExpanded={expandedId === fault.id}
            onToggle={() => setExpandedId(expandedId === fault.id ? null : fault.id)}
          />
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-20 text-muted-foreground">
          <p className="text-2xl mb-2">🔍</p>
          <p className="text-sm">该筛选条件下暂无案例</p>
        </div>
      )}

      {/* Footer */}
      <div className="mt-12 pt-8 border-t border-border">
        <h3 className="text-sm font-semibold mb-4">数据来源</h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs">
          {['google', 'meta', 'microsoft', 'alibaba', 'amazon', 'netflix'].map(src => (
            <div key={src} className="flex items-center gap-2 text-muted-foreground">
              <Building2 className="w-3 h-3" />
              {SOURCE_LABELS[src as SourceType]}
            </div>
          ))}
        </div>
      </div>
    </main>
  )
}

interface FaultCardProps {
  fault: StorageFault
  isExpanded: boolean
  onToggle: () => void
}

function FaultCard({ fault, isExpanded, onToggle }: FaultCardProps) {
  return (
    <article
      className={cn(
        'card-paper rounded-xl overflow-hidden transition-all',
        fault.isNew && 'ring-1 ring-primary/20',
        fault.severity === 'critical' && 'border-l-2 border-l-red-500'
      )}
    >
      <div
        className="p-4 cursor-pointer hover:bg-surface-raised/50 transition-colors"
        onClick={onToggle}
      >
        {/* Header row */}
        <div className="flex items-start justify-between gap-3 mb-2">
          <div className="flex items-center gap-2 flex-wrap">
            {fault.isNew && (
              <span className="inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium tag-storage">
                <span className="live-dot animate-pulse-dot" />
                NEW
              </span>
            )}
            <span className={cn(
              'inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-medium border',
              CATEGORY_COLORS[fault.category]
            )}>
              {CATEGORY_LABELS[fault.category]}
            </span>
            <span className={cn(
              'px-2 py-0.5 rounded text-xs font-mono border',
              SEVERITY_CONFIG[fault.severity].color
            )}>
              {SEVERITY_CONFIG[fault.severity].icon} {SEVERITY_CONFIG[fault.severity].label}
            </span>
          </div>
          <ChevronDown className={cn(
            'w-4 h-4 text-muted-foreground transition-transform',
            isExpanded && 'rotate-180'
          )} />
        </div>

        {/* Title */}
        <h3 className="text-sm font-semibold text-foreground mb-1.5 leading-snug">
          {fault.title}
        </h3>

        {/* Meta */}
        <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
          <span className="flex items-center gap-1">
            <Building2 className="w-3 h-3" />
            {SOURCE_LABELS[fault.source]}
          </span>
          <span className="flex items-center gap-1">
            <Calendar className="w-3 h-3" />
            {fault.year}
          </span>
          <span className="flex items-center gap-1">
            <BookOpen className="w-3 h-3" />
            {fault.paperOrReport}
          </span>
        </div>

        {/* Description preview */}
        {!isExpanded && (
          <p className="text-xs text-muted-foreground mt-2 line-clamp-2">
            {fault.description}
          </p>
        )}
      </div>

      {/* Expanded content */}
      {isExpanded && (
        <div className="px-4 pb-4 border-t border-border pt-4 bg-surface-raised/30">
          <div className="space-y-4">
            {/* Description */}
            <div>
              <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-1.5">
                问题描述
              </h4>
              <p className="text-sm text-foreground/80 leading-relaxed">
                {fault.description}
              </p>
            </div>

            {/* Symptoms */}
            <div>
              <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-1.5 flex items-center gap-1.5">
                <AlertTriangle className="w-3.5 h-3.5 text-orange-400" />
                故障症状
              </h4>
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-1">
                {fault.symptoms.map((s, i) => (
                  <li key={i} className="text-xs text-foreground/70 flex items-start gap-2">
                    <span className="text-orange-400">•</span>
                    {s}
                  </li>
                ))}
              </ul>
            </div>

            {/* Root cause & Detection */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-1.5">
                  根本原因
                </h4>
                <p className="text-sm text-foreground/70">{fault.rootCause}</p>
              </div>
              <div>
                <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-1.5">
                  检测方法
                </h4>
                <p className="text-sm text-foreground/70">{fault.detection}</p>
              </div>
            </div>

            {/* Mitigation */}
            <div>
              <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-1.5 flex items-center gap-1.5">
                <CheckCircle className="w-3.5 h-3.5 text-green-400" />
                缓解措施
              </h4>
              <p className="text-sm text-foreground/70">{fault.mitigation}</p>
            </div>

            {/* Impact */}
            <div>
              <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-1.5">
                影响范围
              </h4>
              <p className="text-sm text-red-300/90">{fault.impact}</p>
            </div>

            {/* Lessons */}
            {fault.lessons.length > 0 && (
              <div>
                <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-1.5 flex items-center gap-1.5">
                  <Lightbulb className="w-3.5 h-3.5 text-yellow-400" />
                  经验教训
                </h4>
                <ul className="list-disc list-inside text-sm text-foreground/70 space-y-1">
                  {fault.lessons.map((l, i) => (
                    <li key={i}>{l}</li>
                  ))}
                </ul>
              </div>
            )}

            {/* References */}
            {fault.references.length > 0 && (
              <div>
                <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-1.5">
                  参考资料
                </h4>
                <div className="flex flex-wrap gap-2">
                  {fault.references.map((ref, idx) => (
                    <a
                      key={idx}
                      href={ref}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 px-2 py-1 rounded text-xs font-mono bg-surface border border-border text-primary hover:bg-primary/10 transition-colors"
                    >
                      <ExternalLink className="w-3 h-3" />
                      {ref.includes('usenix') ? 'USENIX' : ref.includes('acm') ? 'ACM DL' : ref.includes('ieee') ? 'IEEE' : '链接'}
                    </a>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </article>
  )
}