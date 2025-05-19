
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useModelForm } from './useModelForm';
import { fetchModelsForProvider } from '@/utils/models/modelUtils';

// Mock dependencies
vi.mock('@/utils/models/modelUtils', () => ({
  fetchModelsForProvider: vi.fn(),
  providers: [
    { id: 'openai', name: 'OpenAI' },
    { id: 'custom', name: 'Custom Provider' }
  ]
}));

vi.mock('@/components/ui/use-toast', () => ({
  useToast: () => ({
    toast: vi.fn()
  })
}));

describe('useModelForm', () => {
  beforeEach(() => {
    vi.resetAllMocks();
    vi.useFakeTimers();
  });
  
  afterEach(() => {
    vi.useRealTimers();
  });
  
  it('should initialize with default values', () => {
    const { result } = renderHook(() => useModelForm());
    
    expect(result.current.loading).toBe(false);
    expect(result.current.error).toBeNull();
    expect(result.current.availableModels).toEqual([]);
    expect(result.current.selectedModelDetails).toBeNull();
    expect(result.current.providers).toBeDefined();
    expect(result.current.form).toBeDefined();
  });
  
  it('should fetch models when provider and apiKey are set', async () => {
    const mockModels = [
      { id: 'gpt-4', name: 'GPT-4', type: 'text' }
    ];
    
    (fetchModelsForProvider as any).mockResolvedValue(mockModels);
    
    const { result } = renderHook(() => useModelForm());
    
    // Set provider and API key through form
    act(() => {
      result.current.form.setValue('provider', 'openai');
      result.current.form.setValue('apiKey', 'test-api-key');
    });
    
    // Wait for effect to run
    await vi.runAllTimersAsync();
    
    expect(fetchModelsForProvider).toHaveBeenCalledWith('openai', 'test-api-key', undefined);
    
    // Wait for async operation to complete
    await act(async () => {
      await vi.runAllTimersAsync();
    });
    
    // Check the models are updated
    expect(result.current.availableModels).toEqual(mockModels);
  });
  
  it('should not fetch models for custom provider', async () => {
    const { result } = renderHook(() => useModelForm());
    
    act(() => {
      result.current.form.setValue('provider', 'custom');
      result.current.form.setValue('apiKey', 'test-api-key');
    });
    
    // Wait for effect to run
    await vi.runAllTimersAsync();
    
    expect(fetchModelsForProvider).not.toHaveBeenCalled();
  });
  
  it('should update selectedModelDetails when a model is selected', async () => {
    const mockModels = [
      { id: 'gpt-4', name: 'GPT-4', type: 'text' },
      { id: 'dall-e-3', name: 'DALL-E 3', type: 'image' }
    ];
    
    (fetchModelsForProvider as any).mockResolvedValue(mockModels);
    
    const { result } = renderHook(() => useModelForm());
    
    // Set models, provider, and API key
    act(() => {
      result.current.form.setValue('provider', 'openai');
      result.current.form.setValue('apiKey', 'test-api-key');
    });
    
    // Wait for async operation to complete
    await act(async () => {
      await vi.runAllTimersAsync();
    });
    
    // Select a model
    act(() => {
      result.current.form.setValue('modelId', 'gpt-4');
    });
    
    // Wait for effect to run
    await vi.runAllTimersAsync();
    
    // Check model details are updated
    expect(result.current.selectedModelDetails).toEqual({ id: 'gpt-4', name: 'GPT-4', type: 'text' });
    
    // Check that form fields were updated
    expect(result.current.form.getValues('name')).toBe('GPT-4');
    expect(result.current.form.getValues('type')).toBe('text');
  });
  
  it('should handle errors when fetching models', async () => {
    const errorMessage = 'API error';
    (fetchModelsForProvider as any).mockRejectedValue(new Error(errorMessage));
    
    const { result } = renderHook(() => useModelForm());
    
    act(() => {
      result.current.form.setValue('provider', 'openai');
      result.current.form.setValue('apiKey', 'invalid-key');
    });
    
    // Wait for async operation to complete
    await act(async () => {
      await vi.runAllTimersAsync();
    });
    
    expect(result.current.error).toBe('Failed to fetch models. Please verify your API key and provider settings.');
    expect(result.current.availableModels).toEqual([]);
  });
});
