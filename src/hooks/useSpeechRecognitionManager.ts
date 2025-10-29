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
  
  // Use a ref to track whether we're trying to start/stop to prevent race conditions
  const isOperationPending = useRef(false)
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
    isOperationPending.current = false
    
    const errorMessage = ERROR_MESSAGES[type as keyof typeof ERROR_MESSAGES]
    setMessage(errorMessage)
    console.error(`Speech recognition error (${type}):`, error)
  }, [])
  
  const startListening = useCallback(() => {
    // Prevent multiple simultaneous starts
    if (listening || isOperationPending.current) {
      console.warn('Speech recognition already starting or active')
      return
    }
    
    // Set the operation as pending to prevent race conditions
    isOperationPending.current = true
    
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
        isOperationPending.current = false
      }
    }, SPEECH_RECOGNITION_TIMEOUT)
    
    SpeechRecognition.startListening({
      continuous: true,
      language: language,
    })
      .then(() => {
        if (!abortControllerRef.current?.signal.aborted) {
          if (timeoutRef.current) {
            clearTimeout(timeoutRef.current)
          }
          setIsLoading(false)
          isOperationPending.current = false
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
          isOperationPending.current = false
        }
      })
  }, [listening, language, handleError])
  
  const stopListening = useCallback(async () => {
    // Set the operation as pending to prevent race conditions
    isOperationPending.current = true
    
    // Abort any ongoing operations
    if (abortControllerRef.current) {
      abortControllerRef.current.abort()
    }
    
    // Clear timeout if exists
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
      timeoutRef.current = null
    }
    
    setIsLoading(false)
    isOperationPending.current = false
    
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
