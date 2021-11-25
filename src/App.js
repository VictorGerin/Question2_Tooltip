import './App.css'
import Tooltip from './componets/tooltip/tooltip'
import React from 'react'

function App() {
  let longText = `
Aliquam eget finibus ante, non facilisis lectus. Sed vitae dignissim est, vel aliquam tellus.
Praesent non nunc mollis, fermentum neque at, semper arcu.
Nullam eget est sed sem iaculis gravida eget vitae justo.
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
        content={longText}
        direction="right"
        open
        onOpen={onOpen}
        onClose={onClose}
      >
        <div style={{ backgroundColor: '#ccc', width: 100, height: 100 }}>
          <span style={{ color: 'white' }}>Teste</span>
        </div>
      </Tooltip>
    </div>
  )
}

export default App
