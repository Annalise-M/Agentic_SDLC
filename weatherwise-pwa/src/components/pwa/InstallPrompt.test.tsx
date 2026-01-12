import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest';
import { render, screen, act } from '@testing-library/react';
import { InstallPrompt } from './InstallPrompt';

describe('InstallPrompt', () => {
  let mockPrompt: any;
  let mockUserChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;

  beforeEach(() => {
    // Use fake timers to control the 5-second delay
    vi.useFakeTimers();

    // Reset mocks
    vi.clearAllMocks();

    // Mock the beforeinstallprompt event
    mockUserChoice = Promise.resolve({ outcome: 'accepted' as const });
    mockPrompt = vi.fn().mockResolvedValue(undefined);

    // Mock matchMedia to return not in standalone mode
    Object.defineProperty(window, 'matchMedia', {
      writable: true,
      value: vi.fn().mockImplementation((query) => ({
        matches: query === '(display-mode: browser)',
        media: query,
        onchange: null,
        addListener: vi.fn(),
        removeListener: vi.fn(),
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
        dispatchEvent: vi.fn(),
      })),
    });
  });

  afterEach(() => {
    // Restore real timers
    vi.useRealTimers();
  });

  it('should not render initially', () => {
    const { container } = render(<InstallPrompt />);
    expect(container.firstChild).toBeNull();
  });

  it('should render after beforeinstallprompt event with delay', async () => {
    const { container } = render(<InstallPrompt />);

    // Initially should not render
    expect(container.firstChild).toBeNull();

    // Trigger beforeinstallprompt event
    const event = new Event('beforeinstallprompt');
    (event as any).prompt = mockPrompt;
    (event as any).userChoice = mockUserChoice;
    window.dispatchEvent(event);

    // Should not render immediately (5 second delay)
    expect(container.firstChild).toBeNull();

    // Fast-forward time by 5 seconds
    await act(async () => {
      await vi.advanceTimersByTimeAsync(5000);
    });

    // Now the prompt should appear
    expect(screen.getByText('Install WeatherWise')).toBeInTheDocument();
  });

  it('should display correct content', async () => {
    render(<InstallPrompt />);

    // Trigger event
    const event = new Event('beforeinstallprompt');
    (event as any).prompt = mockPrompt;
    (event as any).userChoice = mockUserChoice;
    window.dispatchEvent(event);

    // Fast-forward time
    await act(async () => {
      await vi.advanceTimersByTimeAsync(5000);
    });

    expect(screen.getByText('Install WeatherWise')).toBeInTheDocument();
    expect(screen.getByText('Add to your home screen for quick access and offline use')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /install app/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /dismiss install prompt/i })).toBeInTheDocument();
  });

  it('should not render if already in standalone mode', () => {
    // Mock standalone mode
    Object.defineProperty(window, 'matchMedia', {
      writable: true,
      value: vi.fn().mockImplementation((query) => ({
        matches: query === '(display-mode: standalone)',
        media: query,
        onchange: null,
        addListener: vi.fn(),
        removeListener: vi.fn(),
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
        dispatchEvent: vi.fn(),
      })),
    });

    const { container } = render(<InstallPrompt />);

    // Trigger event
    const event = new Event('beforeinstallprompt');
    (event as any).prompt = mockPrompt;
    (event as any).userChoice = mockUserChoice;
    window.dispatchEvent(event);

    // Should not render even after event
    expect(container.firstChild).toBeNull();
  });
});
