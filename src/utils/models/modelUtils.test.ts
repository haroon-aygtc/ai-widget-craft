
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { fetchModelsForProvider, sortModelsByFreeStatus, providers } from './modelUtils';
import { fetchOpenAIModels } from './providers/openai';
import { fetchGoogleModels } from './providers/google';
import { fetchAnthropicModels } from './providers/anthropic';
import { fetchHuggingFaceModels } from './providers/huggingface';
import { fetchOpenRouterModels } from './providers/openrouter';
import { ModelInfo } from '../../types/models';

// Mock all provider fetch functions
vi.mock('./providers/openai', () => ({
  fetchOpenAIModels: vi.fn()
}));
vi.mock('./providers/google', () => ({
  fetchGoogleModels: vi.fn()
}));
vi.mock('./providers/anthropic', () => ({
  fetchAnthropicModels: vi.fn()
}));
vi.mock('./providers/huggingface', () => ({
  fetchHuggingFaceModels: vi.fn()
}));
vi.mock('./providers/openrouter', () => ({
  fetchOpenRouterModels: vi.fn()
}));

describe('modelUtils', () => {
  const mockApiKey = 'test-api-key';
  const mockBaseUrl = 'https://test-base-url.com';
  
  beforeEach(() => {
    vi.resetAllMocks();
  });
  
  describe('providers', () => {
    it('should contain all supported providers', () => {
      expect(providers).toHaveLength(6);
      expect(providers.map(p => p.id)).toContain('openai');
      expect(providers.map(p => p.id)).toContain('google');
      expect(providers.map(p => p.id)).toContain('anthropic');
      expect(providers.map(p => p.id)).toContain('huggingface');
      expect(providers.map(p => p.id)).toContain('openrouter');
      expect(providers.map(p => p.id)).toContain('custom');
    });
  });
  
  describe('fetchModelsForProvider', () => {
    it('should return empty array for custom provider', async () => {
      const result = await fetchModelsForProvider('custom', mockApiKey);
      expect(result).toEqual([]);
    });
    
    it('should call fetchOpenAIModels for openai provider', async () => {
      const mockModels = [{ id: 'gpt-4', name: 'GPT-4', type: 'text' }];
      (fetchOpenAIModels as any).mockResolvedValue(mockModels);
      
      const result = await fetchModelsForProvider('openai', mockApiKey);
      
      expect(fetchOpenAIModels).toHaveBeenCalledWith(mockApiKey);
      expect(result).toEqual([{ id: 'gpt-4', name: 'GPT-4', type: 'text', isFree: false }]);
    });
    
    it('should call fetchGoogleModels for google provider', async () => {
      const mockModels = [{ id: 'gemini-pro', name: 'Gemini Pro', type: 'text' }];
      (fetchGoogleModels as any).mockResolvedValue(mockModels);
      
      const result = await fetchModelsForProvider('google', mockApiKey, mockBaseUrl);
      
      expect(fetchGoogleModels).toHaveBeenCalledWith(mockApiKey, mockBaseUrl);
      expect(result).toEqual([{ id: 'gemini-pro', name: 'Gemini Pro', type: 'text', isFree: false }]);
    });
    
    it('should call fetchAnthropicModels for anthropic provider', async () => {
      const mockModels = [{ id: 'claude-3', name: 'Claude 3', type: 'text' }];
      (fetchAnthropicModels as any).mockResolvedValue(mockModels);
      
      const result = await fetchModelsForProvider('anthropic', mockApiKey);
      
      expect(fetchAnthropicModels).toHaveBeenCalledWith(mockApiKey);
      expect(result).toEqual([{ id: 'claude-3', name: 'Claude 3', type: 'text', isFree: false }]);
    });
    
    it('should call fetchHuggingFaceModels for huggingface provider', async () => {
      const mockModels = [{ id: 'distilbert', name: 'DistilBERT', type: 'text' }];
      (fetchHuggingFaceModels as any).mockResolvedValue(mockModels);
      
      const result = await fetchModelsForProvider('huggingface', mockApiKey, mockBaseUrl);
      
      expect(fetchHuggingFaceModels).toHaveBeenCalledWith(mockApiKey, mockBaseUrl);
      expect(result).toEqual([{ id: 'distilbert', name: 'DistilBERT', type: 'text', isFree: true }]);
    });
    
    it('should call fetchOpenRouterModels for openrouter provider', async () => {
      const mockModels = [{ id: 'openai/gpt-4', name: 'GPT-4', type: 'text' }];
      (fetchOpenRouterModels as any).mockResolvedValue(mockModels);
      
      const result = await fetchModelsForProvider('openrouter', mockApiKey);
      
      expect(fetchOpenRouterModels).toHaveBeenCalledWith(mockApiKey);
      expect(result).toEqual([{ id: 'openai/gpt-4', name: 'GPT-4', type: 'text', isFree: false }]);
    });
    
    it('should handle unknown provider', async () => {
      const result = await fetchModelsForProvider('unknown-provider' as any, mockApiKey);
      expect(result).toEqual([]);
    });
  });
  
  describe('sortModelsByFreeStatus', () => {
    const models: ModelInfo[] = [
      { id: 'gpt-4', name: 'GPT-4', type: 'text' },
      { id: 'gpt-3.5-turbo', name: 'GPT-3.5 Turbo', type: 'text' },
      { id: 'dall-e-3', name: 'DALL-E 3', type: 'image' },
    ];
    
    it('should mark OpenAI models correctly', () => {
      const result = sortModelsByFreeStatus('openai', models);
      
      expect(result[0].id).toBe('gpt-3.5-turbo');
      expect(result[0].isFree).toBe(true);
      expect(result[1].id).toBe('gpt-4');
      expect(result[1].isFree).toBe(false);
    });
    
    it('should mark Google models correctly', () => {
      const googleModels: ModelInfo[] = [
        { id: 'gemini-ultra', name: 'Gemini Ultra', type: 'text' },
        { id: 'gemini-1.0-pro', name: 'Gemini 1.0 Pro', type: 'text' },
      ];
      
      const result = sortModelsByFreeStatus('google', googleModels);
      
      expect(result[0].id).toBe('gemini-1.0-pro');
      expect(result[0].isFree).toBe(true);
      expect(result[1].id).toBe('gemini-ultra');
      expect(result[1].isFree).toBe(false);
    });
    
    it('should mark all Hugging Face models as free', () => {
      const hfModels: ModelInfo[] = [
        { id: 'bert-base', name: 'BERT Base', type: 'text' },
        { id: 'gpt2', name: 'GPT-2', type: 'text' },
      ];
      
      const result = sortModelsByFreeStatus('huggingface', hfModels);
      
      expect(result.every(model => model.isFree)).toBe(true);
    });
    
    it('should sort models with free ones first', () => {
      const mixedModels: ModelInfo[] = [
        { id: 'gpt-4', name: 'GPT-4', type: 'text' },
        { id: 'gpt-3.5-turbo', name: 'GPT-3.5 Turbo', type: 'text' },
      ];
      
      const result = sortModelsByFreeStatus('openai', mixedModels);
      
      expect(result[0].id).toBe('gpt-3.5-turbo');
      expect(result[1].id).toBe('gpt-4');
    });
  });
});
