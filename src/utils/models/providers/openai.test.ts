
import { describe, it, expect, beforeEach } from 'vitest';
import { fetchOpenAIModels } from './openai';
import { MockFetch, mockFetch } from 'vi-fetch';

describe('openai provider', () => {
  const mockApiKey = 'test-api-key';
  
  beforeEach(() => {
    MockFetch.reset();
  });
  
  it('should fetch and format OpenAI models correctly', async () => {
    const mockResponse = {
      data: [
        { id: 'gpt-4', object: 'model' },
        { id: 'gpt-3.5-turbo', object: 'model' },
        { id: 'dall-e-3', object: 'model' },
        { id: 'gpt-4-vision', object: 'model' },
        { id: 'babbage', object: 'model' },
        { id: 'other-model', object: 'model' }
      ]
    };
    
    mockFetch('https://api.openai.com/v1/models')
      .willResolveToJson(mockResponse);
    
    const result = await fetchOpenAIModels(mockApiKey);
    
    expect(result).toHaveLength(4); // Only 4 match the filters
    
    expect(result.find(m => m.id === 'gpt-4')).toEqual({ id: 'gpt-4', name: 'gpt-4', type: 'text' });
    expect(result.find(m => m.id === 'gpt-3.5-turbo')).toEqual({ id: 'gpt-3.5-turbo', name: 'gpt-3.5-turbo', type: 'text' });
    expect(result.find(m => m.id === 'dall-e-3')).toEqual({ id: 'dall-e-3', name: 'dall-e-3', type: 'image' });
    expect(result.find(m => m.id === 'gpt-4-vision')).toEqual({ id: 'gpt-4-vision', name: 'gpt-4-vision', type: 'multi-modal' });
  });
  
  it('should throw error if request fails', async () => {
    mockFetch('https://api.openai.com/v1/models')
      .willFailWithStatus(401);
    
    await expect(fetchOpenAIModels(mockApiKey)).rejects.toThrow('OpenAI API error');
  });
  
  it('should send correct headers', async () => {
    mockFetch('https://api.openai.com/v1/models')
      .willResolveToJson({ data: [] });
    
    await fetchOpenAIModels(mockApiKey);
    
    expect(MockFetch.lastCall().request.headers.get('Authorization')).toBe(`Bearer ${mockApiKey}`);
    expect(MockFetch.lastCall().request.headers.get('Content-Type')).toBe('application/json');
  });
});
