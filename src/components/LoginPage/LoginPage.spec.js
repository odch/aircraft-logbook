import React from 'react'
import ShallowRenderer from 'react-test-renderer/shallow'
import LoginPage from './LoginPage'

describe('components', () => {
  describe('LoginPage', () => {
    it('redirects to start page if authenticated', () => {
      const auth = {
        isEmpty: false
      }
      const tree = new ShallowRenderer().render(<LoginPage auth={auth} />)
      expect(tree).toMatchSnapshot()
    })

    it('renders login form if not authenticated', () => {
      const auth = {
        isEmpty: true
      }
      const tree = new ShallowRenderer().render(<LoginPage auth={auth} />)
      expect(tree).toMatchSnapshot()
    })
  })
})
