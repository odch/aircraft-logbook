import { all, takeEvery, call, select, put } from 'redux-saga/effects'
import { constants as reduxFirebaseConstants } from 'react-redux-firebase'
import { constants as reduxFirestoreConstants } from 'redux-firestore'
import { expectSaga } from 'redux-saga-test-plan'
import { getDoc } from '../../util/firestoreUtils'
import { getFirebase, getFirestore } from '../../util/firebase'
import * as actions from './actions'
import * as sagas from './sagas'

describe('modules', () => {
  describe('app', () => {
    describe('sagas', () => {
      describe('onLogin', () => {
        let dateSpy
        const mockDate = new Date(1572393600000) // 2019-10-30T00:00Z0 (GMT)

        beforeAll(() => {
          dateSpy = jest
            .spyOn(global, 'Date')
            .mockImplementation(() => mockDate)
        })

        afterAll(() => {
          dateSpy.mockRestore()
        })

        it('should update last login timestamp and fetch organizations', () => {
          const firebase = {
            updateProfile: () => {}
          }
          const firestore = {
            setListener: () => {}
          }

          const generator = sagas.onLogin()

          expect(generator.next().value).toEqual(call(getFirebase))

          expect(generator.next(firebase).value).toEqual(call(getFirestore))

          expect(generator.next(firestore).value).toEqual(
            call(firebase.updateProfile, { lastLogin: new Date() })
          )

          expect(generator.next().value).toEqual(select(sagas.uidSelector))

          expect(generator.next('current-user-id').value).toEqual(
            call(firestore.setListener, {
              collection: 'users',
              doc: 'current-user-id',
              storeAs: 'currentUser'
            })
          )

          expect(generator.next().value).toEqual(
            put(actions.fetchOrganizations())
          )

          expect(generator.next().done).toEqual(true)
        })

        it('should set the readonly organization if readonly user', () => {
          const firebase = {
            updateProfile: () => {},
            auth: () => ({
              currentUser: {
                getIdTokenResult: () => ({
                  claims: {
                    organization: 'mfgt'
                  }
                })
              }
            })
          }

          return expectSaga(sagas.onLogin)
            .provide([
              [call(getFirebase), firebase],
              [call(getFirestore), {}],
              [select(sagas.uidSelector), 'readonly']
            ])
            .put(actions.setMyOrganizations([{ id: 'mfgt', readonly: true }]))
            .run()
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

          expect(generator.next().value).toEqual(
            put(actions.setMyOrganizations(undefined))
          )

          expect(generator.next().done).toEqual(true)
        })
      })

      describe('fetchOrganizations', () => {
        it('should fetch the organizations', () => {
          const org1 = {
            get: () => ({
              exists: true,
              id: 'org1',
              data: () => ({ name: 'org1' })
            })
          }
          const org2 = {
            get: () => ({
              exists: true,
              id: 'org2',
              data: () => ({ name: 'org2' })
            })
          }
          const org3 = {
            get: () => ({
              exists: true,
              data: () => ({ id: 'org2', name: 'org2', deleted: true })
            })
          }
          const org4 = {
            get: () => ({
              exists: false
            })
          }

          const orgs = {
            org1: {
              ref: org1,
              roles: ['manager']
            },
            org2: {
              ref: org2,
              roles: ['user']
            },
            org3: {
              ref: org3,
              roles: ['user']
            },
            org4: {
              ref: org4,
              roles: ['user']
            }
          }

          const currentUserDoc = {
            ref: {},
            get: field => (field === 'orgs' ? orgs : undefined)
          }

          const orgsWithRoles = [
            { id: 'org1', name: 'org1', roles: ['manager'] },
            { id: 'org2', name: 'org2', roles: ['user'] }
          ]

          return expectSaga(sagas.fetchOrganizations)
            .provide([
              [select(sagas.uidSelector), 'current-user-id'],
              [call(getDoc, ['users', 'current-user-id']), currentUserDoc]
            ])
            .put(actions.setMyOrganizations(orgsWithRoles))
            .run()
        })

        it('should set empty array if user has no organizations', () => {
          const generator = sagas.fetchOrganizations()

          expect(generator.next().value).toEqual(select(sagas.uidSelector))

          expect(generator.next('current-user-id').value).toEqual(
            call(getDoc, ['users', 'current-user-id'])
          )

          const currentUserDoc = {
            ref: {},
            get: () => ({})
          }

          expect(generator.next(currentUserDoc).value).toEqual(
            put(actions.setMyOrganizations([]))
          )

          expect(generator.next().done).toEqual(true)
        })

        it('should keep undefined/loading state if orgs object not set on user', () => {
          const generator = sagas.fetchOrganizations()

          expect(generator.next().value).toEqual(select(sagas.uidSelector))

          expect(generator.next('current-user-id').value).toEqual(
            call(getDoc, ['users', 'current-user-id'])
          )

          const currentUserDoc = {
            ref: {},
            get: () => undefined
          }

          expect(generator.next(currentUserDoc).value).toEqual(
            put(actions.setMyOrganizations(undefined))
          )

          expect(generator.next().done).toEqual(true)
        })
      })

      describe('onListenerResponse', () => {
        it('should fetch organizations again if currentUser updated', () => {
          const generator = sagas.onListenerResponse({
            meta: { storeAs: 'currentUser' }
          })
          expect(generator.next().value).toEqual(call(sagas.fetchOrganizations))
          expect(generator.next().done).toEqual(true)
        })

        it('should do nothing if not currentUser update', () => {
          const generator = sagas.onListenerResponse({
            meta: {}
          })
          expect(generator.next().done).toEqual(true)
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
                sagas.onLogin
              ),
              takeEvery(
                reduxFirebaseConstants.actionTypes.LOGOUT,
                sagas.unwatchCurrentUser
              ),
              takeEvery(
                reduxFirestoreConstants.actionTypes.GET_SUCCESS,
                sagas.onGetSuccess
              ),
              takeEvery(
                reduxFirestoreConstants.actionTypes.LISTENER_RESPONSE,
                sagas.onListenerResponse
              ),
              takeEvery(actions.LOGOUT, sagas.logout),
              takeEvery(actions.WATCH_AERODROMES, sagas.watchAerodromes),
              takeEvery(actions.FETCH_ORGANIZATIONS, sagas.fetchOrganizations)
            ])
          )
        })
      })
    })
  })
})
