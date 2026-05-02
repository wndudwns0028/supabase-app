"use client";

import { useState } from "react";

import { useRouter } from "next/navigation";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import { createTeam } from "@/app/actions/teams";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { TeamFormValues, teamSchema } from "@/lib/validations/team";
import { SportType } from "@/types/domain";

// 종목 선택 옵션
const sportTypeOptions: { value: SportType; label: string }[] = [
  { value: SportType.SWIMMING, label: "수영" },
  { value: SportType.FITNESS, label: "헬스" },
  { value: SportType.TABLETENNIS, label: "탁구" },
  { value: SportType.OTHER, label: "기타" },
];

export function TeamForm() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<TeamFormValues>({
    resolver: zodResolver(teamSchema),
    defaultValues: {
      name: "",
      description: "",
      sportType: undefined,
    },
  });

  const onSubmit = async (values: TeamFormValues) => {
    setIsSubmitting(true);
    try {
      // FormData로 변환하여 서버 액션 호출
      const formData = new FormData();
      formData.set("name", values.name);
      formData.set("sportType", values.sportType);
      if (values.description) formData.set("description", values.description);

      const result = await createTeam(formData);

      if ("error" in result) {
        toast.error(result.error);
        return;
      }

      // 성공 시 팀 홈으로 이동
      toast.success("팀이 생성되었습니다.");
      router.push(`/teams/${result.teamId}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        {/* 팀 이름 */}
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                팀 이름 <span className="text-destructive">*</span>
              </FormLabel>
              <FormControl>
                <Input
                  placeholder="팀 이름을 입력하세요"
                  maxLength={50}
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* 종목 선택 */}
        <FormField
          control={form.control}
          name="sportType"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                종목 <span className="text-destructive">*</span>
              </FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="종목을 선택하세요" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {sportTypeOptions.map((opt) => (
                    <SelectItem key={opt.value} value={opt.value}>
                      {opt.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* 팀 설명 */}
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>팀 설명</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="팀에 대한 간단한 설명을 입력하세요 (선택)"
                  rows={3}
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" disabled={isSubmitting} className="w-full">
          {isSubmitting ? "생성 중..." : "팀 만들기"}
        </Button>
      </form>
    </Form>
  );
}
