import route from './route'
import OrganizationSettingsPage from './components/OrganizationSettingsPage'
import organizations, { sagas } from '../../module'
import {
  selectOrganizationOnHistoryChange,
  selectOrganizationOnLoad
} from '../../util/selectOrganization'

describe('routes', () => {
  describe('organizations', () => {
    describe('routes', () => {
      describe('settings', () => {
        describe('route', () => {
          it('should export the right things', () => {
            expect(route).toEqual({
              container: OrganizationSettingsPage,
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
