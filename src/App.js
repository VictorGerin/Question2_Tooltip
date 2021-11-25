import logo from './logo.svg';
import './App.css';
import Tooltip from "./componets/tooltip/tooltip";
import React, { useState, useEffect } from "react";


function App() {

  
  const [active, setActive]  = useState(false);

  useEffect(() => {
    setTimeout(() => {
      setActive(true);
    }, 0)
  }, [])
  
let longText = `
Aliquam eget finibus ante, non facilisis lectus. Sed vitae dignissim est, vel aliquam tellus.
Praesent non nunc mollis, fermentum neque at, semper arcu.
Nullam eget est sed sem iaculis gravida eget vitae justo.
`;
// longText = `teste`;

  let onOpen = () => {
    console.log('tooltip has been opened');
  }
  let onClose = () => {
    console.log('tooltip has been closed');
  }

  return (
    <div style={{display: 'flex', flexDirection: 'row-reverse' , alignItems: 'center', width:1024, height:768}}>
      <Tooltip content='Ola mundo' direction='right' width={70} open onClose={onClose}>
        <div style={{backgroundColor:'#ccc', width:100, height:100}}>
          <span style={{color:'white'}}>Teste</span>
        </div>
      </Tooltip>
    </div>
    // <div className="App">
    // <header className="App-header">
    //     <Tooltip content={longText} width={300} onOpen={onOpen} onClose={onClose} open={active} direction='top'>
    //       <img src={logo} className="App-logo" alt="logo" />
    //     </Tooltip>
    //     <p>
    //       Edit <code>src/App.js</code> and save to reload.
    //     </p>
    //     <a
    //       className="App-link"
    //       href="https://reactjs.org"
    //       target="_blank"
    //       rel="noopener noreferrer"
    //     >
    //       Learn React
    //     </a>
    //   </header>
    // </div>
  );
}

export default App;
