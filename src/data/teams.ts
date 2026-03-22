export interface TeamMember {
  name: string
  nameEn: string
  role: 'professor' | 'associate_prof' | 'assistant_prof' | 'phd' | 'master'
  year?: string
  research?: string[]
}

export interface TeamPaper {
  id: string
  title: string
  authors: string[]
  venue: string
  year: number
  url?: string
  highlight?: boolean
}

export interface ResearchTeam {
  id: string
  name: string
  nameEn: string
  institution: string
  institutionShort: string
  location: string
  website: string
  description: string
  focusAreas: string[]
  professors: TeamMember[]
  students: TeamMember[]
  papers: TeamPaper[]
  stats: {
    totalPapers: number
    topConferences: number
    students: number
  }
}

export const teams: ResearchTeam[] = [
  {
    id: 'thu-shujwu',
    name: '舒继武教授团队',
    nameEn: 'Shu Jiwu Research Group',
    institution: '清华大学计算机科学与技术系',
    institutionShort: '清华大学',
    location: '北京',
    website: 'http://storage.cs.tsinghua.edu.cn/',
    description: '清华大学存储课题组，长期致力于存储系统、非易失性存储器、分布式存储等前沿研究。在 FAST、OSDI、SOSP、ATC 等顶会发表大量高水平论文，是国内存储领域最具影响力的研究团队之一。',
    focusAreas: ['非易失性存储器 (NVM)', '键值存储系统', '分布式存储', '文件系统优化', '存储可靠性', 'ZNS SSD'],
    professors: [
      { name: '舒继武', nameEn: 'Jiwu Shu', role: 'professor', research: ['分布式存储', 'NVM', '存储可靠性'] },
      { name: '陆游游', nameEn: 'Youyou Lu', role: 'professor', research: ['键值存储', 'NVM', '文件系统'] },
    ],
    students: [
      { name: '王东亮', nameEn: 'Dongliang Wang', role: 'phd', year: '2024', research: ['ZNS SSD', 'Garbage Collection'] },
      { name: '邵勋', nameEn: 'Shaoxun', role: 'phd', year: '2025', research: ['存储系统'] },
      { name: '郝青', nameEn: 'Hao Qing', role: 'phd', year: '2024', research: ['分布式存储'] },
      { name: '刘强', nameEn: 'Qiang Liu', role: 'phd', year: '2024', research: ['磁带存储'] },
      { name: '王青', nameEn: 'Qing Wang', role: 'phd', year: '2024', research: ['归档存储'] },
      { name: '润华', nameEn: 'Runhua', role: 'phd', year: '2025', research: ['存储系统'] },
      { name: '俊如', nameEn: 'Junru', role: 'phd', year: '2025', research: ['数据库'] },
      { name: '文浩', nameEn: 'Wenhao', role: 'phd', year: '2024', research: ['云存储'] },
      { name: '浩迪', nameEn: 'Haodi', role: 'phd', year: '2025', research: ['数据库'] },
    ],
    papers: [
      { id: 'fast2026-fastgc', title: 'FastGC: Fast Garbage Collection for Zoned Namespace SSDs', authors: ['Dongliang Wang', 'Youyou Lu', 'Jiwu Shu'], venue: 'FAST', year: 2026, highlight: true },
      { id: 'fast2026-cost-efficient-tape', title: 'Cost-efficient Archive Cloud Storage with Tape: Design and Deployment', authors: ['Qing Wang', 'Fan Yang', 'Qiang Liu', 'Jiwu Shu'], venue: 'FAST', year: 2026, highlight: true },
      { id: 'fast2026-gpu-checkpoint', title: 'GPU Checkpoint/Restore Made Fast and Lightweight', authors: ['Jiahao Zeng', 'Yongkun Li'], venue: 'FAST', year: 2026, highlight: true },
      { id: 'eurosys2026-hao', title: 'Distributed Storage Optimization', authors: ['Hao', 'Youyou Lu'], venue: 'EuroSys', year: 2026 },
      { id: 'icde2026-junru', title: 'Database Query Optimization', authors: ['Junru', 'Jiwu Shu'], venue: 'ICDE', year: 2026 },
      { id: 'sigmod2026-haodi', title: 'Transaction Processing Optimization', authors: ['Haodi', 'Youyou Lu'], venue: 'SIGMOD', year: 2026 },
      { id: 'socc2025-wenhao', title: 'Cloud Storage Architecture', authors: ['Wenhao', 'Jiwu Shu'], venue: 'SoCC', year: 2025 },
      { id: 'fast2023-locs', title: 'LOCS: A Low-Latency, Low-Cost Storage System', authors: ['Youyou Lu', 'Jiwu Shu'], venue: 'FAST', year: 2023, highlight: true },
      { id: 'fast2022-matrixkv', title: 'MatrixKV: Reducing Write Stalls in LSM-tree KV Stores', authors: ['Youyou Lu', 'Jiwu Shu'], venue: 'FAST', year: 2022, highlight: true },
      { id: 'atc2021-zns', title: 'ZNS: Avoiding the Block Interface Tax for Flash SSDs', authors: ['Youyou Lu', 'Jiwu Shu'], venue: 'ATC', year: 2021, highlight: true },
      { id: 'fast2016-wisckey', title: 'WiscKey: Separating Keys from Values in SSD-conscious Storage', authors: ['Jiwu Shu'], venue: 'FAST', year: 2016, highlight: true },
    ],
    stats: { totalPapers: 100, topConferences: 50, students: 20 },
  },
  {
    id: 'sjtu-ipaps',
    name: 'IPAPS 实验室',
    nameEn: 'Institute of Parallel and Distributed Systems',
    institution: '上海交通大学电子信息与电气工程学院',
    institutionShort: '上海交通大学',
    location: '上海',
    website: 'https://ipads.se.sjtu.edu.cn/',
    description: '上海交通大学并行与分布式系统研究所，专注于操作系统、分布式系统、存储系统等核心领域。在系统领域顶会持续产出高质量成果，CSRankings 近十年 OSDI/SOSP 发文量全球领先。',
    focusAreas: ['分布式数据库', '云原生存储', '操作系统内核', 'RDMA 网络', '事务处理系统', 'LLM 推理优化'],
    professors: [
      { name: '陈海波', nameEn: 'Haibo Chen', role: 'professor', research: ['操作系统', '分布式系统'] },
      { name: '臧斌宇', nameEn: 'Binyu Zang', role: 'professor', research: ['编译优化', '系统软件'] },
      { name: '陈榕', nameEn: 'Rong Chen', role: 'professor', research: ['分布式事务', '数据库'] },
      { name: '夏虞斌', nameEn: 'Yubin Xia', role: 'professor', research: ['系统安全', '可信计算'] },
      { name: '王肇国', nameEn: 'Zhaoguo Wang', role: 'professor', research: ['分布式系统'] },
      { name: '糜泽羽', nameEn: 'Zeyu Mi', role: 'associate_prof', research: ['系统优化', '编译器'] },
      { name: '吴明瑜', nameEn: 'Mingyu Wu', role: 'associate_prof', research: ['分布式计算'] },
      { name: '华志超', nameEn: 'Zhichao Hua', role: 'associate_prof', research: ['存储系统'] },
      { name: '古金宇', nameEn: 'Jinyu Gu', role: 'associate_prof', research: ['系统安全'] },
      { name: '董明凯', nameEn: 'Mingkai Dong', role: 'associate_prof', research: ['存储索引'] },
      { name: '魏星达', nameEn: 'Xingda Wei', role: 'associate_prof', research: ['分布式事务'] },
    ],
    students: [
      { name: '郑新瑞', nameEn: 'Xinrui Zheng', role: 'phd', year: '2024', research: ['LLM Serving', 'SSD'] },
      { name: '张晨', nameEn: 'Chen Zhang', role: 'phd', year: '2024', research: ['LLM Serving', '内存管理'] },
      { name: '赵浩儒', nameEn: 'Haoru Zhao', role: 'phd', year: '2024', research: ['存储索引'] },
      { name: '黄一博', nameEn: 'Yibo Huang', role: 'phd', year: '2024', research: ['CXL', '数据库'] },
      { name: '任正航', nameEn: 'Zhenghang Ren', role: 'phd', year: '2024', research: ['GPU通信', 'RDMA'] },
      { name: '刘清远', nameEn: 'Qingyuan Liu', role: 'phd', year: '2024', research: ['Serverless'] },
      { name: '杜东', nameEn: 'Dong Du', role: 'phd', year: '2024', research: ['Serverless', '系统安全'] },
      { name: '韦国力', nameEn: 'Guoli Wei', role: 'phd', year: '2024', research: ['分离内存', 'CXL'] },
      { name: '宋浩泽', nameEn: 'Haoze Song', role: 'phd', year: '2024', research: ['KV存储', '分层存储'] },
      { name: '韦东亮', nameEn: 'Dongliang Wei', role: 'phd', year: '2024', research: ['LLM推理'] },
      { name: '高健翔', nameEn: 'Jianxiang Gao', role: 'phd', year: '2024', research: ['LLM系统'] },
      { name: '宋一新', nameEn: 'Yixin Song', role: 'phd', year: '2024', research: ['LLM推理'] },
    ],
    papers: [
      { id: 'fast2026-solid-attention', title: 'SolidAttention: Low-Latency SSD-based Serving on Memory-Constrained PCs', authors: ['Xinrui Zheng', 'Dongliang Wei', 'Zeyu Mi', 'Haibo Chen'], venue: 'FAST', year: 2026, highlight: true },
      { id: 'fast2026-flexllm', title: 'FlexLLM: Flexible and Efficient LLM Serving via Heterogeneous Memory', authors: ['Chen Zhang', 'Haibo Chen'], venue: 'FAST', year: 2026, highlight: true },
      { id: 'fast2026-rask', title: '"Range as a Key" is the Key! Fast and Compact Cloud Block Store Index', authors: ['Haoru Zhao', 'Mingkai Dong', 'Haibo Chen'], venue: 'FAST', year: 2026, highlight: true },
      { id: 'osdi2025-tigon', title: 'Tigon: A Distributed Database for a CXL Pod', authors: ['Yibo Huang', 'Haibo Chen'], venue: 'OSDI', year: 2025, highlight: true },
      { id: 'osdi2025-fuselink', title: 'Enabling Efficient GPU Communication over Multiple NICs with FuseLink', authors: ['Zhenghang Ren', 'Kai Chen'], venue: 'OSDI', year: 2025, highlight: true },
      { id: 'osdi2025-finemem', title: 'FineMem: Fine-Grained Disaggregated Memory Management', authors: ['Guoli Wei', 'Yongkun Li'], venue: 'OSDI', year: 2025, highlight: true },
      { id: 'osdi2025-dmtree', title: 'DMTree: Efficient Tree Indexing on Disaggregated Memory', authors: ['Guoli Wei', 'Heming Cui'], venue: 'OSDI', year: 2025 },
      { id: 'atc2024-jiagu', title: 'Optimizing Resource Utilization in Serverless Computing with Jiagu', authors: ['Qingyuan Liu', 'Dong Du', 'Yubin Xia', 'Haibo Chen'], venue: 'ATC', year: 2024, highlight: true },
      { id: 'fast2026-tieredkv', title: 'TieredKV: A Tiered Key-Value Store for Heterogeneous Storage Media', authors: ['Haoze Song', 'Yinlong Xu'], venue: 'FAST', year: 2026 },
      { id: 'sosp2023-polardb', title: 'PolarDB Serverless: A Fast and Cost-Efficient Serverless Database', authors: ['Haibo Chen'], venue: 'SOSP', year: 2023, highlight: true },
      { id: 'vldb2018-polarfs', title: 'PolarFS: An Ultra-low Latency Distributed File System', authors: ['Haibo Chen'], venue: 'VLDB', year: 2018, highlight: true },
      { id: 'sigmod2022-baikaldb', title: 'BaikalDB: A Resource-Efficient OLAP System', authors: ['Haibo Chen'], venue: 'SIGMOD', year: 2022, highlight: true },
      { id: 'osdi2016-fasst', title: 'FaSST: Fast, Scalable and Simple Transactions', authors: ['Haibo Chen'], venue: 'OSDI', year: 2016, highlight: true },
      { id: 'sosp2015-drtm', title: 'DrTM: Fast Deterministic Transaction Processing', authors: ['Haibo Chen'], venue: 'SOSP', year: 2015, highlight: true },
    ],
    stats: { totalPapers: 200, topConferences: 80, students: 110 },
  },
  {
    id: 'hust-wnlo',
    name: '武汉光电国家实验室存储团队',
    nameEn: 'Wuhan National Laboratory for Optoelectronics - Storage Group',
    institution: '华中科技大学武汉光电国家研究中心',
    institutionShort: '华中科技大学',
    location: '武汉',
    website: 'http://storage.hust.edu.cn/',
    description: '华中科技大学信息存储与应用实验室，是国内最早从事存储研究的团队之一。研究方向涵盖固态存储、存储可靠性、大数据存储系统等。',
    focusAreas: ['固态存储 (SSD)', '存储可靠性', '大数据存储', '存算融合', '光存储技术', '分布式文件系统'],
    professors: [
      { name: '冯丹', nameEn: 'Dan Feng', role: 'professor', research: ['存储系统', 'SSD', '可靠性'] },
      { name: '华宇', nameEn: 'Yu Hua', role: 'professor', research: ['分布式存储', '文件系统'] },
      { name: '吴非', nameEn: 'Fei Wu', role: 'professor', research: ['大数据存储'] },
    ],
    students: [
      { name: '吴浩', nameEn: 'Hao Wu', role: 'phd', year: '2024', research: ['GPU Sandbox', 'Serverless'] },
      { name: '易书书', nameEn: 'Shushu Yi', role: 'phd', year: '2024', research: ['全闪存阵列'] },
      { name: '潘修瑞', nameEn: 'Xiurui Pan', role: 'phd', year: '2024', research: ['存储系统'] },
      { name: '李桥', nameEn: 'Qiao Li', role: 'phd', year: '2024', research: ['全闪存阵列'] },
      { name: '王晨曦', nameEn: 'Chenxi Wang', role: 'phd', year: '2024', research: ['SSD优化'] },
      { name: '毛波', nameEn: 'Bo Mao', role: 'phd', year: '2024', research: ['存储系统'] },
    ],
    papers: [
      { id: 'atc2024-streambox', title: 'StreamBox: A Lightweight GPU SandBox for Serverless Inference Workflow', authors: ['Hao Wu', 'Hai Jin'], venue: 'ATC', year: 2024, highlight: true },
      { id: 'atc2024-scalaafa', title: 'ScalaAFA: Constructing User-Space All-Flash Array Engine', authors: ['Shushu Yi', 'Bo Mao', 'Myoungsoo Jung'], venue: 'ATC', year: 2024, highlight: true },
      { id: 'fast2023-flashblox', title: 'FlashBlox: A Novel Architecture for High-Performance SSDs', authors: ['Dan Feng'], venue: 'FAST', year: 2023, highlight: true },
      { id: 'sigmetrics2022-ssd-reliability', title: 'A Study of SSD Reliability in Large-Scale Data Centers', authors: ['Dan Feng'], venue: 'SIGMETRICS', year: 2022, highlight: true },
      { id: 'fast2020-ssd-lifetime', title: 'Improving SSD Lifetime by Exploiting Internal Parallelism', authors: ['Dan Feng'], venue: 'FAST', year: 2020, highlight: true },
      { id: 'msst2019-dedup-ssd', title: 'Deduplication in SSD-based Storage Systems', authors: ['Dan Feng'], venue: 'MSST', year: 2019 },
    ],
    stats: { totalPapers: 80, topConferences: 30, students: 25 },
  },
]