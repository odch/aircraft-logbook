/* eslint-disable no-console */
import { error } from './log'

console.error = jest.fn()

describe('util', () => {
  describe('log', () => {
    describe('error', () => {
      it('logs an error message', () => {
        const myError = new Error()
        error('my test message', myError)
        expect(console.error).toBeCalledWith('my test message', myError)
      })
    })
  })
})
