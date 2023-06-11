/**
 * GQty: You can safely modify this file based on your needs.
 */

// import { createReactClient } from '@gqty/react'
import { Cache, GQtyError, createClient, type QueryFetcher } from 'gqty'
import { env } from '~/src/env.cjs'
import { generatedSchema, scalarsEnumsHash, type GeneratedSchema } from './schema.generated'

const queryFetcher: QueryFetcher = async function ({ query, variables, operationName }, fetchOptions) {
  const response = await fetch(`${env.NEXT_PUBLIC_PAYLOAD_URL}/api/graphql`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      query,
      variables,
      operationName,
    }),
    mode: 'cors',
    cache: 'no-store',
    ...fetchOptions,
  })

  if (response.status >= 400) {
    throw new GQtyError(`GraphQL endpoint responded with HTTP ${response.status}: ${response.statusText}.`)
  }

  const text = await response.text()

  try {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return JSON.parse(text)
  } catch {
    throw new GQtyError(`Malformed JSON response: ${text.length > 50 ? text.slice(0, 50) + '...' : text}`)
  }
}

const cache = new Cache(
  undefined,
  // Default option is immediate cache expiry but keep it for 5 minutes,
  // allowing soft refetches in background.
  {
    // TODO: consider checking if prod environment and enabling caching
    maxAge: 0,
    // staleWhileRevalidate: 5 * 60 * 1000,
    staleWhileRevalidate: 0,
    // normalization: true,
    normalization: false,
  },
)

export const client = createClient<GeneratedSchema>({
  schema: generatedSchema,
  scalars: scalarsEnumsHash,
  cache,
  fetchOptions: {
    fetcher: queryFetcher,
  },
})

// Core functions
export const { resolve: payloadResolve, subscribe: payloadSubscribe, schema: payloadSchema } = client

// Legacy functions
export const { query, mutation, mutate, subscription, resolved, refetch, track } = client

// export const {
//   graphql,
//   useQuery,
//   usePaginatedQuery,
//   useTransactionQuery,
//   useLazyQuery,
//   useRefetch,
//   useMutation,
//   useMetaState,
//   prepareReactRender,
//   useHydrateCache,
//   prepareQuery,
// } = createReactClient<GeneratedSchema>(client, {
//   defaults: {
//     // Enable Suspense, you can override this option at hooks.
//     suspense: false,
//   },
// })

export * from './schema.generated'
