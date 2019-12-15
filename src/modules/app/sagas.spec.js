import { all, takeEvery, call, select, put } from 'redux-saga/effects'
import { constants as reduxFirebaseConstants } from 'react-redux-firebase'
import { constants as reduxFirestoreConstants } from 'redux-firestore'
import { getDoc } from '../../util/firestoreUtils'
import { getFirebase, getFirestore } from '../../util/firebase'
import * as actions from './actions'
import * as sagas from './sagas'
import { getWithRoles } from './sagas'

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

          const currentUserDoc = {
            ref: {}
          }

          const orgsWithRoles = [
            { id: 'org1', roles: ['manager'] },
            { id: 'org2', roles: ['user'] }
          ]

          const action = {
            type: reduxFirestoreConstants.actionTypes.LISTENER_RESPONSE,
            payload: {
              data: {},
              ordered: [
                {
                  id: 'current-user-id',
                  organizations: orgRefs
                }
              ]
            }
          }

          const generator = sagas.fetchMyOrganizations(action)

          const allEffect = generator.next().value

          const docs = allEffect.payload.map(callEffect =>
            callEffect.payload.fn()
          )

          expect(generator.next(docs).value).toEqual(
            call(getDoc, ['users', 'current-user-id'])
          )

          const getAllWithRolesEffect = generator.next(currentUserDoc).value

          expect(getAllWithRolesEffect.payload).toEqual([
            call(getWithRoles, org1, currentUserDoc.ref),
            call(getWithRoles, org2, currentUserDoc.ref)
          ])

          expect(generator.next(orgsWithRoles).value).toEqual(
            put(actions.setMyOrganizations(orgsWithRoles))
          )

          expect(generator.next().done).toEqual(true)
        })

        it('should set empty array if user has no organizations', () => {
          const action = {
            type: reduxFirestoreConstants.actionTypes.LISTENER_RESPONSE,
            payload: {
              data: {},
              ordered: [
                {
                  // no organizations here
                }
              ]
            }
          }

          const generator = sagas.fetchMyOrganizations(action)

          expect(generator.next().value).toEqual(
            put(actions.setMyOrganizations([]))
          )

          expect(generator.next().done).toEqual(true)
        })

        it('should set empty array if data is missing', () => {
          const action = {
            type: reduxFirestoreConstants.actionTypes.LISTENER_RESPONSE,
            payload: {
              data: null
            }
          }

          const generator = sagas.fetchMyOrganizations(action)

          expect(generator.next().value).toEqual(
            put(actions.setMyOrganizations([]))
          )

          expect(generator.next().done).toEqual(true)
        })
      })

      describe('getWithRoles', () => {
        const memberDoc = roles => ({
          get: field => (field === 'roles' ? roles : undefined)
        })

        it('should return the organization data along with the roles of the current user', () => {
          const orgDoc = {
            id: 'org-id',
            data: () => ({
              id: 'org-id'
            })
          }
          const userRef = {}

          const generator = sagas.getWithRoles(orgDoc, userRef)

          expect(generator.next().value).toEqual(call(getFirestore))

          const firestore = {
            get: () => {}
          }

          expect(generator.next(firestore).value).toEqual(
            call(firestore.get, {
              collection: 'organizations',
              doc: 'org-id',
              subcollections: [{ collection: 'members' }],
              where: ['user', '==', userRef],
              storeAs: 'org-user-member'
            })
          )

          const members = {
            docs: [memberDoc(['user']), memberDoc(['manager'])]
          }

          const next = generator.next(members)

          expect(next.value).toEqual({
            id: 'org-id',
            roles: ['user', 'manager']
          })
          expect(next.done).toEqual(true)
        })
      })

      describe('collectReferences', () => {
        it('should collect the references', () => {
          const depAerodromeRef1 = {}
          const depAerodromeRef2 = {}
          const destAerodromeRef1 = {}
          const destAerodromeRef2 = {}

          const data = {
            sStfyLd2XArT7oUZPFDn: {
              foo: 'bar',
              departureAerodrome: depAerodromeRef1,
              destinationAerodrome: destAerodromeRef1
            },
            vuB0UPVhvhl8ikOgJjvC: {
              foo: 'bar',
              departureAerodrome: depAerodromeRef2,
              destinationAerodrome: destAerodromeRef2
            }
          }

          expect(
            sagas.collectReferences(data, [
              'departureAerodrome',
              'destinationAerodrome'
            ])
          ).toEqual([
            {
              id: {
                key: 'sStfyLd2XArT7oUZPFDn',
                item: 'departureAerodrome'
              },
              ref: depAerodromeRef1
            },
            {
              id: {
                key: 'sStfyLd2XArT7oUZPFDn',
                item: 'destinationAerodrome'
              },
              ref: destAerodromeRef1
            },
            {
              id: {
                key: 'vuB0UPVhvhl8ikOgJjvC',
                item: 'departureAerodrome'
              },
              ref: depAerodromeRef2
            },
            {
              id: {
                key: 'vuB0UPVhvhl8ikOgJjvC',
                item: 'destinationAerodrome'
              },
              ref: destAerodromeRef2
            }
          ])
        })
      })

      describe('resolveReference', () => {
        it('should resolve a reference', () => {
          const doc = { data: () => ({ name: 'Lommis' }) }
          const ref = { get: () => doc }

          const id = {
            key: 'vuB0UPVhvhl8ikOgJjvC',
            item: 'departureAerodrome'
          }

          const generator = sagas.resolveReference(id, ref)

          const callEffect = generator.next().value

          const callResult = callEffect.payload.fn()

          expect(generator.next(callResult).value).toEqual({
            id,
            data: { name: 'Lommis' }
          })

          expect(generator.next().done).toEqual(true)
        })

        it('should return data right away if not a reference', () => {
          const data = { name: 'Lommis' }

          const id = {
            key: 'vuB0UPVhvhl8ikOgJjvC',
            item: 'departureAerodrome'
          }

          const generator = sagas.resolveReference(id, data)

          expect(generator.next().value).toEqual({
            id,
            data: { name: 'Lommis' }
          })

          expect(generator.next().done).toEqual(true)
        })
      })

      describe('populate', () => {
        it('should populate the action payload', () => {
          const depAerodromeRef1 = {}
          const depAerodromeRef2 = {}
          const destAerodromeRef1 = {}
          const destAerodromeRef2 = {}

          const depAerodrome1 = { name: 'Lommis' }
          const depAerodrome2 = { name: 'Lommis' }
          const destAerodrome1 = { name: 'Lommis' }
          const destAerodrome2 = { name: 'Lommis' }

          const resolvedDocs = [
            {
              id: {
                key: 'sStfyLd2XArT7oUZPFDn',
                item: 'departureAerodrome'
              },
              data: depAerodrome1
            },
            {
              id: {
                key: 'sStfyLd2XArT7oUZPFDn',
                item: 'destinationAerodrome'
              },
              data: destAerodrome1
            },
            {
              id: {
                key: 'vuB0UPVhvhl8ikOgJjvC',
                item: 'departureAerodrome'
              },
              data: depAerodrome2
            },
            {
              id: {
                key: 'vuB0UPVhvhl8ikOgJjvC',
                item: 'destinationAerodrome'
              },
              data: destAerodrome2
            }
          ]

          const data = {
            sStfyLd2XArT7oUZPFDn: {
              foo: 'bar',
              departureAerodrome: depAerodromeRef1,
              destinationAerodrome: destAerodromeRef1
            },
            vuB0UPVhvhl8ikOgJjvC: {
              foo: 'bar',
              departureAerodrome: depAerodromeRef2,
              destinationAerodrome: destAerodromeRef2
            }
          }

          const orderedData = [
            {
              id: 'sStfyLd2XArT7oUZPFDn',
              foo: 'bar',
              departureAerodrome: depAerodromeRef1,
              destinationAerodrome: destAerodromeRef1
            },
            {
              id: 'vuB0UPVhvhl8ikOgJjvC',
              foo: 'bar',
              departureAerodrome: depAerodromeRef2,
              destinationAerodrome: destAerodromeRef2
            }
          ]

          sagas.populate(resolvedDocs, data, orderedData)

          expect(data).toEqual({
            sStfyLd2XArT7oUZPFDn: {
              foo: 'bar',
              departureAerodrome: depAerodrome1,
              destinationAerodrome: destAerodrome1
            },
            vuB0UPVhvhl8ikOgJjvC: {
              foo: 'bar',
              departureAerodrome: depAerodrome2,
              destinationAerodrome: destAerodrome2
            }
          })

          expect(orderedData).toEqual([
            {
              id: 'sStfyLd2XArT7oUZPFDn',
              foo: 'bar',
              departureAerodrome: depAerodrome1,
              destinationAerodrome: destAerodrome1
            },
            {
              id: 'vuB0UPVhvhl8ikOgJjvC',
              foo: 'bar',
              departureAerodrome: depAerodrome2,
              destinationAerodrome: destAerodrome2
            }
          ])
        })
      })

      describe('populateAndPutAgain', () => {
        it('should call populate the firestore references and put the action again', () => {
          const action = {
            type: reduxFirestoreConstants.actionTypes.GET_SUCCESS,
            meta: {
              populate: ['departureAerodrome']
            },
            payload: {
              data: {
                sStfyLd2XArT7oUZPFDn: {
                  foo: 'bar',
                  departureAerodrome: {}
                }
              },
              ordered: [
                {
                  id: 'sStfyLd2XArT7oUZPFDn',
                  foo: 'bar',
                  departureAerodrome: {}
                }
              ]
            }
          }

          const generator = sagas.populateAndPutAgain(action)

          const allEffect = generator.next().value

          expect(allEffect.payload.length).toEqual(1)

          const resolvedDocs = [
            {
              id: {
                key: 'sStfyLd2XArT7oUZPFDn',
                item: 'departureAerodrome'
              },
              data: { name: 'Lommis' }
            }
          ]

          expect(generator.next(resolvedDocs).value).toEqual(
            put({
              type: reduxFirestoreConstants.actionTypes.GET_SUCCESS,
              meta: {},
              payload: {
                data: {
                  sStfyLd2XArT7oUZPFDn: {
                    foo: 'bar',
                    departureAerodrome: {
                      name: 'Lommis'
                    }
                  }
                },
                ordered: [
                  {
                    id: 'sStfyLd2XArT7oUZPFDn',
                    foo: 'bar',
                    departureAerodrome: {
                      name: 'Lommis'
                    }
                  }
                ]
              }
            })
          )

          expect(generator.next().done).toEqual(true)
        })
      })

      describe('onGetSuccess', () => {
        it('should call populateAndPutAgain if populate property is set', () => {
          const action = {
            type: reduxFirestoreConstants.actionTypes.GET_SUCCESS,
            meta: {
              populate: ['departureAerodrome', 'destinationAerodrome']
            }
          }

          const generator = sagas.onGetSuccess(action)

          expect(generator.next().value).toEqual(
            call(sagas.populateAndPutAgain, action)
          )

          expect(generator.next().done).toEqual(true)
        })

        it('should not call populateAndPutAgain if populate property is not set', () => {
          const action = {
            type: reduxFirestoreConstants.actionTypes.GET_SUCCESS,
            meta: {}
          }

          const generator = sagas.onGetSuccess(action)

          expect(generator.next().done).toEqual(true)
        })
      })

      describe('watchAerodromes', () => {
        it('should set listener for aerodromes', () => {
          const generator = sagas.watchAerodromes()

          expect(generator.next().value).toEqual(call(getFirestore))

          const firestore = {
            setListener: () => {}
          }
          expect(generator.next(firestore).value).toEqual(
            call(firestore.setListener, {
              collection: 'aerodromes',
              orderBy: 'name',
              storeAs: 'allAerodromes'
            })
          )

          expect(generator.next().done).toEqual(true)
        })
      })

      describe('default', () => {
        it('should fork all sagas', () => {
          const generator = sagas.default()

          expect(generator.next().value).toEqual(
            all([
              takeEvery(
                reduxFirebaseConstants.actionTypes.LOGIN,
                sagas.watchCurrentUser
              ),
              takeEvery(
                reduxFirebaseConstants.actionTypes.LOGOUT,
                sagas.unwatchCurrentUser
              ),
              takeEvery(
                reduxFirestoreConstants.actionTypes.LISTENER_RESPONSE,
                sagas.onListenerResponse
              ),
              takeEvery(
                reduxFirestoreConstants.actionTypes.GET_SUCCESS,
                sagas.onGetSuccess
              ),
              takeEvery(actions.LOGOUT, sagas.logout),
              takeEvery(actions.WATCH_AERODROMES, sagas.watchAerodromes)
            ])
          )
        })
      })
    })
  })
})
