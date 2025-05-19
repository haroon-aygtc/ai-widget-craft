
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { UseFormReturn } from "react-hook-form";
import { ModelFormValues } from "@/types/models";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { motion, AnimatePresence } from "framer-motion";
import { Send, Loader2, MessageCircle, Sparkles } from "lucide-react";

interface AIModelTestProps {
  form: UseFormReturn<ModelFormValues>;
}

const AIModelTest = ({ form }: AIModelTestProps) => {
  const [prompt, setPrompt] = useState("");
  const [response, setResponse] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const modelConfig = form.getValues();

  const handleTest = async () => {
    if (!prompt.trim()) return;
    
    setIsLoading(true);
    setError(null);
    setResponse("");
    
    try {
      // Here we would make the actual API call based on the selected provider
      // This is just a simulated API call with a delay
      const provider = modelConfig.provider;
      
      // Simulate API call with a delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Different responses based on the provider
      switch (provider) {
        case "openai":
          setResponse(`This is a simulated response from OpenAI model: ${modelConfig.modelId}.\n\nYour prompt was: "${prompt}"\n\nThe AI response would be generated with temperature: ${modelConfig.temperature} and max tokens: ${modelConfig.maxTokens}.`);
          break;
        case "anthropic":
          setResponse(`Here's Anthropic's Claude responding to your prompt: "${prompt}"\n\nThis is a simulated response showing how Claude would respond with temperature: ${modelConfig.temperature}.`);
          break;
        case "google":
          setResponse(`Google Gemini model: ${modelConfig.modelId} would respond to: "${prompt}"\n\nThis is a simulated API response based on your configuration.`);
          break;
        case "huggingface":
          setResponse(`Hugging Face model simulation for: ${modelConfig.modelId}.\n\nYour query: "${prompt}"\n\nThis is how the model would respond with your current settings.`);
          break;
        default:
          setResponse(`Custom AI model response simulation for "${modelConfig.name}".\n\nThis would connect to: ${modelConfig.baseUrl || "default API endpoint"}\n\nPrompt: "${prompt}"`);
      }
    } catch (err) {
      console.error("Test failed:", err);
      setError("Failed to test the model. Please check your API key and model configuration.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="border border-border/50 shadow-sm backdrop-blur-sm dark:bg-card/50">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-primary" />
          Test Your AI Model
        </CardTitle>
        <CardDescription>
          Try out your model configuration with a test prompt.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <label htmlFor="test-prompt" className="text-sm font-medium">
            Test Prompt
          </label>
          <Textarea
            id="test-prompt"
            placeholder="Enter a prompt to test your model..."
            className="min-h-[100px] resize-none transition-all focus-within:border-primary/50"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            disabled={isLoading}
          />
        </div>

        {(response || isLoading || error) && (
          <div className="mt-6 space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium">Response</label>
              {isLoading && (
                <div className="text-sm text-muted-foreground flex items-center">
                  <div className="typing-indicator mr-2">
                    <span></span>
                    <span></span>
                    <span></span>
                  </div>
                  AI is thinking...
                </div>
              )}
            </div>
            
            <AnimatePresence mode="wait">
              {isLoading ? (
                <motion.div
                  key="loading"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="flex items-center justify-center p-8"
                >
                  <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                </motion.div>
              ) : error ? (
                <motion.div
                  key="error"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="bg-destructive/10 text-destructive p-4 rounded-md border border-destructive/20"
                >
                  {error}
                </motion.div>
              ) : response ? (
                <motion.div
                  key="response"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="relative bg-muted/50 p-4 rounded-lg border whitespace-pre-wrap"
                >
                  <MessageCircle className="absolute -top-3 -left-3 h-6 w-6 text-primary bg-background p-1 rounded-full" />
                  {response}
                </motion.div>
              ) : null}
            </AnimatePresence>
          </div>
        )}
      </CardContent>
      <CardFooter className="flex justify-between border-t pt-4">
        <div className="text-sm text-muted-foreground">
          {modelConfig.provider && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex items-center gap-1"
            >
              Using: {modelConfig.provider} {modelConfig.modelId && `(${modelConfig.modelId})`}
            </motion.div>
          )}
        </div>
        <Button 
          onClick={handleTest}
          disabled={!prompt.trim() || isLoading || !modelConfig.provider || !modelConfig.apiKey}
          className="group"
        >
          {isLoading ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <Send className="mr-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
          )}
          {isLoading ? "Testing..." : "Test Model"}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default AIModelTest;
