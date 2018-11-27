import { all, takeEvery, fork, call, select, put } from 'redux-saga/effects'
import { constants as reduxFirebaseConstants } from 'react-redux-firebase'
import { constants as reduxFirestoreConstants } from 'redux-firestore'
import { getFirebase, getFirestore } from '../../util/firebase'
import * as actions from './actions'
import * as sagas from './sagas'

describe('modules', () => {
  describe('app', () => {
    describe('sagas', () => {
      describe('watchCurrentUser', () => {
        it('should watch the current user document', () => {
          const generator = sagas.watchCurrentUser()

          expect(generator.next().value).toEqual(call(getFirestore))

          const firestore = {
            setListener: () => {}
          }

          expect(generator.next(firestore).value).toEqual(
            select(sagas.uidSelector)
          )

          const uid = '0csmoOOMA070mXEHLd9n'

          expect(generator.next(uid).value).toEqual(
            call(firestore.setListener, {
              collection: 'users',
              doc: uid,
              storeAs: 'currentUser',
              listenerId: 'currentUser'
            })
          )

          expect(generator.next().done).toEqual(true)
        })
      })

      describe('unwatchCurrentUser', () => {
        it('should unwatch the user document', () => {
          const generator = sagas.unwatchCurrentUser()

          expect(generator.next().value).toEqual(call(getFirestore))

          const firestore = {
            unsetListener: () => {}
          }

          expect(generator.next(firestore).value).toEqual(
            select(sagas.currentUserUid)
          )

          const uid = '0csmoOOMA070mXEHLd9n'

          expect(generator.next(uid).value).toEqual(
            call(firestore.unsetListener, {
              collection: 'users',
              doc: uid
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

      describe('customListenerResponseSagas', () => {
        it('should map the customer listener response sagas', () => {
          expect(sagas.customListenerResponseSagas).toEqual({
            currentUser: sagas.fetchMyOrganizations
          })
        })
      })

      describe('onListenerResponse', () => {
        it('should do nothing if no listener id present', () => {
          const action = {
            type: reduxFirestoreConstants.actionTypes.LISTENER_RESPONSE,
            meta: {
              // listenerId not present
            }
          }

          const generator = sagas.onListenerResponse(action)

          expect(generator.next().done).toEqual(true)
        })

        it('should do nothing if no saga mapped on listener id', () => {
          const action = {
            type: reduxFirestoreConstants.actionTypes.LISTENER_RESPONSE,
            meta: {
              listenerId: 'myUnmappedListener'
            }
          }

          const generator = sagas.onListenerResponse(action)

          expect(generator.next().done).toEqual(true)
        })

        it('should call fetchMyOrganizations saga if listener id is currentUser', () => {
          const action = {
            type: reduxFirestoreConstants.actionTypes.LISTENER_RESPONSE,
            meta: {
              listenerId: 'currentUser'
            }
          }

          const generator = sagas.onListenerResponse(action)

          expect(generator.next().value).toEqual(
            call(sagas.fetchMyOrganizations, action)
          )

          expect(generator.next().done).toEqual(true)
        })
      })

      describe('fetchMyOrganizations', () => {
        it('should fetch the organizations', () => {
          const org1 = { data: () => ({ id: 'org1' }) }
          const org2 = { data: () => ({ id: 'org2' }) }

          const orgRefs = [{ get: () => org1 }, { get: () => org2 }]

          const action = {
            type: reduxFirestoreConstants.actionTypes.LISTENER_RESPONSE,
            payload: {
              ordered: [
                {
                  organizations: orgRefs
                }
              ]
            }
          }

          const generator = sagas.fetchMyOrganizations(action)

          const allEffect = generator.next().value

          const docs = allEffect.ALL.map(callEffect => callEffect.CALL.fn())

          expect(generator.next(docs).value).toEqual(
            put(actions.setMyOrganizations([{ id: 'org1' }, { id: 'org2' }]))
          )

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
                reduxFirebaseConstants.actionTypes.LOGIN,
                sagas.watchCurrentUser
              ),
              fork(
                takeEvery,
                reduxFirebaseConstants.actionTypes.LOGOUT,
                sagas.unwatchCurrentUser
              ),
              fork(
                takeEvery,
                reduxFirestoreConstants.actionTypes.LISTENER_RESPONSE,
                sagas.onListenerResponse
              ),
              fork(takeEvery, actions.LOGOUT, sagas.logout)
            ])
          )
        })
      })
    })
  })
})
