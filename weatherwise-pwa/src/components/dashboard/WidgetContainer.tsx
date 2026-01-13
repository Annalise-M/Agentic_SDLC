/**
 * Widget Container
 *
 * Responsive grid/layout container for dashboard widgets.
 * Handles widget rendering, layout, and reordering.
 */

import { useWidgetStore } from '../../store/widget-store';
import type { Widget } from '../../types/widgets';
import styles from './WidgetContainer.module.scss';

interface WidgetContainerProps {
  children?: React.ReactNode;
}

export function WidgetContainer({ children }: WidgetContainerProps) {
  const { layout, gridColumns } = useWidgetStore();

  return (
    <div
      className={`${styles.widgetContainer} ${styles[`layout-${layout}`]}`}
      style={{
        '--grid-columns': gridColumns,
      } as React.CSSProperties}
    >
      {children}
    </div>
  );
}

/**
 * Individual Widget Wrapper
 * Provides consistent styling and controls for each widget
 */
interface WidgetWrapperProps {
  widget: Widget;
  children: React.ReactNode;
  onRemove?: () => void;
  onConfigure?: () => void;
}

export function WidgetWrapper({
  widget,
  children,
  onRemove,
  onConfigure,
}: WidgetWrapperProps) {
  const { disableWidget } = useWidgetStore();

  const handleRemove = () => {
    if (widget.type === 'weather-comparison') {
      // Don't allow removing core weather widget
      return;
    }
    if (onRemove) {
      onRemove();
    } else {
      disableWidget(widget.id);
    }
  };

  return (
    <div className={styles.widgetWrapper} data-widget-id={widget.id}>
      <div className={styles.widgetControls}>
        {onConfigure && (
          <button
            className={styles.widgetButton}
            onClick={onConfigure}
            aria-label="Configure widget"
          >
            ⚙️
          </button>
        )}
        {widget.type !== 'weather-comparison' && (
          <button
            className={styles.widgetButton}
            onClick={handleRemove}
            aria-label="Remove widget"
          >
            ✕
          </button>
        )}
      </div>
      <div className={styles.widgetContent}>{children}</div>
    </div>
  );
}
