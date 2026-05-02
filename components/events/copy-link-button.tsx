"use client";

import { useState } from "react";

import { Check, Copy } from "lucide-react";

import { Button } from "@/components/ui/button";

interface CopyLinkButtonProps {
  eventId: string;
}

/** 공유 링크 복사 버튼 — 클라이언트 상호작용이 필요하므로 분리 */
export function CopyLinkButton({ eventId }: CopyLinkButtonProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    if (typeof window !== "undefined") {
      navigator.clipboard.writeText(
        `${window.location.origin}/events/${eventId}`,
      );
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <Button variant="outline" size="sm" onClick={handleCopy}>
      {copied ? (
        <>
          <Check className="mr-1.5 h-4 w-4" /> 복사됨
        </>
      ) : (
        <>
          <Copy className="mr-1.5 h-4 w-4" /> 공유 링크 복사
        </>
      )}
    </Button>
  );
}
