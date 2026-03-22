import { Award, Check, X, ArrowRight, ExternalLink, Database, Server, HardDrive } from 'lucide-react'

const systems = [
  {
    name: 'HDFS',
    fullName: 'Hadoop Distributed File System',
    organization: 'Apache Foundation',
    year: '2006',
    architecture: '主从架构',
    metadata: '集中式（NameNode 内存）',
    dataPath: '客户端 → DataNode',
    consistency: '单写入者，多读',
    scaling: '联邦（多 NameNode）',
    faultTolerance: '多副本（默认 3）',
    performance: {
      throughput: '高（顺序读写）',
      latency: '高（秒级）',
      smallFiles: '差（NameNode 内存限制）',
      largeFiles: '优秀',
    },
    useCases: ['大数据批处理', '数据湖', '日志存储', '离线分析'],
    pros: [
      '架构简单，易于理解',
      '高吞吐顺序读写',
      '容错性好（多副本）',
      '生态完善（MapReduce/Spark）',
      '运维相对简单',
    ],
    cons: [
      'NameNode 内存限制扩展性',
      '高延迟，不适合实时',
      '小文件问题严重',
      '不支持随机写/修改',
      '单 NameNode 瓶颈（联邦缓解）',
    ],
  },
  {
    name: 'Ceph',
    fullName: 'Ceph - Unified Distributed Storage',
    organization: 'Red Hat / Ceph Foundation',
    year: '2006',
    architecture: '去中心化（CRUSH）',
    metadata: '分布式（CRUSH 算法）',
    dataPath: '客户端直接 OSD',
    consistency: '强一致（多副本/EC）',
    scaling: '线性扩展（数千节点）',
    faultTolerance: '多副本 / 纠删码',
    performance: {
      throughput: '高（TB/s 级）',
      latency: '中（毫秒 - 秒）',
      smallFiles: '一般',
      largeFiles: '优秀',
    },
    useCases: ['OpenStack 后端', 'Kubernetes PV', '对象存储', '块存储'],
    pros: [
      '无元数据瓶颈（CRUSH）',
      '统一存储（对象/块/文件）',
      '线性扩展至 EB 级',
      '自愈能力强',
      '开源生态完善',
    ],
    cons: [
      '部署运维复杂',
      '性能调优困难',
      '小文件性能一般',
      '硬件要求较高',
      '学习曲线陡峭',
    ],
  },
  {
    name: 'Lustre',
    fullName: 'Lustre Parallel File System',
    organization: 'OpenSFS / DDN',
    year: '1999',
    architecture: '分离架构',
    metadata: 'MDS（元数据服务器）',
    dataPath: '客户端 → OSS（直接）',
    consistency: 'POSIX 语义',
    scaling: '数百 PB（HPC 规模）',
    faultTolerance: 'HA + 数据 scrubbing',
    performance: {
      throughput: '极高（TB/s 级）',
      latency: '低（微秒 - 毫秒）',
      smallFiles: '一般',
      largeFiles: '极致（HPC）',
    },
    useCases: ['HPC 超算', '科学计算', '气象模拟', '基因测序'],
    pros: [
      '极致并行性能',
      'POSIX 语义完整',
      '成熟稳定（Top500 验证）',
      '支持 RDMA',
      'HPC 生态完善',
    ],
    cons: [
      'MDS 单点（可 HA）',
      '小文件性能差',
      '运维复杂',
      '商业化程度高',
      '部署门槛高',
    ],
  },
]

