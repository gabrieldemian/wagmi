import type { Accessor } from 'solid-js'

import { useProvider } from '../providers'

export type UseChainIdArgs = {
  chainId: Accessor<number>
}

export function useChainId(props?: UseChainIdArgs) {
  const provider = useProvider({ chainId: props?.chainId })
  return provider()?.network.chainId
}
