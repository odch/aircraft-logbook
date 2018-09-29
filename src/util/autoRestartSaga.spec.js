/* eslint-disable no-console */
import { call } from 'redux-saga/effects'
import autoRestartSaga from './autoRestartSaga'

console.error = jest.fn()

describe('util', () => {
  describe('autoRestartSaga', () => {
    function* failingSaga() {
      // execution would throw an error
    }

    it('creates a reducer function from a map of action handlers', () => {
      const autoRestarting = autoRestartSaga(failingSaga)()

      expect(autoRestarting.next().value).toEqual(call(failingSaga))

      // fail for the first time -> call again
      const firstError = new Error('error during call')
      expect(autoRestarting.throw(firstError).value).toEqual(call(failingSaga))
      expect(console.error).toBeCalledWith(
        "Unhandled error in 'failingSaga'",
        firstError
      )

      // fail for the second time -> call again
      const secondError = new Error('error during call')
      expect(autoRestarting.throw(secondError).value).toEqual(call(failingSaga))
      expect(console.error).toBeCalledWith(
        "Unhandled error in 'failingSaga'",
        secondError
      )

      // ... and so on
    })
  })
})
