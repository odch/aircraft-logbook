import reducer from './reducer'
import * as actions from './actions'

const INITIAL_STATE = {}

describe('modules', () => {
  describe('app', () => {
    describe('reducer', () => {
      it('defines an initial state', () => {
        expect(reducer(undefined, {})).toEqual(INITIAL_STATE)
      })

      it('handles SET_MY_ORGANIZATIONS action', () => {
        const organizations = [{ id: 'my_org1' }, { id: 'my_org2' }]
        expect(reducer({}, actions.setMyOrganizations(organizations))).toEqual({
          organizations
        })
      })
    })
  })
})
