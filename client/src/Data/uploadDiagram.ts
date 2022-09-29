import { serverFetch } from '.';

async function uploadDiagram(file: Blob): Promise<string> {
  const formData = new FormData();
  formData.append('file', file);

  const response = await serverFetch('/pim/diagrams/images', {
    method: 'POST',
    body: formData,
  });

  if (!response.ok) {
    throw new Error(`Failed to upload image`);
  }

  const {
    tmp_image_id: tmpImageId,
  }: // eslint-disable-next-line camelcase
  { tmp_image_id: string } = await response.json();

  return tmpImageId;
}

export default uploadDiagram;
