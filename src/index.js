import React from 'react'
import { render } from 'react-dom'
import { Provider } from 'react-redux'
import { createStore, combineReducers, compose } from 'redux'
import firebase from 'firebase/app'
import 'firebase/auth'
import 'firebase/database'
import 'firebase/firestore'
import { reactReduxFirebase, firebaseReducer } from 'react-redux-firebase'
import { reduxFirestore, firestoreReducer } from 'redux-firestore'
import firebaseConfig from '../projects/dev.json'
import mainReducer from './reducers'
import Title from './containers/TitleContainer'
import { setTitle } from './actions'

const reactReduxFirebaseConfig = {
  userProfile: 'users',
  useFirestoreForProfile: true
}

firebase.initializeApp(firebaseConfig)

firebase.firestore().settings({ timestampsInSnapshots: true })

const createStoreWithFirebase = compose(
  reduxFirestore(firebase),
  reactReduxFirebase(firebase, reactReduxFirebaseConfig)
)(createStore)

const rootReducer = combineReducers({
  app: mainReducer,
  firebase: firebaseReducer,
  firestore: firestoreReducer
})

const initialState = {}
const store = createStoreWithFirebase(
  rootReducer,
  initialState,
  window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
)

store.dispatch(setTitle('Minimal React Webpack Babel Setup'))

render(
  <Provider store={store}>
    <Title />
  </Provider>,
  document.getElementById('app')
)

module.hot.accept()
