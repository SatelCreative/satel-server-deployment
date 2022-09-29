import React, {
  useMemo,
  useState,
  useEffect,
  useCallback,
  useContext,
} from 'react';
import {
  Card,
  EmptyState,
  ResourceItem,
  Heading,
  Thumbnail,
  Stack,
} from '@shopify/polaris';
import { useField } from 'formik';
import { object, string, number } from 'yup';
import { useAppBridge, Modal } from '@shopify/app-bridge-react';
import { Modal as ModalAction } from '@shopify/app-bridge/actions';
import { TextField } from '@satel/formik-polaris';
import { Part } from '../../Query';
import { partToDiagramPart } from './utils';
import { noop } from '../../Utils';
import { CompanyContext } from '../../Context';
import config from '../../config';

export interface DiagramPartValue {
  /**
   * SKU of the part
   */
  sku: string;

  /**
   * Number of the part
   */
  position: number;

  /**
   * Id of connected part (if applicable)
   */
  partId?: string;

  /**
   * Title of the part
   */
  title?: string;

  /**
   * Thumbnail of the part
   */
  image?: string;
}

export const partSchema = () =>
  object({
    sku: string(),
    partId: string(),
    title: string(),
    position: number()
      .label('Position')
      .typeError('Position must be an integer')
      .integer('Position must be an integer')
      .moreThan(0)
      .required(),
  });

interface PartInputProps {
  name: string;
  index: number;
  part: DiagramPartValue;
  onDelete: (index: number) => void;
}

function PartInput(props: PartInputProps) {
  const { name, index, part, onDelete } = props;

  const { defaultProductImage } = useContext(CompanyContext);

  const media = <Thumbnail source={part.image ?? defaultProductImage} alt="" />;

  const handleDelete = useCallback(() => {
    onDelete(index);
  }, [index, onDelete]);

  return (
    <ResourceItem
      id={part.sku}
      media={media}
      onClick={noop}
      shortcutActions={[{ content: 'Remove part', onAction: handleDelete }]}
    >
      <Stack vertical>
        <Heading>{part.sku}</Heading>
        <Stack.Item>
          <TextField
            autoComplete="off"
            name={`${name}.position`}
            label="Position"
            decode={(n) => `${n}`}
          />
        </Stack.Item>
      </Stack>
    </ResourceItem>
  );
}

export interface PartsInputProps {
  name: string;
  label: string;
  readOnly?: boolean;
}

export function PartsInput(props: PartsInputProps) {
  const { name, label, readOnly = false } = props;

  const app = useAppBridge();
  const [open, setOpen] = useState<'existing' | 'custom' | false>(false);

  const handleOpen = useCallback(() => {
    setOpen('existing');
  }, []);

  const handleOpenCustom = useCallback(() => {
    setOpen('custom');
  }, []);

  const handleClose = useCallback(() => {
    setOpen(false);
  }, []);

  const [field, , helpers] = useField<DiagramPartValue[]>(name);

  const handleRemovePart = useCallback(
    (index: number) => {
      const newValue = field.value.slice();
      newValue.splice(index, 1);
      helpers.setValue(newValue);
    },
    [field.value, helpers],
  );

  const handleSelect = useCallback(
    (part: Part) => {
      setOpen(false);
      const newValue = field.value.slice();
      newValue.push(partToDiagramPart(part));
      helpers.setValue(newValue);
    },
    [field.value, helpers],
  );

  useEffect(() => {
    return app.subscribe(
      ModalAction.Action.DATA,
      (action: { channel?: string; type: 'SELECT'; part: Part }) => {
        if (action?.channel !== 'part') {
          return;
        }

        if (action?.type !== 'SELECT') {
          // eslint-disable-next-line no-console
          console.warn('Unexpected action', action);
          return;
        }
        handleSelect(action.part);
      },
    );
  }, [app, handleSelect]);

  const markup = useMemo(() => {
    if (!field.value.length) {
      return (
        <EmptyState
          heading="Connect a part to get started"
          action={{
            content: 'Connect part',
            onAction: handleOpen,
            disabled: readOnly,
          }}
          image="https://cdn.shopify.com/s/files/1/0262/4071/2726/files/emptystate-files.png"
          fullWidth
        >
          <p>
            You can use the Parts section to connect parts to the diagram. COPY
            NEEDED
          </p>
        </EmptyState>
      );
    }
    return (
      <>
        <br />
        <ol style={{ listStyle: 'none', margin: 0, padding: 0 }}>
          {field.value.map((part, index) => (
            <PartInput
              key={part.sku}
              part={part}
              index={index}
              name={`${name}.${index}`}
              onDelete={handleRemovePart}
            />
          ))}
        </ol>
      </>
    );
  }, [field.value, handleOpen, handleRemovePart, name, readOnly]);

  return (
    <Card
      title={label}
      actions={[
        {
          content: 'Connect existing part',
          onAction: handleOpen,
          disabled: readOnly,
        },
        {
          content: 'Connect custom part',
          onAction: handleOpenCustom,
          disabled: readOnly,
        },
      ]}
    >
      <Modal
        title="Part selector"
        src={`/modal/diagrams/parts?custom=${
          open === 'custom' ? 'true' : 'false'
        }&shop=${config.SHOPIFY_DOMAIN}&host=${config.SHOPIFY_HOST}`}
        size={open === 'custom' ? 'Small' : 'Large'}
        open={open !== false}
        onClose={handleClose}
      />
      {markup}
    </Card>
  );
}
