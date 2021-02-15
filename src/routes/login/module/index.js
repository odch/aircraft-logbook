import {
  setUsername,
  setPassword,
  login,
  setSubmitted,
  loginGoogle,
  loginWithToken
} from './actions'
import reducer from './reducer'
import sagas from './sagas'

export {
  setUsername,
  setPassword,
  login,
  setSubmitted,
  loginGoogle,
  loginWithToken
}

export { sagas }

export default reducer