export default function DistributedStorageComparison() {
  return (
    <main className="max-w-6xl mx-auto px-6 py-10 animate-fade-in">
      {/* Header */}
      <div className="mb-10">
        <div className="flex items-center gap-2 mb-3">
          <Database className="w-4 h-4 text-primary" />
          <span className="mono-label text-xs uppercase tracking-widest">技术对比</span>
        </div>
        <h1 className="text-2xl font-bold mb-2 gradient-text">分布式存储系统元数据设计对比</h1>
        <p className="text-sm text-muted-foreground mb-4">
          HDFS vs Ceph vs Lustre — 三种架构路线的取舍与权衡
        </p>
      </div>

      {/* Architecture overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-10">
        {systems.map(sys => (
          <div key={sys.name} className="card-paper rounded-xl p-5">
            <div className="flex items-center gap-2 mb-3">
              <Server className="w-4 h-4 text-primary" />
              <h3 className="text-sm font-bold">{sys.name}</h3>
            </div>
            <p className="text-xs text-muted-foreground mb-3">{sys.fullName}</p>
            <div className="space-y-2 text-xs">
              <div className="flex justify-between">
                <span className="text-muted-foreground">架构</span>
                <span className="font-mono">{sys.architecture}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">元数据</span>
                <span className="font-mono text-primary">{sys.metadata}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">扩展性</span>
                <span className="font-mono">{sys.scaling}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Metadata architecture comparison */}
      <section className="mb-10">
        <h2 className="text-sm font-semibold uppercase tracking-widest text-muted-foreground mb-4 flex items-center gap-2">
          <HardDrive className="w-4 h-4" />
          元数据架构对比
        </h2>
        <div className="card-paper rounded-xl overflow-hidden">
          <table className="w-full text-xs">
            <thead className="bg-surface-raised border-b border-border">
              <tr>
                <th className="text-left py-3 px-4 font-semibold">特性</th>
                {systems.map(sys => (
                  <th key={sys.name} className="text-left py-3 px-4 font-mono text-primary">{sys.name}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              <tr className="border-b border-border/50">
                <td className="py-3 px-4 text-muted-foreground">元数据位置</td>
                {systems.map(sys => (
                  <td key={sys.name} className="py-3 px-4 font-mono">{sys.metadata}</td>
                ))}
              </tr>
              <tr className="border-b border-border/50">
                <td className="py-3 px-4 text-muted-foreground">数据路径</td>
                {systems.map(sys => (
                  <td key={sys.name} className="py-3 px-4 font-mono">{sys.dataPath}</td>
                ))}
              </tr>
              <tr className="border-b border-border/50">
                <td className="py-3 px-4 text-muted-foreground">一致性模型</td>
                {systems.map(sys => (
                  <td key={sys.name} className="py-3 px-4 font-mono">{sys.consistency}</td>
                ))}
              </tr>
              <tr className="border-b border-border/50">
                <td className="py-3 px-4 text-muted-foreground">扩展方式</td>
                {systems.map(sys => (
                  <td key={sys.name} className="py-3 px-4 font-mono">{sys.scaling}</td>
                ))}
              </tr>
              <tr className="border-b border-border/50">
                <td className="py-3 px-4 text-muted-foreground">容错机制</td>
                {systems.map(sys => (
                  <td key={sys.name} className="py-3 px-4 font-mono">{sys.faultTolerance}</td>
                ))}
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      {/* Performance comparison */}
      <section className="mb-10">
        <h2 className="text-sm font-semibold uppercase tracking-widest text-muted-foreground mb-4 flex items-center gap-2">
          <Award className="w-4 h-4" />
          性能对比
        </h2>
        <div className="card-paper rounded-xl overflow-hidden">
          <table className="w-full text-xs">
            <thead className="bg-surface-raised border-b border-border">
              <tr>
                <th className="text-left py-3 px-4 font-semibold">场景</th>
                {systems.map(sys => (
                  <th key={sys.name} className="text-left py-3 px-4 font-mono text-primary">{sys.name}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              <tr className="border-b border-border/50">
                <td className="py-3 px-4 text-muted-foreground">吞吐量</td>
                {systems.map(sys => (
                  <td key={sys.name} className="py-3 px-4 font-mono">{sys.performance.throughput}</td>
                ))}
              </tr>
              <tr className="border-b border-border/50">
                <td className="py-3 px-4 text-muted-foreground">延迟</td>
                {systems.map(sys => (
                  <td key={sys.name} className="py-3 px-4 font-mono">{sys.performance.latency}</td>
                ))}
              </tr>
              <tr className="border-b border-border/50">
                <td className="py-3 px-4 text-muted-foreground">小文件</td>
                {systems.map(sys => (
                  <td key={sys.name} className="py-3 px-4 font-mono">{sys.performance.smallFiles}</td>
                ))}
              </tr>
              <tr className="border-b border-border/50">
                <td className="py-3 px-4 text-muted-foreground">大文件</td>
                {systems.map(sys => (
                  <td key={sys.name} className="py-3 px-4 font-mono">{sys.performance.largeFiles}</td>
                ))}
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      {/* Pros & Cons */}
      <section className="mb-10 grid grid-cols-1 md:grid-cols-3 gap-4">
        {systems.map(sys => (
          <div key={sys.name} className="card-paper rounded-xl p-5">
            <h3 className="text-sm font-bold mb-3 flex items-center gap-2">
              <Server className="w-4 h-4 text-primary" />
              {sys.name} 优缺点
            </h3>
            <div className="space-y-3">
              <div>
                <h4 className="text-xs font-semibold text-green-400 mb-2 flex items-center gap-1">
                  <Check className="w-3 h-3" />
                  优点
                </h4>
                <ul className="space-y-1">
                  {sys.pros.map((p, i) => (
                    <li key={i} className="text-xs text-foreground/80 flex items-start gap-2">
                      <span className="text-green-400 mt-0.5">+</span>
                      {p}
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <h4 className="text-xs font-semibold text-orange-400 mb-2 flex items-center gap-1">
                  <X className="w-3 h-3" />
                  局限性
                </h4>
                <ul className="space-y-1">
                  {sys.cons.map((c, i) => (
                    <li key={i} className="text-xs text-foreground/80 flex items-start gap-2">
                      <span className="text-orange-400 mt-0.5">-</span>
                      {c}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        ))}
      </section>

      {/* Design tradeoffs analysis */}
      <section className="mb-10">
        <h2 className="text-sm font-semibold uppercase tracking-widest text-muted-foreground mb-4 flex items-center gap-2">
          <Award className="w-4 h-4" />
          设计取舍分析
        </h2>
        <div className="space-y-4">
          <div className="card-paper rounded-xl p-5">
            <h3 className="text-sm font-semibold mb-3">1. 元数据管理：集中式 vs 分布式</h3>
            <div className="text-xs text-foreground/80 space-y-2">
              <p><strong className="text-primary">HDFS（集中式）</strong>：NameNode 集中管理元数据，简化设计但内存受限。适合中小规模集群，运维简单。</p>
              <p><strong className="text-primary">Ceph（分布式）</strong>：CRUSH 算法计算数据位置，无元数据瓶颈。扩展性极佳但复杂度高。</p>
              <p><strong className="text-primary">Lustre（分离式）</strong>：MDS 专门处理元数据，数据路径分离。性能平衡但 MDS 可能成瓶颈。</p>
            </div>
          </div>

          <div className="card-paper rounded-xl p-5">
            <h3 className="text-sm font-semibold mb-3">2. 数据路径：客户端访问模式</h3>
            <div className="text-xs text-foreground/80 space-y-2">
              <p><strong className="text-primary">HDFS</strong>：客户端从 NameNode 获取块位置后直接访问 DataNode，减少中转但增加 NameNode 负担。</p>
              <p><strong className="text-primary">Ceph</strong>：客户端通过 CRUSH 算法直接计算数据位置，完全去中心化，OSD 对等。</p>
              <p><strong className="text-primary">Lustre</strong>：元数据与数据路径完全分离，客户端先访问 MDS 再直接访问 OSS，适合 HPC 高吞吐。</p>
            </div>
          </div>

          <div className="card-paper rounded-xl p-5">
            <h3 className="text-sm font-semibold mb-3">3. 一致性模型：CAP 取舍</h3>
            <div className="text-xs text-foreground/80 space-y-2">
              <p><strong className="text-primary">HDFS</strong>：单写入者模型，简化一致性实现。适合一次写入多次读取场景（批处理）。</p>
              <p><strong className="text-primary">Ceph</strong>：强一致性，支持多客户端并发写入。通过 Paxos 保证元数据一致。</p>
              <p><strong className="text-primary">Lustre</strong>：完整 POSIX 语义，支持复杂文件操作。为 HPC 科学计算设计。</p>
            </div>
          </div>

          <div className="card-paper rounded-xl p-5">
            <h3 className="text-sm font-semibold mb-3">4. 扩展性：垂直 vs 水平</h3>
            <div className="text-xs text-foreground/80 space-y-2">
              <p><strong className="text-primary">HDFS</strong>：联邦（Federation）支持多 NameNode 水平扩展，但增加运维复杂度。</p>
              <p><strong className="text-primary">Ceph</strong>：原生水平扩展，添加 OSD 即可线性扩容。CRUSH 自动重新平衡。</p>
              <p><strong className="text-primary">Lustre</strong>：通过增加 OST 扩展存储容量，MDS 可 HA 但扩展有限。</p>
            </div>
          </div>
        </div>
      </section>

      {/* Use case recommendations */}
      <section className="mb-10">
        <h2 className="text-sm font-semibold uppercase tracking-widest text-muted-foreground mb-4 flex items-center gap-2">
          <Award className="w-4 h-4" />
          场景推荐
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {systems.map(sys => (
            <div key={sys.name} className="card-paper rounded-xl p-5">
              <h3 className="text-sm font-bold mb-3">{sys.name} 适用场景</h3>
              <ul className="space-y-2 text-xs">
                {sys.useCases.map((use, i) => (
                  <li key={i} className="flex items-start gap-2 text-foreground/80">
                    <ArrowRight className="w-3 h-3 text-primary mt-0.5 flex-shrink-0" />
                    {use}
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
          详细文档与源码参考
        </p>
        <div className="flex justify-center gap-4">
          <a
            href="https://hadoop.apache.org/docs"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-xs text-primary hover:underline"
          >
            <ExternalLink className="w-3 h-3" />
            HDFS 文档
          </a>
          <a
            href="https://docs.ceph.com"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-xs text-primary hover:underline"
          >
            <ExternalLink className="w-3 h-3" />
            Ceph 文档
          </a>
          <a
            href="https://doc.lustre.org"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-xs text-primary hover:underline"
          >
            <ExternalLink className="w-3 h-3" />
            Lustre 文档
          </a>
        </div>
      </div>
    </main>
  )
}
