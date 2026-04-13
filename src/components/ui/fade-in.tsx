import { useRef, ReactNode } from 'react'
import { useIntersection } from '@/hooks/use-intersection'
import { cn } from '@/lib/utils'

interface FadeInProps {
  children: ReactNode
  className?: string
  delay?: number
  direction?: 'up' | 'down' | 'left' | 'right' | 'none'
}

export function FadeIn({ children, className, delay = 0, direction = 'up' }: FadeInProps) {
  const ref = useRef<HTMLDivElement>(null)
  const isIntersecting = useIntersection(ref, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' })

  const getTranslateClass = () => {
    if (isIntersecting) return 'translate-x-0 translate-y-0'
    switch (direction) {
      case 'up':
        return 'translate-y-10'
      case 'down':
        return '-translate-y-10'
      case 'left':
        return 'translate-x-10'
      case 'right':
        return '-translate-x-10'
      default:
        return ''
    }
  }

  return (
    <div
      ref={ref}
      className={cn(
        'opacity-0 transition-all duration-1000 ease-out',
        isIntersecting ? 'opacity-100' : 'opacity-0',
        getTranslateClass(),
        className,
      )}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </div>
  )
}
