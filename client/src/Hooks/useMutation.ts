import { useState, useCallback } from 'react';
import { getData } from '../Data';

export default function useMutation<D = any>(url: string) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<undefined | Error>(undefined);
  const [mutationData, setData] = useState<undefined | D>(undefined);

  const mutate = useCallback(() => {
    setLoading(true);
    setError(undefined);

    getData<D>(url)
      .then((d: D) => {
        setData(d);
      })
      .catch((e: Error) => {
        setError(e);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [url]);

  const args = {
    loading,
    error,
    mutationData,
  };

  return [mutate, args] as [typeof mutate, typeof args];
}
