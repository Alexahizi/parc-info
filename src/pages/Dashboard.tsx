import { useEffect, useMemo, useState } from 'react'
import { api } from '../lib/api'
import type { DashboardStats } from '../types'
import { Card, PageTitle, Table } from '../components/Ui'

function StatPill({
  label,
  value,
  active,
}: {
  label: string
  value: number | string
  active?: boolean
}) {
  return (
    <span
      className={
        active
          ? 'inline-flex items-center gap-2 rounded-full bg-[var(--color-pill-active)] px-3 py-1.5 text-sm font-medium text-[var(--color-pill-active-text)]'
          : 'inline-flex items-center gap-2 rounded-full bg-gray-100 px-3 py-1.5 text-sm font-medium text-gray-700'
      }
    >
      {active ? (
        <span className="h-2 w-2 rounded-full bg-emerald-500" />
      ) : null}
      {label} {value}
    </span>
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
  const totalAssets = useMemo(
    () =>
      data
        ? Object.values(data.countsByStatus).reduce((a, b) => a + b, 0)
        : 0,
    [data],
  )
  const statusEntries = useMemo(
    () =>
      data
        ? Object.entries(data.countsByStatus).sort((a, b) => b[1] - a[1])
        : [],
    [data],
  )

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <PageTitle>Résultats</PageTitle>
        <div className="flex flex-wrap items-center gap-2">
          <StatPill
            label="Total matériels"
            value={totalAssets}
            active
          />
          <StatPill label="En stock" value={data?.stockVsAssigned.enStock ?? '—'} />
          <StatPill label="Affectés" value={data?.stockVsAssigned.affecte ?? '—'} />
          <StatPill label="Réparations en cours" value={data?.repairsInProgress ?? '—'} />
        </div>
      </div>

      {error ? (
        <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-800">
          {error}
        </div>
      ) : null}

      {/* Graphique à barres horizontal — Top directions (pannes) */}
      <Card title="Répartition par état">
        <div className="mb-6">
          <div className="mb-2 flex items-end gap-1" style={{ height: 200 }}>
            {statusEntries.length
              ? statusEntries.map(([label, value]) => {
                  return (
                    <div
                      key={label}
                      className="flex flex-1 flex-col items-center gap-1"
                      title={`${label}: ${value}`}
                    >
                      <div
                        className="w-full rounded-t bg-[var(--color-primary)] transition-all"
                        style={{
                          height: `${Math.max(4, (value / Math.max(...Object.values(data!.countsByStatus))) * 100)}%`,
                          minHeight: 8,
                        }}
                      />
                      <span className="text-xs font-medium text-gray-600">{value}</span>
                      <span className="max-w-full truncate text-xs text-gray-500" title={label}>
                        {label.replace(/_/g, ' ')}
                      </span>
                    </div>
                  )
                })
              : 'Chargement…'}
          </div>
        </div>

        {top.length > 0 ? (
          <div className="space-y-3">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-gray-500">
              Top directions — pannes
            </h3>
            <div className="space-y-2">
              {top.map((t) => {
                const pct = (t.count / maxTop) * 100
                return (
                  <div key={t.department} className="space-y-1">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-medium text-gray-900">{t.department}</span>
                      <span className="text-gray-600">{t.count}</span>
                    </div>
                    <div className="h-2 overflow-hidden rounded-full bg-gray-100">
                      <div
                        className="h-full rounded-full bg-[var(--color-primary)] transition-all"
                        style={{ width: `${Math.max(2, pct)}%` }}
                      />
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        ) : null}
      </Card>

      {/* Tableau récap — style Cyberdyne */}
      <Card title="Synthèse par état">
        <Table columns={['État', 'Effectif']}>
          {statusEntries.map(([status, count]) => (
            <tr key={status} className="hover:bg-gray-50">
              <td className="px-4 py-3 font-medium text-gray-900">
                {status.replace(/_/g, ' ')}
              </td>
              <td className="px-4 py-3 text-gray-600">{count}</td>
            </tr>
          ))}
          {!statusEntries.length ? (
            <tr>
              <td className="px-4 py-8 text-center text-gray-500" colSpan={2}>
                {data ? 'Aucune donnée.' : 'Chargement…'}
              </td>
            </tr>
          ) : null}
        </Table>
      </Card>
    </div>
  )
}
