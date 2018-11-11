import { loadRoute } from '../../util/route'

export default (store, input) =>
  loadRoute('registration', store, input, () => import('./route'))
