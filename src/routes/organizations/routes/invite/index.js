import { loadRoute } from '../../../../util/route'

export default (store, input) =>
  loadRoute('organizationInvite', store, input, () => import('./route'))
