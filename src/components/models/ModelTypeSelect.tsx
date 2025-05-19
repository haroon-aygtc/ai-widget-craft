
import { FormField, FormItem, FormLabel, FormControl, FormDescription, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { UseFormReturn } from "react-hook-form";
import { ModelFormValues, ModelInfo } from "@/types/models";

interface ModelTypeSelectProps {
  form: UseFormReturn<ModelFormValues>;
  selectedModelDetails: ModelInfo | null;
}

const ModelTypeSelect = ({ form, selectedModelDetails }: ModelTypeSelectProps) => {
  return (
    <FormField
      control={form.control}
      name="type"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Model Type</FormLabel>
          <Select 
            onValueChange={field.onChange} 
            value={field.value}
            disabled={!!selectedModelDetails?.type}
          >
            <FormControl>
              <SelectTrigger className={selectedModelDetails?.type ? "bg-gray-50" : ""}>
                <SelectValue placeholder="Select a type" />
              </SelectTrigger>
            </FormControl>
            <SelectContent>
              <SelectItem value="text">Text</SelectItem>
              <SelectItem value="image">Image</SelectItem>
              <SelectItem value="multi-modal">Multi-modal</SelectItem>
            </SelectContent>
          </Select>
          <FormDescription>
            {selectedModelDetails?.type
              ? "Type auto-detected from model capabilities."
              : "The capabilities of this model."}
          </FormDescription>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

export default ModelTypeSelect;
