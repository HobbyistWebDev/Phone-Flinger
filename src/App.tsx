import { useState, useEffect, useRef } from 'react'
import {ProgressBar} from './ProgressBar'
import './App.css'

function App() {

  const [recording, setRecording] = useState(false)
  const timeoutID = useRef<number>(0)
  const timeIntervalID = useRef<number>(0)
  const [height, setHeight] = useState(0)
  const timingRef = useRef<number | null>(null)
  const isFallingRef = useRef<boolean>(false)
  const [progressBarValue, setProgressBarValue] = useState(0)
  const timerValue = useRef<number>(0)
  const timerDuration: number = 8000
  const [textValue, setTextValue] = useState<number>(8)
  const [highscore, setHighscore] = useState<number>(0)

  function stopRecording()
  {
    isFallingRef.current = false
    setRecording(false)
    timingRef.current = null
  }

  function startRecording()
  {
    setProgressBarValue(0)
    setTextValue(8)
    setRecording(true)
  }

  useEffect(() => {

    if (localStorage.getItem("highscore"))
    {
      setHighscore(Number(localStorage.getItem("highscore")))
    }

    function handleMotion(e: DeviceMotionEvent)
    {
      if (e.accelerationIncludingGravity)
      {
        const gForce = Math.sqrt(e.accelerationIncludingGravity.x! ** 2 + e.accelerationIncludingGravity.y! ** 2 + e.accelerationIncludingGravity.z! ** 2) / 9.81
        if (!isFallingRef.current && gForce < 0.1)
        {
          timingRef.current = performance.now()
          isFallingRef.current = true
        }
        if (isFallingRef.current && gForce > 1.5)
        {
          const calculatedHeight = (0.5 * 32.174 * ((performance.now() - (timingRef as any).current) / 2000) ** 2)
          setHeight(calculatedHeight)
          stopRecording()
          if (calculatedHeight > Number(localStorage.getItem("highscore")))
          {
            localStorage.setItem("highscore", calculatedHeight.toString())
            setHighscore(Number(localStorage.getItem("highscore")))
          }
        }
      }
    }

    if (recording)
    {
      window.addEventListener("devicemotion", handleMotion)
      timeoutID.current = window.setTimeout(() => {
        stopRecording()
      }, timerDuration)

      timeIntervalID.current = window.setInterval(() => {
        timerValue.current += 50
        setProgressBarValue(timerValue.current / timerDuration)
        setTextValue((timerDuration - timerValue.current) / 1000)
      }, 50)

    }
    return () => {
      window.removeEventListener("devicemotion", handleMotion)
      if (timeoutID.current != 0 && timeIntervalID.current != 0)
      {
        window.clearTimeout(timeoutID.current)
        timeoutID.current = 0
        
        window.clearInterval(timeIntervalID.current)
        timeIntervalID.current = 0

        timerValue.current = 0
        setTextValue(0)
        setProgressBarValue(1)
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
            startRecording()
          }
        })
      } else {
        startRecording()
      }
    } else {
      stopRecording()
    }
  }

  return <div id='App'>
    <h6 id='title'>Phone Flipper</h6>
    <ProgressBar value={progressBarValue} size={200} width={15} text={textValue.toFixed(2) + "s"}/>
    <h6 id="height">{height.toFixed(2) + " ft"}</h6>
    <p id="highscore">{"HIGHSCORE: " + highscore.toFixed(2) + " ft"}</p>
    <button id='record' onClick={handleToggle}>
      {recording ? "STOP" : "BEGIN"}
    </button>
  </div>
}

export default App