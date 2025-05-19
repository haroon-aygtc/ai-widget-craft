
import { useState } from "react";
import { useNavigate } from "react-router-dom";
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

const AIModelCreate = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const { 
    form, 
    loading, 
    error, 
    availableModels, 
    selectedProvider, 
    selectedModelDetails,
    providers 
  } = useModelForm();

  const onSubmit = (data: ModelFormValues) => {
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
