import { useState } from 'react'
import { Search, BookOpen, Cpu, Clock, ExternalLink, ChevronRight } from 'lucide-react'
import { cn } from '@/lib/utils'

// NVMe Opcode data
const nvmeOpcodes = [
  {
    category: 'Admin Command Set',
    opcodes: [
      { code: '0x00', name: 'Delete I/O Submission Queue', description: '删除一个 I/O 提交队列', revision: '1.0' },
      { code: '0x01', name: 'Create I/O Submission Queue', description: '创建一个 I/O 提交队列', revision: '1.0' },
      { code: '0x02', name: 'Get Log Page', description: '获取日志页面信息', revision: '1.0' },
      { code: '0x04', name: 'Delete I/O Completion Queue', description: '删除一个 I/O 完成队列', revision: '1.0' },
      { code: '0x05', name: 'Create I/O Completion Queue', description: '创建一个 I/O 完成队列', revision: '1.0' },
      { code: '0x06', name: 'Identify', description: '识别控制器和命名空间结构', revision: '1.0' },
      { code: '0x08', name: 'Abort', description: ' abort 一个命令', revision: '1.0' },
      { code: '0x09', name: 'Set Features', description: '设置特性', revision: '1.0' },
      { code: '0x0A', name: 'Get Features', description: '获取特性', revision: '1.0' },
      { code: '0x10', name: 'Async Event Request', description: '异步事件请求', revision: '1.0' },
      { code: '0x11', name: 'Namespace Management', description: '命名空间管理', revision: '1.1' },
      { code: '0x12', name: 'Fabric Command', description: 'Fabric 命令', revision: '1.4' },
    ]
  },
  {
    category: 'NVM Command Set',
    opcodes: [
      { code: '0x00', name: 'Flush', description: '刷新数据到非易失性介质', revision: '1.0' },
      { code: '0x01', name: 'Write', description: '写入数据到命名空间', revision: '1.0' },
      { code: '0x02', name: 'Read', description: '从命名空间读取数据', revision: '1.0' },
      { code: '0x04', name: 'Write Uncorrectable', description: '写入不可纠正数据', revision: '1.1' },
      { code: '0x05', name: 'Compare', description: '比较数据', revision: '1.1' },
      { code: '0x08', name: 'Write Zeroes', description: '写入零', revision: '1.2' },
      { code: '0x09', name: 'Dataset Management', description: '数据集管理（Trim）', revision: '1.1' },
      { code: '0x0C', name: 'Verify', description: '验证数据', revision: '1.4' },
      { code: '0x10', name: 'Reservation Register', description: '保留注册', revision: '1.5' },
      { code: '0x11', name: 'Reservation Report', description: '保留报告', revision: '1.5' },
    ]
  },
  {
    category: 'Zoned Namespace Command Set',
    opcodes: [
      { code: '0x01', name: 'Zone Management Send', description: '区域管理发送命令', revision: '2.0' },
      { code: '0x02', name: 'Zone Management Receive', description: '区域管理接收命令', revision: '2.0' },
      { code: '0x03', name: 'Zone Append', description: '区域追加写入', revision: '2.0' },
    ]
  },
  {
    category: 'Key Value Command Set',
    opcodes: [
      { code: '0x01', name: 'KV Store', description: '存储键值对', revision: '1.0' },
      { code: '0x02', name: 'KV Retrieve', description: '检索键值对', revision: '1.0' },
      { code: '0x03', name: 'KV Delete', description: '删除键值对', revision: '1.0' },
      { code: '0x04', name: 'KV Format', description: '格式化 KV 命名空间', revision: '1.0' },
    ]
  },
]

// NVMe revision history
const revisionHistory = [
  { version: 'NVMe 2.0', date: '2021-06', highlights: ['模块化架构', '支持多命令集', 'ZNS 正式纳入标准', 'Key Value 命令集'] },
  { version: 'NVMe 1.4', date: '2019-05', highlights: ['持久化区域', 'Sanitize 操作增强', 'Endurance Group', 'NVMe-MI 1.1'] },
  { version: 'NVMe 1.3', date: '2017-11', highlights: ['Boot Partition', 'Sanitize Operation', 'Platinum Namespace', 'Directive'] },
  { version: 'NVMe 1.2', date: '2015-06', highlights: ['Namespace Sharing', 'Doorbell Buffer', 'Interrupt Coalescing'] },
  { version: 'NVMe 1.1', date: '2014-03', highlights: ['End-to-end Data Protection', 'Boot Partition', 'Namespace Sharing'] },
  { version: 'NVMe 1.0', date: '2011-03', highlights: ['初始版本', '基础命令集', '队列机制', '电源管理'] },
]

// NVMe structure sizes
const structureSizes = [
  { name: 'Submission Queue Entry', size: '64 Bytes', description: '提交队列条目大小' },
  { name: 'Completion Queue Entry', size: '16 Bytes', description: '完成队列条目大小' },
  { name: 'Identify Controller', size: '4096 Bytes', description: '控制器识别数据结构' },
  { name: 'Identify Namespace', size: '4096 Bytes', description: '命名空间识别数据结构' },
  { name: 'PRP List', size: 'Up to 4KB', description: '物理区域页面列表' },
  { name: 'Scatter Gather List', size: 'Up to 4KB', description: '分散聚集列表' },
]

