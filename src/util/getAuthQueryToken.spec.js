import getAuthQueryToken from './getAuthQueryToken'

describe('util', () => {
  describe('getAuthQueryToken', () => {
    it('should return null if no token in state or search params', () => {
      const location = {}
      expect(getAuthQueryToken(location)).toEqual(null)
    })

    it('should return token from location state', () => {
      const location = {
        state: {
          queryToken: {
            token: '4ab43049-64ac-435e-92c7-23daa066d4a5',
            orgId: 'mfgt'
          }
        }
      }
      expect(getAuthQueryToken(location)).toEqual({
        token: '4ab43049-64ac-435e-92c7-23daa066d4a5',
        orgId: 'mfgt'
      })
    })

    it('should return token from search params if not in state', () => {
      const location = {
        search: '?t=mfgt-4ab43049-64ac-435e-92c7-23daa066d4a5'
      }
      expect(getAuthQueryToken(location)).toEqual({
        token: '4ab43049-64ac-435e-92c7-23daa066d4a5',
        orgId: 'mfgt'
      })
    })

    it('should return null if search param not valid', () => {
      const location = {
        search: '?t=mfgt-asdf'
      }
      expect(getAuthQueryToken(location)).toEqual(null)
    })
  })
})
