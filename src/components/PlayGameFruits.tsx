import type { typeDataFruits } from "../dataFruits"
import React, { useState, ReactElement } from "react"
import SpeechRecognition, {
  useSpeechRecognition,
} from "react-speech-recognition"

function PlayGameFruits(props: {
  dataFruits: typeDataFruits[]
  setDataF: any
}): ReactElement {
  const [message, setMessage] = useState<string>("")
  const [seIndex, setSeIndex] = useState<number | null>(null)

  const startListening = () =>
    SpeechRecognition.startListening({ continuous: true, language: "id" })

  const commands = [
    {
      command: props.dataFruits.map((item: typeDataFruits) => item.nama),
      callback: (command: string) => {
        let temp = props.dataFruits.filter(
          (item: typeDataFruits, index: number) => {
            if (command === item.nama) {
              setSeIndex(index)
              setMessage(`Best matching command: ${command}`)
              item.seleksi = true
              setTimeout(() => {
                item.seleksi = false
                setSeIndex(null)
              }, 1000)
            }
            return item
          }
        )
        props.setDataF([...temp])
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
        <button
          onTouchStart={startListening}
          onMouseDown={startListening}
          onTouchEnd={SpeechRecognition.stopListening}
          onMouseUp={SpeechRecognition.stopListening}
        >
          Hold to talk
        </button>
        <p>{transcript}</p>
        <p>{message}</p>
      </div>
    </div>
  )
}

export default PlayGameFruits
