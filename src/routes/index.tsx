import { FC, lazy } from 'react'
import { RouteObject, useRoutes } from 'react-router-dom'

import Dashboard from '@/pages/dashboard'
import Layout from '@/pages/layout'
import Login from '@/pages/login'
import Users from '@/pages/users'

import PrivateRoute from './privateRoute'
const NotFound = lazy(() => import('@/pages/404'))

const routeList: RouteObject[] = [
  {
    path: '/dashboard',
    element: (
      <PrivateRoute>
        <Layout>
          <Dashboard />
        </Layout>
      </PrivateRoute>
    ),
  },
  {
    path: '/users',
    element: (
      <PrivateRoute>
        <Layout>
          <Users />
        </Layout>
      </PrivateRoute>
    ),
  },
  {
    path: '/',
    element: <Login />,
  },
]

const RenderRouter: FC = () => {
  const element = useRoutes(routeList)
  return element
}

export default RenderRouter
