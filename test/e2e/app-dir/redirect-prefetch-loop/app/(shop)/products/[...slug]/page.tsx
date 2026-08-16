import { cookies } from 'next/headers'
import { Suspense } from 'react'

const Details = async ({ id }: { id: string }) => {
  const store = await cookies()
  return (
    <p>
      product {id} ({store.size} cookies)
    </p>
  )
}

const Page = async ({ params }: { params: Promise<{ slug: string[] }> }) => {
  const { slug } = await params
  await new Promise((resolve) =>
    setTimeout(resolve, 100 + ((slug[0].length * 173) % 700))
  )
  return (
    <>
      <h1>product: {slug.join('/')}</h1>
      <Suspense fallback={<p>loading…</p>}>
        <Details id={slug[0]} />
      </Suspense>
    </>
  )
}

export default Page
