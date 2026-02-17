import type React from 'react'
import { NavLink } from 'react-router-dom'

function NavItem({
  to,
  label,
}: {
  to: string
  label: string
}) {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        [
          'block border-l-4 px-4 py-2 text-sm font-medium',
          isActive
            ? 'border-slate-900 bg-slate-50 text-slate-900'
            : 'border-transparent text-slate-700 hover:bg-slate-50 hover:text-slate-900',
        ].join(' ')
      }
      end
    >
      {label}
    </NavLink>
  )
}

export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-white text-slate-900">
      <div className="flex min-h-screen">
        <aside className="w-64 border-r border-slate-200">
          <div className="border-b border-slate-200 px-4 py-4">
            <div className="text-sm font-semibold">Gestion de Parc Informatique</div>
            <div className="text-xs text-slate-600">IT Asset Management</div>
          </div>
          <nav className="py-2">
            <NavItem to="/" label="Dashboard" />
            <NavItem to="/assets" label="Gestion de Stock" />
            <NavItem to="/affectations" label="Affectations" />
            <NavItem to="/pannes" label="Pannes" />
            <NavItem to="/atelier" label="Atelier" />
          </nav>
        </aside>
        <main className="flex-1">
          <header className="border-b border-slate-200 px-6 py-4">
            <div className="text-sm text-slate-600">
              Suivi du cycle de vie complet du matériel
            </div>
          </header>
          <div className="p-6">{children}</div>
        </main>
      </div>
    </div>
  )
}

