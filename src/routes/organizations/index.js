import { loadRoute } from '../../util/route'

export default (store, input) =>
  loadRoute('organizations', store, input, () => import('./route'))
