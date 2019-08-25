import { put, all, takeLatest, call } from 'redux-saga/effects'
import { getFirebase } from '../../../util/firebase'
import * as actions from './actions'
import * as sagas from './sagas'

describe('modules', () => {
  describe('login', () => {
    describe('sagas', () => {
      describe('login', () => {
        it('should run login', () => {
          const loginAction = actions.login('test@example.com', 'mypassword')

          const generator = sagas.login(loginAction)

          expect(generator.next().value).toEqual(put(actions.setSubmitted()))
          expect(generator.next().value).toEqual(call(getFirebase))

          const firebase = {
            login: () => {}
          }
          expect(generator.next(firebase).value).toEqual(
            call(firebase.login, {
              email: 'test@example.com',
              password: 'mypassword'
            })
          )

          expect(generator.next().value).toEqual(put(actions.loginSuccess()))

          expect(generator.next().done).toEqual(true)
        })

        it('should put LOGIN_FAILURE action if it fails', () => {
          const loginAction = actions.login('test@example.com', 'mypassword')

          const generator = sagas.login(loginAction)

          expect(generator.next().value).toEqual(put(actions.setSubmitted()))
          expect(generator.next().value).toEqual(call(getFirebase))

          const firebase = {
            login: () => {}
          }
          expect(generator.next(firebase).value).toEqual(
            call(firebase.login, {
              email: 'test@example.com',
              password: 'mypassword'
            })
          )

          // eslint-disable-next-line no-console
          console.error = jest.fn()

          const error = new Error('Login failed')
          expect(generator.throw(error).value).toEqual(
            put(actions.loginFailure())
          )

          // eslint-disable-next-line no-console
          expect(console.error).toBeCalledWith('Login failed', error)

          expect(generator.next().done).toEqual(true)
        })
      })

      describe('default', () => {
        it('should fork all sagas', () => {
          const generator = sagas.default()

          expect(generator.next().value).toEqual(
            all([takeLatest(actions.LOGIN, sagas.login)])
          )
        })
      })
    })
  })
})
