import { all, takeEvery, fork, call, select } from 'redux-saga/effects'
import { constants } from 'react-redux-firebase'
import { getFirebase, getFirestore } from '../../util/firebase'
import * as actions from './actions'
import * as sagas from './sagas'

describe('modules', () => {
  describe('app', () => {
    describe('sagas', () => {
      describe('getCurrentUser', () => {
        it('should return the current user', () => {
          const generator = sagas.getCurrentUser()

          expect(generator.next().value).toEqual(call(getFirestore))

          const firestore = {
            get: () => {}
          }
          expect(generator.next(firestore).value).toEqual(
            select(sagas.uidSelector)
          )

          const uid = 'test-user-uid'

          expect(generator.next(uid).value).toEqual(
            call(firestore.get, {
              collection: 'users',
              doc: uid
            })
          )

          const user = {}

          const next = generator.next(user)

          expect(next.done).toEqual(true)
          expect(next.value).toEqual(user)
        })

        it('should throw an error if the current user could not be found', () => {
          const generator = sagas.getCurrentUser()

          expect(generator.next().value).toEqual(call(getFirestore))

          const firestore = {
            get: () => {}
          }
          expect(generator.next(firestore).value).toEqual(
            select(sagas.uidSelector)
          )

          const uid = 'test-user-uid'

          expect(generator.next(uid).value).toEqual(
            call(firestore.get, {
              collection: 'users',
              doc: uid
            })
          )

          const user = null

          expect(() => {
            generator.next(user)
          }).toThrow('User for id test-user-uid not found')
        })
      })

      describe('watchOrganizations', () => {
        it('should watch the organizations collection', () => {
          const watchOrganizationsAction = actions.watchOrganizations()

          const generator = sagas.watchOrganizations(watchOrganizationsAction)

          expect(generator.next().value).toEqual(call(getFirestore))

          const firestore = {
            setListener: () => {}
          }

          expect(generator.next(firestore).value).toEqual(
            call(sagas.getCurrentUser)
          )

          const currentUser = {
            ref: {}
          }

          expect(generator.next(currentUser).value).toEqual(
            call(firestore.setListener, {
              collection: 'organizations',
              where: ['owner', '==', currentUser.ref]
            })
          )

          expect(generator.next().done).toEqual(true)
        })
      })

      describe('unwatchOrganizations', () => {
        it('should unwatch the organizations collection', () => {
          const unwatchOrganizations = actions.unwatchOrganizations()

          const generator = sagas.unwatchOrganizations(unwatchOrganizations)

          expect(generator.next().value).toEqual(call(getFirestore))

          const firestore = {
            unsetListener: () => {}
          }
          expect(generator.next(firestore).value).toEqual(
            call(firestore.unsetListener, {
              collection: 'organizations',
              where: ['owner', '==', {}]
            })
          )

          expect(generator.next().done).toEqual(true)
        })
      })

      describe('logout', () => {
        it('should log out', () => {
          const generator = sagas.logout()

          expect(generator.next().value).toEqual(call(getFirebase))

          const firebase = {
            logout: () => {}
          }
          expect(generator.next(firebase).value).toEqual(call(firebase.logout))

          expect(generator.next().done).toEqual(true)
        })
      })

      describe('default', () => {
        it('should fork all sagas', () => {
          const generator = sagas.default()

          expect(generator.next().value).toEqual(
            all([
              fork(
                takeEvery,
                constants.actionTypes.LOGIN,
                sagas.watchOrganizations
              ),
              fork(
                takeEvery,
                constants.actionTypes.LOGOUT,
                sagas.unwatchOrganizations
              ),
              fork(takeEvery, actions.LOGOUT, sagas.logout)
            ])
          )
        })
      })
    })
  })
})
