import { Routes, Route } from 'react-router-dom'
import { Navbar } from '@/components/Navbar'
import Home from '@/pages/Home'
import PaperDetail from '@/pages/PaperDetail'
import Daily from '@/pages/Daily'
import Archive from '@/pages/Archive'
import Teams from '@/pages/Teams'
import TeamDetail from '@/pages/TeamDetail'
import Fast2026 from '@/pages/Fast2026'
import FastArchive from '@/pages/FastArchive'
import Osdi2025 from '@/pages/Osdi2025'
import Atc2024 from '@/pages/Atc2024'
import Asplos2025 from '@/pages/Asplos2025'
import Sigmod2025 from '@/pages/Sigmod2025'
import RaskDeepDive from '@/pages/RaskDeepDive'
import DiscoGcDeepDive from '@/pages/DiscoGcDeepDive'
import LinuxBugfix from '@/pages/LinuxBugfix'
import SpdkUpdates from '@/pages/SpdkUpdates'
import StorageFaults from '@/pages/StorageFaults'
import OpenSourceProjects from '@/pages/OpenSourceProjects'
import DistributedStorageComparison from '@/pages/DistributedStorageComparison'
import RocksDBSpecial from '@/pages/RocksDBSpecial'
import NVMeManual from '@/pages/NVMeManual'

function App() {
  return (
    <div className="min-h-screen">
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/paper/:id" element={<PaperDetail />} />
        <Route path="/deep-dive/rask" element={<RaskDeepDive />} />
        <Route path="/deep-dive/discogc" element={<DiscoGcDeepDive />} />
        <Route path="/fast2026" element={<Fast2026 />} />
        <Route path="/fast-archive" element={<FastArchive />} />
        <Route path="/osdi2025" element={<Osdi2025 />} />
        <Route path="/atc2024" element={<Atc2024 />} />
        <Route path="/asplos2025" element={<Asplos2025 />} />
        <Route path="/sigmod2025" element={<Sigmod2025 />} />
        <Route path="/distributed-storage" element={<DistributedStorageComparison />} />
        <Route path="/rocksdb-special" element={<RocksDBSpecial />} />
        <Route path="/nvme-manual" element={<NVMeManual />} />
        <Route path="/linux-bugfix" element={<LinuxBugfix />} />
        <Route path="/spdk" element={<SpdkUpdates />} />
        <Route path="/faults" element={<StorageFaults />} />
        <Route path="/opensource" element={<OpenSourceProjects />} />
        <Route path="/teams" element={<Teams />} />
        <Route path="/teams/:id" element={<TeamDetail />} />
        <Route path="/daily" element={<Daily />} />
        <Route path="/archive" element={<Archive />} />
      </Routes>
    </div>
  )
}

export default App
