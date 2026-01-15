/**
 * Expanded Widget Modal
 *
 * Full-screen or large modal view for exploring widget details.
 * Provides more space for data visualizations and interactive content.
 */

import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { IoClose, IoExpand } from 'react-icons/io5';
import styles from './ExpandedWidgetModal.module.scss';

interface ExpandedWidgetModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}

export function ExpandedWidgetModal({
  isOpen,
  onClose,
  title,
  children,
}: ExpandedWidgetModalProps) {
  const overlayRef = useRef<HTMLDivElement>(null);
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen && overlayRef.current && modalRef.current) {
      // Entrance animation
      gsap.fromTo(
        overlayRef.current,
        { opacity: 0 },
        { opacity: 1, duration: 0.3, ease: 'power2.out' }
      );

      gsap.fromTo(
        modalRef.current,
        { scale: 0.9, opacity: 0, y: 50 },
        {
          scale: 1,
          opacity: 1,
          y: 0,
          duration: 0.5,
          ease: 'back.out(1.4)',
          delay: 0.1,
        }
      );

      // Prevent body scroll
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  const handleClose = () => {
    if (overlayRef.current && modalRef.current) {
      // Exit animation
      gsap.to(modalRef.current, {
        scale: 0.9,
        opacity: 0,
        y: 50,
        duration: 0.3,
        ease: 'power2.in',
      });

      gsap.to(overlayRef.current, {
        opacity: 0,
        duration: 0.3,
        ease: 'power2.in',
        onComplete: onClose,
      });
    } else {
      onClose();
    }
  };

  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      handleClose();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      handleClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div
      ref={overlayRef}
      className={styles.overlay}
      onClick={handleOverlayClick}
      onKeyDown={handleKeyDown}
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
    >
      <div ref={modalRef} className={styles.modal}>
        <header className={styles.modalHeader}>
          <div className={styles.headerContent}>
            <IoExpand className={styles.expandIcon} aria-hidden="true" />
            <h2 id="modal-title" className={styles.modalTitle}>
              {title}
            </h2>
          </div>
          <button
            onClick={handleClose}
            className={styles.closeButton}
            aria-label="Close expanded view"
          >
            <IoClose size={24} />
          </button>
        </header>

        <div className={styles.modalBody}>{children}</div>
      </div>
    </div>
  );
}
