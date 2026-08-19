import { nextTestSetup } from 'e2e-utils'

// Regression coverage for vercel/next.js#97517.
describe('minifier comma assignment', () => {
  const { next } = nextTestSetup({
    files: __dirname,
    skipStart: true,
  })

  it('builds comma-assigned helper expressions without duplicate identifiers', async () => {
    await next.build()

    expect(next.cliOutput).not.toContain("Identifier 'b' has already been declared")
  })
})
