jest.mock('../components/OrganizationsList')

import React from 'react'
import renderer from 'react-test-renderer'
import { Provider } from 'react-redux'
import configureStore from 'redux-mock-store'
import OrganizationsList from '../components/OrganizationsList'
import OrganizationsListContainer from './OrganizationsListContainer'

describe('containers', () => {
  describe('OrganizationsListContainer', () => {
    let wrapper
    let component

    beforeEach(() => {
      jest.resetAllMocks()

      const state = {
        firebase: {},
        main: {
          app: {}
        },
        organizations: {
          createDialogOpen: false
        }
      }
      const store = configureStore()(state)

      wrapper = renderer.create(
        <Provider store={store}>
          <OrganizationsListContainer />
        </Provider>
      )

      component = wrapper.root.find(el => el.type === OrganizationsList)
    })

    it('should render the component ', () => {
      expect(component).toBeTruthy()
    })

    it('should map state to props', () => {
      const expectedPropKeys = ['organizations', 'createDialog']

      expect(Object.keys(component.props)).toEqual(
        expect.arrayContaining(expectedPropKeys)
      )
    })

    it('should map dispatch to props', () => {
      const expectedPropKeys = [
        'openCreateOrganizationDialog',
        'closeCreateOrganizationDialog',
        'updateCreateOrganizationDialogData',
        'createOrganization'
      ]

      expect(Object.keys(component.props)).toEqual(
        expect.arrayContaining(expectedPropKeys)
      )
    })
  })
})
