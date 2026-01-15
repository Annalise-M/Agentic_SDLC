/**
 * Widget Container
 *
 * Responsive grid/layout container for dashboard widgets.
 * Handles widget rendering, layout, and reordering with GSAP drag and drop.
 */

import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { Draggable } from 'gsap/dist/Draggable';
import { useWidgetStore } from '../../store/widget-store';
import type { Widget } from '../../types/widgets';
import styles from './WidgetContainer.module.scss';

// Register GSAP Draggable plugin
gsap.registerPlugin(Draggable);

interface WidgetContainerProps {
  children?: React.ReactNode;
}

export function WidgetContainer({ children }: WidgetContainerProps) {
  const { layout, gridColumns, reorderWidgets } = useWidgetStore();
  const containerRef = useRef<HTMLDivElement>(null);
  const draggableInstances = useRef<Draggable[]>([]);

  useEffect(() => {
    if (!containerRef.current) return;

    const widgets = Array.from(
      containerRef.current.querySelectorAll('[data-widget-id]')
    ) as HTMLElement[];

    if (widgets.length === 0) return;

    // Clean up previous instances
    draggableInstances.current.forEach((instance) => instance.kill());
    draggableInstances.current = [];

    // Create draggable instances for each widget (except weather widget)
    const draggableWidgets = widgets.filter(
      (w) => w.dataset.widgetId !== 'weather-main'
    );

    if (draggableWidgets.length === 0) return;

    const instances = Draggable.create(draggableWidgets, {
      type: 'x,y',
      bounds: containerRef.current,
      edgeResistance: 0.85,
      inertia: true,
      dragClickables: false,
      cursor: 'grab',
      activeCursor: 'grabbing',
      zIndexBoost: true,
      onDragStart: function () {
        // Add dragging class for visual feedback
        this.target.classList.add(styles.dragging);
        gsap.to(this.target, {
          scale: 1.08,
          boxShadow: '0 16px 48px rgba(0, 0, 0, 0.3)',
          duration: 0.15,
          ease: 'power2.out',
        });
      },
      onDrag: function () {
        // Check if we're overlapping with another widget
        const currentWidget = this.target;
        draggableWidgets.forEach((widget) => {
          if (widget === currentWidget) return;
          if (widget.dataset.widgetId === 'weather-main') return;

          const overlap = checkOverlap(currentWidget, widget);
          if (overlap > 0.4) {
            // Swap positions with smooth animation
            gsap.to(widget, {
              scale: 0.95,
              duration: 0.15,
              ease: 'power2.out',
              onComplete: () => {
                gsap.to(widget, { scale: 1, duration: 0.15, ease: 'power2.out' });
              },
            });
            swapWidgets(currentWidget, widget);
          }
        });
      },
      onDragEnd: function () {
        // Remove dragging class
        this.target.classList.remove(styles.dragging);

        // Animate back to grid position with smooth easing
        gsap.to(this.target, {
          scale: 1,
          boxShadow: '0 8px 24px rgba(0, 0, 0, 0.2)',
          x: 0,
          y: 0,
          duration: 0.4,
          ease: 'power3.out',
          onComplete: () => {
            // Save new order
            const newOrder = Array.from(
              containerRef.current!.querySelectorAll('[data-widget-id]')
            ).map((el) => (el as HTMLElement).dataset.widgetId!);
            reorderWidgets(newOrder);
          },
        });
      },
    });

    draggableInstances.current = instances;

    return () => {
      // Cleanup on unmount
      instances.forEach((instance) => instance.kill());
    };
  }, [children, layout, reorderWidgets]);

  // Helper function to check overlap between two elements
  function checkOverlap(el1: HTMLElement, el2: HTMLElement): number {
    const rect1 = el1.getBoundingClientRect();
    const rect2 = el2.getBoundingClientRect();

    const xOverlap = Math.max(
      0,
      Math.min(rect1.right, rect2.right) - Math.max(rect1.left, rect2.left)
    );
    const yOverlap = Math.max(
      0,
      Math.min(rect1.bottom, rect2.bottom) - Math.max(rect1.top, rect2.top)
    );
    const overlapArea = xOverlap * yOverlap;
    const rect1Area = rect1.width * rect1.height;

    return overlapArea / rect1Area;
  }

  // Helper function to swap widget positions in DOM
  function swapWidgets(el1: HTMLElement, el2: HTMLElement) {
    const parent = el1.parentNode;
    const sibling = el1.nextSibling === el2 ? el1 : el1.nextSibling;

    el2.parentNode!.insertBefore(el1, el2);
    parent!.insertBefore(el2, sibling);
  }

  return (
    <div
      ref={containerRef}
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
      // Don't allow removing core weather widget
      return;
    }
    if (onRemove) {
      onRemove();
    } else {
      disableWidget(widget.id);
    }
  };

  const widgetSize = `${widget.width || 1}x${widget.height || 1}`;

  return (
    <div
      className={styles.widgetWrapper}
      data-widget-id={widget.id}
      data-size={widgetSize}
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
