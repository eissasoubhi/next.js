// Temporary internal-validation patch. Remove once the candidate is proven
// and the source change is committed directly.
import { readFileSync, writeFileSync } from 'node:fs'

function replaceOnce(source, before, after, label) {
  const index = source.indexOf(before)
  if (index === -1) {
    throw new Error(`Could not find ${label}`)
  }
  if (source.indexOf(before, index + before.length) !== -1) {
    throw new Error(`Found multiple matches for ${label}`)
  }
  return source.slice(0, index) + after + source.slice(index + before.length)
}

const cachePath = 'packages/next/src/client/components/segment-cache/cache.ts'
let cache = readFileSync(cachePath, 'utf8')

cache = replaceOnce(
  cache,
  `import { discoverKnownRoute, matchKnownRoute } from './optimistic-routes'`,
  `import {\n  discoverKnownRoute,\n  markKnownRouteAsDynamicRewrite,\n  matchKnownRoute,\n} from './optimistic-routes'`,
  'optimistic route imports'
)

cache = replaceOnce(
  cache,
  `  const { serverResponse, shellResponse, responseSize, closed } = result\n  const now = Date.now()`,
  `  const {\n    serverResponse,\n    shellResponse,\n    responseSize,\n    closed,\n    wasRedirected,\n  } = result\n\n  if (wasRedirected) {\n    // Several URLs can be predicted concurrently from the same known-route\n    // pattern. Mark the pattern that is currently stored in the trie, rather\n    // than only this task's synthetic route entry; a newer prediction may\n    // already have replaced it.\n    markKnownRouteAsDynamicRewrite(Date.now(), routeKey.pathname)\n    invalidateRouteCacheEntries(task.key.nextUrl, task.treeAtTimeOfPrefetch)\n    rejectRemainingSegmentsInBundle(segments, -1)\n    return null\n  }\n\n  const now = Date.now()`,
  'segment result handling'
)

cache = replaceOnce(
  cache,
  `  closed: Promise<void>\n} | null> {`,
  `  closed: Promise<void>\n  wasRedirected: boolean\n} | null> {`,
  'segment fetch return type'
)

cache = replaceOnce(
  cache,
  `  const response = await fetchPrefetchResponse(requestUrl, headers)\n  if (`,
  `  const response = await fetchPrefetchResponse(requestUrl, headers)\n  const wasRedirected = response?.redirected === true\n  if (`,
  'segment fetch response'
)

cache = replaceOnce(
  cache,
  `    shellResponse,\n    closed: closed.promise,\n  }`,
  `    shellResponse,\n    closed: closed.promise,\n    wasRedirected,\n  }`,
  'segment fetch result'
)

writeFileSync(cachePath, cache)

const optimisticPath =
  'packages/next/src/client/components/segment-cache/optimistic-routes.ts'
let optimistic = readFileSync(optimisticPath, 'utf8')

optimistic = replaceOnce(
  optimistic,
  `/**\n * Attempts to match a URL against learned route patterns.`,
  `/**\n * Marks the pattern that currently matches a pathname as unsafe for optimistic\n * prediction. This deliberately updates the trie-owned pattern instead of a\n * synthetic entry held by a single prefetch task: concurrent predictions can\n * replace the trie pointer before an earlier request discovers a redirect.\n */\nexport function markKnownRouteAsDynamicRewrite(\n  now: number,\n  pathname: string\n): void {\n  const pathnameParts = splitPathnameIntoParts(pathname)\n  const match = matchKnownRoutePart(\n    now,\n    knownRouteTreeRoot,\n    pathnameParts,\n    0,\n    new Map()\n  )\n  if (match !== null) {\n    match.part.pattern!.hasDynamicRewrite = true\n  }\n}\n\n/**\n * Attempts to match a URL against learned route patterns.`,
  'known route invalidation helper'
)

writeFileSync(optimisticPath, optimistic)
