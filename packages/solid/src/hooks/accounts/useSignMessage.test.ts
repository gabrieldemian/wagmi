import { waitFor } from '@solidjs/testing-library'
import { toUtf8Bytes, verifyMessage } from 'ethers/lib/utils.js'
import { describe, expect, it, vi } from 'vitest'

import { renderHook } from '../../../test'
import { useAccount } from './useAccount'
import { useConnect } from './useConnect'
import type { UseSignMessageArgs, UseSignMessageConfig } from './useSignMessage'
import { useSignMessage } from './useSignMessage'

const messages = {
  string: 'The quick brown fox jumped over the lazy dogs.',
  bytes: toUtf8Bytes('The quick brown fox jumped over the lazy dogs.'),
}

function useSignMessageWithConnect(
  config: UseSignMessageArgs & UseSignMessageConfig = {},
) {
  return {
    connect: useConnect(),
    account: useAccount(),
    signMessage: useSignMessage(config),
  }
}

describe('useSignMessage', () => {
  it('mounts', () => {
    const { result } = renderHook(() => useSignMessage())
    expect(result).toMatchInlineSnapshot(`
      {
        "data": undefined,
        "error": null,
        "isError": false,
        "isIdle": true,
        "isLoading": false,
        "isSuccess": false,
        "reset": [Function],
        "signMessage": [Function],
        "signMessageAsync": [Function],
        "status": "idle",
        "variables": undefined,
      }
    `)
  })

  describe('configuration', () => {
    it('onSuccess', async () => {
      const onSuccess = vi.fn()
      const { result } = renderHook(() =>
        useSignMessageWithConnect({
          message: () => messages.string,
          onSuccess,
        }),
      )

      await result.connect.connectAsync()
      await waitFor(() => expect(result.account().isConnected).toBeTruthy())

      await result.signMessage.signMessageAsync()

      await waitFor(() => expect(result.signMessage.isSuccess).toBeTruthy())
      expect(onSuccess).toBeCalledWith(
        result.signMessage.data,
        { message: messages.string },
        undefined,
      )
    })
  })

  describe('return value', () => {
    describe('signMessage', () => {
      it('uses configuration', async () => {
        const { result } = renderHook(() =>
          useSignMessageWithConnect({
            message: () => messages.string,
          }),
        )

        await result.connect.connectAsync()
        await waitFor(() => expect(result.account().isConnected).toBeTruthy())

        await result.signMessage.signMessage()
        await waitFor(() => expect(result.signMessage.isSuccess).toBeTruthy())
        expect(result.signMessage).toMatchInlineSnapshot(`
          {
            "data": "0x4a05822c986433a093433ba479c8f500fd70215e8864241035498db99107e8a56b34b373e0a3580dc9f532d610341cd83ccdfc623a6545a865314200acfe4f151c",
            "error": null,
            "isError": false,
            "isIdle": false,
            "isLoading": false,
            "isSuccess": true,
            "reset": [Function],
            "signMessage": [Function],
            "signMessageAsync": [Function],
            "status": "success",
            "variables": {
              "message": "The quick brown fox jumped over the lazy dogs.",
            },
          }
        `)
      })

      it('uses deferred args', async () => {
        const { result } = renderHook(() => useSignMessageWithConnect())

        await result.connect.connectAsync()
        await waitFor(() => expect(result.account().isConnected).toBeTruthy())

        await result.signMessage.signMessage({
          message: messages.string,
        })

        await waitFor(() => expect(result.signMessage.isSuccess).toBeTruthy())
        expect(result.signMessage).toMatchInlineSnapshot(`
          {
            "data": "0x4a05822c986433a093433ba479c8f500fd70215e8864241035498db99107e8a56b34b373e0a3580dc9f532d610341cd83ccdfc623a6545a865314200acfe4f151c",
            "error": null,
            "isError": false,
            "isIdle": false,
            "isLoading": false,
            "isSuccess": true,
            "reset": [Function],
            "signMessage": [Function],
            "signMessageAsync": [Function],
            "status": "success",
            "variables": {
              "message": "The quick brown fox jumped over the lazy dogs.",
            },
          }
        `)
      })

      it('fails', async () => {
        const { result } = renderHook(() => useSignMessageWithConnect())

        await result.connect.connectAsync()
        await waitFor(() => expect(result.account().isConnected).toBeTruthy())

        await result.signMessage.signMessage()
        await waitFor(() => expect(result.signMessage.isError).toBeTruthy())
        expect(result.signMessage).toMatchInlineSnapshot(`
          {
            "data": undefined,
            "error": [Error: message is required],
            "isError": true,
            "isIdle": false,
            "isLoading": false,
            "isSuccess": false,
            "reset": [Function],
            "signMessage": [Function],
            "signMessageAsync": [Function],
            "status": "error",
            "variables": {
              "message": undefined,
            },
          }
        `)
      })
    })

    describe('signMessageAsync', () => {
      it('uses configuration', async () => {
        const { result } = renderHook(() =>
          useSignMessageWithConnect({
            message: () => messages.string,
          }),
        )
        await result.connect.connectAsync()
        await waitFor(() => expect(result.account().isConnected).toBeTruthy())

        const res = await result.signMessage.signMessage()
        expect(res).toMatchInlineSnapshot(
          `"0x4a05822c986433a093433ba479c8f500fd70215e8864241035498db99107e8a56b34b373e0a3580dc9f532d610341cd83ccdfc623a6545a865314200acfe4f151c"`,
        )

        await waitFor(() => expect(result.signMessage.isSuccess).toBeTruthy())
      })

      it('throws error', async () => {
        const { result } = renderHook(() => useSignMessageWithConnect())
        await result.connect.connectAsync()
        await waitFor(() => expect(result.account().isConnected).toBeTruthy())

        await expect(
          result.signMessage.signMessageAsync(),
        ).rejects.toThrowErrorMatchingInlineSnapshot(`"message is required"`)

        await waitFor(() => expect(result.signMessage.isError).toBeTruthy())
      })
    })
  })

  describe('behavior', () => {
    it('can sign bytes message', async () => {
      const { result } = renderHook(() =>
        useSignMessageWithConnect({
          message: () => messages.bytes,
        }),
      )
      await result.connect.connectAsync()
      await waitFor(() => expect(result.account().isConnected).toBeTruthy())

      await result.signMessage.signMessage()
      await waitFor(() => expect(result.signMessage.isSuccess).toBeTruthy())

      expect(result.signMessage).toMatchInlineSnapshot(`
        {
          "data": "0x4a05822c986433a093433ba479c8f500fd70215e8864241035498db99107e8a56b34b373e0a3580dc9f532d610341cd83ccdfc623a6545a865314200acfe4f151c",
          "error": null,
          "isError": false,
          "isIdle": false,
          "isLoading": false,
          "isSuccess": true,
          "reset": [Function],
          "signMessage": [Function],
          "signMessageAsync": [Function],
          "status": "success",
          "variables": {
            "message": Uint8Array [
              84,
              104,
              101,
              32,
              113,
              117,
              105,
              99,
              107,
              32,
              98,
              114,
              111,
              119,
              110,
              32,
              102,
              111,
              120,
              32,
              106,
              117,
              109,
              112,
              101,
              100,
              32,
              111,
              118,
              101,
              114,
              32,
              116,
              104,
              101,
              32,
              108,
              97,
              122,
              121,
              32,
              100,
              111,
              103,
              115,
              46,
            ],
          },
        }
      `)
    })

    it('can verify message', async () => {
      const { result } = renderHook(() =>
        useSignMessageWithConnect({
          message: () => messages.string,
        }),
      )
      await result.connect.connectAsync()
      await waitFor(() => expect(result.account().isConnected).toBeTruthy())

      await result.signMessage.signMessage()
      await waitFor(() => expect(result.signMessage.isSuccess).toBeTruthy())
      expect(
        verifyMessage(messages.string, result.signMessage.data as string),
      ).toMatchInlineSnapshot(`"0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266"`)
    })
  })
})
