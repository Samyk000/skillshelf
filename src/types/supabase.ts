export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          email: string;
          display_name: string | null;
          role: "user" | "admin";
          created_at: string;
        };
        Insert: {
          id: string;
          email: string;
          display_name?: string | null;
          role?: "user" | "admin";
          created_at?: string;
        };
        Update: {
          id?: string;
          email?: string;
          display_name?: string | null;
          role?: "user" | "admin";
          created_at?: string;
        };
      };
      skills: {
        Row: {
          id: string;
          slug: string;
          title: string;
          short_description: string;
          long_description: string | null;
          category: string;
          status: "draft" | "published" | "archived";
          skill_markdown: string;
          preview_html: string | null;
          preview_external_url: string | null;
          cover_image_url: string | null;
          featured: boolean;
          created_by: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          slug: string;
          title: string;
          short_description: string;
          long_description?: string | null;
          category: string;
          status?: "draft" | "published" | "archived";
          skill_markdown: string;
          preview_html?: string | null;
          preview_external_url?: string | null;
          cover_image_url?: string | null;
          featured?: boolean;
          created_by?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          slug?: string;
          title?: string;
          short_description?: string;
          long_description?: string | null;
          category?: string;
          status?: "draft" | "published" | "archived";
          skill_markdown?: string;
          preview_html?: string | null;
          preview_external_url?: string | null;
          cover_image_url?: string | null;
          featured?: boolean;
          created_by?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      skill_likes: {
        Row: {
          id: string;
          user_id: string;
          skill_id: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          skill_id: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          skill_id?: string;
          created_at?: string;
        };
      };
      skill_saves: {
        Row: {
          id: string;
          user_id: string;
          skill_id: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          skill_id: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          skill_id?: string;
          created_at?: string;
        };
      };
      skill_views: {
        Row: {
          id: string;
          skill_id: string;
          user_id: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          skill_id: string;
          user_id?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          skill_id?: string;
          user_id?: string | null;
          created_at?: string;
        };
      };
    };
  };
}
