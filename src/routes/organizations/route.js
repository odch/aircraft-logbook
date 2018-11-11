import OrganizationsPage from './components/OrganizationsPage'
import sagas from './module/sagas'
import organizations from './module'

export default {
  container: OrganizationsPage,
  reducer: organizations,
  reducerName: 'organizations',
  sagas: [sagas]
}
