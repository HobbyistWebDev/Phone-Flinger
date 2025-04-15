import { useState, useEffect, useRef } from 'react'
import './App.css'

function isBetween(num: number, min: number, max: number)
{
  if (min <= num && num <= max)
  {
    return true
  }
  return false
}

function App() {

  const [recording, setRecording] = useState(false)
  const [timeoutID, setTimeoutID] = useState(0)
  const [height, setHeight] = useState(0)
  const timingRef = useRef<number | null>(null)
  const [hasRecordedInitialTime, setHasRecordedInitialTime] = useState(false)

  useEffect(() => {
    function handleMotion(e: DeviceMotionEvent)
    {
      if (e.accelerationIncludingGravity)
      {
        const gForce = Math.sqrt(e.accelerationIncludingGravity.x! ** 2 + e.accelerationIncludingGravity.y! ** 2 + e.accelerationIncludingGravity.z! ** 2) / 9.81
        if (!hasRecordedInitialTime && isBetween(gForce, -0.3, 0.3))
        {
          timingRef.current = performance.now()
          setHasRecordedInitialTime(true)
        }
        if (hasRecordedInitialTime && !isBetween(gForce, -0.3, 0.3))
        {
          setHeight((performance.now() - (timingRef as any).current) / 1000)
          setHasRecordedInitialTime(false)
          setRecording(false)
        }
      }
    }

    if (recording)
    {
      window.addEventListener("devicemotion", handleMotion)
      setTimeoutID(window.setTimeout(() => {
        setRecording(false)
        setHasRecordedInitialTime(false)
        alert("Error: Did Not Throw!")
      }, 8000))
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
      setHasRecordedInitialTime(false)
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