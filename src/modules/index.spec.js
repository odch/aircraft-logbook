import { createStore } from 'redux'
import { all, fork } from 'redux-saga/effects'
import rootReducer, { sagas } from './index'
import app, { sagas as appSagas } from './app'

describe('modules', () => {
  describe('index', () => {
    it('exports a the reducer als default export', () => {
      const store = createStore(rootReducer)
      const state = store.getState()
      expect(state.app).toEqual(app(undefined, {}))
    })

    it('forks the sagas', () => {
      const gen = sagas()
      expect(gen.next().value).toEqual(all([fork(appSagas)]))
    })
  })
})
