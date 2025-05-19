
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useToast } from "@/components/ui/use-toast";
import { ModelFormValues, modelFormSchema, ModelInfo } from "@/types/models";
import { fetchModelsForProvider, providers } from "@/utils/models/modelUtils";

export const useModelForm = () => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [availableModels, setAvailableModels] = useState<ModelInfo[]>([]);
  const [selectedModelDetails, setSelectedModelDetails] = useState<ModelInfo | null>(null);

  const defaultValues: ModelFormValues = {
    name: "",
    provider: "",
    modelId: "",
    apiKey: "",
    baseUrl: "",
    active: true,
    type: "text",
    temperature: 0.7,
    maxTokens: 1024,
  };

  const form = useForm<ModelFormValues>({
    resolver: zodResolver(modelFormSchema),
    defaultValues,
  });

  // Watch fields for conditional rendering and API calls
  const selectedProvider = form.watch("provider");
  const apiKey = form.watch("apiKey");
  const baseUrl = form.watch("baseUrl");
  const selectedModelId = form.watch("modelId");

  // Fetch models when provider and API key are available
  useEffect(() => {
    if (selectedProvider && apiKey && apiKey.length > 5) {
      fetchModels();
    } else {
      setAvailableModels([]);
    }
  }, [selectedProvider, apiKey, baseUrl]);

  // Update model details when a model is selected
  useEffect(() => {
    if (selectedModelId && availableModels.length > 0) {
      const modelDetails = availableModels.find(model => model.id === selectedModelId);
      if (modelDetails) {
        setSelectedModelDetails(modelDetails);
        
        // Update the name field with selected model's name
        form.setValue("name", modelDetails.name);
        
        // Update type if available from API
        if (modelDetails.type) {
          form.setValue("type", modelDetails.type as "text" | "image" | "multi-modal");
        }
      }
    }
  }, [selectedModelId, availableModels]);

  const fetchModels = async () => {
    // Skip fetching for custom provider
    if (selectedProvider === "custom") {
      return;
    }

    setLoading(true);
    setError(null);
    
    try {
      const models = await fetchModelsForProvider(selectedProvider, apiKey, baseUrl);
      
      setAvailableModels(models);

      // Show success toast if models were found
      if (models.length > 0) {
        toast({
          title: "Models fetched successfully",
          description: `Found ${models.length} models for ${providers.find(p => p.id === selectedProvider)?.name}`,
        });
      } else {
        setError("No models found. Please check your API key and try again.");
      }
    } catch (error) {
      console.error("Error fetching models:", error);
      setError("Failed to fetch models. Please verify your API key and provider settings.");
      toast({
        title: "Error fetching models",
        description: "Could not fetch models for the selected provider. Please check your API key.",
        variant: "destructive",
      });
      setAvailableModels([]);
    } finally {
      setLoading(false);
    }
  };

  return {
    form,
    loading,
    error,
    availableModels,
    selectedProvider,
    selectedModelDetails,
    providers
  };
};
