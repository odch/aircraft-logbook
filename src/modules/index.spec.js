import { createStore } from 'redux'
import { all, fork } from 'redux-saga/effects'
import rootReducer, { sagas } from './index'
import login, { sagas as loginSagas } from './login'

describe('modules', () => {
  describe('index', () => {
    it('exports a the reducer als default export', () => {
      const store = createStore(rootReducer)
      expect(store.getState().login).toEqual(login(undefined, {}))
    })

    it('forks the sagas', () => {
      const gen = sagas()
      expect(gen.next().value).toEqual(all([fork(loginSagas)]))
    })
  })
})
