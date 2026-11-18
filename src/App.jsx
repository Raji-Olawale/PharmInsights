import { Suspense, lazy } from 'react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import { DraftProvider } from './context/DraftContext'
import ProtectedAdmin from './routes/ProtectedAdmin'
import PublicLayout from './components/layout/PublicLayout'
import AdminLayout from './components/layout/AdminLayout'

const HomePage = lazy(() => import('./pages/public/HomePage'))
const CategoryPage = lazy(() => import('./pages/public/CategoryPage'))
const InformationPage = lazy(() => import('./pages/public/InformationPage'))
const QuestionsPage = lazy(() => import('./pages/public/QuestionsPage'))
const ReviewPage = lazy(() => import('./pages/public/ReviewPage'))
const SuccessPage = lazy(() => import('./pages/public/SuccessPage'))
const LoginPage = lazy(() => import('./pages/admin/LoginPage'))
const DashboardPage = lazy(() => import('./pages/admin/DashboardPage'))
const RespondentsPage = lazy(() => import('./pages/admin/RespondentsPage'))
const RespondentDetailPage = lazy(() => import('./pages/admin/RespondentDetailPage'))
const AdminDataPage = lazy(() => import('./pages/admin/AdminDataPage'))

const queryClient = new QueryClient({
  defaultOptions: { queries: { staleTime: 30_000, retry: 1 } },
})

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <DraftProvider>
        <BrowserRouter>
          <Suspense fallback={<div className="full-loading">Loading PharmaInsight…</div>}>
            <Routes>
              <Route element={<PublicLayout />}>
                <Route path="/" element={<HomePage />} />
                <Route path="/select-category" element={<CategoryPage />} />
                <Route path="/questionnaire/:category/information" element={<InformationPage />} />
                <Route path="/questionnaire/:category/questions" element={<QuestionsPage />} />
                <Route path="/questionnaire/:category/review" element={<ReviewPage />} />
                <Route path="/questionnaire/success" element={<SuccessPage />} />
              </Route>
              <Route path="/admin/login" element={<LoginPage />} />
              <Route element={<ProtectedAdmin />}>
                <Route path="/admin" element={<AdminLayout />}>
                  <Route index element={<Navigate to="dashboard" replace />} />
                  <Route path="dashboard" element={<DashboardPage />} />
                  <Route path="respondents" element={<RespondentsPage />} />
                  <Route path="respondents/:id" element={<RespondentDetailPage />} />
                  <Route path="wholesalers" element={<RespondentsPage category="wholesaler" />} />
                  <Route path="buyers" element={<RespondentsPage category="buyer" />} />
                  <Route path="logistics" element={<RespondentsPage category="logistics" />} />
                  <Route path="analytics" element={<AdminDataPage mode="analytics" />} />
                  <Route path="export" element={<AdminDataPage mode="export" />} />
                  <Route path="settings" element={<AdminDataPage mode="settings" />} />
                </Route>
              </Route>
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </Suspense>
        </BrowserRouter>
        </DraftProvider>
      </AuthProvider>
    </QueryClientProvider>
  )
}

export default App
