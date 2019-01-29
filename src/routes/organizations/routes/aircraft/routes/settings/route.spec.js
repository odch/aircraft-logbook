import route from './route'
import AircraftSettingsPage from './components/AircraftSettingsPage'
import organizations, { sagas as organizationSagas } from '../../../../module'
import {
  selectOrganizationOnHistoryChange,
  selectOrganizationOnLoad
} from '../../../../util/selectOrganization'

describe('routes', () => {
  describe('organizations', () => {
    describe('routes', () => {
      describe('aircraft', () => {
        describe('routes', () => {
          describe('settings', () => {
            describe('route', () => {
              it('should export the right things', () => {
                expect(route).toEqual({
                  container: AircraftSettingsPage,
                  reducers: {
                    organizations
                  },
                  sagas: [organizationSagas],
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
  })
})
