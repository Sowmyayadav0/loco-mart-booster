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
    PostgrestVersion: "14.15"
  }
  public: {
    Tables: {
      addresses: {
        Row: {
          area: string | null
          city: string
          contact_name: string | null
          contact_phone: string | null
          created_at: string
          house: string | null
          id: string
          instructions: string | null
          is_default: boolean
          label: Database["public"]["Enums"]["address_label"]
          landmark: string | null
          latitude: number | null
          longitude: number | null
          pincode: string
          state: string
          street: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          area?: string | null
          city: string
          contact_name?: string | null
          contact_phone?: string | null
          created_at?: string
          house?: string | null
          id?: string
          instructions?: string | null
          is_default?: boolean
          label?: Database["public"]["Enums"]["address_label"]
          landmark?: string | null
          latitude?: number | null
          longitude?: number | null
          pincode: string
          state: string
          street?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          area?: string | null
          city?: string
          contact_name?: string | null
          contact_phone?: string | null
          created_at?: string
          house?: string | null
          id?: string
          instructions?: string | null
          is_default?: boolean
          label?: Database["public"]["Enums"]["address_label"]
          landmark?: string | null
          latitude?: number | null
          longitude?: number | null
          pincode?: string
          state?: string
          street?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      cart_items: {
        Row: {
          created_at: string
          id: string
          note: string | null
          product_id: string
          quantity: number
          saved_for_later: boolean
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          note?: string | null
          product_id: string
          quantity?: number
          saved_for_later?: boolean
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          note?: string | null
          product_id?: string
          quantity?: number
          saved_for_later?: boolean
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "cart_items_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      categories: {
        Row: {
          created_at: string
          icon: string | null
          id: string
          image_url: string | null
          is_service: boolean
          name: string
          slug: string
          sort_order: number
        }
        Insert: {
          created_at?: string
          icon?: string | null
          id?: string
          image_url?: string | null
          is_service?: boolean
          name: string
          slug: string
          sort_order?: number
        }
        Update: {
          created_at?: string
          icon?: string | null
          id?: string
          image_url?: string | null
          is_service?: boolean
          name?: string
          slug?: string
          sort_order?: number
        }
        Relationships: []
      }
      coupon_redemptions: {
        Row: {
          coupon_id: string
          created_at: string
          discount: number
          id: string
          order_id: string
          user_id: string
        }
        Insert: {
          coupon_id: string
          created_at?: string
          discount: number
          id?: string
          order_id: string
          user_id: string
        }
        Update: {
          coupon_id?: string
          created_at?: string
          discount?: number
          id?: string
          order_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "coupon_redemptions_coupon_id_fkey"
            columns: ["coupon_id"]
            isOneToOne: false
            referencedRelation: "coupons"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "coupon_redemptions_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
        ]
      }
      coupons: {
        Row: {
          category_id: string | null
          code: string
          created_at: string
          description: string | null
          expires_at: string | null
          id: string
          is_active: boolean
          max_discount: number | null
          min_order: number
          per_user_limit: number
          store_id: string | null
          title: string
          type: Database["public"]["Enums"]["coupon_type"]
          usage_limit: number | null
          used_count: number
          value: number
        }
        Insert: {
          category_id?: string | null
          code: string
          created_at?: string
          description?: string | null
          expires_at?: string | null
          id?: string
          is_active?: boolean
          max_discount?: number | null
          min_order?: number
          per_user_limit?: number
          store_id?: string | null
          title: string
          type: Database["public"]["Enums"]["coupon_type"]
          usage_limit?: number | null
          used_count?: number
          value: number
        }
        Update: {
          category_id?: string | null
          code?: string
          created_at?: string
          description?: string | null
          expires_at?: string | null
          id?: string
          is_active?: boolean
          max_discount?: number | null
          min_order?: number
          per_user_limit?: number
          store_id?: string | null
          title?: string
          type?: Database["public"]["Enums"]["coupon_type"]
          usage_limit?: number | null
          used_count?: number
          value?: number
        }
        Relationships: [
          {
            foreignKeyName: "coupons_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "categories"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "coupons_store_id_fkey"
            columns: ["store_id"]
            isOneToOne: false
            referencedRelation: "stores"
            referencedColumns: ["id"]
          },
        ]
      }
      favourite_stores: {
        Row: {
          created_at: string
          store_id: string
          user_id: string
        }
        Insert: {
          created_at?: string
          store_id: string
          user_id: string
        }
        Update: {
          created_at?: string
          store_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "favourite_stores_store_id_fkey"
            columns: ["store_id"]
            isOneToOne: false
            referencedRelation: "stores"
            referencedColumns: ["id"]
          },
        ]
      }
      notifications: {
        Row: {
          created_at: string
          id: string
          is_read: boolean
          message: string | null
          order_id: string | null
          title: string
          type: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          is_read?: boolean
          message?: string | null
          order_id?: string | null
          title: string
          type?: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          is_read?: boolean
          message?: string | null
          order_id?: string | null
          title?: string
          type?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "notifications_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
        ]
      }
      order_items: {
        Row: {
          id: string
          image_url: string | null
          name: string
          order_id: string
          price: number
          product_id: string | null
          quantity: number
          total: number
          unit: string | null
        }
        Insert: {
          id?: string
          image_url?: string | null
          name: string
          order_id: string
          price: number
          product_id?: string | null
          quantity: number
          total: number
          unit?: string | null
        }
        Update: {
          id?: string
          image_url?: string | null
          name?: string
          order_id?: string
          price?: number
          product_id?: string | null
          quantity?: number
          total?: number
          unit?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "order_items_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "order_items_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      order_status_history: {
        Row: {
          created_at: string
          id: string
          note: string | null
          order_id: string
          status: Database["public"]["Enums"]["order_status"]
        }
        Insert: {
          created_at?: string
          id?: string
          note?: string | null
          order_id: string
          status: Database["public"]["Enums"]["order_status"]
        }
        Update: {
          created_at?: string
          id?: string
          note?: string | null
          order_id?: string
          status?: Database["public"]["Enums"]["order_status"]
        }
        Relationships: [
          {
            foreignKeyName: "order_status_history_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
        ]
      }
      orders: {
        Row: {
          address: Json
          cancelled_reason: string | null
          code: string
          contact_phone: string | null
          coupon_code: string | null
          delivered_at: string | null
          delivery_fee: number
          discount: number
          eta_minutes: number | null
          id: string
          instructions: string | null
          payment_method: Database["public"]["Enums"]["payment_method"]
          payment_status: Database["public"]["Enums"]["payment_status"]
          placed_at: string
          platform_fee: number
          rider_name: string | null
          rider_phone: string | null
          rider_vehicle: string | null
          scheduled_for: string | null
          status: Database["public"]["Enums"]["order_status"]
          store_id: string
          subtotal: number
          tax: number
          tip: number
          total: number
          updated_at: string
          user_id: string
        }
        Insert: {
          address: Json
          cancelled_reason?: string | null
          code: string
          contact_phone?: string | null
          coupon_code?: string | null
          delivered_at?: string | null
          delivery_fee?: number
          discount?: number
          eta_minutes?: number | null
          id?: string
          instructions?: string | null
          payment_method: Database["public"]["Enums"]["payment_method"]
          payment_status?: Database["public"]["Enums"]["payment_status"]
          placed_at?: string
          platform_fee?: number
          rider_name?: string | null
          rider_phone?: string | null
          rider_vehicle?: string | null
          scheduled_for?: string | null
          status?: Database["public"]["Enums"]["order_status"]
          store_id: string
          subtotal: number
          tax?: number
          tip?: number
          total: number
          updated_at?: string
          user_id: string
        }
        Update: {
          address?: Json
          cancelled_reason?: string | null
          code?: string
          contact_phone?: string | null
          coupon_code?: string | null
          delivered_at?: string | null
          delivery_fee?: number
          discount?: number
          eta_minutes?: number | null
          id?: string
          instructions?: string | null
          payment_method?: Database["public"]["Enums"]["payment_method"]
          payment_status?: Database["public"]["Enums"]["payment_status"]
          placed_at?: string
          platform_fee?: number
          rider_name?: string | null
          rider_phone?: string | null
          rider_vehicle?: string | null
          scheduled_for?: string | null
          status?: Database["public"]["Enums"]["order_status"]
          store_id?: string
          subtotal?: number
          tax?: number
          tip?: number
          total?: number
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "orders_store_id_fkey"
            columns: ["store_id"]
            isOneToOne: false
            referencedRelation: "stores"
            referencedColumns: ["id"]
          },
        ]
      }
      products: {
        Row: {
          brand: string | null
          category_id: string | null
          created_at: string
          description: string | null
          id: string
          image_url: string | null
          is_available: boolean
          is_veg: boolean | null
          mrp: number
          name: string
          price: number
          rating: number
          sales: number
          stock: number
          store_id: string
          unit: string
          updated_at: string
        }
        Insert: {
          brand?: string | null
          category_id?: string | null
          created_at?: string
          description?: string | null
          id?: string
          image_url?: string | null
          is_available?: boolean
          is_veg?: boolean | null
          mrp: number
          name: string
          price: number
          rating?: number
          sales?: number
          stock?: number
          store_id: string
          unit?: string
          updated_at?: string
        }
        Update: {
          brand?: string | null
          category_id?: string | null
          created_at?: string
          description?: string | null
          id?: string
          image_url?: string | null
          is_available?: boolean
          is_veg?: boolean | null
          mrp?: number
          name?: string
          price?: number
          rating?: number
          sales?: number
          stock?: number
          store_id?: string
          unit?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "products_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "categories"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "products_store_id_fkey"
            columns: ["store_id"]
            isOneToOne: false
            referencedRelation: "stores"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string
          email: string | null
          full_name: string | null
          id: string
          language: string
          phone: string | null
          referral_code: string | null
          referred_by: string | null
          updated_at: string
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string
          email?: string | null
          full_name?: string | null
          id: string
          language?: string
          phone?: string | null
          referral_code?: string | null
          referred_by?: string | null
          updated_at?: string
        }
        Update: {
          avatar_url?: string | null
          created_at?: string
          email?: string | null
          full_name?: string | null
          id?: string
          language?: string
          phone?: string | null
          referral_code?: string | null
          referred_by?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      reviews: {
        Row: {
          comment: string | null
          created_at: string
          id: string
          order_id: string | null
          photos: string[]
          product_id: string | null
          rating: number
          store_id: string | null
          user_id: string
        }
        Insert: {
          comment?: string | null
          created_at?: string
          id?: string
          order_id?: string | null
          photos?: string[]
          product_id?: string | null
          rating: number
          store_id?: string | null
          user_id: string
        }
        Update: {
          comment?: string | null
          created_at?: string
          id?: string
          order_id?: string | null
          photos?: string[]
          product_id?: string | null
          rating?: number
          store_id?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "reviews_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "reviews_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "reviews_store_id_fkey"
            columns: ["store_id"]
            isOneToOne: false
            referencedRelation: "stores"
            referencedColumns: ["id"]
          },
        ]
      }
      search_history: {
        Row: {
          created_at: string
          id: string
          term: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          term: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          term?: string
          user_id?: string
        }
        Relationships: []
      }
      stores: {
        Row: {
          address_line: string | null
          area: string | null
          banner_url: string | null
          category_id: string | null
          city: string
          created_at: string
          delivery_fee: number
          delivery_minutes: number
          description: string | null
          id: string
          is_active: boolean
          is_open: boolean
          latitude: number | null
          logo_url: string | null
          longitude: number | null
          min_order: number
          name: string
          pincode: string | null
          rating: number
          rating_count: number
          slug: string
          state: string
          tags: string[]
          updated_at: string
        }
        Insert: {
          address_line?: string | null
          area?: string | null
          banner_url?: string | null
          category_id?: string | null
          city: string
          created_at?: string
          delivery_fee?: number
          delivery_minutes?: number
          description?: string | null
          id?: string
          is_active?: boolean
          is_open?: boolean
          latitude?: number | null
          logo_url?: string | null
          longitude?: number | null
          min_order?: number
          name: string
          pincode?: string | null
          rating?: number
          rating_count?: number
          slug: string
          state?: string
          tags?: string[]
          updated_at?: string
        }
        Update: {
          address_line?: string | null
          area?: string | null
          banner_url?: string | null
          category_id?: string | null
          city?: string
          created_at?: string
          delivery_fee?: number
          delivery_minutes?: number
          description?: string | null
          id?: string
          is_active?: boolean
          is_open?: boolean
          latitude?: number | null
          logo_url?: string | null
          longitude?: number | null
          min_order?: number
          name?: string
          pincode?: string | null
          rating?: number
          rating_count?: number
          slug?: string
          state?: string
          tags?: string[]
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "stores_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "categories"
            referencedColumns: ["id"]
          },
        ]
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
          role: Database["public"]["Enums"]["app_role"]
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
      wallet_transactions: {
        Row: {
          amount: number
          balance_after: number
          created_at: string
          id: string
          label: string
          order_id: string | null
          type: Database["public"]["Enums"]["wallet_txn_type"]
          user_id: string
        }
        Insert: {
          amount: number
          balance_after: number
          created_at?: string
          id?: string
          label: string
          order_id?: string | null
          type: Database["public"]["Enums"]["wallet_txn_type"]
          user_id: string
        }
        Update: {
          amount?: number
          balance_after?: number
          created_at?: string
          id?: string
          label?: string
          order_id?: string | null
          type?: Database["public"]["Enums"]["wallet_txn_type"]
          user_id?: string
        }
        Relationships: []
      }
      wallets: {
        Row: {
          balance: number
          updated_at: string
          user_id: string
        }
        Insert: {
          balance?: number
          updated_at?: string
          user_id: string
        }
        Update: {
          balance?: number
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
      advance_order: {
        Args: { _order_id: string }
        Returns: Database["public"]["Enums"]["order_status"]
      }
      cancel_order: {
        Args: { _order_id: string; _reason?: string }
        Returns: undefined
      }
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
      place_order: {
        Args: {
          _address_id: string
          _coupon_code?: string
          _instructions?: string
          _payment_method: Database["public"]["Enums"]["payment_method"]
          _scheduled_for?: string
          _tip?: number
        }
        Returns: string
      }
      quote_coupon: {
        Args: {
          _code: string
          _store_id: string
          _subtotal: number
          _user_id: string
        }
        Returns: {
          coupon_id: string
          discount: number
          message: string
        }[]
      }
      wallet_topup: { Args: { _amount: number }; Returns: number }
    }
    Enums: {
      address_label: "HOME" | "WORK" | "OTHER"
      app_role:
        | "customer"
        | "merchant"
        | "delivery_partner"
        | "admin"
        | "support"
      coupon_type: "PERCENT" | "FIXED"
      order_status:
        | "PLACED"
        | "ACCEPTED"
        | "PREPARING"
        | "READY"
        | "PICKED_UP"
        | "ON_THE_WAY"
        | "DELIVERED"
        | "CANCELLED"
        | "REFUNDED"
      payment_method: "UPI" | "CARD" | "NETBANKING" | "WALLET" | "COD"
      payment_status: "PENDING" | "PAID" | "FAILED" | "REFUNDED"
      wallet_txn_type:
        | "CREDIT"
        | "DEBIT"
        | "CASHBACK"
        | "REFUND"
        | "REFERRAL"
        | "REWARD"
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
      address_label: ["HOME", "WORK", "OTHER"],
      app_role: [
        "customer",
        "merchant",
        "delivery_partner",
        "admin",
        "support",
      ],
      coupon_type: ["PERCENT", "FIXED"],
      order_status: [
        "PLACED",
        "ACCEPTED",
        "PREPARING",
        "READY",
        "PICKED_UP",
        "ON_THE_WAY",
        "DELIVERED",
        "CANCELLED",
        "REFUNDED",
      ],
      payment_method: ["UPI", "CARD", "NETBANKING", "WALLET", "COD"],
      payment_status: ["PENDING", "PAID", "FAILED", "REFUNDED"],
      wallet_txn_type: [
        "CREDIT",
        "DEBIT",
        "CASHBACK",
        "REFUND",
        "REFERRAL",
        "REWARD",
      ],
    },
  },
} as const
