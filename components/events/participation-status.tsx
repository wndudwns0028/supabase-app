import { EventParticipant, ParticipantStatus } from "@/types/domain";

interface ParticipationStatusProps {
  participants: EventParticipant[];
  maxParticipants: number | null;
}

export function ParticipationStatus({
  participants,
  maxParticipants,
}: ParticipationStatusProps) {
  const confirmed = participants.filter(
    (p) => p.status === ParticipantStatus.CONFIRMED,
  );
  const waitlisted = participants.filter(
    (p) => p.status === ParticipantStatus.WAITLISTED,
  );

  return (
    <div className="space-y-2 rounded-lg border p-4">
      <h3 className="text-sm font-semibold">참여 현황</h3>
      <div className="flex items-center gap-6 text-sm">
        <div>
          <span className="text-2xl font-bold">{confirmed.length}</span>
          <span className="ml-1 text-muted-foreground">
            {maxParticipants ? `/ ${maxParticipants}명 확정` : "명 확정"}
          </span>
        </div>
        {waitlisted.length > 0 && (
          <div>
            <span className="text-lg font-semibold text-muted-foreground">
              {waitlisted.length}
            </span>
            <span className="ml-1 text-xs text-muted-foreground">명 대기</span>
          </div>
        )}
      </div>
      {maxParticipants && (
        <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
          <div
            className="h-full bg-primary transition-all"
            style={{
              width: `${Math.min((confirmed.length / maxParticipants) * 100, 100)}%`,
            }}
          />
        </div>
      )}
    </div>
  );
}
