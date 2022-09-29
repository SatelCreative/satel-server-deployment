import React, { useMemo, useCallback, useState } from 'react';
import { Card, DropZone, Icon, Stack, TextStyle } from '@shopify/polaris';
import { useField } from 'formik';
import { object, string, mixed } from 'yup';
import { AlertMinor } from '@shopify/polaris-icons';
import { ImageViewer } from '../ImageViewer';
import { imageFilePreview } from './utils';
import { useToast } from '../../BridgeHooks';

export interface ImageValue {
  source: string;
  file?: Blob;
}

export const imageSchema = () =>
  object({
    source: string().required(),
    file: mixed(),
  });

const ACCEPT = ['image/jpeg', 'image/x-png', 'image/png', 'image/jpg'];

export interface ImageInputProps {
  name: string;
  label: string;
  readOnly?: boolean;
}

export function ImageInput(props: ImageInputProps) {
  const { name, label, readOnly = false } = props;

  const showToast = useToast();

  const [openFileDialog, setOpenFileDialog] = useState(false);
  const handleOpenFileDialog = useCallback(() => {
    setOpenFileDialog(true);
  }, []);
  const handleCloseFileDialog = useCallback(() => {
    setOpenFileDialog(false);
  }, []);
  const [field, meta, helpers] = useField<ImageValue | undefined>(name);

  const markup = useMemo(() => {
    if (!field.value) {
      return (
        <DropZone.FileUpload
          actionTitle="Upload image"
          actionHint="or drop image to upload"
        />
      );
    }

    return <ImageViewer source={field.value.source} height={500} />;
  }, [field.value]);

  const handleImageUpload = useCallback(
    ([file]: File[]) => {
      imageFilePreview(file)
        .then((source) => {
          helpers.setValue({
            source,
            file,
          });
        })
        .catch((e) => {
          // eslint-disable-next-line no-console
          console.warn(e);
          showToast({ message: 'Could not process image', error: true });
        });
    },
    [helpers, showToast],
  );

  return (
    <Card
      title={label}
      actions={
        readOnly
          ? []
          : [
              {
                content: 'Upload image',
                onAction: handleOpenFileDialog,
              },
            ]
      }
    >
      <br />
      <DropZone
        type="image"
        dropOnPage
        openFileDialog={openFileDialog}
        onFileDialogClose={handleCloseFileDialog}
        outline={false}
        allowMultiple={false}
        accept={ACCEPT.join(',')}
        onDropAccepted={handleImageUpload}
        disabled={readOnly}
      >
        {markup}
      </DropZone>
      {meta.touched && meta.error && (
        <Card.Section>
          <Stack spacing="tight">
            <Icon source={AlertMinor} color="critical" />
            <TextStyle variation="negative">{meta.error}</TextStyle>
          </Stack>
        </Card.Section>
      )}
    </Card>
  );
}
