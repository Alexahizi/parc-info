import { Navigate, Route, Routes } from 'react-router-dom'
import { Layout } from './components/Layout'
import { DashboardPage } from './pages/Dashboard'
import { AssetsPage } from './pages/Assets'
import { AssignmentsPage } from './pages/Assignments'
import { IncidentsPage } from './pages/Incidents'
import { WorkshopPage } from './pages/Workshop'
import { AssetDetailsPage } from './pages/AssetDetails'

export default function App() {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<DashboardPage />} />
        <Route path="/assets" element={<AssetsPage />} />
        <Route path="/assets/:id" element={<AssetDetailsPage />} />
        <Route path="/affectations" element={<AssignmentsPage />} />
        <Route path="/pannes" element={<IncidentsPage />} />
        <Route path="/atelier" element={<WorkshopPage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Layout>
  )
}
