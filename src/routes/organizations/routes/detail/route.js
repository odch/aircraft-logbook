import OrganizationPage from './components/OrganizationPage'
import organizations, { sagas } from '../../module'
import {
  selectOrganizationOnLoad,
  selectOrganizationOnHistoryChange
} from '../../util/selectOrganization'

export default {
  container: OrganizationPage,
  reducer: organizations,
  reducerName: 'organizations',
  sagas: [sagas],
  onLoad: selectOrganizationOnLoad,
  historyListeners: {
    selectOrganization: selectOrganizationOnHistoryChange
  }
}
