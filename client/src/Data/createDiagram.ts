import { serverFetch, uploadDiagram } from '.';

interface UpdateDiagramPayload {
  title: string;
  diagramFile: Blob;
}

async function createDiagram(values: UpdateDiagramPayload): Promise<string> {
  const { title, diagramFile } = values;

  if (!diagramFile) {
    throw new Error('Upload an image first');
  }

  const tempDiagramId = await uploadDiagram(diagramFile);

  const body: Paths.PimDiagrams.Post.RequestBody = {
    title,
    tmp_image_id: tempDiagramId,
  };

  const response = await serverFetch('/pim/diagrams', {
    method: 'POST',
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    throw new Error('Failed to create diagram');
  }

  // eslint-disable-next-line camelcase
  const { diagram_id: id }: { diagram_id: string } = await response.json();

  return id;
}

export default createDiagram;
