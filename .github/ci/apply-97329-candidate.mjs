import { readFileSync, writeFileSync } from 'node:fs'

const path = 'packages/next/src/client/components/segment-cache/cache.ts'
let source = readFileSync(path, 'utf8')

function replaceOnce(before, after, label) {
  const index = source.indexOf(before)
  if (index === -1) {
    throw new Error(`Could not find ${label}`)
  }
  if (source.indexOf(before, index + before.length) !== -1) {
    throw new Error(`Found multiple matches for ${label}`)
  }
  source = source.slice(0, index) + after + source.slice(index + before.length)
}

replaceOnce(
  `  const { serverResponse, shellResponse, responseSize, closed } = result\n  const now = Date.now()`,
  `  const {\n    serverResponse,\n    shellResponse,\n    responseSize,\n    closed,\n    wasRedirected,\n  } = result\n\n  if (wasRedirected) {\n    // Segment requests use the route entry's canonical URL. If one still\n    // redirects, the route entry came from an optimistic pattern that the\n    // server has now disproved (or the redirect changed after the route tree\n    // was fetched). Disable that prediction and refetch the real route tree.\n    markRouteEntryAsDynamicRewrite(route)\n    invalidateRouteCacheEntries(task.key.nextUrl, task.treeAtTimeOfPrefetch)\n    rejectRemainingSegmentsInBundle(segments, -1)\n    return null\n  }\n\n  const now = Date.now()`,
  'segment result handling'
)

replaceOnce(
  `  closed: Promise<void>\n} | null> {`,
  `  closed: Promise<void>\n  wasRedirected: boolean\n} | null> {`,
  'segment fetch return type'
)

replaceOnce(
  `  const response = await fetchPrefetchResponse(requestUrl, headers)\n  if (`,
  `  const response = await fetchPrefetchResponse(requestUrl, headers)\n  const wasRedirected = response?.redirected === true\n  if (`,
  'segment fetch response'
)

replaceOnce(
  `    shellResponse,\n    closed: closed.promise,\n  }`,
  `    shellResponse,\n    closed: closed.promise,\n    wasRedirected,\n  }`,
  'segment fetch result'
)

writeFileSync(path, source)
