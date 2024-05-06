import './App.css'
import { useState } from 'react'

function App() {
  const [circlizedActive, setCirclizedActive] = useState(false)

  return (
    <>
      <div className={`test-wrapper ${circlizedActive ? 'test-wrapper-altered' : ''}`} onClick={() => setCirclizedActive(!circlizedActive)}>
        <div className={`test-child ${circlizedActive ? 'test-child-altered' : ''}`}>5:00</div>
      </div>
    </>
  )
}

export default App
