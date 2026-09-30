import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { KageLandingPage } from '@designcodeio/threeui/components/KageLandingPage'
import '@designcodeio/threeui/style.css'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<KageLandingPage style={{ position: 'fixed', inset: 0 }} />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  )
}
