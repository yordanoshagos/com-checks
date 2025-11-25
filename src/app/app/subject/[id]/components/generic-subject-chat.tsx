"use client";

import { Messages } from "@/features/chat/components/messages";
import { MultimodalInput } from "@/features/chat/components/multimodal-input";
import { Message, useChat } from "@ai-sdk/react";
import { createId } from "@paralleldrive/cuid2";
import { ChatType } from "@prisma/client";
import { useEffect, useRef, useState } from "react";
import { SubjectWithDocuments } from "./types";
import { api } from "@/trpc/react";
import { AIProviderError } from "./ai-provider-error";
import { TrialPaywall } from "@/components/trial-paywall";

export function GenericSubjectChat({
  initialMessages,
  subject,
  chatId,
  chatType,
}: {
  initialMessages: Message[];
  subject: SubjectWithDocuments;
  chatId?: string;
  chatType: ChatType;
}) {
  const hasInitialized = useRef(false);

  const [error, setError] = useState<boolean>(false);
  const [showTrialPaywall, setShowTrialPaywall] = useState<boolean>(false);

  const {
    messages,
    status,
    input,
    handleSubmit,
    stop,
    append,
    setMessages,
    setInput,
    reload,
    id,
  } = useChat({
    id: chatId,
    generateId: createId,
    onResponse: (_response) => {
      setError(false);
      setShowTrialPaywall(false);
    },
    onError: (error) => {
      console.error("Chat error:", error);

      // Check if it's a 402 status (Payment Required) for trial limit
      const errorString = JSON.stringify(error);
      const isTrialLimitError =
        (error instanceof Error && error.message.includes("402")) ||
        errorString.includes("402") ||
        errorString.includes("TRIAL_CHAT_LIMIT_EXCEEDED") ||
        (error instanceof Error && error.message.includes("trial"));

      if (isTrialLimitError) {
        console.log("Detected trial limit error");
        setShowTrialPaywall(true);
        return; // Don't set generic error state for trial limit
      }

      setError(true);
    },
    experimental_prepareRequestBody({ messages, id }) {
      return {
        message: messages[messages.length - 1],
        id,
        selectedChatModel: chatType,
      };
    },
    api: `/api/subject/${subject.id}/chat`,
    initialMessages,
  });

  const { data: votes = [] } = api.chat.getVotes.useQuery(
    { chatId: id },
    { enabled: !!id },
  );

  useEffect(() => {
    if (hasInitialized.current) return;
    hasInitialized.current = true;

    if (messages.length === 0) {
      void append({
        role: "user",
        content: "",
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (showTrialPaywall) {
    return <TrialPaywall />;
  }

  return (
    <>
      <div className="flex min-w-0 flex-col">
        {error && <AIProviderError />}
        <Messages
          chatId={id}
          status={status}
          votes={votes}
          // hideFirstMessage={true}
          messages={messages}
          setMessages={setMessages}
          reload={reload}
          isReadonly={false}
          isArtifactVisible={false}
        />

        <form className="mx-auto flex w-full gap-2 px-4 pb-4 md:max-w-3xl md:pb-6">
          <MultimodalInput
            chatId={id}
            input={input}
            setInput={setInput}
            handleSubmit={handleSubmit}
            status={status}
            stop={stop}
            attachments={[]}
            showAttachments={false}
            chatType={chatType}
            setAttachments={() => {
              return;
            }}
            messages={messages}
            setMessages={setMessages}
            append={append}
          />
        </form>
      </div>
    </>
  );
}
