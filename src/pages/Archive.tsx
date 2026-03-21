import { GitBranch, GitCommit, Terminal, CheckCircle2, FileText } from 'lucide-react'

const commits = [
  { hash: 'a3f8c12', date: '2026-03-18', message: 'feat: add FAST 2026 ZNS-Aware FS paper', papers: 2, type: 'feat' },
  { hash: 'b7e2d09', date: '2026-03-17', message: 'feat: add HBM checkpoint paper + arch diagram', papers: 1, type: 'feat' },
  { hash: 'c1a9e45', date: '2026-03-16', message: 'feat: add io_uring KV store FAST 2026', papers: 1, type: 'feat' },
  { hash: 'd4f3b88', date: '2026-03-15', message: 'feat: add WiscKey-2 FAST 2026 paper', papers: 1, type: 'feat' },
  { hash: 'e8c2f01', date: '2025-12-01', message: 'feat: add FlashAttention-IO arXiv paper', papers: 1, type: 'feat' },
  { hash: 'f5d7a23', date: '2025-11-20', message: 'feat: add F2FS 存储随笔 post', papers: 1, type: 'feat' },
  { hash: '0a1b3c5', date: '2025-10-08', message: 'feat: add OCP NVMe 王知鱼 post', papers: 1, type: 'feat' },
  { hash: '1e9f2d7', date: '2025-09-15', message: 'feat: add MoE expert offloading arXiv', papers: 1, type: 'feat' },
]

const workflowSteps = [
  {
    step: '01',
    title: '每日抓取',
    desc: 'Python 脚本定时拉取 DBLP / arXiv RSS、公众号文章',
    code: 'python scripts/fetch_papers.py --date today',
    icon: Terminal,
  },
  {
    step: '02',
    title: 'AI 梳理',
    desc: '百炼 Coding Plan 提取核心贡献、生成架构图描述',
    code: 'python scripts/summarize.py --model qwen3-coder',
    icon: FileText,
  },
  {
    step: '03',
    title: 'Git 归档',
    desc: '自动写入数据文件并 commit，保留完整历史',
    code: 'git add . && git commit -m "feat: daily update $(date +%Y-%m-%d)"',
    icon: GitCommit,
  },
  {
    step: '04',
    title: '部署上线',
    desc: 'Vercel / GitHub Pages 自动触发 CI/CD 重新构建',
    code: 'git push origin main  # triggers auto-deploy',
    icon: CheckCircle2,
  },
]

export default function Archive() {
  return (
    <main className="max-w-3xl mx-auto px-6 py-10 animate-fade-in">
      {/* Header */}
      <div className="mb-10">
        <div className="flex items-center gap-2 mb-3">
          <GitBranch className="w-4 h-4 text-muted-foreground" />
          <span className="mono-label text-xs uppercase tracking-widest">Git Archive</span>
        </div>
        <h1 className="text-2xl font-bold mb-2 gradient-text">归档管理</h1>
        <p className="text-sm text-muted-foreground">
          每次内容更新后自动 Git commit，完整记录论文阅读历史
        </p>
      </div>

      {/* Workflow */}
      <section className="mb-12">
        <h2 className="text-sm font-semibold uppercase tracking-widest text-muted-foreground mb-5">自动化工作流</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {workflowSteps.map(step => (
            <div key={step.step} className="card-paper rounded-xl p-5">
              <div className="flex items-start gap-3 mb-3">
                <span className="text-xs font-mono font-bold text-muted-foreground bg-surface-raised px-2 py-0.5 rounded border border-border">{step.step}</span>
                <div>
                  <div className="text-sm font-semibold mb-0.5">{step.title}</div>
                  <div className="text-xs text-muted-foreground">{step.desc}</div>
                </div>
              </div>
              <code className="block text-xs font-mono bg-background rounded-lg px-3 py-2 border border-border text-primary/80 overflow-x-auto scroll-area whitespace-nowrap">
                $ {step.code}
              </code>
            </div>
          ))}
        </div>
      </section>

      {/* Commit log */}
      <section>
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-sm font-semibold uppercase tracking-widest text-muted-foreground">提交历史</h2>
          <span className="mono-label text-xs">main branch</span>
        </div>

        <div className="rounded-xl border border-border overflow-hidden">
          {/* Git log header */}
          <div className="bg-surface-raised px-4 py-2.5 border-b border-border flex items-center gap-2">
            <div className="flex gap-1.5">
              <div className="w-2.5 h-2.5 rounded-full bg-destructive/50" />
              <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/50" />
              <div className="w-2.5 h-2.5 rounded-full" style={{ background: 'hsl(160 70% 45% / 0.5)' }} />
            </div>
            <span className="text-xs font-mono text-muted-foreground ml-2">git log --oneline</span>
          </div>

          {/* Commits */}
          <div className="divide-y divide-border">
            {commits.map((commit, i) => (
              <div key={commit.hash} className="flex items-start gap-4 px-4 py-3 hover:bg-surface transition-colors group">
                {/* Hash */}
                <code className="flex-shrink-0 text-xs font-mono text-primary/70 w-16">{commit.hash}</code>
                {/* Message */}
                <div className="flex-1 min-w-0">
                  <span className="text-xs font-mono text-foreground/85 group-hover:text-foreground transition-colors">
                    {commit.message}
                  </span>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span className="text-xs text-muted-foreground font-mono">{commit.date}</span>
                    <span className="text-xs text-muted-foreground">· {commit.papers} 篇</span>
                  </div>
                </div>
                {i === 0 && (
                  <span className="flex-shrink-0 tag-storage rounded-full px-2 py-0.5 text-xs font-mono">HEAD</span>
                )}
              </div>
            ))}
          </div>
        </div>

        <p className="text-xs text-muted-foreground font-mono mt-3 text-center">
          共 {commits.length} 次提交 · {commits.reduce((s, c) => s + c.papers, 0)} 篇文章归档
        </p>
      </section>
    </main>
  )
}
