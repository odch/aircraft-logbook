import { all, takeEvery, call, select, put } from 'redux-saga/effects'
import { constants as reduxFirebaseConstants } from 'react-redux-firebase'
import { constants as reduxFirestoreConstants } from 'redux-firestore'
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
          const org1 = { exists: true, data: () => ({ id: 'org1' }) }
          const org2 = { exists: true, data: () => ({ id: 'org2' }) }
          const org3 = { exists: false }

          const orgRefs = [
            { get: () => org1 },
            { get: () => org2 },
            { get: () => org3 }
          ]

          const currentUserDoc = {
            ref: {},
            get: field => (field === 'organizations' ? orgRefs : undefined)
          }

          const orgsWithRoles = [
            { id: 'org1', roles: ['manager'] },
            { id: 'org2', roles: ['user'] }
          ]

          const generator = sagas.fetchOrganizations()

          expect(generator.next().value).toEqual(select(sagas.uidSelector))

          expect(generator.next('current-user-id').value).toEqual(
            call(getDoc, ['users', 'current-user-id'])
          )

          const allEffect = generator.next(currentUserDoc).value

          const docs = allEffect.payload.map(callEffect =>
            callEffect.payload.fn()
          )

          const getAllWithRolesEffect = generator.next(docs).value

          expect(getAllWithRolesEffect.payload).toEqual([
            call(sagas.getWithRoles, org1, currentUserDoc.ref),
            call(sagas.getWithRoles, org2, currentUserDoc.ref)
          ])

          expect(generator.next(orgsWithRoles).value).toEqual(
            put(actions.setMyOrganizations(orgsWithRoles))
          )

          expect(generator.next().done).toEqual(true)
        })

        it('should set empty array if user has no organizations', () => {
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
              id: 'org-id',
              owner: {
                id: 'some-other-user-id'
              }
            })
          }
          const userRef = {
            id: 'current-user-id'
          }

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
            owner: {
              id: 'some-other-user-id'
            },
            roles: ['user', 'manager']
          })
          expect(next.done).toEqual(true)
        })

        it('should return organization data with manager role if is owner', () => {
          const orgDoc = {
            id: 'org-id',
            data: () => ({
              id: 'org-id',
              owner: {
                id: 'current-user-id'
              }
            })
          }
          const userRef = {
            id: 'current-user-id'
          }

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
            docs: []
          }

          const next = generator.next(members)

          expect(next.value).toEqual({
            id: 'org-id',
            owner: {
              id: 'current-user-id'
            },
            roles: ['manager']
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
