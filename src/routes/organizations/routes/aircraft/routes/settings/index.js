import { loadRoute } from '../../../../../../util/route'

export default (store, input) =>
  loadRoute('aircraftSettings', store, input, () => import('./route'))
