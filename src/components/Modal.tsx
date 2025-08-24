import type { PropsWithChildren } from 'react';
import { useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';

interface ModalProps {
  isOpen: boolean;
  title: string;
  onClose: () => void;
  footer?: React.ReactNode;
}

export function Modal({
  isOpen,
  title,
  onClose,
  footer,
  children,
}: PropsWithChildren<ModalProps>) {
  const modalRoot = document.getElementById('modal-root');
  const dialogRef = useRef<HTMLDivElement>(null);
  const previouslyFocusedElement = useRef<Element | null>(null);

  useEffect(() => {
    if (!isOpen) return;
    previouslyFocusedElement.current = document.activeElement;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'Tab') {
        const focusable = dialogRef.current?.querySelectorAll<HTMLElement>(
          'a[href], button, textarea, input, select, [tabindex]:not([tabindex="-1"])'
        );
        if (!focusable || focusable.length === 0) return;
        const first = focusable[0];
        const last = focusable[focusable.length - 1];
        if (e.shiftKey) {
          if (document.activeElement === first) {
            last.focus();
            e.preventDefault();
          }
        } else {
          if (document.activeElement === last) {
            first.focus();
            e.preventDefault();
          }
        }
      }
    };
    document.addEventListener('keydown', onKey);
    const timer = setTimeout(() => {
      dialogRef.current
        ?.querySelector<HTMLElement>('[data-autofocus]')
        ?.focus();
    }, 0);
    return () => {
      document.removeEventListener('keydown', onKey);
      clearTimeout(timer);
      if (previouslyFocusedElement.current instanceof HTMLElement) {
        previouslyFocusedElement.current.focus();
      }
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) onClose();
  };

  if (!modalRoot) return null;

  return createPortal(
    <div
      className="fixed inset-0 bg-black/50 flex items-center justify-center"
      role="presentation"
      onMouseDown={handleBackdropClick}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
        className="bg-white rounded-lg w-full max-w-2xl shadow-xl"
        ref={dialogRef}
      >
        <header className="flex items-center gap-2 p-4 border-b">
          <h2 id="modal-title" className="m-0 text-xl font-semibold flex-1">
            {title}
          </h2>
          <span className="sr-only" id="dialog-desc">
            Modal dialog
          </span>
          <button
            aria-label="Close"
            className="text-xl px-2"
            onClick={onClose}
            data-autofocus
          >
            ×
          </button>
        </header>
        <main className="p-4">{children}</main>
        {footer && <footer className="p-4 border-t">{footer}</footer>}
      </div>
    </div>,
    modalRoot
  );
}
