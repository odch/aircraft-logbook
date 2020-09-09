import AircraftFlightsPage from './components/AircraftFlightsPage'
import organizations, { sagas as organizationSagas } from '../../../../module'
import aircraft, { sagas as aircraftSagas } from '../../module'
import {
  selectOrganizationOnHistoryChange,
  selectOrganizationOnLoad
} from '../../../../util/selectOrganization'

export default {
  container: AircraftFlightsPage,
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
