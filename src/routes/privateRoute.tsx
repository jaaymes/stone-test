import { FC } from 'react'
import { Navigate, RouteProps } from 'react-router'

import { useAuth } from '@/hooks/useAuth'

const PrivateRoute: FC<RouteProps> = ({ children }) => {
  const { auth } = useAuth()

  if (auth) {
    return <>{children}</>
  }
  return <Navigate to="/" />
}

export default PrivateRoute
