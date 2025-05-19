
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Form } from "@/components/ui/form";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/components/ui/use-toast";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowLeft, MessageSquare, Brush, Settings, MessageCircle, Code } from "lucide-react";
import type { WidgetConfig } from "@/components/widgets/WidgetPreviewComponent";

// Import form schema and components
import { formSchema, defaultValues, FormValues } from "@/components/widgets/create/formSchema";
import BasicInfoForm from "@/components/widgets/create/BasicInfoForm";
import AppearanceForm from "@/components/widgets/create/AppearanceForm";
import ContentForm from "@/components/widgets/create/ContentForm";
import BehaviorForm from "@/components/widgets/create/BehaviorForm";
import AdvancedForm from "@/components/widgets/create/AdvancedForm";
import WidgetPreview from "@/components/widgets/create/WidgetPreview";

const WidgetCreate = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("basic");
  
  // Mock AI models
  const aiModels = [
    { id: "1", name: "GPT-4" },
    { id: "2", name: "Gemini Pro" },
    { id: "3", name: "Claude Instant" },
    { id: "4", name: "Mistral-7B" },
    { id: "5", name: "OpenRouter" },
    { id: "6", name: "Hugging Face" },
    { id: "7", name: "DeepSeek" },
  ];
  
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues,
  });
  
  const formValues = form.watch();
  
  const onSubmit = (data: FormValues) => {
    // In a real app, this would submit to your backend
    console.log("Form submitted:", data);
    toast({
      title: "Widget created!",
      description: `${data.name} has been created successfully.`,
    });
    navigate("/widgets");
  };

  // Create a complete widget config for the preview component
  const widgetConfig: WidgetConfig = {
    name: formValues.name || "Chat Widget",
    description: formValues.description,
    welcomeMessage: formValues.welcomeMessage,
    primaryColor: formValues.primaryColor,
    buttonText: formValues.buttonText,
    buttonPosition: formValues.buttonPosition,
    bubbleIcon: formValues.bubbleIcon,
    active: formValues.active,
    modelId: formValues.modelId,
    botName: formValues.botName,
    inputPlaceholder: formValues.inputPlaceholder,
    headerTitle: formValues.headerTitle,
  };
  
  return (
    <div className="space-y-6 pb-10 fade-in">
      <div className="flex items-center">
        <Button variant="ghost" className="mr-2" onClick={() => navigate("/widgets")}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <h1 className="text-3xl font-bold tracking-tight">Create Widget</h1>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Widget Configuration</CardTitle>
              <CardDescription>Configure your AI chat widget's settings and appearance.</CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                <TabsList className="grid grid-cols-5 mb-6">
                  <TabsTrigger value="basic">
                    <MessageSquare className="mr-2 h-4 w-4" />
                    General
                  </TabsTrigger>
                  <TabsTrigger value="appearance">
                    <Brush className="mr-2 h-4 w-4" />
                    Appearance
                  </TabsTrigger>
                  <TabsTrigger value="content">
                    <MessageCircle className="mr-2 h-4 w-4" />
                    Content
                  </TabsTrigger>
                  <TabsTrigger value="behavior">
                    <Settings className="mr-2 h-4 w-4" />
                    Behavior
                  </TabsTrigger>
                  <TabsTrigger value="advanced">
                    <Code className="mr-2 h-4 w-4" />
                    Advanced
                  </TabsTrigger>
                </TabsList>
                
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                    <TabsContent value="basic">
                      <BasicInfoForm control={form.control} aiModels={aiModels} />
                    </TabsContent>
                    
                    <TabsContent value="appearance">
                      <AppearanceForm control={form.control} />
                    </TabsContent>

                    <TabsContent value="content">
                      <ContentForm control={form.control} />
                    </TabsContent>
                    
                    <TabsContent value="behavior">
                      <BehaviorForm />
                    </TabsContent>

                    <TabsContent value="advanced">
                      <AdvancedForm />
                    </TabsContent>
                    
                    <div className="flex justify-end pt-4 border-t">
                      <Button type="button" variant="outline" className="mr-2" onClick={() => navigate("/widgets")}>
                        Cancel
                      </Button>
                      <Button type="submit">Create Widget</Button>
                    </div>
                  </form>
                </Form>
              </Tabs>
            </CardContent>
          </Card>
        </div>
        
        <div className="md:col-span-1">
          <WidgetPreview config={widgetConfig} />
        </div>
      </div>
    </div>
  );
};

export default WidgetCreate;
