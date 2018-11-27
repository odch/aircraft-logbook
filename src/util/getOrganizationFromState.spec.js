import getOrganizationFromState from './getOrganizationFromState'

describe('util', () => {
  describe('getOrganizationFromState', () => {
    it('should return undefined if organizations map undefined', () => {
      // correspondends to the state where organizations haven't been loaded yet
      // --> `isLoaded` will return `true` for `undefined` values,
      //     which is what we want to achieve

      const state = {
        main: {
          app: {
            organizations: undefined
          }
        }
      }

      const organization = getOrganizationFromState(state, 'my_org')
      expect(organization).toEqual(undefined)
    })

    it('should return null if organizations map exists but organization is not found', () => {
      const state = {
        main: {
          app: {
            organizations: [{ id: 'some_org' }]
          }
        }
      }

      const organization = getOrganizationFromState(state, 'my_org')
      expect(organization).toEqual(null)
    })

    it('should return found organization', () => {
      const state = {
        main: {
          app: {
            organizations: [{ id: 'some_org' }, { id: 'my_org' }]
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
