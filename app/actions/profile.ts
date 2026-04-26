"use server";

import { revalidatePath } from "next/cache";

import { createClient } from "@/lib/supabase/server";
import { TablesUpdate } from "@/types/supabase";

export async function getProfile() {
  const supabase = await createClient();
  const { data: claims } = await supabase.auth.getClaims();

  if (!claims) return null;

  const { data, error } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", claims.claims.sub)
    .single();

  if (error) return null;
  return data;
}

export async function updateProfile(formData: TablesUpdate<"profiles">) {
  const supabase = await createClient();
  const { data: claims } = await supabase.auth.getClaims();

  if (!claims) return { error: "인증이 필요합니다." };

  const { error } = await supabase
    .from("profiles")
    .update(formData)
    .eq("id", claims.claims.sub);

  if (error) {
    if (error.code === "23505")
      return { error: "이미 사용 중인 사용자명입니다." };
    return { error: "프로필 업데이트에 실패했습니다." };
  }

  revalidatePath("/protected/profile");
  return { success: true };
}
