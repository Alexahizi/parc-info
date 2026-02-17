import type React from 'react'
import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { api } from '../lib/api'
import { formatDate } from '../lib/format'
import type { Asset, AssetStatus } from '../types'
import { StatusBadge } from '../components/Badge'
import { Button, Card, Input, PageTitle, Select, Table } from '../components/Ui'

type AssetCreateInput = {
  inventoryNumber: string
  type: string
  brand: string
  model: string
  entryDate: string
  supplier: string
}

const statusOptions: Array<{ value: AssetStatus | ''; label: string }> = [
  { value: '', label: 'Tous' },
  { value: 'EN_STOCK', label: 'En Stock' },
  { value: 'AFFECTE', label: 'Affecté' },
  { value: 'EN_PANNE', label: 'En Panne' },
  { value: 'EN_REPARATION', label: 'En Réparation' },
  { value: 'EN_SERVICE', label: 'En Service' },
  { value: 'HORS_SERVICE', label: 'Hors Service' },
]

export function AssetsPage() {
  const [items, setItems] = useState<Asset[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const [q, setQ] = useState('')
  const [type, setType] = useState('')
  const [status, setStatus] = useState<AssetStatus | ''>('')

  const [form, setForm] = useState<AssetCreateInput>({
    inventoryNumber: '',
    type: 'PC',
    brand: '',
    model: '',
    entryDate: new Date().toISOString().slice(0, 10),
    supplier: '',
  })

  const types = useMemo(() => {
    const s = new Set(items.map((a) => a.type).filter(Boolean))
    return Array.from(s).sort((a, b) => a.localeCompare(b))
  }, [items])

  function load() {
    setLoading(true)
    setError(null)
    const params = new URLSearchParams()
    if (q) params.set('q', q)
    if (type) params.set('type', type)
    if (status) params.set('status', status)
    api<Asset[]>(`/api/assets?${params.toString()}`)
      .then(setItems)
      .catch((e) => setError(String(e?.message ?? e)))
      .finally(() => setLoading(false))
  }

  useEffect(() => {
    load()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  async function onCreate(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    try {
      await api<Asset>('/api/assets', {
        method: 'POST',
        body: JSON.stringify(form),
      })
      setForm((f) => ({
        ...f,
        inventoryNumber: '',
        brand: '',
        model: '',
        supplier: '',
      }))
      load()
    } catch (err: any) {
      setError(String(err?.message ?? err))
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <PageTitle>Gestion de Stock</PageTitle>
        <Button onClick={load} disabled={loading}>
          Actualiser
        </Button>
      </div>

      {error ? (
        <div className="border border-red-200 bg-red-50 p-4 text-sm text-red-800">
          {error}
        </div>
      ) : null}

      <Card title="Ajouter un matériel">
        <form className="grid grid-cols-1 gap-4 md:grid-cols-3" onSubmit={onCreate}>
          <Input
            label="Numéro d'inventaire (unique)"
            value={form.inventoryNumber}
            onChange={(e) => setForm({ ...form, inventoryNumber: e.target.value })}
            required
          />
          <Input
            label="Type (PC, Imprimante, etc.)"
            value={form.type}
            onChange={(e) => setForm({ ...form, type: e.target.value })}
            required
          />
          <Input
            label="Marque"
            value={form.brand}
            onChange={(e) => setForm({ ...form, brand: e.target.value })}
            required
          />
          <Input
            label="Modèle"
            value={form.model}
            onChange={(e) => setForm({ ...form, model: e.target.value })}
            required
          />
          <Input
            label="Date d'entrée"
            type="date"
            value={form.entryDate}
            onChange={(e) => setForm({ ...form, entryDate: e.target.value })}
            required
          />
          <Input
            label="Fournisseur"
            value={form.supplier}
            onChange={(e) => setForm({ ...form, supplier: e.target.value })}
            required
          />
          <div className="md:col-span-3">
            <Button type="submit" variant="primary">
              Ajouter
            </Button>
          </div>
        </form>
      </Card>

      <Card title="Liste du matériel">
        <div className="mb-4 grid grid-cols-1 gap-3 md:grid-cols-4">
          <Input
            label="Recherche (inventaire, marque, modèle, fournisseur)"
            placeholder="Ex: INV-001, HP, Lenovo…"
            value={q}
            onChange={(e) => setQ(e.target.value)}
          />
          <Select label="Type" value={type} onChange={(e) => setType(e.target.value)}>
            <option value="">Tous</option>
            {types.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </Select>
          <Select
            label="État"
            value={status}
            onChange={(e) => setStatus(e.target.value as AssetStatus | '')}
          >
            {statusOptions.map((o) => (
              <option key={o.label} value={o.value}>
                {o.label}
              </option>
            ))}
          </Select>
          <div className="flex items-end gap-2">
            <Button onClick={load} disabled={loading}>
              Filtrer
            </Button>
            <Button
              onClick={() => {
                setQ('')
                setType('')
                setStatus('')
                setTimeout(load, 0)
              }}
              disabled={loading}
            >
              Réinitialiser
            </Button>
          </div>
        </div>

        <Table columns={['Inventaire', 'Type', 'Marque', 'Modèle', 'Entrée', 'Fournisseur', 'État', 'Détails']}>
          {items.map((a) => (
            <tr key={a.id} className="hover:bg-slate-50">
              <td className="border-b border-slate-100 px-3 py-2 font-medium text-slate-900">
                {a.inventoryNumber}
              </td>
              <td className="border-b border-slate-100 px-3 py-2">{a.type}</td>
              <td className="border-b border-slate-100 px-3 py-2">{a.brand}</td>
              <td className="border-b border-slate-100 px-3 py-2">{a.model}</td>
              <td className="border-b border-slate-100 px-3 py-2">{formatDate(a.entryDate)}</td>
              <td className="border-b border-slate-100 px-3 py-2">{a.supplier}</td>
              <td className="border-b border-slate-100 px-3 py-2">
                <StatusBadge status={a.status} />
              </td>
              <td className="border-b border-slate-100 px-3 py-2">
                <Link className="text-slate-900 underline" to={`/assets/${a.id}`}>
                  Voir l’historique
                </Link>
              </td>
            </tr>
          ))}
          {!items.length ? (
            <tr>
              <td className="border-b border-slate-100 px-3 py-6 text-slate-600" colSpan={8}>
                {loading ? 'Chargement…' : 'Aucun matériel.'}
              </td>
            </tr>
          ) : null}
        </Table>
      </Card>
    </div>
  )
}

