import { cn } from '@/lib/utils'
import type { Category } from '@/data/types'
import { getCategoryTagClass, getCategoryLabel } from '@/lib/utils'

interface CategoryTagProps {
  category: Category
  size?: 'sm' | 'md'
  className?: string
}

export function CategoryTag({ category, size = 'sm', className }: CategoryTagProps) {
  return (
    <span
      className={cn(
        getCategoryTagClass(category),
        'inline-flex items-center rounded-full font-mono font-medium tracking-wide',
        size === 'sm' ? 'px-2 py-0.5 text-xs' : 'px-3 py-1 text-sm',
        className,
      )}
    >
      {getCategoryLabel(category)}
    </span>
  )
}
