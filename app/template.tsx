'use client'

import { usePathname } from 'next/navigation'
import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'

export default function Template({ children }: { children: React.ReactNode }) {
  const container = useRef<HTMLDivElement>(null)
  const pathname = usePathname()

  useEffect(() => {
    const el = container.current
    if (!el) return

    const timeline = gsap.timeline({ defaults: { ease: 'power3.inOut' } })

    timeline
      .fromTo(
        el,
        {
          opacity: 0,
          rotateY: -20,
          scale: 0.95,
          transformOrigin: 'center',
        },
        {
          opacity: 1,
          rotateY: 0,
          scale: 1,
          duration: 0.8,
        }
      )

    return () => {
      gsap.set(el, {
        opacity: 0,
        rotateY: 20,
        scale: 0.95,
      })
    }
  }, [pathname])

  return (
    <div ref={container} className="w-full min-h-screen will-change-transform">
      {children}
    </div>
  )
}
