"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useWindowSize } from "usehooks-ts";

import { ModelSelector } from "@/components/ChatBot/model-selector";
import { SidebarToggle } from "@/components/ChatBot/sidebar-toggle";
import { Button } from "@/components/ui/button";
import { PlusIcon, VercelIcon } from "./icons";
import { useSidebar } from "../ui/sidebar";
import { memo, useContext, useEffect, useState } from "react";
import { Tooltip, TooltipContent, TooltipTrigger } from "../ui/tooltip";
import { type VisibilityType, VisibilitySelector } from "./visibility-selector";
import { ThirdwebProvider } from "thirdweb/react";
import WalletConnector from "../Crypto/wallet_connector";
import { ChatMain } from "../Crypto/chatMain";
import { CryptoContext } from "./chat";

function PureChatHeader({
  chatId,
  selectedModelId,
  selectedVisibilityType,
  isReadonly,
}: {
  chatId: string;
  selectedModelId: string;
  selectedVisibilityType: VisibilityType;
  isReadonly: boolean;
}) {
  const router = useRouter();
  const { open } = useSidebar();

  const { width: windowWidth } = useWindowSize();
  const { useCrypto, setUseCrypto } = useContext(CryptoContext);
  return (
    <header className="sticky top-0 flex items-center gap-2 bg-background px-2 py-1.5 md:px-2">
      <SidebarToggle />

      {(!open || windowWidth < 768) && (
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="outline"
              className="order-2 ml-auto px-2 md:order-1 md:ml-0 md:h-fit md:px-2"
              onClick={() => {
                router.push("/chatbot");
                router.refresh();
              }}
            >
              <PlusIcon />
              <span className="md:sr-only">New Chat</span>
            </Button>
          </TooltipTrigger>
          <TooltipContent>New Chat</TooltipContent>
        </Tooltip>
      )}

      {!isReadonly && (
        <ModelSelector
          selectedModelId={selectedModelId}
          className="order-1 md:order-2"
        />
      )}

      {!isReadonly && (
        <VisibilitySelector
          chatId={chatId}
          selectedVisibilityType={selectedVisibilityType}
          className="order-1 md:order-3"
        />
      )}
      <div className="order-4 hidden h-fit px-2 py-1.5 md:ml-auto md:flex md:h-[34px]">
        {!useCrypto ? (
          <Button
            onClick={() => {
              console.log("clicked");
              setUseCrypto(true);
              console.log("state updated", useCrypto);
            }}
          >
            UseCrypto
          </Button>
        ) : (
          <ChatMain
            submitForm={() => {
              return;
            }}
            input={"hello"}
            uploadQueue={[""]}
            isSendButton={false}
            setInput={(a: string) => {
              return;
            }}
            chatId={""}
          />
        )}
      </div>
    </header>
  );
}

export const ChatHeader = memo(PureChatHeader, (prevProps, nextProps) => {
  return prevProps.selectedModelId === nextProps.selectedModelId;
});
