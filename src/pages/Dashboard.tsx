import { useEffect, useMemo, useRef, useState } from 'react'
import * as echarts from 'echarts'
import type { EChartsOption } from 'echarts'
import { api } from '../lib/api'
import type { DashboardStats } from '../types'
import { Card, PageTitle, Table } from '../components/Ui'

/** Vert principal de l'app (équivalent --color-primary) pour le rendu canvas ECharts */
const CHART_BAR_COLOR = '#16a34a'

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
          ? 'inline-flex items-center gap-2 bg-[var(--color-pill-active)] px-3 py-1.5 text-sm font-medium text-[var(--color-pill-active-text)]'
          : 'inline-flex items-center gap-2 bg-gray-100 px-3 py-1.5 text-sm font-medium text-gray-700'
      }
    >
      {active ? (
        <span className="h-2 w-2 bg-emerald-500" />
      ) : null}
      {label} {value}
    </span>
  )
}

/** Graphique à barres ECharts responsive (barres verticales) */
function BarChartStatus({
  statusEntries,
  loading,
}: {
  statusEntries: [string, number][]
  loading: boolean
}) {
  const containerRef = useRef<HTMLDivElement>(null)
  const chartRef = useRef<echarts.ECharts | null>(null)

  useEffect(() => {
    if (!containerRef.current || !statusEntries.length) return
    if (!chartRef.current) {
      chartRef.current = echarts.init(containerRef.current)
    }
    const chart = chartRef.current

    const labels = statusEntries.map(([s]) => s.replace(/_/g, ' '))
    const values = statusEntries.map(([, n]) => n)

    const option: EChartsOption = {
      grid: { left: 48, right: 24, top: 16, bottom: 48, containLabel: false },
      xAxis: {
        type: 'category',
        data: labels,
        axisLabel: { rotate: labels.some((l) => l.length > 8) ? 25 : 0 },
        axisLine: { lineStyle: { color: '#e5e7eb' } },
        axisTick: { show: false },
      },
      yAxis: {
        type: 'value',
        minInterval: 1,
        splitLine: { lineStyle: { color: '#e5e7eb' } },
        axisLine: { show: false },
        axisTick: { show: false },
      },
      series: [
        {
          type: 'bar',
          data: values,
          itemStyle: {
            color: CHART_BAR_COLOR,
          },
          barMaxWidth: 48,
        },
      ],
      tooltip: {
        trigger: 'axis',
        formatter: (params: unknown) => {
          const p = Array.isArray(params) ? params[0] : null
          if (p && 'name' in p && 'value' in p)
            return `${p.name}<br/><strong>${p.value}</strong>`
          return ''
        },
      },
    }
    chart.setOption(option)

    const ro = new ResizeObserver(() => chart.resize())
    ro.observe(containerRef.current)
    return () => {
      ro.disconnect()
    }
  }, [statusEntries])

  useEffect(() => {
    return () => {
      chartRef.current?.dispose()
      chartRef.current = null
    }
  }, [])

  if (loading || !statusEntries.length) {
    return (
      <div className="flex h-[260px] items-center justify-center text-gray-500">
        {loading ? 'Chargement…' : 'Aucune donnée.'}
      </div>
    )
  }

  return <div ref={containerRef} className="h-[260px] w-full min-w-0" />
}

/** Graphique à barres horizontales ECharts (Top directions) */
function BarChartTopDepartments({
  top,
  loading,
}: {
  top: Array<{ department: string; count: number }>
  loading: boolean
}) {
  const containerRef = useRef<HTMLDivElement>(null)
  const chartRef = useRef<echarts.ECharts | null>(null)

  useEffect(() => {
    if (!containerRef.current || !top.length) return
    if (!chartRef.current) {
      chartRef.current = echarts.init(containerRef.current)
    }
    const chart = chartRef.current

    const labels = top.map((t) => t.department)
    const values = top.map((t) => t.count)

    const option: EChartsOption = {
      grid: { left: 120, right: 48, top: 16, bottom: 24, containLabel: false },
      xAxis: {
        type: 'value',
        minInterval: 1,
        splitLine: { lineStyle: { color: '#e5e7eb' } },
        axisLine: { show: false },
        axisTick: { show: false },
      },
      yAxis: {
        type: 'category',
        data: labels,
        axisLabel: { width: 100, overflow: 'truncate' },
        axisLine: { lineStyle: { color: '#e5e7eb' } },
        axisTick: { show: false },
      },
      series: [
        {
          type: 'bar',
          data: values,
          itemStyle: {
            color: CHART_BAR_COLOR,
          },
          barMaxWidth: 24,
        },
      ],
      tooltip: {
        trigger: 'axis',
        formatter: (params: unknown) => {
          const p = Array.isArray(params) ? params[0] : null
          if (p && 'name' in p && 'value' in p)
            return `${p.name}<br/><strong>${p.value}</strong> pannes`
          return ''
        },
      },
    }
    chart.setOption(option)

    const ro = new ResizeObserver(() => chart.resize())
    ro.observe(containerRef.current)
    return () => ro.disconnect()
  }, [top])

  useEffect(() => {
    return () => {
      chartRef.current?.dispose()
      chartRef.current = null
    }
  }, [])

  if (loading || !top.length) {
    return (
      <div className="flex h-[260px] items-center justify-center text-gray-500">
        {loading ? 'Chargement…' : 'Aucune donnée.'}
      </div>
    )
  }

  return <div ref={containerRef} className="h-[260px] w-full min-w-0" />
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
      {/* Bande titre + indicateurs — adaptable */}
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
        <div className="border border-red-200 bg-red-50 p-4 text-sm text-red-800">
          {error}
        </div>
      ) : null}

      {/* Bande graphiques — grille adaptable : 1 col mobile, 2 cols desktop */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <Card title="Répartition par état">
          <BarChartStatus statusEntries={statusEntries} loading={!data} />
        </Card>
        <Card title="Top directions — pannes">
          <BarChartTopDepartments top={top} loading={!data} />
        </Card>
      </div>

      {/* Bande tableau — pleine largeur */}
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
