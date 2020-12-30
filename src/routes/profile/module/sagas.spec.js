import { all, takeLatest, call } from 'redux-saga/effects'
import { expectSaga } from 'redux-saga-test-plan'
import { getFirebase } from '../../../util/firebase'
import * as actions from './actions'
import * as sagas from './sagas'

describe('modules', () => {
  describe('profile', () => {
    describe('sagas', () => {
      describe('updateLocale', () => {
        it('should update profile with new locale', () => {
          const action = actions.updateLocale('de')

          const firebase = {
            updateProfile: () => {}
          }

          return expectSaga(sagas.updateLocale, action)
            .provide([[call(getFirebase), firebase]])
            .call(firebase.updateProfile, { locale: 'de' })
            .run()
        })
      })

      describe('default', () => {
        it('should fork all sagas', () => {
          const generator = sagas.default()

          expect(generator.next().value).toEqual(
            all([takeLatest(actions.UPDATE_LOCALE, sagas.updateLocale)])
          )
        })
      })
    })
  })
})
