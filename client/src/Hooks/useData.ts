import { useState, useEffect } from 'react';
import { getData } from '../Data';

interface Options {
  disabled?: boolean;
  poll?: boolean;
  interval?: number;
}

export default function useData<D = any>(url: string, options: Options = {}) {
  const { disabled = false, poll = false, interval = 500 } = options;

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<undefined | Error>(undefined);
  const [data, setData] = useState<undefined | D>(undefined);

  const [counter, setCounter] = useState(0);

  useEffect(() => {
    if (poll) {
      const i = setInterval(() => {
        setCounter((c) => c + 1);
      }, interval);

      return () => {
        clearInterval(i);
      };
    }
  }, [poll, interval]);

  useEffect(() => {
    if (disabled) {
      return;
    }

    // Cancellation flag
    //  will prevent state updates after component unmount
    let cancelled = false;

    setLoading(true);
    setError(undefined);

    getData<D>(url)
      .then((d: D) => {
        if (!cancelled) {
          setData(d);
        }
      })
      .catch((e: Error) => {
        if (!cancelled) {
          setError(e);
        }
      })
      .finally(() => {
        if (!cancelled) {
          setLoading(false);
        }
      });

    return () => {
      cancelled = true;
    };

    // Counter forces a refetch on poll
    // This will refetch the data if the url changes
  }, [url, counter, disabled]);

  return {
    loading,
    error,
    data,
  };
}
