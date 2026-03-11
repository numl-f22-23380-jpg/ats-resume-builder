import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import useAuthStore       from './store/authStore'
import LoginPage          from './pages/LoginPage'
import RegisterPage       from './pages/RegisterPage'
import ForgotPasswordPage from './pages/ForgotPasswordPage'
import DashboardPage      from './pages/DashboardPage'
import ResumeBuilderPage  from './pages/ResumeBuilderPage'
import TemplatesPage      from './pages/TemplatesPage'
import PDFPreviewPage     from './pages/PDFPreviewPage'
import ATSPage            from './pages/ATSPage'
import JobAnalyzerPage    from './pages/JobAnalyzerPage'
import AISuggestionsPage  from './pages/AISuggestionsPage'
import SubscriptionPage   from './pages/SubscriptionPage'
import PaymentSuccessPage from './pages/PaymentSuccessPage'
import AdminPage          from './pages/AdminPage'

// ─── Admin Route Guard ────────────────────
function AdminRoute({ children }) {
  const user = useAuthStore((state) => state.user)
  if (user?.role !== 'admin') {
    return <Navigate to="/dashboard" replace />
  }
  return children
}

// ─── Auth Route Guard ─────────────────────
function PrivateRoute({ children }) {
  const user = useAuthStore((state) => state.user)
  if (!user) {
    return <Navigate to="/login" replace />
  }
  return children
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>

        {/* PUBLIC ROUTES */}
        <Route path="/"                element={<Navigate to="/login" replace />} />
        <Route path="/login"           element={<LoginPage />} />
        <Route path="/register"        element={<RegisterPage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />

        {/* PRIVATE ROUTES */}
        <Route path="/dashboard"       element={<PrivateRoute><DashboardPage /></PrivateRoute>} />
        <Route path="/builder"         element={<PrivateRoute><ResumeBuilderPage /></PrivateRoute>} />
        <Route path="/templates"       element={<PrivateRoute><TemplatesPage /></PrivateRoute>} />
        <Route path="/pdf-preview"     element={<PrivateRoute><PDFPreviewPage /></PrivateRoute>} />
        <Route path="/ats"             element={<PrivateRoute><ATSPage /></PrivateRoute>} />
        <Route path="/job-analyzer"    element={<PrivateRoute><JobAnalyzerPage /></PrivateRoute>} />
        <Route path="/ai-suggestions"  element={<PrivateRoute><AISuggestionsPage /></PrivateRoute>} />
        <Route path="/subscription"    element={<PrivateRoute><SubscriptionPage /></PrivateRoute>} />
        <Route path="/payment-success" element={<PrivateRoute><PaymentSuccessPage /></PrivateRoute>} />

        {/* ADMIN ONLY ROUTE */}
        <Route path="/admin" element={
          <PrivateRoute>
            <AdminRoute>
              <AdminPage />
            </AdminRoute>
          </PrivateRoute>
        } />

      </Routes>
    </BrowserRouter>
  )
}
