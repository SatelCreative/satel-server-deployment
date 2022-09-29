import { useCallback, useEffect, useReducer, Reducer } from 'react';
import { useDebounce } from 'use-debounce';
import { AppliedFilter, Filter } from '../types';

export interface LoadItemsProps {
  query?: string;
  page?: number;
  filters: AppliedFilter[];
}

export interface LoadItemsPayload<R> {
  items: R[];
  hasNextPage: boolean;
}

export interface PaginatedResourceProps<R> {
  /**
   * Data loading function. Requires a specific format
   */
  loadItems: (props: LoadItemsProps) => Promise<LoadItemsPayload<R>>;

  filters?: Filter[];

  // /**
  //  * Event emitter for actions on page change
  //  * for example scrolling to top of results
  //  */
  // onPageChange?: () => void;

  // /**
  //  * Event emitter of errors. Can show toast
  //  * or whatever
  //  */
  // onError?: (error: Error) => void;
}

interface State<R> {
  loading: boolean;
  error: boolean;
  query: string;
  page: number;
  items: R[];
  pagination: {
    hasNext: boolean;
    hasPrevious: boolean;
  };
  filter: {
    appliedFilters: AppliedFilter[];
  };
}

const initialState: State<any> = {
  loading: true,
  error: false,
  query: '',
  page: 1,
  items: [],
  pagination: {
    hasNext: false,
    hasPrevious: false,
  },
  filter: {
    appliedFilters: [],
  },
};

enum ActionType {
  FetchStart,
  FetchEnd,
  FetchError,
  PageChange,
  QueryChange,
  FiltersChange,
}

function reducer<R>(state: State<R>, action: any): State<R> {
  switch (action.type) {
    case ActionType.FetchStart: {
      return {
        ...state,
        loading: true,
        error: false,
        pagination: {
          hasNext: false,
          hasPrevious: false,
        },
      };
    }
    case ActionType.FetchEnd: {
      const { items, hasNextPage } = action.payload;

      return {
        ...state,
        loading: false,
        error: false,
        items,
        pagination: {
          hasNext: hasNextPage,
          hasPrevious: state.page > 1,
        },
      };
    }
    case ActionType.FetchError: {
      return {
        ...state,
        loading: false,
        error: true,
      };
    }
    case ActionType.PageChange: {
      const { page } = action.payload;

      return {
        ...state,
        page,
      };
    }
    case ActionType.QueryChange: {
      const { query } = action.payload;

      return {
        ...state,
        page: 1,
        query,
      };
    }
    case ActionType.FiltersChange: {
      const { appliedFilters } = action.payload;

      return {
        ...state,
        page: 1,
        filter: {
          ...state.filter,
          appliedFilters,
        },
      };
    }
    default:
      throw new Error('Invalid action');
  }
}

export interface PaginatedResourceResponse<R> extends State<R> {
  handleQueryUpdate: (query: string) => void;
  handleFiltersChange: (filter: any) => void;
  pagination: {
    hasNext: boolean;
    onNext: () => void;
    hasPrevious: boolean;
    onPrevious: () => void;
  };
  filter: {
    filters: Filter[];
    appliedFilters: AppliedFilter[];
    onFiltersChange: (filters: AppliedFilter[]) => void;
  };
}

export function usePaginatedResource<R>(props: PaginatedResourceProps<R>) {
  const { loadItems, filters = [] } = props;

  const [state, dispatch] = useReducer<Reducer<State<R>, any>>(
    reducer,
    initialState,
  );

  const [debouncedQuery] = useDebounce(state.query, 200);

  const handleFiltersChange = useCallback((appliedFilters: AppliedFilter[]) => {
    dispatch({
      type: ActionType.FiltersChange,
      payload: {
        appliedFilters,
      },
    });
  }, []);

  const handleQueryUpdate = useCallback((query: string) => {
    dispatch({
      type: ActionType.QueryChange,
      payload: {
        query,
      },
    });
  }, []);

  const handleNextPage = useCallback(() => {
    dispatch({
      type: ActionType.PageChange,
      payload: {
        page: state.page + 1,
      },
    });
  }, [state.page]);

  const handlePrevPage = useCallback(() => {
    dispatch({
      type: ActionType.PageChange,
      payload: {
        page: state.page > 1 ? state.page - 1 : 1,
      },
    });
  }, [state.page]);

  useEffect(() => {
    dispatch({ type: ActionType.FetchStart });

    loadItems({
      query: debouncedQuery,
      page: state.page,
      filters: state.filter.appliedFilters,
    })
      .then((payload: LoadItemsPayload<R>) => {
        dispatch({
          type: ActionType.FetchEnd,
          payload,
        });
      })
      .catch(() => {
        dispatch({
          type: ActionType.FetchError,
        });
      });
  }, [debouncedQuery, loadItems, state.filter.appliedFilters, state.page]);

  const r: PaginatedResourceResponse<R> = {
    ...state,
    handleQueryUpdate,
    handleFiltersChange,
    pagination: {
      ...state.pagination,
      onNext: handleNextPage,
      onPrevious: handlePrevPage,
    },
    filter: {
      ...state.filter,
      filters,
      onFiltersChange: handleFiltersChange,
    },
  };

  return r;
}
