import { loadRoute } from '../../util/route'

export default (store, input) =>
  loadRoute('login', store, input, () => import('./route'))
