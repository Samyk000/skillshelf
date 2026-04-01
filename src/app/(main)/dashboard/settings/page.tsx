"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { useUser } from "@/components/layout/UserProvider";
import { toast } from "sonner";
import { updateProfile } from "@/app/actions/user";
import { signOut } from "@/app/actions/auth";

export default function SettingsPage() {
  const { user } = useUser();
  const [displayName, setDisplayName] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!user) return;

    const loadProfile = async () => {
      const supabase = createClient();
      const { data: profile } = await supabase
        .from("profiles")
        .select("display_name")
        .eq("id", user.id)
        .single();

      setDisplayName(profile?.display_name ?? "");
      setLoading(false);
    };
    loadProfile();
  }, [user]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    const result = await updateProfile(displayName);

    if (result.error) {
      toast.error(result.error);
    } else {
      toast.success("Profile updated!");
    }
    setSaving(false);
  };

  const handleSignOut = async () => {
    await signOut();
    window.location.href = "/";
  };

  if (loading) {
    return (
      <div className="animate-pulse space-y-4">
        <div className="h-10 w-full bg-muted" />
        <div className="h-10 w-32 bg-muted" />
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6">
        <p className="text-xs font-semibold tracking-[0.2em] text-primary">
          // SETTINGS
        </p>
        <h2 className="mt-2 font-display text-xl font-bold tracking-wide">
          ACCOUNT SETTINGS
        </h2>
      </div>

      <form onSubmit={handleSave} className="max-w-md space-y-6">
        <div className="flex flex-col gap-2">
          <label
            htmlFor="settings-email"
            className="text-xs font-semibold tracking-widest text-muted-foreground uppercase"
          >
            EMAIL
          </label>
          <input
            id="settings-email"
            type="email"
            value={user?.email ?? ""}
            disabled
            className="border-2 border-input bg-muted px-3 py-2 text-sm text-muted-foreground"
          />
          <p className="text-xs text-muted-foreground">
            Email cannot be changed.
          </p>
        </div>

        <div className="flex flex-col gap-2">
          <label
            htmlFor="settings-display-name"
            className="text-xs font-semibold tracking-widest text-muted-foreground uppercase"
          >
            DISPLAY NAME
          </label>
          <input
            id="settings-display-name"
            type="text"
            value={displayName}
            onChange={(e) => setDisplayName(e.target.value)}
            maxLength={100}
            className="border-2 border-input bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none"
            placeholder="Your display name"
          />
        </div>

        <button
          type="submit"
          disabled={saving}
          className="border-2 border-primary bg-primary px-6 py-3 text-sm font-bold tracking-widest text-primary-foreground uppercase transition-colors hover:bg-transparent hover:text-primary disabled:opacity-50"
        >
          {saving ? "SAVING..." : "SAVE CHANGES"}
        </button>
      </form>

      <div className="mt-12 border-t-2 border-border pt-8">
        <p className="mb-4 text-xs font-semibold tracking-[0.2em] text-destructive">
          // DANGER ZONE
        </p>
        <button
          onClick={handleSignOut}
          className="border-2 border-destructive px-6 py-3 text-sm font-bold tracking-widest text-destructive uppercase transition-colors hover:bg-destructive hover:text-destructive-foreground"
        >
          SIGN OUT
        </button>
      </div>
    </div>
  );
}
