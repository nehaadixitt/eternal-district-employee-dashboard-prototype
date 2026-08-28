import { BarChart2, BookOpen, LayoutDashboard, Settings, Store, User } from 'lucide-react'
import { NavLink, useLocation } from 'react-router-dom'
import { useApp } from '../context/AppContext'

const navItems = [
  { to: '/', icon: LayoutDashboard, label: 'Dashboard', end: true },
  { to: '/merchants', icon: Store, label: 'Merchants' },
  { to: '/analytics', icon: BarChart2, label: 'Analytics' },
  { to: '/sops', icon: BookOpen, label: 'SOPs & Forms' },
]

const s = {
  sidebar: {
    width: '240px', minWidth: '240px', background: '#ffffff',
    borderRight: '1px solid #e5e7eb', display: 'flex', flexDirection: 'column',
    height: '100vh', position: 'sticky', top: 0, overflow: 'hidden',
  },
  logoArea: {
    padding: '20px 16px 16px', borderBottom: '1px solid #f3f4f6',
  },
  logoRow: { display: 'flex', alignItems: 'center', gap: '10px' },
  logoMark: {
    width: '32px', height: '32px', background: '#111827', borderRadius: '8px',
    display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
  },
  logoText: { fontSize: '13px', fontWeight: 700, color: '#111827', lineHeight: 1.2 },
  logoSub: { fontSize: '10px', color: '#9ca3af', marginTop: '1px' },
  demoBadge: {
    marginTop: '8px', display: 'inline-block', fontSize: '10px', fontWeight: 700,
    background: '#fef3c7', color: '#92400e', padding: '2px 6px', borderRadius: '4px',
    letterSpacing: '0.05em',
  },
  nav: { flex: 1, padding: '12px 8px', overflowY: 'auto' },
  navLabel: {
    fontSize: '10px', fontWeight: 600, color: '#9ca3af', textTransform: 'uppercase',
    letterSpacing: '0.08em', padding: '4px 8px 8px',
  },
  navItem: (active) => ({
    display: 'flex', alignItems: 'center', gap: '10px',
    padding: '8px 10px', borderRadius: '8px', fontSize: '13px', fontWeight: 500,
    textDecoration: 'none', transition: 'all 0.15s', marginBottom: '2px',
    background: active ? '#111827' : 'transparent',
    color: active ? '#ffffff' : '#6b7280',
  }),
  divider: { height: '1px', background: '#f3f4f6', margin: '8px 8px' },
  settingsItem: {
    display: 'flex', alignItems: 'center', gap: '10px',
    padding: '8px 10px', borderRadius: '8px', fontSize: '13px', fontWeight: 500,
    textDecoration: 'none', color: '#6b7280', transition: 'all 0.15s',
  },
  userArea: {
    padding: '12px 16px', borderTop: '1px solid #f3f4f6',
    display: 'flex', alignItems: 'center', gap: '10px',
  },
  avatar: {
    width: '32px', height: '32px', background: '#f3f4f6', borderRadius: '50%',
    display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
  },
  userName: { fontSize: '13px', fontWeight: 600, color: '#111827' },
  userRole: { fontSize: '11px', color: '#9ca3af' },
}

export default function Sidebar() {
  const { currentUser } = useApp()
  const location = useLocation()

  return (
    <aside style={s.sidebar}>
      <div style={s.logoArea}>
        <div style={s.logoRow}>
          <div style={s.logoMark}>
            <span style={{ color: '#fff', fontSize: '11px', fontWeight: 800 }}>MF</span>
          </div>
          <div>
            <div style={s.logoText}>MerchantFlow</div>
            <div style={s.logoSub}>Onboarding Hub</div>
          </div>
        </div>
        <span style={s.demoBadge}>DEMO</span>
      </div>

      <nav style={s.nav}>
        <div style={s.navLabel}>Menu</div>
        {navItems.map(({ to, icon: Icon, label, end }) => {
          const active = end ? location.pathname === to : location.pathname.startsWith(to)
          return (
            <NavLink
              key={to}
              to={to}
              end={end}
              style={s.navItem(active)}
              onMouseEnter={e => { if (!active) { e.currentTarget.style.background = '#f3f4f6'; e.currentTarget.style.color = '#111827' } }}
              onMouseLeave={e => { if (!active) { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = '#6b7280' } }}
            >
              <Icon size={15} />
              {label}
            </NavLink>
          )
        })}
        <div style={s.divider} />
        <a href="#" style={s.settingsItem}
          onMouseEnter={e => { e.currentTarget.style.background = '#f3f4f6'; e.currentTarget.style.color = '#111827' }}
          onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = '#6b7280' }}
        >
          <Settings size={15} />
          Settings
        </a>
      </nav>

      <div style={s.userArea}>
        <div style={s.avatar}>
          <User size={14} color="#6b7280" />
        </div>
        <div>
          <div style={s.userName}>{currentUser.name}</div>
          <div style={s.userRole}>Sales Executive</div>
        </div>
      </div>
    </aside>
  )
}
