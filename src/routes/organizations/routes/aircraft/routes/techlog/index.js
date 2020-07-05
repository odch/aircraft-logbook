import { loadRoute } from '../../../../../../util/route'

export default (store, input) =>
  loadRoute('aircraftTechlog', store, input, () => import('./route'))
