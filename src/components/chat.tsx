import { useState } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import {
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  Sheet,
} from "./ui/sheet";

export type Message = {
  username: string;
  content: string;
};

export default function Chat(props: {
  chat: Message[];
  onMessage: (messageContent: string) => void;
}) {
  const [messageContent, setMessageContent] = useState<string>("");
  return (
    <>
      <Sheet>
        <SheetTrigger asChild>
          <div className="absolute right-10 bottom-20 z-20">
            <Button>Chat</Button>
          </div>
        </SheetTrigger>
        <SheetContent>
          <div className="relative h-full">
            <SheetHeader>
              <SheetTitle>Chat</SheetTitle>
            </SheetHeader>
            {props.chat?.map((message, index) => (
              <div key={index}>
                {message.username} : {message.content}
              </div>
            ))}
            <div className="flex absolute m-5 bottom-5 items-center justify-center w-full gap-2">
              <Input
                onChange={(e) => {
                  setMessageContent(e.target.value);
                }}
                value={messageContent}
              />
              <Button
                disabled={!messageContent}
                onClick={() => {
                  props.onMessage(messageContent);
                  setMessageContent("");
                }}
              >
                Send
              </Button>
            </div>
          </div>
        </SheetContent>
      </Sheet>
    </>
  );
}
