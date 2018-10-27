import 'regenerator-runtime/runtime'
import React from 'react'
import { render } from 'react-dom'
import { Provider } from 'react-redux'
import { createStore, combineReducers, compose, applyMiddleware } from 'redux'
import createSagaMiddleware from 'redux-saga'
import { IntlProvider, addLocaleData } from 'react-intl'
import de from 'react-intl/locale-data/de'

import { initFirebase } from './util/firebase'
import mainReducer, { sagas } from './modules'
import autoRestartSaga from './util/autoRestartSaga'
import messages from './messages'
import App from './containers/AppContainer'

const LOCALE = 'de'

addLocaleData([...de])

const createReducer = asyncReducers => {
  return combineReducers({
    app: mainReducer,
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

initFirebase(store)

sagaMiddleware.run(autoRestartSaga(sagas))

render(
  <Provider store={store}>
    <IntlProvider locale={LOCALE} messages={messages[LOCALE]}>
      <App />
    </IntlProvider>
  </Provider>,
  document.getElementById('app')
)

module.hot.accept()
