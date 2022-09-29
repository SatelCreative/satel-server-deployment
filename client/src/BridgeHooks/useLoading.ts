import { useState, useEffect, useContext, useMemo, useCallback } from 'react';
import shortid from 'shortid';
import { BridgeHooksContext } from './Provider';
import { ActionType } from './reducer';

export interface UseLoadingConfig {
  /**
   * If enabled, will use the passed in initial
   * value as the loading state. Otherwise will
   * hold the state internally
   */
  controlled: boolean;
}

const defaultOptions: UseLoadingConfig = {
  controlled: false,
};

function useLoading(
  value = false,
  options: Partial<UseLoadingConfig> = {},
): [boolean, (loading: boolean) => void] {
  const { dispatch } = useContext(BridgeHooksContext);

  // Not using memo because react "forgets" sometimes
  const [id] = useState(shortid.generate());
  const [internalLoading, setLoading] = useState(value);

  const config = useMemo(
    () => ({
      ...defaultOptions,
      ...options,
    }),
    [options],
  );

  // Custom state setter
  const handleSetLoading = useCallback(
    (loading: boolean) => {
      if (config.controlled) {
        throw new Error(
          'Cannot setState when useLoading when options.controlled === true',
        );
      }

      setLoading(loading);
    },
    [config.controlled],
  );

  // Switch over source of truth
  const loading = useMemo(() => {
    if (config.controlled) {
      return value;
    }
    return internalLoading;
  }, [config.controlled, internalLoading, value]);

  // Keep global in sync
  useEffect(() => {
    if (loading) {
      dispatch({ type: ActionType.LoadingStart, payload: { id } });
    } else {
      dispatch({ type: ActionType.LoadingStop, payload: { id } });
    }
  }, [dispatch, id, loading]);

  // Clear loading when unmounted
  useEffect(
    () => () => {
      dispatch({ type: ActionType.LoadingStop, payload: { id } });
    },
    [dispatch, id],
  );

  return [loading, handleSetLoading];
}

export default useLoading;
