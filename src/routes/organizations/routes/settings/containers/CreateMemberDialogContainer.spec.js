jest.mock('../components/CreateMemberDialog')

import React from 'react'
import renderIntl from '../../../../../testutil/renderIntl'
import { Provider } from 'react-redux'
import configureStore from 'redux-mock-store'
import CreateMemberDialog from '../components/CreateMemberDialog'
import CreateMemberDialogContainer from './CreateMemberDialogContainer'

describe('routes', () => {
  describe('organizations', () => {
    describe('routes', () => {
      describe('settings', () => {
        describe('containers', () => {
          describe('CreateMemberDialogContainer', () => {
            let wrapper
            let component
            let container

            beforeEach(() => {
              jest.resetAllMocks()

              const state = {
                organizationSettings: {
                  createMemberDialog: {
                    data: {
                      firstname: 'Max',
                      lastname: 'Muster'
                    },
                    submitting: false
                  }
                }
              }
              const store = configureStore()(state)

              const props = {
                organizationId: 'my_org'
              }

              wrapper = renderIntl(
                <Provider store={store}>
                  <CreateMemberDialogContainer {...props} />
                </Provider>
              )

              container = wrapper.root.find(
                el => el.type === CreateMemberDialogContainer
              )
              component = container.find(el => el.type === CreateMemberDialog)
            })

            it('should render both the container and the component ', () => {
              expect(container).toBeTruthy()
              expect(component).toBeTruthy()
            })

            it('should map state to props', () => {
              const expectedPropKeys = ['organizationId', 'data', 'submitting']

              expect(Object.keys(component.props)).toEqual(
                expect.arrayContaining(expectedPropKeys)
              )
            })

            it('should map dispatch to props', () => {
              const expectedPropKeys = ['onClose', 'updateData', 'onSubmit']

              expect(Object.keys(component.props)).toEqual(
                expect.arrayContaining(expectedPropKeys)
              )
            })
          })
        })
      })
    })
  })
})
