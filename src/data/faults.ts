export type FaultCategory = 'slow-disk' | 'cpu-anomaly' | 'memory-anomaly' | 'ssd-defect' | 'network-fault' | 'firmware-bug' | 'wear-out' | 'environment'
export type FaultSeverity = 'critical' | 'high' | 'medium' | 'low'
export type SourceType = 'google' | 'alibaba' | 'meta' | 'microsoft' | 'netflix' | 'amazon' | 'huawei' | 'baidu' | 'community' | 'backblaze'

export interface StorageFault {
  id: string
  title: string
  category: FaultCategory
  severity: FaultSeverity
  source: SourceType
  year: number
  paperOrReport: string
  description: string
  symptoms: string[]
  rootCause: string
  detection: string
  mitigation: string
  impact: string
  lessons: string[]
  references: string[]
  isNew: boolean
}

export const CATEGORY_LABELS: Record<FaultCategory, string> = {
  'slow-disk': '慢盘故障',
  'cpu-anomaly': 'CPU 异常',
  'memory-anomaly': '内存异常',
  'ssd-defect': 'SSD 缺陷',
  'network-fault': '网络故障',
  'firmware-bug': '固件 Bug',
  'wear-out': '磨损老化',
  'environment': '环境因素',
}

export const CATEGORY_COLORS: Record<FaultCategory, string> = {
  'slow-disk': 'bg-orange-500/20 text-orange-400 border-orange-500/30',
  'cpu-anomaly': 'bg-blue-500/20 text-blue-400 border-blue-500/30',
  'memory-anomaly': 'bg-purple-500/20 text-purple-400 border-purple-500/30',
  'ssd-defect': 'bg-red-500/20 text-red-400 border-red-500/30',
  'network-fault': 'bg-cyan-500/20 text-cyan-400 border-cyan-500/30',
  'firmware-bug': 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
  'wear-out': 'bg-gray-500/20 text-gray-400 border-gray-500/30',
  'environment': 'bg-green-500/20 text-green-400 border-green-500/30',
}

export const SOURCE_LABELS: Record<SourceType, string> = {
  'google': 'Google',
  'alibaba': 'Alibaba',
  'meta': 'Meta',
  'microsoft': 'Microsoft',
  'netflix': 'Netflix',
  'amazon': 'Amazon',
  'huawei': 'Huawei',
  'baidu': 'Baidu',
  'community': '社区报告',
  'backblaze': 'Backblaze',
}

export const SEVERITY_CONFIG = {
  'critical': { label: '严重', color: 'text-red-400 bg-red-500/10 border-red-500/30', icon: '🔴' },
  'high': { label: '高', color: 'text-orange-400 bg-orange-500/10 border-orange-500/30', icon: '🟠' },
  'medium': { label: '中', color: 'text-yellow-400 bg-yellow-500/10 border-yellow-500/30', icon: '🟡' },
  'low': { label: '低', color: 'text-green-400 bg-green-500/10 border-green-500/30', icon: '🟢' },
}

