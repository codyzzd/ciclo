'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'

export function SplashScreen() {
  const [visible, setVisible] = useState(true)
  const [fading, setFading] = useState(false)

  useEffect(() => {
    const fadeTimer = setTimeout(() => setFading(true), 1200)
    const hideTimer = setTimeout(() => setVisible(false), 1600)
    return () => {
      clearTimeout(fadeTimer)
      clearTimeout(hideTimer)
    }
  }, [])

  if (!visible) return null

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 9999,
        backgroundColor: '#fdf6f7',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '16px',
        transition: 'opacity 0.4s ease',
        opacity: fading ? 0 : 1,
        pointerEvents: 'none',
      }}
    >
      <Image
        src="/icons/icon-192.png"
        alt="Meu Ciclo"
        width={96}
        height={96}
        style={{ borderRadius: '22px' }}
        priority
      />
      <span
        style={{
          fontFamily: 'var(--font-nunito), sans-serif',
          fontSize: '22px',
          fontWeight: 700,
          color: '#c2185b',
          letterSpacing: '-0.3px',
        }}
      >
        Meu Ciclo
      </span>
    </div>
  )
}
