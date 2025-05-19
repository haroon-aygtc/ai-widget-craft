
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/components/ui/use-toast";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { ArrowLeft, Loader2 } from "lucide-react";

// Form schema
const formSchema = z.object({
  name: z.string().min(2, { message: "Model name is required" }),
  provider: z.string({ required_error: "Provider is required" }),
  modelId: z.string().min(2, { message: "Model ID is required" }),
  apiKey: z.string().min(1, { message: "API Key is required" }),
  baseUrl: z.string().optional(),
  active: z.boolean().default(true),
  type: z.enum(["text", "image", "multi-modal"]).default("text"),
  temperature: z.coerce.number().min(0).max(1).default(0.7),
  maxTokens: z.coerce.number().min(1).default(1024),
});

type FormValues = z.infer<typeof formSchema>;

// API interface for model information
interface ModelInfo {
  id: string;
  name: string;
  type?: string;
}

const AIModelCreate = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [availableModels, setAvailableModels] = useState<ModelInfo[]>([]);
  const [selectedModelDetails, setSelectedModelDetails] = useState<ModelInfo | null>(null);

  const providers = [
    { id: "openai", name: "OpenAI" },
    { id: "google", name: "Google" },
    { id: "anthropic", name: "Anthropic" },
    { id: "huggingface", name: "Hugging Face" },
    { id: "openrouter", name: "OpenRouter" },
    { id: "custom", name: "Custom Provider" },
  ];

  const defaultValues: FormValues = {
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

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues,
  });

  // Watch fields for conditional rendering and API calls
  const selectedProvider = form.watch("provider");
  const apiKey = form.watch("apiKey");
  const selectedModelId = form.watch("modelId");

  // Fetch models when provider and API key are available
  useEffect(() => {
    if (selectedProvider && apiKey && apiKey.length > 5) {
      fetchModelsForProvider();
    } else {
      setAvailableModels([]);
    }
  }, [selectedProvider, apiKey]);

  // Update model details when a model is selected
  useEffect(() => {
    if (selectedModelId && availableModels.length > 0) {
      const modelDetails = availableModels.find(model => model.id === selectedModelId);
      if (modelDetails) {
        setSelectedModelDetails(modelDetails);
        
        // Update the name field if it's empty or was auto-generated
        if (!form.getValues("name") || form.getValues("name").startsWith(`${selectedProvider}-`)) {
          form.setValue("name", modelDetails.name);
        }
        
        // Update type if available from API
        if (modelDetails.type) {
          form.setValue("type", modelDetails.type as "text" | "image" | "multi-modal");
        }
      }
    }
  }, [selectedModelId, availableModels]);

  const fetchModelsForProvider = async () => {
    // Skip fetching for custom provider
    if (selectedProvider === "custom") {
      return;
    }

    setLoading(true);
    try {
      // In a real implementation, this would be a call to the respective provider's API
      // For demo purposes, we're simulating API responses
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate network delay
      
      let models: ModelInfo[] = [];
      
      switch (selectedProvider) {
        case "openai":
          models = [
            { id: "gpt-4o", name: "GPT-4o" },
            { id: "gpt-4o-mini", name: "GPT-4o Mini" },
            { id: "gpt-4-turbo", name: "GPT-4 Turbo" },
            { id: "gpt-3.5-turbo", name: "GPT-3.5 Turbo" },
            { id: "dall-e-3", name: "DALL-E 3", type: "image" },
            { id: "tts-1", name: "TTS-1", type: "text" },
          ];
          break;
        case "google":
          models = [
            { id: "gemini-pro", name: "Gemini Pro" },
            { id: "gemini-pro-vision", name: "Gemini Pro Vision", type: "multi-modal" },
            { id: "gemini-ultra", name: "Gemini Ultra" },
          ];
          break;
        case "anthropic":
          models = [
            { id: "claude-3-opus", name: "Claude 3 Opus" },
            { id: "claude-3-sonnet", name: "Claude 3 Sonnet" },
            { id: "claude-3-haiku", name: "Claude 3 Haiku" },
            { id: "claude-instant", name: "Claude Instant" },
          ];
          break;
        case "huggingface":
          models = [
            { id: "mistral-7b", name: "Mistral 7B" },
            { id: "llama-3-70b", name: "Llama 3 70B" },
            { id: "falcon-180b", name: "Falcon 180B" },
          ];
          break;
        case "openrouter":
          models = [
            { id: "openrouter/auto", name: "OpenRouter Auto" },
            { id: "openrouter/openai/gpt-4", name: "OpenRouter GPT-4" },
            { id: "openrouter/anthropic/claude-3", name: "OpenRouter Claude 3" },
          ];
          break;
        default:
          models = [];
      }
      
      setAvailableModels(models);

      // Show success toast if models were found
      if (models.length > 0) {
        toast({
          title: "Models fetched successfully",
          description: `Found ${models.length} models for ${providers.find(p => p.id === selectedProvider)?.name}`,
        });
      }
    } catch (error) {
      console.error("Error fetching models:", error);
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

  const onSubmit = (data: FormValues) => {
    console.log("Form submitted:", data);
    toast({
      title: "Model added!",
      description: `${data.name} has been added successfully.`,
    });
    navigate("/models");
  };

  return (
    <div className="space-y-6 pb-10 fade-in">
      <div className="flex items-center">
        <Button variant="ghost" className="mr-2" onClick={() => navigate("/models")}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <h1 className="text-3xl font-bold tracking-tight">Add AI Model</h1>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Model Configuration</CardTitle>
          <CardDescription>
            Configure your AI model settings and credentials.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField
                    control={form.control}
                    name="provider"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Provider</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select a provider" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {providers.map((provider) => (
                              <SelectItem key={provider.id} value={provider.id}>
                                {provider.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormDescription>
                          The AI service provider for this model.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="apiKey"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>API Key</FormLabel>
                        <FormControl>
                          <Input 
                            type="password" 
                            placeholder="Enter your API key" 
                            {...field} 
                          />
                        </FormControl>
                        <FormDescription>
                          Your API key will be encrypted and stored securely.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                {selectedProvider && apiKey && apiKey.length > 5 && (
                  <FormField
                    control={form.control}
                    name="modelId"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Model</FormLabel>
                        <div className="space-y-2">
                          {loading && (
                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                              <Loader2 className="h-4 w-4 animate-spin" />
                              <span>Fetching available models...</span>
                            </div>
                          )}
                          
                          {!loading && availableModels.length > 0 && selectedProvider !== "custom" && (
                            <Select 
                              onValueChange={field.onChange} 
                              defaultValue={field.value}
                            >
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select a model" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                {availableModels.map((model) => (
                                  <SelectItem key={model.id} value={model.id}>
                                    {model.name}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          )}
                          
                          {!loading && (availableModels.length === 0 || selectedProvider === "custom") && (
                            <FormControl>
                              <Input 
                                placeholder="e.g. gpt-4, gemini-pro" 
                                {...field} 
                              />
                            </FormControl>
                          )}
                        </div>
                        <FormDescription>
                          {selectedProvider === "custom" 
                            ? "Enter the specific model identifier from the provider."
                            : "Select from available models provided by the API."}
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                )}

                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Model Name</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="e.g. My GPT-4 Model"
                          {...field}
                          readOnly={!!selectedModelDetails}
                          className={selectedModelDetails ? "bg-gray-50" : ""}
                        />
                      </FormControl>
                      <FormDescription>
                        {selectedModelDetails 
                          ? "Name auto-filled from selected model."
                          : "A friendly name to identify this model in the dashboard."}
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {(selectedProvider === "custom" || selectedProvider === "huggingface") && (
                  <FormField
                    control={form.control}
                    name="baseUrl"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Base URL (Optional)</FormLabel>
                        <FormControl>
                          <Input 
                            placeholder="e.g. https://api.example.com/v1" 
                            {...field} 
                          />
                        </FormControl>
                        <FormDescription>
                          The API base URL if different from the provider's default.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField
                    control={form.control}
                    name="type"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Model Type</FormLabel>
                        <Select 
                          onValueChange={field.onChange} 
                          value={field.value}
                          disabled={!!selectedModelDetails?.type}
                        >
                          <FormControl>
                            <SelectTrigger className={selectedModelDetails?.type ? "bg-gray-50" : ""}>
                              <SelectValue placeholder="Select a type" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="text">Text</SelectItem>
                            <SelectItem value="image">Image</SelectItem>
                            <SelectItem value="multi-modal">Multi-modal</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormDescription>
                          {selectedModelDetails?.type
                            ? "Type auto-detected from model capabilities."
                            : "The capabilities of this model."}
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="temperature"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Temperature (0-1)</FormLabel>
                        <FormControl>
                          <Input 
                            type="number" 
                            min="0" 
                            max="1" 
                            step="0.1" 
                            {...field} 
                          />
                        </FormControl>
                        <FormDescription>
                          Controls randomness: 0 is deterministic, 1 is creative.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="maxTokens"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Max Tokens</FormLabel>
                      <FormControl>
                        <Input 
                          type="number" 
                          min="1" 
                          {...field} 
                        />
                      </FormControl>
                      <FormDescription>
                        Maximum number of tokens to generate in a response.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="active"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                      <div className="space-y-0.5">
                        <FormLabel className="text-base">Active Status</FormLabel>
                        <FormDescription>
                          Enable or disable this AI model for use in chat widgets.
                        </FormDescription>
                      </div>
                      <FormControl>
                        <Switch
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </div>

              <div className="flex justify-end pt-4 border-t">
                <Button type="button" variant="outline" className="mr-2" onClick={() => navigate("/models")}>
                  Cancel
                </Button>
                <Button type="submit">Add Model</Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
};

export default AIModelCreate;
