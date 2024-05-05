import './App.css'
import { useState } from 'react'

function App() {
  const [testClassNameActive, setTestClassNameActive] = useState(false)

  return (
    <>
      <div className={`test ${testClassNameActive ? 'testActive' : ''}`} onClick={() => setTestClassNameActive(!testClassNameActive)}>suh</div>
    </>
  )
}

export default App
