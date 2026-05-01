import { UserCircle } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { TeamMember } from "@/types/domain";

interface MemberListProps {
  members: TeamMember[];
}

export function MemberList({ members }: MemberListProps) {
  const formatDate = (dateStr: string) =>
    new Date(dateStr).toLocaleDateString("ko-KR", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });

  return (
    <div className="space-y-2">
      {members.map((member) => (
        <div
          key={member.id}
          className="flex items-center gap-3 rounded-lg border p-3"
        >
          <UserCircle className="h-8 w-8 shrink-0 text-muted-foreground" />
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium">{member.userId}</span>
              <Badge
                variant={member.role === "organizer" ? "default" : "secondary"}
              >
                {member.role === "organizer" ? "주최자" : "멤버"}
              </Badge>
            </div>
            <p className="text-xs text-muted-foreground">
              합류일: {formatDate(member.joinedAt)}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}
