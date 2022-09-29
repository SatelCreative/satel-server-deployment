import { useState, useEffect } from 'react';

export function useResource<T>(loadResource: () => Promise<T>) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState();
  const [resource, setResource] = useState<T>();

  useEffect(() => {
    loadResource()
      .then((r: T) => {
        setResource(r);
        setLoading(false);
      })
      .catch((e) => {
        // eslint-disable-next-line no-console
        console.warn(e);
        setError(e);
        setLoading(false);
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return {
    loading,
    error,
    resource,
  };
}
