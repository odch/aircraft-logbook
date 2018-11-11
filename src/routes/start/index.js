import { loadRoute } from '../../util/route'

export default (store, input) =>
  loadRoute('start', store, input, () => import('./route'))
