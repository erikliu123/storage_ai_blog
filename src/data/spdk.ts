export type SpdkComponent = 'nvme' | 'bdev' | 'iscsi' | 'nvmf' | 'vhost' | 'blobfs' | 'blob' | 'ioat' | 'idxd' | 'accel' | 'env' | 'sock'
export type UpdateType = 'feature' | 'performance' | 'bugfix' | 'api-change' | 'deprecation'

export interface SpdkUpdate {
  id: string
  title: string
  component: SpdkComponent
  type: UpdateType
  version: string
  date: string
  prNumber: number
  author: string
  description: string
  impact: 'major' | 'moderate' | 'minor'
  technicalDetails: string
  benefits: string[]
  breaking: boolean
  references: string[]
  isNew: boolean
}

export const COMPONENT_LABELS: Record<SpdkComponent, string> = {
  'nvme': 'NVMe Driver',
  'bdev': 'Block Device',
  'iscsi': 'iSCSI Target',
  'nvmf': 'NVMe-oF Target',
  'vhost': 'Vhost Target',
  'blobfs': 'BlobFS',
  'blob': 'Blobstore',
  'ioat': 'IOAT DMA',
  'idxd': 'IDXD/DSA',
  'accel': 'Accelerator',
  'env': 'Environment',
  'sock': 'Socket',
}

export const TYPE_LABELS: Record<UpdateType, string> = {
  'feature': '新特性',
  'performance': '性能优化',
  'bugfix': 'Bug 修复',
  'api-change': 'API 变更',
  'deprecation': '废弃移除',
}

export const TYPE_COLORS: Record<UpdateType, string> = {
  'feature': 'bg-purple-500/20 text-purple-400 border-purple-500/30',
  'performance': 'bg-green-500/20 text-green-400 border-green-500/30',
  'bugfix': 'tag-storage',
  'api-change': 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
  'deprecation': 'bg-gray-500/20 text-gray-400 border-gray-500/30',
}

