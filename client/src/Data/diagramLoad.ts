import { APIDiagram } from './types';
import { getData } from '.';
import parseAPIDiagram from './parseAPIDiagram';

interface APIDiagramReponse {
  diagram: APIDiagram;
}

async function diagramLoad(id: string) {
  const { diagram } = await getData<APIDiagramReponse>(`/pim/diagrams/${id}`);

  return parseAPIDiagram(diagram);
}

export default diagramLoad;
