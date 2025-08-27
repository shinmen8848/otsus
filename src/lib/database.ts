import { supabase } from './supabase';
import type { 
  Profile, 
  Memory, 
  Timeline, 
  AnimeEntry, 
  DramaEntry, 
  FuturePlan, 
  Note,
  RelationshipData 
} from './supabase';

// Profile Services
export const profileService = {
  async getProfiles() {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .order('name');
    
    if (error) throw error;
    return data as Profile[];
  },

  async getProfileByName(name: string) {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('name', name)
      .single();
    
    if (error) throw error;
    return data as Profile;
  },

  async updateProfile(id: string, updates: Partial<Profile>) {
    const { data, error } = await supabase
      .from('profiles')
      .update(updates)
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    return data as Profile;
  }
};

// Relationship Services
export const relationshipService = {
  async getRelationshipData() {
    const { data, error } = await supabase
      .from('relationship_data')
      .select('*')
      .single();
    
    if (error) throw error;
    return data as RelationshipData;
  },

  async updateRelationshipData(updates: Partial<RelationshipData>) {
    const { data, error } = await supabase
      .from('relationship_data')
      .update(updates)
      .select()
      .single();
    
    if (error) throw error;
    return data as RelationshipData;
  },

  async addMilestone(milestone: { date: string; title: string; description: string; celebrated: boolean }) {
    const relationshipData = await this.getRelationshipData();
    const milestones = relationshipData.milestones || [];
    milestones.push(milestone);
    
    return await this.updateRelationshipData({ milestones });
  }
};

// Memory Services
export const memoryService = {
  async getMemories(category?: string) {
    let query = supabase
      .from('memories')
      .select('*')
      .order('date', { ascending: false });
    
    if (category && category !== 'all') {
      query = query.eq('category', category);
    }
    
    const { data, error } = await query;
    if (error) throw error;
    return data as Memory[];
  },

  async createMemory(memory: Omit<Memory, 'id' | 'created_at' | 'updated_at'>) {
    const { data, error } = await supabase
      .from('memories')
      .insert(memory)
      .select()
      .single();
    
    if (error) throw error;
    return data as Memory;
  },

  async updateMemory(id: string, updates: Partial<Memory>) {
    const { data, error } = await supabase
      .from('memories')
      .update(updates)
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    return data as Memory;
  },

  async deleteMemory(id: string) {
    const { error } = await supabase
      .from('memories')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
  }
};

// Timeline Services
export const timelineService = {
  async getTimelineEvents(category?: string) {
    let query = supabase
      .from('timeline')
      .select('*')
      .order('date', { ascending: true });
    
    if (category && category !== 'all') {
      query = query.eq('category', category);
    }
    
    const { data, error } = await query;
    if (error) throw error;
    return data as Timeline[];
  },

  async createTimelineEvent(event: Omit<Timeline, 'id' | 'created_at'>) {
    const { data, error } = await supabase
      .from('timeline')
      .insert(event)
      .select()
      .single();
    
    if (error) throw error;
    return data as Timeline;
  },

  async updateTimelineEvent(id: string, updates: Partial<Timeline>) {
    const { data, error } = await supabase
      .from('timeline')
      .update(updates)
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    return data as Timeline;
  }
};

// Anime Services
export const animeService = {
  async getAnimeEntries(status?: string) {
    let query = supabase
      .from('anime_entries')
      .select('*')
      .order('updated_at', { ascending: false });
    
    if (status && status !== 'all') {
      query = query.eq('status', status);
    }
    
    const { data, error } = await query;
    if (error) throw error;
    return data as AnimeEntry[];
  },

  async createAnimeEntry(entry: Omit<AnimeEntry, 'id' | 'created_at' | 'updated_at'>) {
    const { data, error } = await supabase
      .from('anime_entries')
      .insert(entry)
      .select()
      .single();
    
    if (error) throw error;
    return data as AnimeEntry;
  },

  async updateAnimeEntry(id: string, updates: Partial<AnimeEntry>) {
    const { data, error } = await supabase
      .from('anime_entries')
      .update(updates)
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    return data as AnimeEntry;
  },

  async deleteAnimeEntry(id: string) {
    const { error } = await supabase
      .from('anime_entries')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
  }
};

