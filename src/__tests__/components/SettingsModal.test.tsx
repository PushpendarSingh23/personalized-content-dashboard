import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { Provider } from 'react-redux';
import { store } from '@/lib/store/store';
import SettingsModal from '@/components/modals/SettingsModal';

describe('SettingsModal component', () => {
  it('renders settings categories and theme options when open', () => {
    render(
      <Provider store={store}>
        <SettingsModal isOpen={true} onClose={vi.fn()} onToast={vi.fn()} />
      </Provider>
    );

    expect(screen.getByText('Personalization & Preferences')).toBeInTheDocument();
    expect(screen.getByText('Favorite Categories')).toBeInTheDocument();
    expect(screen.getByText('Content Source Channels')).toBeInTheDocument();
    expect(screen.getByText('Appearance & Theme')).toBeInTheDocument();
  });

  it('does not render when isOpen is false', () => {
    const { container } = render(
      <Provider store={store}>
        <SettingsModal isOpen={false} onClose={vi.fn()} onToast={vi.fn()} />
      </Provider>
    );

    expect(container.firstChild).toBeNull();
  });
});
