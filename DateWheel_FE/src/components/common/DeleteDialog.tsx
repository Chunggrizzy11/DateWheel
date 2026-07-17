import ConfirmDialog from './ConfirmDialog';

interface DeleteDialogProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  itemName?: string;
  loading?: boolean;
}

export default function DeleteDialog({ open, onClose, onConfirm, itemName, loading }: DeleteDialogProps) {
  return (
    <ConfirmDialog
      open={open}
      onClose={onClose}
      onConfirm={onConfirm}
      title="Delete"
      message={`Are you sure you want to delete${itemName ? ` "${itemName}"` : ''}? This action cannot be undone.`}
      confirmText="Delete"
      variant="danger"
      loading={loading}
    />
  );
}
