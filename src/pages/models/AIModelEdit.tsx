import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/components/ui/use-toast";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { ArrowLeft, Sliders, Key, TerminalSquare, MonitorSmartphone } from "lucide-react";
import { Slider } from "@/components/ui/slider";

// Form schema with proper type constraints
const formSchema = z.object({
  name: z.string().min(2, { message: "Name is required" }),
  type: z.enum(["text", "image", "multi-modal"], { 
    required_error: "Model type is required" 
  }),
  active: z.boolean().default(true),
  modelId: z.string().min(1, { message: "Model ID is required" }),
  provider: z.string().min(1, { message: "Provider is required" }),
  apiKey: z.string().min(1, { message: "API key is required" }),
  baseUrl: z.string().optional(),
  temperature: z.number().min(0).max(2).default(0.7),
  maxTokens: z.number().min(1).max(32000).default(2000),
});

type FormValues = z.infer<typeof formSchema>;

// Mock model data - in a real app, this would come from your API
const mockModelData = {
  "1": {
    id: "1",
    name: "GPT-4",
    provider: "OpenAI",
    modelId: "gpt-4",
    type: "text", // Changed to valid enum value
    apiKey: "sk-xxx",
    baseUrl: "",
    active: true,
    temperature: 0.7,
    maxTokens: 2000,
  },
  "2": {
    id: "2",
    name: "Gemini Pro",
    provider: "Google",
    modelId: "gemini-pro",
    type: "multi-modal", // Changed to valid enum value
    apiKey: "ai-xxx",
    baseUrl: "https://generativelanguage.googleapis.com/v1beta",
    active: true,
    temperature: 0.9,
    maxTokens: 4000,
  },
};

const AIModelEdit = () => {
  const { id } = useParams<{ id: string }>();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("basic");

  // In a real app, we'd fetch the model data from an API
  const modelData = id ? mockModelData[id as keyof typeof mockModelData] : null;

  // Properly typed default values
  const defaultValues: FormValues = modelData 
    ? {
        name: modelData.name,
        type: modelData.type as "text" | "image" | "multi-modal", // Ensure type safety
        active: modelData.active,
        modelId: modelData.modelId,
        provider: modelData.provider,
        apiKey: modelData.apiKey,
        baseUrl: modelData.baseUrl,
        temperature: modelData.temperature,
        maxTokens: modelData.maxTokens,
      }
    : {
        name: "",
        type: "text",
        active: true,
        modelId: "",
        provider: "",
        apiKey: "",
        baseUrl: "",
        temperature: 0.7,
        maxTokens: 2000,
      };
  
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues,
  });

  const onSubmit = (data: FormValues) => {
    // In a real app, this would submit to your backend
    console.log("Form submitted:", data);
    toast({
      title: "Model updated!",
      description: `${data.name} has been updated successfully.`,
    });
    navigate("/models");
  };

  if (!modelData) {
    return (
      <div className="flex items-center justify-center h-full">
        <Card className="w-[350px]">
          <CardHeader>
            <CardTitle>Model not found</CardTitle>
            <CardDescription>
              The model you're trying to edit doesn't exist.
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

      <div className="md:grid md:grid-cols-3 md:items-start md:gap-6">
        <div className="md:col-span-1">
          <div className="px-4 sm:px-0">
            <Card>
              <CardHeader>
                <CardTitle>AI Model Settings</CardTitle>
                <CardDescription>
                  Manage settings for your AI models.
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
        <div className="mt-5 md:col-span-2 md:mt-0">
          <Card>
            <CardHeader>
              <CardTitle>Model Configuration</CardTitle>
              <CardDescription>Configure the AI model settings.</CardDescription>
            </CardHeader>
            <CardContent className="bg-white dark:bg-gray-900 rounded-md">
              <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                <TabsList className="grid grid-cols-4">
                  <TabsTrigger value="basic">
                    <Sliders className="mr-2 h-4 w-4" />
                    Basic
                  </TabsTrigger>
                  <TabsTrigger value="credentials">
                    <Key className="mr-2 h-4 w-4" />
                    Credentials
                  </TabsTrigger>
                  <TabsTrigger value="advanced">
                    <TerminalSquare className="mr-2 h-4 w-4" />
                    Advanced
                  </TabsTrigger>
                  <TabsTrigger value="limits">
                    <MonitorSmartphone className="mr-2 h-4 w-4" />
                    Limits
                  </TabsTrigger>
                </TabsList>
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                    <TabsContent value="basic" className="space-y-6">
                      <FormField
                        control={form.control}
                        name="active"
                        render={({ field }) => (
                          <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                            <div className="space-y-0.5">
                              <FormLabel className="text-base">Active Status</FormLabel>
                              <FormDescription>
                                Enable or disable this AI model.
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
                      <FormField
                        control={form.control}
                        name="name"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Model Name</FormLabel>
                            <FormControl>
                              <Input placeholder="e.g. GPT-4" {...field} />
                            </FormControl>
                            <FormDescription>
                              A descriptive name for the AI model.
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="type"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Model Type</FormLabel>
                            <Select
                              onValueChange={field.onChange}
                              defaultValue={field.value}
                            >
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select a type" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="text">Text</SelectItem>
                                <SelectItem value="image">Image</SelectItem>
                                <SelectItem value="multi-modal">Multi-Modal</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormDescription>
                              The type of AI model.
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </TabsContent>

                    <TabsContent value="credentials" className="space-y-6">
                      <FormField
                        control={form.control}
                        name="provider"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Provider</FormLabel>
                            <FormControl>
                              <Input placeholder="e.g. OpenAI" {...field} />
                            </FormControl>
                            <FormDescription>
                              The provider of the AI model.
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
                            <FormControl>
                              <Input placeholder="e.g. gpt-4" {...field} />
                            </FormControl>
                            <FormDescription>
                              The ID of the AI model.
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
                              <Input type="password" placeholder="sk-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx" {...field} />
                            </FormControl>
                            <FormDescription>
                              The API key for the AI model.
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </TabsContent>

                    <TabsContent value="advanced" className="space-y-6">
                      <FormField
                        control={form.control}
                        name="baseUrl"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Base URL (Optional)</FormLabel>
                            <FormControl>
                              <Input placeholder="https://api.openai.com/v1" {...field} />
                            </FormControl>
                            <FormDescription>
                              The base URL for the API.
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </TabsContent>

                    <TabsContent value="limits" className="space-y-6">
                      <FormField
                        control={form.control}
                        name="temperature"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Temperature</FormLabel>
                            <FormControl>
                              <Slider
                                defaultValue={[field.value]}
                                max={2}
                                step={0.1}
                                onValueChange={(value) => field.onChange(value[0])}
                              />
                            </FormControl>
                            <FormDescription>
                              The temperature of the model.
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="maxTokens"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Max Tokens</FormLabel>
                            <FormControl>
                              <Input type="number" placeholder="2000" {...field} />
                            </FormControl>
                            <FormDescription>
                              The maximum number of tokens for the model.
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </TabsContent>

                    <div className="flex justify-end pt-4 border-t">
                      <Button type="button" variant="outline" className="mr-2" onClick={() => navigate("/models")}>
                        Cancel
                      </Button>
                      <Button type="submit">Update Model</Button>
                    </div>
                  </form>
                </Form>
              </Tabs>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default AIModelEdit;
