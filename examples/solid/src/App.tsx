import type { Component } from 'solid-js'

import {
  WagmiProvider,
  configureChains,
  createClient,
  goerli,
  mainnet,
  publicProvider,
} from 'wagmi-solid'

import Content from './Content'

const { provider, webSocketProvider } = configureChains(
  [mainnet, goerli],
  [publicProvider()],
)

const client = createClient({
  autoConnect: true,
  provider,
  webSocketProvider,
})

const App: Component = () => {
  return (
    <div>
      <WagmiProvider client={client}>
        <Content />
      </WagmiProvider>
    </div>
  )
}

export default App
