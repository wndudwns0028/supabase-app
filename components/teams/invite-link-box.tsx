"use client";

import { useState } from "react";

import { Check, Copy, RefreshCw } from "lucide-react";

import { regenerateInviteToken } from "@/app/actions/teams";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface InviteLinkBoxProps {
  teamId: string;
  inviteToken: string;
  isOrganizer: boolean;
}

export function InviteLinkBox({
  teamId,
  inviteToken,
  isOrganizer,
}: InviteLinkBoxProps) {
  const [copied, setCopied] = useState(false);
  const [isRegenerating, setIsRegenerating] = useState(false);

  const inviteUrl =
    typeof window !== "undefined"
      ? `${window.location.origin}/join/${inviteToken}`
      : `/join/${inviteToken}`;

  const handleCopy = () => {
    navigator.clipboard.writeText(inviteUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleRegenerate = async () => {
    setIsRegenerating(true);
    try {
      await regenerateInviteToken(teamId);
    } finally {
      setIsRegenerating(false);
    }
  };

  return (
    <div className="space-y-3 rounded-lg border p-4">
      <h3 className="text-sm font-semibold">팀 초대 링크</h3>
      <div className="flex gap-2">
        <Input
          readOnly
          value={inviteUrl}
          className="flex-1 text-xs text-muted-foreground"
        />
        <Button size="sm" variant="outline" onClick={handleCopy}>
          {copied ? (
            <>
              <Check className="mr-1.5 h-4 w-4" />
              복사됨!
            </>
          ) : (
            <>
              <Copy className="mr-1.5 h-4 w-4" />
              복사
            </>
          )}
        </Button>
      </div>
      {isOrganizer && (
        <Button
          size="sm"
          variant="outline"
          disabled={isRegenerating}
          onClick={handleRegenerate}
        >
          <RefreshCw className="mr-1.5 h-4 w-4" />
          {isRegenerating ? "갱신 중..." : "초대 링크 갱신"}
        </Button>
      )}
    </div>
  );
}
