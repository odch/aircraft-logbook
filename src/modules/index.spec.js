import { createStore } from 'redux'
import { all, fork } from 'redux-saga/effects'
import rootReducer, { sagas } from './index'
import login, { sagas as loginSagas } from './login'
import registration, { sagas as registrationSagas } from './registration'
import organizations, { sagas as organizationsSagas } from './organizations'

describe('modules', () => {
  describe('index', () => {
    it('exports a the reducer als default export', () => {
      const store = createStore(rootReducer)
      const state = store.getState()
      expect(state.login).toEqual(login(undefined, {}))
      expect(state.registration).toEqual(registration(undefined, {}))
      expect(state.organizations).toEqual(organizations(undefined, {}))
    })

    it('forks the sagas', () => {
      const gen = sagas()
      expect(gen.next().value).toEqual(
        all([
          fork(loginSagas),
          fork(registrationSagas),
          fork(organizationsSagas)
        ])
      )
    })
  })
})
