
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { fetchOpenRouterModels } from './openrouter';
import { mockFetch } from 'vi-fetch';

describe('openrouter provider', () => {
  const mockApiKey = 'test-api-key';
  
  beforeEach(() => {
    mockFetch.reset();
  });
  
  it('should fetch and format OpenRouter models correctly', async () => {
    const mockResponse = {
      data: [
        { id: 'openai/gpt-4', name: 'GPT-4', context_length: 4096 },
        { id: 'anthropic/claude-3', name: 'Claude 3', context_length: 16000 },
        { id: 'google/gemini-pro', context_length: 8000 }
      ]
    };
    
    mockFetch('*')
      .willResolve({
        json: async () => mockResponse,
        status: 200,
        ok: true
      });
    
    const result = await fetchOpenRouterModels(mockApiKey);
    
    expect(result).toHaveLength(3);
    expect(result[0]).toEqual({ id: 'openai/gpt-4', name: 'GPT-4', type: 'text' });
    expect(result[1]).toEqual({ id: 'anthropic/claude-3', name: 'Claude 3', type: 'multi-modal' });
    expect(result[2]).toEqual({ id: 'google/gemini-pro', name: 'google/gemini-pro', type: 'multi-modal' });
  });
  
  it('should correctly classify models based on context length', async () => {
    const mockResponse = {
      data: [
        { id: 'small-model', name: 'Small', context_length: 4000 },
        { id: 'large-model', name: 'Large', context_length: 10000 }
      ]
    };
    
    mockFetch('*')
      .willResolve({
        json: async () => mockResponse,
        status: 200,
        ok: true
      });
    
    const result = await fetchOpenRouterModels(mockApiKey);
    
    expect(result[0].type).toBe('text');
    expect(result[1].type).toBe('multi-modal');
  });
  
  it('should send correct headers', async () => {
    mockFetch('*')
      .willResolve({
        json: async () => ({ data: [] }),
        status: 200,
        ok: true
      });
    
    await fetchOpenRouterModels(mockApiKey);
    
    const lastReq = mockFetch.requests()[mockFetch.requests().length - 1];
    expect(lastReq.headers.get('Authorization')).toBe(`Bearer ${mockApiKey}`);
    expect(lastReq.headers.get('Content-Type')).toBe('application/json');
  });
  
  it('should throw error on failed request', async () => {
    mockFetch('*')
      .willReject(new Error('Unauthorized'));
    
    await expect(fetchOpenRouterModels(mockApiKey)).rejects.toThrow('OpenRouter API error');
  });
});
