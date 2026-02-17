import { useEffect, useMemo, useState } from 'react'
import { api } from '../lib/api'
import type { DashboardStats } from '../types'
import { Card, PageTitle } from '../components/Ui'

function Stat({ label, value }: { label: string; value: number | string }) {
  return (
    <div className="border border-slate-200 bg-white p-4">
      <div className="text-xs font-medium text-slate-600">{label}</div>
      <div className="mt-1 text-2xl font-semibold text-slate-900">{value}</div>
    </div>
  )
}

export function DashboardPage() {
  const [data, setData] = useState<DashboardStats | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false
    api<DashboardStats>('/api/dashboard')
      .then((d) => {
        if (!cancelled) setData(d)
      })
      .catch((e) => {
        if (!cancelled) setError(String(e?.message ?? e))
      })
    return () => {
      cancelled = true
    }
  }, [])

  const top = useMemo(() => data?.topDepartmentsIncidents ?? [], [data])
  const maxTop = useMemo(
    () => Math.max(1, ...top.map((t) => t.count)),
    [top],
  )

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <PageTitle>Dashboard</PageTitle>
        <div className="text-xs text-slate-600">Données par défaut (seed)</div>
      </div>

      {error ? (
        <div className="border border-red-200 bg-red-50 p-4 text-sm text-red-800">
          {error}
        </div>
      ) : null}

      <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
        <Stat label="En stock" value={data?.stockVsAssigned.enStock ?? '—'} />
        <Stat label="Affectés" value={data?.stockVsAssigned.affecte ?? '—'} />
        <Stat label="Réparations en cours" value={data?.repairsInProgress ?? '—'} />
        <Stat
          label="Total matériels"
          value={
            data
              ? Object.values(data.countsByStatus).reduce((a, b) => a + b, 0)
              : '—'
          }
        />
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <Card title="Répartition par état">
          <div className="space-y-2">
            {data
              ? Object.entries(data.countsByStatus)
                  .sort((a, b) => b[1] - a[1])
                  .map(([k, v]) => {
                    const pct =
                      (v / Math.max(1, Object.values(data.countsByStatus).reduce((a, b) => a + b, 0))) * 100
                    return (
                      <div key={k} className="space-y-1">
                        <div className="flex items-center justify-between text-xs">
                          <span className="font-medium text-slate-900">{k}</span>
                          <span className="text-slate-600">{v}</span>
                        </div>
                        <div className="h-2 border border-slate-200 bg-white">
                          <div
                            className="h-2 bg-slate-900"
                            style={{ width: `${Math.max(0, Math.min(100, pct))}%` }}
                          />
                        </div>
                      </div>
                    )
                  })
              : 'Chargement…'}
          </div>
        </Card>

        <Card title="Top directions ayant le plus de pannes">
          <div className="space-y-2">
            {top.length ? (
              top.map((t) => {
                const pct = (t.count / maxTop) * 100
                return (
                  <div key={t.department} className="space-y-1">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-medium text-slate-900">{t.department}</span>
                      <span className="text-slate-600">{t.count}</span>
                    </div>
                    <div className="h-2 border border-slate-200 bg-white">
                      <div
                        className="h-2 bg-red-600"
                        style={{ width: `${Math.max(0, Math.min(100, pct))}%` }}
                      />
                    </div>
                  </div>
                )
              })
            ) : (
              <div className="text-sm text-slate-600">—</div>
            )}
          </div>
        </Card>
      </div>
    </div>
  )
}

