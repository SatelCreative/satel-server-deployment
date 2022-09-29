import React, { useState, useMemo } from 'react';
import {
  ResourceList,
  ButtonGroup,
  Button,
  Stack,
  Heading,
  Tooltip,
} from '@shopify/polaris';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { EditMinor } from '@shopify/polaris-icons';
import { ProductPart } from '../../types';
import Part from './Part';
import OptionsModal from './OptionsModal';
import { PartsLayout } from './Parts';

export interface PartsEditProps {
  disabled: boolean;
  parts: ProductPart[];
  options: {
    option1: string;
    option2: string;
    option3: string;
  };
  onMovePart: (from: number, to: number) => void;
  onDeletePart: (index: number) => void;
  onRequestAdd: () => void;
}

function PartsEdit(props: PartsEditProps) {
  const { disabled, parts, options, onMovePart, onDeletePart, onRequestAdd } =
    props;

  const [selectedTab, setSelectedTab] = useState('options-tab');
  const [editingOptions, setEditingOptions] = useState(false);

  const header = useMemo(
    () => (
      <Stack alignment="center" distribution="trailing">
        <Stack.Item fill>
          <Heading>Parts</Heading>
        </Stack.Item>
        {selectedTab === 'options-tab' && (
          <Stack.Item>
            <Tooltip content="Edit options">
              <Button icon={EditMinor} onClick={() => setEditingOptions(true)}>
                Edit options
              </Button>
            </Tooltip>
          </Stack.Item>
        )}
        <ButtonGroup segmented>
          <Button
            key="options-tab"
            primary={selectedTab === 'options-tab'}
            onClick={() => setSelectedTab('options-tab')}
          >
            Options
          </Button>
          <Button
            key="alternate-tab"
            primary={selectedTab === 'alternate-tab'}
            onClick={() => setSelectedTab('alternate-tab')}
          >
            Alternate
          </Button>
          <Button
            key="price-tab"
            primary={selectedTab === 'price-tab'}
            onClick={() => setSelectedTab('price-tab')}
          >
            Price
          </Button>
        </ButtonGroup>
        <Button disabled={disabled} onClick={onRequestAdd}>
          Add parts
        </Button>
      </Stack>
    ),
    [disabled, onRequestAdd, selectedTab],
  );
  return (
    <PartsLayout header={header}>
      <OptionsModal
        open={editingOptions}
        onClose={() => setEditingOptions(false)}
      />
      <div className="partListing">
        <DndProvider backend={HTML5Backend}>
          <ResourceList
            items={parts}
            renderItem={(part, id, index) => {
              const sharedProps = {
                name: `parts.${index}`,
                disabled,
              };
              let tab;
              switch (selectedTab) {
                case 'options-tab': {
                  tab = <Part.Options {...sharedProps} {...options} />;
                  break;
                }
                case 'alternate-tab': {
                  tab = (
                    <Part.Alternate distribution="trailing" {...sharedProps} />
                  );
                  break;
                }
                case 'price-tab': {
                  tab = <Part.Price distribution="trailing" {...sharedProps} />;
                  break;
                }
                default:
                  throw new Error(`Invalid tab ${selectedTab}`);
              }
              return (
                <Part
                  key={id}
                  {...part}
                  index={index}
                  disabled={disabled}
                  onMovePart={onMovePart}
                  onDeletePart={onDeletePart}
                >
                  {tab}
                </Part>
              );
            }}
          />
        </DndProvider>
      </div>
    </PartsLayout>
  );
}

export default PartsEdit;
