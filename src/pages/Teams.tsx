import { Link } from 'react-router-dom'
import { ExternalLink, MapPin, Globe, Users } from 'lucide-react'
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
        {teams.map((team) => (
          <article key={team.id} className="card-paper rounded-2xl overflow-hidden">
            <div className="p-6">
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

              {/* Stats */}
              <div className="grid grid-cols-3 gap-3 mb-4">
                <div className="text-center p-2 rounded-lg bg-surface-raised border border-border">
                  <div className="text-lg font-bold text-primary">{team.stats.totalPapers}+</div>
                  <div className="text-xs text-muted-foreground font-mono">论文</div>
                </div>
                <div className="text-center p-2 rounded-lg bg-surface-raised border border-border">
                  <div className="text-lg font-bold text-green-400">{team.stats.topConferences}+</div>
                  <div className="text-xs text-muted-foreground font-mono">顶会</div>
                </div>
                <div className="text-center p-2 rounded-lg bg-surface-raised border border-border">
                  <div className="text-lg font-bold text-yellow-400">{team.stats.students}+</div>
                  <div className="text-xs text-muted-foreground font-mono">学生</div>
                </div>
              </div>

              {/* Professors */}
              <div className="mb-4">
                <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2">PI / 教授</h3>
                <div className="flex flex-wrap gap-2">
                  {team.professors.slice(0, 3).map(p => (
                    <span key={p.nameEn} className="px-2.5 py-1 rounded-full text-xs font-medium bg-primary/10 text-primary border border-primary/20">
                      {p.name}
                    </span>
                  ))}
                  {team.professors.length > 3 && (
                    <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-surface-raised text-muted-foreground border border-border">
                      +{team.professors.length - 3}
                    </span>
                  )}
                </div>
              </div>

              {/* Recent papers preview */}
              <div className="mb-4">
                <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2">最新论文</h3>
                <div className="space-y-1.5">
                  {team.papers.slice(0, 3).map(paper => (
                    <div key={paper.id} className="flex items-center gap-2 text-xs">
                      <span className={cn(
                        'font-mono px-1.5 py-0.5 rounded',
                        paper.highlight ? 'tag-ai' : 'bg-surface-raised text-muted-foreground'
                      )}>
                        {paper.venue}
                      </span>
                      <span className="text-muted-foreground">{paper.year}</span>
                      <span className="text-foreground/80 truncate flex-1">{paper.title}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Tags */}
              <div className="flex flex-wrap gap-1.5 mb-4">
                {team.focusAreas.slice(0, 4).map(area => (
                  <span key={area} className="px-2 py-0.5 rounded text-xs font-mono bg-surface-raised border border-border text-muted-foreground">
                    {area}
                  </span>
                ))}
              </div>

              {/* View detail button */}
              <Link
                to={`/teams/${team.id}`}
                className="inline-flex items-center gap-1.5 text-xs text-primary hover:underline font-medium"
              >
                查看全部论文与学生 →
              </Link>
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