import { all, takeLatest, fork, call } from 'redux-saga/effects'
import { getFirestore } from 'redux-firestore'
import * as actions from './actions'
import * as sagas from './sagas'

describe('modules', () => {
  describe('organizations', () => {
    describe('sagas', () => {
      describe('loadOrganizations', () => {
        it('should create user', () => {
          const loadOrganizationsAction = actions.loadOrganizations()

          const generator = sagas.loadOrganizations(loadOrganizationsAction)

          expect(generator.next().value).toEqual(call(getFirestore))

          const firestore = {
            get: () => {}
          }
          expect(generator.next(firestore).value).toEqual(
            call(firestore.get, 'organizations')
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
                takeLatest,
                actions.LOAD_ORGANIZATIONS,
                sagas.loadOrganizations
              )
            ])
          )
        })
      })
    })
  })
})
