import { useState } from 'react'
import { Search, BookOpen, Cpu, Clock, ExternalLink, ChevronRight, Layers, HardDrive } from 'lucide-react'
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
      { code: '0x08', name: 'Abort', description: 'abort 一个命令', revision: '1.0' },
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

// 64-byte Submission Queue Entry structure
const sqeStructure = [
  {
    dword: 'DW00',
    name: 'Command Dword 0',
    fields: [
      { bits: '[15:00]', name: 'Command Identifier (CID)', description: '命令唯一标识符，主机分配，用于匹配命令和完成' },
      { bits: '[31:16]', name: 'Reserved', description: '保留字段' },
    ]
  },
  {
    dword: 'DW01',
    name: 'Command Dword 1',
    fields: [
      { bits: '[07:00]', name: 'Opcode (OPC)', description: '命令操作码，定义命令类型' },
      { bits: '[09:08]', name: 'Fuse', description: '融合操作：00-普通，01-比较并写，10-保留' },
      { bits: '[10]', name: 'Reserved', description: '保留' },
      { bits: '[11]', name: 'PSDT', description: 'PRP/SGL 数据传送选择：00-PRP，01-PRP 偏移，10-SGL，11-保留' },
      { bits: '[15]', name: 'Command Identifier (CID) High', description: 'CID 高位（某些实现）' },
      { bits: '[31:16]', name: 'Reserved', description: '保留字段' },
    ]
  },
  {
    dword: 'DW02',
    name: 'Namespace Identifier (NSID)',
    fields: [
      { bits: '[31:00]', name: 'NSID', description: '命名空间标识符，0xFFFFFFFF 表示未指定' },
    ]
  },
  {
    dword: 'DW03',
    name: 'Reserved',
    fields: [
      { bits: '[31:00]', name: 'RSVD', description: '保留用于未来使用' },
    ]
  },
  {
    dword: 'DW04-DW05',
    name: 'Metadata Pointer (MPTR)',
    fields: [
      { bits: '[63:00]', name: 'Metadata Pointer', description: '指向元数据缓冲区的物理地址（如果有的话）' },
    ]
  },
  {
    dword: 'DW06-DW07',
    name: 'PRP/SGL Pointer 1',
    fields: [
      { bits: '[63:00]', name: 'PRP1 / SGL Address', description: 'PRP 列表地址或 SGL 描述符地址，或内联数据' },
    ]
  },
  {
    dword: 'DW08-DW09',
    name: 'PRP/SGL Pointer 2',
    fields: [
      { bits: '[63:00]', name: 'PRP2 / SGL Offset', description: 'PRP2 地址或 SGL 偏移/长度' },
    ]
  },
  {
    dword: 'DW10-DW15',
    name: 'Command Specific Fields',
    fields: [
      { bits: '[191:00]', name: 'Command Dwords 10-15', description: '命令特定字段，根据 Opcode 不同而不同' },
    ]
  },
]

// Read/Write command specific fields
const rwCommandFields = [
  {
    dword: 'DW10',
    fields: [
      { bits: '[00]', name: 'SGL', description: 'SGL 描述符类型（如果使用 SGL）' },
      { bits: '[09:02]', name: 'Reserved', description: '保留' },
      { bits: '[15:10]', name: 'Attributes', description: '命令属性（如 Force Unit Access, Limited Retry）' },
      { bits: '[31:16]', name: 'Starting LBA (SLBA) Low', description: '起始逻辑块地址低 32 位' },
    ]
  },
  {
    dword: 'DW11',
    fields: [
      { bits: '[31:00]', name: 'Starting LBA (SLBA) High', description: '起始逻辑块地址高 32 位' },
    ]
  },
  {
    dword: 'DW12',
    fields: [
      { bits: '[15:00]', name: 'Number of Logical Blocks (NLB)', description: '传输的逻辑块数量（0-based）' },
      { bits: '[31:16]', name: 'Reserved', description: '保留' },
    ]
  },
  {
    dword: 'DW13',
    fields: [
      { bits: '[15:00]', name: 'Logical Block Reference Tag (LRAT)', description: '逻辑块引用标签（端到端数据保护）' },
      { bits: '[31:16]', name: 'Expected Logical Block Reference Tag', description: '期望的 LRAT（用于校验）' },
    ]
  },
  {
    dword: 'DW14',
    fields: [
      { bits: '[15:00]', name: 'Logical Block Application Tag Mask', description: '逻辑块应用标签掩码' },
      { bits: '[31:16]', name: 'Expected Logical Block Application Tag', description: '期望的应用标签' },
    ]
  },
  {
    dword: 'DW15',
    fields: [
      { bits: '[07:00]', name: 'Logical Block Application Tag', description: '逻辑块应用标签' },
      { bits: '[15:08]', name: 'Reserved', description: '保留' },
      { bits: '[31:16]', name: 'Storage Tag Check', description: '存储标签检查（NVMe 2.0+）' },
    ]
  },
]

