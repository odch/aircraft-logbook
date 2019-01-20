import OrganizationSettingsPage from './components/OrganizationSettingsPage'
import organizations, { sagas as organizationSagas } from '../../module'
import organizationSettings, {
  sagas as organizationSettingsSagas
} from './module'
import {
  selectOrganizationOnHistoryChange,
  selectOrganizationOnLoad
} from '../../util/selectOrganization'

export default {
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
}
