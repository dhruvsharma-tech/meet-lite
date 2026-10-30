import { AlertTriangle, Trash2, LogOut, UserMinus, X } from 'lucide-react';

export default function ConfirmModal({
  isOpen,
  onClose,
  onConfirm,
  title = 'Are you sure?',
  message = 'This action cannot be undone.',
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  type = 'danger', // 'danger' | 'warning'
  isLoading = false,
}) {
  if (!isOpen) return null;

  const isDanger = type === 'danger';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fade-in select-none">
      {/* Modal Card */}
      <div
        className="w-full max-w-md bg-[#313338] border border-[#1f2023] rounded-2xl shadow-2xl overflow-hidden flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Header Banner */}
        <div className="p-6 pb-4">
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-center gap-3">
              <div
                className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 shadow-inner ${
                  isDanger
                    ? 'bg-[#f23f42]/15 text-[#f23f42] border border-[#f23f42]/20'
                    : 'bg-[#fee75c]/15 text-[#fee75c] border border-[#fee75c]/20'
                }`}
              >
                {isDanger ? <Trash2 className="w-6 h-6" /> : <AlertTriangle className="w-6 h-6" />}
              </div>
              <div>
                <h3 className="text-lg font-bold text-white tracking-tight">{title}</h3>
                <p className="text-xs text-[#949ba4] mt-0.5">Please review before continuing</p>
              </div>
            </div>

            <button
              onClick={onClose}
              disabled={isLoading}
              className="p-1.5 rounded-lg text-[#80848e] hover:text-white hover:bg-[#383a40] transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Message Body */}
        <div className="px-6 py-2">
          <div className="bg-[#2b2d31] border border-[#1f2023] rounded-xl p-4 text-sm text-[#dbdee1] leading-relaxed">
            {message}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="p-6 pt-4 flex items-center justify-end gap-3 bg-[#2b2d31]/50 border-t border-[#1f2023] mt-4">
          <button
            type="button"
            onClick={onClose}
            disabled={isLoading}
            className="px-5 py-2.5 rounded-xl text-xs font-semibold text-white hover:underline transition-all cursor-pointer disabled:opacity-50"
          >
            {cancelText}
          </button>

          <button
            type="button"
            onClick={onConfirm}
            disabled={isLoading}
            className={`px-6 py-2.5 rounded-xl text-xs font-bold text-white transition-all cursor-pointer shadow-md flex items-center gap-2 disabled:opacity-50 ${
              isDanger
                ? 'bg-[#f23f42] hover:bg-[#da373a] hover:shadow-[0_0_16px_rgba(242,63,66,0.4)]'
                : 'bg-[#5865f2] hover:bg-[#4752c4] hover:shadow-[0_0_16px_rgba(88,101,242,0.4)]'
            }`}
          >
            {isLoading ? (
              <span>Processing...</span>
            ) : (
              <>
                {isDanger && <Trash2 className="w-3.5 h-3.5" />}
                <span>{confirmText}</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

