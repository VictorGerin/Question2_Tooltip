import './App.css'
import Tooltip from './componets/tooltip/tooltip'
import React, { useState } from 'react'

function App() {
  let [showTip1, setShowTip1] = useState(false)
  let [colorTip2, setColorTip2] = useState('red')

  return (
    <>
      <div className="centerItensColumn">
        <p>This is the first and simple example of a tooltip.</p>
        <Tooltip arrow content="This is the first ToolTip :)">
          <div className="holverBtn">
            <span>hover me, please.</span>
          </div>
        </Tooltip>
      </div>
      <div className="centerItensColumn">
        <p>The tip text can be a JFX element.</p>
        <Tooltip
          arrow
          content={
            <span style={{ backgroundColor: '#ccc', color: 'black' }}>
              Ola mundo
            </span>
          }
        >
          <div className="holverBtn">
            <span>hover me, please.</span>
          </div>
        </Tooltip>
      </div>
      <div className="centerItensColumn">
        <p>
          The tip can be in different directions top (default), bottom, right,
          left.
        </p>
        <div className="flexRow">
          <Tooltip arrow direction="left" content="Ola mundo">
            <div className="holverBtn">
              <span>left</span>
            </div>
          </Tooltip>
          <Tooltip arrow direction="top" content="Ola mundo">
            <div className="holverBtn">
              <span>top</span>
            </div>
          </Tooltip>
          <Tooltip arrow direction="bottom" content="Ola mundo">
            <div className="holverBtn">
              <span>bottom</span>
            </div>
          </Tooltip>
          <Tooltip arrow direction="right" content="Ola mundo">
            <div className="holverBtn">
              <span>right</span>
            </div>
          </Tooltip>
        </div>
      </div>
      <div className="centerItensColumn">
        <p>
          The time to open the tip can be changed too, this is the same time to
          close the tip.
          <br />
          400ms is the default time.
          <br />
          Note: the tip will not close if the mouse is over the tip itself.
        </p>
        <div className="flexRow">
          <Tooltip arrow delay={1000} content="Ola mundo">
            <div className="holverBtn">
              <span>1 sec</span>
            </div>
          </Tooltip>
          <Tooltip arrow delay={2000} content="Ola mundo">
            <div className="holverBtn">
              <span>2 sec</span>
            </div>
          </Tooltip>
          <Tooltip arrow delay={3000} content="Ola mundo">
            <div className="holverBtn">
              <span>3 sec</span>
            </div>
          </Tooltip>
          <Tooltip arrow delay={1000 * 60 * 60} content="Ola mundo">
            <div className="holverBtn">
              <span>1 hour</span>
            </div>
          </Tooltip>
        </div>
      </div>
      <div
        style={{ alignSelf: 'flex-start', alignItems: 'flex-start' }}
        className="centerItensColumn"
      >
        <p>
          If the tooltip is overlapped by the screen it will change direction.
          <br />
          This behavior can be disabled.
        </p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
          <Tooltip direction="left" arrow content="Ola mundo">
            <div className="holverBtn">
              <span>This is a left tooltip ?</span>
            </div>
          </Tooltip>
          <Tooltip
            direction="left"
            dissableAutoChangeDirection
            arrow
            content="Ola mundo"
          >
            <div className="holverBtn">
              <span>Disabled auto change direction</span>
            </div>
          </Tooltip>
        </div>
      </div>
      <div className="centerItensColumn">
        <p>The arrow can be removed.</p>
        <div className="flexRow">
          <Tooltip direction="left" arrow content="Ola mundo">
            <div className="holverBtn">
              <span>With arrow</span>
            </div>
          </Tooltip>
          <Tooltip direction="right" content="Ola mundo">
            <div className="holverBtn">
              <span>Without arrow</span>
            </div>
          </Tooltip>
        </div>
      </div>
      <div className="centerItensColumn">
        <p>
          The user interaction with the tip can be disabled.
          <br />
          Note: try to hover the mouse on the tip.
        </p>
        <div className="flexRow">
          <Tooltip arrow content="Ola mundo">
            <div className="holverBtn">
              <span>With interaction</span>
            </div>
          </Tooltip>
          <Tooltip content="Ola mundo" arrow disableInteractive>
            <div className="holverBtn">
              <span>Without interaction</span>
            </div>
          </Tooltip>
        </div>
      </div>
      <div className="centerItensColumn">
        <p>automatic show on MouseEnter function can be disabled.</p>
        <div className="flexRow">
          <Tooltip open={showTip1} dissableAutoShow arrow content="Ola mundo">
            <div className="holverBtn">
              <span>Disable auto show</span>
            </div>
          </Tooltip>
          <button
            onClick={() => {
              setShowTip1(!showTip1)
            }}
          >
            Click me
          </button>
        </div>
      </div>
      <div className="centerItensColumn">
        <p>
          onOpen and onClose can be used for callback the open and close event.
        </p>
        <div className="flexRow">
          <Tooltip
            direction="bottom"
            arrow
            content="Ola mundo"
            onClose={() => {
              setColorTip2('red')
            }}
            onOpen={() => {
              setColorTip2('green')
            }}
          >
            <div className="holverBtn">
              <span>hover me, please.</span>
            </div>
          </Tooltip>
          <span style={{ backgroundColor: colorTip2, width: '60px' }} />
        </div>
      </div>
    </>
  )
}

export default App
