import { useState, useEffect, RefObject } from 'react'

export function useIntersection(
  ref: RefObject<HTMLElement | null>,
  options?: IntersectionObserverInit,
) {
  const [isIntersecting, setIsIntersecting] = useState(false)

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setIsIntersecting(true)
        observer.disconnect()
      }
    }, options)

    if (ref.current) {
      observer.observe(ref.current)
    }

    return () => {
      observer.disconnect()
    }
  }, [ref, options])

  return isIntersecting
}
