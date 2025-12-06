import { http, createConfig } from 'wagmi'
import { mainnet, hoodi } from 'wagmi/chains'
import { metaMask } from 'wagmi/connectors'

const ALCHEMY_KEY = import.meta.env.VITE_ALCHEMY_KEY

export const config = createConfig({
  chains: [mainnet, hoodi],
  connectors: [
    metaMask()
  ],
  transports: {
    [mainnet.id]: http(),
    [hoodi.id]: http(`https://eth-hoodi.g.alchemy.com/v2/${ALCHEMY_KEY}`),
  }
})