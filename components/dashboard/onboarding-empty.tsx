import { Users } from "lucide-react";

import { EmptyState } from "@/components/ui/empty-state";

export function OnboardingEmpty() {
  return (
    <EmptyState
      icon={Users}
      title="아직 속한 팀이 없어요"
      description="팀을 만들거나 초대 링크로 팀에 참여해 이벤트를 관리해보세요."
      action={{ label: "팀 만들기", href: "/teams/new" }}
    />
  );
}
