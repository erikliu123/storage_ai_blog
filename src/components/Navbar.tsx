import { Link, useLocation } from 'react-router-dom'
import { BookOpen, GitBranch, Search, Users, Award, Bug, Zap, AlertOctagon, ChevronDown, Database, Clock } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useState, useRef, useEffect } from 'react'
import { SearchModal } from '@/components/SearchModal'

const navItems = [
  { href: '/', label: '论文', icon: BookOpen },
  { href: '/fast2026', label: 'FAST 2026', icon: Award },
  { href: '/fast-archive', label: 'FAST 历年', icon: Clock },
  { href: '/osdi2025', label: 'OSDI', icon: Award },
  { href: '/atc2024', label: 'ATC', icon: Award },
]

const moreItems = [
  { href: '/asplos2025', label: 'ASPLOS', icon: Award },
  { href: '/sigmod2025', label: 'SIGMOD', icon: Award },
  { href: '/nvme-manual', label: 'NVMe 手册', icon: BookOpen },
  { href: '/distributed-storage', label: '分布式存储', icon: Database },
  { href: '/rocksdb-special', label: 'RocksDB 专题', icon: Database },
  { href: '/opensource', label: '开源存储库', icon: Database },
  { href: '/linux-bugfix', label: 'Linux Bugfix', icon: Bug },
  { href: '/spdk', label: 'SPDK 更新', icon: Zap },
  { href: '/faults', label: '存储故障', icon: AlertOctagon },
  { href: '/teams', label: '研究团队', icon: Users },
  { href: '/archive', label: 'Git 归档', icon: GitBranch },
]

export function Navbar() {
  const location = useLocation()
  const [moreOpen, setMoreOpen] = useState(false)
  const moreRef = useRef<HTMLDivElement>(null)

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (moreRef.current && !moreRef.current.contains(event.target as Node)) {
        setMoreOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const isMoreActive = moreItems.some(item => location.pathname === item.href)

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

          {/* More dropdown */}
          <div className="relative" ref={moreRef}>
            <button
              onClick={() => setMoreOpen(!moreOpen)}
              className={cn(
                'flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-all duration-150',
                isMoreActive
                  ? 'bg-primary/10 text-primary'
                  : 'text-muted-foreground hover:text-foreground hover:bg-surface'
              )}
            >
              更多
              <ChevronDown className={cn('w-3.5 h-3.5 transition-transform', moreOpen && 'rotate-180')} />
            </button>

            {moreOpen && (
              <div className="absolute right-0 top-full mt-1 w-48 bg-surface border border-border rounded-lg shadow-lg overflow-hidden z-50">
                {moreItems.map(item => {
                  const isActive = location.pathname === item.href
                  return (
                    <Link
                      key={item.href}
                      to={item.href}
                      onClick={() => setMoreOpen(false)}
                      className={cn(
                        'flex items-center gap-2 px-3 py-2 text-sm transition-colors',
                        isActive
                          ? 'bg-primary/10 text-primary'
                          : 'text-muted-foreground hover:text-foreground hover:bg-surface-raised'
                      )}
                    >
                      <item.icon className="w-3.5 h-3.5" />
                      {item.label}
                    </Link>
                  )
                })}
              </div>
            )}
          </div>
        </nav>

        {/* Search */}
        <button
          onClick={() => {
            const event = new KeyboardEvent('keydown', { key: 'k', metaKey: true })
            document.dispatchEvent(event)
          }}
          className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-border text-sm text-muted-foreground hover:text-foreground hover:border-primary/30 transition-all"
        >
          <Search className="w-3.5 h-3.5" />
          <span className="hidden sm:inline text-xs">搜索...</span>
          <span className="hidden sm:inline font-mono text-xs bg-surface px-1.5 py-0.5 rounded border border-border">⌘K</span>
        </button>
      </div>

      <SearchModal />
    </header>
  )
}
