"use client";

import { useState } from "react";

import { useRouter } from "next/navigation";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import { createEvent, updateEvent } from "@/app/actions/events";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { DateTimePicker } from "@/components/ui/date-time-picker";
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
import { EventFormValues, eventSchema } from "@/lib/validations/event";
import { Event, EventStatus } from "@/types/domain";

const statusOptions: { value: EventStatus; label: string }[] = [
  { value: EventStatus.DRAFT, label: "초안" },
  { value: EventStatus.OPEN, label: "모집중" },
  { value: EventStatus.CLOSED, label: "마감" },
  { value: EventStatus.CANCELLED, label: "취소" },
];

interface EventFormProps {
  teamId: string;
  defaultValues?: Partial<EventFormValues>;
  eventId?: string;
}

export function EventForm({ teamId, defaultValues, eventId }: EventFormProps) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const isEditMode = !!eventId;

  const form = useForm<EventFormValues>({
    resolver: zodResolver(eventSchema),
    defaultValues: {
      title: "",
      description: "",
      location: "",
      startsAt: undefined,
      endsAt: undefined,
      isUnlimited: false,
      maxParticipants: null,
      entryFee: 0,
      status: EventStatus.OPEN,
      ...defaultValues,
    },
  });

  const isUnlimited = form.watch("isUnlimited");

  const onSubmit = async (values: EventFormValues) => {
    setIsSubmitting(true);
    try {
      // EventFormValues → FormData 변환
      const formData = new FormData();
      formData.set("title", values.title);
      if (values.description) formData.set("description", values.description);
      if (values.location) formData.set("location", values.location);
      formData.set("startsAt", values.startsAt.toISOString());
      formData.set("endsAt", values.endsAt.toISOString());
      formData.set("isUnlimited", String(values.isUnlimited));
      if (!values.isUnlimited && values.maxParticipants !== null) {
        formData.set("maxParticipants", String(values.maxParticipants));
      }
      formData.set("entryFee", String(values.entryFee));
      formData.set("status", values.status);

      if (isEditMode) {
        const result = await updateEvent(eventId, formData);
        if ("error" in result) {
          toast.error(result.error);
          return;
        }
        toast.success("이벤트가 수정되었습니다.");
        router.push(`/teams/${teamId}/events/${eventId}`);
      } else {
        const result = await createEvent(teamId, formData);
        if ("error" in result) {
          toast.error(result.error);
          return;
        }
        toast.success("이벤트가 생성되었습니다.");
        router.push(`/teams/${teamId}/events/${result.eventId}`);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        {/* 제목 */}
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                이벤트 제목 <span className="text-destructive">*</span>
              </FormLabel>
              <FormControl>
                <Input placeholder="이벤트 제목을 입력하세요" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* 설명 */}
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>설명</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="이벤트 설명을 입력하세요 (선택)"
                  rows={3}
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* 장소 */}
        <FormField
          control={form.control}
          name="location"
          render={({ field }) => (
            <FormItem>
              <FormLabel>장소</FormLabel>
              <FormControl>
                <Input placeholder="장소를 입력하세요 (선택)" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* 시작 일시 */}
        <FormField
          control={form.control}
          name="startsAt"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                시작 일시 <span className="text-destructive">*</span>
              </FormLabel>
              <FormControl>
                <DateTimePicker value={field.value} onChange={field.onChange} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* 종료 일시 */}
        <FormField
          control={form.control}
          name="endsAt"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                종료 일시 <span className="text-destructive">*</span>
              </FormLabel>
              <FormControl>
                <DateTimePicker value={field.value} onChange={field.onChange} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* 최대 인원 + 무제한 체크박스 */}
        <div className="space-y-2">
          <FormField
            control={form.control}
            name="maxParticipants"
            render={({ field }) => (
              <FormItem>
                <FormLabel>최대 인원</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    min={1}
                    placeholder="최대 인원 수"
                    disabled={isUnlimited}
                    value={field.value ?? ""}
                    onChange={(e) =>
                      field.onChange(
                        e.target.value ? Number(e.target.value) : null,
                      )
                    }
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="isUnlimited"
            render={({ field }) => (
              <FormItem className="flex items-center gap-2 space-y-0">
                <FormControl>
                  <Checkbox
                    checked={field.value}
                    onCheckedChange={(checked) => {
                      field.onChange(checked);
                      if (checked) form.setValue("maxParticipants", null);
                    }}
                  />
                </FormControl>
                <FormLabel className="font-normal">인원 제한 없음</FormLabel>
              </FormItem>
            )}
          />
        </div>

        {/* 참가비 */}
        <FormField
          control={form.control}
          name="entryFee"
          render={({ field }) => (
            <FormItem>
              <FormLabel>참가비 (원)</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  min={0}
                  placeholder="0"
                  value={field.value}
                  onChange={(e) => field.onChange(Number(e.target.value))}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* 상태 */}
        <FormField
          control={form.control}
          name="status"
          render={({ field }) => (
            <FormItem>
              <FormLabel>상태</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="상태를 선택하세요" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {statusOptions.map((opt) => (
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

        <Button type="submit" disabled={isSubmitting} className="w-full">
          {isSubmitting
            ? isEditMode
              ? "수정 중..."
              : "생성 중..."
            : isEditMode
              ? "이벤트 수정"
              : "이벤트 만들기"}
        </Button>
      </form>
    </Form>
  );
}

// 이벤트 도메인 객체로부터 폼 기본값을 생성하는 헬퍼
export function eventToFormValues(event: Event): Partial<EventFormValues> {
  return {
    title: event.title,
    description: event.description ?? "",
    location: event.location ?? "",
    startsAt: event.startsAt,
    endsAt: event.endsAt,
    isUnlimited: event.maxParticipants === null,
    maxParticipants: event.maxParticipants,
    entryFee: event.entryFee,
    status: event.status,
  };
}