// Get Log Page command detailed fields
const getLogPageFields = [
  {
    dword: 'DW10',
    fields: [
      { bits: '[07:00]', name: 'LID (Log Identifier)', description: '日志标识符，定义要读取的日志类型（如 0x00=Reserved, 0x01=Error, 0x02=SMART/Health, 0x03=FW Slot, 0x04=Changed Namespace List 等）' },
      { bits: '[15:08]', name: 'Reserved', description: '保留' },
      { bits: '[31:16]', name: 'NUMD (Number of Dwords)', description: '要传输的数据量（以 DWORD 为单位，0-based）。例如：NUMD=0xFF 表示传输 256 个 DWORD（1024 字节）' },
    ]
  },
  {
    dword: 'DW11',
    fields: [
      { bits: '[00]', name: 'RGO (Return Good)', description: '0b=仅当 LID 有效时返回数据，1b=即使 LID 无效也返回良好完成（NVMe 1.4+）' },
      { bits: '[07:01]', name: 'Reserved', description: '保留' },
      { bits: '[15:08]', name: 'LSP (Log Specific Field)', description: '日志特定字段，含义取决于 LID。例如 SMART/Health 日志：000b=当前值，001b=累计值' },
      { bits: '[31:16]', name: 'LPOL (Log Page Offset Low)', description: '日志页面偏移量的低 16 位（以 DWORD 为单位），用于读取大型日志页面的不同部分' },
    ]
  },
  {
    dword: 'DW12',
    fields: [
      { bits: '[31:00]', name: 'LPOL (Log Page Offset High)', description: '日志页面偏移量的高 32 位，与 DW11.LPOL 组合形成 48 位偏移量' },
    ]
  },
  {
    dword: 'DW13',
    fields: [
      { bits: '[31:00]', name: 'CSI (Command Set Identifier)', description: '命令集标识符（NVMe 2.0+），指定要查询的命令集。0h=NVM, 1h=ZNS, 2h=Key Value' },
    ]
  },
  {
    dword: 'DW14',
    fields: [
      { bits: '[31:00]', name: 'UUID Index', description: 'UUID 索引（NVMe 1.1+），当 LID=0x0E（Vendor Specific）时，指定厂商特定的 UUID' },
    ]
  },
  {
    dword: 'DW15',
    fields: [
      { bits: '[00]', name: 'OT (Offset Type)', description: '0b=LPOL 以 DWORD 为单位，1b=LPOL 以字节为单位（NVMe 2.0+）' },
      { bits: '[31:01]', name: 'Reserved', description: '保留' },
    ]
  },
]

