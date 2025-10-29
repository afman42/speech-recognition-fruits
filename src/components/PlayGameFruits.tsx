import type { typeDataFruits } from "../dataFruits"
import React, { ReactElement, useRef, useCallback, useState, useEffect } from "react"
import { useSpeechRecognition } from "react-speech-recognition"
import { useSpeechRecognitionManager } from "../hooks/useSpeechRecognitionManager"
import { useIsMobile } from "../hooks/useIsMobile"
import FruitItem from "./FruitItem"
import { soundManager } from "../utils/soundManager"
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
      callback: (fruitName: string) => {
        const matchedIndex = props.dataFruits.findIndex(
          (item: typeDataFruits) => fruitName === item.nama
        )

        if (matchedIndex === -1) {
          // Play incorrect sound when no match is found
          soundManager.playIncorrectSound();
          return
        }

        // Play correct sound when a match is found
        soundManager.playCorrectSound();

        setSelectedIndex(matchedIndex)
        setBestMatchMessage(`Best matching command: ${fruitName}`)

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
          <FruitItem
            key={index}
            item={item}
            index={index}
            isSelected={selectedIndex === index}
          />
        ))}
      </div>
      
      <div>
        <p aria-live="polite">Microphone: {listening ? UI_MESSAGES.microphone_on : UI_MESSAGES.microphone_off}</p>
        
        <button 
          onClick={() => resetTranscript()}
          disabled={isLoading}
          aria-label={BUTTON_LABELS.reset_transcript}
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
            aria-label={isLoading ? 'Loading' : BUTTON_LABELS.hold_to_talk}
            aria-pressed={listening}
          >
            {isLoading ? 'Loading...' : BUTTON_LABELS.hold_to_talk}
          </button>
        ) : (
          <button
            onMouseDown={startListening}
            onMouseUp={handleStopListening}
            onMouseLeave={handleStopListening}
            disabled={isLoading}
            aria-label={isLoading ? 'Loading' : BUTTON_LABELS.hold_to_talk}
            aria-pressed={listening}
          >
            {isLoading ? 'Loading...' : BUTTON_LABELS.hold_to_talk}
          </button>
        )}
        
        {transcript && <p aria-live="polite">Transcript: {transcript}</p>}
        
        {message && (
          <p style={{ 
            color: errorType ? '#c92a2a' : '#2e7d32',
            fontWeight: errorType ? 'bold' : 'normal'
          }}
          aria-live="assertive">
            {message}
          </p>
        )}
        
        {bestMatchMessage && (
          <p style={{ color: '#1976d2' }} aria-live="polite">
            {bestMatchMessage}
          </p>
        )}
      </div>
    </div>
  )
}

export default PlayGameFruits
