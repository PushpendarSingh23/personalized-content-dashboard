import React from 'react';
import { render, screen, fireEvent, act } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import DebouncedInput from '@/components/common/DebouncedInput';

describe('DebouncedInput component', () => {
  it('renders input with placeholder', () => {
    render(
      <DebouncedInput
        value=""
        onChange={vi.fn()}
        placeholder="Search stories..."
      />
    );

    expect(screen.getByPlaceholderText('Search stories...')).toBeInTheDocument();
  });

  it('debounces user typing and calls onChange after timeout', async () => {
    vi.useFakeTimers();
    const handleChange = vi.fn();

    render(
      <DebouncedInput
        value=""
        onChange={handleChange}
        debounceMs={300}
      />
    );

    const input = screen.getByRole('textbox');
    fireEvent.change(input, { target: { value: 'Artificial' } });

    // Immediately onChange should not have been called with 'Artificial'
    expect(handleChange).not.toHaveBeenCalledWith('Artificial');

    // Fast-forward time
    act(() => {
      vi.advanceTimersByTime(350);
    });

    expect(handleChange).toHaveBeenCalledWith('Artificial');
    vi.useRealTimers();
  });

  it('clears input when clear button is clicked', () => {
    const handleChange = vi.fn();
    render(
      <DebouncedInput
        value="Search Term"
        onChange={handleChange}
      />
    );

    const clearBtn = screen.getByTitle('Clear search');
    expect(clearBtn).toBeInTheDocument();

    fireEvent.click(clearBtn);
    expect(handleChange).toHaveBeenCalledWith('');
  });
});
