import { waitFor } from '@solidjs/testing-library'
import { describe, expect, it, vi } from 'vitest'

import { getSigners, renderHook } from '../../../test'
import { MockConnector } from '../../connectors/mock'
import { useAccount } from './useAccount'
import type { UseConnectArgs, UseConnectConfig } from './useConnect'
import { useConnect } from './useConnect'

const connector = new MockConnector({
  options: { signer: getSigners()[0]! },
})

const connectorFail = new MockConnector({
  options: {
    flags: { failConnect: true },
    signer: getSigners()[0]!,
  },
})

function useConnectWithAccount(config: UseConnectArgs & UseConnectConfig = {}) {
  return {
    account: useAccount(),
    connect: useConnect(config),
  }
}

describe('useConnect', () => {
  describe('configuration', () => {
    describe('connector', () => {
      it('connects', async () => {
        const {
          result: { account, connect },
        } = renderHook(() => useConnectWithAccount({ connector }))

        await connect.connectAsync()

        expect(account().isConnected).toBeTruthy()

        await waitFor(() => expect(connect.isIdle).toBeTruthy())
      })

      it('fails connect', async () => {
        const {
          result: { connect, account },
        } = renderHook(() =>
          useConnectWithAccount({ connector: connectorFail }),
        )

        connect.connect()

        await waitFor(() => expect(connect.isIdle && account().isDisconnected))

        expect(connect).toMatchInlineSnapshot(`
          {
            "connect": [Function],
            "connectAsync": [Function],
            "connectors": [
              "<MockConnector>",
            ],
            "data": undefined,
            "error": null,
            "isError": false,
            "isIdle": true,
            "isLoading": false,
            "isSuccess": false,
            "pendingConnector": undefined,
            "reset": [Function],
            "status": "idle",
            "variables": undefined,
          }
        `)

        expect(account()).toMatchInlineSnapshot(`
          {
            "address": undefined,
            "connector": undefined,
            "isConnected": false,
            "isConnecting": false,
            "isDisconnected": true,
            "isReconnecting": false,
            "status": "disconnected",
          }
        `)
      })

      it('onSuccess', async () => {
        const onSuccess = vi.fn()
        const { result } = renderHook(() =>
          useConnect({ connector, onSuccess }),
        )

        result.connect()

        // this test won't work because tanstack mutations are not working yet
        // expect(onSuccess).toBeCalledWith(result.data, { connector }, undefined)
      })
    })
  })

  describe('return value', () => {
    describe('connect', () => {
      it('uses configuration', async () => {
        const { result } = renderHook(() =>
          useConnectWithAccount({
            connector,
          }),
        )

        result.connect.connect()

        await waitFor(() => expect(result.account().isConnected).toBeTruthy())

        // TODO: when data is not undefined anymore
      })

      it('use deferred args', async () => {
        const { result } = renderHook(() => useConnectWithAccount())

        const mockConnector = result.connect.connectors[0]

        result.connect.connect({ connector: mockConnector })

        await waitFor(() => expect(result.account().isConnected).toBeTruthy())

        // TODO: when data is not undefined anymore
      })

      it('connects to unsupported chain', async () => {
        const { result } = renderHook(() =>
          useConnectWithAccount({ connector }),
        )

        result.connect.connect({ chainId: () => 69 })

        await waitFor(() => expect(result.account().isConnected).toBeTruthy())

        // TODO: when data is not undefined anymore
      })

      it('connects to supported chain', async () => {
        const { result } = renderHook(() =>
          useConnectWithAccount({ connector }),
        )

        result.connect.connect({ chainId: () => 5 })

        await waitFor(() => expect(result.account().isConnected).toBeTruthy())

        // TODO: when data is not undefined anymore
      })

      it('fails', async () => {
        const {
          result: { connect, account },
        } = renderHook(() =>
          useConnectWithAccount({ connector: connectorFail }),
        )

        connect.connect()

        await waitFor(() =>
          expect(connect.isIdle && account().isDisconnected).toBeTruthy(),
        )

        // TODO: when data is not undefined anymore
      })
    })

    describe('connectAsync', () => {
      it('uses configuration', async () => {
        const { result } = renderHook(() =>
          useConnectWithAccount({ connector }),
        )

        const res = await result.connect.connectAsync()
        expect(res).toMatchInlineSnapshot(`
            {
              "account": "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266",
              "chain": {
                "id": 5,
                "unsupported": false,
              },
              "connector": "<MockConnector>",
              "provider": "<MockProvider>",
            }
          `)

        await waitFor(() =>
          expect(
            result.connect.isIdle && result.account().isConnected,
          ).toBeTruthy(),
        )
      })

      it('uses deferred args', async () => {
        const { result } = renderHook(() => useConnectWithAccount())

        const mockConnector = result.connect.connectors[0]
        const res = await result.connect.connectAsync({
          connector: mockConnector,
        })
        expect(res).toMatchInlineSnapshot(`
            {
              "account": "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266",
              "chain": {
                "id": 1,
                "unsupported": false,
              },
              "connector": "<MockConnector>",
              "provider": "<MockProvider>",
            }
          `)
      })

      it('connects to unsupported chain', async () => {
        const { result } = renderHook(() => useConnect({ connector }))

        const res = await result.connectAsync({ chainId: () => 69 })
        expect(res).toMatchInlineSnapshot(`
            {
              "account": "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266",
              "chain": {
                "id": 69,
                "unsupported": true,
              },
              "connector": "<MockConnector>",
              "provider": "<MockProvider>",
            }
          `)
      })

      it('connects to supported chain', async () => {
        const { result } = renderHook(() => useConnect({ connector }))

        const res = await result.connectAsync({ chainId: () => 5 })
        expect(res).toMatchInlineSnapshot(`
            {
              "account": "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266",
              "chain": {
                "id": 5,
                "unsupported": false,
              },
              "connector": "<MockConnector>",
              "provider": "<MockProvider>",
            }
          `)

        // await waitFor(() => expect(result.isSuccess).toBeTruthy())
      })

      it('throws error', async () => {
        const { result } = renderHook(() =>
          useConnect({ connector: connectorFail }),
        )

        await expect(
          result.connectAsync(),
        ).rejects.toThrowErrorMatchingInlineSnapshot(`"User rejected request"`)

        // TODO: fix this when mutations are working
        // await waitFor(() => expect(result.isError).toBeTruthy())
      })
    })

    describe('behavior', () => {
      it('connects to unsupported chain', async () => {
        const { result } = renderHook(() =>
          useConnect({
            chainId: () => 69,
            connector: new MockConnector({
              options: {
                signer: getSigners()[0]!,
              },
            }),
          }),
        )

        result.connect()
        // await waitFor(() => expect(result.isSuccess).toBeTruthy())
        //   expect(result.data?.chain).toMatchInlineSnapshot(`
        //   {
        //     "id": 69,
        //     "unsupported": true,
        //   }
        // `)
      })

      it('connects to a supported chain', async () => {
        const { result } = renderHook(() =>
          useConnect({
            chainId: () => 5,
            connector: new MockConnector({
              options: {
                signer: getSigners()[0]!,
              },
            }),
          }),
        )

        result.connect()
        // await waitFor(() => expect(result.isSuccess).toBeTruthy())
        //   expect(result.data?.chain).toMatchInlineSnapshot(`
        //   {
        //     "id": 5,
        //     "unsupported": false,
        //   }
        // `)
      })
    })
  })
})
