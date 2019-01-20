import route from './route'
import OrganizationSettingsPage from './components/OrganizationSettingsPage'
import organizations, { sagas as organizationSagas } from '../../module'
import organizationSettings, {
  sagas as organizationSettingsSagas
} from './module'
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
              reducers: {
                organizations,
                organizationSettings
              },
              sagas: [organizationSagas, organizationSettingsSagas],
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
