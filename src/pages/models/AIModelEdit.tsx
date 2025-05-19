
import { useNavigate, useParams } from "react-router-dom";
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
import { ArrowLeft } from "lucide-react";

// Mock data for AI models
const mockModels = {
  "1": {
    id: "1",
    name: "GPT-4",
    provider: "openai",
    modelId: "gpt-4",
    type: "text",
    apiKey: "sk-abc123def456",
    baseUrl: "",
    active: true,
    temperature: 0.7,
    maxTokens: 1024
  },
  "2": {
    id: "2",
    name: "Gemini Pro",
    provider: "google",
    modelId: "gemini-pro",
    type: "text",
    apiKey: "AIza-abc123def456",
    baseUrl: "",
    active: true,
    temperature: 0.8,
    maxTokens: 2048
  },
  "3": {
    id: "3",
    name: "Claude Instant",
    provider: "anthropic",
    modelId: "claude-instant",
    type: "text",
    apiKey: "sk-ant-abc123def456",
    baseUrl: "",
    active: false,
    temperature: 0.5,
    maxTokens: 1024
  },
};

// Form schema (same as in AIModelCreate)
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

const AIModelEdit = () => {
  const { id } = useParams<{ id: string }>();
  const { toast } = useToast();
  const navigate = useNavigate();

  const providers = [
    { id: "openai", name: "OpenAI" },
    { id: "google", name: "Google" },
    { id: "anthropic", name: "Anthropic" },
    { id: "huggingface", name: "Hugging Face" },
    { id: "openrouter", name: "OpenRouter" },
    { id: "custom", name: "Custom Provider" },
  ];

  // In a real app, we'd fetch the model data from an API
  const modelData = id ? mockModels[id as keyof typeof mockModels] : null;

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: modelData || {
      name: "",
      provider: "",
      modelId: "",
      apiKey: "",
      baseUrl: "",
      active: true,
      type: "text",
      temperature: 0.7,
      maxTokens: 1024,
    },
  });

  // Watch fields for conditional rendering
  const selectedProvider = form.watch("provider");

  const onSubmit = (data: FormValues) => {
    // In a real app, this would submit to your backend
    console.log("Form submitted:", data);
    toast({
      title: "Model updated!",
      description: `${data.name} has been updated successfully.`,
    });
    navigate("/models");
  };

  // Get provider-specific model options
  const getModelOptions = (provider: string) => {
    switch (provider) {
      case "openai":
        return [
          { id: "gpt-4", name: "GPT-4" },
          { id: "gpt-4-turbo", name: "GPT-4 Turbo" },
          { id: "gpt-3.5-turbo", name: "GPT-3.5 Turbo" },
        ];
      case "google":
        return [
          { id: "gemini-pro", name: "Gemini Pro" },
          { id: "gemini-pro-vision", name: "Gemini Pro Vision" },
        ];
      case "anthropic":
        return [
          { id: "claude-3-opus", name: "Claude 3 Opus" },
          { id: "claude-3-sonnet", name: "Claude 3 Sonnet" },
          { id: "claude-3-haiku", name: "Claude 3 Haiku" },
          { id: "claude-instant", name: "Claude Instant" },
        ];
      case "huggingface":
        return [
          { id: "mistral-7b", name: "Mistral 7B" },
          { id: "llama-3-70b", name: "Llama 3 70B" },
          { id: "falcon-180b", name: "Falcon 180B" },
        ];
      case "openrouter":
        return [
          { id: "openrouter/auto", name: "OpenRouter Auto" },
          { id: "openrouter/openai/gpt-4", name: "OpenRouter GPT-4" },
          { id: "openrouter/anthropic/claude-3", name: "OpenRouter Claude 3" },
        ];
      default:
        return [];
    }
  };

  if (!modelData) {
    return (
      <div className="flex items-center justify-center h-full">
        <Card className="w-[350px]">
          <CardHeader>
            <CardTitle>Model not found</CardTitle>
            <CardDescription>
              The AI model you're trying to edit doesn't exist.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex justify-end">
            <Button onClick={() => navigate("/models")}>
              Back to models
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-10 fade-in">
      <div className="flex items-center">
        <Button variant="ghost" className="mr-2" onClick={() => navigate("/models")}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <h1 className="text-3xl font-bold tracking-tight">Edit AI Model</h1>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Model Configuration</CardTitle>
          <CardDescription>
            Update your AI model settings and credentials.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <div className="space-y-6">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Model Name</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g. My GPT-4 Model" {...field} />
                      </FormControl>
                      <FormDescription>
                        A friendly name to identify this model in the dashboard.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

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
                    name="modelId"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Model ID</FormLabel>
                        {selectedProvider && selectedProvider !== "custom" ? (
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select a model" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {getModelOptions(selectedProvider).map((model) => (
                                <SelectItem key={model.id} value={model.id}>
                                  {model.name}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        ) : (
                          <FormControl>
                            <Input placeholder="e.g. gpt-4, gemini-pro" {...field} />
                          </FormControl>
                        )}
                        <FormDescription>
                          The specific model identifier from the provider.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

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
                          value={field.value === modelData.apiKey ? "••••••••••••••••••••" : field.value}
                          onChange={(e) => {
                            if (e.target.value !== "••••••••••••••••••••") {
                              field.onChange(e.target.value);
                            }
                          }}
                        />
                      </FormControl>
                      <FormDescription>
                        Leave unchanged to keep the current API key.
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
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
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
                          The capabilities of this model.
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
                <Button type="submit">Update Model</Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
};

export default AIModelEdit;
