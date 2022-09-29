import React from 'react';
import { Modal } from '@shopify/polaris';

interface Props {
  open: boolean;
  onCancelDelete: () => void;
  deleting: boolean;
  onDelete: () => void;
}

function ConfirmationModal(props: Props) {
  const { open, onCancelDelete, deleting, onDelete } = props;

  return (
    <Modal
      open={open}
      onClose={() => onCancelDelete()}
      title="Confirm diagram deletion"
      primaryAction={{
        content: 'Delete diagram',
        onAction: () => onDelete(),
        destructive: true,
        loading: deleting,
        disabled: deleting,
      }}
      secondaryActions={[
        {
          content: 'Cancel',
          onAction: () => onCancelDelete(),
          disabled: deleting,
        },
      ]}
    >
      <Modal.Section>
        Are you sure you want to delete this diagram? This action cannot be
        reversed
      </Modal.Section>
    </Modal>
  );
}

export default ConfirmationModal;
