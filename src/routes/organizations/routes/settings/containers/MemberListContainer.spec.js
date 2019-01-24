jest.mock('../components/MemberList')

import React from 'react'
import renderer from 'react-test-renderer'
import { Provider } from 'react-redux'
import configureStore from 'redux-mock-store'
import MemberList from '../components/MemberList'
import MemberListContainer from './MemberListContainer'

describe('routes', () => {
  describe('organizations', () => {
    describe('routes', () => {
      describe('settings', () => {
        describe('containers', () => {
          describe('MemberListContainer', () => {
            let wrapper
            let component
            let container

            beforeEach(() => {
              jest.resetAllMocks()

              const state = {
                firestore: {
                  ordered: {
                    organizationMembers: []
                  }
                },
                organizationSettings: {
                  members: {
                    page: 0
                  }
                }
              }
              const store = configureStore()(state)

              const props = {
                organizationId: 'my_org'
              }

              wrapper = renderer.create(
                <Provider store={store}>
                  <MemberListContainer {...props} />
                </Provider>
              )

              container = wrapper.root.find(
                el => el.type === MemberListContainer
              )
              component = container.find(el => el.type === MemberList)
            })

            it('should render both the container and the component ', () => {
              expect(container).toBeTruthy()
              expect(component).toBeTruthy()
            })

            it('should map state to props', () => {
              const expectedPropKeys = [
                'organizationId',
                'members',
                'pagination'
              ]

              expect(Object.keys(component.props)).toEqual(
                expect.arrayContaining(expectedPropKeys)
              )
            })

            it('should map dispatch to props', () => {
              const expectedPropKeys = ['fetchMembers', 'setMembersPage']

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
