import { useState, useEffect, useCallback } from 'react'
import { MOBILE_BREAKPOINT } from '../constants'

export const useIsMobile = (): boolean => {
  const [isMobile, setIsMobile] = useState<boolean>(false)
  
  const checkIsMobile = useCallback(() => {
    setIsMobile(window.innerWidth <= MOBILE_BREAKPOINT)
  }, [])
  
  useEffect(() => {
    checkIsMobile()
    
    window.addEventListener('resize', checkIsMobile)
    
    return () => {
      window.removeEventListener('resize', checkIsMobile)
    }
  }, [checkIsMobile])
  
  return isMobile
}
