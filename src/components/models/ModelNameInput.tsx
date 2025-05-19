
import { FormField, FormItem, FormLabel, FormControl, FormDescription, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { UseFormReturn } from "react-hook-form";
import { ModelFormValues, ModelInfo } from "@/types/models";

interface ModelNameInputProps {
  form: UseFormReturn<ModelFormValues>;
  selectedModelDetails: ModelInfo | null;
}

const ModelNameInput = ({ form, selectedModelDetails }: ModelNameInputProps) => {
  return (
    <FormField
      control={form.control}
      name="name"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Model Name</FormLabel>
          <FormControl>
            <Input 
              placeholder="e.g. My GPT-4 Model"
              {...field}
              readOnly={!!selectedModelDetails}
              className={selectedModelDetails ? "bg-gray-50" : ""}
            />
          </FormControl>
          <FormDescription>
            {selectedModelDetails 
              ? "Name auto-filled from selected model."
              : "A friendly name to identify this model in the dashboard."}
          </FormDescription>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

export default ModelNameInput;
