import './App.css'
import Tooltip from './componets/tooltip/tooltip'
import React from 'react'

function App() {
  let longText = `
  Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla placerat, lorem nec fermentum placerat, elit libero eleifend turpis, mollis placerat nisl diam ut diam. Maecenas et pretium nunc. Cras molestie lorem mi, sollicitudin auctor ipsum posuere id. Nam blandit tellus in ligula efficitur condimentum. Maecenas tellus lorem, varius eu quam at, rhoncus faucibus sapien. Morbi dapibus a sem ac euismod. Nullam risus justo, ultricies nec rutrum a, fermentum in justo. Aliquam in erat a nibh volutpat condimentum.
  `
  // longText = `teste`;

  let onOpen = () => {
    console.log('tooltip has been opened')
  }
  let onClose = () => {
    console.log('tooltip has been closed')
  }

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'row-reverse',
        alignItems: 'center',
        width: 1024,
        height: 768,
      }}
    >
      <Tooltip
        arrow
        content={longText}
        direction="right"
        onOpen={onOpen}
        onClose={onClose}
      >
        <div style={{ backgroundColor: '#444', width: 100, height: 100 }}>
          <span style={{ color: 'white' }}>Teste</span>
        </div>
      </Tooltip>
    </div>
  )
}

export default App
