import AircraftPage from './components/AircraftPage'
import organizations, { sagas as organizationSagas } from '../../module'
import { sagas as aircraftSagas } from './module'
import {
  selectOrganizationOnLoad,
  selectOrganizationOnHistoryChange
} from '../../util/selectOrganization'

export default {
  container: AircraftPage,
  reducer: organizations,
  reducerName: 'organizations',
  sagas: [organizationSagas, aircraftSagas],
  onLoad: selectOrganizationOnLoad,
  historyListeners: {
    selectOrganization: selectOrganizationOnHistoryChange
  }
}
