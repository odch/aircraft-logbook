import OrganizationSettingsPage from './components/OrganizationSettingsPage'
import organizations, { sagas } from '../../module'
import {
  selectOrganizationOnHistoryChange,
  selectOrganizationOnLoad
} from '../../util/selectOrganization'

export default {
  container: OrganizationSettingsPage,
  reducer: organizations,
  sagas: [sagas],
  onLoad: selectOrganizationOnLoad,
  historyListeners: {
    selectOrganization: selectOrganizationOnHistoryChange
  }
}
