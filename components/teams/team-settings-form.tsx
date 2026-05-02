"use client";

import { useState } from "react";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import { updateTeam } from "@/app/actions/teams";
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

const sportTypeOptions: { value: SportType; label: string }[] = [
  { value: SportType.SWIMMING, label: "수영" },
  { value: SportType.FITNESS, label: "헬스" },
  { value: SportType.TABLETENNIS, label: "탁구" },
  { value: SportType.OTHER, label: "기타" },
];

interface TeamSettingsFormProps {
  teamId: string;
  defaultValues: TeamFormValues;
}

export function TeamSettingsForm({
  teamId,
  defaultValues,
}: TeamSettingsFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<TeamFormValues>({
    resolver: zodResolver(teamSchema),
    defaultValues,
  });

  const onSubmit = async (values: TeamFormValues) => {
    setIsSubmitting(true);
    try {
      // TeamFormValues → FormData 변환
      const formData = new FormData();
      formData.set("name", values.name);
      formData.set("sportType", values.sportType);
      if (values.description) formData.set("description", values.description);

      const result = await updateTeam(teamId, formData);

      if ("error" in result) {
        toast.error(result.error);
        return;
      }

      toast.success("팀 정보가 저장되었습니다.");
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
                <Input maxLength={50} {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* 종목 */}
        <FormField
          control={form.control}
          name="sportType"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                종목 <span className="text-destructive">*</span>
              </FormLabel>
              <Select onValueChange={field.onChange} value={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue />
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
                <Textarea rows={3} {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" disabled={isSubmitting} className="w-full">
          {isSubmitting ? "저장 중..." : "변경사항 저장"}
        </Button>
      </form>
    </Form>
  );
}
