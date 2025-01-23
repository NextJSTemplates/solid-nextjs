"use server";

import { type CoreUserMessage, generateText } from "ai";
import { cookies } from "next/headers";

import { customModel } from "@/lib/ai";
import {
  deleteMessagesByChatIdAfterTimestamp,
  getMessageById,
  updateChatVisiblityById,
} from "@/lib/db/queries";
import type { VisibilityType } from "@/components/ChatBot/visibility-selector";
import {
  DEFAULT_MODEL,
  DEFAULT_MODEL_NAME,
  Model,
  models,
} from "@/lib/ai/models";

export async function saveModelId(model: string) {
  const cookieStore = await cookies();
  cookieStore.set("model-id", model);
}
export async function getModelId(): Promise<string> {
  const cookieStore = await cookies();
  const modelIdFromCookie = cookieStore.get("model-id")?.value;
  const selectedModelId =
    models.find((model) => model.id === modelIdFromCookie)?.id ||
    DEFAULT_MODEL_NAME;
  return selectedModelId;
}

export async function generateTitleFromUserMessage({
  message,
}: {
  message: CoreUserMessage;
}) {
  const modelIdFromCookie = await getModelId();
  const _model: Model =
    models.find((model) => model.id === modelIdFromCookie) || DEFAULT_MODEL;
  const { text: title } = await generateText({
    model: customModel(_model),
    system: `\n
    - you will generate a short title based on the first message a user begins a conversation with
    - ensure it is not more than 80 characters long
    - the title should be a summary of the user's message
    - do not use quotes or colons`,
    prompt: JSON.stringify(message),
  });

  return title;
}

export async function deleteTrailingMessages({ id }: { id: string }) {
  const [message] = await getMessageById({ id });

  await deleteMessagesByChatIdAfterTimestamp({
    chatId: message.chatId,
    timestamp: message.createdAt,
  });
}

export async function updateChatVisibility({
  chatId,
  visibility,
}: {
  chatId: string;
  visibility: VisibilityType;
}) {
  await updateChatVisiblityById({ chatId, visibility });
}
