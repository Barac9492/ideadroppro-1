export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      daily_prompts: {
        Row: {
          created_at: string
          date: string
          id: string
          prompt_text_en: string
          prompt_text_ko: string
        }
        Insert: {
          created_at?: string
          date: string
          id?: string
          prompt_text_en: string
          prompt_text_ko: string
        }
        Update: {
          created_at?: string
          date?: string
          id?: string
          prompt_text_en?: string
          prompt_text_ko?: string
        }
        Relationships: []
      }
      idea_compositions: {
        Row: {
          created_at: string
          id: string
          idea_id: string
          module_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          idea_id: string
          module_id: string
        }
        Update: {
          created_at?: string
          id?: string
          idea_id?: string
          module_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "idea_compositions_idea_id_fkey"
            columns: ["idea_id"]
            isOneToOne: false
            referencedRelation: "ideas"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "idea_compositions_module_id_fkey"
            columns: ["module_id"]
            isOneToOne: false
            referencedRelation: "idea_modules"
            referencedColumns: ["id"]
          },
        ]
      }
      idea_likes: {
        Row: {
          created_at: string
          id: string
          idea_id: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          idea_id: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          idea_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "idea_likes_idea_id_fkey"
            columns: ["idea_id"]
            isOneToOne: false
            referencedRelation: "ideas"
            referencedColumns: ["id"]
          },
        ]
      }
      idea_modules: {
        Row: {
          cluster_id: number | null
          cluster_label: string | null
          content: string
          created_at: string
          created_by: string
          embedding: string | null
          id: string
          module_type: Database["public"]["Enums"]["module_type"]
          original_idea_id: string | null
          quality_score: number | null
          tags: string[] | null
          updated_at: string
          usage_count: number | null
          version: number | null
        }
        Insert: {
          cluster_id?: number | null
          cluster_label?: string | null
          content: string
          created_at?: string
          created_by: string
          embedding?: string | null
          id?: string
          module_type: Database["public"]["Enums"]["module_type"]
          original_idea_id?: string | null
          quality_score?: number | null
          tags?: string[] | null
          updated_at?: string
          usage_count?: number | null
          version?: number | null
        }
        Update: {
          cluster_id?: number | null
          cluster_label?: string | null
          content?: string
          created_at?: string
          created_by?: string
          embedding?: string | null
          id?: string
          module_type?: Database["public"]["Enums"]["module_type"]
          original_idea_id?: string | null
          quality_score?: number | null
          tags?: string[] | null
          updated_at?: string
          usage_count?: number | null
          version?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "idea_modules_original_idea_id_fkey"
            columns: ["original_idea_id"]
            isOneToOne: false
            referencedRelation: "ideas"
            referencedColumns: ["id"]
          },
        ]
      }
      ideas: {
        Row: {
          ai_analysis: string | null
          composition_version: number | null
          created_at: string
          final_verdict: string | null
          global_analysis: Json | null
          id: string
          improvements: string[] | null
          influence_boost: number | null
          is_modular: boolean | null
          likes_count: number | null
          market_potential: string[] | null
          pitch_points: string[] | null
          remix_chain_depth: number | null
          remix_count: number | null
          remix_parent_id: string | null
          score: number | null
          seed: boolean | null
          similar_ideas: string[] | null
          tags: string[] | null
          text: string
          updated_at: string
          user_id: string
        }
        Insert: {
          ai_analysis?: string | null
          composition_version?: number | null
          created_at?: string
          final_verdict?: string | null
          global_analysis?: Json | null
          id?: string
          improvements?: string[] | null
          influence_boost?: number | null
          is_modular?: boolean | null
          likes_count?: number | null
          market_potential?: string[] | null
          pitch_points?: string[] | null
          remix_chain_depth?: number | null
          remix_count?: number | null
          remix_parent_id?: string | null
          score?: number | null
          seed?: boolean | null
          similar_ideas?: string[] | null
          tags?: string[] | null
          text: string
          updated_at?: string
          user_id: string
        }
        Update: {
          ai_analysis?: string | null
          composition_version?: number | null
          created_at?: string
          final_verdict?: string | null
          global_analysis?: Json | null
          id?: string
          improvements?: string[] | null
          influence_boost?: number | null
          is_modular?: boolean | null
          likes_count?: number | null
          market_potential?: string[] | null
          pitch_points?: string[] | null
          remix_chain_depth?: number | null
          remix_count?: number | null
          remix_parent_id?: string | null
          score?: number | null
          seed?: boolean | null
          similar_ideas?: string[] | null
          tags?: string[] | null
          text?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "fk_ideas_user_id"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "ideas_remix_parent_id_fkey"
            columns: ["remix_parent_id"]
            isOneToOne: false
            referencedRelation: "ideas"
            referencedColumns: ["id"]
          },
        ]
      }
      influence_score_logs: {
        Row: {
          action_type: string
          created_at: string
          description: string | null
          id: string
          points: number
          reference_id: string | null
          user_id: string
        }
        Insert: {
          action_type: string
          created_at?: string
          description?: string | null
          id?: string
          points: number
          reference_id?: string | null
          user_id: string
        }
        Update: {
          action_type?: string
          created_at?: string
          description?: string | null
          id?: string
          points?: number
          reference_id?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "influence_score_logs_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      module_clusters: {
        Row: {
          center_embedding: string | null
          cluster_id: number
          cluster_label: string | null
          created_at: string | null
          id: number
          member_count: number | null
          updated_at: string | null
        }
        Insert: {
          center_embedding?: string | null
          cluster_id: number
          cluster_label?: string | null
          created_at?: string | null
          id?: number
          member_count?: number | null
          updated_at?: string | null
        }
        Update: {
          center_embedding?: string | null
          cluster_id?: number
          cluster_label?: string | null
          created_at?: string | null
          id?: number
          member_count?: number | null
          updated_at?: string | null
        }
        Relationships: []
      }
      module_recommendations: {
        Row: {
          compatibility_score: number | null
          created_at: string
          id: string
          recommendation_reason: string | null
          recommended_module_id: string
          source_module_id: string
        }
        Insert: {
          compatibility_score?: number | null
          created_at?: string
          id?: string
          recommendation_reason?: string | null
          recommended_module_id: string
          source_module_id: string
        }
        Update: {
          compatibility_score?: number | null
          created_at?: string
          id?: string
          recommendation_reason?: string | null
          recommended_module_id?: string
          source_module_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "module_recommendations_recommended_module_id_fkey"
            columns: ["recommended_module_id"]
            isOneToOne: false
            referencedRelation: "idea_modules"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "module_recommendations_source_module_id_fkey"
            columns: ["source_module_id"]
            isOneToOne: false
            referencedRelation: "idea_modules"
            referencedColumns: ["id"]
          },
        ]
      }
      module_similarities: {
        Row: {
          created_at: string | null
          id: string
          module_a_id: string | null
          module_b_id: string | null
          similarity_score: number
        }
        Insert: {
          created_at?: string | null
          id?: string
          module_a_id?: string | null
          module_b_id?: string | null
          similarity_score: number
        }
        Update: {
          created_at?: string | null
          id?: string
          module_a_id?: string | null
          module_b_id?: string | null
          similarity_score?: number
        }
        Relationships: [
          {
            foreignKeyName: "module_similarities_module_a_id_fkey"
            columns: ["module_a_id"]
            isOneToOne: false
            referencedRelation: "idea_modules"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "module_similarities_module_b_id_fkey"
            columns: ["module_b_id"]
            isOneToOne: false
            referencedRelation: "idea_modules"
            referencedColumns: ["id"]
          },
        ]
      }
      module_templates: {
        Row: {
          created_at: string
          description: string | null
          example_content: string | null
          id: string
          module_type: Database["public"]["Enums"]["module_type"]
          template_name: string
          validation_rules: Json | null
        }
        Insert: {
          created_at?: string
          description?: string | null
          example_content?: string | null
          id?: string
          module_type: Database["public"]["Enums"]["module_type"]
          template_name: string
          validation_rules?: Json | null
        }
        Update: {
          created_at?: string
          description?: string | null
          example_content?: string | null
          id?: string
          module_type?: Database["public"]["Enums"]["module_type"]
          template_name?: string
          validation_rules?: Json | null
        }
        Relationships: []
      }
      profiles: {
        Row: {
          created_at: string
          id: string
          updated_at: string
          username: string | null
        }
        Insert: {
          created_at?: string
          id: string
          updated_at?: string
          username?: string | null
        }
        Update: {
          created_at?: string
          id?: string
          updated_at?: string
          username?: string | null
        }
        Relationships: []
      }
      user_badges: {
        Row: {
          badge_emoji: string
          badge_type: string
          earned_at: string
          id: string
          user_id: string
        }
        Insert: {
          badge_emoji: string
          badge_type: string
          earned_at?: string
          id?: string
          user_id: string
        }
        Update: {
          badge_emoji?: string
          badge_type?: string
          earned_at?: string
          id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_badges_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      user_influence_scores: {
        Row: {
          created_at: string
          id: string
          last_monthly_reset: string | null
          last_weekly_reset: string | null
          monthly_score: number
          total_score: number
          updated_at: string
          user_id: string
          weekly_score: number
        }
        Insert: {
          created_at?: string
          id?: string
          last_monthly_reset?: string | null
          last_weekly_reset?: string | null
          monthly_score?: number
          total_score?: number
          updated_at?: string
          user_id: string
          weekly_score?: number
        }
        Update: {
          created_at?: string
          id?: string
          last_monthly_reset?: string | null
          last_weekly_reset?: string | null
          monthly_score?: number
          total_score?: number
          updated_at?: string
          user_id?: string
          weekly_score?: number
        }
        Relationships: [
          {
            foreignKeyName: "user_influence_scores_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: true
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      user_invitations: {
        Row: {
          accepted_at: string | null
          created_at: string
          email: string | null
          expires_at: string
          id: string
          invitation_code: string
          invitee_id: string | null
          inviter_id: string
          status: string
        }
        Insert: {
          accepted_at?: string | null
          created_at?: string
          email?: string | null
          expires_at?: string
          id?: string
          invitation_code: string
          invitee_id?: string | null
          inviter_id: string
          status?: string
        }
        Update: {
          accepted_at?: string | null
          created_at?: string
          email?: string | null
          expires_at?: string
          id?: string
          invitation_code?: string
          invitee_id?: string | null
          inviter_id?: string
          status?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_invitations_invitee_id_fkey"
            columns: ["invitee_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_invitations_inviter_id_fkey"
            columns: ["inviter_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      user_module_library: {
        Row: {
          created_at: string
          id: string
          module_data: Json
          module_type: string
          original_idea_text: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          module_data: Json
          module_type: string
          original_idea_text?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          module_data?: Json
          module_type?: string
          original_idea_text?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          created_at: string
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
      user_streaks: {
        Row: {
          created_at: string
          current_streak: number
          id: string
          last_submission_date: string | null
          max_streak: number
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          current_streak?: number
          id?: string
          last_submission_date?: string | null
          max_streak?: number
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          current_streak?: number
          id?: string
          last_submission_date?: string | null
          max_streak?: number
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_streaks_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: true
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      binary_quantize: {
        Args: { "": string } | { "": unknown }
        Returns: unknown
      }
      check_and_award_streak_badge: {
        Args: { p_user_id: string; p_streak: number }
        Returns: undefined
      }
      cosine_similarity: {
        Args: { embedding1: string; embedding2: string }
        Returns: number
      }
      delete_idea_cascade: {
        Args: { idea_id: string; user_id: string }
        Returns: boolean
      }
      find_similar_modules: {
        Args: {
          target_module_id: string
          similarity_threshold?: number
          limit_count?: number
        }
        Returns: {
          module_id: string
          similarity_score: number
          module_type: string
          content: string
        }[]
      }
      halfvec_avg: {
        Args: { "": number[] }
        Returns: unknown
      }
      halfvec_out: {
        Args: { "": unknown }
        Returns: unknown
      }
      halfvec_send: {
        Args: { "": unknown }
        Returns: string
      }
      halfvec_typmod_in: {
        Args: { "": unknown[] }
        Returns: number
      }
      has_role: {
        Args: {
          _user_id: string
          _role: Database["public"]["Enums"]["app_role"]
        }
        Returns: boolean
      }
      hnsw_bit_support: {
        Args: { "": unknown }
        Returns: unknown
      }
      hnsw_halfvec_support: {
        Args: { "": unknown }
        Returns: unknown
      }
      hnsw_sparsevec_support: {
        Args: { "": unknown }
        Returns: unknown
      }
      hnswhandler: {
        Args: { "": unknown }
        Returns: unknown
      }
      ivfflat_bit_support: {
        Args: { "": unknown }
        Returns: unknown
      }
      ivfflat_halfvec_support: {
        Args: { "": unknown }
        Returns: unknown
      }
      ivfflathandler: {
        Args: { "": unknown }
        Returns: unknown
      }
      l2_norm: {
        Args: { "": unknown } | { "": unknown }
        Returns: number
      }
      l2_normalize: {
        Args: { "": string } | { "": unknown } | { "": unknown }
        Returns: unknown
      }
      reset_periodic_scores: {
        Args: Record<PropertyKey, never>
        Returns: undefined
      }
      sparsevec_out: {
        Args: { "": unknown }
        Returns: unknown
      }
      sparsevec_send: {
        Args: { "": unknown }
        Returns: string
      }
      sparsevec_typmod_in: {
        Args: { "": unknown[] }
        Returns: number
      }
      update_influence_score: {
        Args: {
          p_user_id: string
          p_action_type: string
          p_points: number
          p_description?: string
          p_reference_id?: string
        }
        Returns: undefined
      }
      update_user_streak: {
        Args: { p_user_id: string }
        Returns: undefined
      }
      vector_avg: {
        Args: { "": number[] }
        Returns: string
      }
      vector_dims: {
        Args: { "": string } | { "": unknown }
        Returns: number
      }
      vector_norm: {
        Args: { "": string }
        Returns: number
      }
      vector_out: {
        Args: { "": string }
        Returns: unknown
      }
      vector_send: {
        Args: { "": string }
        Returns: string
      }
      vector_typmod_in: {
        Args: { "": unknown[] }
        Returns: number
      }
    }
    Enums: {
      app_role: "admin" | "moderator" | "user"
      module_type:
        | "problem"
        | "solution"
        | "target_customer"
        | "value_proposition"
        | "revenue_model"
        | "key_activities"
        | "key_resources"
        | "channels"
        | "competitive_advantage"
        | "market_size"
        | "team"
        | "potential_risks"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      app_role: ["admin", "moderator", "user"],
      module_type: [
        "problem",
        "solution",
        "target_customer",
        "value_proposition",
        "revenue_model",
        "key_activities",
        "key_resources",
        "channels",
        "competitive_advantage",
        "market_size",
        "team",
        "potential_risks",
      ],
    },
  },
} as const
