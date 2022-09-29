import { useContext, useCallback } from 'react';
import { BridgeHooksContext } from './Provider';
import { ActionType } from './reducer';

export interface ToastConfig {
  /**
   * Content of the toast
   */
  message: string;

  /**
   * If this toast denotes an error
   */
  error?: boolean;

  /**
   * Length to show the toast for in ms.
   * By default will be 2000
   */
  duration?: number;

  /**
   * This can be used to give a toast
   * priority in the queue. By default 0
   */
  priority?: number;
}

function useToast() {
  const { dispatch } = useContext(BridgeHooksContext);

  return useCallback(
    (toast: ToastConfig) => {
      dispatch({ type: ActionType.ToastPush, payload: { toast } });
    },
    [dispatch],
  );
}

export default useToast;
