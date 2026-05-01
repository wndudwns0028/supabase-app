"use client";

import { useState } from "react";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import { createSettlement } from "@/app/actions/settlements";
import { AmountPreview } from "@/components/settlements/amount-preview";
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
import { Textarea } from "@/components/ui/textarea";
import {
  SettlementFormValues,
  settlementSchema,
} from "@/lib/validations/settlement";

interface SettlementFormProps {
  eventId: string;
  confirmedCount: number;
}

export function SettlementForm({
  eventId,
  confirmedCount,
}: SettlementFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<SettlementFormValues>({
    resolver: zodResolver(settlementSchema),
    defaultValues: {
      totalAmount: 0,
      memo: "",
    },
  });

  // 실시간 총비용 watch로 미리보기 계산
  const totalAmount = form.watch("totalAmount");

  const onSubmit = async (values: SettlementFormValues) => {
    setIsSubmitting(true);
    try {
      await createSettlement(eventId, values);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        {/* 총비용 */}
        <FormField
          control={form.control}
          name="totalAmount"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                총비용 (원) <span className="text-destructive">*</span>
              </FormLabel>
              <FormControl>
                <Input
                  type="number"
                  min={1}
                  placeholder="총비용을 입력하세요"
                  value={field.value || ""}
                  onChange={(e) =>
                    field.onChange(e.target.value ? Number(e.target.value) : 0)
                  }
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* 1/N 미리보기 — 총비용 입력 시 실시간 업데이트 */}
        <AmountPreview
          totalAmount={totalAmount}
          confirmedCount={confirmedCount}
        />

        {/* 메모 */}
        <FormField
          control={form.control}
          name="memo"
          render={({ field }) => (
            <FormItem>
              <FormLabel>메모</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="정산 관련 메모를 입력하세요 (선택)"
                  rows={2}
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" disabled={isSubmitting} className="w-full">
          {isSubmitting ? "생성 중..." : "정산 생성"}
        </Button>
      </form>
    </Form>
  );
}
