import { useRef, useCallback, useState, useEffect } from 'react'
import SpeechRecognition from 'react-speech-recognition'
import { 
  SPEECH_RECOGNITION_TIMEOUT,
  ERROR_MESSAGES,
  UI_MESSAGES,
  ErrorType
} from '../constants'

interface UseSpeechRecognitionManagerReturn {
  isLoading: boolean
  errorType: ErrorType | null
  message: string
  startListening: () => void
  stopListening: () => Promise<void>
}

export const useSpeechRecognitionManager = (
  listening: boolean,
  language: string
): UseSpeechRecognitionManagerReturn => {
  const [message, setMessage] = useState<string>('')
  const [errorType, setErrorType] = useState<ErrorType | null>(null)
  const [isLoading, setIsLoading] = useState<boolean>(false)
  
  const startListeningPromiseRef = useRef<Promise<void> | null>(null)
  const timeoutRef = useRef<number | null>(null)
  const abortControllerRef = useRef<AbortController | null>(null)
  
  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
      if (abortControllerRef.current) {
        abortControllerRef.current.abort()
      }
    }
  }, [])
  
  const handleError = useCallback((error: Error, type: ErrorType) => {
    setErrorType(type)
    setIsLoading(false)
    startListeningPromiseRef.current = null
    
    const errorMessage = ERROR_MESSAGES[type as keyof typeof ERROR_MESSAGES]
    setMessage(errorMessage)
    console.error(`Speech recognition error (${type}):`, error)
  }, [])
  
  const startListening = useCallback(() => {
    // Prevent multiple simultaneous starts
    if (listening || startListeningPromiseRef.current || isLoading) {
      console.warn('Speech recognition already starting or active')
      return
    }
    
    // Cancel any previous abort controller
    if (abortControllerRef.current) {
      abortControllerRef.current.abort()
    }
    
    abortControllerRef.current = new AbortController()
    
    setIsLoading(true)
    setErrorType(null)
    setMessage(UI_MESSAGES.starting)
    
    // Set timeout for speech recognition start
    timeoutRef.current = window.setTimeout(() => {
      if (!abortControllerRef.current?.signal.aborted) {
        handleError(new Error('Timeout'), ErrorType.TIMEOUT)
        startListeningPromiseRef.current = null
      }
    }, SPEECH_RECOGNITION_TIMEOUT)
    
    const startPromise = SpeechRecognition.startListening({
      continuous: true,
      language: language,
    })
      .then(() => {
        if (!abortControllerRef.current?.signal.aborted) {
          if (timeoutRef.current) {
            clearTimeout(timeoutRef.current)
          }
          setIsLoading(false)
          setMessage(UI_MESSAGES.active)
        }
      })
      .catch((error: Error) => {
        if (!abortControllerRef.current?.signal.aborted) {
          if (timeoutRef.current) {
            clearTimeout(timeoutRef.current)
          }
          
          // Determine error type based on error message/type
          let errorType: ErrorType
          if (error.message?.includes('permission') || error.name === 'NotAllowedError') {
            errorType = ErrorType.PERMISSION
          } else if (error.message?.includes('network') || error.name === 'NetworkError') {
            errorType = ErrorType.NETWORK
          } else if (error.name === 'NotSupportedError') {
            errorType = ErrorType.NOT_SUPPORTED
          } else {
            errorType = ErrorType.UNKNOWN
          }
          
          handleError(error, errorType)
        }
      })
      .finally(() => {
        startListeningPromiseRef.current = null
      })
    
    startListeningPromiseRef.current = startPromise
  }, [listening, isLoading, language, handleError])
  
  const stopListening = useCallback(async () => {
    // Abort any ongoing operations
    if (abortControllerRef.current) {
      abortControllerRef.current.abort()
    }
    
    // Clear timeout if exists
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
      timeoutRef.current = null
    }
    
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
      setMessage(UI_MESSAGES.stopped)
    } catch (error) {
      console.warn('Error stopping speech recognition:', error)
    }
  }, [])
  
  return {
    isLoading,
    errorType,
    message,
    startListening,
    stopListening
  }
}
