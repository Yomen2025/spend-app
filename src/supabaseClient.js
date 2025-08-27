import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://wehnjgfvvnuifalxefyc.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndlaG5qZ2Z2dm51aWZhbHhlZnljIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTYxNjkzOTYsImV4cCI6MjA3MTc0NTM5Nn0.lqoTXX4_vsMt2uqU571UDqkusDwvgwj7d1iainI8jv4'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
