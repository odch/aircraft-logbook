import AircraftPage from './components/AircraftPage'
import organizations, { sagas as organizationSagas } from '../../module'
import aircraft, { sagas as aircraftSagas } from './module'
import {
  selectOrganizationOnLoad,
  selectOrganizationOnHistoryChange
} from '../../util/selectOrganization'

export default {
  container: AircraftPage,
  reducers: {
    organizations,
    aircraft
  },
  sagas: [organizationSagas, aircraftSagas],
  onLoad: selectOrganizationOnLoad,
  historyListeners: {
    selectOrganization: selectOrganizationOnHistoryChange
  }
}
