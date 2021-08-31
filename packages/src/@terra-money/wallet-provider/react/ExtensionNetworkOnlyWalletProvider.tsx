import { ChromeExtensionController } from '@terra-dev/chrome-extension';
import { Wallet, WalletContext, WalletStatus } from '@terra-dev/use-wallet';
import { NetworkInfo } from '@terra-dev/wallet-types';
import React, {
  ReactNode,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react';

export interface ExtensionNetworkOnlyWalletProviderProps {
  children: ReactNode;
  defaultNetwork: NetworkInfo;
}

export function ExtensionNetworkOnlyWalletProvider({
  children,
  defaultNetwork,
}: ExtensionNetworkOnlyWalletProviderProps) {
  const [controller] = useState<ChromeExtensionController>(
    () =>
      new ChromeExtensionController({
        defaultNetwork,
        enableWalletConnection: false,
        dangerously__chromeExtensionCompatibleBrowserCheck: () => false,
      }),
  );

  const [network, setNetwork] = useState<NetworkInfo>(defaultNetwork);

  const post = useCallback(async () => {
    throw new Error(
      `<ExtensionNetworkOnlyWalletProvider> does not support post()`,
    );
  }, []);

  useEffect(() => {
    const networkSubscription = controller.networkInfo().subscribe({
      next: (value) => {
        setNetwork(value);
      },
    });

    return () => {
      networkSubscription.unsubscribe();
    };
  }, [controller]);

  const state = useMemo<Wallet>(() => {
    return {
      availableConnectTypes: [],
      availableInstallTypes: [],
      status: WalletStatus.WALLET_NOT_CONNECTED,
      network,
      wallets: [],
      install: () => {
        throw new Error('not implemented!');
      },
      connect: () => {
        throw new Error('not implemented!');
      },
      connectReadonly: () => {
        throw new Error('not implemented!');
      },
      disconnect: () => {
        throw new Error('not implemented!');
      },
      post,
      recheckStatus: controller.recheckStatus,
      isChromeExtensionCompatibleBrowser: () => {
        throw new Error('not implemented!');
      },
    };
  }, [controller.recheckStatus, network, post]);

  return (
    <WalletContext.Provider value={state}>{children}</WalletContext.Provider>
  );
}
