import route from './route'
import ProfilePage from './components/ProfilePage'
import { sagas as profileSagas } from './module'

describe('routes', () => {
  describe('profile', () => {
    it('should export the right things', () => {
      expect(route).toEqual({
        container: ProfilePage,
        sagas: [profileSagas]
      })
    })
  })
})
