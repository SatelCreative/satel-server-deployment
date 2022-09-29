import React, {
  createContext,
  useState,
  useEffect,
  ReactNode,
  useReducer,
  Dispatch,
  useMemo,
} from 'react';
import { ClientApplication } from '@shopify/app-bridge';
import { useAppBridge } from '@shopify/app-bridge-react';
import { Loading, Toast } from '@shopify/app-bridge/actions';

import reducer, { initialState, Action, ActionType } from './reducer';

interface BridgeHooksContext {
  dispatch: Dispatch<Action>;
  app: ClientApplication<any>;
}

export const BridgeHooksContext = createContext<BridgeHooksContext>({} as any);

interface ProviderProps {
  children: ReactNode;
}

function Provider(props: ProviderProps) {
  const { children } = props;
  const [state, dispatch] = useReducer(reducer, initialState);

  const app = useAppBridge();
  const [loading] = useState(() => Loading.create(app));

  // Loading
  useEffect(() => {
    if (!loading) {
      return;
    }

    if (state.loading) {
      loading.dispatch(Loading.Action.START);
    } else {
      loading.dispatch(Loading.Action.STOP);
    }
  }, [loading, state.loading]);

  // Toast
  const [toast, setToast] = useState<Toast.Toast>();
  useEffect(() => {
    if (app && !toast && state.toastQueue.length) {
      const t = state.toastQueue[0];

      const polarisToast = Toast.create(app, {
        message: t.message,
        duration: t.duration,
        isError: t.error,
      });

      polarisToast.dispatch(Toast.Action.SHOW);

      setToast(polarisToast);

      dispatch({ type: ActionType.ToastPop, payload: { id: t.id } });
    }

    if (toast) {
      return toast.subscribe(Toast.Action.CLEAR, () => {
        setToast(undefined);
      });
    }
  }, [app, toast, state.toastQueue]);

  const response = useMemo(
    () => (
      <BridgeHooksContext.Provider value={{ dispatch, app }}>
        {children}
      </BridgeHooksContext.Provider>
    ),
    [app, children],
  );

  return response;
}

export default Provider;
