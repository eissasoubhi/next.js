import { nextTestSetup } from 'e2e-utils'
import type { NextAdapter } from 'next'

describe('adapter config route handler outputs', () => {
  const { next } = nextTestSetup({
    files: __dirname,
  })

  it('does not emit RSC twins for app route handlers', async () => {
    const { outputs }: Parameters<NextAdapter['onBuildComplete']>[0] =
      await next.readJSON('build-complete.json')

    const routeHandlerRscOutputs = outputs.appRoutes.filter((output) =>
      output.pathname.endsWith('.rsc')
    )

    expect(routeHandlerRscOutputs).toEqual([])
  })
})
