import { getClient } from '../../client'
import type { Provider } from '../../types'

export type GetProviderArgs = {
  /** Chain id to use for provider */
  chainId?: number
}

export type GetProviderResult<TProvider extends Provider = Provider> = TProvider

export function getProvider<TProvider extends Provider = Provider>(
  props: GetProviderArgs = {},
): GetProviderResult<TProvider> {
  const client = getClient<TProvider>()
  if (props.chainId)
    return client.getProvider({ chainId: props.chainId }) || client.provider
  return client.provider
}
