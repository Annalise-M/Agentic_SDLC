/**
 * Credits Modal
 *
 * Displays attribution for weather data and other contributors.
 */

import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { IoClose, IoHeart, IoInformationCircle } from 'react-icons/io5';
import styles from './CreditsModal.module.scss';

interface CreditsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function CreditsModal({ isOpen, onClose }: CreditsModalProps) {
  const overlayRef = useRef<HTMLDivElement>(null);
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen && overlayRef.current && modalRef.current) {
      gsap.fromTo(
        overlayRef.current,
        { opacity: 0 },
        { opacity: 1, duration: 0.3, ease: 'power2.out' }
      );

      gsap.fromTo(
        modalRef.current,
        { scale: 0.9, opacity: 0, y: 30 },
        {
          scale: 1,
          opacity: 1,
          y: 0,
          duration: 0.4,
          ease: 'back.out(1.4)',
          delay: 0.1,
        }
      );

      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  const handleClose = () => {
    if (overlayRef.current && modalRef.current) {
      gsap.to(modalRef.current, {
        scale: 0.9,
        opacity: 0,
        y: 30,
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

  if (!isOpen) return null;

  return (
    <div
      ref={overlayRef}
      className={styles.overlay}
      onClick={(e) => e.target === e.currentTarget && handleClose()}
      role="dialog"
      aria-modal="true"
      aria-labelledby="credits-title"
    >
      <div ref={modalRef} className={styles.modal}>
        <button
          onClick={handleClose}
          className={styles.closeButton}
          aria-label="Close credits"
        >
          <IoClose size={24} />
        </button>

        <div className={styles.content}>
          <div className={styles.header}>
            <IoInformationCircle className={styles.headerIcon} />
            <h2 id="credits-title" className={styles.title}>
              Credits & Attribution
            </h2>
          </div>

          <div className={styles.section}>
            <h3 className={styles.sectionTitle}>Weather Data</h3>
            <p className={styles.text}>
              Powered by{' '}
              <a
                href="https://www.visualcrossing.com/"
                target="_blank"
                rel="noopener noreferrer"
                className={styles.link}
              >
                Visual Crossing Weather API
              </a>
            </p>
            <p className={styles.subtext}>
              Accurate, real-time weather data from trusted sources
            </p>
          </div>

          <div className={styles.section}>
            <h3 className={styles.sectionTitle}>Location Images</h3>
            <p className={styles.text}>
              Photos by{' '}
              <a
                href="https://unsplash.com"
                target="_blank"
                rel="noopener noreferrer"
                className={styles.link}
              >
                Unsplash
              </a>
            </p>
            <p className={styles.subtext}>
              Beautiful, high-quality photography from talented creators
            </p>
          </div>

          <div className={styles.section}>
            <h3 className={styles.sectionTitle}>Technology Stack</h3>
            <div className={styles.techList}>
              <span className={styles.techBadge}>React 19</span>
              <span className={styles.techBadge}>TypeScript</span>
              <span className={styles.techBadge}>Vite</span>
              <span className={styles.techBadge}>GSAP</span>
              <span className={styles.techBadge}>Recharts</span>
              <span className={styles.techBadge}>Zustand</span>
            </div>
          </div>

          <div className={styles.footer}>
            <IoHeart className={styles.heartIcon} />
            <p className={styles.footerText}>Built with love for travelers</p>
          </div>
        </div>
      </div>
    </div>
  );
}
