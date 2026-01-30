import { setupWalletSelector } from '@near-wallet-selector/core';
import { setupMyNearWallet } from '@near-wallet-selector/my-near-wallet';
import { setupMeteorWallet } from '@near-wallet-selector/meteor-wallet';
import { setupHereWallet } from '@near-wallet-selector/here-wallet';
import { setupModal } from '@near-wallet-selector/modal-ui';
import { NEAR_NETWORK } from './config';

export async function initWalletSelector() {
  const selector = await setupWalletSelector({
    network: NEAR_NETWORK,
    modules: [
      setupMyNearWallet(),
      setupMeteorWallet(),
      setupHereWallet(),
    ],
  });

  const modal = setupModal(selector, {
    contractId: '', // No contract needed for auth-only
  });

  return { selector, modal };
}
