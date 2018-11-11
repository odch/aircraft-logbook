import { loadRoute } from '../../../../util/route'

export default (store, input) =>
  loadRoute('organizationDetail', store, input, () => import('./route'))
