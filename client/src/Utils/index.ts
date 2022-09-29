import { FormValuesOption } from '../Components/CategorizationEdit/Categorizations';

// copied sort function from:
// https://ourcodeworld.com/articles/read/764/how-to-sort-alphabetically
// -an-array-of-objects-by-key-in-javascript

// although this doesn't work well for comparing numbers...they would
// all just get grouped to the top of the list.

const sortOptionsByKey = (property: string) => {
  let sortOrder = 1;
  if (property[0] === '-') {
    sortOrder = -1;
    // eslint-disable-next-line no-param-reassign
    property = property.substr(1);
  }

  return (a: FormValuesOption, b: FormValuesOption) => {
    if (sortOrder === -1) {
      return (b as any)[property].localeCompare((a as any)[property]);
    }
    return (a as any)[property].localeCompare((b as any)[property]);
  };
};

// eslint-disable-next-line @typescript-eslint/no-empty-function
export const noop = () => {};

export const extractId = <T extends { id: string }>(item: T) => item.id;

export default sortOptionsByKey;
