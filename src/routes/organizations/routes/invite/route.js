import InvitePage from './components/InvitePage'
import invite, { sagas as inviteSagas } from './module'
import login, { sagas as loginSagas } from '../../../login/module'

export default {
  container: InvitePage,
  reducers: {
    invite,
    login
  },
  sagas: [inviteSagas, loginSagas]
}
