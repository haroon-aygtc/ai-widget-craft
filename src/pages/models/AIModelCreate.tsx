
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
import AIModelTest from "@/components/models/AIModelTest";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { motion } from "framer-motion";

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

  const fadeIn = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.3 }
  };

  return (
    <motion.div 
      className="space-y-6 pb-10"
      initial="initial"
      animate="animate"
      variants={fadeIn}
    >
      <div className="flex items-center">
        <Button 
          variant="ghost" 
          className="mr-2 rounded-full" 
          onClick={() => navigate("/models")}
        >
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <h1 className="text-3xl font-bold tracking-tight">Add AI Model</h1>
      </div>

      <Tabs defaultValue="config" className="w-full">
        <TabsList className="grid w-[400px] grid-cols-2 mb-6 rounded-lg">
          <TabsTrigger value="config" className="rounded-l-lg data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
            Configuration
          </TabsTrigger>
          <TabsTrigger value="test" className="rounded-r-lg data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
            Test Model
          </TabsTrigger>
        </TabsList>

        <TabsContent value="config" className="mt-0">
          <Card className="border border-border/50 shadow-sm backdrop-blur-sm dark:bg-card/50">
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
                    <motion.div 
                      className="grid grid-cols-1 md:grid-cols-2 gap-6"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.1 }}
                    >
                      <ProviderSelect form={form} providers={providers} />
                      <ApiKeyInput form={form} />
                    </motion.div>

                    {(selectedProvider === "custom" || selectedProvider === "huggingface" || selectedProvider === "google") && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                      >
                        <BaseUrlInput form={form} selectedProvider={selectedProvider} />
                      </motion.div>
                    )}

                    {selectedProvider && form.getValues("apiKey").length > 5 && (
                      <motion.div 
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                      >
                        <ModelSelect 
                          form={form} 
                          loading={loading} 
                          error={error} 
                          availableModels={availableModels}
                          selectedProvider={selectedProvider}
                        />
                      </motion.div>
                    )}

                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.2 }}
                    >
                      <ModelNameInput form={form} selectedModelDetails={selectedModelDetails} />
                    </motion.div>

                    <motion.div 
                      className="grid grid-cols-1 md:grid-cols-2 gap-6"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.3 }}
                    >
                      <ModelTypeSelect form={form} selectedModelDetails={selectedModelDetails} />
                      <TemperatureInput form={form} />
                    </motion.div>

                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.4 }}
                    >
                      <MaxTokensInput form={form} />
                    </motion.div>
                    
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.5 }}
                    >
                      <ActiveStatusToggle form={form} />
                    </motion.div>
                  </div>

                  <motion.div 
                    className="flex justify-end pt-6 border-t"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.6 }}
                  >
                    <Button 
                      type="button" 
                      variant="outline" 
                      className="mr-2" 
                      onClick={() => navigate("/models")}
                    >
                      Cancel
                    </Button>
                    <Button type="submit" className="relative overflow-hidden group">
                      <span className="relative z-10">Add Model</span>
                      <span className="absolute inset-0 bg-primary-foreground opacity-0 group-hover:opacity-10 transition-opacity"></span>
                    </Button>
                  </motion.div>
                </form>
              </Form>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="test" className="mt-0">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            <AIModelTest form={form} />
          </motion.div>
        </TabsContent>
      </Tabs>
    </motion.div>
  );
};

export default AIModelCreate;
