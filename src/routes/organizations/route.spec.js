import route from './route'
import OrganizationsPage from './components/OrganizationsPage'
import organizations, { sagas } from './module'

describe('routes', () => {
  describe('organizations', () => {
    describe('route', () => {
      it('should export the right things', () => {
        expect(route).toEqual({
          container: OrganizationsPage,
          reducer: organizations,
          reducerName: 'organizations',
          sagas: [sagas]
        })
      })
    })
  })
})
