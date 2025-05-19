
import { FormField, FormItem, FormLabel, FormControl, FormDescription, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Loader2 } from "lucide-react";
import { UseFormReturn } from "react-hook-form";
import { ModelFormValues, ModelInfo } from "@/types/models";

interface ModelSelectProps {
  form: UseFormReturn<ModelFormValues>;
  loading: boolean;
  error: string | null;
  availableModels: ModelInfo[];
  selectedProvider: string;
}

const ModelSelect = ({ form, loading, error, availableModels, selectedProvider }: ModelSelectProps) => {
  return (
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
            
            {!loading && error && (
              <div className="text-sm text-destructive">{error}</div>
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
                <SelectContent className="max-h-60 overflow-y-auto">
                  {availableModels.map((model) => (
                    <SelectItem 
                      key={model.id} 
                      value={model.id}
                      className={model.isFree ? "bg-[#F2FCE2]" : ""}
                    >
                      <div className="flex items-center gap-2">
                        <span>{model.name}</span>
                        {model.isFree && (
                          <Badge variant="outline" className="ml-1 bg-green-50 text-green-700 border-green-200">
                            Free
                          </Badge>
                        )}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
            
            {!loading && (availableModels.length === 0 || selectedProvider === "custom") && !error && (
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
  );
};

export default ModelSelect;
