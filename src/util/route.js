import React from 'react'

import asyncRoute from './asyncRoute'

const loadedComponents = {}

export const loadRoute = (
  id,
  store,
  input,
  importRouteDependencies
  // eslint-disable-next-line react/display-name
) => props => {
  let Component = loadedComponents[id]

  if (!Component) {
    Component = asyncRoute(
      () =>
        new Promise(resolve => {
          importRouteDependencies().then(imported => {
            const route = imported.default

            if (route.reducer) {
              store.injectReducer(route.reducerName, route.reducer)
            }

            if (route.sagas) {
              route.sagas.forEach(saga => {
                store.injectSaga(saga)
              })
            }
            resolve(route.container)
          })
        })
    )
    loadedComponents[id] = Component
  }

  return <Component {...props} />
}
