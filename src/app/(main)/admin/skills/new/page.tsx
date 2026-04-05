"use client";

import { useState } from "react";
import { SkillForm } from "@/components/admin/SkillForm";
import { AdminHeader } from "@/components/admin/AdminHeader";

export default function NewSkillPage() {
  return (
    <>
      <AdminHeader />
      <SkillForm />
    </>
  );
}
