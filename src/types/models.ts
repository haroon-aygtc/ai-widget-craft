
import { z } from "zod";

// Form schema
export const modelFormSchema = z.object({
  name: z.string().min(2, { message: "Model name is required" }),
  provider: z.string({ required_error: "Provider is required" }),
  modelId: z.string().min(2, { message: "Model ID is required" }),
  apiKey: z.string().min(1, { message: "API Key is required" }),
  baseUrl: z.string().optional(),
  active: z.boolean().default(true),
  type: z.enum(["text", "image", "multi-modal"]).default("text"),
  temperature: z.coerce.number().min(0).max(1).default(0.7),
  maxTokens: z.coerce.number().min(1).default(1024),
});

export type ModelFormValues = z.infer<typeof modelFormSchema>;

// API interface for model information
export interface ModelInfo {
  id: string;
  name: string;
  type?: string;
  isFree?: boolean;
}

export interface Provider {
  id: string;
  name: string;
}