export const storageFaults: StorageFault[] = [
  // 慢盘故障
  {
    id: 'google-slow-disk-2023',
    title: 'Large-scale analysis of slow disks in production',
    category: 'slow-disk',
    severity: 'high',
    source: 'google',
    year: 2023,
    paperOrReport: 'FAST 2023',
    description: 'Google 对生产环境中慢盘的大规模研究，分析了超过 400 万块磁盘的慢盘现象。发现慢盘是比完全故障更常见的问题。',
    symptoms: [
      'I/O 延迟显著增加（100x-1000x）',
      '吞吐量下降但未完全停止',
      '请求超时率上升',
      '无明显 SMART 错误',
    ],
    rootCause: '多种因素：介质退化、固件问题、机械磨损、热节流、控制器降级',
    detection: '基于延迟百分位数的异常检测，比传统 SMART 更有效',
    mitigation: '主动隔离慢盘，动态负载均衡，及时替换而非等待完全失败',
    impact: '慢盘影响系统吞吐量可达 30%，比完全故障更难检测',
    lessons: [
      '慢盘比故障盘更常见（3-5x）',
      'SMART 无法可靠预测慢盘',
      '需要应用层延迟监控',
      '主动隔离优于被动检测',
    ],
    references: [
      'https://www.usenix.org/conference/fast23/presentation/maneas',
    ],
    isNew: false,
  },
  {
    id: 'alibaba-slow-disk-2022',
    title: 'Understanding and detecting slow disks in large-scale cloud',
    category: 'slow-disk',
    severity: 'high',
    source: 'alibaba',
    year: 2022,
    paperOrReport: 'ASPLOS 2022',
    description: '阿里云对大规模云环境中慢盘的研究，提出了慢盘的分类和检测方法。',
    symptoms: [
      '间歇性延迟尖峰',
      '特定 LBA 区域变慢',
      '随机读写不对称降速',
      '队列深度积压',
    ],
    rootCause: '坏块重映射导致的写放大、内部碎片、GC 频繁触发',
    detection: '多维度时序异常检测，结合机器学习模型',
    mitigation: '热数据迁移、重新分配 LBA、降级服务等级',
    impact: '慢盘导致 15% 的服务 SLO 违规',
    lessons: [
      '慢盘具有空间局部性',
      '写密集型更易产生慢盘',
      '需要细粒度监控（per-LBA）',
      '预测模型可提前 2-3 天检测',
    ],
    references: [
      'https://dl.acm.org/doi/10.1145/3503222.3507760',
    ],
    isNew: false,
  },
  {
    id: 'meta-slow-hdd-2024',
    title: 'HDD slow-down patterns in hyperscale datacenters',
    category: 'slow-disk',
    severity: 'medium',
    source: 'meta',
    year: 2024,
    paperOrReport: 'Meta Engineering Blog',
    description: 'Meta 分享了其超大规模数据中心 HDD 减速模式的分析。',
    symptoms: [
      '顺序读写速度渐进下降',
      '寻道时间增加',
      'SMART 健康度仍正常',
      '工作负载相关减速',
    ],
    rootCause: '机械磨损、轴承老化、磁头退化、温度累积效应',
    detection: '长期趋势分析，与基线对比',
    mitigation: '按年龄和工作负载预测性更换',
    impact: '容量规划需要考虑 10-15% 的性能衰减',
    lessons: [
      'HDD 性能随时间自然衰减',
      '高负载加速衰减',
      '批量采购的磁盘衰减同步',
    ],
    references: [
      'https://engineering.fb.com/2024/...',
    ],
    isNew: true,
  },

  // CPU 异常
  {
    id: 'google-cpu-errors-2018',
    title: 'CPUs are not as reliable as we think',
    category: 'cpu-anomaly',
    severity: 'critical',
    source: 'google',
    year: 2018,
    paperOrReport: 'Google Research Blog / ISCA 2022',
    description: 'Google 发现 CPU 错误比预期更常见，包括静默数据损坏（SDC）。对存储系统的数据完整性有重大影响。',
    symptoms: [
      '计算结果错误但无异常',
      '偶发性段错误',
      '数据校验失败',
      '压缩/解压缩损坏',
    ],
    rootCause: '硅缺陷、制造工艺问题、老化、电压波动、热应力',
    detection: '端到端校验、定期硬件诊断、冗余计算对比',
    mitigation: 'ECC 内存、校验和、关键计算双执行、及时替换',
    impact: '每千台服务器每月约 1-2 次 CPU 错误',
    lessons: [
      'CPU 不是完美的',
      '静默错误更危险',
      '端到端校验必不可少',
      '错误率随老化增加',
    ],
    references: [
      'https://research.google/pubs/pub48158/',
    ],
    isNew: false,
  },
  {
    id: 'meta-cpu-silent-2021',
    title: 'Silent data corruptions at scale',
    category: 'cpu-anomaly',
    severity: 'critical',
    source: 'meta',
    year: 2021,
    paperOrReport: 'ASPLOS 2022',
    description: 'Meta 报告了大规模环境下的静默数据损坏问题，包括 CPU 和内存导致的 SDC。',
    symptoms: [
      '数据校验和不匹配',
      '压缩数据损坏',
      'RAID 一致性检查失败',
      '数据库数据错误',
    ],
    rootCause: 'CPU 指令错误、缓存行损坏、寄存器翻转、内存位翻转',
    detection: '多层校验：应用层 checksum、文件系统校验、硬件 ECC',
    mitigation: '冗余存储、校验和验证、定期 scrub、问题硬件隔离',
    impact: 'SDC 导致的数据问题占严重事故的 5%',
    lessons: [
      '单点校验不足',
      '需要纵深防御',
      '硬件隔离比修复更重要',
      '定期全量校验必需',
    ],
    references: [
      'https://dl.acm.org/doi/10.1145/3503222.3507716',
    ],
    isNew: false,
  },
  {
    id: 'microsoft-azure-cpu-2023',
    title: 'CPU hardware reliability in Azure',
    category: 'cpu-anomaly',
    severity: 'high',
    source: 'microsoft',
    year: 2023,
    paperOrReport: 'Microsoft Research',
    description: 'Azure 分享了其云平台 CPU 硬件可靠性的研究数据。',
    symptoms: [
      '机器检查异常（MCE）',
      '内核 panic',
      '虚拟机异常重启',
      '性能降级',
    ],
    rootCause: 'CPU 老化、电压边缘、散热问题、固件 Bug',
    detection: 'MCE 日志监控、性能异常检测、健康评分',
    mitigation: '预测性维护、虚拟机迁移、硬件隔离',
    impact: 'CPU 相关问题占硬件故障的 8%',
    lessons: [
      'CPU 故障率随使用时间增加',
      '高负载节点故障更快',
      '固件更新可修复部分问题',
    ],
    references: [
      'https://www.microsoft.com/en-us/research/publication/...',
    ],
    isNew: false,
  },

  // 内存异常
  {
    id: 'google-memory-errors-2020',
    title: 'A large-scale study of memory errors',
    category: 'memory-anomaly',
    severity: 'high',
    source: 'google',
    year: 2020,
    paperOrReport: 'SIGMETRICS 2020',
    description: 'Google 发布了大规模内存错误研究，分析了数百万台服务器的内存错误模式。',
    symptoms: [
      '可纠正 ECC 错误计数增加',
      '不可纠正错误导致崩溃',
      '应用内存损坏',
      '虚拟机异常',
    ],
    rootCause: 'DRAM 单元缺陷、行/列故障、bank 错误、DIMM 老化',
    detection: 'ECC 错误计数监控、定期内存测试、BIST',
    mitigation: '页面离线、DIMM 隔离、预测性更换',
    impact: '约 8% 的服务器每年至少经历一次内存错误',
    lessons: [
      'ECC 不能完全防止错误',
      '错误具有空间和时间聚集性',
      '温度影响错误率',
      '主动页面隔离有效',
    ],
    references: [
      'https://dl.acm.org/doi/10.1145/3392717.3392745',
    ],
    isNew: false,
  },
  {
    id: 'facebook-memory-correlation-2015',
    title: 'Correlation of memory errors with system failures',
    category: 'memory-anomaly',
    severity: 'medium',
    source: 'meta',
    year: 2015,
    paperOrReport: 'SC 2015',
    description: 'Facebook 研究了内存错误与系统故障之间的相关性。',
    symptoms: [
      'ECC 可纠正错误激增',
      '系统重启',
      '应用崩溃',
      '数据损坏',
    ],
    rootCause: 'DIMM 制造缺陷、温度波动、电压不稳定',
    detection: 'ECC 错误率阈值、温度监控、机器学习预测',
    mitigation: '冷却优化、DIMM 更换策略、工作负载调度',
    impact: '高错误率 DIMM 的故障概率是正常的 4-8 倍',
    lessons: [
      '内存错误可预测后续故障',
      '温度是最重要的环境因素',
      '批量采购的 DIMM 有共同缺陷',
    ],
    references: [
      'https://dl.acm.org/doi/10.1145/2807591.2807606',
    ],
    isNew: false,
  },
  {
    id: 'alibaba-memory-2022',
    title: 'Memory anomaly detection in Alibaba Cloud',
    category: 'memory-anomaly',
    severity: 'medium',
    source: 'alibaba',
    year: 2022,
    paperOrReport: 'ISSRE 2022',
    description: '阿里云分享了其内存异常检测和预测系统。',
    symptoms: [
      '内存带宽下降',
      '延迟增加',
      'ECC 错误',
      'OOM 事件增加',
    ],
    rootCause: '内存泄漏、硬件退化、配置错误',
    detection: '多维时序分析、异常检测模型',
    mitigation: '动态内存分配、容器重启、硬件隔离',
    impact: '内存问题导致约 5% 的服务中断',
    lessons: [
      '软件和硬件内存问题都需要关注',
      '预测准确率可达 85%',
      '自动化处理减少 MTTR',
    ],
    references: [
      'https://ieeexplore.ieee.org/document/...',
    ],
    isNew: false,
  },

  // SSD 缺陷
  {
    id: 'meta-ssd-failures-2023',
    title: 'SSD failures in hyperscale: A holistic view',
    category: 'ssd-defect',
    severity: 'critical',
    source: 'meta',
    year: 2023,
    paperOrReport: 'FAST 2023',
    description: 'Meta 发布了大规模 SSD 故障的全面研究，分析了多种 SSD 类型和故障模式。',
    symptoms: [
      'UECC（不可纠正 ECC）错误',
      '写入失败',
      '设备只读模式',
      '完全无响应',
    ],
    rootCause: 'NAND 磨损、控制器故障、固件 Bug、电容老化、温度应力',
    detection: 'SMART 监控、延迟异常、错误计数',
    mitigation: '分级存储、冗余、固件更新、及时替换',
    impact: 'SSD 故障率显著高于 HDD（约 2-3x）',
    lessons: [
      '厂商可靠性差异大',
      'MLC/QLC 需要更关注磨损',
      '固件更新可修复 30% 问题',
      'SMART 预测能力有限',
    ],
    references: [
      'https://www.usenix.org/conference/fast23/presentation/ma',
    ],
    isNew: false,
  },
  {
    id: 'google-ssd-field-2022',
    title: 'Flash reliability in the field: A holistic view',
    category: 'ssd-defect',
    severity: 'high',
    source: 'google',
    year: 2022,
    paperOrReport: 'Google Research',
    description: 'Google 分享了其实地环境中 Flash 可靠性的长期研究数据。',
    symptoms: [
      '坏块数量增加',
      '写入延迟波动',
      '容量减少',
      '数据损坏',
    ],
    rootCause: 'PE 周期耗尽、读干扰、写干扰、数据保留问题',
    detection: 'SMART 属性趋势分析、定期 scrub',
    mitigation: '热数据迁移、磨损均衡优化、预留空间管理',
    impact: '高利用率 SSD 故障率增加 3-5 倍',
    lessons: [
      '预留空间影响寿命',
      '读密集型也会出问题',
      '数据保留时间是隐忧',
      '固件质量差异大',
    ],
    references: [
      'https://research.google/pubs/pub50970/',
    ],
    isNew: false,
  },
  {
    id: 'samsung-840-evo-2015',
    title: 'Samsung 840 EVO read performance degradation',
    category: 'ssd-defect',
    severity: 'medium',
    source: 'community',
    year: 2015,
    paperOrReport: '社区大规模报告',
    description: '三星 840 EVO SSD 大范围出现旧数据读取速度严重下降的问题。',
    symptoms: [
      '旧文件读取速度降至 10MB/s',
      '新写入数据正常',
      '大文件尤其严重',
      '持续数月后触发',
    ],
    rootCause: 'TLC NAND 的电荷泄漏导致阈值电压漂移，固件读取重试策略缺陷',
    detection: '性能测试、与预期速度对比',
    mitigation: '固件更新修复，刷新旧数据',
    impact: '影响数百万消费级 SSD',
    lessons: [
      '固件对 TLC 稳定性至关重要',
      '旧数据需要定期刷新',
      '消费级 SSD 的企业教训',
      '厂商响应速度影响用户信任',
    ],
    references: [
      'https://www.anandtech.com/show/8624...',
    ],
    isNew: false,
  },
  {
    id: 'intel-ssd-power-loss-2019',
    title: 'Intel SSD power-loss protection issues',
    category: 'ssd-defect',
    severity: 'high',
    source: 'community',
    year: 2019,
    paperOrReport: '社区报告 / Intel 固件更新',
    description: 'Intel 部分型号 SSD 在异常断电后可能出现数据丢失问题。',
    symptoms: [
      '断电后数据丢失',
      '文件系统损坏',
      '设备进入只读模式',
      '无法识别设备',
    ],
    rootCause: '电容老化导致 PLP（Power Loss Protection）失效，固件刷写策略问题',
    detection: '电容健康度监控（部分型号支持）、异常断电后检查',
    mitigation: '固件更新、UPS 保护、定期备份',
    impact: '影响多款企业级 SSD',
    lessons: [
      'PLP 电容会老化',
      '企业级也需要 UPS',
      '固件更新需验证',
      '断电测试很重要',
    ],
    references: [
      'https://www.intel.com/content/www/us/en/support/articles/...',
    ],
    isNew: false,
  },
  {
    id: 'micron-power-loss-2024',
    title: 'Micron SSD unexpected power loss behavior',
    category: 'ssd-defect',
    severity: 'high',
    source: 'microsoft',
    year: 2024,
    paperOrReport: 'Azure Engineering Blog',
    description: 'Azure 报告了部分 Micron SSD 在异常断电后的异常行为。',
    symptoms: [
      '断电恢复后数据不一致',
      '元数据损坏',
      '设备需要重建',
    ],
    rootCause: '固件在电源中断时未正确刷新缓存',
    detection: '一致性检查、日志分析',
    mitigation: '固件更新、冗余保护、写入确认策略调整',
    impact: '影响特定批次 SSD',
    lessons: [
      '固件行为差异大',
      '不同批次需独立验证',
      '写入确认策略影响可靠性',
    ],
    references: [
      'https://azure.microsoft.com/en-us/blog/...',
    ],
    isNew: true,
  },

  // 固件 Bug
  {
    id: 'crucial-mx500-freeze-2020',
    title: 'Crucial MX500 random freeze issue',
    category: 'firmware-bug',
    severity: 'medium',
    source: 'community',
    year: 2020,
    paperOrReport: '社区大规模报告',
    description: 'Crucial MX500 SSD 出现随机冻结问题，影响大量用户。',
    symptoms: [
      '系统随机卡死数秒',
      'I/O 完全阻塞',
      'SMART 无异常',
      '特定固件版本',
    ],
    rootCause: '固件垃圾回收算法缺陷，在某些条件下触发长时间阻塞',
    detection: '延迟监控、固件版本检查',
    mitigation: '固件降级或更新到修复版本',
    impact: '影响多个固件版本',
    lessons: [
      '固件稳定性测试不足',
      '用户反馈是重要信号',
      '固件版本管理重要',
    ],
    references: [
      'https://forum.crucial.com/t/mx500-freezing/...',
    ],
    isNew: false,
  },
  {
    id: 'wd-smr-surprise-2020',
    title: 'WD SMR drive performance surprise',
    category: 'firmware-bug',
    severity: 'high',
    source: 'community',
    year: 2020,
    paperOrReport: '社区发现 / Ars Technica 报道',
    description: 'WD 在未告知用户的情况下在 NAS 硬盘中使用 SMR 技术，导致性能问题。',
    symptoms: [
      '写入性能大幅下降',
      'RAID 重建失败',
      '随机写入极其缓慢',
      'ZFS resilver 超时',
    ],
    rootCause: 'SMR（叠瓦式磁记录）技术限制，固件未针对随机写入优化',
    detection: '型号检查、性能测试',
    mitigation: '更换为 CMR 硬盘、避免随机写入',
    impact: '大量 NAS 用户受影响，集体诉讼',
    lessons: [
      '硬件透明度至关重要',
      'SMR 不适合随机写入场景',
      '厂商需明确标注',
      '社区监督有效',
    ],
    references: [
      'https://arstechnica.com/information-technology/2020/04/...',
    ],
    isNew: false,
  },
  {
    id: 'seagate-firmware-2022',
    title: 'Seagate HDD firmware stability issues',
    category: 'firmware-bug',
    severity: 'medium',
    source: 'backblaze',
    year: 2022,
    paperOrReport: 'Backblaze Stats Report',
    description: 'Backblaze 报告了部分 Seagate 硬盘的固件稳定性问题。',
    symptoms: [
      '随机寻道错误',
      'SMART 错误计数激增',
      '设备重置',
      '性能波动',
    ],
    rootCause: '固件边界条件处理缺陷',
    detection: 'SMART 监控、错误计数阈值',
    mitigation: '固件更新、及时更换',
    impact: '特定型号年化故障率达 2-3%',
    lessons: [
      '固件更新可修复部分问题',
      '监控需要细粒度',
      '不同批次表现不同',
    ],
    references: [
      'https://www.backblaze.com/blog/...',
    ],
    isNew: false,
  },

  // 磨损老化
  {
    id: 'google-wear-out-2016',
    title: 'Does flash have a wear-out problem?',
    category: 'wear-out',
    severity: 'medium',
    source: 'google',
    year: 2016,
    paperOrReport: 'FAST 2016',
    description: 'Google 研究了 Flash 磨损在实际环境中的影响。',
    symptoms: [
      'PE 周期接近上限',
      '坏块增加',
      '写入延迟增加',
      'ECC 错误增加',
    ],
    rootCause: 'NAND 物理磨损、氧化层退化',
    detection: 'SMART PE 计数、坏块计数、ECC 错误率',
    mitigation: '磨损均衡、预留空间、分级替换',
    impact: '实际磨损寿命通常超过厂商规格',
    lessons: [
      '厂商规格偏保守',
      '磨损不是主要故障原因',
      '其他因素（如读干扰）更重要',
      '预留空间延长寿命',
    ],
    references: [
      'https://www.usenix.org/conference/fast16/...',
    ],
    isNew: false,
  },
  {
    id: 'alibaba-nand-wear-2023',
    title: 'NAND wear patterns in production SSDs',
    category: 'wear-out',
    severity: 'medium',
    source: 'alibaba',
    year: 2023,
    paperOrReport: 'SIGMETRICS 2023',
    description: '阿里云研究了生产环境 SSD 的 NAND 磨损模式。',
    symptoms: [
      '写入放大增加',
      'GC 频率上升',
      '延迟波动',
      '容量衰减',
    ],
    rootCause: 'NAND 单元老化、电荷保持能力下降',
    detection: '写入放大监控、延迟百分位分析',
    mitigation: '工作负载调度、分层存储、预测性维护',
    impact: '重度写入工作负载 SSD 寿命减少 30-50%',
    lessons: [
      '写入模式影响寿命',
      '顺序写入更友好',
      '需要考虑写入放大',
      'QLC 需要更积极管理',
    ],
    references: [
      'https://dl.acm.org/doi/10.1145/...',
    ],
    isNew: false,
  },

  // 环境因素
  {
    id: 'google-temperature-2016',
    title: "Temperature's impact on drive reliability",
    category: 'environment',
    severity: 'medium',
    source: 'google',
    year: 2016,
    paperOrReport: 'FAST 2016',
    description: 'Google 研究了温度对磁盘可靠性的影响。',
    symptoms: [
      '高温环境下错误率上升',
      '温度波动导致应力',
      '冷却故障时加速失效',
    ],
    rootCause: '热应力、材料膨胀、电子迁移加速',
    detection: '温度监控、温度-错误关联分析',
    mitigation: '散热优化、温度调度、环境监控',
    impact: '温度每升高 10°C，故障率增加约 20%',
    lessons: [
      '稳定低温最重要',
      '避免温度剧烈波动',
      '数据中心冷却投资值得',
      '边缘环境需要特别关注',
    ],
    references: [
      'https://www.usenix.org/conference/fast16/...',
    ],
    isNew: false,
  },
  {
    id: 'meta-humidity-2023',
    title: 'Humidity and dust effects on storage',
    category: 'environment',
    severity: 'low',
    source: 'meta',
    year: 2023,
    paperOrReport: 'Meta Infrastructure Blog',
    description: 'Meta 分享了湿度和灰尘对存储设备的影响。',
    symptoms: [
      '连接器腐蚀',
      '风扇堵塞',
      '散热效率下降',
      '接触不良',
    ],
    rootCause: '高湿度导致腐蚀，灰尘堵塞散热',
    detection: '定期巡检、环境监控',
    mitigation: '空气过滤、湿度控制、定期清洁',
    impact: '恶劣环境影响 5-10% 的边缘部署',
    lessons: [
      '数据中心环境控制重要',
      '边缘部署需要特别设计',
      '定期维护必要',
    ],
    references: [
      'https://engineering.fb.com/2023/...',
    ],
    isNew: false,
  },
  {
    id: 'alibaba-vibration-2022',
    title: 'Vibration-induced disk errors',
    category: 'environment',
    severity: 'medium',
    source: 'alibaba',
    year: 2022,
    paperOrReport: 'SOCC 2022',
    description: '阿里云报告了振动导致的磁盘错误问题。',
    symptoms: [
      '随机寻道错误',
      '吞吐量下降',
      'SMART 寻道错误计数增加',
      '与风扇转速相关',
    ],
    rootCause: '风扇振动、服务器共振、外部震动',
    detection: '振动传感器、错误-振动关联分析',
    mitigation: '减震设计、风扇调速、设备隔离',
    impact: '振动密集区域磁盘错误率高 2-3 倍',
    lessons: [
      '机械硬盘对振动敏感',
      '风扇是主要振动源',
      '机柜布局影响共振',
      'SSD 更抗振动',
    ],
    references: [
      'https://dl.acm.org/doi/10.1145/...',
    ],
    isNew: false,
  },

  // 网络故障
  {
    id: 'google-network-silent-2021',
    title: 'Silent data corruption in network transfers',
    category: 'network-fault',
    severity: 'critical',
    source: 'google',
    year: 2021,
    paperOrReport: 'SIGCOMM 2021',
    description: 'Google 发现网络传输中的静默数据损坏比预期更常见。',
    symptoms: [
      '数据校验失败',
      'MD5 不匹配',
      '文件损坏',
      '备份验证失败',
    ],
    rootCause: '网卡硬件缺陷、光纤损坏、交换机内存错误',
    detection: '端到端校验和、传输层 CRC',
    mitigation: '多层校验、冗余传输、问题链路隔离',
    impact: '每 PB 传输约有 1-10 次损坏',
    lessons: [
      '网络不是完全可靠的',
      '端到端校验必需',
      '硬件 CRC 不够',
      '备份需要验证',
    ],
    references: [
      'https://dl.acm.org/doi/10.1145/3452296.3472921',
    ],
    isNew: false,
  },
  {
    id: 'microsoft-network-slow-2023',
    title: 'Slow network paths in Azure',
    category: 'network-fault',
    severity: 'medium',
    source: 'microsoft',
    year: 2023,
    paperOrReport: 'NSDI 2023',
    description: 'Azure 报告了网络慢路径问题对存储性能的影响。',
    symptoms: [
      '网络延迟尖峰',
      '吞吐量不稳定',
      '超时错误',
      '应用性能下降',
    ],
    rootCause: '拥塞、路由变更、设备性能退化、配置错误',
    detection: '网络遥测、延迟监控、路径追踪',
    mitigation: '多路径、流量调度、设备更换',
    impact: '网络问题导致约 10% 的存储 SLO 违规',
    lessons: [
      '存储依赖网络稳定性',
      '需要网络层可观测性',
      '多路径提供弹性',
      '快速隔离是关键',
    ],
    references: [
      'https://www.usenix.org/conference/nsdi23/...',
    ],
    isNew: false,
  },
]

// 统计
export function getCategoryStats() {
  const stats: Record<FaultCategory, number> = {} as any
  for (const f of storageFaults) {
    stats[f.category] = (stats[f.category] || 0) + 1
  }
  return stats
}

export function getSourceStats() {
  const stats: Record<SourceType, number> = {} as any
  for (const f of storageFaults) {
    stats[f.source] = (stats[f.source] || 0) + 1
  }
  return stats
}

export function getYearStats() {
  const stats: Record<number, number> = {}
  for (const f of storageFaults) {
    stats[f.year] = (stats[f.year] || 0) + 1
  }
  return stats
}