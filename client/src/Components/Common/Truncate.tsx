import React, { ReactNode } from 'react';

interface TruncateProps {
  children: string;
  maxLength: number;
  extension?: ReactNode;
}

function Truncate(props: TruncateProps) {
  const { children, maxLength, extension = '...' } = props;

  if (children.length <= maxLength) {
    return <>{children}</>;
  }

  return (
    <>
      {children.substring(0, maxLength)}
      {extension}
    </>
  );
}

export default Truncate;
