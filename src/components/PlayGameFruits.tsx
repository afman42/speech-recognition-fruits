import type { typeDataFruits } from "../dataFruits"
import React, { useState, ReactElement, useRef, useEffect, useCallback } from "react"
import SpeechRecognition, {
  useSpeechRecognition,
} from "react-speech-recognition"

type ErrorType = 'permission' | 'network' | 'timeout' | 'not-supported' | 'unknown'

interface PlayGameFruitsProps {
  dataFruits: typeDataFruits[]
  setDataF: React.Dispatch<React.SetStateAction<typeDataFruits[]>>
  language?: string
}

function PlayGameFruits(props: PlayGameFruitsProps): ReactElement {
  const [message, setMessage] = useState<string>("")
  const [errorType, setErrorType] = useState<ErrorType | null>(null)
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [seIndex, setSeIndex] = useState<number | null>(null)
  const [isMobile, setIsMobile] = useState<boolean>(false)
  const resetTimeoutRef = useRef<number | null>(null)
  const startListeningPromiseRef = useRef<Promise<void> | null>(null)
  const { language = "id-ID" } = props

  // Handle window resize for mobile detection
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 600)
    }
    
    handleResize() // Set initial value
    window.addEventListener('resize', handleResize)
    
    return () => {
      window.removeEventListener('resize', handleResize)
      if (resetTimeoutRef.current !== null) {
        window.clearTimeout(resetTimeoutRef.current)
      }
    }
  }, [])

  // Enhanced error handling helper
  const handleError = useCallback((error: any, type: ErrorType) => {
    setErrorType(type)
    setIsLoading(false)
    startListeningPromiseRef.current = null
    
    const errorMessages: Record<ErrorType, string> = {
      permission: "Tidak dapat mengakses mikrofon. Periksa perizinan browser.",
      network: "Masalah koneksi jaringan. Coba lagi nanti.",
      timeout: "Waktu tunggu habis. Silakan coba lagi.",
      'not-supported': "Browser tidak mendukung speech recognition.",
      unknown: "Terjadi kesalahan tidak dikenal. Silakan coba lagi."
    }
    
    setMessage(errorMessages[type])
    console.error(`Speech recognition error (${type}):`, error)
  }, [])

  const startListening = useCallback(() => {
    if (listening || startListeningPromiseRef.current || isLoading) {
      return
    }

    setIsLoading(true)
    setErrorType(null)
    setMessage("Memulai speech recognition...")

    const timeoutId = setTimeout(() => {
      handleError(new Error('Timeout'), 'timeout')
    }, 10000) // 10 second timeout

    const startPromise = SpeechRecognition.startListening({
      continuous: true,
      language: language,
    })
      .then(() => {
        clearTimeout(timeoutId)
        setIsLoading(false)
        setMessage("Speech recognition aktif. Ucapkan nama buah!")
      })
      .catch((error) => {
        clearTimeout(timeoutId)
        // Determine error type based on error message/type
        if (error.message?.includes('permission') || error.name === 'NotAllowedError') {
          handleError(error, 'permission')
        } else if (error.message?.includes('network') || error.name === 'NetworkError') {
          handleError(error, 'network')
        } else if (error.name === 'NotSupportedError') {
          handleError(error, 'not-supported')
        } else {
          handleError(error, 'unknown')
        }
      })
      .finally(() => {
        startListeningPromiseRef.current = null
      })

    startListeningPromiseRef.current = startPromise
  }, [listening, isLoading, language, handleError])

  const stopListening = useCallback(async () => {
    const pendingStart = startListeningPromiseRef.current

    if (pendingStart) {
      try {
        await pendingStart
      } catch (error) {
        console.warn('Error waiting for pending start:', error)
      }
    }

    startListeningPromiseRef.current = null
    setIsLoading(false)

    try {
      await SpeechRecognition.stopListening()
      setMessage("Speech recognition dihentikan.")
    } catch (error) {
      console.warn('Error stopping speech recognition:', error)
    }
  }, [])

  const handleStopListening = useCallback(() => {
    stopListening().catch(error => {
      console.error('Error in handleStopListening:', error)
    })
  }, [stopListening])

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
            onTouchEnd={handleStopListening}
            onMouseUp={handleStopListening}
            onTouchCancel={handleStopListening}
          >
            Hold to talk
          </button>
        ) : (
          <button
            onMouseDown={startListening}
            onMouseUp={handleStopListening}
            onMouseLeave={handleStopListening}
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
