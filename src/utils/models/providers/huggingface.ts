
import { ModelInfo } from "../../../types/models";

export const fetchHuggingFaceModels = async (apiKey: string, baseUrl?: string): Promise<ModelInfo[]> => {
  try {
    const hfUrl = baseUrl || "https://huggingface.co/api/models";
    const response = await fetch(`${hfUrl}?filter=text-generation&sort=downloads&direction=-1&limit=20`, {
      headers: {
        "Authorization": `Bearer ${apiKey}`
      }
    });
    
    if (!response.ok) {
      throw new Error(`Hugging Face API error: ${response.status}`);
    }
    
    const data = await response.json();
    
    return data.map((model: any) => ({
      id: model.id,
      name: model.id,
      type: "text"
    }));
  } catch (error) {
    console.error("Hugging Face API error:", error);
    throw error;
  }
};
