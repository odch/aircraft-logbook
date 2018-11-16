import {
  selectOrganizationOnLoad,
  selectOrganizationOnHistoryChange
} from './selectOrganization'
import { selectOrganization } from '../module'

describe('routes', () => {
  describe('organizations', () => {
    describe('util', () => {
      describe('selectOrganizationOnLoad', () => {
        it('should dispatch selectOrganization', () => {
          const store = { dispatch: jest.fn() }
          const props = {
            router: {
              match: {
                params: {
                  organizationId: 'my_org'
                }
              }
            }
          }

          selectOrganizationOnLoad(store, props)

          expect(store.dispatch).toBeCalledWith(selectOrganization('my_org'))
        })
      })

      describe('selectOrganizationOnHistoryChange', () => {
        it('should dispatch selectOrganization if location matches', () => {
          const paths = [
            '/organizations/mfgt',
            '/organizations/mfgt/',
            '/organizations/mfgt/detail',
            '/organizations/mfgt/detail/',
            '/organizations/mfgt/settings',
            '/organizations/mfgt/settings/'
          ]

          paths.forEach(path => {
            const store = { dispatch: jest.fn() }
            const location = { pathname: path }

            selectOrganizationOnHistoryChange(store, location)

            expect(store.dispatch).toBeCalledWith(selectOrganization('mfgt'))
          })
        })

        it('should not dispatch selectOrganization if location does not match', () => {
          const paths = ['/', '/organizations', '/organizations/', '/foo/bar']

          paths.forEach(path => {
            const store = { dispatch: jest.fn() }
            const location = { pathname: path }

            selectOrganizationOnHistoryChange(store, location)

            expect(store.dispatch).not.toHaveBeenCalled()
          })
        })
      })
    })
  })
})
