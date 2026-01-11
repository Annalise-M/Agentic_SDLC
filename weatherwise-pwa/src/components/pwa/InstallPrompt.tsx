import { useEffect, useState } from 'react';
import { IoClose, IoDownload } from 'react-icons/io5';
import styles from './InstallPrompt.module.scss';

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

export function InstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [showPrompt, setShowPrompt] = useState(false);

  useEffect(() => {
    const handler = (e: Event) => {
      // Prevent the mini-infobar from appearing on mobile
      e.preventDefault();

      // Stash the event so it can be triggered later
      setDeferredPrompt(e as BeforeInstallPromptEvent);

      // Show the install prompt after a short delay
      setTimeout(() => {
        setShowPrompt(true);
      }, 5000); // Show after 5 seconds
    };

    window.addEventListener('beforeinstallprompt', handler);

    // Check if already installed
    if (window.matchMedia('(display-mode: standalone)').matches) {
      setShowPrompt(false);
    }

    return () => {
      window.removeEventListener('beforeinstallprompt', handler);
    };
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) {
      return;
    }

    // Show the install prompt
    await deferredPrompt.prompt();

    // Wait for the user to respond to the prompt
    const { outcome } = await deferredPrompt.userChoice;

    console.log(`User response to the install prompt: ${outcome}`);

    // Clear the deferredPrompt and hide the prompt
    setDeferredPrompt(null);
    setShowPrompt(false);
  };

  const handleDismiss = () => {
    setShowPrompt(false);
  };

  if (!showPrompt || !deferredPrompt) {
    return null;
  }

  return (
    <div className={styles.installPrompt}>
      <div className={styles.promptContent}>
        <div className={styles.iconContainer}>
          <IoDownload className={styles.downloadIcon} />
        </div>
        <div className={styles.textContent}>
          <h3 className={styles.title}>Install WeatherWise</h3>
          <p className={styles.description}>
            Add to your home screen for quick access and offline use
          </p>
        </div>
        <div className={styles.actions}>
          <button
            onClick={handleInstallClick}
            className={styles.installButton}
            aria-label="Install app"
          >
            Install
          </button>
          <button
            onClick={handleDismiss}
            className={styles.dismissButton}
            aria-label="Dismiss install prompt"
          >
            <IoClose size={20} />
          </button>
        </div>
      </div>
    </div>
  );
}
