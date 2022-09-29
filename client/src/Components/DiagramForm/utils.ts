import {
  Diagram,
  DiagramPart,
  Part,
  Categorizations,
  Categorization,
  DiagramUpdatePayload,
  DiagramCreatePayload,
} from '../../Query';
import { DiagramFormValues as FV } from './schema';
import { DiagramPartValue } from './PartsInput';
import { extractId } from '../../Utils';

export async function imageFilePreview(file: any): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const url = reader.result;

      if (typeof url !== 'string') {
        reject(new Error('Reader did not return a string'));
      } else {
        resolve(url);
      }
    };

    reader.onerror = reject;

    reader.readAsDataURL(file);
  });
}

export function partToDiagramPart(part: Part): DiagramPartValue {
  return {
    sku: part.sku,
    position: 0,
    partId: part.id,
    title: part.engineeringTitle,
  };
}

export function partToValue(part: DiagramPart): DiagramPartValue {
  return {
    sku: part.sku,
    position: part.position,
    partId: part.id,
    title: part.title,
  };
}

function flattenCategorization(categorization: Categorization[]) {
  return categorization.reduce(
    (acc: string[], group) => acc.concat(group.options.map(extractId)),
    [],
  );
}

function splitCategorizations(
  input: string[],
  categorizations: Categorizations,
) {
  const categoryIds = flattenCategorization(categorizations.categories);
  const subcategoryIds = flattenCategorization(categorizations.subcategories);
  const compatibilityIds = flattenCategorization(
    categorizations.compatibilities,
  );

  return {
    category: input.find((id) => categoryIds.includes(id)),
    subcategory: input.filter((id) => subcategoryIds.includes(id)),
    compatibility: input.filter((id) => compatibilityIds.includes(id)),
  };
}

export function diagramToValue(
  diagram: Diagram,
  categorizations: Categorizations,
): FV {
  return {
    id: diagram.id,
    title: diagram.name,
    number: diagram.number ?? '',
    published: diagram.published,
    image: {
      source: diagram.image,
      file: undefined,
    },
    parts: diagram.parts.map(partToValue),
    devices: diagram.devices ?? [],
    ...splitCategorizations(diagram.categorization, categorizations),
  };
}

export function valuesToCreatePayload(values: FV): DiagramCreatePayload {
  if (!values.image.file) {
    throw new Error('Create payload must contain an `image.file`');
  }

  return {
    title: values.title,
    image: values.image.file,
    number: values.number || undefined,
  };
}

export function valuesToUpdatePayload(values: FV): DiagramUpdatePayload {
  if (!values.id) {
    throw new Error('Update payload must contain an `id`');
  }

  return {
    id: values.id,
    name: values.title,
    number: values.number,
    published: values.published,
    categorization: values.subcategory
      .concat(values.compatibility)
      .concat(values.category ? [values.category] : []),
    parts: values.parts.map((p) => {
      if (p.partId) {
        return { id: p.partId, position: p.position };
      }
      return { sku: p.sku, position: p.position };
    }),
    devices: values.devices,

    // Required for some reason
    image: values.image.source,
  };
}
