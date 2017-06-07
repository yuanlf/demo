import React from 'react'
import ReactDOM from 'react-dom'

import {{componentName}} from 'COMPONENTS/{{componentName}}'

ReactDOM.render( < {{componentName}} / > , document.getElementById('root'))

if (module.hot) {
  module.hot.accept('COMPONENTS/{{componentName}}', () => { 
    ReactDOM.render( < {{componentName}} / > , document.getElementById('root')) 
  });
}