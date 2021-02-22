import { put, all, takeLatest, call } from 'redux-saga/effects'
import { expectSaga } from 'redux-saga-test-plan'
import { throwError } from 'redux-saga-test-plan/providers'
import { callFunction, getFirebase } from '../../../util/firebase'
import * as actions from './actions'
import * as sagas from './sagas'

describe('modules', () => {
  describe('login', () => {
    describe('sagas', () => {
      const createFirebase = () => {
        const authObj = {
          signInWithPopup: () => {},
          signInWithRedirect: () => {},
          signInWithCustomToken: () => {},
          setPersistence: () => {}
        }

        const auth = () => {
          return authObj
        }

        auth.GoogleAuthProvider = () => {}
        auth.Auth = { Persistence: { SESSION: 'session' } }

        const firebase = {
          auth
        }

        return firebase
      }

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

      describe('loginGoogle', () => {
        const testGoogleSignIn = signInFunctionName => {
          const generator = sagas.loginGoogle()

          expect(generator.next().value).toEqual(call(getFirebase))

          const firebase = createFirebase()

          const callEffect = generator.next(firebase).value

          const { args, context, fn } = callEffect.payload
          expect(args.length).toEqual(1)
          expect(args[0]).toBeInstanceOf(firebase.auth.GoogleAuthProvider)
          expect(context).toEqual(firebase.auth())
          expect(fn).toEqual(firebase.auth()[signInFunctionName])

          expect(generator.next().done).toEqual(true)
        }

        it('should trigger google sign in with popup on desktop devices', () => {
          testGoogleSignIn('signInWithPopup')
        })

        it('should trigger google sign in with redirect on mobile devices', () => {
          Object.defineProperty(window.navigator, 'userAgent', {
            value:
              'Mozilla/5.0 (Linux; U; Android 4.0.3; en-in; SonyEricssonMT11i' +
              ' Build/4.1.A.0.562) AppleWebKit/534.30 (KHTML, like Gecko)' +
              ' Version/4.0 Mobile Safari/534.30'
          })

          testGoogleSignIn('signInWithRedirect')
        })

        it('should put LOGIN_GOOGLE_FAILURE action if it fails', () => {
          const generator = sagas.loginGoogle()

          expect(generator.next().value).toEqual(call(getFirebase))

          const firebase = createFirebase()

          expect(generator.next(firebase).value)

          // eslint-disable-next-line no-console
          console.error = jest.fn()

          const error = new Error('Login failed')
          expect(generator.throw(error).value).toEqual(
            put(actions.loginGoogleFailure())
          )

          // eslint-disable-next-line no-console
          expect(console.error).toBeCalledWith('Google login failed', error)

          expect(generator.next().done).toEqual(true)
        })
      })

      describe('loginWithToken', () => {
        it('should execute login with token', () => {
          const token = 'test-org-4ab43049-64ac-435e-92c7-23daa066d4a5'
          const firebase = createFirebase()
          const firebaseToken = {
            data: 'my-generated-firebase-auth-token'
          }

          const action = actions.loginWithToken(token)
          return expectSaga(sagas.loginWithToken, action)
            .provide([
              [
                call(callFunction, 'getReadonlyToken', {
                  token
                }),
                firebaseToken
              ],
              [call(getFirebase), firebase]
            ])
            .call(
              {
                context: firebase.auth(),
                fn: firebase.auth().signInWithCustomToken
              },
              firebaseToken.data
            )
            .run()
        })

        it('should put TOKEN_LOGIN_FAILURE action if it fails', () => {
          const token = 'test-org-4ab43049-64ac-435e-92c7-23daa066d4a5'

          const action = actions.loginWithToken(token)
          return expectSaga(sagas.loginWithToken, action)
            .provide([
              [
                call(callFunction, 'getReadonlyToken', {
                  token
                }),
                throwError(new Error('getting token failed'))
              ]
            ])
            .put(actions.tokenLoginFailure())
            .run()
        })
      })

      describe('default', () => {
        it('should fork all sagas', () => {
          const generator = sagas.default()

          expect(generator.next().value).toEqual(
            all([
              takeLatest(actions.LOGIN, sagas.login),
              takeLatest(actions.LOGIN_GOOGLE, sagas.loginGoogle),
              takeLatest(actions.LOGIN_WITH_TOKEN, sagas.loginWithToken)
            ])
          )
        })
      })
    })
  })
})
