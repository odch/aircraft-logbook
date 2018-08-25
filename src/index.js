import React from 'react'
import ReactDOM from 'react-dom'
import Title from './components/Title'

const title = 'Minimal React Webpack Babel Setup'

ReactDOM.render(<Title text={title} />, document.getElementById('app'))

module.hot.accept()
