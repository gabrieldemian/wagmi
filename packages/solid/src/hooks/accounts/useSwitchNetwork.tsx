import { createMutation } from '@tanstack/solid-query'
import type { SwitchNetworkResult } from '@wagmi/core'
import { switchNetwork } from '@wagmi/core'
import type { Accessor } from 'solid-js'

import { useClient } from '../../context'

import type { MutationConfig } from '../../types'

export type SwitchNetworkArgs = {
  chainId: Accessor<number>
}

export type UseSwitchNetworkArgs = Partial<SwitchNetworkArgs>

export type UseSwitchNetworkConfig = MutationConfig<
  SwitchNetworkResult,
  Error,
  SwitchNetworkArgs
> & {
  throwForSwitchChainNotSupported?: boolean
}

export const mutationKey = (args: UseSwitchNetworkArgs) =>
  [{ entity: 'switchNetwork', chainId: args?.chainId?.() }] as const

const mutationFn = (args: UseSwitchNetworkArgs) => {
  if (!args.chainId?.()) throw new Error('chainId is required')
  return switchNetwork({ chainId: args.chainId() })
}

export const useSwitchNetwork = (
  props?: UseSwitchNetworkArgs & UseSwitchNetworkConfig,
) => {
  const client = useClient()

  const switchNetworkData = createMutation(() => ({
    mutationKey: mutationKey({ chainId: props?.chainId }),
    mutationFn,
    onError: props?.onError,
    onMutate: props?.onMutate,
    onSettled: props?.onSettled,
    onSuccess: props?.onSuccess,
  }))

  const switchNetwork_ = (chainId_?: SwitchNetworkArgs['chainId']) =>
    switchNetworkData.mutate({
      chainId: chainId_ ?? props?.chainId,
    } as SwitchNetworkArgs)

  const switchNetworkAsync_ = (chainId_?: SwitchNetworkArgs['chainId']) =>
    switchNetworkData.mutateAsync({
      chainId: chainId_ ?? props?.chainId,
    } as SwitchNetworkArgs)

  // TODO: implement this when forceUpdate is implemented

  // createEffect(() => {
  //   const unwatch = client.subscribe(
  //     ({ chains, connector }) => ({
  //       chains,
  //       connector,
  //     }),
  //     forceUpdate,
  //   )
  //   return unwatch
  // })

  //let switchNetwork
  //let switchNetworkAsync
  //const supportsSwitchChain = !!client.connector?.switchChain

  // @TODO: check while this is never true on a test env
  // if (props?.throwForSwitchChainNotSupported || supportsSwitchChain) {
  // }
  const switchNetwork = switchNetwork_
  const switchNetworkAsync = switchNetworkAsync_

  return {
    chains: client.chains ?? [],
    switchNetworkData,
    pendingChainId: switchNetworkData.variables?.chainId,
    switchNetwork,
    switchNetworkAsync,
  } as const
}
