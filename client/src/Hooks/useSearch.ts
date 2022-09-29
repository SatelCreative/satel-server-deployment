import { useState, useEffect } from 'react';
import Fuse from 'fuse.js';

export function useSearch<T = any>(
  items: T[],
  options: Fuse.IFuseOptions<any>,
) {
  const [fuse] = useState(new Fuse(items, options));
  const [searchedItems, setSearchedItems] = useState(items);
  const [query, setQuery] = useState('');

  useEffect(() => {
    fuse.setCollection(items);
  }, [fuse, items]);

  useEffect(() => {
    if (!query) {
      setSearchedItems(items);
      return;
    }

    setSearchedItems(fuse.search(query).map((value) => value.item));
  }, [query, items, fuse]);

  const r: [T[], string, typeof setQuery] = [searchedItems, query, setQuery];
  return r;
}
