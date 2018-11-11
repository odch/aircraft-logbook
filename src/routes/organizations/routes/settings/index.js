import { loadRoute } from '../../../../util/route'

export default (store, input) =>
  loadRoute('organizationSettings', store, input, () => import('./route'))
