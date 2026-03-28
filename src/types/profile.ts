export interface Profile {
  id: string;
  email: string;
  display_name: string | null;
  role: "user" | "admin";
  created_at: string;
}
