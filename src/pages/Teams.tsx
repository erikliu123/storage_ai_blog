import { ExternalLink, MapPin, Globe, Users, BookOpen } from 'lucide-react'
import { teams } from '@/data/teams'
import { cn } from '@/lib/utils'

export default function Teams() {
  return (
    <main className="max-w-5xl mx-auto px-6 py-10 animate-fade-in">
      {/* Header */}
      <div className="mb-10">
        <div className="flex items-center gap-2 mb-3">
          <Users className="w-4 h-4 text-muted-foreground" />
          <span className="mono-label text-xs uppercase tracking-widest">Research Teams</span>
        </div>
        <h1 className="text-2xl font-bold mb-2 gradient-text">研究团队专栏</h1>
        <p className="text-sm text-muted-foreground">
          追踪国内顶级存储与系统研究团队的最新论文与动态
        </p>
      </div>

      {/* Team cards */}
      <div className="space-y-6">
        {teams.map((team, idx) => (
          <article key={team.id} className="card-paper rounded-2xl p-6">
            {/* Header row */}
            <div className="flex items-start justify-between gap-4 mb-4">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xs font-mono px-2 py-0.5 rounded bg-surface-raised border border-border text-muted-foreground">
                    {team.institutionShort}
                  </span>
                  <span className="flex items-center gap-1 text-xs text-muted-foreground">
                    <MapPin className="w-3 h-3" />
                    {team.location}
                  </span>
                </div>
                <h2 className="text-lg font-semibold text-foreground">{team.name}</h2>
                <p className="text-xs font-mono text-muted-foreground">{team.nameEn}</p>
              </div>
              <a
                href={team.website}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border border-primary/30 text-primary hover:bg-primary/10 transition-colors"
              >
                <Globe className="w-3.5 h-3.5" />
                官网
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>

            {/* Institution */}
            <p className="text-xs text-muted-foreground mb-4">{team.institution}</p>

            {/* Description */}
            <p className="text-sm text-foreground/80 leading-relaxed mb-5">{team.description}</p>

            {/* Professors */}
            <div className="flex flex-wrap items-center gap-2 mb-4">
              <span className="text-xs font-semibold text-muted-foreground">PI:</span>
              {team.professors.map(p => (
                <span key={p} className="px-2.5 py-1 rounded-full text-xs font-medium bg-primary/10 text-primary border border-primary/20">
                  {p}
                </span>
              ))}
            </div>

            {/* Focus areas */}
            <div className="mb-5">
              <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2">研究方向</h3>
              <div className="flex flex-wrap gap-1.5">
                {team.focusAreas.map(area => (
                  <span key={area} className="px-2 py-0.5 rounded text-xs font-mono bg-surface-raised border border-border text-muted-foreground">
                    {area}
                  </span>
                ))}
              </div>
            </div>

            {/* Key papers */}
            <div>
              <h3 className="flex items-center gap-1.5 text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-3">
                <BookOpen className="w-3.5 h-3.5" />
                代表性论文
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {team.keyPapers.map((paper, i) => (
                  <div
                    key={i}
                    className="flex items-start gap-2 p-3 rounded-lg bg-surface border border-border hover:border-primary/20 transition-colors group"
                  >
                    <span className="flex-shrink-0 w-5 h-5 rounded flex items-center justify-center text-xs font-mono font-bold text-muted-foreground bg-surface-raised border border-border">
                      {i + 1}
                    </span>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs text-foreground/85 leading-snug group-hover:text-foreground transition-colors line-clamp-2">
                        {paper.title}
                      </p>
                      <p className="text-xs font-mono text-muted-foreground mt-1">
                        {paper.venue} {paper.year}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Tags */}
            <div className="flex flex-wrap gap-1.5 mt-5 pt-4 border-t border-border">
              {team.tags.map(tag => (
                <span key={tag} className={cn(
                  'px-2 py-0.5 rounded text-xs font-mono',
                  idx === 0 ? 'tag-ai' : idx === 1 ? 'tag-storage' : 'tag-ssd'
                )}>
                  #{tag}
                </span>
              ))}
            </div>
          </article>
        ))}
      </div>

      {/* Add team hint */}
      <div className="mt-8 text-center">
        <p className="text-xs text-muted-foreground font-mono">
          更多团队持续添加中... 有推荐团队？欢迎提 Issue 或 PR
        </p>
      </div>
    </main>
  )
}
