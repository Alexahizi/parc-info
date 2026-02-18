import type React from 'react'
import { NavLink, useLocation } from 'react-router-dom'

const navItems: Array<{ to: string; label: string; icon: React.ReactNode }> = [
  {
    to: '/',
    label: 'Dashboard',
    icon: (
      <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
      </svg>
    ),
  },
  {
    to: '/assets',
    label: 'Stock',
    icon: (
      <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
      </svg>
    ),
  },
  {
    to: '/affectations',
    label: 'Affectations',
    icon: (
      <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
      </svg>
    ),
  },
  {
    to: '/pannes',
    label: 'Pannes',
    icon: (
      <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
      </svg>
    ),
  },
  {
    to: '/atelier',
    label: 'Atelier',
    icon: (
      <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
      </svg>
    ),
  },
]

function SidebarNavItem({
  to,
  label,
  icon,
}: {
  to: string
  label: string
  icon: React.ReactNode
}) {
  return (
    <NavLink
      to={to}
      title={label}
      className={({ isActive }) =>
        [
          'flex items-center justify-center rounded-lg p-3 transition-colors',
          isActive
            ? 'bg-gray-100 text-[var(--color-primary)]'
            : 'text-gray-500 hover:bg-gray-50 hover:text-gray-700',
        ].join(' ')
      }
      end={to === '/'}
    >
      {icon}
    </NavLink>
  )
}

export function Layout({ children }: { children: React.ReactNode }) {
  const location = useLocation()

  const isActive = (path: string) => {
    if (path === '/') return location.pathname === '/'
    return location.pathname.startsWith(path)
  }

  return (
    <div className="min-h-screen bg-white text-gray-900">
      {/* Sidebar fixe : pas de scroll, toujours visible */}
      <aside
        className="fixed inset-y-0 left-0 z-20 flex h-screen w-16 shrink-0 flex-col overflow-hidden border-r border-gray-200 bg-white"
        aria-label="Navigation principale"
      >
        <div className="flex h-14 shrink-0 items-center justify-center border-b border-gray-200">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gray-800 text-white">
            <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
            </svg>
          </div>
        </div>
        <nav className="flex-1 overflow-hidden p-2" style={{ minHeight: 0 }}>
          <div className="flex h-full flex-col justify-center gap-1">
            {navItems.map((item) => (
              <SidebarNavItem key={item.to} to={item.to} label={item.label} icon={item.icon} />
            ))}
          </div>
        </nav>
        <div className="shrink-0 border-t border-gray-200 p-3">
          <div className="flex justify-center">
            <div className="h-8 w-8 rounded-full bg-gray-200" title="Profil" />
          </div>
        </div>
      </aside>

      {/* Zone principale : marge gauche = largeur sidebar, seul le main scrolle */}
      <div className="flex min-h-screen flex-col pl-16">
        {/* Barre d'onglets horizontale + contrôles */}
        <header className="flex shrink-0 flex-col border-b border-gray-200 bg-white">
          <div className="flex items-center justify-between px-6 pt-4">
            <h1 className="text-lg font-semibold text-gray-900">Parc Info</h1>
            <div className="flex items-center gap-2">
              <span className="rounded border border-gray-200 bg-white px-3 py-1.5 text-sm text-gray-600">
                {new Date().toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' })}
              </span>
              <button
                type="button"
                className="rounded p-1.5 text-gray-500 hover:bg-gray-100 hover:text-gray-700"
                title="Options"
              >
                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 8c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm0 2c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0 6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z" />
                </svg>
              </button>
            </div>
          </div>
          <nav className="mt-4 flex gap-1 px-6">
            {navItems.map((item) => {
              const active = isActive(item.to)
              return (
                <NavLink
                  key={item.to}
                  to={item.to}
                  end={item.to === '/'}
                  className={[
                    'border-b-2 px-4 py-3 text-sm transition-colors',
                    active ? 'tab-active' : 'tab-inactive border-transparent',
                  ].join(' ')}
                >
                  {item.label}
                </NavLink>
              )
            })}
          </nav>
        </header>

        <main className="flex-1 overflow-auto bg-[#fafafa] p-6">{children}</main>
      </div>
    </div>
  )
}
