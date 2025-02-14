import { createClient } from '@supabase/supabase-js'

// Supabaseクライアントをシングルトンとして作成
export const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY
)

export type Session = {
  id: number
  created_at: string
  updated_at: string
  user_id: string
  is_public: boolean
}

export type Message = {
  id: number
  created_at: string
  session_id: number
  role: 'user' | 'assistant'
  content: string
}

export type Summary = {
  id: number
  public_message: any
  created_at: string
  public_chat_session_count: number
  public_message_count: number
  repeat_count: number
  target_date: string
  version: number
  podcast: string
  podcast_url: string
}
