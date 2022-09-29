import { serverFetch } from '.';

interface SuccessResponse {
  error: false;
}

interface ErrorResponse {
  error: true;
  message: string;
}

type DeleteDiagramResponse = SuccessResponse | ErrorResponse;

async function diagramDelete(id: string): Promise<DeleteDiagramResponse> {
  const body = { id };
  const response = await serverFetch(`/pim/diagrams/${id}`, {
    method: 'DELETE',
    body: JSON.stringify(body),
    headers: {
      'Content-Type': 'application/json',
      Accepts: 'application/json',
    },
  });

  if (!response.ok) {
    throw new Error('Failed to delete diagram');
  }

  return {
    error: false,
  };
}

export default diagramDelete;
