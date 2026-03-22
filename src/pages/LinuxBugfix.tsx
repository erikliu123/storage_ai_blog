import { useState, useMemo } from 'react'
import {
  linuxBugfixes,
  SUBSYSTEM_LABELS,
  TYPE_LABELS,
  TYPE_COLORS,
  IMPACT_LABELS,
  type LinuxBugfix,
  type Subsystem,
  type BugfixType,
  getStatsBySubsystem,
} from '@/data/linux-bugfix'
import { cn } from '@/lib/utils'
import {
  AlertTriangle,
  Bug,
  Shield,
  Zap,
  Sparkles,
  Filter,
  ChevronDown,
  ExternalLink,
  GitCommit,
  Calendar,
  User,
  Layers,
} from 'lucide-react'

const TYPE_ICONS: Record<BugfixType, React.ReactNode> = {
  bugfix: <Bug className="w-3.5 h-3.5" />,
  update: <Sparkles className="w-3.5 h-3.5" />,
  security: <Shield className="w-3.5 h-3.5" />,
  performance: <Zap className="w-3.5 h-3.5" />,
  feature: <Layers className="w-3.5 h-3.5" />,
}

export default function LinuxBugfixPage() {
  const [activeSubsystem, setActiveSubsystem] = useState<Subsystem | 'all'>('all')
  const [activeType, setActiveType] = useState<BugfixType | 'all'>('all')
  const [expandedId, setExpandedId] = useState<string | null>(null)

  const filtered = useMemo(() => {
    return linuxBugfixes.filter(bf => {
      if (activeSubsystem !== 'all' && bf.subsystem !== activeSubsystem) return false
      if (activeType !== 'all' && bf.type !== activeType) return false
      return true
    }).sort((a, b) => {
      // 新的优先，critical 优先
      if (a.isNew !== b.isNew) return a.isNew ? -1 : 1
      const impactOrder = { critical: 0, high: 1, medium: 2, low: 3 }
      if (impactOrder[a.impact] !== impactOrder[b.impact]) {
        return impactOrder[a.impact] - impactOrder[b.impact]
      }
      return new Date(b.date).getTime() - new Date(a.date).getTime()
    })
  }, [activeSubsystem, activeType])

  const stats = getStatsBySubsystem()
  const subsystems = Object.keys(stats) as Subsystem[]
  const newCount = linuxBugfixes.filter(bf => bf.isNew).length
  const criticalCount = linuxBugfixes.filter(bf => bf.impact === 'critical').length

  return (
    <main className="max-w-5xl mx-auto px-6 py-10 animate-fade-in">
      {/* Header */}
      <div className="mb-10">
        <div className="flex items-center gap-2 mb-3">
          <span className="live-dot animate-pulse-dot" />
          <span className="mono-label text-xs uppercase tracking-widest">Linux Kernel</span>
        </div>
        <h1 className="text-2xl font-bold mb-2 gradient-text">
          文件系统 & 存储 Bugfix & Update
        </h1>
        <p className="text-sm text-muted-foreground mb-4">
          追踪 Linux 内核最新文件系统、存储、RAID 相关的 bug 修复与更新
        </p>

        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div className="card-paper rounded-xl p-4 text-center">
            <div className="text-2xl font-bold text-primary mb-1">{linuxBugfixes.length}</div>
            <div className="text-xs text-muted-foreground font-mono">总条目</div>
          </div>
          <div className="card-paper rounded-xl p-4 text-center">
            <div className="text-2xl font-bold text-orange-400 mb-1">{criticalCount}</div>
            <div className="text-xs text-muted-foreground font-mono">严重问题</div>
          </div>
          <div className="card-paper rounded-xl p-4 text-center">
            <div className="text-2xl font-bold text-green-400 mb-1">{newCount}</div>
            <div className="text-xs text-muted-foreground font-mono">本周新增</div>
          </div>
          <div className="card-paper rounded-xl p-4 text-center">
            <div className="text-2xl font-bold text-blue-400 mb-1">{subsystems.length}</div>
            <div className="text-xs text-muted-foreground font-mono">子系统</div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
        {/* Subsystem filter */}
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setActiveSubsystem('all')}
            className={cn(
              'px-3 py-1 rounded-full text-xs font-medium font-mono transition-all border',
              activeSubsystem === 'all'
                ? 'bg-primary text-primary-foreground border-primary'
                : 'bg-surface text-muted-foreground border-border hover:border-primary/30'
            )}
          >
            全部
          </button>
          {subsystems.map(sub => (
            <button
              key={sub}
              onClick={() => setActiveSubsystem(sub)}
              className={cn(
                'px-3 py-1 rounded-full text-xs font-medium font-mono transition-all border',
                activeSubsystem === sub
                  ? 'bg-primary text-primary-foreground border-primary'
                  : 'bg-surface text-muted-foreground border-border hover:border-primary/30'
              )}
            >
              {SUBSYSTEM_LABELS[sub]}
              {stats[sub].critical > 0 && (
                <span className="ml-1 text-orange-400">({stats[sub].critical})</span>
              )}
            </button>
          ))}
        </div>

        {/* Type filter */}
        <div className="flex items-center gap-2">
          <Filter className="w-3.5 h-3.5 text-muted-foreground" />
          <select
            value={activeType}
            onChange={e => setActiveType(e.target.value as BugfixType | 'all')}
            className="text-xs font-mono bg-surface border border-border rounded-lg px-2 py-1.5 text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary/30"
          >
            <option value="all">全部类型</option>
            <option value="bugfix">Bug 修复</option>
            <option value="security">安全修复</option>
            <option value="performance">性能优化</option>
            <option value="feature">新特性</option>
            <option value="update">更新</option>
          </select>
        </div>
      </div>

      {/* Count */}
      <p className="text-xs text-muted-foreground font-mono mb-4">
        显示 {filtered.length} 条记录
      </p>

      {/* List */}
      <div className="space-y-3">
        {filtered.map(bf => (
          <BugfixCard
            key={bf.id}
            bugfix={bf}
            isExpanded={expandedId === bf.id}
            onToggle={() => setExpandedId(expandedId === bf.id ? null : bf.id)}
          />
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-20 text-muted-foreground">
          <p className="text-2xl mb-2">🔍</p>
          <p className="text-sm">该筛选条件下暂无记录</p>
        </div>
      )}

      {/* Footer */}
      <div className="mt-12 pt-8 border-t border-border">
        <h3 className="text-sm font-semibold mb-4">数据来源</h3>
        <div className="flex flex-wrap gap-3 text-xs text-muted-foreground">
          <a
            href="https://lore.kernel.org"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 hover:text-foreground transition-colors"
          >
            <ExternalLink className="w-3 h-3" />
            LKML / lore.kernel.org
          </a>
          <span className="text-border">·</span>
          <a
            href="https://git.kernel.org"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 hover:text-foreground transition-colors"
          >
            <ExternalLink className="w-3 h-3" />
            git.kernel.org
          </a>
          <span className="text-border">·</span>
          <a
            href="https://bugzilla.kernel.org"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 hover:text-foreground transition-colors"
          >
            <ExternalLink className="w-3 h-3" />
            Kernel Bugzilla
          </a>
        </div>
      </div>
    </main>
  )
}

