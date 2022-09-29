import React, { useCallback } from 'react';
import { Tooltip, Button } from '@shopify/polaris';
import { DropdownMinor, CaretUpMinor } from '@shopify/polaris-icons';
import { ProductPart } from '../../types';

interface ToggleButtonProps {
  open: boolean;
  onToggle: (o: boolean) => void;
  disabled: boolean;
  part: ProductPart;
}

function ToggleOpenButton(props: ToggleButtonProps) {
  const { open, onToggle, disabled, part } = props;

  const handleToggle = useCallback(() => {
    onToggle(!open);
  }, [onToggle, open]);

  return (
    <Tooltip content={`${open ? 'Hide' : 'Show'} details`}>
      <div style={{ cursor: 'pointer' }}>
        <Button
          icon={open ? CaretUpMinor : DropdownMinor}
          accessibilityLabel={`${
            open ? 'Hide' : 'Show'
          } details for part number ${part.sku}`}
          disabled={disabled}
          onClick={handleToggle}
        />
      </div>
    </Tooltip>
  );
}

export default ToggleOpenButton;
