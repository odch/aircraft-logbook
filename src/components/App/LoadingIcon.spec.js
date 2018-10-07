import React from 'react'
import renderer from 'react-test-renderer'
import LoadingIcon from './LoadingIcon'

describe('components', () => {
  describe('App', () => {
    describe('LoadingIcon', () => {
      it('renders loading icon', () => {
        const tree = renderer.create(<LoadingIcon />).toJSON()
        expect(tree).toMatchSnapshot()
      })
    })
  })
})
