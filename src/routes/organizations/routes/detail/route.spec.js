import route from './route'
import OrganizationPage from './components/OrganizationPage'
import organizations, { sagas } from '../../module'
import {
  selectOrganizationOnHistoryChange,
  selectOrganizationOnLoad
} from '../../util/selectOrganization'

describe('routes', () => {
  describe('organizations', () => {
    describe('routes', () => {
      describe('detail', () => {
        describe('route', () => {
          it('should export the right things', () => {
            expect(route).toEqual({
              container: OrganizationPage,
              reducer: organizations,
              sagas: [sagas],
              onLoad: selectOrganizationOnLoad,
              historyListeners: {
                selectOrganization: selectOrganizationOnHistoryChange
              }
            })
          })
        })
      })
    })
  })
})
