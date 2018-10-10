import React from 'react'
import renderer from 'react-test-renderer'
import renderIntl from '../../testutil/renderIntl'
import Header from './Header'

describe('components', () => {
  describe('Header', () => {
    it('renders user button if logged in', () => {
      const auth = {
        isEmpty: false,
        email: 'test@example.com'
      }
      const tree = renderIntl(<Header auth={auth} logout={() => {}} />).toJSON()
      expect(tree).toMatchSnapshot()
    })

    it('does not render user button if not logged in', () => {
      const auth = {
        isEmpty: true
      }
      const tree = renderer
        .create(<Header auth={auth} logout={() => {}} />)
        .toJSON()
      expect(tree).toMatchSnapshot()
    })
  })
})
