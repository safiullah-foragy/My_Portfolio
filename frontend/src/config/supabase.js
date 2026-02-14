import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.REACT_APP_SUPABASE_URL;
const supabaseAnonKey = process.env.REACT_APP_SUPABASE_ANON_KEY;

// Check if Supabase credentials are configured
const isSupabaseConfigured = supabaseUrl && supabaseAnonKey && 
  supabaseUrl.startsWith('http') && supabaseUrl.length > 20;

export const supabase = isSupabaseConfigured 
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;

// Initialize storage bucket (same bucket used for profile images)
export const STORAGE_BUCKET = process.env.REACT_APP_SUPABASE_BUCKET || 'profile_image';

// Helper to upload file to Supabase storage
export const uploadFile = async (file, userId) => {
  if (!supabase) {
    throw new Error('Supabase not configured');
  }
  
  const fileExt = file.name.split('.').pop();
  const fileName = `messages/${userId}/${Date.now()}.${fileExt}`;
  
  const { data, error } = await supabase.storage
    .from(STORAGE_BUCKET)
    .upload(fileName, file);

  if (error) {
    throw error;
  }

  // Get public URL
  const { data: { publicUrl } } = supabase.storage
    .from(STORAGE_BUCKET)
    .getPublicUrl(fileName);

  return publicUrl;
};
