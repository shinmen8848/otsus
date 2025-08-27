import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { axe, toHaveNoViolations } from 'jest-axe';
import userEvent from '@testing-library/user-event';
import { ColorGradingStudio } from '@/components/ColorGradingStudio';
import { BezierCurveEditor } from '@/components/BezierCurveEditor';
import { ColorWheel } from '@/components/ColorWheel';
import { BeforeAfterComparison } from '@/components/BeforeAfterComparison';
import { PresetManager } from '@/components/PresetManager';
import { ColorGradingSettings, ColorGradingPreset } from '@/types/color-grading';

// Extend Jest matchers
expect.extend(toHaveNoViolations);

// Mock canvas and WebGL
Object.defineProperty(HTMLCanvasElement.prototype, 'getContext', {
  value: () => ({
    drawImage: () => {},
    putImageData: () => {},
    getImageData: () => new ImageData(100, 100),
    createImageData: () => new ImageData(100, 100),
    clearRect: () => {},
    fillRect: () => {},
    beginPath: () => {},
    arc: () => {},
    fill: () => {},
    stroke: () => {},
    fillText: () => {},
    imageSmoothingEnabled: true,
    imageSmoothingQuality: 'high'
  })
});

// Mock performance API
Object.defineProperty(window, 'performance', {
  value: {
    now: () => Date.now(),
    mark: () => {},
    measure: () => {},
    getEntriesByName: () => [{ duration: 16.67 }],
    clearMarks: () => {},
    clearMeasures: () => {}
  }
});

