import React from 'react'

import asyncRoute from './asyncRoute'

const loadedComponents = {}
const historyListeners = {}

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

            if (route.onLoad) {
              route.onLoad(store, props)
            }

            if (route.historyListeners) {
              for (const name in route.historyListeners) {
                if (route.historyListeners.hasOwnProperty(name)) {
                  const existingListener = historyListeners[name]
                  if (existingListener) {
                    existingListener.unlisten()
                  }

                  const unlisten = props.router.history.listen(location => {
                    route.historyListeners[name](store, location)
                  })
                  historyListeners[name] = {
                    unlisten
                  }
                }
              }
            }

            resolve(route.container)
          })
        })
    )
    loadedComponents[id] = Component
  }

  return <Component {...props} />
}
