import { useContext } from 'react';
import { BridgeHooksContext } from './Provider';

function useAppBridge() {
  const { app } = useContext(BridgeHooksContext);

  if (!app) {
    throw new Error('Failed to bind to context');
  }

  return app;
}

export default useAppBridge;
