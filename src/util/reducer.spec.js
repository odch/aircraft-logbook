import { createReducer } from './reducer'

describe('util', () => {
  describe('reducer', () => {
    describe('createReducer', () => {
      const add = value => ({
        type: 'ADD',
        payload: {
          value
        }
      })

      const subtract = value => ({
        type: 'SUBTRACT',
        payload: {
          value
        }
      })

      it('creates a reducer function from a map of action handlers', () => {
        const initialState = {
          value: 0
        }
        const actionHandlers = {
          ADD: (state, action) => ({
            value: state.value + action.payload.value
          }),
          SUBTRACT: (state, action) => ({
            value: state.value - action.payload.value
          })
        }

        const reducer = createReducer(initialState, actionHandlers)

        expect(reducer({ value: 10 }, add(5))).toEqual({
          value: 15
        })
        expect(reducer({ value: 5 }, subtract(10))).toEqual({
          value: -5
        })
      })
    })
  })
})
