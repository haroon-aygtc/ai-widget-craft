
import { ModelInfo } from "../../../types/models";

export const fetchOpenAIModels = async (apiKey: string): Promise<ModelInfo[]> => {
  const response = await fetch("https://api.openai.com/v1/models", {
    method: "GET",
    headers: {
      "Authorization": `Bearer ${apiKey}`,
      "Content-Type": "application/json"
    }
  });
  
  if (!response.ok) {
    throw new Error(`OpenAI API error: ${response.status}`);
  }
  
  const data = await response.json();
  
  // Filter and map relevant models
  return data.data
    .filter((model: any) => {
      const id = model.id.toLowerCase();
      return (
        id.includes("gpt-4") || 
        id.includes("gpt-3.5") || 
        id.includes("dall-e") || 
        id.includes("tts")
      );
    })
    .map((model: any) => {
      let type = "text";
      if (model.id.toLowerCase().includes("dall-e")) {
        type = "image";
      } else if (model.id.toLowerCase().includes("vision")) {
        type = "multi-modal";
      }
      
      return {
        id: model.id,
        name: model.id,
        type
      };
    });
};
