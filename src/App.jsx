import './App.css'

import Stopwatch from './components/stopwatch/Stopwatch'
import Timer from './components/timer/Timer'

function App() {

  return (
    <div className="app">
      <Stopwatch />
      <Timer />
      {/* <div className="test">{window.innerHeight} - { window.outerHeight}</div>
      <div className="test height" style={{height: window.innerHeight - window.outerHeight}}></div> */}
    </div>
  )
}

export default App