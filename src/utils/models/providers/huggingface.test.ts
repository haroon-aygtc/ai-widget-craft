
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { fetchHuggingFaceModels } from './huggingface';
import { mockFetch } from 'vi-fetch';

describe('huggingface provider', () => {
  const mockApiKey = 'test-api-key';
  const defaultUrl = 'https://huggingface.co/api/models';
  const customBaseUrl = 'https://custom-hf-api.com';
  
  beforeEach(() => {
    mockFetch.reset();
  });
  
  it('should fetch and format Hugging Face models correctly', async () => {
    const mockResponse = [
      { id: 'gpt2', modelId: 'gpt2' },
      { id: 'bert', modelId: 'bert' },
      { id: 't5', modelId: 't5' }
    ];
    
    mockFetch('*')
      .willResolve({
        json: async () => mockResponse,
        status: 200,
        ok: true
      });
    
    const result = await fetchHuggingFaceModels(mockApiKey);
    
    expect(result).toHaveLength(3);
    expect(result[0]).toEqual({ id: 'gpt2', name: 'gpt2', type: 'text' });
    expect(result[1]).toEqual({ id: 'bert', name: 'bert', type: 'text' });
    expect(result[2]).toEqual({ id: 't5', name: 't5', type: 'text' });
  });
  
  it('should use custom base URL if provided', async () => {
    mockFetch('*')
      .willResolve({
        json: async () => ([]),
        status: 200,
        ok: true
      });
    
    await fetchHuggingFaceModels(mockApiKey, customBaseUrl);
    
    const lastReq = mockFetch.requests()[mockFetch.requests().length - 1];
    expect(lastReq.url).toContain(customBaseUrl);
  });
  
  it('should send correct authorization header', async () => {
    mockFetch('*')
      .willResolve({
        json: async () => ([]),
        status: 200,
        ok: true
      });
    
    await fetchHuggingFaceModels(mockApiKey);
    
    const lastReq = mockFetch.requests()[mockFetch.requests().length - 1];
    expect(lastReq.headers.get('Authorization')).toBe(`Bearer ${mockApiKey}`);
  });
  
  it('should throw error on failed request', async () => {
    mockFetch('*')
      .willReject(new Error('Unauthorized'));
    
    await expect(fetchHuggingFaceModels(mockApiKey)).rejects.toThrow('Hugging Face API error');
  });
});
