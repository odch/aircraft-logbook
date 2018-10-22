import React from 'react'
import { BrowserRouter as Router } from 'react-router-dom'
import AccountMenu from './AccountMenu'
import { renderIntlMaterial } from '../../testutil/renderIntl'

describe('components', () => {
  describe('AccountMenu', () => {
    it('does not render if not open', () => {
      const tree = renderIntlMaterial(
        <AccountMenu open={false} logout={() => {}} onClose={() => {}} />
      ).html()
      expect(tree).toMatchSnapshot()
    })

    it('renders without organization if no one is given', () => {
      const tree = renderIntlMaterial(
        <Router>
          <AccountMenu open logout={() => {}} onClose={() => {}} />
        </Router>
      ).html()
      expect(tree).toMatchSnapshot()
    })

    it('renders with organization if one is given', () => {
      const tree = renderIntlMaterial(
        <Router>
          <AccountMenu
            open
            organization={{
              id: 'my_org'
            }}
            logout={() => {}}
            onClose={() => {}}
          />
        </Router>
      ).html()
      expect(tree).toMatchSnapshot()
    })
  })
})
