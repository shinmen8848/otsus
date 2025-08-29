import { createClient, SupabaseClient } from '@supabase/supabase-js';

// Supabase configuration using environment variables
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

// Check if the environment variables are properly configured
const isSupabaseConfigured =
  supabaseUrl &&
  supabaseAnonKey &&
  supabaseUrl !== 'YOUR_SUPABASE_URL' &&
  supabaseAnonKey !== 'YOUR_SUPABASE_ANON_KEY' &&
  supabaseUrl.startsWith('http');

// Create a mock client for development when Supabase is not configured
let supabase: SupabaseClient;

if (isSupabaseConfigured) {
  try {
    supabase = createClient(supabaseUrl, supabaseAnonKey);
  } catch (error) {
    console.error('Failed to initialize Supabase client:', error);
    console.warn('Using mock Supabase client. Database operations will not work.');
    // Create a mock client with dummy URL for development
    supabase = createClient('https://placeholder.supabase.co', 'placeholder-key');
  }
} else {
  console.warn('Supabase environment variables not configured properly.');
  console.warn('Please set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in your .env file.');
  console.warn('Using mock Supabase client. Database operations will not work.');
  // Create a mock client with dummy URL for development
  supabase = createClient('https://placeholder.supabase.co', 'placeholder-key');
}

export { supabase, isSupabaseConfigured };

// Database types
export interface Profile {
  id: string;
  name: string;
  birthday: string;
  zodiac: string;
  personality: string;
  hobbies: string[];
  favorite_anime: string[];
  dreams: string;
  quote: string;
  avatar_url?: string;
  created_at: string;
  updated_at: string;
}

export interface Memory {
  id: string;
  title: string;
  description: string;
  date: string;
  location: string;
  category: 'dates' | 'travel' | 'milestones' | 'everyday';
  photos: string[];
  mood: string;
  tags: string[];
  created_at: string;
  updated_at: string;
}

export interface Timeline {
  id: string;
  title: string;
  description: string;
  date: string;
  category: 'meeting' | 'first_date' | 'milestone' | 'anniversary' | 'special';
  photos: string[];
  memories: string[];
  created_at: string;
}

export interface AnimeEntry {
  id: string;
  title: string;
  status: 'watching' | 'completed' | 'plan_to_watch' | 'dropped' | 'on_hold';
  rating?: number;
  episodes_watched: number;
  total_episodes?: number;
  review?: string;
  favorite_moments: string[];
  created_at: string;
  updated_at: string;
}

export interface DramaEntry {
  id: string;
  title: string;
  type: 'k_drama' | 'j_drama' | 'c_drama' | 'western' | 'movie';
  status: 'watching' | 'completed' | 'plan_to_watch' | 'dropped' | 'on_hold';
  rating?: number;
  episodes_watched: number;
  total_episodes?: number;
  review?: string;
  memorable_scenes: string[];
  created_at: string;
  updated_at: string;
}

export interface FuturePlan {
  id: string;
  title: string;
  description: string;
  category: 'travel' | 'life_goals' | 'relationship' | 'career' | 'experiences';
  priority: 'low' | 'medium' | 'high';
  target_date?: string;
  progress: number;
  steps: string[];
  completed: boolean;
  created_at: string;
  updated_at: string;
}

export interface Note {
  id: string;
  title: string;
  content: string;
  type: 'journal' | 'love_letter' | 'dream' | 'gratitude' | 'memory';
  mood?: string;
  tags: string[];
  attachments: string[];
  scheduled_delivery?: string;
  created_at: string;
  updated_at: string;
}

export interface RelationshipData {
  id: string;
  start_date: string;
  milestones: {
    date: string;
    title: string;
    description: string;
    celebrated: boolean;
  }[];
  anniversary_dates: string[];
  custom_celebrations: {
    name: string;
    date: string;
    description: string;
  }[];
  created_at: string;
  updated_at: string;
}