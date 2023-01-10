import type { Component } from 'solid-js'

import { useConnect } from 'wagmi-solid'

const Content: Component = () => {
  const { connect } = useConnect()

  return <div>{<button onClick={() => connect()}>Connect</button>}</div>
}

export default Content
