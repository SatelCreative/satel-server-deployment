import shortid from 'shortid';
import { ToastConfig } from './useToast';

export enum ActionType {
  LoadingStart = 'LOADING_START',
  LoadingStop = 'LOADING_STOP',
  ToastPush = 'TOAST_PUSH',
  ToastPop = 'TOAST_POP',
}

// LOADING

interface LoadingStartAction {
  type: ActionType.LoadingStart;
  payload: {
    id: string;
  };
}

interface LoadingStopAction {
  type: ActionType.LoadingStop;
  payload: {
    id: string;
  };
}

// TOAST
interface Toast {
  id: string;
  message: string;
  error: boolean;
  duration: number;
  priority: number;
}

interface ToastPushAction {
  type: ActionType.ToastPush;
  payload: {
    toast: ToastConfig;
  };
}

interface ToastPopAction {
  type: ActionType.ToastPop;
  payload: {
    id: string;
  };
}

export type Action =
  | LoadingStartAction
  | LoadingStopAction
  | ToastPushAction
  | ToastPopAction;

interface State {
  /**
   * Overall global loading state
   */
  loading: boolean;
  /**
   * Contains ids of loading components
   */
  loadingQueue: string[];
  /**
   * List of toasts to show
   */
  toastQueue: Toast[];
}

export const initialState: State = {
  loading: false,
  loadingQueue: [],
  toastQueue: [],
};

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case ActionType.LoadingStart: {
      const { id } = action.payload;

      if (state.loading === true && state.loadingQueue.includes(id)) {
        return state;
      }

      return {
        ...state,
        loading: true,
        loadingQueue: [...state.loadingQueue.filter((i) => i !== id), id],
      };
    }
    case ActionType.LoadingStop: {
      const { id } = action.payload;

      if (!state.loadingQueue.includes(id)) {
        return state;
      }

      const loadingQueue = state.loadingQueue.filter((i) => i !== id);

      return { ...state, loading: loadingQueue.length > 0, loadingQueue };
    }
    case ActionType.ToastPush: {
      const id = shortid.generate();
      const toast: Toast = {
        id,
        error: false,
        duration: 2000,
        priority: action.payload.toast.error ? 1 : 0,
        ...action.payload.toast,
      };

      // Handle priority
      const toastQueue = [...state.toastQueue, toast].sort(
        (a, b) => b.priority - a.priority,
      );

      return { ...state, toastQueue };
    }
    case ActionType.ToastPop: {
      const { id } = action.payload;

      return {
        ...state,
        toastQueue: state.toastQueue.filter((t) => t.id !== id),
      };
    }
    default:
      throw new Error(`Invalid action type '${(action as any).type}'`);
  }
}

export default reducer;