interface BugfixCardProps {
  bugfix: LinuxBugfix
  isExpanded: boolean
  onToggle: () => void
}

function BugfixCard({ bugfix, isExpanded, onToggle }: BugfixCardProps) {
  return (
    <article
      className={cn(
        'card-paper rounded-xl overflow-hidden transition-all',
        bugfix.isNew && 'ring-1 ring-primary/20',
        bugfix.impact === 'critical' && 'border-l-2 border-l-red-500'
      )}
    >
      <div
        className="p-4 cursor-pointer hover:bg-surface-raised/50 transition-colors"
        onClick={onToggle}
      >
        {/* Header row */}
        <div className="flex items-start justify-between gap-3 mb-2">
          <div className="flex items-center gap-2 flex-wrap">
            {bugfix.isNew && (
              <span className="inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium tag-storage">
                <span className="live-dot animate-pulse-dot" />
                NEW
              </span>
            )}
            <span className={cn(
              'inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-medium border',
              TYPE_COLORS[bugfix.type]
            )}>
              {TYPE_ICONS[bugfix.type]}
              {TYPE_LABELS[bugfix.type]}
            </span>
            <span className="px-2 py-0.5 rounded text-xs font-mono bg-surface-raised border border-border text-muted-foreground">
              {SUBSYSTEM_LABELS[bugfix.subsystem]}
            </span>
            <span className={cn(
              'px-2 py-0.5 rounded text-xs font-mono border',
              IMPACT_LABELS[bugfix.impact].color
            )}>
              {IMPACT_LABELS[bugfix.impact].label}
            </span>
          </div>
          <ChevronDown className={cn(
            'w-4 h-4 text-muted-foreground transition-transform',
            isExpanded && 'rotate-180'
          )} />
        </div>

        {/* Title */}
        <h3 className="text-sm font-semibold text-foreground mb-1.5 leading-snug">
          {bugfix.title}
        </h3>

        {/* Meta */}
        <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
          <span className="flex items-center gap-1">
            <GitCommit className="w-3 h-3" />
            {bugfix.kernelVersion}
          </span>
          <span className="flex items-center gap-1">
            <Calendar className="w-3 h-3" />
            {bugfix.date}
          </span>
          <span className="flex items-center gap-1">
            <User className="w-3 h-3" />
            {bugfix.author}
          </span>
        </div>

        {/* Description preview */}
        {!isExpanded && (
          <p className="text-xs text-muted-foreground mt-2 line-clamp-2">
            {bugfix.description}
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
                {bugfix.description}
              </p>
            </div>

            {/* Affected versions */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-1.5">
                  影响版本
                </h4>
                <p className="text-sm font-mono text-orange-400">{bugfix.affectedVersions}</p>
              </div>
              <div>
                <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-1.5">
                  Commit ID
                </h4>
                <p className="text-sm font-mono text-primary">{bugfix.commitId}</p>
              </div>
            </div>

            {/* Fix details */}
            <div>
              <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-1.5">
                修复详情
              </h4>
              <p className="text-sm text-foreground/80 leading-relaxed">
                {bugfix.fixDetails}
              </p>
            </div>

            {/* Impact warning for critical */}
            {bugfix.impact === 'critical' && (
              <div className="flex items-start gap-2 p-3 rounded-lg bg-red-500/10 border border-red-500/20">
                <AlertTriangle className="w-4 h-4 text-red-400 flex-shrink-0 mt-0.5" />
                <div className="text-xs text-red-300">
                  <span className="font-semibold">严重问题：</span>
                  建议尽快升级到 {bugfix.kernelVersion} 或更高版本以修复此问题。
                </div>
              </div>
            )}

            {/* References */}
            {bugfix.references.length > 0 && (
              <div>
                <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-1.5">
                  相关链接
                </h4>
                <div className="flex flex-wrap gap-2">
                  {bugfix.references.map((ref, idx) => (
                    <a
                      key={idx}
                      href={ref}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 px-2 py-1 rounded text-xs font-mono bg-surface border border-border text-primary hover:bg-primary/10 transition-colors"
                    >
                      <ExternalLink className="w-3 h-3" />
                      {ref.includes('bugzilla') ? 'Bugzilla' : ref.includes('CVE') ? 'CVE' : '邮件列表'}
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