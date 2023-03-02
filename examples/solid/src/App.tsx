import {
  useAccount,
  useBalance,
  useConnect,
  useDisconnect,
  useSignMessage,
} from '@wagmi/solid'
import type { Component } from 'solid-js'
import { Match, Switch, createEffect, createSignal } from 'solid-js'

const App: Component = () => {
  const [_chainId, setChainId] = createSignal(1)

  const { disconnect } = useDisconnect()
  const { mutationData: connectData, connect } = useConnect()
  const acc = useAccount({
    onConnect: (data) => console.log('on connect with data ', data),
    onDisconnect: () => console.log('calling onDisconnect'),
  })

  // opting to set chainId manually, so it won't update
  // if you change your chain on Metamask. Remove this
  // to make it reactive with Metamask.
  const balance = useBalance()

  createEffect(() => console.log(connectData))

  const signData = useSignMessage()

  return (
    <div>
      <Switch>
        <Match when={connectData.isLoading}>Loading connect data...</Match>
        <Match when={connectData.isError}>
          Error {connectData.error?.message}
        </Match>
        <Match when={acc().address}>
          <p>{acc().address}</p>
          <button onClick={() => setChainId((id) => (id === 5 ? 1 : 5))}>
            Change chainId
          </button>
          <button
            onClick={() => signData.signMessage({ message: () => 'asd' })}
          >
            Sign data
          </button>
          <button onClick={() => disconnect()}>Disconnect</button>
        </Match>
        <Match when={!acc().address}>
          <button onClick={() => connect()}>connect to metamask</button>
        </Match>
      </Switch>

      <Switch>
        <Match when={balance.isLoading}>Loading balance data...</Match>
        <Match when={balance.isError}>Error {balance.error?.message}</Match>
        <Match when={balance.isSuccess}>
          <p>
            {balance.data?.formatted} {balance.data?.symbol}
          </p>
        </Match>
      </Switch>
    </div>
  )
}

export default App
