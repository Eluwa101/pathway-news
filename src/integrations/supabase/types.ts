export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "12.2.3 (519615d)"
  }
  public: {
    Tables: {
      books: {
        Row: {
          author: string
          category: string
          cover_image_url: string | null
          created_at: string
          description: string
          file_url: string
          id: string
          is_published: boolean
          title: string
          updated_at: string
        }
        Insert: {
          author: string
          category: string
          cover_image_url?: string | null
          created_at?: string
          description: string
          file_url: string
          id?: string
          is_published?: boolean
          title: string
          updated_at?: string
        }
        Update: {
          author?: string
          category?: string
          cover_image_url?: string | null
          created_at?: string
          description?: string
          file_url?: string
          id?: string
          is_published?: boolean
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      career_events: {
        Row: {
          attendees: number | null
          cover_image_url: string | null
          created_at: string
          description: string
          download_link: string | null
          event_date: string
          featured_on_homepage: boolean | null
          id: string
          industry: string | null
          is_published: boolean
          live_link: string | null
          location: string
          position: string | null
          recording_link: string | null
          registration_required: boolean | null
          registration_url: string | null
          speaker: string
          status: string | null
          title: string
          topics: string[] | null
          updated_at: string
        }
        Insert: {
          attendees?: number | null
          cover_image_url?: string | null
          created_at?: string
          description: string
          download_link?: string | null
          event_date: string
          featured_on_homepage?: boolean | null
          id?: string
          industry?: string | null
          is_published?: boolean
          live_link?: string | null
          location: string
          position?: string | null
          recording_link?: string | null
          registration_required?: boolean | null
          registration_url?: string | null
          speaker: string
          status?: string | null
          title: string
          topics?: string[] | null
          updated_at?: string
        }
        Update: {
          attendees?: number | null
          cover_image_url?: string | null
          created_at?: string
          description?: string
          download_link?: string | null
          event_date?: string
          featured_on_homepage?: boolean | null
          id?: string
          industry?: string | null
          is_published?: boolean
          live_link?: string | null
          location?: string
          position?: string | null
          recording_link?: string | null
          registration_required?: boolean | null
          registration_url?: string | null
          speaker?: string
          status?: string | null
          title?: string
          topics?: string[] | null
          updated_at?: string
        }
        Relationships: []
      }
      career_paths: {
        Row: {
          category: string
          created_at: string
          description: string
          id: string
          is_published: boolean
          prospects: string
          skills: string[]
          steps: string[]
          timeframe: string
          title: string
          updated_at: string
        }
        Insert: {
          category: string
          created_at?: string
          description: string
          id?: string
          is_published?: boolean
          prospects: string
          skills?: string[]
          steps?: string[]
          timeframe: string
          title: string
          updated_at?: string
        }
        Update: {
          category?: string
          created_at?: string
          description?: string
          id?: string
          is_published?: boolean
          prospects?: string
          skills?: string[]
          steps?: string[]
          timeframe?: string
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      career_plans: {
        Row: {
          career_plan: string | null
          created_at: string
          custom_industry: string | null
          custom_interests: string[] | null
          custom_plan_type: string | null
          custom_skills: string[] | null
          custom_timeframe: string | null
          custom_work_style: string | null
          full_name: string
          goals: string | null
          id: string
          industry: string | null
          interests: string[]
          plan_type: string | null
          skills: string[]
          summary: string | null
          timeframe: string | null
          updated_at: string
          user_id: string
          work_style: string | null
        }
        Insert: {
          career_plan?: string | null
          created_at?: string
          custom_industry?: string | null
          custom_interests?: string[] | null
          custom_plan_type?: string | null
          custom_skills?: string[] | null
          custom_timeframe?: string | null
          custom_work_style?: string | null
          full_name: string
          goals?: string | null
          id?: string
          industry?: string | null
          interests?: string[]
          plan_type?: string | null
          skills?: string[]
          summary?: string | null
          timeframe?: string | null
          updated_at?: string
          user_id: string
          work_style?: string | null
        }
        Update: {
          career_plan?: string | null
          created_at?: string
          custom_industry?: string | null
          custom_interests?: string[] | null
          custom_plan_type?: string | null
          custom_skills?: string[] | null
          custom_timeframe?: string | null
          custom_work_style?: string | null
          full_name?: string
          goals?: string | null
          id?: string
          industry?: string | null
          interests?: string[]
          plan_type?: string | null
          skills?: string[]
          summary?: string | null
          timeframe?: string | null
          updated_at?: string
          user_id?: string
          work_style?: string | null
        }
        Relationships: []
      }
      devotionals: {
        Row: {
          author: string
          content: string
          cover_image_url: string | null
          created_at: string
          download_link: string | null
          event_date: string | null
          event_time: string | null
          featured_on_homepage: boolean | null
          id: string
          is_published: boolean
          live_link: string | null
          recording_link: string | null
          scripture_reference: string | null
          speaker: string | null
          status: string | null
          title: string
          topics: string[] | null
          updated_at: string
        }
        Insert: {
          author: string
          content: string
          cover_image_url?: string | null
          created_at?: string
          download_link?: string | null
          event_date?: string | null
          event_time?: string | null
          featured_on_homepage?: boolean | null
          id?: string
          is_published?: boolean
          live_link?: string | null
          recording_link?: string | null
          scripture_reference?: string | null
          speaker?: string | null
          status?: string | null
          title: string
          topics?: string[] | null
          updated_at?: string
        }
        Update: {
          author?: string
          content?: string
          cover_image_url?: string | null
          created_at?: string
          download_link?: string | null
          event_date?: string | null
          event_time?: string | null
          featured_on_homepage?: boolean | null
          id?: string
          is_published?: boolean
          live_link?: string | null
          recording_link?: string | null
          scripture_reference?: string | null
          speaker?: string | null
          status?: string | null
          title?: string
          topics?: string[] | null
          updated_at?: string
        }
        Relationships: []
      }
      jobs: {
        Row: {
          application_url: string
          benefits: string[] | null
          category: string
          company: string
          contact_email: string | null
          created_at: string
          deadline: string | null
          description: string
          experience_level: string
          id: string
          is_featured: boolean
          is_published: boolean
          job_type: string
          location: string
          requirements: string[]
          salary_range: string | null
          tags: string[] | null
          title: string
          updated_at: string
        }
        Insert: {
          application_url: string
          benefits?: string[] | null
          category: string
          company: string
          contact_email?: string | null
          created_at?: string
          deadline?: string | null
          description: string
          experience_level?: string
          id?: string
          is_featured?: boolean
          is_published?: boolean
          job_type?: string
          location: string
          requirements?: string[]
          salary_range?: string | null
          tags?: string[] | null
          title: string
          updated_at?: string
        }
        Update: {
          application_url?: string
          benefits?: string[] | null
          category?: string
          company?: string
          contact_email?: string | null
          created_at?: string
          deadline?: string | null
          description?: string
          experience_level?: string
          id?: string
          is_featured?: boolean
          is_published?: boolean
          job_type?: string
          location?: string
          requirements?: string[]
          salary_range?: string | null
          tags?: string[] | null
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      news: {
        Row: {
          category: string
          content: string
          created_at: string
          featured_on_homepage: boolean | null
          id: string
          image_urls: string[] | null
          is_hot: boolean
          is_published: boolean
          media_url: string | null
          summary: string
          tags: string[] | null
          title: string
          updated_at: string
          video_url: string | null
        }
        Insert: {
          category: string
          content: string
          created_at?: string
          featured_on_homepage?: boolean | null
          id?: string
          image_urls?: string[] | null
          is_hot?: boolean
          is_published?: boolean
          media_url?: string | null
          summary: string
          tags?: string[] | null
          title: string
          updated_at?: string
          video_url?: string | null
        }
        Update: {
          category?: string
          content?: string
          created_at?: string
          featured_on_homepage?: boolean | null
          id?: string
          image_urls?: string[] | null
          is_hot?: boolean
          is_published?: boolean
          media_url?: string | null
          summary?: string
          tags?: string[] | null
          title?: string
          updated_at?: string
          video_url?: string | null
        }
        Relationships: []
      }
      recordings: {
        Row: {
          audio_url: string
          category: string
          created_at: string
          description: string
          duration_minutes: number | null
          id: string
          is_published: boolean
          title: string
          updated_at: string
        }
        Insert: {
          audio_url: string
          category: string
          created_at?: string
          description: string
          duration_minutes?: number | null
          id?: string
          is_published?: boolean
          title: string
          updated_at?: string
        }
        Update: {
          audio_url?: string
          category?: string
          created_at?: string
          description?: string
          duration_minutes?: number | null
          id?: string
          is_published?: boolean
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      whatsapp_groups: {
        Row: {
          category: string
          color: string
          created_at: string
          description: string
          icon: string
          id: string
          is_active: boolean
          is_published: boolean
          link: string
          members: number
          name: string
          updated_at: string
        }
        Insert: {
          category: string
          color?: string
          created_at?: string
          description: string
          icon?: string
          id?: string
          is_active?: boolean
          is_published?: boolean
          link: string
          members?: number
          name: string
          updated_at?: string
        }
        Update: {
          category?: string
          color?: string
          created_at?: string
          description?: string
          icon?: string
          id?: string
          is_active?: boolean
          is_published?: boolean
          link?: string
          members?: number
          name?: string
          updated_at?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
