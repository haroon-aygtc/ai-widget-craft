
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import ProviderSelect from './ProviderSelect';
import { renderWithProviders } from '../../test/utils';
import { Provider } from '@/types/models';

describe('ProviderSelect component', () => {
  const mockProviders: Provider[] = [
    { id: 'openai', name: 'OpenAI' },
    { id: 'google', name: 'Google' },
    { id: 'custom', name: 'Custom Provider' }
  ];
  
  const mockForm = {
    control: {} as any,
    getValues: vi.fn(),
    setValue: vi.fn()
  };
  
  it('renders the provider select component', () => {
    renderWithProviders(<ProviderSelect form={mockForm as any} providers={mockProviders} />);
    
    expect(screen.getByText('Provider')).toBeInTheDocument();
    expect(screen.getByText('Select a provider')).toBeInTheDocument();
    expect(screen.getByText('The AI service provider for this model.')).toBeInTheDocument();
  });
  
  it('shows all provider options when clicked', async () => {
    const user = userEvent.setup();
    renderWithProviders(<ProviderSelect form={mockForm as any} providers={mockProviders} />);
    
    const selectTrigger = screen.getByRole('combobox');
    await user.click(selectTrigger);
    
    // Check that all provider options are displayed
    expect(screen.getByText('OpenAI')).toBeInTheDocument();
    expect(screen.getByText('Google')).toBeInTheDocument();
    expect(screen.getByText('Custom Provider')).toBeInTheDocument();
  });
});
