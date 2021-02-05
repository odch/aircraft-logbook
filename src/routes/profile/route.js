import ProfilePage from './components/ProfilePage'
import { sagas as profileSagas } from './module'

export default {
  container: ProfilePage,
  sagas: [profileSagas]
}