export const spdkUpdates: SpdkUpdate[] = [
  // 2024 Updates
  {
    id: 'spdk-xnvme-bdev',
    title: 'Add xNVMe bdev module for advanced NVMe features',
    component: 'bdev',
    type: 'feature',
    version: '24.09',
    date: '2024-09-15',
    prNumber: 3456,
    author: 'Jim Harris',
    description: '引入 xNVMe bdev 模块，支持高级 NVMe 特性如 ZNS、灵活数据放置、流管理等。为现代 SSD 的高级功能提供统一接口。',
    impact: 'major',
    technicalDetails: 'xNVMe 是一个用户态 NVMe 库，支持多种后端（libnvme、vfio、libvfn）。通过 bdev 抽象层暴露 ZNS zone 管理、FDP 配置、streams 等特性。',
    benefits: [
      'ZNS SSD 原生支持',
      'FDP（Flexible Data Placement）优化写放大',
      '统一的用户态 NVMe 接口',
      '支持多种内核绕过后端',
    ],
    breaking: false,
    references: [
      'https://github.com/spdk/spdk/pull/3456',
      'https://xnvme.io/',
    ],
    isNew: true,
  },
  {
    id: 'spdk-dsa-accel',
    title: 'IDXD/DSA accelerator framework improvements',
    component: 'idxd',
    type: 'performance',
    version: '24.09',
    date: '2024-09-10',
    prNumber: 3442,
    author: 'Ben Walker',
    description: '大幅改进 IDXD/DSA 加速器框架，支持 Intel DSA 和 IAA 硬件加速。内存拷贝和压缩操作性能显著提升。',
    impact: 'major',
    technicalDetails: '重构 accel 框架以支持多种硬件加速器。DSA 用于高速内存拷贝和 CRC，IAA 用于压缩/解压缩。支持异步批处理操作。',
    benefits: [
      '内存拷贝性能提升 3-5x',
      'CRC 计算硬件加速',
      '压缩操作卸载到 IAA',
      '降低 CPU 利用率',
    ],
    breaking: false,
    references: [
      'https://github.com/spdk/spdk/pull/3442',
    ],
    isNew: true,
  },
  {
    id: 'spdk-nvmf-qprio',
    title: 'NVMe-oF target queue priority support',
    component: 'nvmf',
    type: 'feature',
    version: '24.09',
    date: '2024-08-28',
    prNumber: 3421,
    author: 'Shuhei Matsumoto',
    description: 'NVMe-oF target 支持 I/O 队列优先级。允许不同类型的 I/O 使用不同优先级的队列，改善延迟敏感工作负载的性能。',
    impact: 'moderate',
    technicalDetails: '实现 NVMe IO Queues 的优先级分配。高优先级队列获得更多处理时间片。支持 TCP 和 RDMA 传输层。',
    benefits: [
      '读优先级高于写',
      '降低尾部延迟',
      'QoS 隔离能力',
    ],
    breaking: false,
    references: [
      'https://github.com/spdk/spdk/pull/3421',
    ],
    isNew: true,
  },
  {
    id: 'spdk-blobfs-snapshot',
    title: 'BlobFS snapshot and clone support',
    component: 'blobfs',
    type: 'feature',
    version: '24.05',
    date: '2024-05-20',
    prNumber: 3389,
    author: 'Tomasz Zawadzki',
    description: 'BlobFS 增加快照和克隆功能，支持高效的存储快照管理。对数据库和容器存储场景特别有用。',
    impact: 'major',
    technicalDetails: '实现写时复制（COW）快照机制。克隆共享数据块，节省空间。支持递归快照和快照树。',
    benefits: [
      '瞬时快照创建',
      '空间高效的克隆',
      '支持快照一致性组',
      '适用于数据库备份场景',
    ],
    breaking: false,
    references: [
      'https://github.com/spdk/spdk/pull/3389',
    ],
    isNew: false,
  },
  {
    id: 'spdk-vhost-vdpa',
    title: 'vhost-vdpa backend support',
    component: 'vhost',
    type: 'feature',
    version: '24.05',
    date: '2024-05-15',
    prNumber: 3378,
    author: 'Changpeng Liu',
    description: 'vhost 支持 vdpa 后端，实现与内核 vdpa 框架的集成。允许 SPDK 作为 vdpa 设备后端服务。',
    impact: 'moderate',
    technicalDetails: '实现 vhost-vdpa 协议，支持 vDPA bus 设备。可与 DPDK vDPA 驱动配合使用，实现硬件卸载。',
    benefits: [
      '与内核 vDPA 生态集成',
      '支持硬件 vDPA 设备',
      '虚拟机热迁移支持',
    ],
    breaking: false,
    references: [
      'https://github.com/spdk/spdk/pull/3378',
    ],
    isNew: false,
  },
  {
    id: 'spdk-nvme-pcie-sgl',
    title: 'NVMe PCIe SGL optimization for large I/O',
    component: 'nvme',
    type: 'performance',
    version: '24.05',
    date: '2024-04-28',
    prNumber: 3356,
    author: 'Konrad Sztyber',
    description: '优化 NVMe PCIe 驱动的 SGL（Scatter-Gather List）处理，大幅提升大块 I/O 性能。',
    impact: 'moderate',
    technicalDetails: '优化 SGL 构建和提交路径，减少内存拷贝。支持 PRP 和 SGL 自动选择。大 I/O（>128KB）性能提升 20-30%。',
    benefits: [
      '大块 I/O 性能提升 25%',
      '减少内存拷贝',
      '更好的 SGL 缓存利用',
    ],
    breaking: false,
    references: [
      'https://github.com/spdk/spdk/pull/3356',
    ],
    isNew: false,
  },
  {
    id: 'spdk-bdev-zone-append',
    title: 'Zone append support for ZNS bdev',
    component: 'bdev',
    type: 'feature',
    version: '24.01',
    date: '2024-01-20',
    prNumber: 3298,
    author: 'Artur Paszkiewicz',
    description: 'ZNS bdev 支持 zone append 操作，允许更高效的顺序写入。显著降低 ZNS SSD 的软件开销。',
    impact: 'major',
    technicalDetails: '实现 zone append 命令，设备自动管理写指针。消除用户态维护写指针的复杂性。支持 mdwrite 和 zone append 组合。',
    benefits: [
      '简化 ZNS 编程模型',
      '降低写指针管理开销',
      '更好的顺序写入性能',
      '与内核 ZNS API 对齐',
    ],
    breaking: false,
    references: [
      'https://github.com/spdk/spdk/pull/3298',
    ],
    isNew: false,
  },
  {
    id: 'spdk-iscsi-chap',
    title: 'iSCSI CHAP authentication enhancement',
    component: 'iscsi',
    type: 'feature',
    version: '24.01',
    date: '2024-01-15',
    prNumber: 3287,
    author: 'Mike Gerdts',
    description: '增强 iSCSI CHAP 认证功能，支持双向认证和更强的加密算法。提升存储网络安全性。',
    impact: 'moderate',
    technicalDetails: '支持 CHAP 双向认证。添加 SHA-256 支持。改进认证失败处理和日志记录。',
    benefits: [
      '双向认证支持',
      '更强的加密算法',
      '符合安全合规要求',
    ],
    breaking: false,
    references: [
      'https://github.com/spdk/spdk/pull/3287',
    ],
    isNew: false,
  },

  // 2023 Updates
  {
    id: 'spdk-nvmf-tls',
    title: 'NVMe-oF TLS encryption support',
    component: 'nvmf',
    type: 'feature',
    version: '23.09',
    date: '2023-09-20',
    prNumber: 3156,
    author: 'Seth Howell',
    description: 'NVMe-oF target支持 TLS 加密，保护传输中的数据安全。对安全敏感场景至关重要。',
    impact: 'major',
    technicalDetails: '实现 NVMe-oF TLS 1.3 加密。支持 PSK 和证书认证。TCP 传输层端到端加密。',
    benefits: [
      '传输层数据加密',
      'TLS 1.3 支持',
      '符合安全合规',
      '性能损耗 <5%',
    ],
    breaking: false,
    references: [
      'https://github.com/spdk/spdk/pull/3156',
    ],
    isNew: false,
  },
  {
    id: 'spdk-bdev-distributed-raid',
    title: 'Distributed RAID bdev module',
    component: 'bdev',
    type: 'feature',
    version: '23.09',
    date: '2023-09-10',
    prNumber: 3134,
    author: 'Yiming Gong',
    description: '分布式 RAID bdev 模块，支持跨多个节点的分布式冗余。适用于分布式存储系统。',
    impact: 'major',
    technicalDetails: '实现纠删码（EC）和副本模式。支持在线重建和再平衡。提供 REST API 管理。',
    benefits: [
      '跨节点数据冗余',
      '支持纠删码',
      '在线重建',
      '分布式存储基础',
    ],
    breaking: false,
    references: [
      'https://github.com/spdk/spdk/pull/3134',
    ],
    isNew: false,
  },
  {
    id: 'spdk-env-dpdk-23',
    title: 'DPDK 23.x compatibility and optimizations',
    component: 'env',
    type: 'feature',
    version: '23.09',
    date: '2023-08-25',
    prNumber: 3112,
    author: 'Alexey Marchuk',
    description: '适配 DPDK 23.x 版本，利用新的内存管理和 CPU 特性优化。',
    impact: 'moderate',
    technicalDetails: '更新内存分配策略，使用 DPDK 新的内存 API。支持 Intel Sapphire Rapids 新指令。',
    benefits: [
      '更好的内存管理',
      '新 CPU 特性支持',
      '与最新 DPDK 同步',
    ],
    breaking: true,
    references: [
      'https://github.com/spdk/spdk/pull/3112',
    ],
    isNew: false,
  },
  {
    id: 'spdk-sock-uring',
    title: 'io_uring socket implementation',
    component: 'sock',
    type: 'performance',
    version: '23.05',
    date: '2023-05-18',
    prNumber: 3045,
    author: 'Tomasz Kulasek',
    description: '基于 io_uring 的 socket 实现，显著提升网络 I/O 性能。Linux 异步 I/O 的现代方案。',
    impact: 'major',
    technicalDetails: '使用 Linux io_uring 系统调用实现异步 socket 操作。支持 zero-copy send/recv。批量提交优化。',
    benefits: [
      '网络 I/O 延迟降低 15%',
      '吞吐量提升 10-20%',
      '减少系统调用开销',
      '零拷贝支持',
    ],
    breaking: false,
    references: [
      'https://github.com/spdk/spdk/pull/3045',
    ],
    isNew: false,
  },
  {
    id: 'spdk-blobfs-compression',
    title: 'BlobFS inline compression support',
    component: 'blobfs',
    type: 'feature',
    version: '23.05',
    date: '2023-05-10',
    prNumber: 3023,
    author: 'GangCao',
    description: 'BlobFS 支持内联压缩，自动压缩写入数据以节省空间。支持多种压缩算法。',
    impact: 'moderate',
    technicalDetails: '支持 lz4、zstd、deflate 算法。按 blob 级别配置压缩策略。元数据记录压缩状态。',
    benefits: [
      '存储空间节省 40-60%',
      '多种压缩算法可选',
      '透明压缩',
      '可配置压缩级别',
    ],
    breaking: false,
    references: [
      'https://github.com/spdk/spdk/pull/3023',
    ],
    isNew: false,
  },
  {
    id: 'spdk-nvme-apst',
    title: 'NVMe APST (Autonomous Power State Transition)',
    component: 'nvme',
    type: 'feature',
    version: '23.01',
    date: '2023-01-25',
    prNumber: 2956,
    author: 'Darek Stojak',
    description: 'NVMe 驱动支持 APST 功耗状态自动切换，在空闲时降低功耗。对能效敏感场景有用。',
    impact: 'moderate',
    technicalDetails: '配置 NVMe 控制器的 APST 表。设置空闲超时和目标功耗状态。监控功耗状态转换。',
    benefits: [
      '空闲功耗降低 30-50%',
      '自动功耗管理',
      '延长 SSD 寿命',
    ],
    breaking: false,
    references: [
      'https://github.com/spdk/spdk/pull/2956',
    ],
    isNew: false,
  },
  {
    id: 'spdk-nvmf-kv',
    title: 'NVMe-oF KV protocol support',
    component: 'nvmf',
    type: 'feature',
    version: '23.01',
    date: '2023-01-15',
    prNumber: 2934,
    author: 'Hui Liu',
    description: 'NVMe-oF 支持 KV（Key-Value）协议扩展。允许通过 NVMe-oF 访问 KV 存储。',
    impact: 'major',
    technicalDetails: '实现 NVMe KV 命令集扩展。支持 KV 域和命名空间。提供 KV bdev 后端接口。',
    benefits: [
      '原生 KV 协议支持',
      '对象存储集成',
      '低延迟 KV 访问',
    ],
    breaking: false,
    references: [
      'https://github.com/spdk/spdk/pull/2934',
    ],
    isNew: false,
  },

  // 2022 Updates
  {
    id: 'spdk-bdev-write-zeroes',
    title: 'Optimized write zeroes implementation',
    component: 'bdev',
    type: 'performance',
    version: '22.09',
    date: '2022-09-15',
    prNumber: 2789,
    author: 'Paul Luse',
    description: '优化的 write zeroes 实现，利用 NVMe Write Zeroes 命令和硬件卸载加速。',
    impact: 'moderate',
    technicalDetails: '优先使用 NVMe Write Zeroes 命令。支持 DSA 加速的内存填充。批量处理优化。',
    benefits: [
      '清零速度提升 5x',
      '减少写放大',
      'SSD 寿命延长',
    ],
    breaking: false,
    references: [
      'https://github.com/spdk/spdk/pull/2789',
    ],
    isNew: false,
  },
  {
    id: 'spdk-vhost-blk-mq',
    title: 'vhost-blk multi-queue optimization',
    component: 'vhost',
    type: 'performance',
    version: '22.09',
    date: '2022-08-28',
    prNumber: 2767,
    author: 'Changpeng Liu',
    description: 'vhost-blk 多队列优化，显著提升虚拟机存储 I/O 性能。',
    impact: 'major',
    technicalDetails: '支持每 CPU 核心独立的 I/O 队列。优化 virtqueue 分配和调度。减少跨核同步。',
    benefits: [
      'VM 存储 IOPS 提升 40%',
      '更好的扩展性',
      '降低延迟抖动',
    ],
    breaking: false,
    references: [
      'https://github.com/spdk/spdk/pull/2767',
    ],
    isNew: false,
  },
  {
    id: 'spdk-nvme-smart-log',
    title: 'Enhanced SMART log page support',
    component: 'nvme',
    type: 'feature',
    version: '22.05',
    date: '2022-05-20',
    prNumber: 2656,
    author: 'Monica Kenguva',
    description: '增强的 SMART 日志页支持，提供更详细的 SSD 健康和性能指标。',
    impact: 'moderate',
    technicalDetails: '支持 NVMe SMART/Health 日志页的所有字段。添加温度统计、错误计数、使用寿命预估。提供 JSON 格式输出。',
    benefits: [
      '详细的健康监控',
      '预测性故障分析',
      '性能退化检测',
    ],
    breaking: false,
    references: [
      'https://github.com/spdk/spdk/pull/2656',
    ],
    isNew: false,
  },
  {
    id: 'spdk-idxd-initial',
    title: 'Intel IDXD/DSA initial support',
    component: 'idxd',
    type: 'feature',
    version: '22.01',
    date: '2022-01-18',
    prNumber: 2523,
    author: 'Paul Luse',
    description: 'Intel IDXD/DSA（Data Streaming Accelerator）初始支持。为后续硬件加速奠定基础。',
    impact: 'major',
    technicalDetails: '实现 IDXD 驱动框架。支持 DSA 工作队列分配。基本的内存拷贝和 CRC 操作。',
    benefits: [
      '硬件加速基础',
      'DSA 内存操作',
      'CPU 卸载能力',
    ],
    breaking: false,
    references: [
      'https://github.com/spdk/spdk/pull/2523',
    ],
    isNew: false,
  },

  // API Changes / Deprecations
  {
    id: 'spdk-bdev-api-v3',
    title: 'bdev API v3 - major interface update',
    component: 'bdev',
    type: 'api-change',
    version: '24.01',
    date: '2024-01-05',
    prNumber: 3278,
    author: 'Jim Harris',
    description: 'bdev API 重大更新，统一接口并改进错误处理。部分 API 签名变更。',
    impact: 'major',
    technicalDetails: '统一 bdev_io 结构。改进异步回调机制。增加更多错误码。移除废弃的 API。',
    benefits: [
      '更一致的 API',
      '更好的错误处理',
      '简化扩展开发',
    ],
    breaking: true,
    references: [
      'https://github.com/spdk/spdk/pull/3278',
    ],
    isNew: false,
  },
  {
    id: 'spdk-deprecate-vhost-user',
    title: 'Deprecate vhost-user-blk in favor of vhost-vdpa',
    component: 'vhost',
    type: 'deprecation',
    version: '24.05',
    date: '2024-04-10',
    prNumber: 3345,
    author: 'Changpeng Liu',
    description: '废弃 vhost-user-blk，推荐使用 vhost-vdpa。后者提供更好的内核集成。',
    impact: 'moderate',
    technicalDetails: 'vhost-user-blk 标记为废弃。计划在 25.01 移除。迁移指南已提供。',
    benefits: [
      '统一 vDPA 架构',
      '更好的内核支持',
      '硬件卸载路径',
    ],
    breaking: true,
    references: [
      'https://github.com/spdk/spdk/pull/3345',
    ],
    isNew: false,
  },
]

// 统计信息
export function getVersionStats() {
  const stats: Record<string, { features: number, perf: number, bugfixes: number }> = {}
  for (const u of spdkUpdates) {
    if (!stats[u.version]) {
      stats[u.version] = { features: 0, perf: 0, bugfixes: 0 }
    }
    if (u.type === 'feature') stats[u.version].features++
    else if (u.type === 'performance') stats[u.version].perf++
    else if (u.type === 'bugfix') stats[u.version].bugfixes++
  }
  return stats
}

export function getComponentStats() {
  const stats: Record<SpdkComponent, number> = {} as any
  for (const u of spdkUpdates) {
    stats[u.component] = (stats[u.component] || 0) + 1
  }
  return stats
}