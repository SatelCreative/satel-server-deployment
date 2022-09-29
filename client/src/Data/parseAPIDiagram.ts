import shortid from 'shortid';
import { APIDiagram } from './types';
import { Diagram, DiagramPart } from '../types';

function parseAPIDiagram(diagram: APIDiagram): Diagram {
  return {
    id: diagram.id,
    title: diagram.name,
    image: diagram.image,
    published: diagram.published,
    createdAt: diagram.createdAt * 1000,
    updatedAt: diagram.updatedAt * 1000,
    categorization: diagram.categorization,
    parts: diagram.parts.map<DiagramPart>((part) => ({
      id: shortid.generate(),
      sku: part.sku,
      position: part.position,
      partId: part.id,
      image: part.image,
      title: part.title,
      erp: [],
    })),
  };
}

export default parseAPIDiagram;
