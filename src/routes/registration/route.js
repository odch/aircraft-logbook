import RegistrationPageContainer from './containers/RegistrationPageContainer'
import sagas from './module/sagas'
import registration from './module'

export default {
  container: RegistrationPageContainer,
  reducer: registration,
  reducerName: 'registration',
  sagas: [sagas]
}
