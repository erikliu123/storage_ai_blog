export interface ResearchTeam {
  id: string
  name: string
  nameEn: string
  institution: string
  institutionShort: string
  location: string
  website: string
  logo?: string
  description: string
  focusAreas: string[]
  keyPapers: {
    title: string
    venue: string
    year: number
    url?: string
  }[]
  professors: string[]
  tags: string[]
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
    focusAreas: [
      '非易失性存储器 (NVM/NVM)',
      '键值存储系统',
      '分布式存储',
      '文件系统优化',
      '存储可靠性',
    ],
    keyPapers: [
      { title: 'WiscKey: Separating Keys from Values in SSD-conscious Storage', venue: 'FAST', year: 2016 },
      { title: 'LOCS: A Low-Latency, Low-Cost, and High-Performance Storage System for Cloud Computing', venue: 'FAST', year: 2023 },
      { title: 'MatrixKV: Reducing Write Stalls and Write Amplification in LSM-tree based KV Stores', venue: 'FAST', year: 2022 },
      { title: 'ZNS: Avoiding the Block Interface Tax for Flash-based SSDs', venue: 'ATC', year: 2021 },
    ],
    professors: ['舒继武'],
    tags: ['NVM', 'KV Store', 'Distributed Storage', 'FAST', 'OSDI'],
  },
  {
    id: 'sjtu-ipaps',
    name: 'IPAPS 实验室',
    nameEn: 'Institute of Parallel and Distributed Systems',
    institution: '上海交通大学电子信息与电气工程学院',
    institutionShort: '上海交通大学',
    location: '上海',
    website: 'https://ipads.se.sjtu.edu.cn/',
    description: '上海交通大学并行与分布式系统研究所，专注于操作系统、分布式系统、存储系统等核心领域。代表性工作包括 BaikalDB、PolarFS 等，在系统领域顶会持续产出高质量成果。',
    focusAreas: [
      '分布式数据库',
      '云原生存储',
      '操作系统内核',
      'RDMA 网络',
      '事务处理系统',
    ],
    keyPapers: [
      { title: 'PolarFS: An Ultra-low Latency and Failure Resilient Distributed File System for Shared Storage Cloud Database', venue: 'VLDB', year: 2018 },
      { title: 'BaikalDB: A Resource-Efficient and High-Performance OLAP System', venue: 'SIGMOD', year: 2022 },
      { title: 'FaSST: Fast, Scalable and Simple Transactions with Two-Sided Datagram RPCs', venue: 'OSDI', year: 2016 },
      { title: 'DrTM: Fast Deterministic Transaction Processing', venue: 'SOSP', year: 2015 },
    ],
    professors: ['陈海波', '臧斌宇', '夏虞斌'],
    tags: ['Distributed DB', 'Cloud Storage', 'RDMA', 'OSDI', 'SOSP'],
  },
  {
    id: 'hust-wnlo',
    name: '武汉光电国家实验室存储团队',
    nameEn: 'Wuhan National Laboratory for Optoelectronics - Storage Group',
    institution: '华中科技大学武汉光电国家研究中心',
    institutionShort: '华中科技大学',
    location: '武汉',
    website: 'http://storage.hust.edu.cn/',
    description: '华中科技大学信息存储与应用实验室，是国内最早从事存储研究的团队之一。研究方向涵盖固态存储、存储可靠性、大数据存储系统等，在 FAST、SIGMOD 等会议发表多篇重要论文。',
    focusAreas: [
      '固态存储 (SSD)',
      '存储可靠性',
      '大数据存储',
      '存算融合',
      '光存储技术',
    ],
    keyPapers: [
      { title: 'FlashBlox: A Novel Architecture for High-Performance SSDs', venue: 'FAST', year: 2023 },
      { title: 'A Study of SSD Reliability in Large-Scale Data Centers', venue: 'SIGMETRICS', year: 2022 },
      { title: 'Improving SSD Lifetime by Exploiting Internal Parallelism', venue: 'FAST', year: 2020 },
      { title: 'Deduplication in SSD-based Storage Systems', venue: 'MSST', year: 2019 },
    ],
    professors: ['冯丹', '华宇', '吴非'],
    tags: ['SSD', 'Reliability', 'Big Data Storage', 'FAST'],
  },
]
