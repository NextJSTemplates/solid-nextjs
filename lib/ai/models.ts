// Define your models here.

export interface Model {
  id: string;
  label: string;
  apiIdentifier: string;
  description: string;
  image_model: string;
  provider: string;
}

export const DEFAULT_MODEL: Model = {
  id: "gpt-4o-mini",
  label: "GPT 4o mini",
  apiIdentifier: "gpt-4o-mini",
  description: "Small model for fast, lightweight tasks",
  provider: "openai",
  image_model: "dall-e-3",
};
export const models: Array<Model> = [
  {
    id: "gpt-4o-mini",
    label: "GPT 4o mini",
    apiIdentifier: "gpt-4o-mini",
    description: "Small model for fast, lightweight tasks",
    provider: "openai",
    image_model: "dall-e-3",
  },
  {
    id: "gpt-4o",
    label: "GPT 4o",
    apiIdentifier: "gpt-4o",
    description: "For complex, multi-step tasks",
    provider: "openai",
    image_model: "dall-e-3",
  },
  {
    id: "Claude 3.5 Haiku",
    label: "Claude 3.5 Haiku",
    apiIdentifier: "claude-3-5-haiku-latest",
    description: "For Fast, light weight tasks",
    provider: "anthropic",
    image_model: "Claude 3.5 Sonnet 2024-10-22",
  },
  {
    id: "Claude 3.5 Sonnet 2024-10-22",
    label: "Sonnet 3.5",
    apiIdentifier: "claude-3-5-sonnet-latest",
    description: "For complex, multi-step tasks",
    provider: "anthropic",
    image_model: "Claude 3.5 Sonnet 2024-10-22",
  },
  {
    id: "Gemini 1.5 Flash-8B",
    label: "Gemini 1.5 Flash-8B",
    apiIdentifier: "gemini-1.5-flash-8b",
    description: "High volume and lower intelligence tasks",
    provider: "google",
    image_model: "",
  },
  {
    id: "Gemini 1.5 Flash",
    label: "Gemini 1.5 Flash",
    apiIdentifier: "gemini-1.5-flash",
    description:
      "	Fast and versatile performance across a diverse variety of tasks",
    provider: "google",
    image_model: "",
  },
  {
    id: "Gemini 1.5 Pro",
    label: "Gemini 1.5 Pro",
    apiIdentifier: "gemini-1.5-pro",
    description: "For Complex reasoning tasks requiring more intelligence",
    provider: "google",
    image_model: "",
  },
] as const;

export const DEFAULT_MODEL_NAME: string = "gpt-4o-mini";
