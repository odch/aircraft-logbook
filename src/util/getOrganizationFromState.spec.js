import getOrganizationFromState from './getOrganizationFromState'

describe('util', () => {
  describe('getOrganizationFromState', () => {
    it('should return undefined if organizations map undefined', () => {
      // correspondends to the state where organizations haven't been loaded yet
      // --> `isLoaded` from 'react-redux-firebase' will return `true` for
      //     `undefined` values, which is what we want to achieve

      const state = {
        firestore: {
          data: {
            organizations: undefined
          }
        }
      }

      const organization = getOrganizationFromState(state, 'my_org')
      expect(organization).toEqual(undefined)
    })

    it('should return null if organizations map exists but organization is not found', () => {
      const state = {
        firestore: {
          data: {
            organizations: {
              some_org: {}
            }
          }
        }
      }

      const organization = getOrganizationFromState(state, 'my_org')
      expect(organization).toEqual(null)
    })

    it('should return found organization', () => {
      const state = {
        firestore: {
          data: {
            organizations: {
              some_org: {},
              my_org: {}
            }
          }
        }
      }

      const organization = getOrganizationFromState(state, 'my_org')
      expect(organization).toEqual({
        id: 'my_org'
      })
    })
  })
})