export default function NVMeManual() {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<string>('All')
  const [activeTab, setActiveTab] = useState<'opcodes' | 'structure' | 'prp-sgl' | 'get-log' | 'metadata'>('opcodes')

  // Filter opcodes by search query
  const filteredOpcodes = nvmeOpcodes
    .filter(cat => selectedCategory === 'All' || cat.category === cat.category)
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
          NVMe 命令集、64 字节命令结构、PRP/SGL 数据传送详解
        </p>
      </div>

      {/* Tabs */}
      <div className="mb-6 flex gap-2 border-b border-border overflow-x-auto">
        <button
          onClick={() => setActiveTab('opcodes')}
          className={cn(
            'px-4 py-2 text-sm font-medium border-b-2 transition-colors whitespace-nowrap',
            activeTab === 'opcodes'
              ? 'border-primary text-primary'
              : 'border-transparent text-muted-foreground hover:text-foreground'
          )}
        >
          <Cpu className="w-4 h-4 inline mr-2" />
          Opcode 查询
        </button>
        <button
          onClick={() => setActiveTab('structure')}
          className={cn(
            'px-4 py-2 text-sm font-medium border-b-2 transition-colors whitespace-nowrap',
            activeTab === 'structure'
              ? 'border-primary text-primary'
              : 'border-transparent text-muted-foreground hover:text-foreground'
          )}
        >
          <Layers className="w-4 h-4 inline mr-2" />
          64 字节命令结构
        </button>
        <button
          onClick={() => setActiveTab('prp-sgl')}
          className={cn(
            'px-4 py-2 text-sm font-medium border-b-2 transition-colors whitespace-nowrap',
            activeTab === 'prp-sgl'
              ? 'border-primary text-primary'
              : 'border-transparent text-muted-foreground hover:text-foreground'
          )}
        >
          <HardDrive className="w-4 h-4 inline mr-2" />
          PRP/SGL 原理
        </button>
        <button
          onClick={() => setActiveTab('get-log')}
          className={cn(
            'px-4 py-2 text-sm font-medium border-b-2 transition-colors whitespace-nowrap',
            activeTab === 'get-log'
              ? 'border-primary text-primary'
              : 'border-transparent text-muted-foreground hover:text-foreground'
          )}
        >
          <BookOpen className="w-4 h-4 inline mr-2" />
          Get Log Page 详解
        </button>
        <button
          onClick={() => setActiveTab('metadata')}
          className={cn(
            'px-4 py-2 text-sm font-medium border-b-2 transition-colors whitespace-nowrap',
            activeTab === 'metadata'
              ? 'border-primary text-primary'
              : 'border-transparent text-muted-foreground hover:text-foreground'
          )}
        >
          <Layers className="w-4 h-4 inline mr-2" />
          Metadata Pointer
        </button>
      </div>

      {/* Tab Content */}
      {activeTab === 'opcodes' && (
        <>
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
                  className="w-full pl-10 pr-4 py-2 bg-surface border border-border rounded-lg text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary/50"
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
        </>
      )}

      {activeTab === 'structure' && (
        <>
          {/* 64-byte structure overview */}
          <section className="mb-10">
            <h2 className="text-sm font-semibold uppercase tracking-widest text-muted-foreground mb-4 flex items-center gap-2">
              <Layers className="w-4 h-4" />
              64 字节 Submission Queue Entry (SQE) 结构详解
            </h2>
            <div className="card-paper rounded-xl p-6 mb-6">
              <div className="grid grid-cols-8 gap-1 text-center text-xs font-mono mb-4">
                {Array.from({ length: 64 }).map((_, i) => (
                  <div key={i} className={cn(
                    'py-2 rounded border',
                    i < 16 ? 'bg-primary/10 border-primary/30 text-primary' :
                    i < 24 ? 'bg-blue-500/10 border-blue-500/30 text-blue-400' :
                    i < 40 ? 'bg-green-500/10 border-green-500/30 text-green-400' :
                    'bg-orange-500/10 border-orange-500/30 text-orange-400'
                  )}>
                    {i}
                  </div>
                ))}
              </div>
              <div className="flex flex-wrap gap-4 text-xs">
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-primary/10 border border-primary/30 rounded"></div>
                  <span>DW00-DW03: 基础命令信息</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-blue-500/10 border border-blue-500/30 rounded"></div>
                  <span>DW04-DW05: 元数据指针</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-green-500/10 border border-green-500/30 rounded"></div>
                  <span>DW06-DW09: PRP/SGL 指针</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-orange-500/10 border border-orange-500/30 rounded"></div>
                  <span>DW10-DW15: 命令特定字段</span>
                </div>
              </div>
            </div>

            {/* Detailed field breakdown */}
            <div className="space-y-4">
              {sqeStructure.map(section => (
                <div key={section.dword} className="card-paper rounded-xl overflow-hidden">
                  <div className="bg-surface-raised px-4 py-3 border-b border-border">
                    <h3 className="text-sm font-bold text-primary">{section.dword}: {section.name}</h3>
                  </div>
                  <div className="p-4">
                    <table className="w-full text-xs">
                      <thead className="text-muted-foreground">
                        <tr>
                          <th className="text-left py-2 font-medium w-32">位范围</th>
                          <th className="text-left py-2 font-medium">字段名称</th>
                          <th className="text-left py-2 font-medium">说明</th>
                        </tr>
                      </thead>
                      <tbody>
                        {section.fields.map((field, idx) => (
                          <tr key={idx} className="border-t border-border/50">
                            <td className="py-3 font-mono text-primary">{field.bits}</td>
                            <td className="py-3 font-medium">{field.name}</td>
                            <td className="py-3 text-muted-foreground">{field.description}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Read/Write command specific */}
          <section className="mb-10">
            <h2 className="text-sm font-semibold uppercase tracking-widest text-muted-foreground mb-4 flex items-center gap-2">
              <Layers className="w-4 h-4" />
              Read/Write 命令特定字段 (DW10-DW15)
            </h2>
            <div className="space-y-4">
              {rwCommandFields.map(section => (
                <div key={section.dword} className="card-paper rounded-xl overflow-hidden">
                  <div className="bg-surface-raised px-4 py-3 border-b border-border">
                    <h3 className="text-sm font-bold text-primary">{section.dword}</h3>
                  </div>
                  <div className="p-4">
                    <table className="w-full text-xs">
                      <tbody>
                        {section.fields.map((field, idx) => (
                          <tr key={idx} className="border-b border-border/50 last:border-0">
                            <td className="py-3 font-mono text-primary w-32">{field.bits}</td>
                            <td className="py-3 font-medium">{field.name}</td>
                            <td className="py-3 text-muted-foreground">{field.description}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </>
      )}

      {activeTab === 'prp-sgl' && (
        <>
          {/* PRP explanation */}
          <section className="mb-10">
            <h2 className="text-sm font-semibold uppercase tracking-widest text-muted-foreground mb-6 flex items-center gap-2">
              <HardDrive className="w-4 h-4" />
              PRP (Physical Region Page) 原理
            </h2>
            
            <div className="card-paper rounded-xl p-6 mb-6">
              <h3 className="text-sm font-bold mb-4">PRP 基本概念</h3>
              <div className="text-xs text-foreground/80 space-y-3">
                <p><strong className="text-primary">PRP 定义：</strong>PRP（Physical Region Page）是 NVMe 用于描述数据传输缓冲区的机制。主机通过 PRP 告诉控制器数据在内存中的物理位置。</p>
                <p><strong className="text-primary">关键特性：</strong></p>
                <ul className="ml-4 space-y-1">
                  <li>• PRP 基于 4KB 页面对齐（Page-aligned）</li>
                  <li>• 支持不连续内存区域（通过 PRP List）</li>
                  <li>• PRP1 和 PRP2 两个指针字段</li>
                  <li>• PRP List 可以嵌套（PRP List of PRP Lists）</li>
                </ul>
              </div>
            </div>

            {/* PRP usage scenarios */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <div className="card-paper rounded-xl p-5">
                <h4 className="text-sm font-bold mb-3 text-green-400">场景 1: 小数据传输（≤ 4KB）</h4>
                <div className="text-xs space-y-2">
                  <p><strong className="text-foreground">配置：</strong></p>
                  <ul className="ml-4 space-y-1">
                    <li>• PRP1 = 缓冲区物理地址</li>
                    <li>• PRP2 = 0（不使用）</li>
                  </ul>
                  <p className="mt-2 text-muted-foreground">适用于：小 IO 请求，单页面传输</p>
                </div>
              </div>

              <div className="card-paper rounded-xl p-5">
                <h4 className="text-sm font-bold mb-3 text-blue-400">场景 2: 中等数据传输（4KB-8KB）</h4>
                <div className="text-xs space-y-2">
                  <p><strong className="text-foreground">配置：</strong></p>
                  <ul className="ml-4 space-y-1">
                    <li>• PRP1 = 第一页物理地址</li>
                    <li>• PRP2 = 第二页物理地址</li>
                  </ul>
                  <p className="mt-2 text-muted-foreground">适用于：跨两页的 IO 请求</p>
                </div>
              </div>

              <div className="card-paper rounded-xl p-5 md:col-span-2">
                <h4 className="text-sm font-bold mb-3 text-purple-400">场景 3: 大数据传输（&gt; 8KB）</h4>
                <div className="text-xs space-y-2">
                  <p><strong className="text-foreground">配置：</strong></p>
                  <ul className="ml-4 space-y-1">
                    <li>• PRP1 = 第一页物理地址</li>
                    <li>• PRP2 = PRP List 的物理地址</li>
                    <li>• PRP List 包含多个物理页地址（每 entry 8 字节）</li>
                  </ul>
                  <p className="mt-2 text-muted-foreground">适用于：大 IO、多页面传输，PRP List 本身也需 4KB 对齐</p>
                </div>
              </div>
            </div>

            {/* PRP diagram */}
            <div className="card-paper rounded-xl p-6 mb-6">
              <h3 className="text-sm font-bold mb-4">PRP List 结构</h3>
              <div className="overflow-x-auto">
                <div className="min-w-[600px] text-xs font-mono">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-32 text-primary font-bold">SQE.DW06-07</div>
                    <div className="flex-1 bg-primary/10 border border-primary/30 rounded px-3 py-2">PRP1 → Page 1 Address</div>
                  </div>
                  <div className="flex items-center gap-2 mb-4">
                    <div className="w-32 text-primary font-bold">SQE.DW08-09</div>
                    <div className="flex-1 bg-purple-500/10 border border-purple-500/30 rounded px-3 py-2">PRP2 → PRP List Address</div>
                  </div>
                  <div className="ml-32 space-y-1">
                    <div className="flex">
                      <div className="w-16 text-muted-foreground">Offset 0</div>
                      <div className="flex-1 bg-green-500/10 border border-green-500/30 rounded px-3 py-1">Page 2 Address</div>
                    </div>
                    <div className="flex">
                      <div className="w-16 text-muted-foreground">Offset 8</div>
                      <div className="flex-1 bg-green-500/10 border border-green-500/30 rounded px-3 py-1">Page 3 Address</div>
                    </div>
                    <div className="flex">
                      <div className="w-16 text-muted-foreground">Offset 16</div>
                      <div className="flex-1 bg-green-500/10 border border-green-500/30 rounded px-3 py-1">Page 4 Address</div>
                    </div>
                    <div className="flex">
                      <div className="w-16 text-muted-foreground">...</div>
                      <div className="flex-1 bg-gray-500/10 border border-gray-500/30 rounded px-3 py-1">...</div>
                    </div>
                    <div className="flex">
                      <div className="w-16 text-muted-foreground">Offset 4088</div>
                      <div className="flex-1 bg-green-500/10 border border-green-500/30 rounded px-3 py-1">Page N Address</div>
                    </div>
                  </div>
                  <div className="mt-2 text-muted-foreground text-center">
                    PRP List 最多可包含 511 个条目（4088 字节 / 8 字节）
                  </div>
                </div>
              </div>
            </div>

            {/* PRP alignment rules */}
            <div className="card-paper rounded-xl p-6">
              <h3 className="text-sm font-bold mb-4 text-orange-400">PRP 对齐规则（重要！）</h3>
              <div className="text-xs space-y-3">
                <div className="flex items-start gap-3">
                  <span className="flex-shrink-0 w-6 h-6 rounded-full bg-orange-500/10 text-orange-400 flex items-center justify-center font-bold">1</span>
                  <div>
                    <p className="font-semibold mb-1">PRP1 对齐要求</p>
                    <p className="text-muted-foreground">PRP1 必须指向数据缓冲区的起始地址。如果数据传输跨页，PRP1 不必 4KB 对齐，但 PRP2 必须指向页边界。</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <span className="flex-shrink-0 w-6 h-6 rounded-full bg-orange-500/10 text-orange-400 flex items-center justify-center font-bold">2</span>
                  <div>
                    <p className="font-semibold mb-1">PRP2 对齐要求</p>
                    <p className="text-muted-foreground">PRP2 必须 4KB 对齐（指向页边界）或为 0。如果数据传输在第一页内完成，PRP2 应为 0。</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <span className="flex-shrink-0 w-6 h-6 rounded-full bg-orange-500/10 text-orange-400 flex items-center justify-center font-bold">3</span>
                  <div>
                    <p className="font-semibold mb-1">PRP List 对齐要求</p>
                    <p className="text-muted-foreground">PRP List 本身必须 4KB 对齐，列表中的每个条目（8 字节）也必须是有效的物理页地址。</p>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* SGL explanation */}
          <section className="mb-10">
            <h2 className="text-sm font-semibold uppercase tracking-widest text-muted-foreground mb-6 flex items-center gap-2">
              <HardDrive className="w-4 h-4" />
              SGL (Scatter Gather List) 原理
            </h2>

            <div className="card-paper rounded-xl p-6 mb-6">
              <h3 className="text-sm font-bold mb-4">SGL 基本概念</h3>
              <div className="text-xs text-foreground/80 space-y-3">
                <p><strong className="text-primary">SGL 定义：</strong>SGL（Scatter Gather List）是 NVMe 1.1+ 引入的数据传输描述机制，比 PRP 更灵活。</p>
                <p><strong className="text-primary">SGL vs PRP 优势：</strong></p>
                <ul className="ml-4 space-y-1">
                  <li>✓ 无需 4KB 页面对齐，支持任意内存边界</li>
                  <li>✓ 支持链式 SGL 描述符，可描述复杂数据布局</li>
                  <li>✓ 支持内联数据（数据直接放在 SGL 描述符中）</li>
                  <li>✓ 更适合现代 DMA 引擎和 RDMA</li>
                </ul>
              </div>
            </div>

            {/* SGL descriptor structure */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <div className="card-paper rounded-xl p-5">
                <h4 className="text-sm font-bold mb-3 text-blue-400">SGL 描述符格式（16 字节）</h4>
                <div className="text-xs font-mono space-y-2">
                  <div className="bg-blue-500/10 border border-blue-500/30 rounded p-2">
                    <div className="text-primary font-semibold mb-1">QWord 0: Address / Offset</div>
                    <div className="text-muted-foreground">64 位地址或偏移量</div>
                  </div>
                  <div className="bg-green-500/10 border border-green-500/30 rounded p-2">
                    <div className="text-primary font-semibold mb-1">QWord 1: Descriptor Info</div>
                    <div className="grid grid-cols-2 gap-2 mt-1">
                      <div>
                        <div className="text-xs text-muted-foreground">[15:00]</div>
                        <div>Length (字节数)</div>
                      </div>
                      <div>
                        <div className="text-xs text-muted-foreground">[23:16]</div>
                        <div>Descriptor Type</div>
                      </div>
                      <div>
                        <div className="text-xs text-muted-foreground">[27:24]</div>
                        <div>Sub-type</div>
                      </div>
                      <div>
                        <div className="text-xs text-muted-foreground">[31:28]</div>
                        <div>Reserved</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="card-paper rounded-xl p-5">
                <h4 className="text-sm font-bold mb-3 text-purple-400">SGL Descriptor Types</h4>
                <div className="text-xs space-y-2">
                  <div className="flex justify-between items-center p-2 bg-surface-raised rounded">
                    <span><strong className="text-primary">0h</strong> - Data Block</span>
                    <span className="text-muted-foreground">数据块描述符</span>
                  </div>
                  <div className="flex justify-between items-center p-2 bg-surface-raised rounded">
                    <span><strong className="text-primary">1h</strong> - Bit Bucket</span>
                    <span className="text-muted-foreground">位桶（填充）</span>
                  </div>
                  <div className="flex justify-between items-center p-2 bg-surface-raised rounded">
                    <span><strong className="text-primary">2h</strong> - Segment</span>
                    <span className="text-muted-foreground">SGL 段描述符</span>
                  </div>
                  <div className="flex justify-between items-center p-2 bg-surface-raised rounded">
                    <span><strong className="text-primary">3h</strong> - Last Segment</span>
                    <span className="text-muted-foreground">最后段描述符</span>
                  </div>
                  <div className="flex justify-between items-center p-2 bg-surface-raised rounded">
                    <span><strong className="text-primary">4h</strong> - Generic MKey</span>
                    <span className="text-muted-foreground">通用 MKey</span>
                  </div>
                  <div className="flex justify-between items-center p-2 bg-surface-raised rounded">
                    <span><strong className="text-primary">5h</strong> - MKey SGL</span>
                    <span className="text-muted-foreground">MKey SGL 描述符</span>
                  </div>
                  <div className="flex justify-between items-center p-2 bg-surface-raised rounded">
                    <span><strong className="text-primary">FFh</strong> - Keyed SGL</span>
                    <span className="text-muted-foreground">Keyed 数据块</span>
                  </div>
                </div>
              </div>
            </div>

            {/* SGL usage example */}
            <div className="card-paper rounded-xl p-6 mb-6">
              <h3 className="text-sm font-bold mb-4">SGL 使用示例</h3>
              <div className="text-xs">
                <p className="mb-3"><strong className="text-foreground">场景：</strong>主机需要传输 3 个不连续的内存缓冲区（512 字节 + 1KB + 256 字节）</p>
                <div className="overflow-x-auto">
                  <div className="min-w-[600px] font-mono space-y-2">
                    <div className="flex items-center gap-2">
                      <div className="w-32 text-primary">SQE.DW06-07</div>
                      <div className="flex-1 bg-primary/10 border border-primary/30 rounded px-3 py-2">
                        SGL Descriptor 0 (Address)
                      </div>
                    </div>
                    <div className="ml-32 space-y-1">
                      <div className="bg-green-500/10 border border-green-500/30 rounded p-2">
                        <div className="text-primary font-semibold">Descriptor 0:</div>
                        <div>Address: 0x1000_1000</div>
                        <div>Length: 512 bytes</div>
                        <div>Type: Data Block (0h)</div>
                      </div>
                      <div className="bg-green-500/10 border border-green-500/30 rounded p-2">
                        <div className="text-primary font-semibold">Descriptor 1:</div>
                        <div>Address: 0x1000_2000</div>
                        <div>Length: 1024 bytes</div>
                        <div>Type: Data Block (0h)</div>
                      </div>
                      <div className="bg-green-500/10 border border-green-500/30 rounded p-2">
                        <div className="text-primary font-semibold">Descriptor 2:</div>
                        <div>Address: 0x1000_3000</div>
                        <div>Length: 256 bytes</div>
                        <div>Type: Data Block (0h)</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* PRP vs SGL comparison */}
            <div className="card-paper rounded-xl p-6">
              <h3 className="text-sm font-bold mb-4">PRP vs SGL 对比</h3>
              <table className="w-full text-xs">
                <thead className="bg-surface-raised border-b border-border">
                  <tr>
                    <th className="text-left py-3 px-4 font-semibold">特性</th>
                    <th className="text-left py-3 px-4 font-semibold text-primary">PRP</th>
                    <th className="text-left py-3 px-4 font-semibold text-green-400">SGL</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b border-border/50">
                    <td className="py-3 text-muted-foreground">对齐要求</td>
                    <td className="py-3">必须 4KB 页面对齐</td>
                    <td className="py-3 text-green-400">✓ 无需对齐</td>
                  </tr>
                  <tr className="border-b border-border/50">
                    <td className="py-3 text-muted-foreground">描述符大小</td>
                    <td className="py-3">8 字节（每页）</td>
                    <td className="py-3 text-green-400">16 字节（灵活）</td>
                  </tr>
                  <tr className="border-b border-border/50">
                    <td className="py-3 text-muted-foreground">链式支持</td>
                    <td className="py-3">有限（嵌套 PRP List）</td>
                    <td className="py-3 text-green-400">✓ 完整链式支持</td>
                  </tr>
                  <tr className="border-b border-border/50">
                    <td className="py-3 text-muted-foreground">内联数据</td>
                    <td className="py-3">不支持</td>
                    <td className="py-3 text-green-400">✓ 支持内联数据</td>
                  </tr>
                  <tr className="border-b border-border/50">
                    <td className="py-3 text-muted-foreground">NVMe 版本</td>
                    <td className="py-3">1.0+</td>
                    <td className="py-3 text-green-400">1.1+</td>
                  </tr>
                  <tr>
                    <td className="py-3 text-muted-foreground">适用场景</td>
                    <td className="py-3">传统系统，简单 IO</td>
                    <td className="py-3 text-green-400">现代 DMA，RDMA，复杂 IO</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>
        </>
      )}

      {/* Get Log Page Tab */}
      {activeTab === 'get-log' && (
        <>
          <section className="mb-10">
            <h2 className="text-sm font-semibold uppercase tracking-widest text-muted-foreground mb-4 flex items-center gap-2">
              <BookOpen className="w-4 h-4" />
              Get Log Page 命令详解 - 逐位解析
            </h2>
            
            <div className="card-paper rounded-xl p-6 mb-6">
              <h3 className="text-sm font-bold mb-4">Get Log Page 命令概述</h3>
              <div className="text-xs text-foreground/80 space-y-3">
                <p><strong className="text-primary">用途：</strong>Get Log Page 是 NVMe 管理命令中最常用的命令之一，用于获取 SSD 的各种日志信息，包括错误日志、SMART/Health 信息、固件状态等。</p>
                <p><strong className="text-primary">命令类型：</strong>Admin Command（管理员命令），需要在 Admin Submission Queue 中提交</p>
                <p><strong className="text-primary">返回数据：</strong>日志页面数据通过 PRP/SGL 指定的数据缓冲区返回</p>
              </div>
            </div>

            {/* Common Log Identifiers */}
            <div className="card-paper rounded-xl p-6 mb-6">
              <h3 className="text-sm font-bold mb-4">常见 LID（Log Identifier）值</h3>
              <table className="w-full text-xs">
                <thead className="bg-surface-raised border-b border-border">
                  <tr>
                    <th className="text-left py-3 px-4 font-semibold">LID</th>
                    <th className="text-left py-3 px-4 font-semibold">日志名称</th>
                    <th className="text-left py-3 px-4 font-semibold">描述</th>
                    <th className="text-left py-3 px-4 font-semibold">大小</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b border-border/50">
                    <td className="py-3 font-mono text-primary">0x01</td>
                    <td className="py-3 font-medium">Error Information</td>
                    <td className="py-3 text-muted-foreground">错误信息日志，记录最近的命令错误</td>
                    <td className="py-3 font-mono">64B × entries</td>
                  </tr>
                  <tr className="border-b border-border/50">
                    <td className="py-3 font-mono text-primary">0x02</td>
                    <td className="py-3 font-medium">SMART/Health</td>
                    <td className="py-3 text-muted-foreground">SMART 和健康信息，包括温度、寿命、介质磨损等</td>
                    <td className="py-3 font-mono">512B</td>
                  </tr>
                  <tr className="border-b border-border/50">
                    <td className="py-3 font-mono text-primary">0x03</td>
                    <td className="py-3 font-medium">Firmware Slot</td>
                    <td className="py-3 text-muted-foreground">固件插槽信息，显示当前和可用的固件版本</td>
                    <td className="py-3 font-mono">512B</td>
                  </tr>
                  <tr className="border-b border-border/50">
                    <td className="py-3 font-mono text-primary">0x04</td>
                    <td className="py-3 font-medium">Changed Namespace List</td>
                    <td className="py-3 text-muted-foreground">已更改的命名空间列表</td>
                    <td className="py-3 font-mono">可变</td>
                  </tr>
                  <tr className="border-b border-border/50">
                    <td className="py-3 font-mono text-primary">0x05</td>
                    <td className="py-3 font-medium">Command Effects Log</td>
                    <td className="py-3 text-muted-foreground">命令效果日志，显示哪些命令被支持</td>
                    <td className="py-3 font-mono">1KB</td>
                  </tr>
                  <tr className="border-b border-border/50">
                    <td className="py-3 font-mono text-primary">0x06</td>
                    <td className="py-3 font-medium">Device Self-Test</td>
                    <td className="py-3 text-muted-foreground">设备自测试结果</td>
                    <td className="py-3 font-mono">512B</td>
                  </tr>
                  <tr>
                    <td className="py-3 font-mono text-primary">0x0E</td>
                    <td className="py-3 font-medium">Vendor Specific</td>
                    <td className="py-3 text-muted-foreground">厂商特定日志，需要配合 UUID Index 使用</td>
                    <td className="py-3 font-mono">可变</td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* DW10-DW15 detailed breakdown */}
            <div className="space-y-4">
              {getLogPageFields.map(section => (
                <div key={section.dword} className="card-paper rounded-xl overflow-hidden">
                  <div className="bg-surface-raised px-4 py-3 border-b border-border">
                    <h3 className="text-sm font-bold text-primary">{section.dword}</h3>
                  </div>
                  <div className="p-4">
                    <table className="w-full text-xs">
                      <thead className="text-muted-foreground">
                        <tr>
                          <th className="text-left py-2 font-medium w-32">位范围</th>
                          <th className="text-left py-2 font-medium">字段名称</th>
                          <th className="text-left py-2 font-medium">详细说明</th>
                        </tr>
                      </thead>
                      <tbody>
                        {section.fields.map((field, idx) => (
                          <tr key={idx} className="border-t border-border/50">
                            <td className="py-3 font-mono text-primary">{field.bits}</td>
                            <td className="py-3 font-medium">{field.name}</td>
                            <td className="py-3 text-muted-foreground">{field.description}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              ))}
            </div>

            {/* Usage example */}
            <div className="card-paper rounded-xl p-6 mt-6">
              <h3 className="text-sm font-bold mb-4">Get Log Page 使用示例</h3>
              <div className="text-xs font-mono space-y-4">
                <div className="bg-surface-raised rounded p-4">
                  <p className="text-primary font-semibold mb-2">示例 1: 读取 SMART/Health 日志</p>
                  <pre className="overflow-x-auto text-foreground/80 whitespace-pre-wrap">
{`NVMe_GetLogPage_Command cmd = {0};
cmd.CID = 1;                      // 命令 ID
cmd.NSID = 0xFFFFFFFF;            // 全局日志，不指定 NSID
cmd.PRPr1 = 0x1000_1000;          // 数据缓冲区物理地址
cmd.PRPr2 = 0;                    // 单页传输
cmd.DW10 = 0x02 | (0xFF << 16);   // LID=0x02 (SMART), NUMD=255 (1024 字节)
cmd.DW11 = 0;                     // RGO=0, LSP=0, LPOL=0
cmd.DW12 = 0;                     // LPOL 高位
cmd.DW13 = 0;                     // CSI=0 (NVM 命令集)
cmd.DW14 = 0;                     // UUID Index=0
cmd.DW15 = 0;                     // OT=0 (DWORD 单位)`}
                  </pre>
                </div>
                <div className="bg-surface-raised rounded p-4">
                  <p className="text-primary font-semibold mb-2">示例 2: 读取错误信息日志</p>
                  <pre className="overflow-x-auto text-foreground/80 whitespace-pre-wrap">
{`NVMe_GetLogPage_Command cmd = {0};
cmd.CID = 2;
cmd.NSID = 0xFFFFFFFF;
cmd.PRPr1 = 0x1000_2000;          // 数据缓冲区
cmd.PRPr2 = 0x1000_3000;          // PRP List（大日志）
cmd.DW10 = 0x01 | (0x1FF << 16);  // LID=0x01 (Error), NUMD=511 (2KB)
cmd.DW11 = 0;                     // 从头开始读取
cmd.DW12 = 0;
cmd.DW13 = 0;
cmd.DW14 = 0;
cmd.DW15 = 0;`}
                  </pre>
                </div>
              </div>
            </div>
          </section>
        </>
      )}

      {/* Metadata Pointer Tab */}
      {activeTab === 'metadata' && (
        <>
          <section className="mb-10">
            <h2 className="text-sm font-semibold uppercase tracking-widest text-muted-foreground mb-6 flex items-center gap-2">
              <Layers className="w-4 h-4" />
              Metadata Pointer (MPTR) 深入解析
            </h2>
            
            <div className="card-paper rounded-xl p-6 mb-6">
              <h3 className="text-sm font-bold mb-4">核心概念</h3>
              <div className="text-xs text-foreground/80 space-y-3">
                <p><strong className="text-primary">Metadata Pointer (MPTR)</strong> 是 NVMe 64 字节命令中的一个 64 位字段（DW04-DW05），用于指向<strong className="text-primary">元数据缓冲区</strong>的物理地址。</p>
                <p><strong className="text-primary">关键理解：</strong></p>
                <ul className="ml-4 space-y-1">
                  <li>• MPTR 是<strong className="text-primary">可选的</strong>，仅在启用端到端数据保护或需要传输元数据时使用</li>
                  <li>• 如果不需要元数据，MPTR 应设置为 0</li>
                  <li>• MPTR 指向的缓冲区存储与用户数据关联的元数据（如保护信息 PI）</li>
                </ul>
              </div>
            </div>

            {/* When to use MPTR */}
            <div className="card-paper rounded-xl p-6 mb-6">
              <h3 className="text-sm font-bold mb-4">何时使用 MPTR？何时不用？</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-green-500/5 border border-green-500/20 rounded-xl p-4">
                  <h4 className="text-sm font-bold mb-3 text-green-400">需要使用 MPTR 的场景</h4>
                  <div className="text-xs space-y-2">
                    <div className="flex justify-between items-center p-2 bg-green-500/10 rounded">
                      <span>启用 PI 保护</span>
                      <span className="font-mono">MPTR → 8 字节/LBA</span>
                    </div>
                    <div className="flex justify-between items-center p-2 bg-green-500/10 rounded">
                      <span>扩展元数据</span>
                      <span className="font-mono">MPTR → 自定义格式</span>
                    </div>
                    <div className="flex justify-between items-center p-2 bg-green-500/10 rounded">
                      <span>混合模式</span>
                      <span className="font-mono">MPTR → 数据 + 元数据</span>
                    </div>
                  </div>
                </div>
                <div className="bg-blue-500/5 border border-blue-500/20 rounded-xl p-4">
                  <h4 className="text-sm font-bold mb-3 text-blue-400">不需要使用 MPTR 的场景</h4>
                  <div className="text-xs space-y-2">
                    <div className="flex justify-between items-center p-2 bg-blue-500/10 rounded">
                      <span>标准 IO</span>
                      <span className="font-mono">MPTR = 0</span>
                    </div>
                    <div className="flex justify-between items-center p-2 bg-blue-500/10 rounded">
                      <span>简单读写</span>
                      <span className="font-mono">MPTR = 0</span>
                    </div>
                    <div className="flex justify-between items-center p-2 bg-blue-500/10 rounded">
                      <span>无 PI 保护</span>
                      <span className="font-mono">MPTR = 0</span>
                    </div>
                  </div>
                </div>
              </div>
              <div className="mt-4 text-xs text-muted-foreground">
                <p><strong className="text-foreground">实际案例：</strong>消费级 SSD：99% 场景 MPTR=0 | 企业级 SSD：可能使用 PI 保护 | ZNS SSD：通常 MPTR=0</p>
              </div>
            </div>

            {/* MPTR vs PRP/SGL */}
            <div className="card-paper rounded-xl p-6 mb-6">
              <h3 className="text-sm font-bold mb-4">MPTR 与 PRP/SGL 的关系</h3>
              <table className="w-full text-xs">
                <thead className="bg-surface-raised border-b border-border">
                  <tr>
                    <th className="text-left py-3 px-4 font-semibold">指针</th>
                    <th className="text-left py-3 px-4 font-semibold">用途</th>
                    <th className="text-left py-3 px-4 font-semibold">何时使用</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b border-border/50">
                    <td className="py-3 font-mono text-blue-400">MPTR</td>
                    <td className="py-3">指向元数据缓冲区</td>
                    <td className="py-3 text-green-400">仅在需要元数据时</td>
                  </tr>
                  <tr className="border-b border-border/50">
                    <td className="py-3 font-mono text-green-400">PRP1/PRP2</td>
                    <td className="py-3">指向用户数据缓冲区</td>
                    <td className="py-3">所有 IO 命令都需要</td>
                  </tr>
                  <tr>
                    <td className="py-3 font-mono text-green-400">SGL</td>
                    <td className="py-3">指向用户数据缓冲区</td>
                    <td className="py-3">所有 IO 命令（与 PRP 二选一）</td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* Common misconceptions */}
            <div className="card-paper rounded-xl p-6 mb-6 bg-orange-500/5 border-orange-500/20">
              <h3 className="text-sm font-bold mb-4 text-orange-400">常见误区澄清</h3>
              <div className="text-xs space-y-3">
                <div className="flex items-start gap-3">
                  <span className="flex-shrink-0 w-6 h-6 rounded-full bg-orange-500/10 text-orange-400 flex items-center justify-center font-bold">!</span>
                  <div>
                    <p className="font-semibold mb-1">误区 1: "MPTR 用于传输大文件"</p>
                    <p className="text-muted-foreground"><strong className="text-foreground">错误！</strong>MPTR 仅用于元数据，大数据传输用 PRP List 或 SGL</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <span className="flex-shrink-0 w-6 h-6 rounded-full bg-orange-500/10 text-orange-400 flex items-center justify-center font-bold">!</span>
                  <div>
                    <p className="font-semibold mb-1">误区 2: "MPTR 和 PRP 可以混用"</p>
                    <p className="text-muted-foreground"><strong className="text-foreground">错误！</strong>MPTR 独立于 PRP/SGL，MPTR 总是指向单独的元数据缓冲区</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <span className="flex-shrink-0 w-6 h-6 rounded-full bg-orange-500/10 text-orange-400 flex items-center justify-center font-bold">!</span>
                  <div>
                    <p className="font-semibold mb-1">误区 3: "所有 SSD 都需要 MPTR"</p>
                    <p className="text-muted-foreground"><strong className="text-foreground">错误！</strong>大多数消费级 SSD 不需要元数据，MPTR=0</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <span className="flex-shrink-0 w-6 h-6 rounded-full bg-orange-500/10 text-orange-400 flex items-center justify-center font-bold">!</span>
                  <div>
                    <p className="font-semibold mb-1">误区 4: "MPTR 可以是虚拟地址"</p>
                    <p className="text-muted-foreground"><strong className="text-foreground">错误！</strong>MPTR 必须是物理地址（与 PRP/SGL 一样）</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Code examples */}
            <div className="card-paper rounded-xl p-6 mb-6">
              <h3 className="text-sm font-bold mb-4">实际编程示例</h3>
              <div className="text-xs font-mono space-y-4">
                <div className="bg-surface-raised rounded p-4">
                  <p className="text-primary font-semibold mb-2">示例 1: 标准写命令（无元数据）</p>
                  <pre className="overflow-x-auto text-foreground/80 whitespace-pre-wrap">
{`// 标准写 4KB 数据，不需要元数据
NVMe_Write_Command cmd = {0};
cmd.CID = 1;
cmd.NSID = 1;
cmd.PRPr1 = 0x1000_1000;  // 用户数据物理地址
cmd.PRPr2 = 0;            // 单页传输
cmd.MPTR = 0;             // 无元数据，MPTR=0
cmd.SLBA = 0x1000;        // 起始 LBA
cmd.NLB = 7;              // 8 个逻辑块（0-based）`}
                  </pre>
                </div>
                <div className="bg-surface-raised rounded p-4">
                  <p className="text-primary font-semibold mb-2">示例 2: 写命令带 PI 保护</p>
                  <pre className="overflow-x-auto text-foreground/80 whitespace-pre-wrap">
{`// 写 4KB 数据 + 8 字节 PI 保护信息
NVMe_Write_Command cmd = {0};
cmd.CID = 2;
cmd.NSID = 1;
cmd.PRPr1 = 0x1000_1000;  // 用户数据物理地址（4KB）
cmd.PRPr2 = 0;
cmd.MPTR = 0x1000_2000;   // 元数据物理地址（8 字节 PI）
cmd.SLBA = 0x1000;
cmd.NLB = 7;
// SSD 会将 4KB 数据 + 8 字节 PI 一起写入`}
                  </pre>
                </div>
                <div className="bg-surface-raised rounded p-4">
                  <p className="text-primary font-semibold mb-2">示例 3: 读命令获取 PI 保护</p>
                  <pre className="overflow-x-auto text-foreground/80 whitespace-pre-wrap">
{`// 读取 4KB 数据 + 8 字节 PI 保护信息
NVMe_Read_Command cmd = {0};
cmd.CID = 3;
cmd.NSID = 1;
cmd.PRPr1 = 0x1000_3000;  // 用户数据缓冲区
cmd.PRPr2 = 0;
cmd.MPTR = 0x1000_4000;   // 元数据缓冲区（用于接收 PI）
cmd.SLBA = 0x1000;
cmd.NLB = 7;
// SSD 读取后：数据 → 0x1000_3000, PI → 0x1000_4000`}
                  </pre>
                </div>
              </div>
            </div>

            {/* MPTR position in SQE */}
            <div className="card-paper rounded-xl p-6">
              <h3 className="text-sm font-bold mb-4">MPTR 在 64 字节 SQE 中的位置</h3>
              <div className="grid grid-cols-8 gap-1 text-center text-xs font-mono mb-4">
                {Array.from({ length: 64 }).map((_, i) => (
                  <div key={i} className={cn(
                    'py-2 rounded border',
                    i < 16 ? 'bg-primary/10 border-primary/30 text-primary' :
                    i >= 16 && i < 24 ? 'bg-blue-500/10 border-blue-500/30 text-blue-400 font-bold' :
                    i >= 24 && i < 40 ? 'bg-green-500/10 border-green-500/30 text-green-400' :
                    'bg-orange-500/10 border-orange-500/30 text-orange-400'
                  )}>
                    {i}
                  </div>
                ))}
              </div>
              <div className="flex flex-wrap gap-4 text-xs">
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-primary/10 border border-primary/30 rounded"></div>
                  <span>DW00-DW03: 基础命令信息</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-blue-500/10 border border-blue-500/30 rounded"></div>
                  <span className="font-bold">DW04-DW05: MPTR（元数据指针）</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-green-500/10 border border-green-500/30 rounded"></div>
                  <span>DW06-DW09: PRP/SGL 指针</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-orange-500/10 border border-orange-500/30 rounded"></div>
                  <span>DW10-DW15: 命令特定字段</span>
                </div>
              </div>
            </div>
          </section>
        </>
      )}

      {/* Revision history */}
      {activeTab === 'opcodes' && (
        <>
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
        </>
      )}
    </main>
  )
}
