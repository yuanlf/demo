import React from 'react'
import ReactDOM from 'react-dom'

import Test from 'COMPONENTS/Test'

ReactDOM.render( < Test / > , document.getElementById('root'))

if (module.hot) {
  module.hot.accept('COMPONENTS/Test', () => { 
    ReactDOM.render( < Test / > , document.getElementById('root')) 
  });
}