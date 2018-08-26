import React from 'react'
import { render } from 'react-dom'
import { Provider } from 'react-redux'
import { createStore } from 'redux'
import rootReducer from './reducers'
import Title from './containers/TitleContainer'
import { setTitle } from './actions'

const store = createStore(
  rootReducer,
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
