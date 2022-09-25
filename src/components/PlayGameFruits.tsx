import type { typeDataFruits } from "./dataFruits"
import React, { useState, ReactElement } from "react"
import SpeechRecognition, {
  useSpeechRecognition,
} from "react-speech-recognition"

function PlayGameFruits(props: {
  dataFruits: typeDataFruits[]
  setDataF: Func
}): ReactElement {
  const [message, setMessage] = useState<string>("")
  const [classBorder, setClassBorder] = useState<string>("")

  const startListening = () =>
    SpeechRecognition.startListening({ continuous: true, language: "id" })

  const commands = [
    {
      command: props.dataFruits.map((item: typeDataFruits) => item.nama),
      callback: (command) => {
        let temp = props.dataFruits.filter((item: typeDataFruits) => {
          if (command === item.nama) {
            setMessage(`Best matching command: ${command}`)
            setClassBorder("boxBorder")
            item.seleksi = true
            setTimeout(() => {
              item.seleksi = false
              setClassBorder("")
            }, 1000)
          }
          return item
        })
        setDataF([...temp])
      },
      isFuzzyMatch: true,
      fuzzyMatchingThreshold: 0.2,
      bestMatchOnly: true,
    },
    {
      command: "reset",
      callback: ({ resetTranscript }) => resetTranscript(),
    },
  ]

  const { transcript, listening, browserSupportsSpeechRecognition } =
    useSpeechRecognition({ commands })

  if (!browserSupportsSpeechRecognition) {
    return <div>Harus Menggunakan Browser Google Chrome</div>
  }

  return (
    <div>
      <div className="boxRow">
        {props.dataFruits.map((item: typeDataFruits, index: number) => (
          <div key={index} className={"boxItem " + classBorder}>
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
