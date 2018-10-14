import reducer from './reducer'

const INITIAL_STATE = {}

describe('modules', () => {
  describe('organizations', () => {
    describe('reducer', () => {
      it('defines an initial state', () => {
        expect(reducer(undefined, {})).toEqual(INITIAL_STATE)
      })
    })
  })
})
