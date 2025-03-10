import { waitFor } from '@solidjs/testing-library'
import { describe, expect, it } from 'vitest'

import { renderHook, switchNetwork } from '../../../test'
import { useAccount } from './useAccount'
import { useConnect } from './useConnect'
import { useDisconnect } from './useDisconnect'
import { useSigner } from './useSigner'
import { useSwitchNetwork } from './useSwitchNetwork'

function useSignerWithAccount() {
  return {
    connect: useConnect(),
    disconnect: useDisconnect(),
    switchNetwork: useSwitchNetwork(),
    account: useAccount(),
    signer: useSigner(),
  }
}

describe('useSigner', () => {
  describe('mounts', () => {
    it('is connected', async () => {
      const { result } = renderHook(() => useSignerWithAccount())

      await result.connect.connectAsync()
      await waitFor(() => expect(result.account().isConnected).toBeTruthy())

      await waitFor(() => expect(result.signer.isSuccess).toBeTruthy())

      expect(result.signer).toMatchInlineSnapshot(`
        {
          "data": WalletSigner {
            "_isSigner": true,
            "_mnemonic": [Function],
            "_signingKey": [Function],
            "address": "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266",
            "provider": "<Provider network={1} />",
          },
          "dataUpdatedAt": 1643673600000,
          "error": null,
          "errorUpdateCount": 0,
          "errorUpdatedAt": 0,
          "failureCount": 0,
          "failureReason": null,
          "fetchStatus": "idle",
          "isError": false,
          "isFetched": true,
          "isFetchedAfterMount": true,
          "isFetching": false,
          "isInitialLoading": false,
          "isLoading": false,
          "isLoadingError": false,
          "isPaused": false,
          "isPending": false,
          "isPlaceholderData": false,
          "isRefetchError": false,
          "isRefetching": false,
          "isStale": false,
          "isSuccess": true,
          "refetch": [Function],
          "status": "success",
        }
      `)
    })

    it('is not connected', async () => {
      const { result } = renderHook(() => useSigner())

      await waitFor(() => expect(result.fetchStatus).toBe('idle'))

      expect(result).toMatchInlineSnapshot(`
        {
          "data": WalletSigner {
            "_isSigner": true,
            "_mnemonic": [Function],
            "_signingKey": [Function],
            "address": "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266",
            "provider": "<Provider network={1} />",
          },
          "dataUpdatedAt": 1643673600000,
          "error": null,
          "errorUpdateCount": 0,
          "errorUpdatedAt": 0,
          "failureCount": 0,
          "failureReason": null,
          "fetchStatus": "idle",
          "isError": false,
          "isFetched": true,
          "isFetchedAfterMount": false,
          "isFetching": false,
          "isInitialLoading": false,
          "isLoading": false,
          "isLoadingError": false,
          "isPaused": false,
          "isPending": false,
          "isPlaceholderData": false,
          "isRefetchError": false,
          "isRefetching": false,
          "isStale": false,
          "isSuccess": true,
          "refetch": [Function],
          "status": "success",
        }
      `)
    })
  })

  describe('behavior', () => {
    it('updates on connect and disconnect', async () => {
      const utils = renderHook(() => useSignerWithAccount())
      const { result } = utils

      await result.connect.connectAsync()

      await waitFor(() => expect(result.signer.isSuccess).toBeTruthy())

      expect(result.signer).toMatchInlineSnapshot(`
        {
          "data": WalletSigner {
            "_isSigner": true,
            "_mnemonic": [Function],
            "_signingKey": [Function],
            "address": "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266",
            "provider": "<Provider network={1} />",
          },
          "dataUpdatedAt": 1643673600000,
          "error": null,
          "errorUpdateCount": 0,
          "errorUpdatedAt": 0,
          "failureCount": 0,
          "failureReason": null,
          "fetchStatus": "idle",
          "isError": false,
          "isFetched": true,
          "isFetchedAfterMount": false,
          "isFetching": false,
          "isInitialLoading": false,
          "isLoading": false,
          "isLoadingError": false,
          "isPaused": false,
          "isPending": false,
          "isPlaceholderData": false,
          "isRefetchError": false,
          "isRefetching": false,
          "isStale": false,
          "isSuccess": true,
          "refetch": [Function],
          "status": "success",
        }
      `)

      await result.disconnect.disconnectData.mutateAsync()
      await waitFor(() => expect(result.account().isDisconnected).toBeTruthy())

      await waitFor(() => expect(result.account().isDisconnected).toBeTruthy())

      expect(result.signer).toMatchInlineSnapshot(`
        {
          "data": WalletSigner {
            "_isSigner": true,
            "_mnemonic": [Function],
            "_signingKey": [Function],
            "address": "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266",
            "provider": "<Provider network={1} />",
          },
          "dataUpdatedAt": 1643673600000,
          "error": null,
          "errorUpdateCount": 0,
          "errorUpdatedAt": 0,
          "failureCount": 0,
          "failureReason": null,
          "fetchStatus": "idle",
          "isError": false,
          "isFetched": true,
          "isFetchedAfterMount": false,
          "isFetching": false,
          "isInitialLoading": false,
          "isLoading": false,
          "isLoadingError": false,
          "isPaused": false,
          "isPending": false,
          "isPlaceholderData": false,
          "isRefetchError": false,
          "isRefetching": false,
          "isStale": false,
          "isSuccess": true,
          "refetch": [Function],
          "status": "success",
        }
      `)
    })

    it('updates on network', async () => {
      const utils = renderHook(() => useSignerWithAccount())
      const { result } = utils

      await result.connect.connectAsync()
      await waitFor(() => expect(result.account().isConnected).toBeTruthy())

      await waitFor(() => expect(result.signer.isSuccess).toBeTruthy())

      expect(result.signer).toMatchInlineSnapshot(`
        {
          "data": WalletSigner {
            "_isSigner": true,
            "_mnemonic": [Function],
            "_signingKey": [Function],
            "address": "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266",
            "provider": "<Provider network={1} />",
          },
          "dataUpdatedAt": 1643673600000,
          "error": null,
          "errorUpdateCount": 0,
          "errorUpdatedAt": 0,
          "failureCount": 0,
          "failureReason": null,
          "fetchStatus": "idle",
          "isError": false,
          "isFetched": true,
          "isFetchedAfterMount": true,
          "isFetching": false,
          "isInitialLoading": false,
          "isLoading": false,
          "isLoadingError": false,
          "isPaused": false,
          "isPending": false,
          "isPlaceholderData": false,
          "isRefetchError": false,
          "isRefetching": false,
          "isStale": false,
          "isSuccess": true,
          "refetch": [Function],
          "status": "success",
        }
      `)

      await switchNetwork({ utils, chainId: () => 1 })

      await waitFor(() => expect(result.signer.isSuccess).toBeTruthy())

      expect(result.signer).toMatchInlineSnapshot(`
        {
          "data": WalletSigner {
            "_isSigner": true,
            "_mnemonic": [Function],
            "_signingKey": [Function],
            "address": "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266",
            "provider": "<Provider network={1} />",
          },
          "dataUpdatedAt": 1643673600000,
          "error": null,
          "errorUpdateCount": 0,
          "errorUpdatedAt": 0,
          "failureCount": 0,
          "failureReason": null,
          "fetchStatus": "idle",
          "isError": false,
          "isFetched": true,
          "isFetchedAfterMount": true,
          "isFetching": false,
          "isInitialLoading": false,
          "isLoading": false,
          "isLoadingError": false,
          "isPaused": false,
          "isPending": false,
          "isPlaceholderData": false,
          "isRefetchError": false,
          "isRefetching": false,
          "isStale": false,
          "isSuccess": true,
          "refetch": [Function],
          "status": "success",
        }
      `)
    })
  })
})
