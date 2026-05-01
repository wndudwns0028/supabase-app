import Link from "next/link";

interface TeamSidebarProps {
  teamId: string;
}

export function TeamSidebar({ teamId }: TeamSidebarProps) {
  return (
    <aside className="w-48 shrink-0">
      <nav className="flex flex-col gap-1">
        <Link
          href={`/teams/${teamId}`}
          className="rounded-md px-3 py-2 text-sm hover:bg-accent hover:text-accent-foreground"
        >
          팀 홈
        </Link>
        <Link
          href={`/teams/${teamId}/members`}
          className="rounded-md px-3 py-2 text-sm hover:bg-accent hover:text-accent-foreground"
        >
          멤버 관리
        </Link>
        <Link
          href={`/teams/${teamId}/settings`}
          className="rounded-md px-3 py-2 text-sm hover:bg-accent hover:text-accent-foreground"
        >
          팀 설정
        </Link>
      </nav>
    </aside>
  );
}
