import OrganizationPage from './components/OrganizationPage'
import organizations, { sagas as organizationSagas } from '../../module'
import organizationDetail, { sagas as organizationDetailSagas } from './module'
import {
  selectOrganizationOnLoad,
  selectOrganizationOnHistoryChange
} from '../../util/selectOrganization'

export default {
  container: OrganizationPage,
  reducers: {
    organizations,
    organizationDetail
  },
  sagas: [organizationSagas, organizationDetailSagas],
  onLoad: selectOrganizationOnLoad,
  historyListeners: {
    selectOrganization: selectOrganizationOnHistoryChange
  }
}
