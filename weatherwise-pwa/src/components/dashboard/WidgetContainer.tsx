/**
 * Widget Container - Clean Michele Du Grid
 *
 * Pure CSS Grid layout with no transform-based dragging (for now).
 * Proving the grid works cleanly before adding drag functionality.
 */

import { useWidgetStore } from '../../store/widget-store';
import type { Widget } from '../../types/widgets';
import styles from './WidgetContainer.module.scss';

interface WidgetContainerProps {
  children?: React.ReactNode;
}

export function WidgetContainer({ children }: WidgetContainerProps) {
  const { layout } = useWidgetStore();

  // Ensure we always have a valid layout (default to grid)
  const validLayout = layout || 'grid';
  const layoutClass = styles[`layout-${validLayout}`] || styles['layout-grid'];

  return (
    <div
      className={`${styles.widgetContainer} ${layoutClass}`}
      data-layout={validLayout}
    >
      {children}
    </div>
  );
}

/**
 * Individual Widget Wrapper
 * Provides consistent styling, controls, and drag handle for each widget
 */
interface WidgetWrapperProps {
  widget: Widget;
  children: React.ReactNode;
  onRemove?: () => void;
  onConfigure?: () => void;
  onExpand?: () => void;
}

export function WidgetWrapper({
  widget,
  children,
  onRemove,
  onConfigure,
  onExpand,
}: WidgetWrapperProps) {
  const { disableWidget } = useWidgetStore();

  const handleRemove = () => {
    if (widget.type === 'weather-comparison') {
      return;
    }
    if (onRemove) {
      onRemove();
    } else {
      disableWidget(widget.id);
    }
  };

  // Ensure valid dimensions (fallback to 1 if invalid)
  const width = Number.isInteger(widget.width) && widget.width > 0 ? widget.width : 1;
  const height = Number.isInteger(widget.height) && widget.height > 0 ? widget.height : 1;
  const widgetSize = `${width}x${height}`;

  return (
    <div
      className={styles.widgetWrapper}
      data-widget-id={widget.id}
      data-size={widgetSize}
      style={{
        gridColumn: `span ${width}`,
        gridRow: `span ${height}`,
      }}
    >
      {/* Drag Handle */}
      <div className={styles.dragHandle} aria-label="Drag to reorder">
        <div className={styles.dragDots}>
          <span></span>
          <span></span>
          <span></span>
          <span></span>
          <span></span>
          <span></span>
        </div>
      </div>

      {/* Widget Controls */}
      <div className={styles.widgetControls}>
        {onExpand && (
          <button
            className={styles.widgetButton}
            onClick={onExpand}
            aria-label="Expand widget to fullscreen"
            title="Expand"
          >
            ⛶
          </button>
        )}
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

      {/* Widget Content */}
      <div className={styles.widgetContent}>{children}</div>
    </div>
  );
}
