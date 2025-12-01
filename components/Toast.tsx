
import React, { useEffect } from 'react';
import { CheckCircleIcon, XCircleIcon, AlertTriangleIcon, XIcon } from './icons';

export type ToastType = 'success' | 'error' | 'info';

export interface ToastMessage {
  id: string;
  type: ToastType;
  message: string;
}

interface ToastContainerProps {
  toasts: ToastMessage[];
  removeToast: (id: string) => void;
}

const Toast: React.FC<{ toast: ToastMessage; onRemove: () => void }> = ({ toast, onRemove }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onRemove();
    }, 5000); // Auto dismiss after 5 seconds

    return () => clearTimeout(timer);
  }, [onRemove]);

  const getStyles = () => {
    switch (toast.type) {
      case 'success':
        return 'bg-emerald-50 dark:bg-emerald-900/80 border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-100';
      case 'error':
        return 'bg-rose-50 dark:bg-rose-900/80 border-rose-200 dark:border-rose-800 text-rose-800 dark:text-rose-100';
      case 'info':
      default:
        return 'bg-blue-50 dark:bg-blue-900/80 border-blue-200 dark:border-blue-800 text-blue-800 dark:text-blue-100';
    }
  };

  const getIcon = () => {
    switch (toast.type) {
        case 'success': return <CheckCircleIcon className="w-5 h-5" />;
        case 'error': return <XCircleIcon className="w-5 h-5" />;
        case 'info': return <AlertTriangleIcon className="w-5 h-5" />;
    }
  }

  return (
    <div className={`flex items-center gap-3 p-4 rounded-lg shadow-lg border backdrop-blur-md mb-3 animate-fade-in-down transition-all duration-300 min-w-[300px] ${getStyles()}`}>
      <div className="flex-shrink-0">{getIcon()}</div>
      <p className="text-sm font-medium flex-grow">{toast.message}</p>
      <button onClick={onRemove} className="text-current opacity-70 hover:opacity-100 transition-opacity">
        <XIcon className="w-4 h-4" />
      </button>
    </div>
  );
};

const ToastContainer: React.FC<ToastContainerProps> = ({ toasts, removeToast }) => {
  return (
    <div className="fixed bottom-4 right-4 z-50 flex flex-col items-end pointer-events-none">
      <div className="pointer-events-auto">
        {toasts.map((toast) => (
            <Toast key={toast.id} toast={toast} onRemove={() => removeToast(toast.id)} />
        ))}
      </div>
    </div>
  );
};

export default ToastContainer;
