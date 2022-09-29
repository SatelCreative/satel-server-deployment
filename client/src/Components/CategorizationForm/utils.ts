import { Categorization, Categorizations } from '../../Query';
import { CategorizationValue } from './CategorizationInput';
import { CategorizationFormValues } from './schema';

export function categorizationsToCategorizationValues(cats: Categorization[]) {
  const groups = cats.map((c) => c.name);
  const options = cats.reduce<CategorizationValue['options']>((acc, cat) => {
    const os = cat.options.map(({ id, option }) => ({
      id,
      option,
      group: cat.name,
    }));
    return acc.concat(os);
  }, []);
  return {
    groups,
    options,
  };
}

export function categorizationsToValue(
  cats: Categorizations,
): CategorizationFormValues {
  return {
    categories: categorizationsToCategorizationValues(cats.categories),
    subcategories: categorizationsToCategorizationValues(cats.subcategories),
    compatibilities: categorizationsToCategorizationValues(
      cats.compatibilities,
    ),
  };
}
