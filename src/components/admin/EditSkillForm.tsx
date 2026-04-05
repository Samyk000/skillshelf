"use client";

import { useState } from "react";
import { SkillForm } from "@/components/admin/SkillForm";
import { AdminHeader } from "@/components/admin/AdminHeader";
import type { Skill } from "@/types/skill";

interface EditSkillFormProps {
  skill: Skill;
}

export function EditSkillForm({ skill }: EditSkillFormProps) {
  return (
    <>
      <AdminHeader />
      <SkillForm skill={skill} />
    </>
  );
}
