import { loadRoute } from '../../../../../../util/route'

export default (store, input) =>
  loadRoute('aircraftFlights', store, input, () => import('./route'))
