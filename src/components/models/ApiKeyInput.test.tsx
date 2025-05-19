
import { describe, it, expect } from 'vitest';
import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import ApiKeyInput from './ApiKeyInput';
import { renderWithProviders } from '../../test/utils';

describe('ApiKeyInput component', () => {
  const mockForm = {
    control: {} as any,
    getValues: vi.fn(),
    setValue: vi.fn()
  };
  
  it('renders the API key input component', () => {
    renderWithProviders(<ApiKeyInput form={mockForm as any} />);
    
    expect(screen.getByText('API Key')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Enter your API key')).toBeInTheDocument();
    expect(screen.getByText('Your API key will be encrypted and stored securely.')).toBeInTheDocument();
  });
  
  it('input has password type for security', () => {
    renderWithProviders(<ApiKeyInput form={mockForm as any} />);
    
    const input = screen.getByPlaceholderText('Enter your API key');
    expect(input).toHaveAttribute('type', 'password');
  });
  
  it('allows entering API key', async () => {
    const user = userEvent.setup();
    renderWithProviders(<ApiKeyInput form={mockForm as any} />);
    
    const input = screen.getByPlaceholderText('Enter your API key');
    await user.type(input, 'test-api-key');
    
    expect(input).toHaveValue('test-api-key');
  });
});
