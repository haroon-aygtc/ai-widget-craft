
import { describe, it, expect, vi } from 'vitest';
import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import ModelSelect from './ModelSelect';
import { renderWithProviders } from '../../test/utils';
import { ModelInfo } from '@/types/models';

describe('ModelSelect component', () => {
  const mockForm = {
    control: {} as any,
    getValues: vi.fn(),
    setValue: vi.fn()
  };
  
  const mockModels: ModelInfo[] = [
    { id: 'gpt-4', name: 'GPT-4', type: 'text' },
    { id: 'gpt-3.5-turbo', name: 'GPT-3.5 Turbo', type: 'text', isFree: true },
    { id: 'dall-e-3', name: 'DALL-E 3', type: 'image' }
  ];
  
  it('renders loading state', () => {
    renderWithProviders(
      <ModelSelect 
        form={mockForm as any} 
        loading={true} 
        error={null} 
        availableModels={[]} 
        selectedProvider="openai" 
      />
    );
    
    expect(screen.getByText('Fetching available models...')).toBeInTheDocument();
    expect(screen.queryByRole('combobox')).not.toBeInTheDocument();
  });
  
  it('renders error state', () => {
    const errorMessage = 'Failed to fetch models';
    renderWithProviders(
      <ModelSelect 
        form={mockForm as any} 
        loading={false} 
        error={errorMessage} 
        availableModels={[]} 
        selectedProvider="openai" 
      />
    );
    
    expect(screen.getByText(errorMessage)).toBeInTheDocument();
  });
  
  it('renders dropdown with models for non-custom providers', () => {
    renderWithProviders(
      <ModelSelect 
        form={mockForm as any} 
        loading={false} 
        error={null} 
        availableModels={mockModels} 
        selectedProvider="openai" 
      />
    );
    
    expect(screen.getByRole('combobox')).toBeInTheDocument();
    expect(screen.getByText('Select a model')).toBeInTheDocument();
  });
  
  it('renders input field for custom provider', () => {
    renderWithProviders(
      <ModelSelect 
        form={mockForm as any} 
        loading={false} 
        error={null} 
        availableModels={[]} 
        selectedProvider="custom" 
      />
    );
    
    expect(screen.getByPlaceholderText('e.g. gpt-4, gemini-pro')).toBeInTheDocument();
  });
  
  it('shows models in dropdown when clicked', async () => {
    const user = userEvent.setup();
    renderWithProviders(
      <ModelSelect 
        form={mockForm as any} 
        loading={false} 
        error={null} 
        availableModels={mockModels} 
        selectedProvider="openai" 
      />
    );
    
    const selectTrigger = screen.getByRole('combobox');
    await user.click(selectTrigger);
    
    expect(screen.getByText('GPT-4')).toBeInTheDocument();
    expect(screen.getByText('GPT-3.5 Turbo')).toBeInTheDocument();
    expect(screen.getByText('DALL-E 3')).toBeInTheDocument();
    
    // Check for free badge
    expect(screen.getByText('Free')).toBeInTheDocument();
  });
  
  it('renders text input when no models are available', () => {
    renderWithProviders(
      <ModelSelect 
        form={mockForm as any} 
        loading={false} 
        error={null} 
        availableModels={[]} 
        selectedProvider="openai" 
      />
    );
    
    expect(screen.getByPlaceholderText('e.g. gpt-4, gemini-pro')).toBeInTheDocument();
  });
});
