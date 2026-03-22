import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"
import type { Category } from '@/data/types'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function getCategoryTagClass(cat: Category): string {
  const map: Record<Category, string> = {
    AI: 'tag-ai',
    Storage: 'tag-storage',
    WeChat: 'tag-wechat',
    SSD: 'tag-ssd',
    FileSystem: 'tag-fs',
    HBM: 'tag-ai',
    FAST: 'tag-ai',
    NAND: 'tag-ssd',
    SCM: 'tag-storage',
    Memory: 'tag-ai',
    NVMe: 'tag-ssd',
    SATA: 'tag-ssd',
    'Computational Storage': 'tag-storage',
    IO: 'tag-storage',
  }
  return map[cat] ?? 'tag-storage'
}

export function getCategoryLabel(cat: Category): string {
  const map: Record<Category, string> = {
    AI: 'AI / ML',
    Storage: '存储系统',
    WeChat: '公众号',
    SSD: 'SSD',
    FileSystem: '文件系统',
    HBM: 'HBM',
    FAST: 'FAST',
    NAND: 'NAND',
    SCM: 'SCM',
    Memory: '内存',
    NVMe: 'NVMe',
    SATA: 'SATA',
    'Computational Storage': '计算存储',
    IO: 'IO',
  }
  return map[cat] ?? cat
}

export function formatDate(dateStr: string): string {
  const d = new Date(dateStr)
  return d.toLocaleDateString('zh-CN', { year: 'numeric', month: 'short', day: 'numeric' })
}

export function getSourceIcon(source: 'dblp' | 'arxiv' | 'wechat'): string {
  const map = { dblp: '🔬', arxiv: '📄', wechat: '💬' }
  return map[source]
}
