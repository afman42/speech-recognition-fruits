import type { typeDataFruits } from "../dataFruits"
import React, { ReactElement, useRef, useCallback, useState, useEffect } from "react"
import { useSpeechRecognition } from "react-speech-recognition"
import { useSpeechRecognitionManager } from "../hooks/useSpeechRecognitionManager"
import { useIsMobile } from "../hooks/useIsMobile"
import { 
  DEFAULT_LANGUAGE,
  SELECTION_RESET_TIMEOUT,
  FUZZY_MATCH_THRESHOLD,
  ERROR_MESSAGES,
  BUTTON_LABELS,
  UI_MESSAGES
} from "../constants"

interface PlayGameFruitsProps {
  dataFruits: typeDataFruits[]
  setDataFruits: React.Dispatch<React.SetStateAction<typeDataFruits[]>>
  language?: string
}

function PlayGameFruits(props: PlayGameFruitsProps): ReactElement {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null)
  const [bestMatchMessage, setBestMatchMessage] = useState<string>("")
  const resetTimeoutRef = useRef<number | null>(null)
  const { language = DEFAULT_LANGUAGE } = props
  
  const isMobile = useIsMobile()
  
  // Cleanup effect for timeout
  useEffect(() => {
    return () => {
      if (resetTimeoutRef.current) {
        clearTimeout(resetTimeoutRef.current)
      }
    }
  }, [])

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

        setSelectedIndex(matchedIndex)
        setBestMatchMessage(`Best matching command: ${command}`)

        props.setDataFruits((prev) =>
          prev.map((item, index) => ({
            ...item,
            seleksi: index === matchedIndex,
          }))
        )

        if (resetTimeoutRef.current) {
          clearTimeout(resetTimeoutRef.current)
        }

        resetTimeoutRef.current = window.setTimeout(() => {
          setSelectedIndex(null)
          setBestMatchMessage("")
          props.setDataFruits((prev) =>
            prev.map((item) => ({
              ...item,
              seleksi: false,
            }))
          )
        }, SELECTION_RESET_TIMEOUT)
      },
      isFuzzyMatch: true,
      fuzzyMatchingThreshold: FUZZY_MATCH_THRESHOLD,
      bestMatchOnly: true,
    },
  ]

  const {
    transcript,
    listening,
    browserSupportsSpeechRecognition,
    resetTranscript,
  } = useSpeechRecognition({ commands })
  
  const { 
    isLoading, 
    errorType, 
    message, 
    startListening, 
    stopListening 
  } = useSpeechRecognitionManager(listening, language)

  const handleStopListening = useCallback(() => {
    // stopListening handles errors internally and returns a promise
    stopListening().catch((error: Error) => {
      console.error('Error in handleStopListening:', error)
    })
  }, [stopListening])

  if (!browserSupportsSpeechRecognition) {
    return (
      <div style={{
        padding: '20px',
        margin: '20px',
        backgroundColor: '#fff3cd',
        border: '1px solid #ffc107',
        borderRadius: '4px',
        color: '#856404'
      }}>
        {ERROR_MESSAGES['browser-not-supported']}
      </div>
    )
  }

  return (
    <div>
      <div className="boxRow">
        {props.dataFruits.map((item: typeDataFruits, index: number) => (
          <div
            key={index}
            className={`boxItem ${selectedIndex === index ? "boxBorder" : ""}`}
          >
            <img
              src={item.gambar}
              alt={item.nama}
              style={{ width: "100px", height: "100px" }}
              onError={(e) => {
                console.error(`Failed to load image for ${item.nama}`)
                e.currentTarget.style.display = 'none'
              }}
            />
            <h4>{item.nama}</h4>
          </div>
        ))}
      </div>
      
      <div>
        <p>Microphone: {listening ? UI_MESSAGES.microphone_on : UI_MESSAGES.microphone_off}</p>
        
        <button 
          onClick={() => resetTranscript()}
          disabled={isLoading}
        >
          {BUTTON_LABELS.reset_transcript}
        </button>
        {"  "}
        
        {isMobile ? (
          <button
            onTouchStart={startListening}
            onTouchEnd={handleStopListening}
            onMouseUp={handleStopListening}
            onTouchCancel={handleStopListening}
            disabled={isLoading}
          >
            {isLoading ? 'Loading...' : BUTTON_LABELS.hold_to_talk}
          </button>
        ) : (
          <button
            onMouseDown={startListening}
            onMouseUp={handleStopListening}
            onMouseLeave={handleStopListening}
            disabled={isLoading}
          >
            {isLoading ? 'Loading...' : BUTTON_LABELS.hold_to_talk}
          </button>
        )}
        
        {transcript && <p>Transcript: {transcript}</p>}
        
        {message && (
          <p style={{ 
            color: errorType ? '#c92a2a' : '#2e7d32',
            fontWeight: errorType ? 'bold' : 'normal'
          }}>
            {message}
          </p>
        )}
        
        {bestMatchMessage && (
          <p style={{ color: '#1976d2' }}>
            {bestMatchMessage}
          </p>
        )}
      </div>
    </div>
  )
}

export default PlayGameFruits
