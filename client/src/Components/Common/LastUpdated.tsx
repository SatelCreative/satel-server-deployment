import React from 'react';
import { distanceInWords } from 'date-fns';

interface LastUpdatedProps {
  /**
   * Last updated in ms
   */
  date: number;
}

function LastUpdated({ date }: LastUpdatedProps) {
  const D = new Date(date);

  return (
    <>
      Updated
      <span title={D.toLocaleString()}> {distanceInWords(D, Date.now())} </span>
      ago
    </>
  );
}

export default LastUpdated;
