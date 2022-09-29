import React, { useState, useCallback } from 'react';
import {
  DropZone,
  Card,
  Stack,
  Heading,
  Thumbnail,
  Scrollable,
  Button,
  Icon,
  ResourceList,
  TextField,
  Spinner,
  TextStyle,
  Modal,
  Tooltip,
} from '@shopify/polaris';
import {
  FolderUpMajor,
  DeleteMinor,
  MaximizeMinor,
} from '@shopify/polaris-icons';
import { FieldArray, Field } from 'formik';
import DragHandle from './DragHandle';

import s from './images.module.css';
import { ImageViewer } from '../ImageViewer';
import { noop } from '../../Utils';

// @todo please fix magic number values css wizards
// @todo fix plz
const style = { minHeight: '8.15rem' };

interface ExistingImage {
  source: string;
  alt: string;
}

interface NewImage {
  source: string;
  alt: string;
  file: File;
  uploaded: boolean;
}

export type Image = ExistingImage | NewImage;

interface ImageProps {
  id: string;
  source: string;
  alt: string;
  index: number;
  onPreview: (index: number) => void;
}

function Image(props: ImageProps) {
  const { id, source, alt, index, onPreview } = props;

  const handlePreview = useCallback(
    (e) => {
      e.persist();
      e.stopPropagation();

      onPreview(index);
    },
    [index, onPreview],
  );

  return (
    <ResourceList.Item id={id} onClick={noop}>
      <Stack alignment="center">
        <DragHandle showTooltip={false} />
        <div
          style={{ position: 'relative' }}
          onClick={handlePreview}
          role="button"
        >
          <Thumbnail key={source} size="large" source={source} alt={alt} />
          <div className={s.thumbnail}>
            <Stack alignment="center" distribution="center">
              <Icon source={MaximizeMinor} color="subdued" />
            </Stack>
          </div>
        </div>
        <Stack.Item fill>
          <div style={style}>
            <TextField
              autoComplete="off"
              label="Label"
              value={alt || ''}
              onChange={noop}
              disabled
            />
          </div>
        </Stack.Item>
        <Button icon={DeleteMinor} destructive onClick={noop} disabled />
      </Stack>
    </ResourceList.Item>
  );
}

interface PreviewProps {
  images: Image[];
}

function Preview({ images }: PreviewProps) {
  const [preview, setPreview] = useState<Image>();

  const handlePreview = useCallback(
    (index) => {
      setPreview(images[index]);
    },
    [images],
  );

  if (!images.length) {
    return (
      <div style={{ height: 328, paddingTop: 50 }}>
        <Stack alignment="center" distribution="center">
          <Tooltip content="Coming soon">
            <DropZone.FileUpload
              actionTitle={
                (
                  <Stack
                    alignment="center"
                    distribution="center"
                    spacing="extraTight"
                  >
                    <Icon source={FolderUpMajor} />
                    <span>Add image</span>
                  </Stack>
                ) as any // typed as string but ReactNode is fine
              }
              actionHint="or drop images to upload"
            />
          </Tooltip>
        </Stack>
      </div>
    );
  }

  return (
    <>
      <Modal
        title=""
        titleHidden
        open={!!preview}
        large
        onClose={() => setPreview(undefined)}
      >
        <Modal.Section>
          <ImageViewer source={preview ? preview.source : ''} />
        </Modal.Section>
      </Modal>
      <Scrollable shadow horizontal={false} style={{ height: 321 }}>
        <ResourceList
          items={images}
          renderItem={(image, id, index) => (
            <Image
              id={image.source}
              index={index}
              source={image.source}
              alt={image.alt}
              onPreview={handlePreview}
            />
          )}
        />
      </Scrollable>
    </>
  );
}

interface ImagesProps {
  disabled: boolean;
}

interface InternalProps {
  images: Image[];
  onAddImages: (img: Image[]) => void;
}

function InternalImages(props: ImagesProps & InternalProps) {
  const { disabled, images, onAddImages } = props;

  const [openFileDialog, setOpenFileDiaglog] = useState(false);

  const handleDropAccepted = useCallback(
    (files: File[]) => {
      const newImages = files.map<Image>((file) => ({
        file,
        alt: file.name.split('.')[0],
        source: window.URL.createObjectURL(file),
      }));
      onAddImages(newImages);
    },
    [onAddImages],
  );

  const uploading = false;
  const empty = images.length === 0;

  return (
    <Card sectioned>
      <Stack alignment="center">
        <Stack.Item fill>
          <Heading>Images</Heading>
        </Stack.Item>
        {uploading && (
          <Stack alignment="center" spacing="tight">
            <TextStyle variation="subdued">uploading 3 of 7</TextStyle>
            <Spinner size="small" />
          </Stack>
        )}
        {!empty && (
          <Button
            icon={FolderUpMajor}
            onClick={() => setOpenFileDiaglog(true)}
            disabled={disabled || true}
          >
            Add image
          </Button>
        )}
      </Stack>

      <br />

      {/* @todo fix magic css number */}

      <DropZone
        // Cannot currently use this as it will be activated
        // by react-dnd reordering of parts etc
        // dropOnPage
        disabled={disabled || true}
        openFileDialog={openFileDialog}
        onClick={() => {
          if (empty) {
            setOpenFileDiaglog(true);
          }
        }}
        outline={empty}
        overlay
        allowMultiple
        accept="image/*"
        type="image"
        onDropAccepted={handleDropAccepted}
        onFileDialogClose={() => setOpenFileDiaglog(false)}
      >
        <Preview images={images} />
      </DropZone>
    </Card>
  );
}

function Images(props: ImagesProps) {
  return (
    <FieldArray name="images">
      {() => (
        <Field name="images">
          {({ field }: any) => (
            <InternalImages
              {...props}
              images={field.value}
              onAddImages={() => {
                // eslint-disable-next-line no-alert
                alert('Not yet implemented, waiting on #725');
              }}
            />
          )}
        </Field>
      )}
    </FieldArray>
  );
}

export default Images;
