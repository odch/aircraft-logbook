jest.mock('../components/StartPage')

import React from 'react'
import renderer from 'react-test-renderer'
import { Provider } from 'react-redux'
import configureStore from 'redux-mock-store'
import StartPage from '../components/StartPage'
import StartPageContainer from './StartPageContainer'

const renderWithState = state => {
  const store = configureStore()(state)

  return renderer.create(
    <Provider store={store}>
      <StartPageContainer />
    </Provider>
  )
}

describe('routes', () => {
  describe('start', () => {
    describe('containers', () => {
      describe('StartPageContainer', () => {
        let wrapper
        let component
        let container

        beforeEach(() => {
          jest.resetAllMocks()

          wrapper = renderWithState({
            firebase: {
              auth: {},
              profile: {
                selectedOrganization: 'my_org'
              }
            },
            main: {
              app: {
                organizations: [{ id: 'my_org' }]
              }
            }
          })

          container = wrapper.root.find(el => el.type === StartPageContainer)
          component = container.find(el => el.type === StartPage)
        })

        it('should render both the container and the component ', () => {
          expect(container).toBeTruthy()
          expect(component).toBeTruthy()
        })

        it('should map state and own props to props', () => {
          const expectedPropKeys = ['selectedOrganization']

          expect(Object.keys(component.props)).toEqual(
            expect.arrayContaining(expectedPropKeys)
          )
        })

        it('should map dispatch to props', () => {
          const expectedPropKeys = []

          expect(Object.keys(component.props)).toEqual(
            expect.arrayContaining(expectedPropKeys)
          )
        })

        it('should return undefined for selectedOrganization if profile not loaded', () => {
          wrapper = renderWithState({
            firebase: {
              auth: {},
              profile: {
                isLoaded: false
              }
            }
          })

          container = wrapper.root.find(el => el.type === StartPageContainer)
          component = container.find(el => el.type === StartPage)
          expect(component.props.selectedOrganization).toEqual(undefined)
        })

        it('should return undefined for selectedOrganization if organizations are not loaded', () => {
          wrapper = renderWithState({
            firebase: {
              auth: {},
              profile: {
                isLoaded: true,
                selectedOrganization: 'my_org'
              }
            },
            main: {
              app: {
                // organizations not yet set
              }
            }
          })

          container = wrapper.root.find(el => el.type === StartPageContainer)
          component = container.find(el => el.type === StartPage)
          expect(component.props.selectedOrganization).toEqual(undefined)
        })

        it('should return null for selectedOrganization if organization not found', () => {
          wrapper = renderWithState({
            firebase: {
              auth: {},
              profile: {
                isLoaded: true,
                selectedOrganization: 'my_org'
              }
            },
            main: {
              app: {
                organizations: [{ id: 'some_other_org' }]
              }
            }
          })

          container = wrapper.root.find(el => el.type === StartPageContainer)
          component = container.find(el => el.type === StartPage)
          expect(component.props.selectedOrganization).toEqual(null)
        })

        it('should return selectedOrganization if found', () => {
          const myOrg = { id: 'my_org' }

          wrapper = renderWithState({
            firebase: {
              auth: {},
              profile: {
                isLoaded: true,
                selectedOrganization: 'my_org'
              }
            },
            main: {
              app: {
                organizations: [myOrg]
              }
            }
          })

          container = wrapper.root.find(el => el.type === StartPageContainer)
          component = container.find(el => el.type === StartPage)
          expect(component.props.selectedOrganization).toEqual(myOrg)
        })
      })
    })
  })
})
