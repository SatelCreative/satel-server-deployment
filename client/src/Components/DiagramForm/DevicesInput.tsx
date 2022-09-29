import { useAppBridge, Modal } from '@shopify/app-bridge-react';
import {
  Card,
  Heading,
  Link,
  ResourceItem,
  ResourceList,
  TextStyle,
} from '@shopify/polaris';
import { useField } from 'formik';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { Modal as ModalAction } from '@shopify/app-bridge/actions';
import { Device, useDevicesByIds } from '../../Query';
import { noop } from '../../Utils';
import { useToast } from '../../BridgeHooks';
import config from '../../config';

interface DevicesInputProps {
  name: string;
  label: string;
  readOnly?: boolean;
}

export function DevicesInput(props: DevicesInputProps) {
  const { name, label, readOnly } = props;

  const showToast = useToast();

  const app = useAppBridge();
  const [open, setOpen] = useState(false);

  const handleOpen = useCallback(() => {
    setOpen(true);
  }, []);

  const handleClose = useCallback(() => {
    setOpen(false);
  }, []);

  const [field, , helpers] = useField<string[]>(name);

  const { data, isFetching } = useDevicesByIds(field.value);

  const handleSelect = useCallback(
    (id: string) => {
      setOpen(false);
      if (field.value.includes(id)) {
        showToast({ message: 'Device already connected' });
        return;
      }

      const newValue = field.value.slice();
      newValue.push(id);
      helpers.setValue(newValue);
    },
    [field.value, helpers, showToast],
  );

  const handleRemove = useCallback(
    (index: number) => () => {
      const newValue = field.value.slice();
      newValue.splice(index, 1);
      helpers.setValue(newValue);
    },
    [field.value, helpers],
  );

  useEffect(() => {
    return app.subscribe(
      ModalAction.Action.DATA,
      (action: { channel?: string; type: 'SELECT'; device: string }) => {
        if (action?.channel !== 'device') {
          return;
        }

        if (action?.type !== 'SELECT') {
          // eslint-disable-next-line no-console
          console.warn('Unexpected action', action);
          return;
        }
        handleSelect(action.device);
      },
    );
  }, [app, handleSelect]);

  const handleRenderItem = useCallback(
    (device: Device, id: string, index: number) => {
      return (
        <ResourceItem
          id={id}
          onClick={noop}
          shortcutActions={[
            { content: 'Remove device', onAction: handleRemove(index) },
          ]}
        >
          <Link url={`/devices/${device.id}`}>
            <Heading>{device.name}</Heading>
          </Link>
        </ResourceItem>
      );
    },
    [handleRemove],
  );

  return (
    <Card
      title={label}
      actions={[
        {
          content: 'Connect device',
          onAction: handleOpen,
          disabled: readOnly,
        },
      ]}
    >
      <br />
      <ResourceList
        items={data ?? []}
        loading={isFetching}
        renderItem={handleRenderItem}
        emptyState={
          <Card.Section>
            <TextStyle variation="subdued">No devices connected</TextStyle>
          </Card.Section>
        }
      />
      <Modal
        title="Device selector"
        src={`/modal/diagrams/devices?shop=${config.SHOPIFY_DOMAIN}&host=${config.SHOPIFY_HOST}`}
        size="Large"
        open={open}
        onClose={handleClose}
        secondaryActions={[{ content: 'Cancel', onAction: handleClose }]}
      />
    </Card>
  );
}
