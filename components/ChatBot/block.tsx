import type {
  Attachment,
  ChatRequestOptions,
  CreateMessage,
  Message,
} from "ai";
import { formatDistance } from "date-fns";
import { AnimatePresence, motion } from "framer-motion";
import {
  type Dispatch,
  memo,
  type SetStateAction,
  useCallback,
  useEffect,
  useState,
} from "react";
import useSWR, { useSWRConfig } from "swr";
import { useDebounceCallback, useWindowSize } from "usehooks-ts";

import type { Document, Suggestion, Vote } from "@/lib/db/schema";
import { cn, fetcher } from "@/lib/utils";

import { DiffView } from "./diffview";
import { DocumentSkeleton } from "./document-skeleton";
import { Editor } from "./editor";
import { MultimodalInput } from "./multimodal-input";
import { Toolbar } from "./toolbar";
import { VersionFooter } from "./version-footer";
import { BlockActions } from "./block-actions";
import { BlockCloseButton } from "./block-close-button";
import { BlockMessages } from "./block-messages";
import { CodeEditor } from "./code-editor";
import { Console } from "./console";
import { useSidebar } from "../ui/sidebar";
import { useBlock } from "@/hooks/use-block";
import equal from "fast-deep-equal";
import { ImageEditor } from "./image-editor";

export type BlockKind = "text" | "code" | "image";

export interface UIBlock {
  title: string;
  documentId: string;
  kind: BlockKind;
  content: string;
  isVisible: boolean;
  status: "streaming" | "idle";
  boundingBox: {
    top: number;
    left: number;
    width: number;
    height: number;
  };
}

export interface ConsoleOutputContent {
  type: "text" | "image";
  value: string;
}

export interface ConsoleOutput {
  id: string;
  status: "in_progress" | "loading_packages" | "completed" | "failed";
  contents: Array<ConsoleOutputContent>;
}

