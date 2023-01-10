import type { QueryClient } from '@tanstack/solid-query'
import { QueryClientProvider } from '@tanstack/solid-query'
import type { Provider, WebSocketProvider } from '@wagmi/core'
import { createContext, useContext } from 'solid-js'
import type { ComponentProps } from 'solid-js'

import type { Client } from './client'

export const Context = createContext<
  Client<Provider, WebSocketProvider> | undefined
>(undefined)

export const queryClientContext = createContext<QueryClient | undefined>(
  undefined,
)

export type WagmiConfigProps<
  TProvider extends Provider = Provider,
  TWebSocketProvider extends WebSocketProvider = WebSocketProvider,
> = {
  client: Client<TProvider, TWebSocketProvider>
}
export function WagmiProvider<
  TProvider extends Provider,
  TWebSocketProvider extends WebSocketProvider,
>(
  props: WagmiConfigProps<TProvider, TWebSocketProvider> & ComponentProps<any>,
) {
  // Bailing out of using JSX
  // https://github.com/egoist/tsup/issues/390#issuecomment-933488738
  return (
    <Context.Provider value={props.client as unknown as Client}>
      <QueryClientProvider
        context={queryClientContext}
        client={props.client.queryClient}
      >
        {props.children}
      </QueryClientProvider>
    </Context.Provider>
  )
}

export function useClient<
  TProvider extends Provider,
  TWebSocketProvider extends WebSocketProvider = WebSocketProvider,
>() {
  const client = useContext(Context) as unknown as Client<
    TProvider,
    TWebSocketProvider
  >
  if (!client)
    throw new Error(
      [
        '`useClient` must be used within `WagmiProvider`.\n',
        'Read more: https://wagmi.sh/solid/WagmiProvider',
      ].join('\n'),
    )
  return client
}
