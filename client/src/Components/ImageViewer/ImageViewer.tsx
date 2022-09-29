import React, { useRef, useEffect } from 'react';
import L from 'leaflet';

import 'leaflet/dist/leaflet.css';

async function loadImageSize(src: string): Promise<[number, number]> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    function handleLoad(this: any) {
      resolve([this.width, this.height]);
    }

    function handleError(e: any) {
      reject(e);
    }

    img.onload = handleLoad;
    img.onerror = handleError;
    img.src = src;
  });
}

export interface ImageViewerProps {
  source: string;
  height?: number;
}

export function ImageViewer(props: ImageViewerProps) {
  const { source, height = 575 } = props;

  const mapElement = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!mapElement || !mapElement.current || !source) {
      return;
    }

    const map = L.map(mapElement.current, {
      crs: L.CRS.Simple,
      attributionControl: false,
      minZoom: -10,
    });

    loadImageSize(source).then((imageSize) => {
      const bounds: any = [
        map.unproject([0, 0], 0),
        map.unproject(imageSize, 0),
      ];
      L.imageOverlay(source, bounds, {
        interactive: true,
      }).addTo(map);
      map.fitBounds(bounds);
    });

    return () => {
      map.remove();
    };
  }, [source]);

  return (
    <div style={{ height, position: 'relative' }}>
      <div
        ref={mapElement}
        style={{ position: 'absolute', width: '100%', height: '100%' }}
      />
    </div>
  );
}
