import { BarChart2, LayoutDashboard, User } from 'lucide-react'
import { NavLink } from 'react-router-dom'
import { useApp } from '../context/AppContext'

export default function Navbar() {
  const { currentUser } = useApp()
  const link = ({ isActive }) =>
    `flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${isActive ? 'bg-gray-900 text-white' : 'text-gray-400 hover:text-white hover:bg-gray-800'}`

  return (
    <nav className="bg-gray-950 border-b border-gray-800 px-6 py-3 flex items-center justify-between">
      <div className="flex items-center gap-8">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 bg-blue-600 rounded-md flex items-center justify-center">
            <span className="text-white text-xs font-bold">MF</span>
          </div>
          <span className="text-white font-semibold text-sm">MerchantFlow</span>
          <span className="text-xs bg-amber-500 text-white px-1.5 py-0.5 rounded font-medium ml-1">DEMO</span>
        </div>
        <div className="flex items-center gap-1">
          <NavLink to="/" className={link} end>
            <LayoutDashboard size={15} /> Dashboard
          </NavLink>
          <NavLink to="/analytics" className={link}>
            <BarChart2 size={15} /> Analytics
          </NavLink>
        </div>
      </div>
      <div className="flex items-center gap-2 text-gray-400 text-sm">
        <User size={15} />
        <span>{currentUser.name}</span>
        <span className="text-xs bg-gray-800 text-gray-400 px-2 py-0.5 rounded capitalize">{currentUser.role}</span>
      </div>
    </nav>
  )
}
