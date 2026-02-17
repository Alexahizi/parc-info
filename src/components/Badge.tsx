import type { AssetStatus } from '../types'
import { assetStatusLabel } from '../lib/format'

const statusStyles: Record<AssetStatus, string> = {
  EN_SERVICE: 'bg-green-50 text-green-800 border-green-200',
  EN_PANNE: 'bg-red-50 text-red-800 border-red-200',
  EN_REPARATION: 'bg-amber-50 text-amber-800 border-amber-200',
  EN_STOCK: 'bg-slate-50 text-slate-800 border-slate-200',
  AFFECTE: 'bg-blue-50 text-blue-800 border-blue-200',
  HORS_SERVICE: 'bg-slate-100 text-slate-800 border-slate-300',
}

export function StatusBadge({ status }: { status: AssetStatus }) {
  return (
    <span
      className={[
        'inline-flex items-center border px-2 py-0.5 text-xs font-medium',
        statusStyles[status],
      ].join(' ')}
    >
      {assetStatusLabel(status)}
    </span>
  )
}

