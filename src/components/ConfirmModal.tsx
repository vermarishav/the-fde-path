import React from 'react';
import { triggerHaptic } from '../utils/haptics';
import { AlertTriangle } from 'lucide-react';

interface ConfirmModalProps {
  isOpen: boolean;
  title: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  isDestructive?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

export const ConfirmModal: React.FC<ConfirmModalProps> = ({
  isOpen,
  title,
  message,
  confirmLabel = 'Confirm',
  cancelLabel = 'Cancel',
  isDestructive = false,
  onConfirm,
  onCancel,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-[#1C1B19]/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-[#FAF8F3] w-full max-w-sm rounded-xl border border-[#E3DED0] p-6 shadow-2xl space-y-4 text-center animate-in fade-in zoom-in-95 duration-150">
        <div
          className={`w-10 h-10 mx-auto rounded-full flex items-center justify-center ${
            isDestructive ? 'bg-[#B5453E]/10 text-[#B5453E]' : 'bg-[#2954A6]/10 text-[#2954A6]'
          }`}
        >
          <AlertTriangle className="w-5 h-5" />
        </div>

        <div>
          <h3 className="font-serif text-lg font-semibold text-[#1C1B19]">{title}</h3>
          <p className="text-xs text-[#55524A] mt-1.5 leading-relaxed">{message}</p>
        </div>

        <div className="flex items-center justify-center gap-2 pt-2">
          <button
            onClick={() => {
              triggerHaptic('light');
              onCancel();
            }}
            className="flex-1 py-2 px-3 text-xs font-mono rounded-full border border-[#E3DED0] bg-[#FAF8F3] hover:bg-[#F2EFE6] text-[#55524A] transition-colors"
          >
            {cancelLabel}
          </button>
          <button
            onClick={() => {
              triggerHaptic(isDestructive ? 'heavy' : 'medium');
              onConfirm();
            }}
            className={`flex-1 py-2 px-3 text-xs font-mono font-medium rounded-full transition-all active:scale-95 ${
              isDestructive
                ? 'bg-[#B5453E] hover:bg-[#9B3932] text-white shadow-xs'
                : 'bg-[#2954A6] hover:bg-[#214486] text-white shadow-xs'
            }`}
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
};
