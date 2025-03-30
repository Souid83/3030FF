export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      products: {
        Row: {
          id: string
          name: string
          sku: string
          purchase_price: number
          retail_price: number
          pro_price: number
          weight_grams: number
          storage_location: string | null
          ean: string | null
          stock: number
          stock_alert: number | null
          description: string | null
          created_at: string
          updated_at: string
          images: string[]
          width_cm: number | null
          height_cm: number | null
          depth_cm: number | null
          shipping_box_id: string | null
          variants: Json | null
          category_id: string | null
        }
        Insert: {
          id?: string
          name: string
          sku: string
          purchase_price: number
          retail_price: number
          pro_price: number
          weight_grams: number
          storage_location?: string | null
          ean?: string | null
          stock?: number
          stock_alert?: number | null
          description?: string | null
          created_at?: string
          updated_at?: string
          images?: string[]
          width_cm?: number | null
          height_cm?: number | null
          depth_cm?: number | null
          shipping_box_id?: string | null
          variants?: Json | null
          category_id?: string | null
        }
        Update: {
          id?: string
          name?: string
          sku?: string
          purchase_price?: number
          retail_price?: number
          pro_price?: number
          weight_grams?: number
          storage_location?: string | null
          ean?: string | null
          stock?: number
          stock_alert?: number | null
          description?: string | null
          created_at?: string
          updated_at?: string
          images?: string[]
          width_cm?: number | null
          height_cm?: number | null
          depth_cm?: number | null
          shipping_box_id?: string | null
          variants?: Json | null
          category_id?: string | null
        }
      }
      product_categories: {
        Row: {
          id: string
          type: string
          brand: string
          model: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          type: string
          brand: string
          model: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          type?: string
          brand?: string
          model?: string
          created_at?: string
          updated_at?: string
        }
      }
      product_variants: {
        Row: {
          id: string
          color: string
          grade: string
          capacity: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          color: string
          grade: string
          capacity: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          color?: string
          grade?: string
          capacity?: string
          created_at?: string
          updated_at?: string
        }
      }
      stock_locations: {
        Row: {
          id: string
          name: string
          description: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          description?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          description?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      shipping_boxes: {
        Row: {
          id: string
          name: string
          width_cm: number
          height_cm: number
          depth_cm: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          width_cm: number
          height_cm: number
          depth_cm: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          width_cm?: number
          height_cm?: number
          depth_cm?: number
          created_at?: string
          updated_at?: string
        }
      }
      sales_metrics: {
        Row: {
          id: number
          product_name: string
          sales_count: number
          revenue: number
          estimated_profit: number
          period: string
          metric_type: string
          target: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: number
          product_name: string
          sales_count: number
          revenue: number
          estimated_profit: number
          period: string
          metric_type: string
          target: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: number
          product_name?: string
          sales_count?: number
          revenue?: number
          estimated_profit?: number
          period?: string
          metric_type?: string
          target?: number
          created_at?: string
          updated_at?: string
        }
      }
      product_stats: {
        Row: {
          id: string
          total_orders: number
          synced_products: number
          created_at: string
          updated_at: string
        }
      }
    }
  }
}