import { env } from '@/lib/env';

export const NEAR_NETWORK = env.NEXT_PUBLIC_NEAR_NETWORK;

export const NEAR_CONFIG = {
  mainnet: {
    networkId: 'mainnet',
    nodeUrl: 'https://rpc.mainnet.near.org',
    walletUrl: 'https://wallet.near.org',
    helperUrl: 'https://helper.mainnet.near.org',
    explorerUrl: 'https://nearblocks.io',
  },
  testnet: {
    networkId: 'testnet',
    nodeUrl: 'https://rpc.testnet.near.org',
    walletUrl: 'https://testnet.mynearwallet.com',
    helperUrl: 'https://helper.testnet.near.org',
    explorerUrl: 'https://testnet.nearblocks.io',
  },
} as const;

export function getNearConfig() {
  return NEAR_CONFIG[NEAR_NETWORK];
}
