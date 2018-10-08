import 'regenerator-runtime/runtime'
import React from 'react'
import { render } from 'react-dom'
import { Provider } from 'react-redux'
import { createStore, combineReducers, compose, applyMiddleware } from 'redux'
import createSagaMiddleware from 'redux-saga'
import firebase from 'firebase/app'
import 'firebase/auth'
import 'firebase/database'
import 'firebase/firestore'
import 'firebase/functions'
import { reactReduxFirebase, firebaseReducer } from 'react-redux-firebase'
import { reduxFirestore, firestoreReducer } from 'redux-firestore'
import { IntlProvider, addLocaleData } from 'react-intl'
import de from 'react-intl/locale-data/de'

import mainReducer, { sagas } from './modules'
import autoRestartSaga from './util/autoRestartSaga'
import messages from './messages'
import App from './containers/AppContainer'

const LOCALE = 'de'

addLocaleData([...de])

const reactReduxFirebaseConfig = {
  userProfile: 'users',
  useFirestoreForProfile: true
}

firebase.initializeApp(__CONF__)

firebase.firestore().settings({ timestampsInSnapshots: true })

const rootReducer = combineReducers({
  app: mainReducer,
  firebase: firebaseReducer,
  firestore: firestoreReducer
})

const sagaMiddleware = createSagaMiddleware()

const middleware = [sagaMiddleware]

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose

const enhancer = composeEnhancers(
  reduxFirestore(firebase),
  reactReduxFirebase(firebase, reactReduxFirebaseConfig),
  applyMiddleware(...middleware)
)

const initialState = {}
const store = createStore(rootReducer, initialState, enhancer)

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

if (window.Cypress) {
  window.firebase = firebase
}
