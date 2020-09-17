import route from './route'
import OrganizationPage from './components/OrganizationPage'
import organizations, { sagas as organizationSagas } from '../../module'
import {
  selectOrganizationOnHistoryChange,
  selectOrganizationOnLoad
} from '../../util/selectOrganization'
import organizationDetail, { sagas as organizationDetailSagas } from './module'

describe('routes', () => {
  describe('organizations', () => {
    describe('routes', () => {
      describe('detail', () => {
        describe('route', () => {
          it('should export the right things', () => {
            expect(route).toEqual({
              container: OrganizationPage,
              reducers: {
                organizations,
                organizationDetail
              },
              sagas: [organizationSagas, organizationDetailSagas],
              onLoad: selectOrganizationOnLoad,
              historyListeners: {
                selectOrganization: selectOrganizationOnHistoryChange
              }
            })
          })
        })
      })
    })
  })
})
