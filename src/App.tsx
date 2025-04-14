import { useState, useEffect } from 'react'
import './App.css'

function App() {

  const [recording, setRecording] = useState(false)
  const [timeoutID, setTimeoutID] = useState(0)
  const [height, setHeight] = useState(0)

  useEffect(() => {
    function handleMotion(e: DeviceMotionEvent)
    {
      if (e.acceleration)
      {
        setHeight(e.acceleration.y as any)
      }
    }

    if (recording)
    {
      window.addEventListener("devicemotion", handleMotion)
      setTimeoutID(window.setTimeout(() => {setRecording(false)}, 8000))
    }
    return () => {
      window.removeEventListener("devicemotion", handleMotion)
      if (timeoutID != 0)
      {
        window.clearTimeout(timeoutID)
        setTimeoutID(0)
      }
    }
  }, [recording])

  function handleToggle()
  {
    if (!recording)
    {
      if (typeof DeviceMotionEvent !== 'undefined' && typeof (DeviceMotionEvent as any).requestPermission === 'function')
      {
        (DeviceMotionEvent as any).requestPermission().then((result: PermissionState) => {
          if (result === "granted")
          {
            setRecording(true)
          }
        })
      } else {
        setRecording(true)
      }
    } else {
      setRecording(false)
    }
  }

  return <div id='App'>
    <h6 id='title'>Phone Flipper</h6>
    <p>{height}</p>
    <button id='record' onClick={handleToggle}>
      {recording ? "Stop" : "Begin"}
    </button>
  </div>
}

export default App