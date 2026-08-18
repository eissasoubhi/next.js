import { nextTestSetup } from 'e2e-utils'
import { waitFor } from 'next-test-utils'
import type { Page, Request } from 'playwright'

// Regression coverage for vercel/next.js#97329. The failure mode is a
// prefetch livelock, so cap repeated RSC requests per pathname rather than
// asserting an exact request count.
describe('redirect-prefetch-loop', () => {
  const { next, isNextDev } = nextTestSetup({
    files: __dirname,
  })

  if (isNextDev) {
    test('skipped in dev mode', () => {})
    return
  }

  const MAX_RSC_REQUESTS_PER_PATH = 25

  it('does not loop prefetches when a Link href matches a redirects() source', async () => {
    const requestCounts = new Map<string, number>()
    let excessRequests: string | null = null

    const browser = await next.browser('/categories/wine', {
      beforePageLoad(page: Page) {
        page.on('request', (request: Request) => {
          const headers = request.headers()

          if (headers['rsc'] === undefined) {
            return
          }

          const pathname = new URL(request.url()).pathname
          const count = (requestCounts.get(pathname) ?? 0) + 1
          requestCounts.set(pathname, count)

          if (count > MAX_RSC_REQUESTS_PER_PATH && excessRequests === null) {
            excessRequests =
              `Observed more than ${MAX_RSC_REQUESTS_PER_PATH} ` +
              `RSC requests for ${pathname}`
          }
        })
      },
    })

    // These links mount late on purpose, after live product prefetches have
    // taught the client the optimistic /products/[...slug] route pattern.
    await browser.waitForElementByCss('a[href="/products/retired-1"]')
    await browser.eval(() => {
      window.scrollTo(0, document.body.scrollHeight)
    })

    await waitFor(1500)

    expect(excessRequests).toBeNull()
  })
})
