import { useEffect } from 'react'
import { Route, Routes, useLocation, useNavigate } from 'react-router-dom'

import Audits from '@/pages/audits'
import Cards from '@/pages/cards'
import Dashboard from '@/pages/dashboard'
import Layout from '@/pages/layout'
import Login from '@/pages/login'
import Users from '@/pages/users'

import PrivateRoute from './routes/privateRoute'

function App() {
  const location = useLocation()
  const navigate = useNavigate()

  useEffect(() => {
    localStorage.setItem('currentRoute', location.pathname)
  }, [location])

  useEffect(() => {
    const savedRoute = localStorage.getItem('currentRoute')
    if (savedRoute) {
      navigate(savedRoute)
    }
  }, [navigate])

  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route
        path="/*"
        element={
          <PrivateRoute>
            <Layout>
              <Routes>
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/users" element={<Users />} />
                <Route path="/cards" element={<Cards />} />
                <Route path="/audits" element={<Audits />} />
              </Routes>
            </Layout>
          </PrivateRoute>
        }
      />
    </Routes>
  )
}

export default App
