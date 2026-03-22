import { Routes, Route } from 'react-router-dom'
import { Navbar } from '@/components/Navbar'
import Home from '@/pages/Home'
import PaperDetail from '@/pages/PaperDetail'
import Daily from '@/pages/Daily'
import Archive from '@/pages/Archive'
import Teams from '@/pages/Teams'

function App() {
  return (
    <div className="min-h-screen">
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/paper/:id" element={<PaperDetail />} />
        <Route path="/teams" element={<Teams />} />
        <Route path="/daily" element={<Daily />} />
        <Route path="/archive" element={<Archive />} />
      </Routes>
    </div>
  )
}

export default App
