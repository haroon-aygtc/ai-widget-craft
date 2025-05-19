
import { ModelInfo } from "../../../types/models";

export const fetchAnthropicModels = async (apiKey: string): Promise<ModelInfo[]> => {
  try {
    // Anthropic API doesn't have a models endpoint yet, so we'll use known models
    // For real integration, check Anthropic's API documentation for updates
    
    // Verify API key is valid by testing a simple completion request
    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "x-api-key": apiKey,
        "anthropic-version": "2023-06-01",
        "content-type": "application/json"
      },
      body: JSON.stringify({
        model: "claude-3-sonnet-20240229",
        max_tokens: 10,
        messages: [{ role: "user", content: "Hello" }]
      })
    });
    
    // If the request is successful, the API key is valid
    if (response.ok) {
      // Return known Claude models
      return [
        { id: "claude-3-opus-20240229", name: "Claude 3 Opus", type: "text" },
        { id: "claude-3-sonnet-20240229", name: "Claude 3 Sonnet", type: "text" },
        { id: "claude-3-haiku-20240307", name: "Claude 3 Haiku", type: "text" },
        { id: "claude-2.1", name: "Claude 2.1", type: "text" },
        { id: "claude-instant-1.2", name: "Claude Instant", type: "text" }
      ];
    } else {
      throw new Error(`Anthropic API error: ${response.status}`);
    }
  } catch (error) {
    console.error("Anthropic API error:", error);
    throw error;
  }
};
