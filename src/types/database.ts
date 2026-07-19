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
    PostgrestVersion: "14.5"
  }
  public: {
    Tables: {
      activities: {
        Row: {
          created_at: string
          id: number
          list_id: number | null
          log_id: number | null
          target_user_id: string | null
          type: Database["public"]["Enums"]["activity_type"]
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: never
          list_id?: number | null
          log_id?: number | null
          target_user_id?: string | null
          type: Database["public"]["Enums"]["activity_type"]
          user_id: string
        }
        Update: {
          created_at?: string
          id?: never
          list_id?: number | null
          log_id?: number | null
          target_user_id?: string | null
          type?: Database["public"]["Enums"]["activity_type"]
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "activities_list_id_fkey"
            columns: ["list_id"]
            isOneToOne: false
            referencedRelation: "lists"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "activities_log_id_fkey"
            columns: ["log_id"]
            isOneToOne: false
            referencedRelation: "logs"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "activities_target_user_id_fkey"
            columns: ["target_user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "activities_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      anime_details: {
        Row: {
          airing_status: string | null
          episodes: number | null
          format: Database["public"]["Enums"]["anime_format"] | null
          media_id: number
          season: string | null
          studio: string | null
        }
        Insert: {
          airing_status?: string | null
          episodes?: number | null
          format?: Database["public"]["Enums"]["anime_format"] | null
          media_id: number
          season?: string | null
          studio?: string | null
        }
        Update: {
          airing_status?: string | null
          episodes?: number | null
          format?: Database["public"]["Enums"]["anime_format"] | null
          media_id?: number
          season?: string | null
          studio?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "anime_details_media_id_fkey"
            columns: ["media_id"]
            isOneToOne: true
            referencedRelation: "media"
            referencedColumns: ["id"]
          },
        ]
      }
      comments: {
        Row: {
          body: string
          created_at: string
          id: number
          log_id: number
          parent_id: number | null
          user_id: string
        }
        Insert: {
          body: string
          created_at?: string
          id?: never
          log_id: number
          parent_id?: number | null
          user_id: string
        }
        Update: {
          body?: string
          created_at?: string
          id?: never
          log_id?: number
          parent_id?: number | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "comments_log_id_fkey"
            columns: ["log_id"]
            isOneToOne: false
            referencedRelation: "logs"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "comments_parent_id_fkey"
            columns: ["parent_id"]
            isOneToOne: false
            referencedRelation: "comments"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "comments_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      follows: {
        Row: {
          created_at: string
          follower_id: string
          following_id: string
        }
        Insert: {
          created_at?: string
          follower_id: string
          following_id: string
        }
        Update: {
          created_at?: string
          follower_id?: string
          following_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "follows_follower_id_fkey"
            columns: ["follower_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "follows_following_id_fkey"
            columns: ["following_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      game_details: {
        Row: {
          developer: string | null
          media_id: number
          platforms: string[]
          price_krw: number | null
          publisher: string | null
          steam_app_id: number | null
        }
        Insert: {
          developer?: string | null
          media_id: number
          platforms?: string[]
          price_krw?: number | null
          publisher?: string | null
          steam_app_id?: number | null
        }
        Update: {
          developer?: string | null
          media_id?: number
          platforms?: string[]
          price_krw?: number | null
          publisher?: string | null
          steam_app_id?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "game_details_media_id_fkey"
            columns: ["media_id"]
            isOneToOne: true
            referencedRelation: "media"
            referencedColumns: ["id"]
          },
        ]
      }
      genres: {
        Row: {
          id: number
          media_type: Database["public"]["Enums"]["media_type"] | null
          name: string
        }
        Insert: {
          id?: never
          media_type?: Database["public"]["Enums"]["media_type"] | null
          name: string
        }
        Update: {
          id?: never
          media_type?: Database["public"]["Enums"]["media_type"] | null
          name?: string
        }
        Relationships: []
      }
      list_items: {
        Row: {
          id: number
          list_id: number
          media_id: number
          note: string | null
          position: number
        }
        Insert: {
          id?: never
          list_id: number
          media_id: number
          note?: string | null
          position?: number
        }
        Update: {
          id?: never
          list_id?: number
          media_id?: number
          note?: string | null
          position?: number
        }
        Relationships: [
          {
            foreignKeyName: "list_items_list_id_fkey"
            columns: ["list_id"]
            isOneToOne: false
            referencedRelation: "lists"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "list_items_media_id_fkey"
            columns: ["media_id"]
            isOneToOne: false
            referencedRelation: "media"
            referencedColumns: ["id"]
          },
        ]
      }
      lists: {
        Row: {
          created_at: string
          description: string | null
          id: number
          is_public: boolean
          is_ranked: boolean
          title: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: never
          is_public?: boolean
          is_ranked?: boolean
          title: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: never
          is_public?: boolean
          is_ranked?: boolean
          title?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "lists_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      log_likes: {
        Row: {
          created_at: string
          log_id: number
          user_id: string
        }
        Insert: {
          created_at?: string
          log_id: number
          user_id: string
        }
        Update: {
          created_at?: string
          log_id?: number
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "log_likes_log_id_fkey"
            columns: ["log_id"]
            isOneToOne: false
            referencedRelation: "logs"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "log_likes_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      logs: {
        Row: {
          created_at: string
          finished_at: string | null
          has_spoiler: boolean
          id: number
          is_private: boolean
          media_id: number
          progress: Json
          rating: number | null
          review: string | null
          started_at: string | null
          status: Database["public"]["Enums"]["log_status"]
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          finished_at?: string | null
          has_spoiler?: boolean
          id?: never
          is_private?: boolean
          media_id: number
          progress?: Json
          rating?: number | null
          review?: string | null
          started_at?: string | null
          status?: Database["public"]["Enums"]["log_status"]
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          finished_at?: string | null
          has_spoiler?: boolean
          id?: never
          is_private?: boolean
          media_id?: number
          progress?: Json
          rating?: number | null
          review?: string | null
          started_at?: string | null
          status?: Database["public"]["Enums"]["log_status"]
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "logs_media_id_fkey"
            columns: ["media_id"]
            isOneToOne: false
            referencedRelation: "media"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "logs_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      media: {
        Row: {
          avg_rating: number | null
          cover_url: string | null
          created_at: string
          description: string | null
          external_id: string
          external_source: string
          id: number
          media_type: Database["public"]["Enums"]["media_type"]
          ratings_count: number
          release_date: string | null
          title: string
          title_alt: string[]
          title_original: string | null
          updated_at: string
        }
        Insert: {
          avg_rating?: number | null
          cover_url?: string | null
          created_at?: string
          description?: string | null
          external_id: string
          external_source: string
          id?: never
          media_type: Database["public"]["Enums"]["media_type"]
          ratings_count?: number
          release_date?: string | null
          title: string
          title_alt?: string[]
          title_original?: string | null
          updated_at?: string
        }
        Update: {
          avg_rating?: number | null
          cover_url?: string | null
          created_at?: string
          description?: string | null
          external_id?: string
          external_source?: string
          id?: never
          media_type?: Database["public"]["Enums"]["media_type"]
          ratings_count?: number
          release_date?: string | null
          title?: string
          title_alt?: string[]
          title_original?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      media_genres: {
        Row: {
          genre_id: number
          media_id: number
        }
        Insert: {
          genre_id: number
          media_id: number
        }
        Update: {
          genre_id?: number
          media_id?: number
        }
        Relationships: [
          {
            foreignKeyName: "media_genres_genre_id_fkey"
            columns: ["genre_id"]
            isOneToOne: false
            referencedRelation: "genres"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "media_genres_media_id_fkey"
            columns: ["media_id"]
            isOneToOne: false
            referencedRelation: "media"
            referencedColumns: ["id"]
          },
        ]
      }
      music_details: {
        Row: {
          album: string | null
          artist: string
          artist_mbid: string | null
          media_id: number
          release_type: Database["public"]["Enums"]["release_type"] | null
          track_count: number | null
        }
        Insert: {
          album?: string | null
          artist: string
          artist_mbid?: string | null
          media_id: number
          release_type?: Database["public"]["Enums"]["release_type"] | null
          track_count?: number | null
        }
        Update: {
          album?: string | null
          artist?: string
          artist_mbid?: string | null
          media_id?: number
          release_type?: Database["public"]["Enums"]["release_type"] | null
          track_count?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "music_details_media_id_fkey"
            columns: ["media_id"]
            isOneToOne: true
            referencedRelation: "media"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          avatar_url: string | null
          bio: string | null
          created_at: string
          id: string
          steam_id: string | null
          updated_at: string
          username: string
        }
        Insert: {
          avatar_url?: string | null
          bio?: string | null
          created_at?: string
          id: string
          steam_id?: string | null
          updated_at?: string
          username: string
        }
        Update: {
          avatar_url?: string | null
          bio?: string | null
          created_at?: string
          id?: string
          steam_id?: string | null
          updated_at?: string
          username?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      search_media: {
        Args: { q: string; max_results?: number }
        Returns: Database["public"]["Tables"]["media"]["Row"][]
      }
    }
    Enums: {
      activity_type:
        | "rated"
        | "reviewed"
        | "completed"
        | "started"
        | "listed"
        | "followed"
      anime_format: "tv" | "movie" | "ova" | "ona" | "special"
      log_status:
        | "planning"
        | "in_progress"
        | "completed"
        | "dropped"
        | "paused"
      media_type: "anime" | "game" | "music"
      release_type: "single" | "album" | "ep"
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
    Enums: {
      activity_type: [
        "rated",
        "reviewed",
        "completed",
        "started",
        "listed",
        "followed",
      ],
      anime_format: ["tv", "movie", "ova", "ona", "special"],
      log_status: ["planning", "in_progress", "completed", "dropped", "paused"],
      media_type: ["anime", "game", "music"],
      release_type: ["single", "album", "ep"],
    },
  },
} as const
