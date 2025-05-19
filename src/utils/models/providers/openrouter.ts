
import { ModelInfo } from "../../../types/models";

export const fetchOpenRouterModels = async (apiKey: string): Promise<ModelInfo[]> => {
  try {
    const response = await fetch("https://openrouter.ai/api/v1/models", {
      headers: {
        "Authorization": `Bearer ${apiKey}`,
        "Content-Type": "application/json"
      }
    });
    
    if (!response.ok) {
      throw new Error(`OpenRouter API error: ${response.status}`);
    }
    
    const data = await response.json();
    
    return data.data.map((model: any) => {
      let type = "text";
      if (model.context_length > 8000) {
        type = "multi-modal";
      }
      
      return {
        id: model.id,
        name: model.name || model.id,
        type
      };
    });
  } catch (error) {
    console.error("OpenRouter API error:", error);
    throw error;
  }
};
