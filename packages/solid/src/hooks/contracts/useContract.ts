import type { GetContractArgs, GetContractResult } from '@wagmi/core'
import { getContract } from '@wagmi/core'
import type { Abi, Address } from 'abitype'

import type { Accessor } from 'solid-js'
import { createMemo } from 'solid-js'

export type UseContractConfig<TAbi extends Abi | readonly unknown[] = Abi> =
  Partial<Pick<GetContractArgs<TAbi>, 'abi'>> & {
    /** Signer or provider to attach to contract */
    signerOrProvider?: GetContractArgs['signerOrProvider'] | null
    address: Accessor<Address> | undefined
  }

export function useContract<TAbi extends Abi | readonly unknown[]>(
  props?: UseContractConfig<TAbi>,
) {
  return createMemo<GetContractResult<TAbi> | null>(() => {
    if (!props?.address || !props.abi) return null

    return getContract({
      address: props.address(),
      abi: props.abi,
      signerOrProvider:
        props.signerOrProvider === null ? undefined : props.signerOrProvider,
    })
  })
}
