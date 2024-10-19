'use client'

import { useState, useEffect, useRef } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { motion } from 'framer-motion'

const pages = ['breathe', 'threes', 'talk with skog']

export default function MenuPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const containerRef = useRef<HTMLDivElement>(null)

  const [currentPage, setCurrentPage] = useState(() => {
    const from = searchParams.get('from')
    return from ? pages.indexOf(from) : 1 
  })

  const [isScrolling, setIsScrolling] = useState(false) // To prevent multiple scroll triggers

  useEffect(() => {
    const handleWheel = (e: WheelEvent) => {
      e.preventDefault()

      if (isScrolling) return 

      if (e.deltaY > 0 && currentPage < pages.length - 1) {
        // Scroll down: move to the next menu item
        setCurrentPage(prev => prev + 1)
      } else if (e.deltaY < 0 && currentPage > 0) {
        // Scroll up: move to the previous menu item
        setCurrentPage(prev => prev - 1)
      }

      setIsScrolling(true)

      // reenable scrolling after a short delay so animation completes
      setTimeout(() => {
        setIsScrolling(false)
      }, 700) 
    }

    const container = containerRef.current
    if (container) {
      container.addEventListener('wheel', handleWheel, { passive: false })
    }

    return () => {
      if (container) {
        container.removeEventListener('wheel', handleWheel)
      }
    }
  }, [currentPage, isScrolling])

  const handleClick = (page: string) => {
    switch (page) {
      case 'breathe':
        router.push('/breathe')
        break
      case 'threes':
        router.push('/senses')
        break
      case 'talk with skog':
        router.push('/talk')
        break
    }
  }

  return (
    <div ref={containerRef} className="h-screen flex items-center justify-center bg-gradient-to-r from-teal-100 to-blue-200 overflow-hidden">
      <div className="relative h-full w-full flex flex-col items-center justify-center">
        {pages.map((page, index) => (
          <motion.button
            key={page}
            className="px-6 py-3 text-2xl font-serif font-semibold text-teal-800 rounded-lg bg-opacity-50 hover:bg-opacity-70 transition-all duration-300"
            animate={{
              y: `calc(${(index - currentPage) * 80}% + ${(index - currentPage) * 10}px)`,
              scale: index === currentPage ? 1.3 : 1,
              opacity: index === currentPage ? 1 : 0.4,
            }}
            transition={{
              y: { type: 'spring', stiffness: 400, mass: 0.4, damping: 15 },
              scale: { duration: 0.20 },
              opacity: { duration: 0.20 }
            }}
            whileHover={{ scale: index === currentPage ? 1.3 : 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => handleClick(page)}
          >
            {page}
          </motion.button>
        ))}
      </div>
    </div>
  )
}
