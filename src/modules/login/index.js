import {
  setUsername,
  setPassword,
  login,
  setSubmitted,
  logout
} from './actions'
import reducer from './reducer'
import sagas from './sagas'

export { setUsername, setPassword, login, setSubmitted, logout }

export { sagas }

export default reducer
