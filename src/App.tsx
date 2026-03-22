import { Routes, Route } from 'react-router-dom'
import { Navbar } from '@/components/Navbar'
import Home from '@/pages/Home'
import PaperDetail from '@/pages/PaperDetail'
import Daily from '@/pages/Daily'
import Archive from '@/pages/Archive'
import Teams from '@/pages/Teams'
import Fast2026 from '@/pages/Fast2026'
import Osdi2025 from '@/pages/Osdi2025'
import Atc2024 from '@/pages/Atc2024'

function App() {
  return (
    <div className="min-h-screen">
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/paper/:id" element={<PaperDetail />} />
        <Route path="/fast2026" element={<Fast2026 />} />
        <Route path="/osdi2025" element={<Osdi2025 />} />
        <Route path="/atc2024" element={<Atc2024 />} />
        <Route path="/teams" element={<Teams />} />
        <Route path="/daily" element={<Daily />} />
        <Route path="/archive" element={<Archive />} />
      </Routes>
    </div>
  )
}

export default App
