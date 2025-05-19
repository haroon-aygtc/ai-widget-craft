
import { ModelInfo } from "../../../types/models";

export const fetchGoogleModels = async (apiKey: string, baseUrl?: string): Promise<ModelInfo[]> => {
  try {
    // Google AI API requires a project ID and region
    // This is a simplified version; in production, you'd need proper Google API auth
    const url = baseUrl || "https://generativelanguage.googleapis.com/v1beta/models";
    const response = await fetch(`${url}?key=${apiKey}`);
    
    if (!response.ok) {
      throw new Error(`Google API error: ${response.status}`);
    }
    
    const data = await response.json();
    
    return data.models.map((model: any) => {
      let type = "text";
      if (model.name.includes("vision")) {
        type = "multi-modal";
      }
      
      return {
        id: model.name,
        name: model.displayName || model.name,
        type
      };
    });
  } catch (error) {
    console.error("Google API error:", error);
    
    // Fallback to common models if API fails
    return [
      { id: "gemini-pro", name: "Gemini Pro", type: "text" },
      { id: "gemini-pro-vision", name: "Gemini Pro Vision", type: "multi-modal" },
      { id: "gemini-ultra", name: "Gemini Ultra", type: "text" }
    ];
  }
};
