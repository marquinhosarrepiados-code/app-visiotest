import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Database types
export type Database = {
  public: {
    Tables: {
      users: {
        Row: {
          id: string
          name: string
          age: number
          gender: 'male' | 'female' | 'other'
          phone: string
          uses_glasses: boolean
          lens_type: string | null
          visual_difficulties: string[]
          health_history: string
          created_at: string
        }
        Insert: {
          id?: string
          name: string
          age: number
          gender: 'male' | 'female' | 'other'
          phone: string
          uses_glasses: boolean
          lens_type?: string | null
          visual_difficulties: string[]
          health_history: string
          created_at?: string
        }
        Update: {
          id?: string
          name?: string
          age?: number
          gender?: 'male' | 'female' | 'other'
          phone?: string
          uses_glasses?: boolean
          lens_type?: string | null
          visual_difficulties?: string[]
          health_history?: string
          created_at?: string
        }
      }
      test_results: {
        Row: {
          id: string
          user_id: string
          test_type: 'acuity' | 'contrast' | 'color'
          score: number
          level: number
          responses: any
          completed_at: string
        }
        Insert: {
          id?: string
          user_id: string
          test_type: 'acuity' | 'contrast' | 'color'
          score: number
          level: number
          responses: any
          completed_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          test_type?: 'acuity' | 'contrast' | 'color'
          score?: number
          level?: number
          responses?: any
          completed_at?: string
        }
      }
      payments: {
        Row: {
          id: string
          user_id: string
          amount: number
          status: 'pending' | 'completed' | 'failed'
          payment_method: string
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          amount: number
          status?: 'pending' | 'completed' | 'failed'
          payment_method: string
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          amount?: number
          status?: 'pending' | 'completed' | 'failed'
          payment_method?: string
          created_at?: string
        }
      }
    }
  }
}