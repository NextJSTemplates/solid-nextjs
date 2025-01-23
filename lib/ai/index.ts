import { openai } from "@ai-sdk/openai";
import { anthropic } from "@ai-sdk/anthropic";
import { google } from "@ai-sdk/google";
import { experimental_wrapLanguageModel as wrapLanguageModel } from "ai";

import { customMiddleware } from "./custom-middleware";
import { Model } from "./models";

export const customModel = (model: Model) => {
  let chatModel: any;
  if (model.provider === "anthropic") {
    chatModel = anthropic(model.apiIdentifier);
  } else if (model.provider === "google") {
    chatModel = google(model.apiIdentifier);
  } else {
    chatModel = openai(model.apiIdentifier);
  }
  return wrapLanguageModel({
    model: chatModel,
    middleware: customMiddleware,
  });
};

export const imageGenerationModel = openai.image("dall-e-3");