// Drama Services
export const dramaService = {
  async getDramaEntries(status?: string, type?: string) {
    let query = supabase
      .from('drama_entries')
      .select('*')
      .order('updated_at', { ascending: false });
    
    if (status && status !== 'all') {
      query = query.eq('status', status);
    }
    
    if (type && type !== 'all') {
      query = query.eq('type', type);
    }
    
    const { data, error } = await query;
    if (error) throw error;
    return data as DramaEntry[];
  },

  async createDramaEntry(entry: Omit<DramaEntry, 'id' | 'created_at' | 'updated_at'>) {
    const { data, error } = await supabase
      .from('drama_entries')
      .insert(entry)
      .select()
      .single();
    
    if (error) throw error;
    return data as DramaEntry;
  },

  async updateDramaEntry(id: string, updates: Partial<DramaEntry>) {
    const { data, error } = await supabase
      .from('drama_entries')
      .update(updates)
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    return data as DramaEntry;
  }
};

// Future Plans Services
export const futurePlansService = {
  async getFuturePlans(category?: string) {
    let query = supabase
      .from('future_plans')
      .select('*')
      .order('target_date', { ascending: true, nullsLast: true });
    
    if (category && category !== 'all') {
      query = query.eq('category', category);
    }
    
    const { data, error } = await query;
    if (error) throw error;
    return data as FuturePlan[];
  },

  async createFuturePlan(plan: Omit<FuturePlan, 'id' | 'created_at' | 'updated_at'>) {
    const { data, error } = await supabase
      .from('future_plans')
      .insert(plan)
      .select()
      .single();
    
    if (error) throw error;
    return data as FuturePlan;
  },

  async updateFuturePlan(id: string, updates: Partial<FuturePlan>) {
    const { data, error } = await supabase
      .from('future_plans')
      .update(updates)
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    return data as FuturePlan;
  },

  async updateProgress(id: string, progress: number) {
    return await this.updateFuturePlan(id, { progress });
  }
};

// Notes Services
export const notesService = {
  async getNotes(type?: string, author?: string) {
    let query = supabase
      .from('notes')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (type && type !== 'all') {
      query = query.eq('type', type);
    }
    
    if (author && author !== 'all') {
      query = query.eq('author', author);
    }
    
    const { data, error } = await query;
    if (error) throw error;
    return data as Note[];
  },

  async createNote(note: Omit<Note, 'id' | 'created_at' | 'updated_at'>) {
    const { data, error } = await supabase
      .from('notes')
      .insert(note)
      .select()
      .single();
    
    if (error) throw error;
    return data as Note;
  },

  async updateNote(id: string, updates: Partial<Note>) {
    const { data, error } = await supabase
      .from('notes')
      .update(updates)
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    return data as Note;
  },

  async deleteNote(id: string) {
    const { error } = await supabase
      .from('notes')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
  },

  async getScheduledNotes() {
    const { data, error } = await supabase
      .from('notes')
      .select('*')
      .not('scheduled_delivery', 'is', null)
      .lte('scheduled_delivery', new Date().toISOString())
      .order('scheduled_delivery');
    
    if (error) throw error;
    return data as Note[];
  }
};

// Photo Services
export const photoService = {
  async getAlbums() {
    const { data, error } = await supabase
      .from('photo_albums')
      .select('*')
      .order('updated_at', { ascending: false });
    
    if (error) throw error;
    return data;
  },

  async createAlbum(album: { title: string; description?: string; category?: string }) {
    const { data, error } = await supabase
      .from('photo_albums')
      .insert(album)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  async getPhotosInAlbum(albumId: string) {
    const { data, error } = await supabase
      .from('photos')
      .select('*')
      .eq('album_id', albumId)
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data;
  },

  async uploadPhoto(photo: {
    album_id: string;
    filename: string;
    url: string;
    caption?: string;
    date_taken?: string;
    location?: string;
    tags?: string[];
  }) {
    const { data, error } = await supabase
      .from('photos')
      .insert(photo)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  }
};

// Anniversary Services
export const anniversaryService = {
  async getAnniversaryEvents() {
    const { data, error } = await supabase
      .from('anniversary_events')
      .select('*')
      .order('date', { ascending: true });
    
    if (error) throw error;
    return data;
  },

  async createAnniversaryEvent(event: {
    title: string;
    date: string;
    description?: string;
    type: string;
    celebration_ideas?: string[];
  }) {
    const { data, error } = await supabase
      .from('anniversary_events')
      .insert(event)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  async markAsCelebrated(id: string) {
    const { data, error } = await supabase
      .from('anniversary_events')
      .update({ celebrated: true })
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  }
};