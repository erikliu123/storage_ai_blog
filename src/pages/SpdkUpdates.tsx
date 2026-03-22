import { useState, useMemo } from 'react'
import {
  spdkUpdates,
  COMPONENT_LABELS,
  TYPE_LABELS,
  TYPE_COLORS,
  getVersionStats,
  type SpdkUpdate,
  type SpdkComponent,
  type UpdateType,
} from '@/data/spdk'
import { cn } from '@/lib/utils'
import {
  Zap,
  GitPullRequest,
  Calendar,
  User,
  AlertTriangle,
  ChevronDown,
  ExternalLink,
  Sparkles,
  Bug,
  Code,
  Trash2,
} from 'lucide-react'

const TYPE_ICONS: Record<UpdateType, React.ReactNode> = {
  feature: <Sparkles className="w-3.5 h-3.5" />,
  performance: <Zap className="w-3.5 h-3.5" />,
  bugfix: <Bug className="w-3.5 h-3.5" />,
  'api-change': <Code className="w-3.5 h-3.5" />,
  deprecation: <Trash2 className="w-3.5 h-3.5" />,
}

export default function SpdkUpdatesPage() {
  const [activeComponent, setActiveComponent] = useState<SpdkComponent | 'all'>('all')
  const [activeVersion, setActiveVersion] = useState<string>('all')
  const [expandedId, setExpandedId] = useState<string | null>(null)

  const versionStats = getVersionStats()
  const versions = Object.keys(versionStats).sort().reverse()

  const filtered = useMemo(() => {
    return spdkUpdates.filter(u => {
      if (activeComponent !== 'all' && u.component !== activeComponent) return false
      if (activeVersion !== 'all' && u.version !== activeVersion) return false
      return true
    }).sort((a, b) => {
      if (a.isNew !== b.isNew) return a.isNew ? -1 : 1
      return new Date(b.date).getTime() - new Date(a.date).getTime()
    })
  }, [activeComponent, activeVersion])

  const newCount = spdkUpdates.filter(u => u.isNew).length
  const breakingCount = spdkUpdates.filter(u => u.breaking).length

  // 获取所有组件
  const components = [...new Set(spdkUpdates.map(u => u.component))]

  return (
    <main className="max-w-5xl mx-auto px-6 py-10 animate-fade-in">
      {/* Header */}
      <div className="mb-10">
        <div className="flex items-center gap-2 mb-3">
          <Zap className="w-4 h-4 text-green-400" />
          <span className="mono-label text-xs uppercase tracking-widest">Storage Performance Development Kit</span>
        </div>
        <h1 className="text-2xl font-bold mb-2 gradient-text">SPDK 关键更新</h1>
        <p className="text-sm text-muted-foreground mb-4">
          追踪 SPDK 近年来的重要特性、性能优化和 API 变更
        </p>

        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div className="card-paper rounded-xl p-4 text-center">
            <div className="text-2xl font-bold text-primary mb-1">{spdkUpdates.length}</div>
            <div className="text-xs text-muted-foreground font-mono">更新条目</div>
          </div>
          <div className="card-paper rounded-xl p-4 text-center">
            <div className="text-2xl font-bold text-green-400 mb-1">{newCount}</div>
            <div className="text-xs text-muted-foreground font-mono">最新版本</div>
          </div>
          <div className="card-paper rounded-xl p-4 text-center">
            <div className="text-2xl font-bold text-yellow-400 mb-1">{breakingCount}</div>
            <div className="text-xs text-muted-foreground font-mono">Breaking Change</div>
          </div>
          <div className="card-paper rounded-xl p-4 text-center">
            <div className="text-2xl font-bold text-blue-400 mb-1">{versions.length}</div>
            <div className="text-xs text-muted-foreground font-mono">版本覆盖</div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
        {/* Component filter */}
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setActiveComponent('all')}
            className={cn(
              'px-3 py-1 rounded-full text-xs font-medium font-mono transition-all border',
              activeComponent === 'all'
                ? 'bg-primary text-primary-foreground border-primary'
                : 'bg-surface text-muted-foreground border-border hover:border-primary/30'
            )}
          >
            全部组件
          </button>
          {components.map(comp => (
            <button
              key={comp}
              onClick={() => setActiveComponent(comp)}
              className={cn(
                'px-3 py-1 rounded-full text-xs font-medium font-mono transition-all border',
                activeComponent === comp
                  ? 'bg-primary text-primary-foreground border-primary'
                  : 'bg-surface text-muted-foreground border-border hover:border-primary/30'
              )}
            >
              {COMPONENT_LABELS[comp]}
            </button>
          ))}
        </div>

        {/* Version filter */}
        <select
          value={activeVersion}
          onChange={e => setActiveVersion(e.target.value)}
          className="text-xs font-mono bg-surface border border-border rounded-lg px-2 py-1.5 text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary/30"
        >
          <option value="all">全部版本</option>
          {versions.map(v => (
            <option key={v} value={v}>{v} ({versionStats[v].features + versionStats[v].perf + versionStats[v].bugfixes})</option>
          ))}
        </select>
      </div>

      {/* Count */}
      <p className="text-xs text-muted-foreground font-mono mb-4">
        显示 {filtered.length} 条更新
      </p>

      {/* List */}
      <div className="space-y-3">
        {filtered.map(update => (
          <UpdateCard
            key={update.id}
            update={update}
            isExpanded={expandedId === update.id}
            onToggle={() => setExpandedId(expandedId === update.id ? null : update.id)}
          />
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-20 text-muted-foreground">
          <p className="text-2xl mb-2">🔍</p>
          <p className="text-sm">该筛选条件下暂无更新</p>
        </div>
      )}

      {/* Footer */}
      <div className="mt-12 pt-8 border-t border-border">
        <h3 className="text-sm font-semibold mb-4">相关资源</h3>
        <div className="flex flex-wrap gap-3 text-xs text-muted-foreground">
          <a
            href="https://spdk.io"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 hover:text-foreground transition-colors"
          >
            <ExternalLink className="w-3 h-3" />
            SPDK 官网
          </a>
          <span className="text-border">·</span>
          <a
            href="https://github.com/spdk/spdk"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 hover:text-foreground transition-colors"
          >
            <ExternalLink className="w-3 h-3" />
            GitHub
          </a>
          <span className="text-border">·</span>
          <a
            href="https://spdk.io/doc/"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 hover:text-foreground transition-colors"
          >
            <ExternalLink className="w-3 h-3" />
            文档
          </a>
        </div>
      </div>
    </main>
  )
}

