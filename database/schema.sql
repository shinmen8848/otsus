-- Supabase Database Schema for Tomoe Nanami Romantic Website
-- Run these SQL commands in your Supabase SQL editor

-- Enable Row Level Security
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON TABLES TO postgres, anon, authenticated, service_role;

-- Create profiles table for Tomoe and Nanami
CREATE TABLE IF NOT EXISTS profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(100) NOT NULL,
  birthday DATE NOT NULL,
  zodiac VARCHAR(20),
  personality TEXT,
  bio TEXT,
  hobbies TEXT[], -- Array of hobbies
  favorite_anime TEXT[], -- Array of favorite anime
  achievements TEXT[], -- Array of achievements
  dreams TEXT,
  quote TEXT,
  avatar_url TEXT,
  favorite_food TEXT,
  pet_peeve TEXT,
  perfect_date TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create relationship_data table
CREATE TABLE IF NOT EXISTS relationship_data (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  start_date DATE NOT NULL,
  milestones JSONB DEFAULT '[]', -- JSON array of milestone objects
  anniversary_dates DATE[],
  custom_celebrations JSONB DEFAULT '[]',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create memories table
CREATE TABLE IF NOT EXISTS memories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title VARCHAR(200) NOT NULL,
  description TEXT,
  date DATE NOT NULL,
  location VARCHAR(200),
  category VARCHAR(50) CHECK (category IN ('dates', 'travel', 'milestones', 'everyday')),
  photos TEXT[], -- Array of photo URLs
  mood VARCHAR(100),
  tags TEXT[],
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create timeline table
CREATE TABLE IF NOT EXISTS timeline (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title VARCHAR(200) NOT NULL,
  description TEXT,
  date DATE NOT NULL,
  category VARCHAR(50) CHECK (category IN ('meeting', 'first_date', 'milestone', 'anniversary', 'special')),
  photos TEXT[],
  memories TEXT[], -- References to memory IDs
  significance INTEGER CHECK (significance >= 1 AND significance <= 5),
  mood VARCHAR(100),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create anime_entries table
CREATE TABLE IF NOT EXISTS anime_entries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title VARCHAR(200) NOT NULL,
  status VARCHAR(20) CHECK (status IN ('watching', 'completed', 'plan_to_watch', 'dropped', 'on_hold')),
  rating INTEGER CHECK (rating >= 1 AND rating <= 10),
  episodes_watched INTEGER DEFAULT 0,
  total_episodes INTEGER,
  review TEXT,
  favorite_moments TEXT[],
  tomoe_rating INTEGER CHECK (tomoe_rating >= 1 AND tomoe_rating <= 10),
  nanami_rating INTEGER CHECK (nanami_rating >= 1 AND nanami_rating <= 10),
  joint_review TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create drama_entries table
CREATE TABLE IF NOT EXISTS drama_entries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title VARCHAR(200) NOT NULL,
  type VARCHAR(20) CHECK (type IN ('k_drama', 'j_drama', 'c_drama', 'western', 'movie')),
  status VARCHAR(20) CHECK (status IN ('watching', 'completed', 'plan_to_watch', 'dropped', 'on_hold')),
  rating INTEGER CHECK (rating >= 1 AND rating <= 10),
  episodes_watched INTEGER DEFAULT 0,
  total_episodes INTEGER,
  review TEXT,
  memorable_scenes TEXT[],
  tomoe_rating INTEGER CHECK (tomoe_rating >= 1 AND tomoe_rating <= 10),
  nanami_rating INTEGER CHECK (nanami_rating >= 1 AND nanami_rating <= 10),
  joint_review TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create future_plans table
CREATE TABLE IF NOT EXISTS future_plans (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title VARCHAR(200) NOT NULL,
  description TEXT,
  category VARCHAR(50) CHECK (category IN ('travel', 'life_goals', 'relationship', 'career', 'experiences')),
  priority VARCHAR(10) CHECK (priority IN ('low', 'medium', 'high')),
  target_date DATE,
  progress INTEGER DEFAULT 0 CHECK (progress >= 0 AND progress <= 100),
  steps TEXT[],
  completed BOOLEAN DEFAULT FALSE,
  tags TEXT[],
  inspiration TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create notes table
CREATE TABLE IF NOT EXISTS notes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title VARCHAR(200) NOT NULL,
  content TEXT,
  type VARCHAR(20) CHECK (type IN ('journal', 'love_letter', 'dream', 'gratitude', 'memory')),
  mood VARCHAR(100),
  tags TEXT[],
  attachments TEXT[], -- URLs to attached files
  scheduled_delivery TIMESTAMP WITH TIME ZONE,
  is_shared BOOLEAN DEFAULT FALSE,
  author VARCHAR(10) CHECK (author IN ('tomoe', 'nanami', 'both')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create photo_albums table
CREATE TABLE IF NOT EXISTS photo_albums (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title VARCHAR(200) NOT NULL,
  description TEXT,
  cover_photo_url TEXT,
  category VARCHAR(50),
  privacy_level VARCHAR(20) CHECK (privacy_level IN ('private', 'shared', 'public')) DEFAULT 'private',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create photos table
CREATE TABLE IF NOT EXISTS photos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  album_id UUID REFERENCES photo_albums(id) ON DELETE CASCADE,
  filename VARCHAR(255) NOT NULL,
  url TEXT NOT NULL,
  caption TEXT,
  date_taken DATE,
  location VARCHAR(200),
  tags TEXT[],
  ai_tags TEXT[], -- AI-generated tags
  mood VARCHAR(100),
  likes INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create interactive_activities table
CREATE TABLE IF NOT EXISTS interactive_activities (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  type VARCHAR(50) CHECK (type IN ('quiz', 'game', 'challenge', 'date_idea')),
  title VARCHAR(200) NOT NULL,
  description TEXT,
  content JSONB, -- Quiz questions, game rules, etc.
  completed_by TEXT[] DEFAULT '{}',
  scores JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create anniversary_events table
CREATE TABLE IF NOT EXISTS anniversary_events (
   id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
   title VARCHAR(200) NOT NULL,
   date DATE NOT NULL,
   description TEXT,
   type VARCHAR(50) CHECK (type IN ('monthly', 'yearly', 'custom', 'milestone')),
   celebration_ideas TEXT[],
   photos TEXT[],
   memories_created TEXT[], -- References to memory IDs
   planned BOOLEAN DEFAULT FALSE,
   celebrated BOOLEAN DEFAULT FALSE,
   created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create AI conversation tables for enhanced chat functionality

-- AI Conversations table
CREATE TABLE IF NOT EXISTS ai_conversations (
   id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
   user_id UUID REFERENCES profiles(id),
   session_id TEXT UNIQUE NOT NULL,
   title TEXT,
   created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
   updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
   is_active BOOLEAN DEFAULT TRUE
);

-- AI Messages table
CREATE TABLE IF NOT EXISTS ai_messages (
   id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
   conversation_id UUID REFERENCES ai_conversations(id) ON DELETE CASCADE,
   role TEXT CHECK (role IN ('user', 'assistant', 'system')),
   content TEXT NOT NULL,
   message_type TEXT CHECK (message_type IN ('text', 'image', 'system')) DEFAULT 'text',
   metadata JSONB,
   created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- AI Context Memory table
CREATE TABLE IF NOT EXISTS ai_context_memory (
   id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
   user_id UUID REFERENCES profiles(id),
   context_type TEXT NOT NULL,
   context_key TEXT NOT NULL,
   context_value JSONB,
   importance_score DECIMAL(3,2) DEFAULT 0.5,
   last_accessed TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
   created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_ai_conversations_user_id ON ai_conversations(user_id);
CREATE INDEX IF NOT EXISTS idx_ai_conversations_session_id ON ai_conversations(session_id);
CREATE INDEX IF NOT EXISTS idx_ai_messages_conversation_id ON ai_messages(conversation_id);
CREATE INDEX IF NOT EXISTS idx_ai_context_memory_user_id ON ai_context_memory(user_id);
CREATE INDEX IF NOT EXISTS idx_ai_context_memory_key ON ai_context_memory(context_key);

-- Insert initial data for Tomoe and Nanami
INSERT INTO profiles (name, birthday, zodiac, personality, bio, hobbies, favorite_anime, achievements, dreams, quote, favorite_food, pet_peeve, perfect_date) VALUES 
('Tomoe', '2000-03-15', 'Pisces ♓', 'Gentle, creative, and deeply romantic', 'A gentle soul with an artistic heart, Tomoe finds beauty in the smallest moments and has an incredible gift for photography that captures the essence of our love.', ARRAY['Photography', 'Anime', 'Cooking', 'Stargazing', 'Watercolor Painting'], ARRAY['Your Name', 'Spirited Away', 'Weathering with You', 'A Silent Voice', 'Garden of Words'], ARRAY['Published photographer', 'Graduated with honors', 'Speaks 3 languages'], 'To travel the world and capture beautiful memories together, documenting our love story through photography', '"In your eyes, I found my home"', 'Homemade ramen and cherry blossom mochi', 'Messy photo albums', 'Sunset photography session followed by stargazing'),
('Nanami', '2001-08-22', 'Leo ♌', 'Warm, passionate, and adventurous', 'A vibrant spirit full of creativity and warmth, Nanami brings joy and laughter to every moment and has an amazing talent for turning ordinary days into magical adventures.', ARRAY['Digital Art', 'Music Production', 'Gaming', 'Dancing', 'Anime Sketching'], ARRAY['Attack on Titan', 'Demon Slayer', 'My Hero Academia', 'Jujutsu Kaisen', 'Hunter x Hunter'], ARRAY['Digital art featured in galleries', 'Music producer', 'Gaming tournament winner'], 'To create art that tells our love story and maybe start our own animation studio together', '"With you, every day feels like a new adventure"', 'Spicy curry and matcha ice cream', 'Unfinished artwork', 'Art museum followed by a cozy gaming night');

-- Insert initial relationship data
INSERT INTO relationship_data (start_date, anniversary_dates) VALUES 
('2023-02-14', ARRAY['2023-02-14']);

-- Create updated_at triggers
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply triggers to tables with updated_at
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON profiles FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_relationship_data_updated_at BEFORE UPDATE ON relationship_data FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_memories_updated_at BEFORE UPDATE ON memories FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_anime_entries_updated_at BEFORE UPDATE ON anime_entries FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_drama_entries_updated_at BEFORE UPDATE ON drama_entries FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_future_plans_updated_at BEFORE UPDATE ON future_plans FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_notes_updated_at BEFORE UPDATE ON notes FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_photo_albums_updated_at BEFORE UPDATE ON photo_albums FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_ai_conversations_updated_at BEFORE UPDATE ON ai_conversations FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Enable Row Level Security (RLS) for all tables
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE relationship_data ENABLE ROW LEVEL SECURITY;
ALTER TABLE memories ENABLE ROW LEVEL SECURITY;
ALTER TABLE timeline ENABLE ROW LEVEL SECURITY;
ALTER TABLE anime_entries ENABLE ROW LEVEL SECURITY;
ALTER TABLE drama_entries ENABLE ROW LEVEL SECURITY;
ALTER TABLE future_plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE notes ENABLE ROW LEVEL SECURITY;
ALTER TABLE photo_albums ENABLE ROW LEVEL SECURITY;
ALTER TABLE photos ENABLE ROW LEVEL SECURITY;
ALTER TABLE interactive_activities ENABLE ROW LEVEL SECURITY;
ALTER TABLE anniversary_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE ai_conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE ai_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE ai_context_memory ENABLE ROW LEVEL SECURITY;

-- Create RLS policies (allow all operations for now - can be restricted later)
CREATE POLICY "Allow all operations" ON profiles FOR ALL USING (true);
CREATE POLICY "Allow all operations" ON relationship_data FOR ALL USING (true);
CREATE POLICY "Allow all operations" ON memories FOR ALL USING (true);
CREATE POLICY "Allow all operations" ON timeline FOR ALL USING (true);
CREATE POLICY "Allow all operations" ON anime_entries FOR ALL USING (true);
CREATE POLICY "Allow all operations" ON drama_entries FOR ALL USING (true);
CREATE POLICY "Allow all operations" ON future_plans FOR ALL USING (true);
CREATE POLICY "Allow all operations" ON notes FOR ALL USING (true);
CREATE POLICY "Allow all operations" ON photo_albums FOR ALL USING (true);
CREATE POLICY "Allow all operations" ON photos FOR ALL USING (true);
CREATE POLICY "Allow all operations" ON interactive_activities FOR ALL USING (true);
CREATE POLICY "Allow all operations" ON anniversary_events FOR ALL USING (true);
CREATE POLICY "Allow all operations" ON ai_conversations FOR ALL USING (true);
CREATE POLICY "Allow all operations" ON ai_messages FOR ALL USING (true);
CREATE POLICY "Allow all operations" ON ai_context_memory FOR ALL USING (true);