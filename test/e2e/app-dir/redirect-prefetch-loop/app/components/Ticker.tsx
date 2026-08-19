'use client'

import { useEffect, useState } from 'react'

export function Ticker() {
  const [tick, setTick] = useState(0)
  useEffect(() => {
    const id = setInterval(() => setTick((t) => t + 1), 300)
    return () => clearInterval(id)
  }, [])
  return <p>tick: {tick}</p>
}
