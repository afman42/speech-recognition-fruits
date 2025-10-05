import type { typeDataFruits } from "../dataFruits"
import React, { useState, ReactElement, useRef, useEffect } from "react"
import SpeechRecognition, {
  useSpeechRecognition,
} from "react-speech-recognition"

function PlayGameFruits(props: {
  dataFruits: typeDataFruits[]
  setDataF: React.Dispatch<React.SetStateAction<typeDataFruits[]>>
}): ReactElement {
  const [message, setMessage] = useState<string>("")
  const [seIndex, setSeIndex] = useState<number | null>(null)
  const resetTimeoutRef = useRef<number | null>(null)

  useEffect(() => {
    return () => {
      if (resetTimeoutRef.current !== null) {
        window.clearTimeout(resetTimeoutRef.current)
      }
    }
  }, [])

  const startListening = () =>
    SpeechRecognition.startListening({ continuous: true, language: "id-ID" })
  const stopListening = () => {
    SpeechRecognition.stopListening()
  }

  const commands = [
    {
      command: props.dataFruits.map((item: typeDataFruits) => item.nama),
      callback: (command: string) => {
        const matchedIndex = props.dataFruits.findIndex(
          (item: typeDataFruits) => command === item.nama
        )

        if (matchedIndex === -1) {
          return
        }

        setSeIndex(matchedIndex)
        setMessage(`Best matching command: ${command}`)

        props.setDataF((prev) =>
          prev.map((item, index) => ({
            ...item,
            seleksi: index === matchedIndex,
          }))
        )

        if (resetTimeoutRef.current !== null) {
          window.clearTimeout(resetTimeoutRef.current)
        }

        resetTimeoutRef.current = window.setTimeout(() => {
          setSeIndex(null)
          props.setDataF((prev) =>
            prev.map((item) => ({
              ...item,
              seleksi: false,
            }))
          )
        }, 1000)
      },
      isFuzzyMatch: true,
      fuzzyMatchingThreshold: 0.2,
      bestMatchOnly: true,
    },
  ]

  const {
    transcript,
    listening,
    browserSupportsSpeechRecognition,
    resetTranscript,
  } = useSpeechRecognition({ commands })

  if (!browserSupportsSpeechRecognition) {
    return <div>Harus Menggunakan Browser Google Chrome</div>
  }

  return (
    <div>
      <div className="boxRow">
        {props.dataFruits.map((item: typeDataFruits, index: number) => (
          <div
            key={index}
            className={`boxItem ${seIndex === index ? "boxBorder" : ""}`}
          >
            <img
              src={item.gambar}
              style={{ width: "100px", height: "100px" }}
            />
            <h4>{item.nama}</h4>
          </div>
        ))}
      </div>
      <div>
        <p>Microphone: {listening ? "on" : "off"}</p>
        <button onClick={() => resetTranscript()}>Reset Transcript</button>
        {"  "}
        {window.innerWidth <= 600 ? (
          <button
            onTouchStart={startListening}
            onTouchEnd={SpeechRecognition.stopListening}
            onMouseUp={SpeechRecognition.stopListening}
            onTouchCancel={stopListening}
          >
            Hold to talk
          </button>
        ) : (
          <button
            onMouseDown={startListening}
            onMouseUp={stopListening}
            onMouseLeave={stopListening}
          >
            Hold to talk
          </button>
        )}
        <p>{transcript}</p>
        <p>{message}</p>
      </div>
    </div>
  )
}

export default PlayGameFruits
