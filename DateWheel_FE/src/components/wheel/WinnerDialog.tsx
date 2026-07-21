import { Category } from '../../types/category';
import { X } from 'lucide-react';
import Modal from '../common/Modal';

interface WinnerDialogProps {
  winner: Category | null;
  open: boolean;
  onClose: () => void;
  onDelete?: () => void;
}

export default function WinnerDialog({ winner, open, onClose, onDelete }: WinnerDialogProps) {
  if (!winner) return null;

  return (
    <Modal open={open} onClose={onClose} size="sm" className="relative p-0 overflow-hidden">
      <button 
        onClick={onClose}
        className="absolute top-0 right-0 w-11 h-11 bg-danger hover:bg-danger-strong flex items-center justify-center text-white rounded-bl-xl transition-colors z-10"
      >
        <X size={24} strokeWidth={2.5} />
      </button>

      <div className="text-center -m-6 pt-2">
        <h2 className="text-2xl font-normal text-heading py-4 border-b border-glass-border">
          Bạn đã quay vào ô
        </h2>
        
        <div className="py-12">
          <h3 className="text-[2.5rem] font-bold text-brand drop-shadow-sm px-4 leading-tight">
            {winner.name}
          </h3>
        </div>

        <div className="flex items-center justify-center gap-3 py-6 border-t border-glass-border bg-glass-bg">
          <button 
            onClick={() => {
              if (onDelete) onDelete();
              onClose();
            }}
            className="btn-danger rounded-base"
          >
            Xóa ô này
          </button>
          <button 
            onClick={onClose}
            className="btn-secondary rounded-base"
          >
            Đóng lại
          </button>
        </div>
      </div>
    </Modal>
  );
}
