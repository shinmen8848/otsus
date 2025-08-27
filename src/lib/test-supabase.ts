import { supabase } from './supabase';

// Test function to verify Supabase connection
export async function testSupabaseConnection() {
  try {
    console.log('Testing Supabase connection...');
    
    // Test 1: Check if we can connect to Supabase
    const { data: healthCheck, error: healthError } = await supabase
      .from('profiles')
      .select('count')
      .limit(1);
    
    if (healthError) {
      console.error('Health check failed:', healthError);
      return false;
    }
    
    console.log('✅ Supabase connection successful!');
    
    // Test 2: Try to fetch profiles
    const { data: profiles, error: profilesError } = await supabase
      .from('profiles')
      .select('*');
    
    if (profilesError) {
      console.error('Error fetching profiles:', profilesError);
      return false;
    }
    
    console.log('✅ Profiles fetched successfully:', profiles);
    
    // Test 3: Check if initial data exists
    if (profiles && profiles.length > 0) {
      console.log('✅ Found profiles:', profiles.map(p => p.name));
    } else {
      console.log('ℹ️ No profiles found - you may need to run the schema.sql first');
    }
    
    return true;
  } catch (error) {
    console.error('❌ Supabase connection test failed:', error);
    return false;
  }
}

// Export for use in development
if (import.meta.env.DEV) {
  // @ts-expect-error - Adding test function to window for development debugging
  window.testSupabaseConnection = testSupabaseConnection;
}