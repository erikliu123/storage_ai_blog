import { useState, useMemo } from 'react'
import {
  openSourceProjects,
  CATEGORY_LABELS,
  CATEGORY_COLORS,
  getCategoryStats,
  type OpenSourceProject,
  type ProjectCategory,
} from '@/data/opensource'
import { cn } from '@/lib/utils'
import {
  Database,
  ChevronDown,
  Github,
  Globe,
  Star,
  Calendar,
  Building2,
  FileText,
  CheckCircle,
  XCircle,
  Zap,
  Users,
  BookOpen,
  Layers,
  Search,
} from 'lucide-react'

export default function OpenSourceProjectsPage() {
  const [activeCategory, setActiveCategory] = useState<ProjectCategory | 'all'>('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [expandedId, setExpandedId] = useState<string | null>(null)

  const categoryStats = getCategoryStats()
  const categories = Object.keys(categoryStats) as ProjectCategory[]

  const filtered = useMemo(() => {
    return openSourceProjects.filter(p => {
      if (activeCategory !== 'all' && p.category !== activeCategory) return false
      if (searchQuery) {
        const query = searchQuery.toLowerCase()
        return (
          p.name.toLowerCase().includes(query) ||
          p.description.toLowerCase().includes(query) ||
          p.organization.toLowerCase().includes(query) ||
          p.useCases.some(u => u.toLowerCase().includes(query))
        )
      }
      return true
    }).sort((a, b) => {
      if (a.isFeatured !== b.isFeatured) return a.isFeatured ? -1 : 1
      if (a.stars !== b.stars) {
        // Parse stars for comparison (approximate)
        const aNum = parseFloat(a.stars.replace(/[^\d.]/g, '')) * (a.stars.includes('k') ? 1000 : 1)
        const bNum = parseFloat(b.stars.replace(/[^\d.]/g, '')) * (b.stars.includes('k') ? 1000 : 1)
        return bNum - aNum
      }
      return a.name.localeCompare(b.name)
    })
  }, [activeCategory, searchQuery])

  const featuredCount = openSourceProjects.filter(p => p.isFeatured).length

  return (
    <main className="max-w-5xl mx-auto px-6 py-10 animate-fade-in">
      {/* Header */}
      <div className="mb-10">
        <div className="flex items-center gap-2 mb-3">
          <Database className="w-4 h-4 text-primary" />
          <span className="mono-label text-xs uppercase tracking-widest">Open Source Storage</span>
        </div>
        <h1 className="text-2xl font-bold mb-2 gradient-text">经典开源存储库</h1>
        <p className="text-sm text-muted-foreground mb-4">
          KV 引擎、分布式数据库、并行文件系统、对象存储、数据湖表格式的深度解读
        </p>

        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div className="card-paper rounded-xl p-4 text-center">
            <div className="text-2xl font-bold text-primary mb-1">{openSourceProjects.length}</div>
            <div className="text-xs text-muted-foreground font-mono">开源项目</div>
          </div>
          <div className="card-paper rounded-xl p-4 text-center">
            <div className="text-2xl font-bold text-yellow-400 mb-1">{featuredCount}</div>
            <div className="text-xs text-muted-foreground font-mono">精选推荐</div>
          </div>
          <div className="card-paper rounded-xl p-4 text-center">
            <div className="text-2xl font-bold text-green-400 mb-1">{categories.length}</div>
            <div className="text-xs text-muted-foreground font-mono">技术类别</div>
          </div>
          <div className="card-paper rounded-xl p-4 text-center">
            <div className="text-2xl font-bold text-blue-400 mb-1">15+</div>
            <div className="text-xs text-muted-foreground font-mono">知名用户</div>
          </div>
        </div>
      </div>

      {/* Search and Filters */}
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
            全部
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

        {/* Search */}
        <div className="relative w-full sm:w-auto">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
          <input
            type="text"
            placeholder="搜索项目..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="w-full sm:w-48 pl-8 pr-3 py-1.5 text-xs font-mono bg-surface border border-border rounded-lg text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary/30"
          />
        </div>
      </div>

      {/* Count */}
      <p className="text-xs text-muted-foreground font-mono mb-4">
        显示 {filtered.length} 个项目
      </p>

      {/* List */}
      <div className="space-y-3">
        {filtered.map(project => (
          <ProjectCard
            key={project.id}
            project={project}
            isExpanded={expandedId === project.id}
            onToggle={() => setExpandedId(expandedId === project.id ? null : project.id)}
          />
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-20 text-muted-foreground">
          <p className="text-2xl mb-2">🔍</p>
          <p className="text-sm">未找到匹配的项目</p>
        </div>
      )}
    </main>
  )
}

interface ProjectCardProps {
  project: OpenSourceProject
  isExpanded: boolean
  onToggle: () => void
}

function ProjectCard({ project, isExpanded, onToggle }: ProjectCardProps) {
  return (
    <article
      className={cn(
        'card-paper rounded-xl overflow-hidden transition-all',
        project.isFeatured && 'ring-1 ring-primary/20'
      )}
    >
      <div
        className="p-4 cursor-pointer hover:bg-surface-raised/50 transition-colors"
        onClick={onToggle}
      >
        {/* Header row */}
        <div className="flex items-start justify-between gap-3 mb-2">
          <div className="flex items-center gap-2 flex-wrap">
            {project.isFeatured && (
              <span className="inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium tag-storage">
                <Star className="w-3 h-3" />
                精选
              </span>
            )}
            <span className={cn(
              'inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-medium border',
              CATEGORY_COLORS[project.category]
            )}>
              {CATEGORY_LABELS[project.category]}
            </span>
            <span className="px-2 py-0.5 rounded text-xs font-mono bg-surface-raised border border-border text-muted-foreground">
              {project.language}
            </span>
          </div>
          <ChevronDown className={cn(
            'w-4 h-4 text-muted-foreground transition-transform',
            isExpanded && 'rotate-180'
          )} />
        </div>

        {/* Title */}
        <h3 className="text-base font-semibold text-foreground mb-1">
          {project.name}
        </h3>
        <p className="text-xs text-muted-foreground mb-2">{project.fullName}</p>

        {/* Meta */}
        <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground mb-2">
          <span className="flex items-center gap-1">
            <Building2 className="w-3 h-3" />
            {project.organization}
          </span>
          <span className="flex items-center gap-1">
            <Star className="w-3 h-3 text-yellow-400" />
            {project.stars}
          </span>
          <span className="flex items-center gap-1">
            <Calendar className="w-3 h-3" />
            {project.firstRelease}
          </span>
          <span className="px-1.5 py-0.5 rounded bg-surface border border-border">
            {project.license}
          </span>
        </div>

        {/* Description preview */}
        {!isExpanded && (
          <p className="text-xs text-muted-foreground line-clamp-2">
            {project.description}
          </p>
        )}
      </div>

      {/* Expanded content */}
      {isExpanded && (
        <div className="px-4 pb-4 border-t border-border pt-4 bg-surface-raised/30">
          <div className="space-y-5">
            {/* Description */}
            <div>
              <p className="text-sm text-foreground/80 leading-relaxed">
                {project.description}
              </p>
            </div>

            {/* Architecture */}
            <div>
              <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-1.5 flex items-center gap-1.5">
                <Layers className="w-3.5 h-3.5" />
                核心架构
              </h4>
              <p className="text-sm text-foreground/70 leading-relaxed">{project.architecture}</p>
            </div>

            {/* Core Components */}
            <div>
              <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-1.5">
                核心组件
              </h4>
              <div className="flex flex-wrap gap-1.5">
                {project.coreComponents.map((comp, i) => (
                  <span key={i} className="px-2 py-1 rounded text-xs bg-surface border border-border text-foreground/80">
                    {comp}
                  </span>
                ))}
              </div>
            </div>

            {/* Key Technologies */}
            <div>
              <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-1.5 flex items-center gap-1.5">
                <Zap className="w-3.5 h-3.5 text-yellow-400" />
                关键技术
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {project.keyTechnologies.map((tech, i) => (
                  <div key={i} className="p-2 rounded-lg bg-surface border border-border">
                    <span className="text-xs font-medium text-foreground">{tech.name}</span>
                    <p className="text-xs text-muted-foreground mt-0.5">{tech.description}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Performance */}
            {project.performance && (
              <div>
                <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-1.5">
                  性能特点
                </h4>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-xs">
                  {project.performance.throughput && (
                    <div className="p-2 rounded bg-surface border border-border">
                      <span className="text-muted-foreground">吞吐量</span>
                      <p className="text-green-400 font-medium mt-0.5">{project.performance.throughput}</p>
                    </div>
                  )}
                  {project.performance.latency && (
                    <div className="p-2 rounded bg-surface border border-border">
                      <span className="text-muted-foreground">延迟</span>
                      <p className="text-blue-400 font-medium mt-0.5">{project.performance.latency}</p>
                    </div>
                  )}
                  {project.performance.scalability && (
                    <div className="p-2 rounded bg-surface border border-border">
                      <span className="text-muted-foreground">扩展性</span>
                      <p className="text-purple-400 font-medium mt-0.5">{project.performance.scalability}</p>
                    </div>
                  )}
                </div>
                {project.performance.notes && (
                  <p className="text-xs text-muted-foreground mt-1">{project.performance.notes}</p>
                )}
              </div>
            )}

            {/* Use Cases */}
            <div>
              <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-1.5">
                应用场景
              </h4>
              <div className="flex flex-wrap gap-1.5">
                {project.useCases.map((uc, i) => (
                  <span key={i} className="px-2 py-0.5 rounded text-xs bg-primary/10 text-primary border border-primary/20">
                    {uc}
                  </span>
                ))}
              </div>
            </div>

            {/* Notable Users */}
            {project.notableUsers.length > 0 && (
              <div>
                <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-1.5 flex items-center gap-1.5">
                  <Users className="w-3.5 h-3.5" />
                  知名用户
                </h4>
                <p className="text-sm text-foreground/70">{project.notableUsers.join(' · ')}</p>
              </div>
            )}

            {/* Pros & Cons */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <h4 className="text-xs font-semibold text-green-400 uppercase tracking-wide mb-1.5 flex items-center gap-1.5">
                  <CheckCircle className="w-3.5 h-3.5" />
                  优势
                </h4>
                <ul className="space-y-1">
                  {project.pros.slice(0, 5).map((pro, i) => (
                    <li key={i} className="text-xs text-foreground/70 flex items-start gap-2">
                      <span className="text-green-400">+</span>
                      {pro}
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <h4 className="text-xs font-semibold text-red-400 uppercase tracking-wide mb-1.5 flex items-center gap-1.5">
                  <XCircle className="w-3.5 h-3.5" />
                  局限
                </h4>
                <ul className="space-y-1">
                  {project.cons.slice(0, 5).map((con, i) => (
                    <li key={i} className="text-xs text-foreground/70 flex items-start gap-2">
                      <span className="text-red-400">-</span>
                      {con}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Links */}
            <div className="flex flex-wrap gap-2 pt-2">
              <a
                href={project.github}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-surface border border-border text-foreground hover:bg-surface-raised transition-colors"
              >
                <Github className="w-3.5 h-3.5" />
                GitHub
              </a>
              <a
                href={project.website}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-surface border border-border text-foreground hover:bg-surface-raised transition-colors"
              >
                <Globe className="w-3.5 h-3.5" />
                官网
              </a>
              {project.documentation && (
                <a
                  href={project.documentation}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-surface border border-border text-foreground hover:bg-surface-raised transition-colors"
                >
                  <BookOpen className="w-3.5 h-3.5" />
                  文档
                </a>
              )}
            </div>

            {/* Papers */}
            {project.papers.length > 0 && (
              <div>
                <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-1.5 flex items-center gap-1.5">
                  <FileText className="w-3.5 h-3.5" />
                  相关论文
                </h4>
                <ul className="space-y-1">
                  {project.papers.map((paper, i) => (
                    <li key={i} className="text-xs text-primary hover:underline cursor-pointer">
                      {paper}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      )}
    </article>
  )
}