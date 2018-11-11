import React from 'react'
import ProtectedRoute from '../ProtectedRoute'

const getRenderFn = route => router => {
  if (route.component) {
    return <route.component router={router} routes={route.routes} />
  }

  if (route.render) {
    const props = {
      router,
      routes: route.routes
    }
    return route.render(props)
  }
}

export const RouteWithSubRoutes = route => (
  <ProtectedRoute
    protect={route.protected}
    path={route.path}
    exact={route.exact}
    render={getRenderFn(route)}
  />
)
