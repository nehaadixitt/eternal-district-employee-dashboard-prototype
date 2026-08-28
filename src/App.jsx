import { Route, BrowserRouter as Router, Routes } from 'react-router-dom'
import Sidebar from './components/Sidebar'
import { AppProvider } from './context/AppContext'
import Analytics from './pages/Analytics'
import Dashboard from './pages/Dashboard'
import MerchantDetail from './pages/MerchantDetail'
import Merchants from './pages/Merchants'
import NewMerchant from './pages/NewMerchant'
import SOPs from './pages/SOPs'

export default function App() {
  return (
    <AppProvider>
      <Router>
        <div style={{ display: 'flex', minHeight: '100vh', background: '#f8f9fa' }}>
          <Sidebar />
          <main style={{ flex: 1, minWidth: 0, overflowY: 'auto', minHeight: '100vh' }}>
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
      </Router>
    </AppProvider>
  )
}
