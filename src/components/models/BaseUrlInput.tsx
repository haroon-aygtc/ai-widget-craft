
import { FormField, FormItem, FormLabel, FormControl, FormDescription, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { UseFormReturn } from "react-hook-form";
import { ModelFormValues } from "@/types/models";

interface BaseUrlInputProps {
  form: UseFormReturn<ModelFormValues>;
  selectedProvider: string;
}

const BaseUrlInput = ({ form, selectedProvider }: BaseUrlInputProps) => {
  const isRequired = selectedProvider === "huggingface" || selectedProvider === "google";
  
  return (
    <FormField
      control={form.control}
      name="baseUrl"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Base URL {selectedProvider === "custom" ? "(Optional)" : isRequired ? "(Required)" : ""}</FormLabel>
          <FormControl>
            <Input 
              placeholder="e.g. https://api.example.com/v1" 
              {...field} 
            />
          </FormControl>
          <FormDescription>
            {selectedProvider === "custom" 
              ? "The API base URL if different from the provider's default."
              : "The API base URL for this provider (required)."}
          </FormDescription>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

export default BaseUrlInput;
