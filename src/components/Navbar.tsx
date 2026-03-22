import { Link, useLocation } from 'react-router-dom'
import { BookOpen, Rss, GitBranch, Search, Users, Award } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useState } from 'react'

const navItems = [
  { href: '/', label: '论文列表', icon: BookOpen },
  { href: '/fast2026', label: 'FAST 2026', icon: Award },
  { href: '/osdi2025', label: 'OSDI 2025', icon: Award },
  { href: '/atc2024', label: 'ATC 2024', icon: Award },
  { href: '/teams', label: '研究团队', icon: Users },
  { href: '/archive', label: 'Git 归档', icon: GitBranch },
]

export function Navbar() {
  const location = useLocation()
  const [searchOpen, setSearchOpen] = useState(false)

  return (
    <header className="sticky top-0 z-40 border-b border-border bg-background/80 backdrop-blur-md">
      <div className="max-w-6xl mx-auto px-6 h-14 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2.5 group">
          <div className="w-7 h-7 rounded-lg flex items-center justify-center"
            style={{ background: 'hsl(var(--primary-muted))', border: '1px solid hsl(var(--primary) / 0.3)' }}>
            <span className="text-sm font-bold gradient-text">S</span>
          </div>
          <span className="font-semibold text-sm tracking-tight">
            StorageAI<span className="text-muted-foreground font-normal"> Reader</span>
          </span>
        </Link>

        {/* Nav links */}
        <nav className="flex items-center gap-1">
          {navItems.map(item => {
            const isActive = location.pathname === item.href
            return (
              <Link
                key={item.href}
                to={item.href}
                className={cn(
                  'flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-all duration-150',
                  isActive
                    ? 'bg-primary/10 text-primary'
                    : 'text-muted-foreground hover:text-foreground hover:bg-surface'
                )}
              >
                <item.icon className="w-3.5 h-3.5" />
                {item.label}
              </Link>
            )
          })}
        </nav>

        {/* Search */}
        <button
          onClick={() => setSearchOpen(!searchOpen)}
          className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-border text-sm text-muted-foreground hover:text-foreground hover:border-primary/30 transition-all"
        >
          <Search className="w-3.5 h-3.5" />
          <span className="hidden sm:inline text-xs">搜索...</span>
          <span className="hidden sm:inline font-mono text-xs bg-surface px-1.5 py-0.5 rounded border border-border">⌘K</span>
        </button>
      </div>

      {/* Search bar expand */}
      {searchOpen && (
        <div className="border-t border-border bg-background/95 px-6 py-3">
          <input
            autoFocus
            type="text"
            placeholder="搜索论文标题、关键词..."
            className="w-full bg-surface border border-border rounded-lg px-4 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary/50 focus:border-primary/30"
            onKeyDown={(e) => e.key === 'Escape' && setSearchOpen(false)}
          />
        </div>
      )}
    </header>
  )
}
