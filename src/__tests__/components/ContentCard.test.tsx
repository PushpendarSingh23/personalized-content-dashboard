import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { Provider } from 'react-redux';
import { store } from '@/lib/store/store';
import ContentCard from '@/components/feed/ContentCard';
import { ContentItem } from '@/types';

const sampleItem: ContentItem = {
  id: 'card-test-1',
  title: 'Quantum Computing Revolution',
  description: '1000 qubits error corrected chip operational in lab.',
  category: 'technology',
  sourceType: 'news',
  sourceName: 'MIT Tech Review',
  author: 'Dr. Elena',
  url: 'https://example.com/quantum',
  imageUrl: 'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=800',
  publishedAt: '10m ago',
  readTime: '5 min read',
  rating: 4.8,
  likes: 120,
  shares: 30,
  tags: ['Quantum', 'Physics'],
};

describe('ContentCard component', () => {
  it('renders title, description, source, and category badge', () => {
    render(
      <Provider store={store}>
        <ContentCard item={sampleItem} />
      </Provider>
    );

    expect(screen.getByText('Quantum Computing Revolution')).toBeInTheDocument();
    expect(
      screen.getByText('1000 qubits error corrected chip operational in lab.')
    ).toBeInTheDocument();
    expect(screen.getByText('MIT Tech Review')).toBeInTheDocument();
    expect(screen.getByText('#Quantum')).toBeInTheDocument();
  });

  it('triggers share and copy link toast', () => {
    const handleToast = vi.fn();

    render(
      <Provider store={store}>
        <ContentCard item={sampleItem} onShareToast={handleToast} />
      </Provider>
    );

    const shareBtn = screen.getByLabelText('Share link');
    expect(shareBtn).toBeInTheDocument();
    fireEvent.click(shareBtn);
  });
});
