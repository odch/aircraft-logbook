import { all, takeEvery, fork, call, put } from 'redux-saga/effects'
import { getFirestore } from 'redux-firestore'
import * as actions from './actions'
import * as sagas from './sagas'

describe('modules', () => {
  describe('organizations', () => {
    describe('sagas', () => {
      describe('watchOrganizations', () => {
        it('should watch the organizations collection', () => {
          const watchOrganizationsAction = actions.watchOrganizations()

          const generator = sagas.watchOrganizations(watchOrganizationsAction)

          expect(generator.next().value).toEqual(call(getFirestore))

          const firestore = {
            setListener: () => {}
          }
          expect(generator.next(firestore).value).toEqual(
            call(firestore.setListener, { collection: 'organizations' })
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
            call(firestore.unsetListener, { collection: 'organizations' })
          )

          expect(generator.next().done).toEqual(true)
        })
      })

      describe('createOrganization', () => {
        it('should create an organization', () => {
          const createOrganization = actions.createOrganization({
            name: 'my_org'
          })

          const generator = sagas.createOrganization(createOrganization)

          expect(generator.next().value).toEqual(call(getFirestore))

          const firestore = {
            set: () => {}
          }
          expect(generator.next(firestore).value).toEqual(
            call(
              firestore.set,
              { collection: 'organizations', doc: 'my_org' },
              {}
            )
          )

          expect(generator.next().value).toEqual(
            put(actions.createOrganizationSuccess())
          )

          expect(generator.next().done).toEqual(true)
        })

        it('should put CREATE_ORGANIZATION_FAILRE if it fails', () => {
          const createOrganization = actions.createOrganization({
            name: 'my_org'
          })

          const generator = sagas.createOrganization(createOrganization)

          expect(generator.next().value).toEqual(call(getFirestore))

          const firestore = {
            set: () => {}
          }
          expect(generator.next(firestore).value).toEqual(
            call(
              firestore.set,
              { collection: 'organizations', doc: 'my_org' },
              {}
            )
          )

          // eslint-disable-next-line no-console
          console.error = jest.fn()

          const error = new Error('Failed to add the document')
          expect(generator.throw(error).value).toEqual(
            put(actions.createOrganizationFailure())
          )

          // eslint-disable-next-line no-console
          expect(console.error).toBeCalledWith(
            'Failed to create organization my_org',
            error
          )

          expect(generator.next().done).toEqual(true)
        })
      })

      describe('loadOrganization', () => {
        it('should load an organization', () => {
          const loadOrganizationAction = actions.loadOrganization('my_org')

          const generator = sagas.loadOrganization(loadOrganizationAction)

          expect(generator.next().value).toEqual(call(getFirestore))

          const firestore = {
            get: () => {}
          }
          expect(generator.next(firestore).value).toEqual(
            call(firestore.get, { collection: 'organizations', doc: 'my_org' })
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
                actions.WATCH_ORGANIZATIONS,
                sagas.watchOrganizations
              ),
              fork(
                takeEvery,
                actions.UNWATCH_ORGANIZATIONS,
                sagas.unwatchOrganizations
              ),
              fork(
                takeEvery,
                actions.CREATE_ORGANIZATION,
                sagas.createOrganization
              ),
              fork(takeEvery, actions.LOAD_ORGANIZATION, sagas.loadOrganization)
            ])
          )
        })
      })
    })
  })
})