function PureBlock({
  chatId,
  input,
  setInput,
  handleSubmit,
  isLoading,
  stop,
  attachments,
  setAttachments,
  append,
  messages,
  setMessages,
  reload,
  votes,
  isReadonly,
}: {
  chatId: string;
  input: string;
  setInput: (input: string) => void;
  isLoading: boolean;
  stop: () => void;
  attachments: Array<Attachment>;
  setAttachments: Dispatch<SetStateAction<Array<Attachment>>>;
  messages: Array<Message>;
  setMessages: Dispatch<SetStateAction<Array<Message>>>;
  votes: Array<Vote> | undefined;
  append: (
    message: Message | CreateMessage,
    chatRequestOptions?: ChatRequestOptions,
  ) => Promise<string | null | undefined>;
  handleSubmit: (
    event?: {
      preventDefault?: () => void;
    },
    chatRequestOptions?: ChatRequestOptions,
  ) => void;
  reload: (
    chatRequestOptions?: ChatRequestOptions,
  ) => Promise<string | null | undefined>;
  isReadonly: boolean;
}) {
  const { block, setBlock } = useBlock();

  const {
    data: documents,
    isLoading: isDocumentsFetching,
    mutate: mutateDocuments,
  } = useSWR<Array<Document>>(
    block.documentId !== "init" && block.status !== "streaming"
      ? `/chatbot/api/document?id=${block.documentId}`
      : null,
    fetcher,
  );

  const { data: suggestions } = useSWR<Array<Suggestion>>(
    documents && block && block.status !== "streaming"
      ? `/chatbot/api/suggestions?documentId=${block.documentId}`
      : null,
    fetcher,
    {
      dedupingInterval: 5000,
    },
  );

  const [mode, setMode] = useState<"edit" | "diff">("edit");
  const [document, setDocument] = useState<Document | null>(null);
  const [currentVersionIndex, setCurrentVersionIndex] = useState(-1);
  const [consoleOutputs, setConsoleOutputs] = useState<Array<ConsoleOutput>>(
    [],
  );

  const { open: isSidebarOpen } = useSidebar();

  useEffect(() => {
    if (documents && documents.length > 0) {
      const mostRecentDocument = documents.at(-1);

      if (mostRecentDocument) {
        setDocument(mostRecentDocument);
        setCurrentVersionIndex(documents.length - 1);
        setBlock((currentBlock) => ({
          ...currentBlock,
          content: mostRecentDocument.content ?? "",
        }));
      }
    }
  }, [documents, setBlock]);

  useEffect(() => {
    mutateDocuments();
  }, [block.status, mutateDocuments]);

  const { mutate } = useSWRConfig();
  const [isContentDirty, setIsContentDirty] = useState(false);

  const handleContentChange = useCallback(
    (updatedContent: string) => {
      if (!block) return;

      mutate<Array<Document>>(
        `/chatbot/api/document?id=${block.documentId}`,
        async (currentDocuments) => {
          if (!currentDocuments) return undefined;

          const currentDocument = currentDocuments.at(-1);

          if (!currentDocument || !currentDocument.content) {
            setIsContentDirty(false);
            return currentDocuments;
          }

          if (currentDocument.content !== updatedContent) {
            await fetch(`/chatbot/api/document?id=${block.documentId}`, {
              method: "POST",
              body: JSON.stringify({
                title: block.title,
                content: updatedContent,
                kind: block.kind,
              }),
            });

            setIsContentDirty(false);

            const newDocument = {
              ...currentDocument,
              content: updatedContent,
              createdAt: new Date(),
            };

            return [...currentDocuments, newDocument];
          }
          return currentDocuments;
        },
        { revalidate: false },
      );
    },
    [block, mutate],
  );

  const debouncedHandleContentChange = useDebounceCallback(
    handleContentChange,
    2000,
  );

  const saveContent = useCallback(
    (updatedContent: string, debounce: boolean) => {
      if (document && updatedContent !== document.content) {
        setIsContentDirty(true);

        if (debounce) {
          debouncedHandleContentChange(updatedContent);
        } else {
          handleContentChange(updatedContent);
        }
      }
    },
    [document, debouncedHandleContentChange, handleContentChange],
  );

  function getDocumentContentById(index: number) {
    if (!documents) return "";
    if (!documents[index]) return "";
    return documents[index].content ?? "";
  }

  const handleVersionChange = (type: "next" | "prev" | "toggle" | "latest") => {
    if (!documents) return;

    if (type === "latest") {
      setCurrentVersionIndex(documents.length - 1);
      setMode("edit");
    }

    if (type === "toggle") {
      setMode((mode) => (mode === "edit" ? "diff" : "edit"));
    }

    if (type === "prev") {
      if (currentVersionIndex > 0) {
        setCurrentVersionIndex((index) => index - 1);
      }
    } else if (type === "next") {
      if (currentVersionIndex < documents.length - 1) {
        setCurrentVersionIndex((index) => index + 1);
      }
    }
  };

  const [isToolbarVisible, setIsToolbarVisible] = useState(false);

  /*
   * NOTE: if there are no documents, or if
   * the documents are being fetched, then
   * we mark it as the current version.
   */

  const isCurrentVersion =
    documents && documents.length > 0
      ? currentVersionIndex === documents.length - 1
      : true;

  const { width: windowWidth, height: windowHeight } = useWindowSize();
  const isMobile = windowWidth ? windowWidth < 768 : false;

  return (
    <AnimatePresence>
      {block.isVisible && (
        <motion.div
          className="fixed left-0 top-0 z-50 flex h-dvh w-dvw flex-row bg-transparent"
          initial={{ opacity: 1 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0, transition: { delay: 0.4 } }}
        >
          {!isMobile && (
            <motion.div
              className="fixed h-dvh bg-background"
              initial={{
                width: isSidebarOpen ? windowWidth - 256 : windowWidth,
                right: 0,
              }}
              animate={{ width: windowWidth, right: 0 }}
              exit={{
                width: isSidebarOpen ? windowWidth - 256 : windowWidth,
                right: 0,
              }}
            />
          )}

          {!isMobile && (
            <motion.div
              className="relative h-dvh w-[400px] shrink-0 bg-muted dark:bg-background"
              initial={{ opacity: 0, x: 10, scale: 1 }}
              animate={{
                opacity: 1,
                x: 0,
                scale: 1,
                transition: {
                  delay: 0.2,
                  type: "spring",
                  stiffness: 200,
                  damping: 30,
                },
              }}
              exit={{
                opacity: 0,
                x: 0,
                scale: 1,
                transition: { duration: 0 },
              }}
            >
              <AnimatePresence>
                {!isCurrentVersion && (
                  <motion.div
                    className="absolute left-0 top-0 z-50 h-dvh w-[400px] bg-zinc-900/50"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                  />
                )}
              </AnimatePresence>

              <div className="flex h-full flex-col items-center justify-between gap-4">
                <BlockMessages
                  chatId={chatId}
                  isLoading={isLoading}
                  votes={votes}
                  messages={messages}
                  setMessages={setMessages}
                  reload={reload}
                  isReadonly={isReadonly}
                  blockStatus={block.status}
                />

                <form className="relative flex w-full flex-row items-end gap-2 px-4 pb-4">
                  <MultimodalInput
                    chatId={chatId}
                    input={input}
                    setInput={setInput}
                    handleSubmit={handleSubmit}
                    isLoading={isLoading}
                    stop={stop}
                    attachments={attachments}
                    setAttachments={setAttachments}
                    messages={messages}
                    append={append}
                    className="bg-background dark:bg-muted"
                    setMessages={setMessages}
                  />
                </form>
              </div>
            </motion.div>
          )}

          <motion.div
            className="fixed flex h-dvh flex-col overflow-y-scroll border-zinc-200 bg-background dark:border-zinc-700 dark:bg-muted md:border-l"
            initial={
              isMobile
                ? {
                    opacity: 1,
                    x: block.boundingBox.left,
                    y: block.boundingBox.top,
                    height: block.boundingBox.height,
                    width: block.boundingBox.width,
                    borderRadius: 50,
                  }
                : {
                    opacity: 1,
                    x: block.boundingBox.left,
                    y: block.boundingBox.top,
                    height: block.boundingBox.height,
                    width: block.boundingBox.width,
                    borderRadius: 50,
                  }
            }
            animate={
              isMobile
                ? {
                    opacity: 1,
                    x: 0,
                    y: 0,
                    height: windowHeight,
                    width: windowWidth ? windowWidth : "calc(100dvw)",
                    borderRadius: 0,
                    transition: {
                      delay: 0,
                      type: "spring",
                      stiffness: 200,
                      damping: 30,
                      duration: 5000,
                    },
                  }
                : {
                    opacity: 1,
                    x: 400,
                    y: 0,
                    height: windowHeight,
                    width: windowWidth
                      ? windowWidth - 400
                      : "calc(100dvw-400px)",
                    borderRadius: 0,
                    transition: {
                      delay: 0,
                      type: "spring",
                      stiffness: 200,
                      damping: 30,
                      duration: 5000,
                    },
                  }
            }
            exit={{
              opacity: 0,
              scale: 0.5,
              transition: {
                delay: 0.1,
                type: "spring",
                stiffness: 600,
                damping: 30,
              },
            }}
          >
            <div className="flex flex-row items-start justify-between p-2">
              <div className="flex flex-row items-start gap-4">
                <BlockCloseButton />

                <div className="flex flex-col">
                  <div className="font-medium">{block.title}</div>

                  {isContentDirty ? (
                    <div className="text-sm text-muted-foreground">
                      Saving changes...
                    </div>
                  ) : document ? (
                    <div className="text-sm text-muted-foreground">
                      {`Updated ${formatDistance(
                        new Date(document.createdAt),
                        new Date(),
                        {
                          addSuffix: true,
                        },
                      )}`}
                    </div>
                  ) : (
                    <div className="mt-2 h-3 w-32 animate-pulse rounded-md bg-muted-foreground/20" />
                  )}
                </div>
              </div>

              <BlockActions
                block={block}
                currentVersionIndex={currentVersionIndex}
                handleVersionChange={handleVersionChange}
                isCurrentVersion={isCurrentVersion}
                mode={mode}
                setConsoleOutputs={setConsoleOutputs}
              />
            </div>

            <div
              className={cn(
                "h-full !max-w-full items-center overflow-y-scroll bg-background pb-40 dark:bg-muted",
                {
                  "px-2 py-2": block.kind === "code",
                  "px-4 py-8 md:p-20": block.kind === "text",
                },
              )}
            >
              <div
                className={cn("flex flex-row", {
                  "": block.kind === "code",
                  "mx-auto max-w-[600px]": block.kind === "text",
                })}
              >
                {isDocumentsFetching && !block.content ? (
                  <DocumentSkeleton blockKind={block.kind} />
                ) : block.kind === "code" ? (
                  <CodeEditor
                    content={
                      isCurrentVersion
                        ? block.content
                        : getDocumentContentById(currentVersionIndex)
                    }
                    isCurrentVersion={isCurrentVersion}
                    currentVersionIndex={currentVersionIndex}
                    suggestions={suggestions ?? []}
                    status={block.status}
                    saveContent={saveContent}
                  />
                ) : block.kind === "text" ? (
                  mode === "edit" ? (
                    <Editor
                      content={
                        isCurrentVersion
                          ? block.content
                          : getDocumentContentById(currentVersionIndex)
                      }
                      isCurrentVersion={isCurrentVersion}
                      currentVersionIndex={currentVersionIndex}
                      status={block.status}
                      saveContent={saveContent}
                      suggestions={isCurrentVersion ? suggestions ?? [] : []}
                    />
                  ) : (
                    <DiffView
                      oldContent={getDocumentContentById(
                        currentVersionIndex - 1,
                      )}
                      newContent={getDocumentContentById(currentVersionIndex)}
                    />
                  )
                ) : block.kind === "image" ? (
                  <ImageEditor
                    title={block.title}
                    content={
                      isCurrentVersion
                        ? block.content
                        : getDocumentContentById(currentVersionIndex)
                    }
                    isCurrentVersion={isCurrentVersion}
                    currentVersionIndex={currentVersionIndex}
                    status={block.status}
                    isInline={false}
                  />
                ) : null}

                {suggestions && suggestions.length > 0 ? (
                  <div className="h-dvh w-12 shrink-0 md:hidden" />
                ) : null}

                <AnimatePresence>
                  {isCurrentVersion && (
                    <Toolbar
                      isToolbarVisible={isToolbarVisible}
                      setIsToolbarVisible={setIsToolbarVisible}
                      append={append}
                      isLoading={isLoading}
                      stop={stop}
                      setMessages={setMessages}
                      blockKind={block.kind}
                    />
                  )}
                </AnimatePresence>
              </div>
            </div>

            <AnimatePresence>
              {!isCurrentVersion && (
                <VersionFooter
                  currentVersionIndex={currentVersionIndex}
                  documents={documents}
                  handleVersionChange={handleVersionChange}
                />
              )}
            </AnimatePresence>

            <AnimatePresence>
              <Console
                consoleOutputs={consoleOutputs}
                setConsoleOutputs={setConsoleOutputs}
              />
            </AnimatePresence>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export const Block = memo(PureBlock, (prevProps, nextProps) => {
  if (prevProps.isLoading !== nextProps.isLoading) return false;
  if (!equal(prevProps.votes, nextProps.votes)) return false;
  if (prevProps.input !== nextProps.input) return false;
  if (!equal(prevProps.messages, nextProps.messages.length)) return false;

  return true;
});
