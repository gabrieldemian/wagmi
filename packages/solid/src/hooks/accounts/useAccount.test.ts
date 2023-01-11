import { describe, expect, it } from 'vitest'

import { renderHook } from '../../../test'
import { useAccount } from './useAccount'
import { useConnect } from './useConnect'

const useAccountWithConnectAndDisconnect = () => {
  return {
    account: useAccount(),
    connect: useConnect(),
  }
}

const { result } = renderHook(() => useAccountWithConnectAndDisconnect())

describe('useAccount', () => {
  describe('mounts', () => {
    it('is connected', async () => {
      // const connectData = renderHook(() => useConnect())

      console.log('accountData -> ', result.account())

      // console.log('connectData -> ', result.connect())

      expect(true).toBeTruthy()
    })
  })
})
