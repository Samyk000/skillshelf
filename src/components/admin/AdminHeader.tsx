"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";

interface AdminHeaderProps {
  children?: React.ReactNode;
}

export function AdminHeader({ children }: AdminHeaderProps) {
  const pathname = usePathname();
  const isNewSkillPage = pathname === "/admin/skills/new";
  const isEditPage = pathname.includes("/admin/skills/") && pathname.includes("/edit");
  const isSkillFormPage = isNewSkillPage || isEditPage;

  return (
    <div className="mb-8 flex items-center justify-between">
      <div>
        <p className="text-xs font-semibold tracking-[0.2em] text-primary">
          // {isNewSkillPage ? "CREATE" : isEditPage ? "EDIT" : "ADMIN"}
        </p>
        <h2 className="mt-2 font-display text-2xl font-bold tracking-wide">
          {isNewSkillPage
            ? "NEW SKILL"
            : isEditPage
              ? "EDIT SKILL"
              : "CONTENT MANAGEMENT"}
        </h2>
      </div>
      {isSkillFormPage && children ? (
        <div className="flex items-center gap-4">
          {children}
        </div>
      ) : !isSkillFormPage ? (
        <Link
          href="/admin/skills/new"
          className="border-2 border-primary bg-primary px-6 py-2 text-sm font-bold tracking-widest text-primary-foreground uppercase transition-colors hover:bg-transparent hover:text-primary"
        >
          + NEW SKILL
        </Link>
      ) : null}
    </div>
  );
}
