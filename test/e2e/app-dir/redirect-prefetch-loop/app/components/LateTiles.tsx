'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'

export function LateTiles() {
  const [show, setShow] = useState(false)
  useEffect(() => {
    const id = setTimeout(() => setShow(true), 3000)
    return () => clearTimeout(id)
  }, [])
  if (!show) return <p>(redirected tiles appear in 3 s…)</p>
  return (
    <ul>
      {Array.from({ length: 12 }, (_, i) => (
        <li key={i}>
          <Link href={`/products/retired-${i + 1}`}>
            redirected product {i + 1}
          </Link>
        </li>
      ))}
    </ul>
  )
}
