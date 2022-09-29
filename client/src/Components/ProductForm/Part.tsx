import React, { useRef, useState, ReactNode, useCallback } from 'react';
import {
  ResourceList,
  Stack,
  Tooltip,
  Collapsible,
  Button,
  Heading,
} from '@shopify/polaris';
import { DeleteMinor } from '@shopify/polaris-icons';
import { useDrag, useDrop, DropTargetMonitor, XYCoord } from 'react-dnd';
import { ProductPart } from '../../types';

import PartOptions from './PartOptions';
import PartAlternate from './PartAlternate';
import PartPrice from './PartPrice';
import DragHandle from './DragHandle';
import ToggleOpenButton from './ToggleOpenButton';
import PartDetails from './PartDetails';
import { noop } from '../../Utils';

interface PartProps extends ProductPart {
  /**
   * Which number in the array it is
   */
  index: number;
  disabled: boolean;
  children: ReactNode;
  onMovePart: (from: number, to: number) => void;
  onDeletePart: (index: number) => void;
}

function Part(props: PartProps) {
  const { index, onMovePart, disabled, onDeletePart, children, ...part } =
    props;

  const ref = useRef<HTMLDivElement>(null);
  const [{ canDrop: globalIsDragging }, drop] = useDrop({
    accept: 'part',
    canDrop: () => true,
    collect: (monitor) => ({
      canDrop: !!monitor.canDrop(),
    }),
    hover(item: any, monitor: DropTargetMonitor) {
      if (!ref.current) {
        return;
      }

      const dragIndex = item.index;
      const hoverIndex = index;

      if (dragIndex === hoverIndex) {
        return;
      }

      // Determine rectangle on screen
      const hoverBoundingRect = ref.current.getBoundingClientRect();

      // Get vertical middle
      const hoverMiddleY =
        (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2;

      // Determine mouse position
      const clientOffset = monitor.getClientOffset();

      // Get pixels to the top
      const hoverClientY = (clientOffset as XYCoord).y - hoverBoundingRect.top;

      // Only perform the move when the mouse has crossed half of the items height
      // When dragging downwards, only move when the cursor is below 50%
      // When dragging upwards, only move when the cursor is above 50%

      // Dragging downwards
      if (dragIndex < hoverIndex && hoverClientY < hoverMiddleY) {
        return;
      }

      // Dragging upwards
      if (dragIndex > hoverIndex && hoverClientY > hoverMiddleY) {
        return;
      }

      // Time to actually perform the action
      onMovePart(dragIndex, hoverIndex);

      // Note: we're mutating the monitor item here!
      // Generally it's better to avoid mutations,
      // but it's good here for the sake of performance
      // to avoid expensive index searches.
      // eslint-disable-next-line no-param-reassign
      item.index = hoverIndex;
    },
  });

  const [{ isDragging }, drag, preview] = useDrag({
    item: { type: 'part', id: part.id, index },
    canDrag: () => !disabled,
    collect: (monitor: any) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  preview(drop(ref));

  const opacity = isDragging ? 0 : 1;

  const [open, setOpen] = useState(false);

  const handleDelete = useCallback(() => {
    onDeletePart(index);
  }, [onDeletePart, index]);

  return (
    <>
      <div key={part.id} ref={ref} style={{ opacity, background: 'white' }}>
        <ResourceList.Item id={part.id} key={part.id} onClick={noop}>
          <Stack alignment="center">
            <DragHandle ref={drag} showTooltip={!globalIsDragging} />
            <Stack.Item>
              <Stack
                vertical
                alignment="leading"
                distribution="leading"
                spacing="extraTight"
              >
                <Stack.Item>Part number</Stack.Item>
                <Stack.Item>
                  <Heading>{part.sku}</Heading>
                </Stack.Item>
              </Stack>
            </Stack.Item>
            <Stack.Item fill>{children}</Stack.Item>
            <Stack.Item>
              <ToggleOpenButton
                onToggle={setOpen}
                open={open}
                disabled={disabled}
                part={part}
              />
            </Stack.Item>
            <Stack.Item>
              <Tooltip content="Remove from product">
                <Button
                  icon={DeleteMinor}
                  accessibilityLabel={`Remove part ${part.sku} from product`}
                  destructive
                  disabled={disabled}
                  // @todo
                  onClick={handleDelete}
                />
              </Tooltip>
            </Stack.Item>
          </Stack>
        </ResourceList.Item>
      </div>
      <Collapsible
        id={`erp-part-data-${part.id}`}
        open={open && !globalIsDragging}
      >
        <br />
        <PartDetails erp={part.erp} />
      </Collapsible>
    </>
  );
}

Part.Options = PartOptions;
Part.Alternate = PartAlternate;
Part.Price = PartPrice;

export default Part;
