import AircraftSettingsPage from './components/AircraftSettingsPage'
import organizations, { sagas as organizationSagas } from '../../../../module'
import aircraftSettings, { sagas as aircraftSettingsSagas } from './module'
import {
  selectOrganizationOnHistoryChange,
  selectOrganizationOnLoad
} from '../../../../util/selectOrganization'

export default {
  container: AircraftSettingsPage,
  reducers: {
    organizations,
    aircraftSettings
  },
  sagas: [organizationSagas, aircraftSettingsSagas],
  onLoad: selectOrganizationOnLoad,
  historyListeners: {
    selectOrganization: selectOrganizationOnHistoryChange
  }
}
