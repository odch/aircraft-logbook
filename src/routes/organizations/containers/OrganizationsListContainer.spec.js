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
    let container

    beforeEach(() => {
      jest.resetAllMocks()

      const state = {
        firebase: {},
        firestore: {
          ordered: {}
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

      container = wrapper.root.find(
        el => el.type === OrganizationsListContainer
      )
      component = container.find(el => el.type === OrganizationsList)
    })

    it('should render both the container and the component ', () => {
      expect(container).toBeTruthy()
      expect(component).toBeTruthy()
    })

    it('should map state to props', () => {
      const expectedPropKeys = [
        'organizations',
        'createDialogOpen',
        'createDialogData'
      ]

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
