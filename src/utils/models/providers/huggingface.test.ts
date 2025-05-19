
import { describe, it, expect, beforeEach } from 'vitest';
import { fetchHuggingFaceModels } from './huggingface';
import { MockFetch, mockFetch } from 'vi-fetch';

describe('huggingface provider', () => {
  const mockApiKey = 'test-api-key';
  const defaultUrl = 'https://huggingface.co/api/models';
  const customBaseUrl = 'https://custom-hf-api.com';
  
  beforeEach(() => {
    MockFetch.reset();
  });
  
  it('should fetch and format Hugging Face models correctly', async () => {
    const mockResponse = [
      { id: 'gpt2', modelId: 'gpt2' },
      { id: 'bert', modelId: 'bert' },
      { id: 't5', modelId: 't5' }
    ];
    
    mockFetch(`${defaultUrl}?filter=text-generation&sort=downloads&direction=-1&limit=20`)
      .willResolveToJson(mockResponse);
    
    const result = await fetchHuggingFaceModels(mockApiKey);
    
    expect(result).toHaveLength(3);
    expect(result[0]).toEqual({ id: 'gpt2', name: 'gpt2', type: 'text' });
    expect(result[1]).toEqual({ id: 'bert', name: 'bert', type: 'text' });
    expect(result[2]).toEqual({ id: 't5', name: 't5', type: 'text' });
  });
  
  it('should use custom base URL if provided', async () => {
    mockFetch(`${customBaseUrl}?filter=text-generation&sort=downloads&direction=-1&limit=20`)
      .willResolveToJson([]);
    
    await fetchHuggingFaceModels(mockApiKey, customBaseUrl);
    
    expect(MockFetch.lastCall().request.url).toBe(`${customBaseUrl}?filter=text-generation&sort=downloads&direction=-1&limit=20`);
  });
  
  it('should send correct authorization header', async () => {
    mockFetch(`${defaultUrl}?filter=text-generation&sort=downloads&direction=-1&limit=20`)
      .willResolveToJson([]);
    
    await fetchHuggingFaceModels(mockApiKey);
    
    expect(MockFetch.lastCall().request.headers.get('Authorization')).toBe(`Bearer ${mockApiKey}`);
  });
  
  it('should throw error on failed request', async () => {
    mockFetch(`${defaultUrl}?filter=text-generation&sort=downloads&direction=-1&limit=20`)
      .willFailWithStatus(401);
    
    await expect(fetchHuggingFaceModels(mockApiKey)).rejects.toThrow('Hugging Face API error');
  });
});
