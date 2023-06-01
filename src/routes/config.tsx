import { FC } from 'react'
import { RouteProps } from 'react-router'

import PrivateRoute from './privateRoute'

type WrapperRouteProps = {
  auth?: boolean
} & RouteProps

const WrapperRouteComponent: FC<WrapperRouteProps> = ({ auth, children }) => {
  if (auth) {
    return <PrivateRoute>{children}</PrivateRoute>
  }
  return <>{children}</>
}

export default WrapperRouteComponent
