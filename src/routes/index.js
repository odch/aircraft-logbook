import start from './start'
import organizations from './organizations'
import detail from './organizations/routes/detail'
import settings from './organizations/routes/settings'
import invite from './organizations/routes/invite'
import aircraft from './organizations/routes/aircraft'
import aircraftFlights from './organizations/routes/aircraft/routes/flights'
import aircraftSettings from './organizations/routes/aircraft/routes/settings'
import login from './login'
import registration from './registration'

export const createRoutes = store => [
  {
    path: '/',
    exact: true,
    render: start(store),
    protected: true
  },
  {
    path: '/organizations',
    exact: true,
    render: organizations(store),
    protected: true
  },
  {
    path: '/organizations/:organizationId',
    exact: true,
    render: detail(store),
    protected: true
  },
  {
    path: '/organizations/:organizationId/settings',
    exact: true,
    render: settings(store),
    protected: true
  },
  {
    path: '/organizations/:organizationId/invite/:inviteId',
    exact: true,
    render: invite(store),
    protected: false
  },
  {
    path: '/organizations/:organizationId/aircrafts/:aircraftId',
    exact: true,
    render: aircraft(store),
    protected: true
  },
  {
    path: '/organizations/:organizationId/aircrafts/:aircraftId/flights',
    exact: true,
    render: aircraftFlights(store),
    protected: true
  },
  {
    path: '/organizations/:organizationId/aircrafts/:aircraftId/settings',
    exact: true,
    render: aircraftSettings(store),
    protected: true
  },
  {
    path: '/login',
    exact: true,
    render: login(store)
  },
  {
    path: '/register',
    exact: true,
    render: registration(store)
  }
]

export default createRoutes
