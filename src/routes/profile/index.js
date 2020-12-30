import { loadRoute } from '../../util/route'

export default (store, input) =>
  loadRoute('profile', store, input, () => import('./route'))
