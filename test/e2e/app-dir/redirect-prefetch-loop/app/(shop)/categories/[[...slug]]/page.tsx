import { cookies } from 'next/headers'
import Link from 'next/link'
import { Suspense } from 'react'

import { LateTiles } from '../../../components/LateTiles'

const Listing = async ({ path }: { path: string }) => {
  const store = await cookies()
  return (
    <p>
      category {path} ({store.size} cookies)
    </p>
  )
}

const Page = async ({ params }: { params: Promise<{ slug?: string[] }> }) => {
  const { slug } = await params
  const path = (slug ?? []).join('/')
  await new Promise((resolve) =>
    setTimeout(resolve, 200 + ((path.length * 337) % 900))
  )
  return (
    <>
      <h1>category: {path || 'all'}</h1>
      <nav>
        <Link href="/categories/wine/red">red</Link>{' | '}
        <Link href="/categories/wine/white">white</Link>{' | '}
        <Link href="/categories/wine/sparkling">sparkling</Link>{' | '}
        <Link href="/categories/wine/rose">rosé</Link>{' | '}
        <Link href="/categories/wine/dry">dry</Link>
      </nav>
      <Suspense fallback={<p>loading…</p>}>
        <Listing path={path} />
      </Suspense>
      <ul>
        {Array.from({ length: 24 }, (_, i) => (
          <li key={i}>
            <Link href={`/products/live-${i + 1}`}>live product {i + 1}</Link>
          </li>
        ))}
      </ul>
      <LateTiles />
    </>
  )
}

export default Page
