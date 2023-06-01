import { FC, useEffect } from 'react'
import { Navigate, RouteProps } from 'react-router'

import { useAuth } from '@/hooks/useAuth'

const PrivateRoute: FC<RouteProps> = ({ children }) => {
  const { auth } = useAuth()
  console.log('chega aqui')

  useEffect(() => {
    console.log('auth', auth)
  }, [auth])

  if (auth) {
    return <>{children}</>
  }
  return <Navigate to="/login" />
}

export default PrivateRoute
