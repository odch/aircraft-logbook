import { loadRoute } from '../../../../util/route'

export default (store, input) =>
  loadRoute('aircraft', store, input, () => import('./route'))
