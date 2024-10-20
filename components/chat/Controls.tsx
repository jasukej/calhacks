"use client";

import { useVoice } from "@humeai/voice-react";
import { Button } from "@/components/ui/button";
import { Mic, MicOff, Phone } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { Toggle } from "@/components/ui/toggle";
import MicFFT from "@/components/chat/MicFFT";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";
import axios from "axios";
import { useEffect, useState } from "react";

export default function Controls() {
  const { disconnect, status, isMuted, unmute, mute, micFft, chatMetadata } = useVoice();
  const router = useRouter();
  const [chatGroupId, setChatGroupId] = useState<string | null>(null);

  useEffect(() => {
    if (chatMetadata && chatMetadata.chatGroupId) {
      setChatGroupId(chatMetadata.chatGroupId);
    }
  }, [chatMetadata]);

  const endCallAndSaveMessages = async () => {
    try {
      if (!chatGroupId) {
        console.error('No chatGroupId available');
        return;
      }

      const response = await axios.post('/api/run-triggers-pipeline', { chatGroupId });

      const result = response.data;

      if (response.status === 200) {
        const queryParams = new URLSearchParams({
          copingMechanisms: JSON.stringify(result.copingMechanisms),
        }).toString();
  
        router.push(`/summary?${queryParams}`);
      } else {
        console.error(result.error);
      }
    } catch (error) {
      console.error('Error ending call and saving messages:', error);
    }
  };

  return (
    <div
      className={
        cn(
          "fixed bottom-0 left-0 w-full p-4 flex items-center justify-center",
          "bg-gradient-to-t from-card via-card/90 to-card/0",
        )
      }
    >
      <AnimatePresence>
        {status.value === "connected" ? (
          <motion.div
            initial={{
              y: "100%",
              opacity: 0,
            }}
            animate={{
              y: 0,
              opacity: 1,
            }}
            exit={{
              y: "100%",
              opacity: 0,
            }}
            className={
              "p-4 bg-card border border-border rounded-lg shadow-sm flex items-center gap-4"
            }
          >
            <Toggle
              pressed={!isMuted}
              onPressedChange={() => {
                if (isMuted) {
                  unmute();
                } else {
                  mute();
                }
              }}
            >
              {isMuted ? (
                <MicOff className={"size-4"} />
              ) : (
                <Mic className={"size-4"} />
              )}
            </Toggle>

            <div className={"relative grid h-8 w-48 shrink grow-0"}>
              <MicFFT fft={micFft} className={"fill-current"} />
            </div>

            <Button
              className={"flex items-center gap-1"}
              onClick={() => {
                disconnect();
                endCallAndSaveMessages();
              }}
              variant={"destructive"}
            >
              <span>
                <Phone
                  className={"size-4 opacity-50"}
                  strokeWidth={2}
                  stroke={"currentColor"}
                />
              </span>
              <span>End Call</span>
            </Button>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  );
}