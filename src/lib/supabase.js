import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL = 'https://azgfgeandoenpuiiavhb.supabase.co'
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImF6Z2ZnZWFuZG9lbnB1aWlhdmhiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODc5OTEyNDQsImV4cCI6MjEwMzU2NzI0NH0.IyYtEeX2f-AqjEMCjB70XAzuHWS0IwA2QQo-N-XKF4g'

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY)
