import React, { useMemo, useCallback } from 'react';
import { FormikProps, Formik, connect } from 'formik';
import { ProductPart } from '../../types';
import { useToast } from '../../BridgeHooks';
import InternalReplacementParts from './InternalReplacementParts';
import { REPLACEMENTS_SCHEMA } from './schema';
import ReplacementPartsList from './ReplacementPartsList';

export interface ReplacementPart {
  key?: string;
  replacementPartId: string;
  replacementPartSku: string;
  company: string;
  sku: string;
}
/* eslint-disable react/no-unused-prop-types */
interface ReplacementProps {
  disabled: boolean;
  parts: ProductPart[];
  formik: FormikProps<ReplacementPart>;
}

function PartsReplacements(
  props: ReplacementProps & { formik: FormikProps<any> },
) {
  const { formik: parentFormik, parts } = props;

  const { company, sku, replacementPartId } = parentFormik.values;
  const { setFieldValue } = parentFormik;
  const showToast = useToast();

  const partSkus = useMemo(
    () => parts.map((part) => ({ value: part.id, label: part.sku })),
    [parts],
  );

  const initialValues = useMemo(() => {
    return {
      company,
      sku,
      replacementPartId,
    };
  }, [company, replacementPartId, sku]);

  const replacements = useMemo(
    () =>
      parentFormik.values.parts
        .map((part: any) => {
          return part.replacements.map((replacement: any) => {
            return {
              key: replacement.sku,
              replacementPartId: part.id,
              replacementPartSku: part.sku,
              company: replacement.brand || replacement.company,
              sku: replacement.sku,
            };
          });
        })
        .flat(),
    [parentFormik.values.parts],
  );

  function hashPart(part: any): string {
    return `${part.company.toLowerCase()},${part.sku},${
      part.replacementPartId
    }`;
  }

  const uniquePartReplacements = useCallback((values, form) => {
    let isDuplicate;
    const valuesConcat = hashPart(values);

    form.values.parts.forEach((part: any) => {
      const existingConcat = part.replacements.map((rep: any) => {
        return `${rep.brand},${rep.sku},${part.id}`;
      });
      isDuplicate = existingConcat.includes(valuesConcat);
    });
    return isDuplicate;
  }, []);

  const handleSubmit = useCallback(
    (values, { resetForm }) => {
      parentFormik.values.parts.forEach((part: any, index: any) => {
        if (
          part.id === values.replacementPartId &&
          !uniquePartReplacements(values, parentFormik)
        ) {
          setFieldValue(`parts.${index}.replacements`, [
            ...part.replacements,
            values,
          ]);
          resetForm();
        }
        if (uniquePartReplacements(values, parentFormik)) {
          showToast({
            message: 'Duplicate replacement not added',
            error: true,
          });
          resetForm();
        }
      });
    },
    [parentFormik, setFieldValue, showToast, uniquePartReplacements],
  );

  const handleRemoveReplacement = useCallback(
    (indexToDelete, associatedPart) => {
      const i = Number.parseInt(indexToDelete, 10);
      parentFormik.values.parts.forEach((part: any, index: any) => {
        const updatedReplacements = part.replacements.filter(
          (_replacement: any, rIndex: any) => {
            return i !== rIndex;
          },
        );
        if (part.id === associatedPart.replacementPartId) {
          setFieldValue(`parts[${index}]replacements`, updatedReplacements);
        }
      });
    },
    [parentFormik.values.parts, setFieldValue],
  );

  return (
    <Formik
      enableReinitialize
      initialValues={initialValues}
      onSubmit={handleSubmit}
      validateOnChange={false}
      validateOnBlur
      validationSchema={REPLACEMENTS_SCHEMA}
    >
      {({ dirty }) => (
        <>
          <InternalReplacementParts dirty={dirty} partSkus={partSkus} />
          <ReplacementPartsList
            onRemoveReplacement={handleRemoveReplacement}
            replacements={replacements}
          />
        </>
      )}
    </Formik>
  );
}

export default connect<ReplacementProps>(PartsReplacements);
