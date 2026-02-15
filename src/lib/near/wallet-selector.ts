import { NearConnector } from '@hot-labs/near-connect';
import { NEAR_NETWORK } from './config';

let connectorInstance: NearConnector | null = null;

export function initConnector(): NearConnector {
  if (connectorInstance) return connectorInstance;

  connectorInstance = new NearConnector({
    network: NEAR_NETWORK as 'mainnet' | 'testnet',
    autoConnect: true,
  });

  return connectorInstance;
}

export function getConnector(): NearConnector | null {
  return connectorInstance;
}
