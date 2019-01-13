import route from './route'
import StartPageContainer from './containers/StartPageContainer'

describe('routes', () => {
  describe('start', () => {
    describe('route', () => {
      it('exports the right things', () => {
        expect(route).toEqual({
          protect: true,
          container: StartPageContainer
        })
      })
    })
  })
})
