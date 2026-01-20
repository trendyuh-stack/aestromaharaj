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
    PostgrestVersion: "14.1"
  }
  public: {
    Tables: {
      astrologers: {
        Row: {
          available_slots: Json | null
          avatar_url: string | null
          bio: string | null
          created_at: string
          experience_years: number
          expertise: string[]
          id: string
          is_active: boolean | null
          languages: string[] | null
          name: string
          price_per_session: number
          rating: number | null
          total_consultations: number | null
          updated_at: string
          user_id: string | null
        }
        Insert: {
          available_slots?: Json | null
          avatar_url?: string | null
          bio?: string | null
          created_at?: string
          experience_years?: number
          expertise?: string[]
          id?: string
          is_active?: boolean | null
          languages?: string[] | null
          name: string
          price_per_session?: number
          rating?: number | null
          total_consultations?: number | null
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          available_slots?: Json | null
          avatar_url?: string | null
          bio?: string | null
          created_at?: string
          experience_years?: number
          expertise?: string[]
          id?: string
          is_active?: boolean | null
          languages?: string[] | null
          name?: string
          price_per_session?: number
          rating?: number | null
          total_consultations?: number | null
          updated_at?: string
          user_id?: string | null
        }
        Relationships: []
      }
      bookings: {
        Row: {
          astrologer_id: string
          astrologer_notes: string | null
          created_at: string
          duration_minutes: number
          id: string
          kundali_id: string | null
          meet_link: string | null
          notes: string | null
          payment_amount: number
          payment_id: string | null
          payment_status: string
          scheduled_at: string
          status: string
          updated_at: string
          user_id: string
          user_notes: string | null
        }
        Insert: {
          astrologer_id: string
          astrologer_notes?: string | null
          created_at?: string
          duration_minutes?: number
          id?: string
          kundali_id?: string | null
          meet_link?: string | null
          notes?: string | null
          payment_amount: number
          payment_id?: string | null
          payment_status?: string
          scheduled_at: string
          status?: string
          updated_at?: string
          user_id: string
          user_notes?: string | null
        }
        Update: {
          astrologer_id?: string
          astrologer_notes?: string | null
          created_at?: string
          duration_minutes?: number
          id?: string
          kundali_id?: string | null
          meet_link?: string | null
          notes?: string | null
          payment_amount?: number
          payment_id?: string | null
          payment_status?: string
          scheduled_at?: string
          status?: string
          updated_at?: string
          user_id?: string
          user_notes?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "bookings_astrologer_id_fkey"
            columns: ["astrologer_id"]
            isOneToOne: false
            referencedRelation: "astrologers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "bookings_kundali_id_fkey"
            columns: ["kundali_id"]
            isOneToOne: false
            referencedRelation: "kundalis"
            referencedColumns: ["id"]
          },
        ]
      }
      kundalis: {
        Row: {
          chart_data: Json | null
          created_at: string
          date_of_birth: string
          gender: string
          houses: Json | null
          id: string
          lagna: string | null
          latitude: number | null
          longitude: number | null
          nakshatra: string | null
          name: string
          place_of_birth: string
          planetary_positions: Json | null
          predictions: Json | null
          rashi: string | null
          time_of_birth: string
          timezone: string
          updated_at: string
          user_id: string
        }
        Insert: {
          chart_data?: Json | null
          created_at?: string
          date_of_birth: string
          gender: string
          houses?: Json | null
          id?: string
          lagna?: string | null
          latitude?: number | null
          longitude?: number | null
          nakshatra?: string | null
          name: string
          place_of_birth: string
          planetary_positions?: Json | null
          predictions?: Json | null
          rashi?: string | null
          time_of_birth: string
          timezone: string
          updated_at?: string
          user_id: string
        }
        Update: {
          chart_data?: Json | null
          created_at?: string
          date_of_birth?: string
          gender?: string
          houses?: Json | null
          id?: string
          lagna?: string | null
          latitude?: number | null
          longitude?: number | null
          nakshatra?: string | null
          name?: string
          place_of_birth?: string
          planetary_positions?: Json | null
          predictions?: Json | null
          rashi?: string | null
          time_of_birth?: string
          timezone?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string
          email: string | null
          full_name: string | null
          id: string
          phone: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string
          email?: string | null
          full_name?: string | null
          id?: string
          phone?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          avatar_url?: string | null
          created_at?: string
          email?: string | null
          full_name?: string | null
          id?: string
          phone?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      is_astrologer: { Args: { _user_id: string }; Returns: boolean }
      is_booking_astrologer: { Args: { _booking_id: string }; Returns: boolean }
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
