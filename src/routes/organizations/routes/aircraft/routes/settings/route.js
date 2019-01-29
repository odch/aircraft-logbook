import AircraftSettingsPage from './components/AircraftSettingsPage'
import organizations, { sagas as organizationSagas } from '../../../../module'
import {
  selectOrganizationOnHistoryChange,
  selectOrganizationOnLoad
} from '../../../../util/selectOrganization'

export default {
  container: AircraftSettingsPage,
  reducers: {
    organizations
  },
  sagas: [organizationSagas],
  onLoad: selectOrganizationOnLoad,
  historyListeners: {
    selectOrganization: selectOrganizationOnHistoryChange
  }
}
