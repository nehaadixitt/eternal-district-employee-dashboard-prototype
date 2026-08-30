import { Route, BrowserRouter as Router, Routes } from 'react-router-dom'
import Sidebar from './components/Sidebar'
import { AppProvider } from './context/AppContext'
import Analytics from './pages/Analytics'
import Dashboard from './pages/Dashboard'
import MerchantDetail from './pages/MerchantDetail'
import Merchants from './pages/Merchants'
import NewMerchant from './pages/NewMerchant'
import SOPs from './pages/SOPs'

import { useApp } from './context/AppContext'

function AppShell() {
  const { loading } = useApp()
  if (loading) {
    return (
      <div style={{ display:'flex', alignItems:'center', justifyContent:'center', minHeight:'100vh', background:'#f8f9fa' }}>
        <div style={{ textAlign:'center' }}>
          <div style={{ width:'32px', height:'32px', background:'#111827', borderRadius:'8px', display:'flex', alignItems:'center', justifyContent:'center', margin:'0 auto 12px' }}>
            <span style={{ color:'#fff', fontSize:'11px', fontWeight:800 }}>MF</span>
          </div>
          <div style={{ fontSize:'13px', color:'#9ca3af' }}>Loading MerchantFlow…</div>
        </div>
      </div>
    )
  }
  return (
    <div style={{ display:'flex', minHeight:'100vh', background:'#f8f9fa' }}>
      <Sidebar />
      <main style={{ flex:1, minWidth:0, overflowY:'auto', minHeight:'100vh' }}>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/merchants" element={<Merchants />} />
          <Route path="/new" element={<NewMerchant />} />
          <Route path="/merchant/:id" element={<MerchantDetail />} />
          <Route path="/analytics" element={<Analytics />} />
          <Route path="/sops" element={<SOPs />} />
        </Routes>
      </main>
    </div>
  )
}

export default function App() {
  return (
    <AppProvider>
      <Router>
        <AppShell />
      </Router>
    </AppProvider>
  )
}
