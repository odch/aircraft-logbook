import LoginPageContainer from './containers/LoginPageContainer'
import sagas from './module/sagas'
import login from './module'

export default {
  container: LoginPageContainer,
  reducer: login,
  reducerName: 'login',
  sagas: [sagas]
}