interface UpdateCardProps {
  update: SpdkUpdate
  isExpanded: boolean
  onToggle: () => void
}

function UpdateCard({ update, isExpanded, onToggle }: UpdateCardProps) {
  return (
    <article
      className={cn(
        'card-paper rounded-xl overflow-hidden transition-all',
        update.isNew && 'ring-1 ring-primary/20',
        update.breaking && 'border-l-2 border-l-yellow-500'
      )}
    >
      <div
        className="p-4 cursor-pointer hover:bg-surface-raised/50 transition-colors"
        onClick={onToggle}
      >
        {/* Header row */}
        <div className="flex items-start justify-between gap-3 mb-2">
          <div className="flex items-center gap-2 flex-wrap">
            {update.isNew && (
              <span className="inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium tag-storage">
                <span className="live-dot animate-pulse-dot" />
                NEW
              </span>
            )}
            {update.breaking && (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-medium bg-yellow-500/20 text-yellow-400 border border-yellow-500/30">
                <AlertTriangle className="w-3 h-3" />
                Breaking
              </span>
            )}
            <span className={cn(
              'inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-medium border',
              TYPE_COLORS[update.type]
            )}>
              {TYPE_ICONS[update.type]}
              {TYPE_LABELS[update.type]}
            </span>
            <span className="px-2 py-0.5 rounded text-xs font-mono bg-surface-raised border border-border text-muted-foreground">
              {COMPONENT_LABELS[update.component]}
            </span>
          </div>
          <ChevronDown className={cn(
            'w-4 h-4 text-muted-foreground transition-transform',
            isExpanded && 'rotate-180'
          )} />
        </div>

        {/* Title */}
        <h3 className="text-sm font-semibold text-foreground mb-1.5 leading-snug">
          {update.title}
        </h3>

        {/* Meta */}
        <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
          <span className="flex items-center gap-1">
            <GitPullRequest className="w-3 h-3" />
            #{update.prNumber}
          </span>
          <span className="flex items-center gap-1">
            <Calendar className="w-3 h-3" />
            {update.version} · {update.date}
          </span>
          <span className="flex items-center gap-1">
            <User className="w-3 h-3" />
            {update.author}
          </span>
        </div>

        {/* Description preview */}
        {!isExpanded && (
          <p className="text-xs text-muted-foreground mt-2 line-clamp-2">
            {update.description}
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
                更新说明
              </h4>
              <p className="text-sm text-foreground/80 leading-relaxed">
                {update.description}
              </p>
            </div>

            {/* Technical details */}
            <div>
              <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-1.5">
                技术细节
              </h4>
              <p className="text-sm text-foreground/80 leading-relaxed">
                {update.technicalDetails}
              </p>
            </div>

            {/* Benefits */}
            {update.benefits.length > 0 && (
              <div>
                <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-1.5">
                  主要收益
                </h4>
                <ul className="list-disc list-inside text-sm text-foreground/80 space-y-1">
                  {update.benefits.map((b, i) => (
                    <li key={i}>{b}</li>
                  ))}
                </ul>
              </div>
            )}

            {/* Breaking warning */}
            {update.breaking && (
              <div className="flex items-start gap-2 p-3 rounded-lg bg-yellow-500/10 border border-yellow-500/20">
                <AlertTriangle className="w-4 h-4 text-yellow-400 flex-shrink-0 mt-0.5" />
                <div className="text-xs text-yellow-300">
                  <span className="font-semibold">Breaking Change：</span>
                  此更新包含不兼容的 API 变更，升级前请查阅迁移文档。
                </div>
              </div>
            )}

            {/* References */}
            {update.references.length > 0 && (
              <div>
                <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-1.5">
                  相关链接
                </h4>
                <div className="flex flex-wrap gap-2">
                  {update.references.map((ref, idx) => (
                    <a
                      key={idx}
                      href={ref}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 px-2 py-1 rounded text-xs font-mono bg-surface border border-border text-primary hover:bg-primary/10 transition-colors"
                    >
                      <ExternalLink className="w-3 h-3" />
                      {ref.includes('github') ? 'PR 链接' : '文档'}
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