
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2 } from "lucide-react";
import { UseFormReturn } from "react-hook-form";
import { ModelFormValues } from "@/types/models";

interface AIModelTestProps {
  form: UseFormReturn<ModelFormValues>;
}

const AIModelTest = ({ form }: AIModelTestProps) => {
  const [prompt, setPrompt] = useState("");
  const [response, setResponse] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleTestModel = async () => {
    if (!prompt.trim()) {
      setError("Please enter a prompt to test the model.");
      return;
    }

    setIsLoading(true);
    setError(null);
    setResponse("");

    const formValues = form.getValues();
    
    try {
      // Create a request based on the provider and model
      const apiKey = formValues.apiKey;
      const provider = formValues.provider;
      const modelId = formValues.modelId;
      const baseUrl = formValues.baseUrl || "";
      const temperature = formValues.temperature;
      const maxTokens = formValues.maxTokens;
      
      let apiResponse;
      
      if (provider === "openai") {
        apiResponse = await testOpenAIModel(prompt, apiKey, modelId, temperature, maxTokens);
      } else if (provider === "anthropic") {
        apiResponse = await testAnthropicModel(prompt, apiKey, modelId, temperature, maxTokens);
      } else if (provider === "google") {
        apiResponse = await testGoogleModel(prompt, apiKey, modelId, baseUrl, temperature, maxTokens);
      } else if (provider === "openrouter") {
        apiResponse = await testOpenRouterModel(prompt, apiKey, modelId, temperature, maxTokens);
      } else if (provider === "huggingface") {
        apiResponse = await testHuggingFaceModel(prompt, apiKey, modelId, baseUrl, temperature, maxTokens);
      } else {
        // Default to a mock test for custom providers
        apiResponse = await mockTestResponse(prompt, provider, modelId);
      }
      
      setResponse(apiResponse);
    } catch (err) {
      console.error("Error testing model:", err);
      setError(err instanceof Error ? err.message : "Failed to test model. Please check your API key and model configuration.");
    } finally {
      setIsLoading(false);
    }
  };

  // Test functions for different providers
  const testOpenAIModel = async (prompt: string, apiKey: string, modelId: string, temperature: number, maxTokens: number) => {
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${apiKey}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: modelId,
        messages: [{ role: "user", content: prompt }],
        temperature,
        max_tokens: maxTokens
      })
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error?.message || "OpenAI API Error");
    }
    
    const data = await response.json();
    return data.choices[0]?.message?.content || "No response content";
  };
  
  const testAnthropicModel = async (prompt: string, apiKey: string, modelId: string, temperature: number, maxTokens: number) => {
    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "x-api-key": apiKey,
        "anthropic-version": "2023-06-01",
        "content-type": "application/json"
      },
      body: JSON.stringify({
        model: modelId,
        max_tokens: maxTokens,
        temperature,
        messages: [{ role: "user", content: prompt }]
      })
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error?.message || "Anthropic API Error");
    }
    
    const data = await response.json();
    return data.content[0]?.text || "No response content";
  };
  
  const testOpenRouterModel = async (prompt: string, apiKey: string, modelId: string, temperature: number, maxTokens: number) => {
    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${apiKey}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: modelId,
        messages: [{ role: "user", content: prompt }],
        temperature,
        max_tokens: maxTokens
      })
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error?.message || "OpenRouter API Error");
    }
    
    const data = await response.json();
    return data.choices[0]?.message?.content || "No response content";
  };
  
  const testGoogleModel = async (prompt: string, apiKey: string, modelId: string, baseUrl: string, temperature: number, maxTokens: number) => {
    // This is simplified; actual Google AI Studio API might need different parameters
    const url = baseUrl || `https://generativelanguage.googleapis.com/v1/models/${modelId}:generateContent`;
    const fullUrl = `${url}?key=${apiKey}`;
    
    const response = await fetch(fullUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: {
          temperature,
          maxOutputTokens: maxTokens,
        }
      })
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error?.message || "Google API Error");
    }
    
    const data = await response.json();
    return data.candidates?.[0]?.content?.parts?.[0]?.text || "No response content";
  };
  
  const testHuggingFaceModel = async (prompt: string, apiKey: string, modelId: string, baseUrl: string, temperature: number, maxTokens: number) => {
    const url = baseUrl || `https://api-inference.huggingface.co/models/${modelId}`;
    
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${apiKey}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        inputs: prompt,
        parameters: {
          temperature,
          max_new_tokens: maxTokens,
          return_full_text: false
        }
      })
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || "Hugging Face API Error");
    }
    
    const data = await response.json();
    return Array.isArray(data) ? data[0]?.generated_text || "No response content" : data.generated_text || "No response content";
  };
  
  const mockTestResponse = async (prompt: string, provider: string, modelId: string) => {
    // Simulate API latency
    await new Promise(resolve => setTimeout(resolve, 1000));
    return `This is a simulated response from ${provider}'s model (${modelId}):\n\nYou asked: "${prompt}"\n\nThis is a test response to confirm your model is configured correctly. In a real scenario, the actual model would generate content here based on your input.`;
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Test Your Model</CardTitle>
        <CardDescription>
          Try your model configuration before saving it
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <label className="text-sm font-medium" htmlFor="test-prompt">Enter a prompt</label>
          <Textarea
            id="test-prompt"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="Enter a test prompt here..."
            className="min-h-[100px]"
          />
        </div>

        <Button 
          onClick={handleTestModel}
          disabled={isLoading}
          className="w-full"
        >
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Testing...
            </>
          ) : (
            "Test Model"
          )}
        </Button>
        
        {error && (
          <div className="p-3 bg-destructive/10 text-destructive rounded-md text-sm">
            {error}
          </div>
        )}
        
        {response && (
          <div className="space-y-2">
            <h3 className="text-sm font-medium">Response:</h3>
            <div className="p-4 bg-muted rounded-md whitespace-pre-wrap text-sm">
              {response}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default AIModelTest;
