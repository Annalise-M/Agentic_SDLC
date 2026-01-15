/**
 * Widget Marketplace
 *
 * Browse and manage available widgets.
 * Users can enable/disable widgets and see what's available.
 */

import { useState } from 'react';
import { IoClose, IoCheckmark } from 'react-icons/io5';
import { useWidgetStore } from '../../store/widget-store';
import { WIDGET_CATALOG, getWidgetCategories } from '../../lib/widgets/widget-catalog';
import type { WidgetMetadata } from '../../types/widgets';
import styles from './WidgetMarketplace.module.scss';

interface WidgetMarketplaceProps {
  isOpen: boolean;
  onClose: () => void;
}

export function WidgetMarketplace({ isOpen, onClose }: WidgetMarketplaceProps) {
  const { widgets, addWidget, disableWidget } = useWidgetStore();
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const categories = ['all', ...getWidgetCategories()];

  if (!isOpen) return null;

  const filteredWidgets =
    selectedCategory === 'all'
      ? WIDGET_CATALOG
      : WIDGET_CATALOG.filter((w) => w.category === selectedCategory);

  const isWidgetEnabled = (widgetMeta: WidgetMetadata) => {
    const widget = widgets.find((w) => w.type === widgetMeta.type);
    return widget?.enabled || false;
  };

  const handleToggleWidget = (widgetMeta: WidgetMetadata) => {
    const existingWidget = widgets.find((w) => w.type === widgetMeta.type);

    if (existingWidget) {
      if (existingWidget.enabled) {
        disableWidget(existingWidget.id);
      } else {
        addWidget(widgetMeta.type);
      }
    } else {
      addWidget(widgetMeta.type);
    }
  };

  const getCategoryLabel = (category: string) => {
    return category.charAt(0).toUpperCase() + category.slice(1);
  };

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className={styles.header}>
          <div>
            <h2 className={styles.title}>Widget Marketplace</h2>
            <p className={styles.subtitle}>Customize your travel dashboard</p>
          </div>
          <button
            onClick={onClose}
            className={styles.closeButton}
            aria-label="Close marketplace"
          >
            <IoClose size={24} />
          </button>
        </div>

        {/* Category Filter */}
        <div className={styles.categories}>
          {categories.map((category) => (
            <button
              key={category}
              className={`${styles.categoryChip} ${selectedCategory === category ? styles.active : ''}`}
              onClick={() => setSelectedCategory(category)}
              aria-pressed={selectedCategory === category}
            >
              {getCategoryLabel(category)}
            </button>
          ))}
        </div>

        {/* Widget Grid */}
        <div className={styles.widgetGrid}>
          {filteredWidgets.map((widgetMeta) => {
            const enabled = isWidgetEnabled(widgetMeta);
            const isCoreWidget = widgetMeta.type === 'weather-comparison';

            return (
              <div
                key={widgetMeta.id}
                className={`${styles.widgetCard} ${enabled ? styles.enabled : ''}`}
              >
                <div className={styles.widgetIcon}>{widgetMeta.icon}</div>
                <div className={styles.widgetInfo}>
                  <h3 className={styles.widgetName}>
                    {widgetMeta.name}
                    {widgetMeta.isPremium && (
                      <span className={styles.premiumBadge}>PRO</span>
                    )}
                  </h3>
                  <p className={styles.widgetDescription}>
                    {widgetMeta.description}
                  </p>
                  {widgetMeta.requiresAuth && (
                    <p className={styles.authNote}>
                      Requires {widgetMeta.authProvider} connection
                    </p>
                  )}
                </div>
                <button
                  className={`${styles.toggleButton} ${enabled ? styles.enabled : ''}`}
                  onClick={() => handleToggleWidget(widgetMeta)}
                  disabled={isCoreWidget}
                  aria-label={
                    isCoreWidget
                      ? 'Core widget - always enabled'
                      : enabled
                      ? `Disable ${widgetMeta.name}`
                      : `Enable ${widgetMeta.name}`
                  }
                >
                  {isCoreWidget ? (
                    <IoCheckmark size={20} />
                  ) : enabled ? (
                    <IoCheckmark size={20} />
                  ) : (
                    <span className={styles.addIcon}>+</span>
                  )}
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
