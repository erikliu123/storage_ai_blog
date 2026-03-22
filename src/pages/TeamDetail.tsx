import { useParams, Link } from 'react-router-dom'
import { ExternalLink, MapPin, Globe, Users, BookOpen, GraduationCap, Award, TrendingUp } from 'lucide-react'
import { teams } from '@/data/teams'
import { cn } from '@/lib/utils'

export default function TeamDetail() {
  const { id } = useParams<{ id: string }>()
  const team = teams.find(t => t.id === id)

  if (!team) {
    return (
      <div className="max-w-3xl mx-auto px-6 py-20 text-center">
        <p className="text-4xl mb-4">👥</p>
        <p className="text-muted-foreground">团队不存在</p>
        <Link to="/teams" className="mt-4 inline-flex items-center gap-2 text-sm text-primary hover:underline">
          返回团队列表
        </Link>
      </div>
    )
  }

  const papersByYear = team.papers.reduce((acc, p) => {
    if (!acc[p.year]) acc[p.year] = []
    acc[p.year].push(p)
    return acc
  }, {} as Record<number, typeof team.papers>)

  const years = Object.keys(papersByYear).map(Number).sort((a, b) => b - a)

  return (
    <main className="max-w-5xl mx-auto px-6 py-10 animate-fade-in">
      {/* Header */}
      <div className="mb-8">
        <Link to="/teams" className="text-sm text-muted-foreground hover:text-foreground mb-4 inline-flex items-center gap-1">
          ← 返回团队列表
        </Link>

        <div className="flex items-center gap-2 mt-4 mb-2">
          <span className="text-xs font-mono px-2 py-0.5 rounded bg-surface-raised border border-border text-muted-foreground">
            {team.institutionShort}
          </span>
          <span className="flex items-center gap-1 text-xs text-muted-foreground">
            <MapPin className="w-3 h-3" />
            {team.location}
          </span>
        </div>

        <h1 className="text-2xl font-bold mb-1 gradient-text">{team.name}</h1>
        <p className="text-xs font-mono text-muted-foreground mb-4">{team.nameEn}</p>

        <p className="text-sm text-muted-foreground leading-relaxed mb-4">{team.description}</p>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-3 mb-6">
          <div className="card-paper rounded-xl p-4 text-center">
            <div className="text-2xl font-bold text-primary mb-1">{team.stats.totalPapers}+</div>
            <div className="text-xs text-muted-foreground font-mono">发表论文</div>
          </div>
          <div className="card-paper rounded-xl p-4 text-center">
            <div className="text-2xl font-bold text-green-400 mb-1">{team.stats.topConferences}+</div>
            <div className="text-xs text-muted-foreground font-mono">顶会论文</div>
          </div>
          <div className="card-paper rounded-xl p-4 text-center">
            <div className="text-2xl font-bold text-yellow-400 mb-1">{team.stats.students}+</div>
            <div className="text-xs text-muted-foreground font-mono">在读学生</div>
          </div>
        </div>

        {/* Website */}
        <a
          href={team.website}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium border border-primary/30 text-primary hover:bg-primary/10 transition-colors"
        >
          <Globe className="w-4 h-4" />
          访问官网
          <ExternalLink className="w-3 h-3" />
        </a>
      </div>

      {/* Professors */}
      <section className="mb-8">
        <h2 className="flex items-center gap-2 text-sm font-semibold uppercase tracking-widest text-muted-foreground mb-4">
          <Users className="w-4 h-4" />
          教师团队
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {team.professors.map(p => (
            <div key={p.nameEn} className="card-paper rounded-xl p-4">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold text-primary bg-primary/10 border border-primary/20">
                  {p.name[0]}
                </div>
                <div>
                  <div className="text-sm font-semibold">{p.name}</div>
                  <div className="text-xs text-muted-foreground font-mono">{p.nameEn}</div>
                </div>
              </div>
              <div className="flex flex-wrap gap-1">
                {p.research?.map(r => (
                  <span key={r} className="px-2 py-0.5 rounded text-xs bg-surface-raised border border-border text-muted-foreground">
                    {r}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Students */}
      <section className="mb-8">
        <h2 className="flex items-center gap-2 text-sm font-semibold uppercase tracking-widest text-muted-foreground mb-4">
          <GraduationCap className="w-4 h-4" />
          学生成员 ({team.students.length})
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2">
          {team.students.map(s => (
            <div key={s.nameEn} className="card-paper rounded-lg p-3">
              <div className="text-sm font-medium mb-1">{s.name}</div>
              <div className="text-xs text-muted-foreground font-mono mb-1">{s.nameEn} · {s.year}级</div>
              <div className="flex flex-wrap gap-1">
                {s.research?.map(r => (
                  <span key={r} className="px-1.5 py-0.5 rounded text-xs bg-surface-raised text-muted-foreground">
                    {r}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Research Areas */}
      <section className="mb-8">
        <h2 className="text-sm font-semibold uppercase tracking-widest text-muted-foreground mb-4">研究方向</h2>
        <div className="flex flex-wrap gap-2">
          {team.focusAreas.map(area => (
            <span key={area} className="px-3 py-1.5 rounded-lg text-sm font-mono bg-primary/10 text-primary border border-primary/20">
              {area}
            </span>
          ))}
        </div>
      </section>

      {/* Papers */}
      <section>
        <h2 className="flex items-center gap-2 text-sm font-semibold uppercase tracking-widest text-muted-foreground mb-4">
          <BookOpen className="w-4 h-4" />
          代表性论文 ({team.papers.length})
        </h2>

        {years.map(year => (
          <div key={year} className="mb-6">
            <h3 className="text-xs font-mono font-bold text-muted-foreground mb-3 flex items-center gap-2">
              <span className="w-8 h-px bg-border" />
              {year} 年
              <span className="text-xs">({papersByYear[year].length} 篇)</span>
            </h3>
            <div className="space-y-2">
              {papersByYear[year].map((paper, idx) => (
                <div
                  key={paper.id}
                  className={cn(
                    'card-paper rounded-xl p-4 flex items-start gap-3',
                    paper.highlight && 'ring-1 ring-primary/20'
                  )}
                >
                  <span className="flex-shrink-0 w-5 h-5 rounded flex items-center justify-center text-xs font-mono text-muted-foreground bg-surface-raised border border-border">
                    {idx + 1}
                  </span>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <h4 className="text-sm font-medium text-foreground leading-snug">{paper.title}</h4>
                      {paper.highlight && (
                        <span className="flex-shrink-0 tag-storage rounded-full px-2 py-0.5 text-xs font-mono">重点</span>
                      )}
                    </div>
                    <div className="flex items-center gap-2 mt-1.5 text-xs text-muted-foreground">
                      <span className="font-mono tag-ai rounded px-1.5 py-0.5">{paper.venue}</span>
                      <span>·</span>
                      <span>{paper.authors.slice(0, 3).join(', ')}{paper.authors.length > 3 && ' et al.'}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </section>
    </main>
  )
}