import { put, all, takeLatest, fork, call } from 'redux-saga/effects'
import { getFirebase } from '../../../util/firebase'
import * as actions from './actions'
import * as sagas from './sagas'

describe('modules', () => {
  describe('registration', () => {
    describe('sagas', () => {
      describe('register', () => {
        it('should create user', () => {
          const registrationAction = actions.register({
            firstname: 'Max',
            lastname: 'Muster',
            email: 'test@example.com',
            password: 'mypassword'
          })

          const generator = sagas.register(registrationAction)

          expect(generator.next().value).toEqual(put(actions.setSubmitted()))
          expect(generator.next().value).toEqual(call(getFirebase))

          const firebase = {
            createUser: () => {}
          }
          expect(generator.next(firebase).value).toEqual(
            call(
              firebase.createUser,
              {
                email: 'test@example.com',
                password: 'mypassword'
              },
              {
                firstname: 'Max',
                lastname: 'Muster',
                email: 'test@example.com'
              }
            )
          )

          expect(generator.next().value).toEqual(
            put(actions.registrationSuccess())
          )

          expect(generator.next().done).toEqual(true)
        })

        it('should put REGISTRATION_FAILURE action if it fails', () => {
          const registrationAction = actions.register({
            firstname: 'Max',
            lastname: 'Muster',
            email: 'test@example.com',
            password: 'mypassword'
          })

          const generator = sagas.register(registrationAction)

          expect(generator.next().value).toEqual(put(actions.setSubmitted()))
          expect(generator.next().value).toEqual(call(getFirebase))

          const firebase = {
            createUser: () => {}
          }
          expect(generator.next(firebase).value).toEqual(
            call(
              firebase.createUser,
              {
                email: 'test@example.com',
                password: 'mypassword'
              },
              {
                firstname: 'Max',
                lastname: 'Muster',
                email: 'test@example.com'
              }
            )
          )

          // eslint-disable-next-line no-console
          console.error = jest.fn()

          const error = new Error('Registration failed')
          expect(generator.throw(error).value).toEqual(
            put(actions.registrationFailure())
          )

          // eslint-disable-next-line no-console
          expect(console.error).toBeCalledWith('Registration failed', error)

          expect(generator.next().done).toEqual(true)
        })
      })

      describe('default', () => {
        it('should fork all sagas', () => {
          const generator = sagas.default()

          expect(generator.next().value).toEqual(
            all([fork(takeLatest, actions.REGISTER, sagas.register)])
          )
        })
      })
    })
  })
})
