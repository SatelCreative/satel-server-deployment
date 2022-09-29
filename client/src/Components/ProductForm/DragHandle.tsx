import React, { forwardRef, useMemo } from 'react';
import { Tooltip, Icon } from '@shopify/polaris';
import { DragHandleMinor } from '@shopify/polaris-icons';

interface DragHandleProps {
  showTooltip: boolean;
}

/**
 * Provides a drag handle that can support
 * removing the tooltip without breaking
 * the drag and drop
 */
const DragHandle = forwardRef<HTMLDivElement, DragHandleProps>(
  (props: DragHandleProps, ref) => {
    const { showTooltip } = props;

    const internalMarkup = useMemo(() => {
      if (showTooltip) {
        return (
          <Tooltip content="Drag and drop the Part" active={false}>
            <Icon source={DragHandleMinor} color="subdued" />
          </Tooltip>
        );
      }

      return <Icon source={DragHandleMinor} color="subdued" />;
    }, [showTooltip]);

    return (
      <div ref={ref} style={{ cursor: 'grab' }}>
        {internalMarkup}
      </div>
    );
  },
);

DragHandle.displayName = 'DragHandle';

export default DragHandle;
