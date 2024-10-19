import { ArrowRight } from 'lucide-react'
import { useRouter } from 'next/navigation'

import React from 'react'

interface MenuButtonProps {
    from: string
}

function MenuButton({from}: MenuButtonProps) {
  const router = useRouter()
  return (
    <button
        onClick={() => router.push(`/menu?from=${from}`)}
        className="absolute bottom-8 right-8 py-2 text-sm text-teal-800 rounded transition-all duration-300 ease-in-out bg-clip-text bg-gradient-to-r from-blue-900 to-blue-900 bg-[length:0%_2px] bg-left-bottom bg-no-repeat hover:bg-[length:100%_2px] overflow-hidden group"
      >
        <span className="relative z-10 flex items-center">
          i want to try something else
          <ArrowRight className="ml-2 w-4 h-4" />
        </span>
        <span className="absolute bottom-1 left-0 w-full h-[1px] bg-teal-800 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 ease-in-out origin-left"></span>
      </button>
  )
}

export default MenuButton