export default function NVMeManual() {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<string>('All')

  // Filter opcodes by search query
  const filteredOpcodes = nvmeOpcodes
    .filter(cat => selectedCategory === 'All' || cat.category === selectedCategory)
    .map(cat => ({
      ...cat,
      opcodes: cat.opcodes.filter(op =>
        op.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        op.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        op.code.toLowerCase().includes(searchQuery.toLowerCase())
      )
    }))
    .filter(cat => cat.opcodes.length > 0)

  const categories = ['All', ...nvmeOpcodes.map(c => c.category)]

  return (
    <main className="max-w-6xl mx-auto px-6 py-10 animate-fade-in">
      {/* Header */}
      <div className="mb-10">
        <div className="flex items-center gap-2 mb-3">
          <BookOpen className="w-4 h-4 text-primary" />
          <span className="mono-label text-xs uppercase tracking-widest">技术参考</span>
        </div>
        <h1 className="text-2xl font-bold mb-2 gradient-text">NVMe 协议手册</h1>
        <p className="text-sm text-muted-foreground mb-4">
          NVMe 命令集 Opcode 查询与协议修订历史
        </p>
      </div>

      {/* Search and filter */}
      <div className="mb-6 flex flex-wrap gap-4">
        <div className="flex-1 min-w-64">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="搜索 Opcode、命令名称、描述..."
              className="w-full pl-10 pr-4 py-2 bg-surface border border-border rounded-lg text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-primary/50"
            />
          </div>
        </div>
        <div className="flex gap-2 overflow-x-auto">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={cn(
                'px-3 py-2 rounded-lg text-xs font-medium whitespace-nowrap transition-colors',
                selectedCategory === cat
                  ? 'bg-primary/10 text-primary border border-primary/30'
                  : 'bg-surface text-muted-foreground border border-border hover:text-foreground'
              )}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Opcode tables */}
      {filteredOpcodes.map(cat => (
        <section key={cat.category} className="mb-10">
          <h2 className="text-sm font-semibold uppercase tracking-widest text-muted-foreground mb-4 flex items-center gap-2">
            <Cpu className="w-4 h-4" />
            {cat.category}
          </h2>
          <div className="card-paper rounded-xl overflow-hidden">
            <table className="w-full text-xs">
              <thead className="bg-surface-raised border-b border-border">
                <tr>
                  <th className="text-left py-3 px-4 font-semibold w-24">Opcode</th>
                  <th className="text-left py-3 px-4 font-semibold">命令名称</th>
                  <th className="text-left py-3 px-4 font-semibold hidden sm:table-cell">描述</th>
                  <th className="text-left py-3 px-4 font-semibold w-20">版本</th>
                </tr>
              </thead>
              <tbody>
                {cat.opcodes.map((op, idx) => (
                  <tr key={idx} className="border-b border-border/50 hover:bg-surface/50">
                    <td className="py-3 px-4 font-mono text-primary">{op.code}</td>
                    <td className="py-3 px-4 font-medium">{op.name}</td>
                    <td className="py-3 px-4 text-muted-foreground hidden sm:table-cell">{op.description}</td>
                    <td className="py-3 px-4">
                      <span className="px-2 py-1 rounded bg-surface-raised border border-border text-xs font-mono">
                        {op.revision}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      ))}

      {filteredOpcodes.length === 0 && (
        <div className="text-center py-12 text-muted-foreground">
          <Search className="w-12 h-12 mx-auto mb-3 opacity-20" />
          <p>未找到匹配的 Opcode</p>
        </div>
      )}

      {/* Revision history */}
      <section className="mb-10">
        <h2 className="text-sm font-semibold uppercase tracking-widest text-muted-foreground mb-4 flex items-center gap-2">
          <Clock className="w-4 h-4" />
          协议修订历史
        </h2>
        <div className="space-y-3">
          {revisionHistory.map(rev => (
            <div key={rev.version} className="card-paper rounded-xl p-4">
              <div className="flex items-start justify-between mb-2">
                <div>
                  <h3 className="text-sm font-bold text-primary">{rev.version}</h3>
                  <p className="text-xs text-muted-foreground">{rev.date}</p>
                </div>
              </div>
              <ul className="space-y-1">
                {rev.highlights.map((h, i) => (
                  <li key={i} className="text-xs text-foreground/80 flex items-start gap-2">
                    <ChevronRight className="w-3 h-3 text-primary mt-0.5 flex-shrink-0" />
                    {h}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      {/* Structure sizes */}
      <section className="mb-10">
        <h2 className="text-sm font-semibold uppercase tracking-widest text-muted-foreground mb-4 flex items-center gap-2">
          <Cpu className="w-4 h-4" />
          关键数据结构大小
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {structureSizes.map(item => (
            <div key={item.name} className="card-paper rounded-xl p-4">
              <h3 className="text-xs font-semibold mb-1">{item.name}</h3>
              <div className="flex items-center justify-between mt-2">
                <span className="text-xs font-mono text-primary">{item.size}</span>
                <span className="text-xs text-muted-foreground">{item.description}</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <div className="text-center pt-6 border-t border-border">
        <p className="text-xs text-muted-foreground font-mono mb-4">
          参考资源
        </p>
        <a
          href="https://nvmexpress.org/specifications/"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 text-xs text-primary hover:underline"
        >
          <ExternalLink className="w-3 h-3" />
          NVM Express 官方规范
        </a>
      </div>
    </main>
  )
}
