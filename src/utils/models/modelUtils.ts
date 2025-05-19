
import { ModelInfo } from "../../types/models";
import { fetchOpenAIModels } from "./providers/openai";
import { fetchGoogleModels } from "./providers/google";
import { fetchAnthropicModels } from "./providers/anthropic";
import { fetchHuggingFaceModels } from "./providers/huggingface";
import { fetchOpenRouterModels } from "./providers/openrouter";

export const providers = [
  { id: "openai", name: "OpenAI" },
  { id: "google", name: "Google" },
  { id: "anthropic", name: "Anthropic" },
  { id: "huggingface", name: "Hugging Face" },
  { id: "openrouter", name: "OpenRouter" },
  { id: "custom", name: "Custom Provider" },
];

export const fetchModelsForProvider = async (
  provider: string,
  apiKey: string,
  baseUrl?: string
): Promise<ModelInfo[]> => {
  // Skip fetching for custom provider
  if (provider === "custom") {
    return [];
  }

  let models: ModelInfo[] = [];

  switch (provider) {
    case "openai":
      models = await fetchOpenAIModels(apiKey);
      break;
    case "google":
      models = await fetchGoogleModels(apiKey, baseUrl);
      break;
    case "anthropic":
      models = await fetchAnthropicModels(apiKey);
      break;
    case "huggingface":
      models = await fetchHuggingFaceModels(apiKey, baseUrl);
      break;
    case "openrouter":
      models = await fetchOpenRouterModels(apiKey);
      break;
    default:
      models = [];
  }

  // Sort models to display free ones at the top
  return sortModelsByFreeStatus(provider, models);
};

// Helper function to identify free models and sort them
export const sortModelsByFreeStatus = (provider: string, models: ModelInfo[]): ModelInfo[] => {
  // Tag models as free based on provider and model ID
  const modelsWithFreeStatus = models.map((model) => {
    const modelId = model.id.toLowerCase();
    const isFree = (
      // OpenAI free models
      (provider === "openai" && (
        modelId.includes("gpt-3.5") || 
        modelId.includes("babbage") || 
        modelId.includes("ada")
      )) || 
      // Google free models (Gemini)
      (provider === "google" && modelId.includes("gemini-1.0")) ||
      // Hugging Face has many free models
      (provider === "huggingface") ||
      // OpenRouter has some free models
      (provider === "openrouter" && model.id.includes("free"))
    );
    
    return {
      ...model,
      isFree
    };
  });
  
  // Sort by free status (free models first)
  return modelsWithFreeStatus.sort((a, b) => {
    if (a.isFree === b.isFree) {
      return a.name.localeCompare(b.name); // If both have same free status, sort alphabetically
    }
    return a.isFree ? -1 : 1; // Free models first
  });
};
