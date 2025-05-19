
import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Form } from "@/components/ui/form";
import { useToast } from "@/components/ui/use-toast";
import { ArrowLeft } from "lucide-react";
import { useModelForm } from "@/hooks/useModelForm";
import { ModelFormValues } from "@/types/models";
import ProviderSelect from "@/components/models/ProviderSelect";
import ApiKeyInput from "@/components/models/ApiKeyInput";
import BaseUrlInput from "@/components/models/BaseUrlInput";
import ModelSelect from "@/components/models/ModelSelect";
import ModelNameInput from "@/components/models/ModelNameInput";
import ModelTypeSelect from "@/components/models/ModelTypeSelect";
import TemperatureInput from "@/components/models/TemperatureInput";
import MaxTokensInput from "@/components/models/MaxTokensInput";
import ActiveStatusToggle from "@/components/models/ActiveStatusToggle";
import AIModelTest from "@/components/models/AIModelTest";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const AIModelEdit = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [isLoading, setIsLoading] = useState(true);
  
  const { 
    form, 
    loading, 
    error, 
    availableModels, 
    selectedProvider, 
    selectedModelDetails,
    providers 
  } = useModelForm();
  
  // Mock fetching the model data
  useEffect(() => {
    // In a real app, you would fetch the model data from your backend
    const fetchModelData = async () => {
      try {
        // Mock data for this example
        const mockModelData = {
          id: id,
          name: "GPT-4 Model",
          provider: "openai",
          modelId: "gpt-4",
          apiKey: "sk-mock-key",
          baseUrl: "",
          active: true,
          type: "text",
          temperature: 0.7,
          maxTokens: 2048
        };
        
        // Set the form values
        Object.entries(mockModelData).forEach(([key, value]) => {
          if (key !== 'id') {
            form.setValue(key as any, value);
          }
        });
        
        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching model:", error);
        toast({
          title: "Error",
          description: "Failed to load model data. Please try again.",
          variant: "destructive",
        });
        navigate("/models");
      }
    };
    
    fetchModelData();
  }, [id, form, toast, navigate]);

  const onSubmit = (data: ModelFormValues) => {
    console.log("Form submitted:", data);
    toast({
      title: "Model updated!",
      description: `${data.name} has been updated successfully.`,
    });
    navigate("/models");
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
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

      <Tabs defaultValue="config">
        <TabsList className="grid grid-cols-2 w-[400px]">
          <TabsTrigger value="config">Configuration</TabsTrigger>
          <TabsTrigger value="test">Test</TabsTrigger>
        </TabsList>
        
        <TabsContent value="config">
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
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <ProviderSelect form={form} providers={providers} />
                      <ApiKeyInput form={form} />
                    </div>

                    {(selectedProvider === "custom" || selectedProvider === "huggingface" || selectedProvider === "google") && (
                      <BaseUrlInput form={form} selectedProvider={selectedProvider} />
                    )}

                    {selectedProvider && form.getValues("apiKey").length > 5 && (
                      <ModelSelect 
                        form={form} 
                        loading={loading} 
                        error={error} 
                        availableModels={availableModels}
                        selectedProvider={selectedProvider}
                      />
                    )}

                    <ModelNameInput form={form} selectedModelDetails={selectedModelDetails} />

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <ModelTypeSelect form={form} selectedModelDetails={selectedModelDetails} />
                      <TemperatureInput form={form} />
                    </div>

                    <MaxTokensInput form={form} />
                    <ActiveStatusToggle form={form} />
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
        </TabsContent>
        
        <TabsContent value="test">
          <AIModelTest form={form} />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AIModelEdit;
