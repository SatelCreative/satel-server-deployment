import {
  parse,
  format,
  addMonths,
  addWeeks,
  addQuarters,
  addYears,
  addDays,
} from 'date-fns';
import { getData } from '.';
import { APIDiagramOnly } from './types';
import { AppliedFilter } from '../types';

enum DateFilterOption {
  PastWeek = 'past_week',
  PastMonth = 'past_month',
  PastQuarter = 'past_quarter',
  PastYear = 'past_year',
  ComingWeek = 'coming_week',
  ComingMonth = 'coming_month',
  ComingQuarter = 'coming_quarter',
  ComingYear = 'coming_year',
  OnOrBefore = 'on_or_before',
  OnOrAfter = 'on_or_after',
}

const DEFAULT_PAGE_SIZE = 12;

interface APIDiagramsReponse {
  diagrams: APIDiagramOnly[];
  // eslint-disable-next-line camelcase
  has_next_page: boolean;
}

interface DiagramsLoadProps {
  pageSize?: number;
  query?: string;
  page?: number;
  filters?: AppliedFilter[];
}

interface DiagramsLoadResponse {
  hasNextPage: boolean;
  hasPrevPage: boolean;
  items: APIDiagramOnly[];
}

interface F {
  key: string;
  operator?: string;
  value: string;
}

function parseFilters(appliedFilter: AppliedFilter): F[] {
  switch (appliedFilter.key) {
    case 'updated_at_min': {
      return [
        {
          key: 'updated_at',
          operator: 'gt',
          value: format(addDays(parse(appliedFilter.value), -1), 'X'),
        },
      ];
    }
    case 'updated_at_max': {
      return [
        {
          key: 'updated_at',
          operator: 'lt',
          value: format(addDays(parse(appliedFilter.value), 1), 'X'),
        },
      ];
    }
    case 'created_at_min': {
      return [
        {
          key: 'created_at',
          operator: 'gt',
          value: format(addDays(parse(appliedFilter.value), -1), 'X'),
        },
      ];
    }
    case 'created_at_max': {
      return [
        {
          key: 'created_at',
          operator: 'lt',
          value: format(addDays(parse(appliedFilter.value), 1), 'X'),
        },
      ];
    }
    default:
      break; // noop
  }

  if (['updated_at', 'created_at'].includes(appliedFilter.key)) {
    switch (appliedFilter.value as DateFilterOption) {
      case DateFilterOption.PastWeek: {
        return [
          {
            key: appliedFilter.key,
            operator: 'lt',
            value: format(Date.now(), 'X'),
          },
          {
            key: appliedFilter.key,
            operator: 'gt',
            value: format(addWeeks(Date.now(), -1), 'X'),
          },
        ];
      }
      case DateFilterOption.PastMonth: {
        return [
          {
            key: appliedFilter.key,
            operator: 'lt',
            value: format(Date.now(), 'X'),
          },
          {
            key: appliedFilter.key,
            operator: 'gt',
            value: format(addMonths(Date.now(), -1), 'X'),
          },
        ];
      }
      case DateFilterOption.PastQuarter: {
        return [
          {
            key: appliedFilter.key,
            operator: 'lt',
            value: format(Date.now(), 'X'),
          },
          {
            key: appliedFilter.key,
            operator: 'gt',
            value: format(addQuarters(Date.now(), -1), 'X'),
          },
        ];
      }
      case DateFilterOption.PastYear: {
        return [
          {
            key: appliedFilter.key,
            operator: 'lt',
            value: format(Date.now(), 'X'),
          },
          {
            key: appliedFilter.key,
            operator: 'gt',
            value: format(addYears(Date.now(), -1), 'X'),
          },
        ];
      }
      default:
        throw new Error(`Filters do not support '${appliedFilter.value}'`);
    }
  }

  const [key, operator] = appliedFilter.key.split(':');

  return [
    {
      key,
      operator,
      value: appliedFilter.value,
    },
  ];
}

async function diagramsLoad(props: DiagramsLoadProps = {}) {
  const {
    pageSize = DEFAULT_PAGE_SIZE,
    query = '',
    page = 1,
    filters = [],
  } = props;

  const params = new URLSearchParams();
  params.append('limit', `${pageSize}`);
  params.append('search', query);
  params.append('page', `${page}`);

  filters
    .map(parseFilters)
    .flat()
    .forEach((f) => {
      const { key, operator, value } = f;

      // Boolean filter
      if (!operator) {
        return params.set(key, value);
      }

      // Equality filter
      const existingValueRaw = params.get(key);
      const existingValues = existingValueRaw
        ? existingValueRaw.split(',')
        : [];

      existingValues.push(`${operator}:${value}`);

      return params.set(key, existingValues.join(','));
    });

  const { diagrams, has_next_page: hasNextPage } =
    await getData<APIDiagramsReponse>(`/pim/diagrams?${params}`);

  const response: DiagramsLoadResponse = {
    items: diagrams,
    hasNextPage,
    hasPrevPage: page > 1,
  };

  return response;
}

export default diagramsLoad;
