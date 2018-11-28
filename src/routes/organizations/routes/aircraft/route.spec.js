import route from './route'
import AircraftPage from './components/AircraftPage'
import organizations, { sagas as organizationSagas } from '../../module'
import { sagas as aircraftSagas } from './module'
import {
  selectOrganizationOnHistoryChange,
  selectOrganizationOnLoad
} from '../../util/selectOrganization'

describe('routes', () => {
  describe('organizations', () => {
    describe('routes', () => {
      describe('aircraft', () => {
        describe('route', () => {
          it('should export the right things', () => {
            expect(route).toEqual({
              container: AircraftPage,
              reducer: organizations,
              reducerName: 'organizations',
              sagas: [organizationSagas, aircraftSagas],
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
