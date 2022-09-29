import { object, string, boolean, array, addMethod, number } from 'yup';

// FROM https://github.com/jquense/yup/issues/345#issuecomment-454465375
// Ensures unique values
/* eslint-disable */
addMethod(object, 'uniqueProperty', function(propertyName, message) {
  return this.test('unique', message, function(value) {
    if (!value || !value[propertyName]) {
      return true;
    }

    if (
      this.parent
        .filter((v: any) => v !== value)
        .some((v: any) => v[propertyName] === value[propertyName])
    ) {
      throw this.createError({
        path: `${this.path}.${propertyName}`,
      });
    }

    return true;
  });
});
/* eslint-enable */

const SHARED_PART_SCHEMA = {
  promotion: number()
    .typeError('Promotion must be valid price')
    .label('promotion')
    .min(0, 'Promotion must be positive')
    .default(0)
    .when('price', (price: any, schema: any) => {
      if (price > 0) {
        return schema.lessThan(price, 'Promotion must be less than price');
      }
      return schema;
    }),
};

// Using this while some fields are not yet supported by backend
export const SCHEMA = object({
  title: string()
    .min(3, 'Title must be at least 3 characters long')
    .required('Title is required'),
  description: string().nullable(),
  seoTitle: string().max(
    70,
    'SEO Title can only be a maximum of 70 characters long',
  ),
  handle: string().min(3, 'Handle must be at least 3 characters long'),
  seoDescription: string().max(
    320,
    'SEO Description can only be a maximum of 70 characters long',
  ),
  published: boolean(),
  parts: array().when(
    ['option1', 'option2', 'option3'],
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    (option1: any, option2: any, option3: any, schema: any) => {
      const o: { [key: string]: any } = {
        ...SHARED_PART_SCHEMA,
        option1: string()
          .label(option1)
          .min(1, ({ label }) => `${label} is too short`)
          .required(),
      };

      if (option2) {
        o.option2 = string()
          .label(option2)
          .min(1, ({ label }) => `${label} is too short`)
          .required();
      }

      if (option3) {
        o.option3 = string()
          .label(option3)
          .min(1, ({ label }) => `${label} is too short`)
          .required();
      }

      return schema.of(
        (
          object<any>()
            // Add `options` in order to assert unique
            .transform((part) => {
              // eslint-disable-next-line no-underscore-dangle, no-param-reassign
              part.options =
                `${part.option1}${part.option2}${part.option3}`.toLowerCase();
              return part;
            })
            .shape(o) as any
        ).uniqueProperty('options', 'variants must have unique option values'),
      );
    },
  ),
});

const whenComp = {
  is: (...options: any[]) => {
    if (!options[0]) {
      return false;
    }

    const key = options[0].toLowerCase();
    const o = [options[1], options[2]]
      .filter(Boolean)
      .map((option) => option.toLowerCase());

    return o.includes(key.toLowerCase());
  },
  then: string().test('unique', 'variant titles must be unique', () => false),
};

export const OPTIONS_SCHEMA = object()
  .from('option1', 'o1', true)
  .from('option2', 'o2', true)
  .from('option3', 'o3', true)
  .shape({
    option1: string().min(2).when(['o1', 'o2', 'o3'], whenComp).required(),
    option2: string()
      .min(2)
      .when(['o2', 'o1', 'o3'], whenComp)
      .when('option3', {
        is: (val: any) => !!val,
        then: string().required('Required when option3 is populated'),
      })
      .when('hadOption2', {
        is: true,
        then: string().required('Option cannot be removed once added'),
      }),
    option3: string()
      .min(2)
      .when(['o3', 'o1', 'o2'], whenComp)
      .when('hadOption3', {
        is: true,
        then: string().required('Option cannot be removed once added'),
      }),
  });

export const REPLACEMENTS_SCHEMA = object({
  sku: string().required('Please provide the replacement sku'),
  company: string().required('Please select the associated company'),
  replacementPartId: string().required('Please select the part being replaced'),
});
