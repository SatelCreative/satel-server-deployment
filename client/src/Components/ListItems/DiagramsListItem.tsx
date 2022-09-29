import React from 'react';
import {
  Stack,
  ResourceList,
  TextStyle,
  Badge,
  Button,
  Heading,
} from '@shopify/polaris';
import { DeleteMinor } from '@shopify/polaris-icons';
import { APIDiagramOnly } from '../../Data/types';
import ProductThumbnail from '../../Components/Common/ProductThumbnail';
import LastUpdated from '../../Components/Common/LastUpdated';
import Truncate from '../Common/Truncate';
import { noop } from '../../Utils';

interface Props {
  diagram: APIDiagramOnly;
  onRequestDelete: (id: string) => void;
}

function DiagramsListItem(props: Props) {
  const {
    diagram: { id, name, nParts, published, updatedAt, image },
    onRequestDelete,
  } = props;

  const publishedBadge = published ? (
    <Badge status="info">Published</Badge>
  ) : (
    <Badge status="warning">Unpublished</Badge>
  );

  let associatedText = 'No associated parts';
  if (nParts === 1) {
    associatedText = '1 associated part';
  }
  if (nParts > 1) {
    associatedText = `${nParts} associated parts`;
  }

  const clickHandler = ((e: any) => {
    e.stopPropagation();
    onRequestDelete(id);
  }) as () => void;

  return (
    <ResourceList.Item key={id} id={id} url={`/diagrams/${id}`} onClick={noop}>
      <Stack distribution="equalSpacing" alignment="center">
        <Stack.Item>
          <ProductThumbnail source={image} alt={`Thumbnail image of ${name}`} />
        </Stack.Item>
        <Stack.Item fill>
          <Stack vertical spacing="extraTight">
            <Heading>
              <Truncate maxLength={97}>{name}</Truncate>
            </Heading>
            <Stack.Item>
              <TextStyle>{associatedText}</TextStyle>
            </Stack.Item>
          </Stack>
        </Stack.Item>
        <Stack vertical alignment="trailing" spacing="tight">
          {publishedBadge}
          <LastUpdated date={updatedAt * 1000} />
        </Stack>
        <div style={{ zIndex: 10000 }}>
          <Button onClick={clickHandler} destructive icon={DeleteMinor} />
        </div>
      </Stack>
    </ResourceList.Item>
  );
}

export default DiagramsListItem;
