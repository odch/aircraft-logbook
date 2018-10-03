import React from 'react'
import renderer from 'react-test-renderer'
import renderIntl from '../../testutil/renderIntl'
import Header from './Header'

describe('components', () => {
  describe('Header', () => {
    it('renders auth info if logged in', () => {
      const auth = {
        isEmpty: false,
        email: 'test@example.com'
      }
      const tree = renderIntl(<Header auth={auth} logout={() => {}} />).toJSON()
      expect(tree).toMatchSnapshot()
    })

    it('does not render if not logged in', () => {
      const auth = {
        isEmpty: true
      }
      const tree = renderer
        .create(<Header auth={auth} logout={() => {}} />)
        .toJSON()
      expect(tree).toMatchSnapshot()
    })

    it('calls logout function', () => {
      const auth = {
        isEmpty: false,
        email: 'test@example.com'
      }

      const logout = jest.fn()

      const component = renderIntl(<Header auth={auth} logout={logout} />)

      const logoutButton = component.root.find(el => el.type === 'button')
      logoutButton.props.onClick()
      expect(logout).toHaveBeenCalled()
    })
  })
})