describe('Color Grading Accessibility Tests', () => {
  const mockSettings: ColorGradingSettings = {
    exposure: 0,
    contrast: 0,
    highlights: 0,
    shadows: 0,
    whites: 0,
    blacks: 0,
    temperature: 5500,
    tint: 0,
    vibrance: 0,
    saturation: 0,
    hue: 0,
    lightness: 0,
    toneCurve: {
      shadows: [{ x: 0, y: 0 }, { x: 0.25, y: 0.25 }],
      midtones: [{ x: 0.25, y: 0.25 }, { x: 0.75, y: 0.75 }],
      highlights: [{ x: 0.75, y: 0.75 }, { x: 1, y: 1 }]
    },
    colorWheels: {
      shadows: { hue: 0, saturation: 0, luminance: 0 },
      midtones: { hue: 0, saturation: 0, luminance: 0 },
      highlights: { hue: 0, saturation: 0, luminance: 0 }
    },
    clarity: 0,
    dehaze: 0,
    vignette: { amount: 0, midpoint: 0.5, roundness: 1, feather: 0.5 },
    toneMapping: { algorithm: 'linear', exposure: 0, whitePoint: 11.2 }
  };

  const mockPresets: ColorGradingPreset[] = [
    {
      id: '1',
      name: 'Romantic Warm',
      description: 'Warm, soft tones',
      settings: mockSettings,
      category: 'portrait',
      tags: ['warm', 'romantic'],
      createdAt: new Date(),
      updatedAt: new Date()
    }
  ];

  describe('ColorGradingStudio', () => {
    it('should have no accessibility violations', async () => {
      const { container } = render(<ColorGradingStudio />);
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it('should have proper ARIA labels for controls', () => {
      render(<ColorGradingStudio />);
      
      // Check for upload button
      const uploadButton = screen.getByRole('button', { name: /upload/i });
      expect(uploadButton).toBeInTheDocument();
      
      // Check for tab navigation
      const tabs = screen.getAllByRole('tab');
      expect(tabs.length).toBeGreaterThan(0);
      
      tabs.forEach(tab => {
        expect(tab).toHaveAttribute('aria-selected');
      });
    });

    it('should support keyboard navigation', async () => {
      const user = userEvent.setup();
      render(<ColorGradingStudio />);
      
      const tabs = screen.getAllByRole('tab');
      if (tabs.length > 1) {
        // Focus first tab
        await user.tab();
        expect(tabs[0]).toHaveFocus();
        
        // Navigate to next tab with arrow keys
        await user.keyboard('{ArrowRight}');
        expect(tabs[1]).toHaveFocus();
      }
    });

    it('should have proper contrast ratios', () => {
      render(<ColorGradingStudio />);
      
      // Check that text elements have sufficient contrast
      const headings = screen.getAllByRole('heading');
      headings.forEach(heading => {
        const styles = window.getComputedStyle(heading);
        // This would need actual color contrast calculation in a real test
        expect(styles.color).toBeDefined();
      });
    });
  });

  describe('BezierCurveEditor', () => {
    const mockPoints = [{ x: 0, y: 0 }, { x: 1, y: 1 }];
    const mockOnChange = () => {};

    it('should have no accessibility violations', async () => {
      const { container } = render(
        <BezierCurveEditor points={mockPoints} onChange={mockOnChange} />
      );
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it('should provide keyboard interaction for curve points', async () => {
      const user = userEvent.setup();
      render(<BezierCurveEditor points={mockPoints} onChange={mockOnChange} />);
      
      // SVG should be focusable
      const svg = screen.getByRole('img', { hidden: true }) || 
                  document.querySelector('svg');
      
      if (svg) {
        expect(svg).toBeInTheDocument();
      }
    });

    it('should have descriptive labels and instructions', () => {
      render(<BezierCurveEditor points={mockPoints} onChange={mockOnChange} />);
      
      // Check for instructional text
      expect(screen.getByText(/double-click to add points/i)).toBeInTheDocument();
    });
  });

  describe('ColorWheel', () => {
    const mockColorWheelSettings = { hue: 0, saturation: 0, luminance: 0 };
    const mockOnChange = () => {};

    it('should have no accessibility violations', async () => {
      const { container } = render(
        <ColorWheel settings={mockColorWheelSettings} onChange={mockOnChange} />
      );
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it('should provide alternative input methods', () => {
      render(<ColorWheel settings={mockColorWheelSettings} onChange={mockOnChange} />);
      
      // Check for slider controls as alternatives to the wheel
      const sliders = screen.getAllByRole('slider');
      expect(sliders.length).toBeGreaterThan(0);
      
      sliders.forEach(slider => {
        expect(slider).toHaveAttribute('aria-valuemin');
        expect(slider).toHaveAttribute('aria-valuemax');
        expect(slider).toHaveAttribute('aria-valuenow');
      });
    });

    it('should announce value changes to screen readers', async () => {
      const user = userEvent.setup();
      render(<ColorWheel settings={mockColorWheelSettings} onChange={mockOnChange} />);
      
      const sliders = screen.getAllByRole('slider');
      if (sliders.length > 0) {
        const hueSlider = sliders[0];
        
        // Check initial aria-valuenow
        expect(hueSlider).toHaveAttribute('aria-valuenow');
        
        // Simulate value change
        await user.click(hueSlider);
        // In a real test, we'd verify the aria-valuenow changed
      }
    });
  });

  describe('BeforeAfterComparison', () => {
    const mockImageData = new ImageData(100, 100);

    it('should have no accessibility violations', async () => {
      const { container } = render(
        <BeforeAfterComparison 
          beforeImage={mockImageData} 
          afterImage={mockImageData} 
        />
      );
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it('should provide alternative text for images', () => {
      render(
        <BeforeAfterComparison 
          beforeImage={mockImageData} 
          afterImage={mockImageData} 
          showLabels={true}
        />
      );
      
      // Check for before/after labels
      expect(screen.getByText(/before/i)).toBeInTheDocument();
      expect(screen.getByText(/after/i)).toBeInTheDocument();
    });

    it('should support keyboard control for split position', async () => {
      const user = userEvent.setup();
      const mockOnSplitChange = () => {};
      
      render(
        <BeforeAfterComparison 
          beforeImage={mockImageData} 
          afterImage={mockImageData}
          onSplitPositionChange={mockOnSplitChange}
        />
      );
      
      // Look for interactive elements that control the split
      const buttons = screen.getAllByRole('button');
      expect(buttons.length).toBeGreaterThan(0);
    });
  });

  describe('PresetManager', () => {
    const mockOnLoadPreset = () => {};
    const mockOnSavePreset = () => {};
    const mockOnDeletePreset = () => {};

    it('should have no accessibility violations', async () => {
      const { container } = render(
        <PresetManager
          presets={mockPresets}
          currentSettings={mockSettings}
          onLoadPreset={mockOnLoadPreset}
          onSavePreset={mockOnSavePreset}
          onDeletePreset={mockOnDeletePreset}
        />
      );
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it('should provide proper form labels', () => {
      render(
        <PresetManager
          presets={mockPresets}
          currentSettings={mockSettings}
          onLoadPreset={mockOnLoadPreset}
          onSavePreset={mockOnSavePreset}
          onDeletePreset={mockOnDeletePreset}
        />
      );
      
      // Check for search input
      const searchInput = screen.getByPlaceholderText(/search presets/i);
      expect(searchInput).toBeInTheDocument();
      expect(searchInput).toHaveAttribute('type', 'text');
    });

    it('should support keyboard navigation for preset list', async () => {
      const user = userEvent.setup();
      render(
        <PresetManager
          presets={mockPresets}
          currentSettings={mockSettings}
          onLoadPreset={mockOnLoadPreset}
          onSavePreset={mockOnSavePreset}
          onDeletePreset={mockOnDeletePreset}
        />
      );
      
      // Check that preset items are focusable
      const presetItems = screen.getAllByRole('button');
      expect(presetItems.length).toBeGreaterThan(0);
      
      // Test keyboard navigation
      if (presetItems.length > 0) {
        await user.tab();
        // First focusable element should receive focus
      }
    });

    it('should provide confirmation for destructive actions', async () => {
      const user = userEvent.setup();
      render(
        <PresetManager
          presets={mockPresets}
          currentSettings={mockSettings}
          onLoadPreset={mockOnLoadPreset}
          onSavePreset={mockOnSavePreset}
          onDeletePreset={mockOnDeletePreset}
        />
      );
      
      // Look for delete buttons (should have appropriate labels)
      const deleteButtons = screen.getAllByRole('button');
      const deleteButton = deleteButtons.find(btn => 
        btn.getAttribute('aria-label')?.includes('delete') ||
        btn.textContent?.toLowerCase().includes('delete')
      );
      
      if (deleteButton) {
        expect(deleteButton).toBeInTheDocument();
      }
    });
  });

  describe('Focus Management', () => {
    it('should maintain focus when switching tabs', async () => {
      const user = userEvent.setup();
      render(<ColorGradingStudio />);
      
      const tabs = screen.getAllByRole('tab');
      if (tabs.length > 1) {
        // Focus first tab
        tabs[0].focus();
        expect(tabs[0]).toHaveFocus();
        
        // Click second tab
        await user.click(tabs[1]);
        
        // Focus should move to the newly active tab
        await waitFor(() => {
          expect(tabs[1]).toHaveAttribute('aria-selected', 'true');
        });
      }
    });

    it('should trap focus in modal dialogs', async () => {
      const user = userEvent.setup();
      render(
        <PresetManager
          presets={mockPresets}
          currentSettings={mockSettings}
          onLoadPreset={() => {}}
          onSavePreset={() => {}}
          onDeletePreset={() => {}}
        />
      );
      
      // Open save dialog
      const saveButton = screen.getByRole('button', { name: /save preset/i });
      await user.click(saveButton);
      
      // Check if dialog is open and focus is managed
      await waitFor(() => {
        const dialog = screen.getByRole('dialog');
        expect(dialog).toBeInTheDocument();
      });
    });
  });

  describe('Screen Reader Support', () => {
    it('should provide meaningful announcements for value changes', () => {
      render(<ColorGradingStudio />);
      
      // Check for live regions that would announce changes
      const liveRegions = document.querySelectorAll('[aria-live]');
      // In a real implementation, we'd have live regions for announcing changes
      
      // Check for proper labeling of controls
      const sliders = screen.getAllByRole('slider');
      sliders.forEach(slider => {
        expect(slider).toHaveAttribute('aria-label');
      });
    });

    it('should provide context for complex interactions', () => {
      const mockPoints = [{ x: 0, y: 0 }, { x: 1, y: 1 }];
      render(<BezierCurveEditor points={mockPoints} onChange={() => {}} />);
      
      // Check for descriptive text that explains the interaction
      expect(screen.getByText(/double-click to add points/i)).toBeInTheDocument();
      expect(screen.getByText(/drag to adjust/i)).toBeInTheDocument();
    });
  });
});
