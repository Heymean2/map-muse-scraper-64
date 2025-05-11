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
      billing_transactions: {
        Row: {
          amount: number
          billing_period: string | null
          credits_purchased: number | null
          currency: string | null
          id: string
          metadata: Json | null
          payment_id: string | null
          payment_method: string
          plan_id: number | null
          status: string
          transaction_date: string | null
          user_id: string
        }
        Insert: {
          amount: number
          billing_period?: string | null
          credits_purchased?: number | null
          currency?: string | null
          id?: string
          metadata?: Json | null
          payment_id?: string | null
          payment_method: string
          plan_id?: number | null
          status: string
          transaction_date?: string | null
          user_id: string
        }
        Update: {
          amount?: number
          billing_period?: string | null
          credits_purchased?: number | null
          currency?: string | null
          id?: string
          metadata?: Json | null
          payment_id?: string | null
          payment_method?: string
          plan_id?: number | null
          status?: string
          transaction_date?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "billing_transactions_plan_id_fkey"
            columns: ["plan_id"]
            isOneToOne: false
            referencedRelation: "pricing_plans"
            referencedColumns: ["id"]
          },
        ]
      }
      pricing_plans: {
        Row: {
          billing_period: string
          created_at: string
          credits: number | null
          features: Json
          id: number
          is_recommended: boolean
          name: string
          price: number
          price_per_credit: number | null
          row_limit: number
          updated_at: string
        }
        Insert: {
          billing_period?: string
          created_at?: string
          credits?: number | null
          features?: Json
          id?: number
          is_recommended?: boolean
          name: string
          price: number
          price_per_credit?: number | null
          row_limit: number
          updated_at?: string
        }
        Update: {
          billing_period?: string
          created_at?: string
          credits?: number | null
          features?: Json
          id?: number
          is_recommended?: boolean
          name?: string
          price?: number
          price_per_credit?: number | null
          row_limit?: number
          updated_at?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string
          credits: number | null
          display_name: string | null
          email: string
          id: string
          is_admin: boolean | null
          notification_settings: Json | null
          plan_id: number | null
          provider: string | null
          total_rows: number | null
          updated_at: string
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string
          credits?: number | null
          display_name?: string | null
          email: string
          id: string
          is_admin?: boolean | null
          notification_settings?: Json | null
          plan_id?: number | null
          provider?: string | null
          total_rows?: number | null
          updated_at?: string
        }
        Update: {
          avatar_url?: string | null
          created_at?: string
          credits?: number | null
          display_name?: string | null
          email?: string
          id?: string
          is_admin?: boolean | null
          notification_settings?: Json | null
          plan_id?: number | null
          provider?: string | null
          total_rows?: number | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "profiles_plan_id_fkey"
            columns: ["plan_id"]
            isOneToOne: false
            referencedRelation: "pricing_plans"
            referencedColumns: ["id"]
          },
        ]
      }
      scraping_requests: {
        Row: {
          country: string
          created_at: string | null
          fields: string | null
          id: number
          json_result_url: string | null
          keywords: string
          rating: string | null
          result_url: string | null
          row_count: number | null
          states: string
          status: string | null
          task_id: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          country: string
          created_at?: string | null
          fields?: string | null
          id?: number
          json_result_url?: string | null
          keywords: string
          rating?: string | null
          result_url?: string | null
          row_count?: number | null
          states: string
          status?: string | null
          task_id: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          country?: string
          created_at?: string | null
          fields?: string | null
          id?: number
          json_result_url?: string | null
          keywords?: string
          rating?: string | null
          result_url?: string | null
          row_count?: number | null
          states?: string
          status?: string | null
          task_id?: string
          updated_at?: string | null
          user_id?: string
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
    Enums: {},
  },
} as const
