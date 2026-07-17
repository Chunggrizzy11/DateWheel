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
    <Modal open={open} onClose={onClose} size="sm" className="relative p-0 overflow-hidden bg-white">
      <button 
        onClick={onClose}
        className="absolute top-0 right-0 w-11 h-11 bg-[#b91c1c] hover:bg-[#991b1b] flex items-center justify-center text-white rounded-bl-xl transition-colors z-10"
      >
        <X size={24} strokeWidth={2.5} />
      </button>

      <div className="text-center -m-6 pt-2">
        <h2 className="text-2xl font-normal text-gray-700 py-4 border-b border-gray-100">
          Bạn đã quay vào ô
        </h2>
        
        <div className="py-12">
          <h3 className="text-[2.5rem] font-bold text-[#eab308] drop-shadow-sm px-4 leading-tight">
            {winner.name}
          </h3>
        </div>

        <div className="flex items-center justify-center gap-3 py-6 border-t border-gray-100 bg-gray-50/50">
          <button 
            onClick={() => {
              if (onDelete) onDelete();
              onClose();
            }}
            className="px-6 py-2.5 bg-[#dc3545] hover:bg-[#c82333] text-white rounded shadow-sm text-sm font-medium transition-colors"
          >
            Xóa ô này
          </button>
          <button 
            onClick={onClose}
            className="px-6 py-2.5 bg-[#6c757d] hover:bg-[#5a6268] text-white rounded shadow-sm text-sm font-medium transition-colors"
          >
            Đóng lại
          </button>
        </div>
      </div>
    </Modal>
  );
}
