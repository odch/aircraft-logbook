import 'regenerator-runtime/runtime'
import React from 'react'
import { render } from 'react-dom'
import { Provider } from 'react-redux'
import { createStore, combineReducers, compose, applyMiddleware } from 'redux'
import createSagaMiddleware from 'redux-saga'
import { BrowserRouter as Router, Switch, Redirect } from 'react-router-dom'
import 'moment/locale/de'

import { initFirebase } from './util/firebase'
import mainReducer, { sagas } from './modules'
import autoRestartSaga from './util/autoRestartSaga'
import App from './containers/AppContainer'
import { init as initFeatureToggles } from './util/featureToggles'

import RouteWithSubRoutes from './components/RouteWithSubRoutes'

initFeatureToggles()

const createReducer = asyncReducers => {
  return combineReducers({
    main: mainReducer,
    ...asyncReducers
  })
}

const rootReducer = createReducer()

const sagaMiddleware = createSagaMiddleware()

const middleware = [sagaMiddleware]

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose
const enhancer = composeEnhancers(applyMiddleware(...middleware))

const initialState = {}
const store = createStore(rootReducer, initialState, enhancer)

store.injectEnhancer = enhancer => {
  const next = () => store

  // Should actually be called with `reducer`, `initialState` and `middleware`
  enhancer(next)()
}

store.asyncReducers = {}
store.injectReducer = (name, reducer) => {
  store.asyncReducers[name] = reducer
  store.replaceReducer(createReducer(store.asyncReducers))
}

store.sagaMiddleware = sagaMiddleware
store.sagas = [sagas]
store.injectSaga = saga => {
  if (!store.sagas.includes(saga)) {
    store.sagas.push(saga)
    store.sagaMiddleware.run(autoRestartSaga(saga))
  }
}

initFirebase(store)

sagaMiddleware.run(autoRestartSaga(sagas))

const routes = require('./routes/index').default(store)

render(
  <Provider store={store}>
    <App>
      <Router>
        <Switch>
          {routes.map((route, i) => (
            <RouteWithSubRoutes key={i} {...route} />
          ))}
          <Redirect to="/" />
        </Switch>
      </Router>
    </App>
  </Provider>,
  document.getElementById('app')
)

module.hot.accept()
