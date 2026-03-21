export type Category = 'AI' | 'Storage' | 'SSD' | 'FileSystem' | 'WeChat' | 'HBM'

export interface Paper {
  id: string
  title: string
  titleZh?: string
  authors: string[]
  venue: string
  year: number
  date: string
  category: Category[]
  abstract: string
  coreContributions: string[]
  archDiagram?: string
  tags: string[]
  url: string
  source: 'dblp' | 'arxiv' | 'wechat'
  sourceLabel: string
  readTime: number // minutes
  isNew?: boolean
}

export interface BlogPost {
  id: string
  title: string
  summary: string
  category: Category[]
  date: string
  content: string
  relatedPapers: string[]
  archDiagram?: string
  tags: string[]
  readTime: number
  isNew?: boolean
}
