import { useParams, Link } from 'react-router-dom'
import { papers } from '@/data/papers'
import { CategoryTag } from '@/components/ui/CategoryTag'
import { formatDate, getSourceIcon } from '@/lib/utils'
import { ArrowLeft, Clock, ExternalLink, CheckCircle2, BookOpen } from 'lucide-react'

export default function PaperDetail() {
  const { id } = useParams<{ id: string }>()
  const paper = papers.find(p => p.id === id)

  if (!paper) {
    return (
      <div className="max-w-3xl mx-auto px-6 py-20 text-center">
        <p className="text-4xl mb-4">📄</p>
        <p className="text-muted-foreground">论文不存在</p>
        <Link to="/" className="mt-4 inline-flex items-center gap-2 text-sm text-primary hover:underline">
          <ArrowLeft className="w-4 h-4" /> 返回列表
        </Link>
      </div>
    )
  }

  return (
    <main className="max-w-3xl mx-auto px-6 py-10 animate-fade-in">
      {/* Back */}
      <Link to="/" className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground mb-8 group transition-colors">
        <ArrowLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
        返回论文列表
      </Link>

      {/* Title block */}
      <div className="mb-8">
        <div className="flex flex-wrap items-center gap-2 mb-4">
          {paper.isNew && (
            <span className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium tag-storage">
              <span className="live-dot animate-pulse-dot" />
              最新
            </span>
          )}
          {paper.category.map(cat => (
            <CategoryTag key={cat} category={cat} size="md" />
          ))}
        </div>

        <h1 className="text-2xl font-bold leading-tight mb-2 text-foreground">
          {paper.titleZh ?? paper.title}
        </h1>
        {paper.titleZh && (
          <p className="text-sm font-mono text-muted-foreground mb-4">{paper.title}</p>
        )}

        <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
          <span className="font-mono">{getSourceIcon(paper.source)} {paper.sourceLabel}</span>
          <span>·</span>
          <span>{formatDate(paper.date)}</span>
          <span>·</span>
          <span className="flex items-center gap-1">
            <Clock className="w-3.5 h-3.5" />
            {paper.readTime} min read
          </span>
        </div>

        <div className="flex flex-wrap gap-1.5 mt-3">
          {paper.authors.map(author => (
            <span key={author} className="px-2.5 py-1 rounded-full text-xs bg-surface-raised border border-border text-muted-foreground">
              {author}
            </span>
          ))}
        </div>
      </div>

      {/* Divider */}
      <div className="border-t border-border mb-8" />

      {/* Abstract */}
      <section className="mb-8">
        <h2 className="flex items-center gap-2 text-sm font-semibold uppercase tracking-widest text-muted-foreground mb-4">
          <BookOpen className="w-4 h-4" />
          摘要
        </h2>
        <p className="text-sm leading-relaxed text-foreground/85 bg-surface rounded-xl p-5 border border-border">
          {paper.abstract}
        </p>
      </section>

      {/* Core contributions */}
      <section className="mb-8">
        <h2 className="flex items-center gap-2 text-sm font-semibold uppercase tracking-widest text-muted-foreground mb-4">
          <CheckCircle2 className="w-4 h-4" />
          核心贡献
        </h2>
        <div className="space-y-3">
          {paper.coreContributions.map((contrib, i) => (
            <div key={i} className="flex items-start gap-3 p-4 rounded-xl bg-surface border border-border hover:border-primary/20 transition-colors">
              <span className="flex-shrink-0 w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold font-mono"
                style={{ background: 'hsl(var(--primary-muted))', color: 'hsl(var(--primary))' }}>
                {i + 1}
              </span>
              <p className="text-sm leading-relaxed text-foreground/85">{contrib}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Architecture diagram */}
      {paper.archDiagram && (
        <section className="mb-8">
          <h2 className="text-sm font-semibold uppercase tracking-widest text-muted-foreground mb-4">
            系统架构图
          </h2>
          <div className="rounded-xl overflow-hidden border border-border">
            <img
              src={paper.archDiagram}
              alt={`${paper.titleZh ?? paper.title} 架构图`}
              className="w-full"
              loading="lazy"
            />
          </div>
          <p className="text-xs text-muted-foreground mt-2 text-center font-mono">
            图：{paper.titleZh ?? paper.title} 系统架构
          </p>
        </section>
      )}

      {/* Tags */}
      <section className="mb-8">
        <div className="flex flex-wrap gap-2">
          {paper.tags.map(tag => (
            <span key={tag} className="px-3 py-1 rounded-lg text-xs font-mono bg-surface-raised border border-border text-muted-foreground hover:border-primary/20 hover:text-foreground transition-colors">
              #{tag}
            </span>
          ))}
        </div>
      </section>

      {/* External link */}
      <div className="border-t border-border pt-6">
        <a
          href={paper.url}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium border border-primary/30 text-primary hover:bg-primary/10 transition-colors"
        >
          <ExternalLink className="w-4 h-4" />
          查看原始论文 ({paper.sourceLabel})
        </a>
      </div>
    </main>
  )
}
