import { serverFetch } from '.';
import { APIDiagram } from './types';
import { Diagram } from '../types';
import parseAPIDiagram from './parseAPIDiagram';

interface UpdateDiagramPayload {
  title: string;
  published: boolean;

  // Not sure why this is required
  image: string;
  parts: { id: string; position: number }[];
  categorization: string[];
}

interface SuccessResponse {
  error: false;
  diagram: Diagram;
}

interface ErrorResponse {
  error: true;
  message: string;
}

type UpdateDiagramResponse = SuccessResponse | ErrorResponse;

async function diagramUpdate(
  id: string,
  diagram: UpdateDiagramPayload,
): Promise<UpdateDiagramResponse> {
  const body: Paths.PimDiagrams$Diagramid.Put.RequestBody = {
    id,
    name: diagram.title,
    published: diagram.published,
    image: diagram.image,
    parts: diagram.parts,
    categorization: diagram.categorization,
  };

  const response = await serverFetch(`/pim/diagrams/${id}`, {
    method: 'PUT',
    body: JSON.stringify(body),
    headers: {
      'Content-Type': 'application/json',
      Accepts: 'application/json',
    },
  });

  if (!response.ok) {
    return {
      error: true,
      message: 'Failed to update diagram',
    };
  }

  try {
    const { diagram: d }: { diagram: APIDiagram } = await response.json();
    return {
      error: false,
      diagram: parseAPIDiagram(d),
    };
  } catch (e) {
    // @todo consider logging to something real
    // eslint-disable-next-line no-console
    console.warn('Failed to update diagram:', e);
    return {
      error: true,
      message: 'Failed to update diagram',
    };
  }
}

export default diagramUpdate;
