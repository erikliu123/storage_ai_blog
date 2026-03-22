import { Link } from 'react-router-dom'
import { Clock } from 'lucide-react'
import type { Paper } from '@/data/types'
import { CategoryTag } from '@/components/ui/CategoryTag'
import { formatDate, getSourceIcon } from '@/lib/utils'

interface PaperCardProps {
  paper: Paper
}

export function PaperCard({ paper }: PaperCardProps) {
  return (
    <Link to={`/paper/${paper.id}`} className="block group">
      <article className="card-paper rounded-xl p-5 cursor-pointer animate-fade-in">
        {/* Header row */}
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="flex items-center gap-2 flex-wrap">
            {paper.isNew && (
              <span className="inline-flex items-center gap-1.5 rounded-full px-2 py-0.5 text-xs font-medium tag-storage">
                <span className="live-dot animate-pulse-dot" />
                NEW
              </span>
            )}
            {paper.category.slice(0, 2).map(cat => (
              <CategoryTag key={cat} category={cat} />
            ))}
          </div>
          <span className="mono-label whitespace-nowrap flex-shrink-0">
            {getSourceIcon(paper.source)} {paper.sourceLabel}
          </span>
        </div>

        {/* Title */}
        <h3 className="text-base font-semibold leading-snug mb-1 text-foreground group-hover:text-primary transition-colors">
          {paper.titleZh ?? paper.title}
        </h3>
        {paper.titleZh && (
          <p className="text-xs font-mono text-muted-foreground mb-2 leading-relaxed truncate">
            {paper.title}
          </p>
        )}

        {/* Abstract */}
        <p className="text-sm text-muted-foreground leading-relaxed mb-4 line-clamp-2">
          {paper.abstract}
        </p>

        {/* Tags */}
        <div className="flex flex-wrap gap-1.5 mb-4">
          {paper.tags.slice(0, 4).map(tag => (
            <span key={tag} className="px-2 py-0.5 rounded text-xs font-mono bg-surface-raised text-muted-foreground border border-border">
              {tag}
            </span>
          ))}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <div className="flex items-center gap-3">
            <span className="font-mono">{formatDate(paper.date)}</span>
            <span className="text-border">·</span>
            <span>{paper.authors[0]}{paper.authors.length > 1 ? ` +${paper.authors.length - 1}` : ''}</span>
          </div>
          <div className="flex items-center gap-1">
            <Clock className="w-3 h-3" />
            <span>{paper.readTime} min</span>
          </div>
        </div>
      </article>
    </Link>
  )
}
