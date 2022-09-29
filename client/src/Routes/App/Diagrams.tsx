import React, { useState, useCallback } from 'react';
import {
  Pagination,
  Card,
  Stack,
  ResourceList,
  _SECRET_INTERNAL_FilterControl as FilterControl,
} from '@shopify/polaris';
import { RouteComponentProps } from '@reach/router';
import { SettingsMinor } from '@shopify/polaris-icons';
import { APIDiagramOnly } from '../../Data/types';
import { diagramsLoad, diagramDelete } from '../../Data';
import { usePaginatedResource } from '../../Hooks';
import DiagramsListItem from '../../Components/ListItems/DiagramsListItem';
import ConfirmationModal from '../../Components/Common/ConfirmationModal';
import { useLoading, useToast } from '../../BridgeHooks';
import { Filter, FilterType } from '../../types';
import { Page } from '../../Components/Page';

const DIAGRAM_FILTERS: Filter[] = [
  {
    key: 'published',
    label: 'Availability',
    operatorText: 'is',
    type: FilterType.Select,
    options: [
      { value: 'true', label: 'available on Online Store' },
      { value: 'false', label: 'unavailable on Online Store' },
    ],
  },
  // {
  //   key: 'updated_at',
  //   label: 'Updated',
  //   type: FilterType.DateSelector,
  //   minKey: 'updated_at_min',
  //   maxKey: 'updated_at_max',
  //   dateOptionType: 'past',
  // },
  // {
  //   key: 'created_at',
  //   label: 'Created',
  //   type: FilterType.DateSelector,
  //   minKey: 'created_at_min',
  //   maxKey: 'created_at_max',
  //   dateOptionType: 'past',
  // },
  {
    key: 'nparts',
    label: 'Number of parts',
    operatorText: [
      { key: 'nparts:gt', optionLabel: 'is greater than' },
      { key: 'nparts:lt', optionLabel: 'is less than' },
      { key: 'nparts:eq', optionLabel: 'equals' },
    ],
    type: FilterType.TextField,
    textFieldType: 'number',
  },
];

interface InternalDiagramsProps {
  onRequestDelete: (diagram: APIDiagramOnly) => void;
}

function InternalDiagrams(props: InternalDiagramsProps) {
  const { onRequestDelete } = props;

  const {
    loading,
    error,
    items: diagrams,
    pagination,
    query,
    handleQueryUpdate,
    filter,
  } = usePaginatedResource<APIDiagramOnly>({
    loadItems: diagramsLoad,
    filters: DIAGRAM_FILTERS,
  });

  useLoading(loading, { controlled: true });

  const handleRequestDelete = useCallback(
    (id: string) => {
      const currentDiagram = diagrams.find((diagram) => id === diagram.id);
      if (!currentDiagram) {
        return;
      }
      onRequestDelete(currentDiagram);
    },
    [onRequestDelete, diagrams],
  );

  const handleRenderRow = useCallback(
    (diagram: APIDiagramOnly, id) => (
      <DiagramsListItem
        key={id}
        diagram={diagram}
        onRequestDelete={handleRequestDelete}
      />
    ),
    [handleRequestDelete],
  );

  if (error) {
    // @todo pretty error message
    return <p>Something went wrong! Check the console</p>;
  }

  return (
    <Card>
      <Card.Section>
        <ResourceList
          resourceName={{ singular: 'Diagram', plural: 'Diagrams' }}
          items={diagrams}
          loading={loading}
          renderItem={handleRenderRow}
          filterControl={
            <FilterControl
              placeholder="Search diagrams"
              searchValue={query}
              onSearchChange={handleQueryUpdate}
              {...filter}
            />
          }
        />
      </Card.Section>
      <Card.Section>
        <Stack alignment="center" distribution="center">
          <Pagination {...pagination} />
        </Stack>
      </Card.Section>
    </Card>
  );
}

function Diagrams(props: RouteComponentProps) {
  const showToast = useToast();

  const [modalOpen, setModalOpen] = useState(false);

  const [diagramToDelete, setDiagramToDelete] = useState<APIDiagramOnly>();
  const [deleting, setDeleting] = useState(false);
  useLoading(deleting, { controlled: true });

  const handleDelete = useCallback(() => {
    setDeleting(true);

    if (!diagramToDelete) {
      setDeleting(false);
      setModalOpen(false);
      showToast({ message: 'Failed to delete diagram', error: true });
      return;
    }

    diagramDelete(diagramToDelete.id)
      .then(() => {
        setDeleting(false);
        setModalOpen(false);
        showToast({
          message: `Successfully deleted diagram ${diagramToDelete.name}`,
        });
        setDiagramToDelete(undefined);
        window.location.reload();
      })
      .catch((e) => {
        // eslint-disable-next-line no-console
        console.warn(e);
        setDeleting(false);
        setModalOpen(false);
        showToast({
          message: `Failed to delete diagram ${diagramToDelete.name}`,
          error: true,
        });
        setDiagramToDelete(undefined);
      });
  }, [diagramToDelete, showToast]);

  const handleRequestDelete = useCallback(
    (diagram: APIDiagramOnly) => {
      setDiagramToDelete(diagram);
      setModalOpen(!modalOpen);
    },
    [modalOpen],
  );

  const handleCancelDelete = () => {
    setModalOpen(false);
    setDiagramToDelete(undefined);
  };

  return (
    <Page
      title="Diagrams"
      breadcrumbs={[
        {
          content: 'Home',
          url: '/',
        },
      ]}
      primaryAction={{
        content: 'Create Diagram',
        url: '/diagrams/new',
      }}
      secondaryActions={[
        {
          content: 'Manage categorization',
          url: '/diagrams/categorization',
          icon: SettingsMinor,
        },
      ]}
      fullWidth
    >
      <ConfirmationModal
        open={modalOpen}
        onCancelDelete={handleCancelDelete}
        onDelete={handleDelete}
        deleting={deleting}
      />
      <InternalDiagrams onRequestDelete={handleRequestDelete} />
    </Page>
  );
}

export default Diagrams;
