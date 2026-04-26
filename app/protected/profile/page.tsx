"use client";

import { useEffect, useState, useTransition } from "react";

import { getProfile, updateProfile } from "@/app/actions/profile";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tables } from "@/types/supabase";

type Profile = Tables<"profiles">;

export default function ProfilePage() {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [message, setMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    getProfile().then(setProfile);
  }, []);

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const data = {
      username:
        (form.elements.namedItem("username") as HTMLInputElement).value || null,
      full_name:
        (form.elements.namedItem("full_name") as HTMLInputElement).value ||
        null,
      bio: (form.elements.namedItem("bio") as HTMLInputElement).value || null,
      website:
        (form.elements.namedItem("website") as HTMLInputElement).value || null,
    };

    startTransition(async () => {
      const result = await updateProfile(data);
      if (result?.error) {
        setMessage({ type: "error", text: result.error });
      } else {
        setMessage({ type: "success", text: "프로필이 저장되었습니다." });
        const updated = await getProfile();
        setProfile(updated);
      }
      setTimeout(() => setMessage(null), 3000);
    });
  }

  if (!profile) {
    return (
      <div className="flex h-40 items-center justify-center">
        <p className="text-muted-foreground">프로필 로딩 중...</p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-xl px-4 py-10">
      <h1 className="mb-6 text-2xl font-bold">내 프로필</h1>

      <form onSubmit={handleSubmit} className="flex flex-col gap-5">
        <div className="flex flex-col gap-1.5">
          <Label>이메일</Label>
          <Input value={profile.email ?? ""} disabled className="bg-muted" />
        </div>

        <div className="flex flex-col gap-1.5">
          <Label htmlFor="username">사용자명</Label>
          <Input
            id="username"
            name="username"
            defaultValue={profile.username ?? ""}
            placeholder="고유 사용자명 입력"
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <Label htmlFor="full_name">이름</Label>
          <Input
            id="full_name"
            name="full_name"
            defaultValue={profile.full_name ?? ""}
            placeholder="이름 입력"
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <Label htmlFor="bio">자기소개</Label>
          <Input
            id="bio"
            name="bio"
            defaultValue={profile.bio ?? ""}
            placeholder="자기소개를 입력하세요"
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <Label htmlFor="website">웹사이트</Label>
          <Input
            id="website"
            name="website"
            type="url"
            defaultValue={profile.website ?? ""}
            placeholder="https://example.com"
          />
        </div>

        {message && (
          <p
            className={`text-sm ${message.type === "success" ? "text-green-600" : "text-red-500"}`}
          >
            {message.text}
          </p>
        )}

        <Button type="submit" disabled={isPending}>
          {isPending ? "저장 중..." : "저장"}
        </Button>
      </form>

      <div className="mt-8 text-xs text-muted-foreground">
        <p>
          가입일: {new Date(profile.created_at).toLocaleDateString("ko-KR")}
        </p>
        <p>
          최종 수정: {new Date(profile.updated_at).toLocaleDateString("ko-KR")}
        </p>
      </div>
    </div>
  );
}
