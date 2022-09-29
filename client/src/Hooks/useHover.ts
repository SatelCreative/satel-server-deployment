import { useEffect, useRef, useState, RefObject } from 'react';

// Adapted from https://usehooks.com/useHover/

export function useHover<R extends HTMLElement>() {
  const [value, setValue] = useState(false);

  const ref = useRef<R>(null);

  const handleMouseOver = () => setValue(true);
  const handleMouseOut = () => setValue(false);

  useEffect(() => {
    const node = ref.current;
    if (node) {
      node.addEventListener('mouseover', handleMouseOver);
      node.addEventListener('mouseout', handleMouseOut);

      return () => {
        node.removeEventListener('mouseover', handleMouseOver);
        node.removeEventListener('mouseout', handleMouseOut);
      };
    }
  }, []); // Recall only if ref changes

  return [ref, value] as [RefObject<R>, boolean];
}
