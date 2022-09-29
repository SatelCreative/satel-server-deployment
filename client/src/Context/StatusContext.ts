import React from 'react';
import { noop } from '../Utils';

export interface ShowToastProps {
  content: string;
  error?: boolean;
}

export interface StatusContextType {
  showToast: (props: ShowToastProps) => void;
}

const StatusContext = React.createContext<StatusContextType>({
  showToast: noop,
});

export default StatusContext;
