import { Search, X, FileText, ExternalLink } from 'lucide-react'
import { useState, useEffect, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { cn } from '@/lib/utils'
import type { ArchivePaperData } from '@/data/fastArchive'

// Import all paper data
import { fast2026Papers } from '@/data/fast2026'
import { allArchivePapers } from '@/data/fastArchive'
import { osdi2025Papers, atc2024Papers } from '@/data/conferences'
import { asplos2025Papers } from '@/data/asplos2025'
import { sigmod2025Papers } from '@/data/sigmod2025'

interface SearchResult {
  id: string
  title: string
  conference: string
  authors: string[]
  summary: string
  keywords: string[]
  route: string
}

export function SearchModal() {
  const [isOpen, setIsOpen] = useState(false)
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<SearchResult[]>([])
  const [selectedIndex, setSelectedIndex] = useState(0)
  const navigate = useNavigate()

  // Toggle search modal with Cmd+K or Ctrl+K
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault()
        setIsOpen(prev => !prev)
      }
      if (e.key === 'Escape') {
        setIsOpen(false)
      }
    }
    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [])

  // Search function
  const search = useCallback((searchQuery: string) => {
    if (!searchQuery.trim()) {
      setResults([])
      return
    }

    const queryLower = searchQuery.toLowerCase()
    const allResults: SearchResult[] = []

    // Search FAST 2026
    fast2026Papers.forEach(paper => {
      if (
        paper.title.toLowerCase().includes(queryLower) ||
        paper.summary.toLowerCase().includes(queryLower) ||
        paper.keywords.some(k => k.toLowerCase().includes(queryLower)) ||
        paper.authors.some(a => a.toLowerCase().includes(queryLower))
      ) {
        allResults.push({
          id: paper.id,
          title: paper.title,
          conference: 'FAST 2026',
          authors: paper.authors,
          summary: paper.summary,
          keywords: paper.keywords,
          route: `/fast2026#${paper.id}`,
        })
      }
    })

    // Search FAST Archive
    allArchivePapers.forEach((paper: ArchivePaperData) => {
      if (
        paper.title.toLowerCase().includes(queryLower) ||
        paper.summary.toLowerCase().includes(queryLower) ||
        paper.keywords.some((k: string) => k.toLowerCase().includes(queryLower))
      ) {
        allResults.push({
          id: paper.id,
          title: paper.title,
          conference: `FAST ${paper.year}`,
          authors: paper.authors,
          summary: paper.summary,
          keywords: paper.keywords,
          route: `/fast-archive#paper-${paper.id}`,
        })
      }
    })

    // Search OSDI 2025
    osdi2025Papers.forEach(paper => {
      if (
        paper.title.toLowerCase().includes(queryLower) ||
        paper.summary.toLowerCase().includes(queryLower) ||
        paper.keywords.some(k => k.toLowerCase().includes(queryLower))
      ) {
        allResults.push({
          id: paper.id,
          title: paper.title,
          conference: 'OSDI 2025',
          authors: paper.authors,
          summary: paper.summary,
          keywords: paper.keywords,
          route: `/osdi2025#${paper.id}`,
        })
      }
    })

    // Search ATC 2024
    atc2024Papers.forEach(paper => {
      if (
        paper.title.toLowerCase().includes(queryLower) ||
        paper.summary.toLowerCase().includes(queryLower) ||
        paper.keywords.some(k => k.toLowerCase().includes(queryLower))
      ) {
        allResults.push({
          id: paper.id,
          title: paper.title,
          conference: 'ATC 2024',
          authors: paper.authors,
          summary: paper.summary,
          keywords: paper.keywords,
          route: `/atc2024#${paper.id}`,
        })
      }
    })

    // Search ASPLOS 2025
    asplos2025Papers.forEach(paper => {
      if (
        paper.title.toLowerCase().includes(queryLower) ||
        paper.summary.toLowerCase().includes(queryLower) ||
        paper.keywords.some(k => k.toLowerCase().includes(queryLower))
      ) {
        allResults.push({
          id: paper.id,
          title: paper.title,
          conference: 'ASPLOS 2025',
          authors: paper.authors,
          summary: paper.summary,
          keywords: paper.keywords,
          route: `/asplos2025#${paper.id}`,
        })
      }
    })

    // Search SIGMOD 2025
    sigmod2025Papers.forEach(paper => {
      if (
        paper.title.toLowerCase().includes(queryLower) ||
        paper.summary.toLowerCase().includes(queryLower) ||
        paper.keywords.some(k => k.toLowerCase().includes(queryLower))
      ) {
        allResults.push({
          id: paper.id,
          title: paper.title,
          conference: 'SIGMOD 2025',
          authors: paper.authors,
          summary: paper.summary,
          keywords: paper.keywords,
          route: `/sigmod2025#${paper.id}`,
        })
      }
    })

    setResults(allResults.slice(0, 20)) // Limit to 20 results
    setSelectedIndex(0)
  }, [])

  // Handle query change
  useEffect(() => {
    const debounceTimer = setTimeout(() => {
      search(query)
    }, 150)
    return () => clearTimeout(debounceTimer)
  }, [query, search])

  // Navigate to selected result
  const selectResult = (index: number) => {
    if (results[index]) {
      navigate(results[index].route)
      setIsOpen(false)
      setQuery('')
    }
  }

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return
      
      if (e.key === 'ArrowDown') {
        e.preventDefault()
        setSelectedIndex(prev => Math.min(prev + 1, results.length - 1))
      } else if (e.key === 'ArrowUp') {
        e.preventDefault()
        setSelectedIndex(prev => Math.max(prev - 1, 0))
      } else if (e.key === 'Enter' && results.length > 0) {
        e.preventDefault()
        selectResult(selectedIndex)
      }
    }
    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [isOpen, selectedIndex, results])

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-24 bg-black/50 backdrop-blur-sm" onClick={() => setIsOpen(false)}>
      <div 
        className="w-full max-w-2xl bg-background rounded-xl shadow-2xl border border-border overflow-hidden animate-scale-in"
        onClick={e => e.stopPropagation()}
      >
        {/* Search input */}
        <div className="flex items-center gap-3 px-4 py-3 border-b border-border">
          <Search className="w-5 h-5 text-muted-foreground flex-shrink-0" />
          <input
            autoFocus
            type="text"
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="搜索论文标题、关键词、作者..."
            className="flex-1 bg-transparent text-sm text-foreground placeholder:text-muted-foreground focus:outline-none"
          />
          {query && (
            <button onClick={() => setQuery('')} className="text-muted-foreground hover:text-foreground">
              <X className="w-4 h-4" />
            </button>
          )}
          <span className="text-xs font-mono text-muted-foreground bg-surface px-1.5 py-0.5 rounded border border-border">ESC</span>
        </div>

        {/* Search results */}
        <div className="max-h-[60vh] overflow-y-auto">
          {results.length === 0 && query.trim() && (
            <div className="px-4 py-8 text-center text-sm text-muted-foreground">
              未找到匹配的论文
            </div>
          )}
          
          {results.map((result, index) => (
            <button
              key={result.id}
              onClick={() => selectResult(index)}
              className={cn(
                'w-full px-4 py-3 text-left border-b border-border/50 hover:bg-surface transition-colors',
                index === selectedIndex && 'bg-primary/5'
              )}
            >
              <div className="flex items-start gap-3">
                <FileText className={cn(
                  'w-4 h-4 mt-0.5 flex-shrink-0',
                  index === selectedIndex ? 'text-primary' : 'text-muted-foreground'
                )} />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs font-semibold text-primary">{result.conference}</span>
                    <h3 className={cn(
                      'text-sm font-medium truncate',
                      index === selectedIndex ? 'text-primary' : 'text-foreground'
                    )}>
                      {result.title}
                    </h3>
                  </div>
                  <p className="text-xs text-muted-foreground truncate mb-1">
                    {result.authors.slice(0, 3).join(', ')}{result.authors.length > 3 && ` +${result.authors.length - 3}`}
                  </p>
                  <div className="flex flex-wrap gap-1">
                    {result.keywords.slice(0, 3).map(kw => (
                      <span key={kw} className="text-xs text-muted-foreground bg-surface-raised px-1.5 py-0.5 rounded">
                        {kw}
                      </span>
                    ))}
                  </div>
                </div>
                <ExternalLink className="w-3.5 h-3.5 text-muted-foreground flex-shrink-0" />
              </div>
            </button>
          ))}
        </div>

        {/* Footer */}
        <div className="px-4 py-2 border-t border-border bg-surface/50">
          <div className="flex items-center gap-4 text-xs text-muted-foreground">
            <span className="flex items-center gap-1">
              <kbd className="px-1.5 py-0.5 bg-surface-raised rounded border border-border">↓</kbd>
              <kbd className="px-1.5 py-0.5 bg-surface-raised rounded border border-border">↑</kbd>
              <span>导航</span>
            </span>
            <span className="flex items-center gap-1">
              <kbd className="px-1.5 py-0.5 bg-surface-raised rounded border border-border">Enter</kbd>
              <span>打开</span>
            </span>
            <span className="flex items-center gap-1">
              <kbd className="px-1.5 py-0.5 bg-surface-raised rounded border border-border">ESC</kbd>
              <span>关闭</span>
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}
