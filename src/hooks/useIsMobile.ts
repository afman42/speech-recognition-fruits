import { useState, useEffect } from 'react'
import { MOBILE_BREAKPOINT } from '../constants'

export const useIsMobile = (): boolean => {
  const [isMobile, setIsMobile] = useState<boolean>(false)
  
  useEffect(() => {
    const checkIsMobile = () => {
      setIsMobile(window.innerWidth <= MOBILE_BREAKPOINT)
    }
    
    // Set initial value
    checkIsMobile()
    
    // Add resize listener
    window.addEventListener('resize', checkIsMobile)
    
    // Cleanup
    return () => {
      window.removeEventListener('resize', checkIsMobile)
    }
  }, [])
  
  return isMobile
}
